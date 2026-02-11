import { FirebaseApp } from "firebase/app";
import {
    initializeAppCheck,
    ReCaptchaV3Provider,
    AppCheck,
} from "firebase/app-check";

/**
 * Initialize Firebase App Check with ReCaptchaV3Provider.
 * Automatically enables the debug provider on localhost.
 *
 * Call this once per Firebase app, after initializeApp().
 */
export function initAppCheck(app: FirebaseApp): AppCheck | null {
    if (typeof window === "undefined") return null;

    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_V3_SITE_KEY;
    if (!siteKey) {
        console.warn("[App Check] Missing NEXT_PUBLIC_RECAPTCHA_V3_SITE_KEY — skipping initialization.");
        return null;
    }

    // Enable debug token on localhost so dev requests aren't blocked.
    // The token will be logged to the console — register it in Firebase Console.
    if (window.location.hostname === "localhost") {
        (self as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
    }

    try {
        return initializeAppCheck(app, {
            provider: new ReCaptchaV3Provider(siteKey),
            isTokenAutoRefreshEnabled: true,
        });
    } catch (error) {
        console.error("[App Check] Failed to initialize:", error);
        return null;
    }
}
