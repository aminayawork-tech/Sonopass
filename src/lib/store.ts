// In-app purchases through Apple (StoreKit 2) and Google Play Billing, with no third-party service.
// Prices come from App Store Connect / Play Console, already localized for each user.
import { isNativeApp } from '@/lib/platform';

export type PaidPlan = 'monthly' | 'lifetime';

// Must match the product IDs created in App Store Connect and Play Console (see MOBILE_BUILD.md)
export const PRODUCT_IDS: Record<PaidPlan, string> = {
  monthly: 'sonopass_pro_monthly',   // auto-renewable subscription
  lifetime: 'sonopass_pro_lifetime', // non-consumable (one-time purchase)
};
const ANDROID_MONTHLY_BASE_PLAN = 'monthly';

// Shown on the web and until the store answers
export const FALLBACK_PRICES: Record<PaidPlan, string> = { monthly: '$9.99', lifetime: '$49.99' };

const CACHE_KEY = 'sonopass_store_pro';

async function plugin() {
  const mod = await import('@capgo/native-purchases');
  return mod;
}

function isAndroid() {
  return typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent);
}

export function storeAvailable(): boolean {
  return isNativeApp();
}

export function cachedStorePro(): boolean {
  try {
    return localStorage.getItem(CACHE_KEY) === '1';
  } catch {
    return false;
  }
}

function cacheStorePro(pro: boolean) {
  try {
    if (pro) localStorage.setItem(CACHE_KEY, '1');
    else localStorage.removeItem(CACHE_KEY);
  } catch {
    // ignore
  }
}

export async function getStorePrices(): Promise<Partial<Record<PaidPlan, string>>> {
  if (!storeAvailable()) return {};
  try {
    const { NativePurchases, PURCHASE_TYPE } = await plugin();
    const [subs, inapp] = await Promise.all([
      NativePurchases.getProducts({ productIdentifiers: [PRODUCT_IDS.monthly], productType: PURCHASE_TYPE.SUBS }),
      NativePurchases.getProducts({ productIdentifiers: [PRODUCT_IDS.lifetime], productType: PURCHASE_TYPE.INAPP }),
    ]);
    const prices: Partial<Record<PaidPlan, string>> = {};
    const monthly = subs.products.find((p) => p.identifier === PRODUCT_IDS.monthly);
    const lifetime = inapp.products.find((p) => p.identifier === PRODUCT_IDS.lifetime);
    if (monthly) prices.monthly = monthly.priceString;
    if (lifetime) prices.lifetime = lifetime.priceString;
    return prices;
  } catch {
    return {};
  }
}

// Which plan this Apple ID / Google account currently owns, if any
export async function getStorePlan(): Promise<PaidPlan | null> {
  if (!storeAvailable()) return null;
  try {
    const { NativePurchases } = await plugin();
    const { purchases } = await NativePurchases.getPurchases({ onlyCurrentEntitlements: true });
    const valid = purchases.filter((t) => !t.revocationDate && (!isAndroid() || t.purchaseState === '1'));
    const has = (id: string) => valid.some((t) => t.productIdentifier === id);
    const monthlyActive = valid.some(
      (t) => t.productIdentifier === PRODUCT_IDS.monthly && (isAndroid() || t.isActive !== false),
    );
    const plan: PaidPlan | null = has(PRODUCT_IDS.lifetime) ? 'lifetime' : monthlyActive ? 'monthly' : null;
    cacheStorePro(plan !== null);
    return plan;
  } catch {
    // Offline or store unavailable: keep what we knew last time
    return cachedStorePro() ? 'lifetime' : null;
  }
}

export type BuyResult = { ok: true } | { ok: false; cancelled: boolean; message: string };

export async function buy(plan: PaidPlan): Promise<BuyResult> {
  if (!storeAvailable()) {
    return { ok: false, cancelled: false, message: 'Pro is available in the SonoPass app for iPhone and Android.' };
  }
  try {
    const { NativePurchases, PURCHASE_TYPE } = await plugin();
    await NativePurchases.purchaseProduct({
      productIdentifier: PRODUCT_IDS[plan],
      productType: plan === 'monthly' ? PURCHASE_TYPE.SUBS : PURCHASE_TYPE.INAPP,
      ...(plan === 'monthly' && isAndroid() ? { planIdentifier: ANDROID_MONTHLY_BASE_PLAN } : {}),
      quantity: 1,
    });
    const owned = await getStorePlan();
    if (!owned) return { ok: false, cancelled: false, message: 'The purchase is pending. Pro unlocks as soon as it completes.' };
    return { ok: true };
  } catch (err) {
    const message = (err as Error)?.message ?? 'Purchase failed';
    const cancelled = /cancel/i.test(message);
    return { ok: false, cancelled, message: cancelled ? 'Purchase cancelled.' : message };
  }
}

export async function restore(): Promise<PaidPlan | null> {
  if (!storeAvailable()) return null;
  try {
    const { NativePurchases } = await plugin();
    await NativePurchases.restorePurchases();
  } catch {
    // fall through to a fresh check
  }
  return getStorePlan();
}

export async function manageSubscriptions() {
  if (!storeAvailable()) return;
  const { NativePurchases } = await plugin();
  await NativePurchases.manageSubscriptions();
}
