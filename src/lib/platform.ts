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

// Which store handles purchases on this device: 'ios', 'android', or null on the website
export function storePlatform(): 'ios' | 'android' | null {
  if (!isNativeApp()) return null;
  const p = Capacitor.getPlatform();
  return p === 'ios' || p === 'android' ? p : null;
}
