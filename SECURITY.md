# 🔒 Firebase Security Setup

## ⚠️ CRITICAL: Your API Key Was Exposed

Your Google API key was **publicly visible** in `public/firebase.js` and committed to GitHub. Google has already notified you.

## ✅ What I've Done (Code-Level)

1. ✔️ Removed hardcoded API key from `public/firebase.js`
2. ✔️ Created `public/config.js` (local, git-ignored) to hold credentials
3. ✔️ Created `public/config.example.js` as a template for new developers
4. ✔️ Updated `.gitignore` to prevent future commits of sensitive config

## 🚨 IMMEDIATE ACTIONS YOU MUST TAKE

### 1. **Regenerate Your API Key** (URGENT)
Go to [Google Cloud Console](https://console.cloud.google.com/):
   - Project: `byc-website-3ee13`
   - Navigate to **APIs & Services** → **Credentials**
   - Find the key `AIzaSyBPdyPCIlRQjw2MjSPinQYhV8shfypSHCM`
   - Click it, then **Regenerate Key** (this invalidates the old one)
   - Copy the **new key** and update `public/config.js`

### 2. **Restrict Your New API Key**
In the Cloud Console, edit the new key and:
   - **Application restrictions**: Select **Web applications (HTTP referrers)**
   - Add your domain(s): `localhost:*, yourdomain.com`
   - **API restrictions**: Select **Firebase**
   - Save

### 3. **Force Push the Security Fix to GitHub**
```bash
# Remove the exposed key from git history
git rm --cached public/config.js 2>/dev/null || true
git add -A
git commit -m "security: remove exposed Firebase API key, use local config"
git push origin main --force-with-lease
```

### 4. **Notify Your Team**
Share the new API key with team members via a secure channel (NOT via email/chat):
   - They should copy `config.example.js` → `config.js`
   - Replace placeholders with the new credentials

## 📁 File Structure
```
public/
  ├── config.example.js       ← Template (committed to git)
  ├── config.js               ← Local credentials (NOT committed, git-ignored)
  └── firebase.js             ← References config.js
```

## ⚡ For Developers
To set up locally:
```bash
# Copy the example config
cp public/config.example.js public/config.js

# Edit config.js with your Firebase credentials
# DO NOT commit config.js
```

## 🎯 Why This Matters
- **Browser apps require public API keys** – this is by design in Firebase
- **But it still needs protection** – restrict the key to your domains and Firebase services only
- **Never commit credentials to version control** – even "public" keys should be rotated if exposed

---

**Status**: Code updated ✓ | **Next**: Regenerate key in Google Cloud Console + restrict it
