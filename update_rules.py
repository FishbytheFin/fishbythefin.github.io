#!/usr/bin/env python3
"""Sync the Firestore purchase allowlist with gifts.json (no dependencies)."""

import json
from pathlib import Path
import re
import sys


def main():
    root = Path(__file__).resolve().parent
    gifts = json.loads((root / "gifts.json").read_text())
    if not isinstance(gifts, list):
        raise ValueError("gifts.json must contain an array of gifts")

    ids = []
    for gift in gifts:
        gift_id = gift.get("id") if isinstance(gift, dict) else None
        if not isinstance(gift_id, str) or not re.fullmatch(r"[a-z0-9-]+", gift_id):
            raise ValueError(f"Invalid gift ID: {gift_id!r}; use lowercase letters, numbers, and hyphens")
        if gift_id in ids:
            raise ValueError(f"Duplicate gift ID: {gift_id!r}")
        ids.append(gift_id)

    rules_path = root / "firestore.rules"
    rules = rules_path.read_text()
    pattern = r"(allow\s+create\s*:\s*if\s+giftId\s+in\s*)\[[^\]]*\]"
    if len(re.findall(pattern, rules)) != 1:
        raise ValueError("Expected exactly one 'allow create: if giftId in [...]' clause")
    allowlist = "[" + ", ".join(repr(gift_id) for gift_id in ids) + "]"
    updated = re.sub(pattern, lambda match: match.group(1) + allowlist, rules)
    if updated != rules:
        rules_path.write_text(updated)
        print(f"Updated firestore.rules with {len(ids)} gift IDs.")
    else:
        print("firestore.rules is already up to date.")
    print("Publish firestore.rules in Firebase Console → Firestore Database → Rules.")


if __name__ == "__main__":
    try:
        main()
    except (OSError, ValueError) as error:
        sys.exit(f"Error: {error}")
