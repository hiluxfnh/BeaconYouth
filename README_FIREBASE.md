# Firebase Hosting & Forms (BYC Website)

This site uses Firebase (v12 modular SDK via CDN) and Firestore to collect "Get Involved" submissions in real time.

## How it works

- `firebase.js` initializes Firebase and exports `submitInquiry(data)` which writes to the `inquiries` collection.
- `get-involved.html` contains a form that posts to Firestore and displays success/error alerts to the user.
- We review submissions weekly and reply by email.

## Deploying to Firebase Hosting

1. Install the Firebase CLI (one time):

```powershell
npm install -g firebase-tools
```

2. Sign in to Google:

```powershell
firebase login
```

3. Initialize the project in this folder (creates default files if needed):

```powershell
firebase init hosting
```

Choose:

- Use an existing project ➜ select `byc-website-3ee13`
- What do you want to use as your public directory? ➜ `public`
- Configure as a single-page app? ➜ `No`
- Set up automatic builds and deploys with GitHub? ➜ optional

4. Ensure `firebase.json` includes your site id:

```json
{
  "hosting": {
    "site": "beaconyouth",
    "public": "public"
  }
}
```

5. Copy your website files into `public/` before deploying (or change `public` path):

```powershell
mkdir public -Force
Copy-Item *.html,*.css,*.js assets -Destination public -Recurse -Force
```

6. Deploy:

```powershell
firebase deploy --only hosting:beaconyouth
```

Your site will be at: https://beaconyouth.web.app

## Firestore Rules (basic)

In Firebase Console ➜ Firestore ➜ Rules, for simple prototype:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /inquiries/{doc} {
      allow read, write: if true; // Prototype only. Replace with auth/validation.
    }
  }
}
```

For production, tighten these rules and add validation/auth.
