"""
Deploy GetFund contract to Algorand Testnet.
Uses the compiled TEAL from Artifacts/GetFund.arc56.json.
Prints APP_ID and APP_ADDRESS, then writes them to project .env.
"""
import base64
import json
import os
import sys
import pathlib

import algosdk
from algosdk.v2client import algod as algod_client
from algosdk import transaction, account

# ── Configuration ────────────────────────────────────────────────────────────

ALGOD_URL  = "https://testnet-api.algonode.cloud"
ALGOD_PORT = ""
ALGOD_TOKEN = ""

# Path to the ARC56 artifact
SCRIPT_DIR = pathlib.Path(__file__).parent
ARC56_PATH = SCRIPT_DIR / "Artifacts" / "GetFund.arc56.json"
ENV_PATH   = SCRIPT_DIR.parent.parent / ".env"  # project root .env


def load_programs():
    """Load approval and clear programs from ARC56 JSON."""
    with open(ARC56_PATH, "r") as f:
        arc56 = json.load(f)
    approval_b64 = arc56["byteCode"]["approval"]
    clear_b64    = arc56["byteCode"]["clear"]
    return base64.b64decode(approval_b64), base64.b64decode(clear_b64)


def wait_for_confirmation(client, txid):
    last_round = client.status()["last-round"]
    while True:
        tx_info = client.pending_transaction_info(txid)
        if tx_info.get("confirmed-round", 0) > 0:
            return tx_info
        client.status_after_block(last_round + 1)
        last_round += 1


def deploy(deployer_mnemonic: str):
    private_key = algosdk.mnemonic.to_private_key(deployer_mnemonic)
    sender = account.address_from_private_key(private_key)
    print(f"Deployer address: {sender}")

    client = algod_client.AlgodClient(ALGOD_TOKEN, ALGOD_URL)
    params  = client.suggested_params()

    approval_program, clear_program = load_programs()

    # Schema from ARC56: global ints=2, bytes=2; local ints=0, bytes=0
    global_schema = transaction.StateSchema(num_uints=2, num_byte_slices=2)
    local_schema  = transaction.StateSchema(num_uints=0, num_byte_slices=0)

    txn = transaction.ApplicationCreateTxn(
        sender=sender,
        sp=params,
        on_complete=transaction.OnComplete.NoOpOC,
        approval_program=approval_program,
        clear_program=clear_program,
        global_schema=global_schema,
        local_schema=local_schema,
    )

    signed_txn = txn.sign(private_key)
    txid = client.send_transaction(signed_txn)
    print(f"Deploy txid: {txid}")

    tx_info = wait_for_confirmation(client, txid)
    app_id  = tx_info["application-index"]
    app_address = algosdk.logic.get_application_address(app_id)

    print(f"\n✅ Contract deployed successfully!")
    print(f"   APP_ID      = {app_id}")
    print(f"   APP_ADDRESS = {app_address}")

    # Update project .env
    update_env(app_id, app_address)
    return app_id, app_address


def update_env(app_id: int, app_address: str):
    env_path = ENV_PATH
    if env_path.exists():
        content = env_path.read_text()
    else:
        content = ""

    lines = content.splitlines()
    new_lines = []
    found_id  = False
    found_addr = False

    for line in lines:
        if line.startswith("NEXT_PUBLIC_APP_ID="):
            new_lines.append(f"NEXT_PUBLIC_APP_ID={app_id}")
            found_id = True
        elif line.startswith("NEXT_PUBLIC_APP_ADDRESS="):
            new_lines.append(f"NEXT_PUBLIC_APP_ADDRESS={app_address}")
            found_addr = True
        else:
            new_lines.append(line)

    if not found_id:
        new_lines.append(f"NEXT_PUBLIC_APP_ID={app_id}")
    if not found_addr:
        new_lines.append(f"NEXT_PUBLIC_APP_ADDRESS={app_address}")

    env_path.write_text("\n".join(new_lines) + "\n")
    print(f"\n✅ Updated {env_path}")


if __name__ == "__main__":
    mnemonic = os.environ.get("DEPLOYER_MNEMONIC", "").strip()

    if not mnemonic:
        print("Enter your Algorand testnet account mnemonic (25 words):")
        print("(This is only used locally to sign the deploy transaction)")
        mnemonic = input("> ").strip()

    if not mnemonic:
        print("ERROR: No mnemonic provided. Exiting.")
        sys.exit(1)

    deploy(mnemonic)
