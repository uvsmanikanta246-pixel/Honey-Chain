// ==========================================================================
// HoneyChain - Authentication Service (Firebase Auth + Firestore Users)
// ==========================================================================

class AuthService {
  constructor() {
    this.recaptchaVerifier = null;
    this.confirmationResult = null;
    this.currentUser = null;
    this.currentProfile = null;
    this.listeners = [];
  }

  get auth() {
    return window.firebaseManager?.auth || (typeof firebase !== "undefined" && firebase.auth ? firebase.auth() : null);
  }

  get db() {
    return window.firebaseManager?.db || (typeof firebase !== "undefined" && firebase.firestore ? firebase.firestore() : null);
  }

  // Subscribe to auth state changes
  onAuthStateChanged(callback) {
    this.listeners.push(callback);
    if (this.auth) {
      return this.auth.onAuthStateChanged(async (user) => {
        this.currentUser = user;
        if (user) {
          this.currentProfile = await this.getUserProfile(user.uid);
        } else {
          this.currentProfile = null;
        }
        callback(this.currentUser, this.currentProfile);
      });
    } else {
      // Fallback mock check
      const mockSaved = localStorage.getItem("honeychain_mock_user");
      if (mockSaved) {
        try {
          const parsed = JSON.parse(mockSaved);
          this.currentUser = parsed;
          this.currentProfile = parsed;
          callback(parsed, parsed);
        } catch (e) {
          callback(null, null);
        }
      } else {
        callback(null, null);
      }
      return () => {};
    }
  }

  notifyListeners() {
    this.listeners.forEach((cb) => cb(this.currentUser, this.currentProfile));
  }

  // Setup invisible or button recaptcha for phone auth
  initRecaptcha(containerId = "recaptcha-container") {
    if (!this.auth) return null;
    try {
      if (typeof firebase !== "undefined" && firebase.auth?.RecaptchaVerifier) {
        if (!this.recaptchaVerifier) {
          this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(containerId, {
            size: "invisible",
            callback: () => {
              console.log("Recaptcha verified");
            }
          });
          this.recaptchaVerifier.render();
        }
        return this.recaptchaVerifier;
      }
    } catch (error) {
      console.warn("Recaptcha init notice:", error.message);
    }
    return null;
  }

  // 1. Send OTP to Phone Number (Beekeeper)
  async sendPhoneOTP(phoneNumber, containerId = "recaptcha-container") {
    // Format phone to E.164 (+91 for India if not prefixed)
    let formattedPhone = phoneNumber.trim().replace(/\s+/g, "");
    if (!formattedPhone.startsWith("+")) {
      formattedPhone = `+91${formattedPhone.replace(/^0+/, "")}`;
    }

    if (this.auth && window.firebaseManager?.isLiveConnected) {
      try {
        const appVerifier = this.initRecaptcha(containerId) || this.recaptchaVerifier;
        this.confirmationResult = await this.auth.signInWithPhoneNumber(formattedPhone, appVerifier);
        return { success: true, isMock: false, message: `OTP sent to ${formattedPhone}` };
      } catch (error) {
        console.error("Firebase phone OTP error:", error);
        // Fallback to simulated OTP if Firebase project phone auth is unconfigured
        return {
          success: true,
          isMock: true,
          simulatedOtp: "123456",
          message: `Simulated OTP 123456 sent to ${formattedPhone} (Live Firebase fallback).`
        };
      }
    } else {
      // Local/Demo Mode OTP
      return {
        success: true,
        isMock: true,
        simulatedOtp: "123456",
        message: `Simulated OTP 123456 generated for ${formattedPhone}.`
      };
    }
  }

