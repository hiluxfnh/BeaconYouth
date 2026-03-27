# Firebase Security

This site is a browser-based Firebase app. The Firebase web config in `public/firebase.js` is public by design and will be shipped to every visitor. Security does not come from hiding those values in the repo.

## What actually matters

1. Restrict the Firebase API key to the right HTTP referrers and Firebase APIs.
2. Keep Firestore rules tight and deploy them with code changes.
3. Limit admin access to approved Google accounts in both client logic and Firestore rules.
4. Rotate any previously exposed API key that may still be active.

## One-time checks

In Google Cloud Console for project `byc-website-3ee13`:

- Regenerate any API key that was previously committed publicly.
- Set application restrictions to `Web applications (HTTP referrers)`.
- Allow only the expected local/dev/prod domains.
- Restrict the key to the Firebase APIs this site needs.

## Repo expectations

- `public/firebase.js` contains the public Firebase web config used by the site.
- `firestore.rules` should be deployed whenever form or admin behavior changes.
- The deploy workflow in `.github/workflows/firebase-hosting.yml` ships the existing `public/` directory as-is.

## Local verification

Use the emulator flow from `README.md` when testing forms locally so you do not write test submissions into production.
