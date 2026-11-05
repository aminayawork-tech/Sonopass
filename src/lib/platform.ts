import { Capacitor } from '@capacitor/core';

// Public website. Links in emails (confirm, reset password) and share links always point here,
// because inside the store app the page origin is capacitor://localhost / https://localhost.
export const WEB_ORIGIN = 'https://sonopass.com';

// Custom URL scheme registered in ios/App/App/Info.plist and android/app/src/main/AndroidManifest.xml.
// Google / Apple sign-in returns here so the app can finish signing in.
export const APP_AUTH_CALLBACK = 'com.sonopass.app://auth/callback';

export function isNativeApp(): boolean {
  return typeof window !== 'undefined' && Capacitor.isNativePlatform();
}

export function webOrigin(): string {
  return isNativeApp() ? WEB_ORIGIN : window.location.origin;
}

// Store apps hide prices and purchase buttons until in-app purchases are connected
// (Apple and Google require their own billing for digital upgrades).
export function purchasesEnabled(): boolean {
  return !isNativeApp();
}