  // 2. Verify OTP Code
  async verifyPhoneOTP(otpCode, profileData = {}) {
    let uid = "";
    let phone = profileData.phone || "+919876543210";

    if (this.confirmationResult && !this.confirmationResult.isMock) {
      try {
        const userCredential = await this.confirmationResult.confirm(otpCode);
        this.currentUser = userCredential.user;
        uid = userCredential.user.uid;
      } catch (error) {
        throw new Error("Invalid verification code. Please check and try again.");
      }
    } else {
      // Demo verification
      uid = `usr_${profileData.phone ? profileData.phone.slice(-6) : Date.now().toString().slice(-6)}`;
      this.currentUser = {
        uid,
        phoneNumber: phone,
        displayName: profileData.name || "Verified Beekeeper"
      };
    }

    // Upsert user and beekeeper records in Firestore / LocalStorage
    const profile = await this.saveUserProfile(uid, {
      userId: uid,
      name: profileData.name || "Verified Beekeeper",
      phone: phone,
      farmLocation: profileData.farmLocation || "Apiary Location",
      role: profileData.role || "beekeeper",
      aadhaarMasked: profileData.aadhaar ? `XXXX-XXXX-${profileData.aadhaar.slice(-4)}` : "Verified",
      createdAt: new Date().toISOString()
    });

    this.currentProfile = profile;
    this.notifyListeners();
    return profile;
  }

  // 3. Admin Login (Email/Password or master pass)
  async adminLogin(email, password) {
    if (this.auth && window.firebaseManager?.isLiveConnected) {
      try {
        const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
        this.currentUser = userCredential.user;
        this.currentProfile = await this.getUserProfile(this.currentUser.uid);
        if (!this.currentProfile || this.currentProfile.role !== "admin") {
          // ensure admin role
          this.currentProfile = {
            userId: this.currentUser.uid,
            name: "HoneyChain Administrator",
            email: email,
            role: "admin"
          };
        }
        this.notifyListeners();
        return this.currentProfile;
      } catch (error) {
        console.warn("Live admin login failed, checking master access:", error.message);
      }
    }

    // Default Master Admin fallback for development & offline evaluation
    if ((email === "admin@honeychain.org" || email === "admin") && (password === "admin123" || password === "honeychain2026")) {
      const adminUser = {
        uid: "admin_master_001",
        email: "admin@honeychain.org",
        displayName: "System Administrator",
        role: "admin",
        createdAt: new Date().toISOString()
      };
      this.currentUser = adminUser;
      this.currentProfile = adminUser;
      localStorage.setItem("honeychain_mock_user", JSON.stringify(adminUser));
      this.notifyListeners();
      return adminUser;
    }

    throw new Error("Invalid administrator credentials. (Default demo: admin@honeychain.org / admin123)");
  }

  // 4. Save User Profile to Firestore & Cache
  async saveUserProfile(userId, data) {
    const record = {
      userId,
      ...data,
      updatedAt: new Date().toISOString()
    };

    if (this.db) {
      try {
        await this.db.collection("users").doc(userId).set(record, { merge: true });
        if (data.role === "beekeeper") {
          const beekeeperId = data.beekeeperId || `BK-${userId.slice(-4)}`;
          await this.db.collection("beekeepers").doc(beekeeperId).set({
            beekeeperId,
            userId,
            name: data.name,
            phone: data.phone,
            farmLocation: data.farmLocation,
            certification: data.certification || "FSSAI Natural Honey",
            aadhaarMasked: data.aadhaarMasked || "Verified",
            createdAt: data.createdAt || new Date().toISOString()
          }, { merge: true });
          record.beekeeperId = beekeeperId;
        }
      } catch (e) {
        console.warn("Firestore save user profile fallback to local cache:", e);
      }
    }

    localStorage.setItem("honeychain_mock_user", JSON.stringify(record));
    return record;
  }

  // 5. Fetch User Profile
  async getUserProfile(userId) {
    if (this.db) {
      try {
        const doc = await this.db.collection("users").doc(userId).get();
        if (doc.exists) {
          return doc.data();
        }
      } catch (e) {
        console.warn("Firestore getUserProfile fallback:", e);
      }
    }

    const mock = localStorage.getItem("honeychain_mock_user");
    return mock ? JSON.parse(mock) : null;
  }

  // 6. Sign Out
  async logout() {
    if (this.auth) {
      try {
        await this.auth.signOut();
      } catch (e) {}
    }
    this.currentUser = null;
    this.currentProfile = null;
    localStorage.removeItem("honeychain_mock_user");
    this.notifyListeners();
    return true;
  }
}

const authService = new AuthService();
window.authService = authService;
