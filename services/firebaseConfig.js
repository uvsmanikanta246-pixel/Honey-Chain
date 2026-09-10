// ==========================================================================
// HoneyChain - Firebase Configuration & Initialization
// Supports both Production Firebase & Local Mock/Development Fallbacks
// ==========================================================================

const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyDemoPlaceholderHoneyChainKey2026",
  authDomain: "honey-chain-production.firebaseapp.com",
  projectId: "honey-chain-production",
  storageBucket: "honey-chain-production.appspot.com",
  messagingSenderId: "109823456789",
  appId: "1:109823456789:web:abcdef1234567890"
};

class FirebaseManager {
  constructor() {
    this.app = null;
    this.auth = null;
    this.db = null;
    this.storage = null;
    this.functions = null;
    this.isInitialized = false;
    this.isLiveConnected = false;
    this.config = this.loadSavedConfig() || DEFAULT_FIREBASE_CONFIG;
  }

  loadSavedConfig() {
    try {
      const saved = localStorage.getItem("honeychain_firebase_config");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Could not load stored Firebase config", e);
    }
    return null;
  }

  saveConfig(newConfig) {
    try {
      this.config = { ...this.config, ...newConfig };
      localStorage.setItem("honeychain_firebase_config", JSON.stringify(this.config));
      return this.initialize(true);
    } catch (e) {
      console.error("Failed to save Firebase config", e);
      return false;
    }
  }

  initialize(forceReinit = false) {
    if (this.isInitialized && !forceReinit) return true;

    try {
      // Check if Firebase Compat SDKs are available in global window
      if (typeof firebase !== "undefined" && firebase.initializeApp) {
        if (firebase.apps && firebase.apps.length > 0) {
          this.app = firebase.apps[0];
        } else {
          this.app = firebase.initializeApp(this.config);
        }

        if (firebase.auth) {
          this.auth = firebase.auth();
          // Set persistence to LOCAL
          this.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch(() => {});
        }
        if (firebase.firestore) {
          this.db = firebase.firestore();
        }
        if (firebase.storage) {
          this.storage = firebase.storage();
        }
        if (firebase.functions) {
          this.functions = firebase.functions();
        }

        this.isInitialized = true;
        this.isLiveConnected = !this.config.apiKey.includes("Placeholder");
        console.log("🔥 HoneyChain Firebase initialized successfully.", {
          isLiveConnected: this.isLiveConnected,
          projectId: this.config.projectId
        });
        return true;
      } else {
        console.info("ℹ️ Firebase SDK not detected on window, operating in local mock storage mode.");
        this.isInitialized = true;
        this.isLiveConnected = false;
        return true;
      }
    } catch (error) {
      console.warn("⚠️ Firebase live initialization notice (using offline fallback if needed):", error.message);
      this.isInitialized = true;
      this.isLiveConnected = false;
      return false;
    }
  }
}

// Export singleton instance
const firebaseManager = new FirebaseManager();
if (typeof window !== "undefined") {
  window.firebaseManager = firebaseManager;
  // Initialize once DOM is ready or immediately
  document.addEventListener("DOMContentLoaded", () => firebaseManager.initialize());
}
