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
   git clone --branch main --single-branch https://github.com/aminayawork-tech/Sonopass.git
   cd Sonopass
   npm ci
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
cd ~/Sonopass
git fetch origin main
git reset --hard origin/main   # match GitHub exactly (your .env.local is kept)
npm ci                         # install exactly what package-lock.json lists, without changing it
npm run build:mobile
```

`build:mobile` builds the app and copies it into the `ios` and `android` projects. Check the end of
its output: it should list 4 Capacitor plugins (including `@capgo/native-purchases`) and finish with
`Sync finished`. If it stops with an error, Xcode would package the previous version.

`git reset --hard` also discards settings Xcode saved in the project (such as your Signing Team), so
pick your Team again in Xcode after each update. Use `npm ci`, not `npm install`: `npm install` can
rewrite `package-lock.json`, which then blocks the next update.

Before each store upload, raise the version:
- **iOS**: Xcode → App target → General → *Version* (e.g. 1.9, 1.10) and *Build*. Start Build at 1 for each new Version and go 2, 3… if you upload that Version again.
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

## In-app purchases (Apple and Google, no third-party service)

Free members get one Quick 10 a day on one registry; everything else needs Pro. Pro is sold through
Apple's and Google's own billing, and the app shows the price you set in each store, in the user's
own currency (`src/lib/store.ts`).

### App Store Connect
1. **Agreements, Tax, and Banking** → accept the *Paid Apps* agreement and add bank and tax info
   (purchases don't work until this is *Active*).
2. Your app → **Monetization → Subscriptions** → create a subscription group **SonoPass Pro** →
   **+** subscription:
   - Reference name `Pro Monthly`, Product ID **`sonopass_pro_monthly`**, duration **1 month**,
     price **$9.99**, add a display name and description, and a review screenshot of the offer screen.
3. Your app → **Monetization → In-App Purchases** → **+** → type **Non-Consumable**:
   - Reference name `Pro Lifetime`, Product ID **`sonopass_pro_lifetime`**, price **$49.99**, display
     name, description and review screenshot.
4. Your app → **Monetization → In-App Purchases** → **+** → type **Consumable**:
   - Reference name `Hearts Refill`, Product ID **`sonopass_hearts_refill`**, price **$0.99**
     (Apple's tier; $1.00 isn't available in the US), display name `Hearts Refill`, description
     `Refill your hearts to 5 and keep studying.`, and a review screenshot of the hearts screen.
5. In Xcode: App target → **Signing & Capabilities → + Capability → In-App Purchase**.
6. When you submit the app version, add all three products under **In-App Purchases and Subscriptions**
   on the version page so they're reviewed together.

To test before release: TestFlight builds use the sandbox automatically, so purchases are free
(Settings → App Store → Sandbox Account on the phone, if asked).

### Google Play Console
1. **Monetize → Subscriptions → Create subscription**: Product ID **`sonopass_pro_monthly`**, add a base
   plan with ID **`monthly`**, auto-renewing, 1 month, $9.99. Activate it.
2. **Monetize → In-app products → Create product**: Product ID **`sonopass_pro_lifetime`**, $49.99.
   Activate it.
3. **Monetize → In-app products → Create product**: Product ID **`sonopass_hearts_refill`**, $0.99.
   Activate it (the app consumes it after each purchase, so it can be bought again).
4. Products only appear after the app has been uploaded to a testing track at least once. Add your
   Google account under **Settings → License testing** to buy without being charged.

### How Pro is decided
- In the store apps: whatever the Apple ID / Google account has bought (checked at launch, when the
  app comes back to the foreground, and with **Restore purchases**).
- On the website: the `entitlements` table in Supabase (set a row's `plan` to `monthly` or `lifetime`
  by hand for anyone you want to give Pro on the web). App Store purchases are not copied to the
  website automatically yet.

## What the store apps do differently from the website

- Purchases happen only in the apps. On the website the buy button explains that Pro is available
  in the iPhone and Android app.
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
