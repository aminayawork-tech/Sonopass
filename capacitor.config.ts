import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sonopass.app',
  appName: 'SonoPass',
  // Static export produced by `npm run build:mobile`
  webDir: 'out',
  // Lets the web code know it is running inside the store app
  appendUserAgent: 'SonoPassApp',
  backgroundColor: '#F4F5F7',
  ios: {
    contentInset: 'never',
  },
  plugins: {
    // Dark status-bar icons: the app always uses a light background
    SystemBars: {
      style: 'LIGHT',
    },
    SplashScreen: {
      launchShowDuration: 600,
      launchAutoHide: true,
      backgroundColor: '#F4F5F7',
      showSpinner: false,
    },
  },
};

export default config;
