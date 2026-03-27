# Firebase Notes

The site is deployed directly from the existing `public/` directory. There is no build step.

## Key files

- `public/firebase.js` - Firebase app config and shared Firestore/Auth helpers
- `firestore.rules` - validation for public forms plus admin-only reads
- `firebase.json` - Hosting target and emulator ports
- `.github/workflows/firebase-hosting.yml` - GitHub Actions deploy workflow

## Local testing

```powershell
firebase login
firebase emulators:start --only hosting,firestore
```

Then open:

```text
http://127.0.0.1:5000/?useEmulators=1
```

The `useEmulators=1` query string tells the browser app to send Firestore writes to the local emulator instead of production.

## Deployment

```powershell
firebase deploy --only hosting:beaconyouth
firebase deploy --only hosting:beaconyouth,firestore:rules
```

## Forms and admin

- `public/get-involved.html` writes to `inquiries`
- `public/contact.html` writes to `contacts`
- Footer newsletter signup writes to `subscribers`
- `public/admin.html` reads those collections for allowlisted Google accounts only
