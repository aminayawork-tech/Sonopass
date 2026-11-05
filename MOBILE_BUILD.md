# Building SonoPass for the App Store and Google Play

The iOS and Android apps are built with [Capacitor](https://capacitorjs.com). They bundle the same
code as sonopass.com, so every change to the website ships to the apps with the next store update.

- App ID (both stores): `com.sonopass.app`
- App name: SonoPass
- iOS: iPhone only, iOS 15+, portrait
- Android: Android 7 (API 24)+, portrait

---

## One-time setup on your Mac

1. Install **Xcode** from the Mac App Store, open it once and accept the license.
2. Install **Android Studio** from https://developer.android.com/studio and open it once (it downloads the Android SDK).
3. Install **Node.js 22** from https://nodejs.org (the LTS installer).
4. Get the code:
   ```bash
   git clone https://github.com/aminayawork-tech/Sonopass.git
   cd Sonopass
   npm install
   ```
5. In the `Sonopass` folder, create a file named `.env.local` with the same two values you added in Vercel:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR-ANON-KEY
   ```
   (This file is never uploaded to GitHub.)

## One-time setup in Supabase

1. **SQL Editor → New query**: paste and run `supabase/migrations/20261106000000_delete_account.sql`
   (adds “Delete account”, which Apple and Google require).
2. **Authentication → URL Configuration → Redirect URLs**: add
   ```
   com.sonopass.app://**
   ```
   This lets “Continue with Google / Apple” return to the app.

---

## Every time you build

```bash
git pull
npm install
npm run build:mobile
```

`build:mobile` builds the app and copies it into the `ios` and `android` projects.

Before each store upload, raise the version:
- **iOS**: Xcode → App target → General → *Version* (e.g. 1.0.1) and *Build* (1, 2, 3…).
- **Android**: `android/app/build.gradle` → `versionCode` (must go up by 1 each upload) and `versionName`.

---

## iOS → App Store

1. In App Store Connect (https://appstoreconnect.apple.com) → **Apps → +** → New App:
   iOS, name **SonoPass**, bundle ID **com.sonopass.app** (register it first under
   Certificates, Identifiers & Profiles → Identifiers if it isn’t in the list), SKU `sonopass`.
2. Open the project: `npm run ios` (or open `ios/App/App.xcodeproj` in Xcode).
3. Click **App** in the left sidebar → **Signing & Capabilities** → tick *Automatically manage signing*
   → choose your **Team**.
4. Optional, for Sign in with Apple inside the app later: **+ Capability → Sign in with Apple**.
5. At the top, choose the device **Any iOS Device (arm64)**.
6. Menu **Product → Archive**. When it finishes, the Organizer opens.
7. **Distribute App → App Store Connect → Upload**, accept the defaults.
8. After ~10–30 minutes the build appears in App Store Connect under **TestFlight**; install it on your
   phone with the TestFlight app to try it, then add it to a version and **Submit for Review**.

## Android → Google Play

1. In Play Console (https://play.google.com/console) → **Create app**: name SonoPass, app, free.
2. Open the project: `npm run android` (or open the `android` folder in Android Studio). Wait for
   “Gradle sync” to finish.
3. Menu **Build → Generate Signed App Bundle or APK → Android App Bundle → Next**.
4. **Create new…** key store. Save the `.jks` file and both passwords somewhere safe (password manager
   + backup). You need the same key for every future update.
5. Choose **release** → **Create**. The file is at `android/app/release/app-release.aab`.
6. In Play Console → **Testing → Internal testing → Create new release** → upload the `.aab`
   (accept *Play App Signing*). Add yourself as a tester and install from the link to try it.
7. When ready, promote the release to **Production** and complete the store listing.

New personal Play developer accounts must run a closed test with at least 12 testers for 14 days
before they can publish to production.

---

## What the store apps do differently from the website

- Prices and purchase buttons are hidden (the plan step in onboarding, the subscription page and the
  menu item). Both stores require their own in-app purchase system for digital upgrades; turn the
  buttons back on once purchases are connected (`purchasesEnabled()` in `src/lib/platform.ts`).
- Google / Apple sign-in opens the system browser and returns to the app via `com.sonopass.app://`.
- Email links (confirm email, reset password) open sonopass.com.

## Testing without a store upload

Every push to GitHub runs **Actions → Mobile build check**, which builds both apps. The Android
run produces **sonopass-android-test-apk** under *Artifacts*: unzip it and install `app-debug.apk` on an
Android phone (allow “install unknown apps”). Add `NEXT_PUBLIC_SUPABASE_URL` and
`NEXT_PUBLIC_SUPABASE_ANON_KEY` as repository secrets (Settings → Secrets and variables → Actions)
so the test build can sign in.

## Updating the icon or splash screen

Replace the images in `assets/` (`icon-only.png` 1024×1024, `splash.png` 2732×2732) and run:
```bash
npm run mobile:assets
```
