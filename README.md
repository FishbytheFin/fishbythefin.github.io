# Finn’s gift registry

A buildless GitHub Pages site at the repository root. Gift details live in `gifts.json`; shared purchase status lives in the `purchases` collection of the `finn-gift` default Firestore database. No npm installation, Firebase CLI, or sudo is required.

## Activate shared purchase status

1. Open the Firebase console, select **finn-gift**, and open **Firestore Database → Rules**.
2. For a project dedicated to this registry, replace the rules with `firestore.rules` and click **Publish**. If this database supports other apps, merge the `/purchases/{giftId}` block into your existing rules, and remove any overlapping blanket write permission for purchases.
3. Replace the three clearly labeled sample gifts in `gifts.json`. Each gift has a unique permanent `id`, `name`, `description`, optional display `price`, and optional absolute HTTP(S) `url`. Keep the allowed IDs in `firestore.rules` synchronized and republish rules whenever IDs change. Do not reuse a purchased gift's ID for a different gift.
4. Commit and push the files. In GitHub **Settings → Pages**, select deployment from your branch and the **/ (root)** folder if not already configured.

No collection needs to be manually created. The first successful purchase creates it. Visitors do not need accounts. Anyone with access to the public site can mark a listed gift as purchased; this is intended for a small trusted group. The rules permit one timestamp-only record for each listed gift and prevent visitor edits and deletes. They do not allow writes elsewhere. Do not store private information in purchase records, which are publicly readable.

To undo a mistaken purchase, delete `purchases/<gift-id>` in the Firebase console. A confirmation prompt helps prevent accidental clicks. Transactions prevent simultaneous claims from overwriting one another. Offline clients cannot confirm a purchase.

## Gift images

Add an optional `image` field to any gift in `gifts.json`:

```json
{
  "id": "pixel-wave",
  "name": "Pixel Wave Sweater",
  "description": "",
  "price": "83.97",
  "url": "https://vapor95.com/products/great-pixel-wave",
  "image": "images/pixel-wave.jpg",
  "imageAlt": "Pixel Wave sweater viewed from the front"
}
```

Use a relative path to an image committed in this repo (such as `images/pixel-wave.jpg`), or a direct HTTPS image URL. `imageAlt` is optional and defaults to the gift name. Use a direct image URL, not a product page URL.

All cards reserve a 220px-tall image container with the same width within each responsive grid layout. Images scale proportionally to fit without cropping or stretching. Missing or broken images show a placeholder. Adding images does not require updating Firestore rules.

## Update gift IDs in the rules

After editing `gifts.json`, run:

```sh
python3 update_rules.py
```

The script updates only the allowed gift IDs in `firestore.rules`, preserving the other rules. It rejects invalid or duplicate IDs before writing. It works from any directory when invoked using its path and needs no installed packages.

Then copy the updated `firestore.rules` into **Firebase Console → Firestore Database → Rules** and click **Publish**. Running the script or pushing to GitHub does not publish Firebase rules.

## Preview and verify

Run `python3 -m http.server 8000` from this directory and open http://localhost:8000. The preview uses the real Firebase database, so any purchase marks are real.

After publishing rules, open the site in two browser windows. Mark a sample gift purchased in one and check that both update. Trying the same gift concurrently should result in only one successful purchase. Delete the sample purchase in the Firebase console afterward. Check that attempts to edit/delete a purchase or create a purchase with an unlisted ID are denied in the Firebase Rules Playground.

SDK modules load directly from Firebase's CDN. Existing subdirectory sites are untouched.
