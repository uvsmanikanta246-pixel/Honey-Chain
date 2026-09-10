// ==========================================================================
// HoneyChain - Production React Application
// Multi-Role Blockchain Honey Provenance Ledger powered by Firebase
// Roles: Beekeeper, Distributor, Retailer, Customer, Admin
// ==========================================================================

const { useState, createContext, useContext, useEffect, useRef } = React;

// --- Translation Dictionary (English & Hindi) ---
const translations = {
  en: {
    // Nav & Common
    brand_title: "HoneyChain",
    nav_home: "Home",
    nav_my_batches: "My Batches",
    nav_register: "Register Beekeeper",
    nav_record_harvest: "Record Harvest",
    nav_verify_honey: "Verify Honey",
    nav_admin: "Admin Dashboard",
    nav_supply_chain: "Supply Chain",
    nav_logout: "Sign Out",

    // Roles
    role_beekeeper: "Beekeeper",
    role_distributor: "Distributor",
    role_retailer: "Retailer",
    role_customer: "Customer",
    role_admin: "Admin",

    // Landing
    landing_tagline: "Authentic Honey Provenance Ledger",
    landing_title: "Pure Honey Provenance",
    landing_desc: "Track raw, unadulterated honey directly from hive to jar with cryptographic SHA-256 verification.",
    landing_beekeeper_btn: "🐝 I'm a Beekeeper",
    landing_consumer_btn: "🔍 Verify Honey (No Login)",
    landing_distributor_btn: "🚚 Supply Chain Logistics",
    landing_admin_btn: "📊 Admin Portal",

    // Registration Wizard (Phone OTP)
    reg_step: "Step {current} of {total}",
    reg_q_name: "What is your full name?",
    reg_lbl_name: "Beekeeper Full Name",
    reg_ph_name: "e.g. Anand Kumar",
    reg_btn_to_phone: "Continue to Phone Number",
    reg_btn_cancel: "Cancel Registration",

    reg_q_phone: "Enter your mobile phone number",
    reg_lbl_phone: "10-Digit Mobile Number",
    reg_ph_phone: "e.g. 9876543210",
    reg_help_phone: "We will send a 6-digit OTP code to verify your phone on Firebase Auth.",
    reg_btn_to_aadhaar: "Continue to Identity",
    reg_btn_back: "Go Back",

    reg_q_aadhaar: "Enter your Aadhaar / Govt ID",
    reg_lbl_aadhaar: "12-Digit Aadhaar / ID Number",
    reg_ph_aadhaar: "e.g. 5432 1098 7654",
    reg_help_aadhaar: "Links your verified identity to your honey harvest ledger.",
    reg_btn_to_otp: "Send Phone OTP Code",

    reg_q_otp: "Enter 6-Digit Verification Code",
    reg_lbl_otp: "6-Digit Phone OTP",
    reg_ph_otp: "e.g. 123456",
    reg_help_otp: "Enter the SMS verification code received on your phone.",
    reg_btn_to_village: "Verify OTP & Continue",

    reg_q_village: "Where is your apiary located?",
    reg_lbl_village: "Apiary / Farm Village Location",
    reg_ph_village: "e.g. Sundarban Delta, Sector 4",
    reg_help_village: "This location will be permanently recorded in Firestore for your batches.",
    reg_btn_complete: "Complete Beekeeper Registration",

    reg_conf_badge: "Registration Complete",
    reg_conf_title: "You are verified on HoneyChain ✅",
    reg_conf_id_lbl: "Assigned Beekeeper ID",
    reg_conf_name: "Name",
    reg_conf_loc: "Apiary Location",
    reg_conf_id_link: "Linked Identity",
    reg_conf_btn_record: "Record First Honey Batch",
    reg_conf_btn_my_batches: "View My Batches",
    reg_conf_btn_home: "Return to Home",

    // Record Harvest Batch
    batch_step: "Step {current} of {total} • {name}",
    batch_q_date: "What was the harvest date?",
    batch_lbl_date: "Harvest Date",
    batch_btn_to_qty: "Continue to Quantity",
    batch_btn_cancel: "Cancel",

    batch_q_qty: "How many kilograms harvested?",
    batch_lbl_qty: "Honey Quantity in Kilograms",
    batch_ph_qty: "e.g. 25.0",
    batch_btn_to_quality: "Continue to Quality Test",

    batch_q_quality: "Select quality test result",
    batch_lbl_quality: "Purity & Moisture Test Result",
    batch_opt_good: "Grade A Pure (Moisture < 18%)",
    batch_opt_avg: "Grade B Standard (Moisture 18-20%)",
    batch_opt_retest: "Grade C Retest Required",
    batch_btn_to_loc: "Continue to Apiary Location",

    batch_q_loc: "Confirm apiary location",
    batch_lbl_loc: "Apiary / Village Location",
    batch_ph_loc: "e.g. Sundarban Delta, Sector 4",
    batch_help_loc: "Auto-filled from beekeeper profile in Firestore.",
    batch_btn_submit: "Save & Generate QR Code",

    batch_sealed_badge: "Batch Sealed on Chain",
    batch_sealed_title: "Your honey batch is now cryptographically sealed",
    batch_sealed_id_lbl: "Batch ID",
    batch_sealed_scan_help: "Scan QR to inspect provenance ledger & SHA-256 integrity.",
    batch_btn_download_qr: "Download QR Code",
    batch_btn_view_provenance: "View Provenance Page",
    batch_btn_view_my_batches: "Go to My Batches",

    // My Batches
    my_batches_tagline: "Beekeeper Ledger",
    my_batches_title: "My Honey Batches",
    my_batches_desc: "All past batches sealed in Firestore with cryptographic SHA-256 hashes.",
    my_batches_active_bk: "Beekeeper",
    my_batches_lbl_date: "Harvest Date",
    my_batches_lbl_qty: "Quantity",
    my_batches_lbl_quality: "Quality Result",
    my_batches_status_verified: "✅ Sealed in Firestore",
    my_batches_btn_view_qr: "View QR Code",
    my_batches_empty: "No harvest batches recorded yet.",
    my_batches_btn_record_new: "+ Record New Honey Batch",

    // Consumer Lookup & Verification
    lookup_title: "Verify Honey Authenticity",
    lookup_desc: "Scan the QR code or enter the batch code printed on your jar to inspect verified origin.",
    lookup_lbl_input: "Enter Batch Code (e.g. HC-8842 or HC-7109)",
    lookup_ph_input: "HC-8842",
    lookup_btn_track: "Verify Honey Batch",
    lookup_btn_scan_demo: "📷 Scan Honey Jar Label (Camera)",
    lookup_lbl_bk_name: "Beekeeper Name",
    lookup_verified_aadhaar: "(Verified Beekeeper ✅)",
    lookup_lbl_apiary: "Apiary Origin",
    lookup_lbl_date: "Harvest Date",
    lookup_lbl_qty: "Batch Volume",
    lookup_lbl_quality: "Purity Grade",
    lookup_lbl_crypto: "SHA-256 Hash Integrity",
    lookup_chain_verified: "Cryptographically Verified Authentic ✅",
    lookup_chain_error: "Integrity Warning ⚠️",
    lookup_not_found_title: "Batch Not Found",
    lookup_not_found_desc: "No harvest record matches \"{query}\". Please check the code printed on the jar.",
    lookup_sample_codes: "Try sample batch codes: HC-8842 or HC-7109."
  },
  hi: {
    // Nav & Common
    brand_title: "हनीचेन",
    nav_home: "मुख्य पृष्ठ",
    nav_my_batches: "मेरे बैच",
    nav_register: "मधुमक्खी पालक पंजीकरण",
    nav_record_harvest: "शहद दर्ज करें",
    nav_verify_honey: "शहद सत्यापन",
    nav_admin: "एडमिन डैशबोर्ड",
    nav_supply_chain: "सप्लाई चेन",
    nav_logout: "लॉग आउट",

    // Roles
    role_beekeeper: "मधुमक्खी पालक",
    role_distributor: "वितरक",
    role_retailer: "विक्रेता",
    role_customer: "ग्राहक",
    role_admin: "प्रशासक",

    // Landing
    landing_tagline: "प्रामाणिक शहद बहीखाता",
    landing_title: "शुद्ध शहद उत्पत्ति एवं प्रमाण",
    landing_desc: "छत्ते से जार तक शुद्ध शहद की उत्पत्ति और प्रामाणिकता की जांच करें।",
    landing_beekeeper_btn: "🐝 मैं मधुमक्खी पालक हूँ",
    landing_consumer_btn: "🔍 शहद सत्यापित करें (बिना लॉगिन)",
    landing_distributor_btn: "🚚 सप्लाई चेन लॉजिस्टिक्स",
    landing_admin_btn: "📊 एडमिन पोर्टल",

    // Registration Wizard
    reg_step: "चरण {current} / {total}",
    reg_q_name: "आपका पूरा नाम क्या है?",
    reg_lbl_name: "मधुमक्खी पालक का पूरा नाम",
    reg_ph_name: "उदा. आनंद कुमार",
    reg_btn_to_phone: "मोबाइल नंबर पर आगे बढ़ें",
    reg_btn_cancel: "पंजीकरण रद्द करें",

    reg_q_phone: "अपना मोबाइल नंबर दर्ज करें",
    reg_lbl_phone: "१० अंकों का मोबाइल नंबर",
    reg_ph_phone: "उदा. 9876543210",
    reg_help_phone: "हम आपके फोन पर ६ अंकों का ओटीपी भेजेंगे।",
    reg_btn_to_aadhaar: "पहचान पर आगे बढ़ें",
    reg_btn_back: "पीछे जाएं",

    reg_q_aadhaar: "अपनी आधार / सरकारी पहचान संख्या दर्ज करें",
    reg_lbl_aadhaar: "१२ अंकों की आधार संख्या",
    reg_ph_aadhaar: "उदा. 5432 1098 7654",
    reg_help_aadhaar: "यह आपकी पहचान को आपके शहद बैचों से जोड़ता है।",
    reg_btn_to_otp: "ओटीपी सत्यापन भेजें",

    reg_q_otp: "६ अंकों का ओटीपी दर्ज करें",
    reg_lbl_otp: "६ अंकों का सत्यापन कोड",
    reg_ph_otp: "उदा. 123456",
    reg_help_otp: "अपने फोन पर प्राप्त एसएमएस कोड दर्ज करें।",
    reg_btn_to_village: "ओटीपी सत्यापित करें",

    reg_q_village: "आपका मधुमक्खी पालन केंद्र कहाँ स्थित है?",
    reg_lbl_village: "केंद्र / गाँव का स्थान",
    reg_ph_village: "उदा. सुंदरबन डेल्टा, सेक्टर ४",
    reg_help_village: "यह स्थान आपके शहद बैचों के साथ हमेशा के लिए दर्ज रहेगा।",
    reg_btn_complete: "पंजीकरण पूर्ण करें",

    reg_conf_badge: "पंजीकरण पूर्ण",
    reg_conf_title: "आप हनीचेन पर सत्यापित हैं ✅",
    reg_conf_id_lbl: "आवंटित आईडी",
    reg_conf_name: "नाम",
    reg_conf_loc: "स्थान",
    reg_conf_id_link: "जुड़ी पहचान",
    reg_conf_btn_record: "पहला शहद बैच दर्ज करें",
    reg_conf_btn_my_batches: "मेरे बैच देखें",
    reg_conf_btn_home: "मुख्य पृष्ठ पर लौटें",

    // Record Harvest Batch
    batch_step: "चरण {current} / {total} • {name}",
    batch_q_date: "शहद निकालने की तारीख क्या थी?",
    batch_lbl_date: "तारीख",
    batch_btn_to_qty: "मात्रा पर आगे बढ़ें",
    batch_btn_cancel: "रद्द करें",

    batch_q_qty: "कितने किलोग्राम शहद निकाला गया?",
    batch_lbl_qty: "शहद की मात्रा (किलोग्राम में)",
    batch_ph_qty: "उदा. 25.0",
    batch_btn_to_quality: "गुणवत्ता जांच पर आगे बढ़ें",

    batch_q_quality: "गुणवत्ता परिणाम चुनें",
    batch_lbl_quality: "शुद्धता और नमी परीक्षण",
    batch_opt_good: "ग्रेड ए शुद्ध (नमी < १८%)",
    batch_opt_avg: "ग्रेड बी मानक (नमी १८-२०%)",
    batch_opt_retest: "ग्रेड सी पुन: परीक्षण आवश्यक",
    batch_btn_to_loc: "स्थान पर आगे बढ़ें",

    batch_q_loc: "केंद्र का स्थान सत्यापित करें",
    batch_lbl_loc: "स्थान",
    batch_ph_loc: "उदा. सुंदरबन डेल्टा, सेक्टर ४",
    batch_help_loc: "प्रोफाइल से स्वतः भरा गया।",
    batch_btn_submit: "सुरक्षित करें और क्यूआर कोड बनाएं",

    batch_sealed_badge: "बैच सील हो गया",
    batch_sealed_title: "आपका शहद बैच अब पूरी तरह से सुरक्षित है",
    batch_sealed_id_lbl: "बैच कोड",
    batch_sealed_scan_help: "उत्पत्ति और प्रामाणिकता देखने के लिए स्कैन करें।",
    batch_btn_download_qr: "क्यूआर कोड डाउनलोड करें",
    batch_btn_view_provenance: "उत्पत्ति पृष्ठ देखें",
    batch_btn_view_my_batches: "मेरे बैच पर जाएं",

    // My Batches
    my_batches_tagline: "बहीखाता",
    my_batches_title: "मेरे शहद बैच",
    my_batches_desc: "फायरबेस में सुरक्षित सभी पिछले बैच।",
    my_batches_active_bk: "मधुमक्खी पालक",
    my_batches_lbl_date: "तारीख",
    my_batches_lbl_qty: "मात्रा",
    my_batches_lbl_quality: "गुणवत्ता",
    my_batches_status_verified: "✅ फायरबेस में सुरक्षित",
    my_batches_btn_view_qr: "क्यूआर कोड देखें",
    my_batches_empty: "अभी तक कोई शहद बैच दर्ज नहीं किया गया।",
    my_batches_btn_record_new: "+ नया शहद बैच दर्ज करें",

    // Consumer Lookup & Verification
    lookup_title: "शहद की शुद्धता जांचें",
    lookup_desc: "जार पर छपे कोड को दर्ज करें या क्यूआर कोड स्कैन करें।",
    lookup_lbl_input: "बैच कोड दर्ज करें (उदा. HC-8842)",
    lookup_ph_input: "HC-8842",
    lookup_btn_track: "शहद सत्यापित करें",
    lookup_btn_scan_demo: "📷 जार लेबल स्कैन करें",
    lookup_lbl_bk_name: "मधुमक्खी पालक का नाम",
    lookup_verified_aadhaar: "(सत्यापित पालक ✅)",
    lookup_lbl_apiary: "उत्पत्ति स्थान",
    lookup_lbl_date: "तारीख",
    lookup_lbl_qty: "मात्रा",
    lookup_lbl_quality: "गुणवत्ता ग्रेड",
    lookup_lbl_crypto: "सुरक्षा जांच",
    lookup_chain_verified: "प्रामाणिक एवं शुद्ध शहद सत्यापित ✅",
    lookup_chain_error: "चेतावनी ⚠️",
    lookup_not_found_title: "रिकॉर्ड नहीं मिला",
    lookup_not_found_desc: "\"{query}\" कोड से कोई रिकॉर्ड नहीं मिला।",
    lookup_sample_codes: "नमूना कोड: HC-8842 या HC-7109."
  }
};

// --- Language Context ---
const LanguageContext = createContext();

function LanguageProvider({ children }) {
  const [lang, setLang] = useState("en");

  const t = (key, params = {}) => {
    let text = translations[lang]?.[key] || translations["en"]?.[key] || key;
    Object.keys(params).forEach(p => {
      text = text.replace(new RegExp(`\\{${p}\\}`, 'g'), params[p]);
    });
    return text;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

function useTranslation() {
  return useContext(LanguageContext);
}

// ==========================================================================
// Main HoneyChain Application Component
// ==========================================================================
function HoneyChainApp() {
  const { lang, setLang, t } = useTranslation();

  // Navigation views: 'landing' | 'register' | 'record' | 'my-batches' | 'verify' | 'admin' | 'supply-chain' | 'admin-login'
  const [currentView, setCurrentView] = useState("landing");
  
  // Auth & Beekeeper state
  const [currentUser, setCurrentUser] = useState(null);
  const [currentProfile, setCurrentProfile] = useState(null);
  const [userRole, setUserRole] = useState("customer"); // 'beekeeper' | 'distributor' | 'retailer' | 'customer' | 'admin'
  
  // Beekeeper registration state
  const [isBeekeeperRegistered, setIsBeekeeperRegistered] = useState(() => {
    try {
      return !!localStorage.getItem("honeychain_registered_beekeeper");
    } catch (e) {
      return false;
    }
  });

  const [activeBeekeeper, setActiveBeekeeper] = useState(() => {
    try {
      const saved = localStorage.getItem("honeychain_registered_beekeeper");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      beekeeperId: "BK-1042",
      name: "Anand Kumar",
      phone: "+919876543210",
      farmLocation: "Sundarban Delta, Sector 4",
      aadhaarMasked: "XXXX-XXXX-7654"
    };
  });

  // Modal states
  const [qrModalBatch, setQrModalBatch] = useState(null);
  const [firebaseModalOpen, setFirebaseModalOpen] = useState(false);
  const [firebaseConnected, setFirebaseConnected] = useState(false);

  // Check URL query parameters for direct QR verification links (?batchId=HC-8842)
  const [initialSearchCode, setInitialSearchCode] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const batchIdParam = params.get("batchId");
    if (batchIdParam) {
      setInitialSearchCode(batchIdParam);
      setCurrentView("verify");
    }

    // Subscribe to Firebase Auth
    if (window.authService) {
      const unsubscribe = window.authService.onAuthStateChanged((user, profile) => {
        setCurrentUser(user);
        setCurrentProfile(profile);
        if (profile?.role) {
          setUserRole(profile.role);
          if (profile.role === "beekeeper") {
            const bk = {
              beekeeperId: profile.beekeeperId || `BK-${(profile.userId || "1042").slice(-4)}`,
              name: profile.name || "Verified Beekeeper",
              phone: profile.phone || "",
              farmLocation: profile.farmLocation || "Apiary Location",
              aadhaarMasked: profile.aadhaarMasked || "Verified"
            };
            setActiveBeekeeper(bk);
            setIsBeekeeperRegistered(true);
            try {
              localStorage.setItem("honeychain_registered_beekeeper", JSON.stringify(bk));
            } catch (e) {}
          }
        }
      });
      return () => {
        if (typeof unsubscribe === "function") unsubscribe();
      };
    }
  }, []);

  useEffect(() => {
    setFirebaseConnected(window.firebaseManager?.isLiveConnected || false);
  }, [currentView]);

  return (
    <div className="hc-app-container">
      {/* Enhanced Centered Floating Navbar */}
      <header className="hc-header">
        <div className="hc-header-inner">
          {/* Brand */}
          <div 
            className="hc-brand" 
            onClick={() => setCurrentView("landing")} 
          >
            <img src="logo.svg" alt="HoneyChain Logo" style={{ width: 32, height: 32 }} />
            <span className="hc-brand-text">
              {t("brand_title")}
            </span>
          </div>

          {/* Individual Navigation Sections */}
          <nav className="hc-nav-sections">
            <button 
              type="button"
              className={`hc-nav-tab ${currentView === "landing" ? "active" : ""}`}
              onClick={() => setCurrentView("landing")}
            >
              🏠 {t("nav_home")}
            </button>

            <button 
              type="button"
              className={`hc-nav-tab ${currentView === "register" ? "active" : ""}`}
              onClick={() => setCurrentView("register")}
            >
              🐝 {t("nav_register")}
            </button>

            <button 
              type="button"
              className={`hc-nav-tab ${currentView === "record" ? "active" : ""}`}
              onClick={() => setCurrentView("record")}
              title={isBeekeeperRegistered ? "Record Honey Harvest" : "Register Beekeeper to unlock"}
            >
              🍯 {t("nav_record_harvest")}
            </button>

            <button 
              type="button"
              className={`hc-nav-tab ${currentView === "my-batches" ? "active" : ""}`}
              onClick={() => setCurrentView("my-batches")}
              title={isBeekeeperRegistered ? "View Beekeeper Batches" : "Register Beekeeper to unlock"}
            >
              📋 {t("nav_my_batches")}
            </button>

            <button 
              type="button"
              className={`hc-nav-tab ${currentView === "verify" ? "active" : ""}`}
              onClick={() => setCurrentView("verify")}
            >
              🔍 {t("nav_verify_honey")}
            </button>

            <button 
              type="button"
              className={`hc-nav-tab ${currentView === "supply-chain" ? "active" : ""}`}
              onClick={() => setCurrentView("supply-chain")}
            >
              🚚 {t("nav_supply_chain")}
            </button>

            <button 
              type="button"
              className={`hc-nav-tab ${currentView === "admin" || currentView === "admin-login" ? "active" : ""}`}
              onClick={() => setCurrentView(userRole === "admin" ? "admin" : "admin-login")}
            >
              📊 {t("nav_admin")}
            </button>
          </nav>

          {/* Right Action Tools: Firebase Status & Language Toggle */}
          <div className="hc-header-actions">
            {/* Firebase Connection Status Pill */}
            <button 
              type="button"
              className={`hc-firebase-pill ${firebaseConnected ? "connected" : ""}`}
              onClick={() => setFirebaseModalOpen(true)}
              title="Click to view/configure Firebase connection"
            >
              🔥 {firebaseConnected ? "Firebase Live" : "Firebase Ready"}
            </button>

            {/* Language Switcher */}
            <button 
              type="button" 
              className="hc-lang-toggle"
              onClick={() => setLang(lang === "en" ? "hi" : "en")}
            >
              {lang === "en" ? "🇮🇳 हिंदी" : "🇬🇧 English"}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="hc-main-content">
        {currentView === "landing" && (
          <LandingView 
            onNavigate={setCurrentView} 
            userRole={userRole} 
            setUserRole={setUserRole} 
            isBeekeeperRegistered={isBeekeeperRegistered}
          />
        )}

        {currentView === "register" && (
          <BeekeeperRegistrationWizard 
            onCancel={() => setCurrentView("landing")}
            onComplete={(newProfile) => {
              setActiveBeekeeper(newProfile);
              setIsBeekeeperRegistered(true);
              setUserRole("beekeeper");
              try {
                localStorage.setItem("honeychain_registered_beekeeper", JSON.stringify(newProfile));
              } catch (e) {}
            }}
            onNavigate={setCurrentView}
          />
        )}

        {currentView === "record" && (
          <RecordHarvestWizard 
            activeBeekeeper={activeBeekeeper}
            isBeekeeperRegistered={isBeekeeperRegistered}
            onRegisterPrompt={() => setCurrentView("register")}
            onCancel={() => setCurrentView("my-batches")}
            onComplete={(sealedBatch) => {
              setQrModalBatch(sealedBatch);
              setCurrentView("my-batches");
            }}
          />
        )}

        {currentView === "my-batches" && (
          <MyBatchesView 
            activeBeekeeper={activeBeekeeper}
            isBeekeeperRegistered={isBeekeeperRegistered}
            onRegisterPrompt={() => setCurrentView("register")}
            onRecordNew={() => setCurrentView("record")}
            onOpenQr={(batch) => setQrModalBatch(batch)}
            onNavigate={setCurrentView}
          />
        )}

        {currentView === "verify" && (
          <ConsumerVerificationView 
            initialCode={initialSearchCode}
            onNavigate={setCurrentView}
          />
        )}

        {currentView === "supply-chain" && (
          <SupplyChainManagerView 
            onNavigate={setCurrentView}
            currentUser={currentUser}
          />
        )}

        {currentView === "admin-login" && (
          <AdminLoginView 
            onSuccess={() => {
              setUserRole("admin");
              setCurrentView("admin");
            }}
            onCancel={() => setCurrentView("landing")}
          />
        )}

        {currentView === "admin" && (
          <AdminDashboardView 
            onNavigate={setCurrentView}
            onOpenQr={(batch) => setQrModalBatch(batch)}
          />
        )}
      </main>

      {/* QR Code Modal Popup */}
      {qrModalBatch && (
        <BatchQrModal 
          batch={qrModalBatch} 
          onClose={() => setQrModalBatch(null)} 
        />
      )}

      {/* Firebase Config Modal */}
      {firebaseModalOpen && (
        <FirebaseConfigModal 
          onClose={() => {
            setFirebaseModalOpen(false);
            setFirebaseConnected(window.firebaseManager?.isLiveConnected || false);
          }} 
        />
      )}
    </div>
  );
}

// ==========================================================================
// 1. Landing View Component
// ==========================================================================
function LandingView({ onNavigate, userRole, setUserRole, isBeekeeperRegistered }) {
  const { t } = useTranslation();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)", animation: "hcFadeIn 0.3s ease", textAlign: "center" }}>
      <span className="hc-tagline">{t("landing_tagline")}</span>
      <h1 style={{ fontSize: "var(--font-size-h1)", lineHeight: 1.25, margin: "4px 0", textAlign: "center" }}>
        {t("landing_title")}
      </h1>
      <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-base)", lineHeight: 1.5, textAlign: "center", maxWidth: "540px", margin: "0 auto" }}>
        {t("landing_desc")}
      </p>

      {/* Bee Illustration */}
      <div className="hc-illustration hc-float-bee">
        <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="6" fill="var(--color-accent-light)"/>
          <path d="M12 6c-2.5 0-4.5 2-4.5 4.5"/>
          <path d="M12 18c2.5 0 4.5-2 4.5-4.5"/>
          <path d="M6 12H3"/>
          <path d="M21 12h-3"/>
          <path d="m15 9 3-3"/>
          <path d="m6 18 3-3"/>
          <circle cx="9" cy="10" r="1" fill="var(--color-accent)"/>
          <circle cx="15" cy="14" r="1" fill="var(--color-accent)"/>
        </svg>
      </div>

      {/* Action Buttons for Roles */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "var(--spacing-sm)", maxWidth: "460px", margin: "var(--spacing-sm) auto 0 auto", width: "100%" }}>
        {/* Customer Instant Verification (No Login) */}
        <button 
          type="button" 
          className="hc-button-primary"
          onClick={() => onNavigate("verify")}
        >
          🔍 {t("nav_verify_honey")} (No Login)
        </button>

        {/* Beekeeper Registration */}
        <button 
          type="button" 
          className="hc-button-secondary"
          onClick={() => onNavigate("register")}
        >
          🐝 {t("nav_register")}
        </button>

        {/* Record Honey Harvest */}
        <button 
          type="button" 
          className="hc-button-secondary"
          onClick={() => onNavigate("record")}
        >
          🍯 {t("nav_record_harvest")}
        </button>

        {/* My Batches */}
        <button 
          type="button" 
          className="hc-button-secondary"
          onClick={() => onNavigate("my-batches")}
        >
          📋 {t("nav_my_batches")}
        </button>

        {/* Supply Chain Custody */}
        <button 
          type="button" 
          className="hc-button-secondary"
          onClick={() => onNavigate("supply-chain")}
        >
          🚚 {t("landing_distributor_btn")}
        </button>

        {/* Admin Dashboard */}
        <button 
          type="button" 
          className="hc-button-text"
          onClick={() => onNavigate("admin-login")}
        >
          📊 {t("landing_admin_btn")}
        </button>
      </div>
    </div>
  );
}

// ==========================================================================
// 2. Beekeeper Registration Wizard (Phone OTP + Aadhaar)
// ==========================================================================
function BeekeeperRegistrationWizard({ onCancel, onComplete }) {
  const { t } = useTranslation();
  const [step, setStep] = useState(1); // 1: Name, 2: Phone, 3: Aadhaar, 4: OTP, 5: Farm Location, 6: Completed
  
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [otp, setOtp] = useState("");
  const [village, setVillage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpNotice, setOtpNotice] = useState("");
  const [createdProfile, setCreatedProfile] = useState(null);

  const handleSendOtp = async () => {
    if (!phone || phone.length < 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await window.authService.sendPhoneOTP(phone);
      setOtpNotice(result.message || "OTP code sent to your phone.");
      setStep(4);
    } catch (e) {
      alert(e.message || "Failed to send verification code.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 4) {
      alert("Please enter the verification code.");
      return;
    }
    setStep(5);
  };

  const handleCompleteRegistration = async () => {
    if (!village) {
      alert("Please enter your farm / apiary location.");
      return;
    }
    setIsSubmitting(true);
    try {
      const profile = await window.authService.verifyPhoneOTP(otp, {
        name,
        phone,
        aadhaar,
        farmLocation: village,
        role: "beekeeper"
      });
      setCreatedProfile(profile);
      setStep(6);
    } catch (e) {
      alert(e.message || "Failed to complete registration.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)", animation: "hcFadeIn 0.25s ease" }}>
      {step <= 5 && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="hc-tagline">{t("reg_step", { current: step, total: 5 })}</span>
          <button type="button" className="hc-button-text" style={{ width: "auto", padding: 0 }} onClick={onCancel}>
            {t("reg_btn_cancel")}
          </button>
        </div>
      )}

      {/* Step 1: Full Name */}
      {step === 1 && (
        <div>
          <h2 style={{ fontSize: "var(--font-size-h2)", margin: "0 0 8px 0" }}>{t("reg_q_name")}</h2>
          <label className="hc-provenance-label" style={{ display: "block", marginBottom: 6 }}>{t("reg_lbl_name")}</label>
          <input 
            type="text" 
            className="hc-input" 
            placeholder={t("reg_ph_name")}
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            autoFocus
          />
          <div style={{ marginTop: "var(--spacing-lg)" }}>
            <button 
              type="button" 
              className="hc-button-primary" 
              disabled={!name.trim()} 
              onClick={() => setStep(2)}
            >
              {t("reg_btn_to_phone")}
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Phone Number */}
      {step === 2 && (
        <div>
          <h2 style={{ fontSize: "var(--font-size-h2)", margin: "0 0 8px 0" }}>{t("reg_q_phone")}</h2>
          <label className="hc-provenance-label" style={{ display: "block", marginBottom: 6 }}>{t("reg_lbl_phone")}</label>
          <input 
            type="tel" 
            className="hc-input" 
            placeholder={t("reg_ph_phone")}
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
            autoFocus
          />
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.95rem", margin: "8px 0" }}>{t("reg_help_phone")}</p>
          <div style={{ display: "flex", gap: "10px", marginTop: "var(--spacing-lg)" }}>
            <button type="button" className="hc-button-secondary" onClick={() => setStep(1)}>{t("reg_btn_back")}</button>
            <button type="button" className="hc-button-primary" disabled={phone.length < 10} onClick={() => setStep(3)}>{t("reg_btn_to_aadhaar")}</button>
          </div>
        </div>
      )}

      {/* Step 3: Aadhaar Number */}
      {step === 3 && (
        <div>
          <h2 style={{ fontSize: "var(--font-size-h2)", margin: "0 0 8px 0" }}>{t("reg_q_aadhaar")}</h2>
          <label className="hc-provenance-label" style={{ display: "block", marginBottom: 6 }}>{t("reg_lbl_aadhaar")}</label>
          <input 
            type="text" 
            className="hc-input" 
            placeholder={t("reg_ph_aadhaar")}
            value={aadhaar} 
            onChange={(e) => setAadhaar(e.target.value)} 
            autoFocus
          />
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.95rem", margin: "8px 0" }}>{t("reg_help_aadhaar")}</p>
          <div style={{ display: "flex", gap: "10px", marginTop: "var(--spacing-lg)" }}>
            <button type="button" className="hc-button-secondary" onClick={() => setStep(2)}>{t("reg_btn_back")}</button>
            <button type="button" className="hc-button-primary" disabled={isSubmitting || !aadhaar} onClick={handleSendOtp}>
              {isSubmitting ? "Sending OTP..." : t("reg_btn_to_otp")}
            </button>
          </div>
        </div>
      )}

      {/* Step 4: OTP Verification */}
      {step === 4 && (
        <div>
          <h2 style={{ fontSize: "var(--font-size-h2)", margin: "0 0 8px 0" }}>{t("reg_q_otp")}</h2>
          {otpNotice && (
            <div style={{ background: "var(--color-accent-light)", padding: "10px 14px", borderRadius: 12, marginBottom: 12, fontSize: "0.95rem" }}>
              📲 {otpNotice}
            </div>
          )}
          <label className="hc-provenance-label" style={{ display: "block", marginBottom: 6 }}>{t("reg_lbl_otp")}</label>
          <input 
            type="text" 
            className="hc-input" 
            placeholder={t("reg_ph_otp")}
            value={otp} 
            maxLength="6"
            onChange={(e) => setOtp(e.target.value)} 
            autoFocus
          />
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.95rem", margin: "8px 0" }}>{t("reg_help_otp")}</p>
          <div style={{ display: "flex", gap: "10px", marginTop: "var(--spacing-lg)" }}>
            <button type="button" className="hc-button-secondary" onClick={() => setStep(3)}>{t("reg_btn_back")}</button>
            <button type="button" className="hc-button-primary" disabled={otp.length < 4} onClick={handleVerifyOtp}>
              {t("reg_btn_to_village")}
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Farm Location */}
      {step === 5 && (
        <div>
          <h2 style={{ fontSize: "var(--font-size-h2)", margin: "0 0 8px 0" }}>{t("reg_q_village")}</h2>
          <label className="hc-provenance-label" style={{ display: "block", marginBottom: 6 }}>{t("reg_lbl_village")}</label>
          <input 
            type="text" 
            className="hc-input" 
            placeholder={t("reg_ph_village")}
            value={village} 
            onChange={(e) => setVillage(e.target.value)} 
            autoFocus
          />
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.95rem", margin: "8px 0" }}>{t("reg_help_village")}</p>
          <div style={{ display: "flex", gap: "10px", marginTop: "var(--spacing-lg)" }}>
            <button type="button" className="hc-button-secondary" onClick={() => setStep(4)}>{t("reg_btn_back")}</button>
            <button type="button" className="hc-button-primary" disabled={isSubmitting || !village.trim()} onClick={handleCompleteRegistration}>
              {isSubmitting ? "Registering in Firestore..." : t("reg_btn_complete")}
            </button>
          </div>
        </div>
      )}

      {/* Step 6: Confirmation Screen */}
      {step === 6 && createdProfile && (
        <div style={{ textAlign: "center", animation: "hcPopIn 0.3s ease" }}>
          <div style={{ fontSize: "3.5rem", marginBottom: 8 }}>✅</div>
          <span className="hc-tagline">{t("reg_conf_badge")}</span>
          <h2 style={{ fontSize: "var(--font-size-h2)", margin: "6px 0 16px 0", textAlign: "center" }}>{t("reg_conf_title")}</h2>

          <div style={{ background: "var(--color-input-bg)", border: "2.5px solid var(--color-border-input)", borderRadius: 18, padding: 18, textAlign: "left", marginBottom: 20, maxWidth: "480px", margin: "0 auto 20px auto" }}>
            <div style={{ marginBottom: 8 }}>
              <span className="hc-provenance-label">{t("reg_conf_id_lbl")}: </span>
              <strong style={{ color: "var(--color-accent)" }}>{createdProfile.beekeeperId || "BK-1042"}</strong>
            </div>
            <div style={{ marginBottom: 8 }}>
              <span className="hc-provenance-label">{t("reg_conf_name")}: </span>
              <strong>{createdProfile.name}</strong>
            </div>
            <div style={{ marginBottom: 8 }}>
              <span className="hc-provenance-label">{t("reg_conf_loc")}: </span>
              <strong>{createdProfile.farmLocation}</strong>
            </div>
            <div>
              <span className="hc-provenance-label">{t("reg_conf_id_link")}: </span>
              <strong>{createdProfile.phone} • {createdProfile.aadhaarMasked || "Verified"}</strong>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "420px", margin: "0 auto", width: "100%" }}>
            <button 
              type="button" 
              className="hc-button-primary"
              onClick={() => {
                onComplete(createdProfile);
                if (onNavigate) onNavigate("record");
              }}
            >
              🍯 {t("reg_conf_btn_record")}
            </button>
            <button 
              type="button" 
              className="hc-button-secondary"
              onClick={() => {
                onComplete(createdProfile);
                if (onNavigate) onNavigate("my-batches");
              }}
            >
              📋 {t("reg_conf_btn_my_batches")}
            </button>
            <button 
              type="button" 
              className="hc-button-text"
              onClick={() => {
                onComplete(createdProfile);
                if (onNavigate) onNavigate("landing");
              }}
            >
              🏠 {t("reg_conf_btn_home")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================================================
// 3. Record Harvest Wizard (SHA-256 Cryptographic Hash + QR Code Generator)
// ==========================================================================
function RecordHarvestWizard({ activeBeekeeper, isBeekeeperRegistered, onRegisterPrompt, onCancel, onComplete }) {
  const { t } = useTranslation();
  const [step, setStep] = useState(1); // 1: Date, 2: Quantity, 3: Quality, 4: Location, 5: Sealed
  
  const today = new Date().toISOString().split("T")[0];
  const [harvestDate, setHarvestDate] = useState(today);
  const [quantity, setQuantity] = useState("25.0");
  const [qualityGrade, setQualityGrade] = useState("Good");
  const [location, setLocation] = useState(activeBeekeeper?.farmLocation || "Sundarban Delta, Sector 4");
  const [isSealing, setIsSealing] = useState(false);
  const [sealedBatch, setSealedBatch] = useState(null);

  // If user is not yet registered, show friendly access gate
  if (!isBeekeeperRegistered) {
    return (
      <div style={{ textAlign: "center", animation: "hcFadeIn 0.3s ease", padding: "20px 0" }}>
        <span className="hc-tagline">Beekeeper Verification Required</span>
        <h1 style={{ fontSize: "var(--font-size-h1)", margin: "8px 0", textAlign: "center" }}>🍯 Record Honey Harvest</h1>
        <p style={{ color: "var(--color-text-muted)", maxWidth: "500px", margin: "0 auto 24px auto", textAlign: "center" }}>
          To record honey batches and cryptographically seal your harvest with SHA-256 in Firestore, please complete your Beekeeper Registration first.
        </p>
        <div style={{ maxWidth: "420px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
          <button 
            type="button" 
            className="hc-button-primary"
            onClick={onRegisterPrompt}
          >
            🐝 Register as Beekeeper Now
          </button>
          <button 
            type="button" 
            className="hc-button-secondary"
            onClick={onCancel}
          >
            ← Return to Home
          </button>
        </div>
      </div>
    );
  }

  const handleSealBatch = async () => {
    setIsSealing(true);
    try {
      const batchRecord = await window.batchService.createBatch({
        beekeeperId: activeBeekeeper?.beekeeperId || "BK-1042",
        beekeeperName: activeBeekeeper?.name || "Verified Beekeeper",
        harvestDate,
        quantity: Number(quantity),
        qualityGrade,
        location: location || activeBeekeeper?.farmLocation || "Apiary Location"
      });
      setSealedBatch(batchRecord);
      setStep(5);
    } catch (e) {
      alert("Error sealing batch in Firestore: " + e.message);
    } finally {
      setIsSealing(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)", animation: "hcFadeIn 0.25s ease" }}>
      {step <= 4 && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="hc-tagline">{t("batch_step", { current: step, total: 4, name: activeBeekeeper?.name || "Beekeeper" })}</span>
          <button type="button" className="hc-button-text" style={{ width: "auto", padding: 0 }} onClick={onCancel}>
            {t("batch_btn_cancel")}
          </button>
        </div>
      )}

      {/* Step 1: Harvest Date */}
      {step === 1 && (
        <div>
          <h2 style={{ fontSize: "var(--font-size-h2)", margin: "0 0 8px 0", textAlign: "center" }}>{t("batch_q_date")}</h2>
          <label className="hc-provenance-label" style={{ display: "block", marginBottom: 6 }}>{t("batch_lbl_date")}</label>
          <input 
            type="date" 
            className="hc-input" 
            value={harvestDate} 
            onChange={(e) => setHarvestDate(e.target.value)} 
          />
          <div style={{ marginTop: "var(--spacing-lg)" }}>
            <button type="button" className="hc-button-primary" onClick={() => setStep(2)}>
              {t("batch_btn_to_qty")}
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Quantity in kg */}
      {step === 2 && (
        <div>
          <h2 style={{ fontSize: "var(--font-size-h2)", margin: "0 0 8px 0", textAlign: "center" }}>{t("batch_q_qty")}</h2>
          <label className="hc-provenance-label" style={{ display: "block", marginBottom: 6 }}>{t("batch_lbl_qty")}</label>
          <input 
            type="number" 
            step="0.5" 
            className="hc-input" 
            placeholder={t("batch_ph_qty")}
            value={quantity} 
            onChange={(e) => setQuantity(e.target.value)} 
            autoFocus
          />
          <div style={{ display: "flex", gap: "10px", marginTop: "var(--spacing-lg)" }}>
            <button type="button" className="hc-button-secondary" onClick={() => setStep(1)}>{t("reg_btn_back")}</button>
            <button type="button" className="hc-button-primary" disabled={!quantity || Number(quantity) <= 0} onClick={() => setStep(3)}>
              {t("batch_btn_to_quality")}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Quality Test */}
      {step === 3 && (
        <div>
          <h2 style={{ fontSize: "var(--font-size-h2)", margin: "0 0 8px 0", textAlign: "center" }}>{t("batch_q_quality")}</h2>
          <label className="hc-provenance-label" style={{ display: "block", marginBottom: 6 }}>{t("batch_lbl_quality")}</label>
          <select 
            className="hc-select" 
            value={qualityGrade} 
            onChange={(e) => setQualityGrade(e.target.value)}
          >
            <option value="Good">{t("batch_opt_good")}</option>
            <option value="Average">{t("batch_opt_avg")}</option>
            <option value="Retest">{t("batch_opt_retest")}</option>
          </select>
          <div style={{ display: "flex", gap: "10px", marginTop: "var(--spacing-lg)" }}>
            <button type="button" className="hc-button-secondary" onClick={() => setStep(2)}>{t("reg_btn_back")}</button>
            <button type="button" className="hc-button-primary" onClick={() => setStep(4)}>
              {t("batch_btn_to_loc")}
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Confirm Location & Submit */}
      {step === 4 && (
        <div>
          <h2 style={{ fontSize: "var(--font-size-h2)", margin: "0 0 8px 0", textAlign: "center" }}>{t("batch_q_loc")}</h2>
          <label className="hc-provenance-label" style={{ display: "block", marginBottom: 6 }}>{t("batch_lbl_loc")}</label>
          <input 
            type="text" 
            className="hc-input" 
            value={location} 
            onChange={(e) => setLocation(e.target.value)} 
          />
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.95rem", margin: "8px 0" }}>{t("batch_help_loc")}</p>
          <div style={{ display: "flex", gap: "10px", marginTop: "var(--spacing-lg)" }}>
            <button type="button" className="hc-button-secondary" onClick={() => setStep(3)}>{t("reg_btn_back")}</button>
            <button type="button" className="hc-button-primary" disabled={isSealing || !location} onClick={handleSealBatch}>
              {isSealing ? "Sealing in Firestore..." : t("batch_btn_submit")}
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Sealed Batch & QR Code Screen */}
      {step === 5 && sealedBatch && (
        <div style={{ textAlign: "center", animation: "hcPopIn 0.35s ease" }}>
          <span className="hc-tagline">{t("batch_sealed_badge")}</span>
          <h2 style={{ fontSize: "var(--font-size-h2)", margin: "6px 0 12px 0", textAlign: "center" }}>{t("batch_sealed_title")}</h2>
          <div className="hc-display-number hc-highlight">{sealedBatch.batchId}</div>

          {/* Generated QR Code Preview */}
          <div className="hc-qr-wrapper">
            {sealedBatch.qrCodeUrl?.startsWith("data:image") ? (
              <img src={sealedBatch.qrCodeUrl} alt="Batch QR Code" style={{ width: 220, height: 220 }} />
            ) : (
              <div id="batch-sealed-qr" style={{ padding: 10 }}></div>
            )}
            <p style={{ fontSize: "0.95rem", color: "var(--color-text-muted)", margin: "8px 0 0 0" }}>
              {t("batch_sealed_scan_help")}
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "var(--spacing-md)", maxWidth: "440px", margin: "var(--spacing-md) auto 0 auto", width: "100%" }}>
            <a 
              href={sealedBatch.qrCodeUrl} 
              download={`HoneyChain-QR-${sealedBatch.batchId}.png`}
              className="hc-button-primary"
              style={{ textDecoration: "none" }}
            >
              📥 {t("batch_btn_download_qr")}
            </a>
            <button 
              type="button" 
              className="hc-button-secondary"
              onClick={() => onComplete(sealedBatch)}
            >
              📋 {t("batch_btn_view_my_batches")}
            </button>
            <button 
              type="button" 
              className="hc-button-text"
              onClick={() => {
                setSealedBatch(null);
                setStep(1);
              }}
            >
              + Record Another Batch
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================================================
// 4. My Batches View
// ==========================================================================
function MyBatchesView({ activeBeekeeper, isBeekeeperRegistered, onRegisterPrompt, onRecordNew, onOpenQr, onNavigate }) {
  const { t } = useTranslation();
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBatches() {
      if (!isBeekeeperRegistered) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        if (window.batchService) {
          const list = await window.batchService.getBatchesByBeekeeper(activeBeekeeper?.beekeeperId || "BK-1042");
          setBatches(list);
        }
      } catch (e) {
        console.warn("Failed to load batches:", e);
      } finally {
        setLoading(false);
      }
    }
    loadBatches();
  }, [activeBeekeeper, isBeekeeperRegistered]);

  // If user is not yet registered, show prompt to register
  if (!isBeekeeperRegistered) {
    return (
      <div style={{ textAlign: "center", animation: "hcFadeIn 0.3s ease", padding: "20px 0" }}>
        <span className="hc-tagline">Beekeeper Ledger</span>
        <h1 style={{ fontSize: "var(--font-size-h1)", margin: "8px 0", textAlign: "center" }}>📋 My Honey Batches</h1>
        <p style={{ color: "var(--color-text-muted)", maxWidth: "500px", margin: "0 auto 24px auto", textAlign: "center" }}>
          You have not registered an apiary profile yet. Register your beekeeper profile with phone verification to start recording and tracking your sealed harvest batches.
        </p>
        <div style={{ maxWidth: "420px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
          <button 
            type="button" 
            className="hc-button-primary"
            onClick={onRegisterPrompt}
          >
            🐝 Register Beekeeper Identity
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)", animation: "hcFadeIn 0.25s ease" }}>
      <div style={{ textAlign: "center", marginBottom: "var(--spacing-xs)" }}>
        <span className="hc-tagline">{t("my_batches_tagline")}</span>
        <h1 style={{ fontSize: "var(--font-size-h1)", margin: "4px 0", textAlign: "center" }}>{t("my_batches_title")}</h1>
        <p style={{ color: "var(--color-text-muted)", margin: "4px auto", textAlign: "center", maxWidth: "520px" }}>
          {activeBeekeeper?.name} ({activeBeekeeper?.beekeeperId}) • {activeBeekeeper?.farmLocation}
        </p>
      </div>

      <button type="button" className="hc-button-primary" onClick={onRecordNew} style={{ maxWidth: "460px", margin: "0 auto", width: "100%" }}>
        {t("my_batches_btn_record_new")}
      </button>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px 0" }}>⏳ Loading batches from Firestore...</div>
      ) : batches.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 0", color: "var(--color-text-muted)" }}>
          {t("my_batches_empty")}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "8px" }}>
          {batches.map((batch) => (
            <div 
              key={batch.batchId} 
              style={{
                background: "var(--color-input-bg)",
                border: "2.5px solid var(--color-border-input)",
                borderRadius: 20,
                padding: "16px 20px",
                display: "flex",
                flexDirection: "column",
                gap: "8px"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong style={{ fontSize: "1.35rem", color: "var(--color-accent)" }}>{batch.batchId}</strong>
                <span className="hc-role-badge">{batch.status || "sealed"}</span>
              </div>
              <div style={{ fontSize: "0.95rem", color: "var(--color-text-muted)" }}>
                📅 {t("my_batches_lbl_date")}: <strong>{batch.harvestDate}</strong> • ⚖️ {batch.quantity} kg • 🍯 Grade: {batch.qualityGrade}
              </div>
              <div style={{ fontSize: "0.85rem", wordBreak: "break-all", color: "var(--color-text-muted)" }}>
                🔐 SHA-256: <code>{(batch.blockchainHash || "").slice(0, 24)}...</code>
              </div>
              <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
                <button 
                  type="button" 
                  className="hc-button-secondary" 
                  style={{ minHeight: "44px", fontSize: "1rem", borderRadius: "14px" }}
                  onClick={() => onOpenQr(batch)}
                >
                  📱 {t("my_batches_btn_view_qr")}
                </button>
                <button 
                  type="button" 
                  className="hc-button-secondary" 
                  style={{ minHeight: "44px", fontSize: "1rem", borderRadius: "14px" }}
                  onClick={() => {
                    const url = `${window.location.origin}${window.location.pathname}?batchId=${batch.batchId}`;
                    window.location.href = url;
                  }}
                >
                  🔍 Verify View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ==========================================================================
// 5. Consumer Verification & Provenance Lookup (Public / No Login Required)
// ==========================================================================
function ConsumerVerificationView({ initialCode = "", onNavigate }) {
  const { t } = useTranslation();
  const [query, setQuery] = useState(initialCode || "HC-8842");
  const [verificationResult, setVerificationResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const runVerification = async (codeToVerify) => {
    const code = (codeToVerify || query).trim().toUpperCase();
    if (!code) return;
    setIsVerifying(true);
    try {
      if (window.verificationService) {
        const result = await window.verificationService.verifyHoney(code, "manual_code");
        setVerificationResult(result);
      }
    } catch (e) {
      alert("Verification error: " + e.message);
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    if (initialCode) {
      runVerification(initialCode);
    }
  }, [initialCode]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)", animation: "hcFadeIn 0.25s ease" }}>
      <div style={{ textAlign: "center" }}>
        <span className="hc-tagline">Authentic Honey Origin</span>
        <h1 style={{ fontSize: "var(--font-size-h1)", margin: "4px 0", textAlign: "center" }}>{t("lookup_title")}</h1>
        <p style={{ color: "var(--color-text-muted)", textAlign: "center", maxWidth: "540px", margin: "0 auto" }}>{t("lookup_desc")}</p>
      </div>

      {/* Code Input */}
      <div style={{ display: "flex", gap: "8px" }}>
        <input 
          type="text" 
          className="hc-input" 
          placeholder={t("lookup_ph_input")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button 
          type="button" 
          className="hc-button-primary"
          style={{ width: "auto", minWidth: "140px" }}
          disabled={isVerifying || !query.trim()}
          onClick={() => runVerification(query)}
        >
          {isVerifying ? "Verifying..." : t("lookup_btn_track")}
        </button>
      </div>

      {/* Sample Codes */}
      <div style={{ fontSize: "0.9rem", color: "var(--color-text-muted)", textAlign: "center" }}>
        💡 {t("lookup_sample_codes")}{" "}
        <button 
          type="button" 
          style={{ background: "none", border: "none", color: "var(--color-accent)", textDecoration: "underline", cursor: "pointer", fontWeight: 600 }}
          onClick={() => { setQuery("HC-8842"); runVerification("HC-8842"); }}
        >
          HC-8842
        </button>
        {" | "}
        <button 
          type="button" 
          style={{ background: "none", border: "none", color: "var(--color-accent)", textDecoration: "underline", cursor: "pointer", fontWeight: 600 }}
          onClick={() => { setQuery("HC-7109"); runVerification("HC-7109"); }}
        >
          HC-7109
        </button>
      </div>

      {/* Verification Result Display */}
      {verificationResult && (
        <div style={{ marginTop: "var(--spacing-md)", animation: "hcPopIn 0.3s ease" }}>
          {verificationResult.found ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)" }}>
              {/* Authenticity Banner */}
              <div style={{ 
                background: "var(--color-accent-light)", 
                border: "2px solid var(--color-accent)", 
                borderRadius: 20, 
                padding: "16px 20px", 
                display: "flex", 
                alignItems: "center", 
                gap: 14 
              }}>
                <span style={{ fontSize: "2.2rem" }}>✅</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.25rem", color: "var(--color-text)" }}>
                    {t("lookup_chain_verified")}
                  </h3>
                  <span style={{ fontSize: "0.9rem", color: "var(--color-text-muted)" }}>
                    Verified in Firestore Ledger • Verification Log ID: {verificationResult.verificationId}
                  </span>
                </div>
              </div>

              {/* Provenance Details */}
              <div style={{ background: "var(--color-input-bg)", border: "2.5px solid var(--color-border-input)", borderRadius: 20, padding: 20 }}>
                <h3 style={{ margin: "0 0 14px 0", fontSize: "1.25rem", borderBottom: "1.5px solid var(--color-border-input)", paddingBottom: 8, textAlign: "center" }}>
                  🍯 Honey Harvest Origin
                </h3>

                <ul className="hc-provenance-list" style={{ marginTop: 0 }}>
                  <li className="hc-provenance-item">
                    <span className="hc-provenance-label">{t("lookup_lbl_bk_name")}</span>
                    <span className="hc-provenance-value">{verificationResult.batch.beekeeperName} {t("lookup_verified_aadhaar")}</span>
                  </li>
                  <li className="hc-provenance-item">
                    <span className="hc-provenance-label">{t("lookup_lbl_apiary")}</span>
                    <span className="hc-provenance-value">{verificationResult.batch.location}</span>
                  </li>
                  <li className="hc-provenance-item">
                    <span className="hc-provenance-label">{t("lookup_lbl_date")}</span>
                    <span className="hc-provenance-value">{verificationResult.batch.harvestDate}</span>
                  </li>
                  <li className="hc-provenance-item">
                    <span className="hc-provenance-label">{t("lookup_lbl_qty")}</span>
                    <span className="hc-provenance-value">{verificationResult.batch.quantity} Kilograms</span>
                  </li>
                  <li className="hc-provenance-item">
                    <span className="hc-provenance-label">{t("lookup_lbl_quality")}</span>
                    <span className="hc-provenance-value">{verificationResult.batch.qualityGrade}</span>
                  </li>
                  <li className="hc-provenance-item">
                    <span className="hc-provenance-label">Cryptographic SHA-256 Seal</span>
                    <span className="hc-provenance-value" style={{ fontSize: "0.85rem", wordBreak: "break-all" }}>
                      <code>{verificationResult.batch.blockchainHash}</code>
                    </span>
                  </li>
                </ul>
              </div>

              {/* Full Supply Chain Journey Timeline */}
              <div style={{ background: "var(--color-input-bg)", border: "2.5px solid var(--color-border-input)", borderRadius: 20, padding: 20 }}>
                <h3 style={{ margin: "0 0 14px 0", fontSize: "1.25rem", borderBottom: "1.5px solid var(--color-border-input)", paddingBottom: 8, textAlign: "center" }}>
                  🚚 Supply Chain Custody Timeline
                </h3>

                {verificationResult.timeline && verificationResult.timeline.length > 0 ? (
                  <div className="hc-timeline">
                    {verificationResult.timeline.map((evt, idx) => (
                      <div key={evt.eventId || idx} className="hc-timeline-item">
                        <div className="hc-timeline-title">{evt.action}</div>
                        <div className="hc-timeline-meta">
                          By <strong>{evt.actor}</strong> ({evt.actorRole}) • {new Date(evt.timestamp || evt.timestampIso).toLocaleDateString()}
                        </div>
                        <div className="hc-timeline-meta">📍 {evt.location}</div>
                        {evt.notes && <div className="hc-timeline-notes">{evt.notes}</div>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: "var(--color-text-muted)", fontSize: "0.95rem", textAlign: "center" }}>
                    Genesis batch record verified at apiary origin.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div style={{ 
              background: "#FDEDEC", 
              border: "2px solid #E74C3C", 
              borderRadius: 20, 
              padding: "20px", 
              textAlign: "center" 
            }}>
              <span style={{ fontSize: "2.5rem" }}>⚠️</span>
              <h3 style={{ color: "#922B21", margin: "6px 0" }}>{t("lookup_not_found_title")}</h3>
              <p style={{ color: "#78281F", margin: 0 }}>
                {t("lookup_not_found_desc", { query })}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ==========================================================================
// 6. Supply Chain Manager View (Distributor & Retailer Event Logger)
// ==========================================================================
function SupplyChainManagerView({ onNavigate, currentUser }) {
  const [batchId, setBatchId] = useState("HC-8842");
  const [actorName, setActorName] = useState(currentUser?.displayName || "Apex Cold-Chain Logistics");
  const [actorRole, setActorRole] = useState("distributor"); // distributor | retailer | beekeeper
  const [action, setAction] = useState("Cold-Chain Transit Dispatched");
  const [location, setLocation] = useState("Regional Distribution Center, Bay 3");
  const [notes, setNotes] = useState("Maintained at 22°C constant temperature. Quality seal intact.");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentEvents, setRecentEvents] = useState([]);

  const loadEvents = async () => {
    if (window.supplyChainService) {
      const list = await window.supplyChainService.getRecentEvents(10);
      setRecentEvents(list);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!batchId || !actorName || !action) return;

    setIsSubmitting(true);
    try {
      await window.supplyChainService.addEvent({
        batchId,
        actor: actorName,
        actorRole,
        action,
        location,
        notes
      });
      alert(`✅ Supply chain milestone successfully logged in Firestore for batch ${batchId}!`);
      setNotes("");
      loadEvents();
    } catch (err) {
      alert("Error logging milestone: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)", animation: "hcFadeIn 0.25s ease" }}>
      <div style={{ textAlign: "center" }}>
        <span className="hc-tagline">Logistics & Custody</span>
        <h1 style={{ fontSize: "var(--font-size-h1)", margin: "4px 0", textAlign: "center" }}>Supply Chain Custody</h1>
        <p style={{ color: "var(--color-text-muted)", textAlign: "center", maxWidth: "540px", margin: "0 auto" }}>
          Log cold-chain transit, laboratory quality gates, warehouse arrivals, and retail shelf placements in Firestore.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleAddEvent} style={{ 
        background: "var(--color-input-bg)", 
        border: "2.5px solid var(--color-border-input)", 
        borderRadius: 20, 
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 12
      }}>
        <div>
          <label className="hc-provenance-label">Target Batch ID</label>
          <input 
            type="text" 
            className="hc-input" 
            value={batchId} 
            onChange={(e) => setBatchId(e.target.value)} 
            placeholder="e.g. HC-8842" 
            required 
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div>
            <label className="hc-provenance-label">Actor / Company Name</label>
            <input 
              type="text" 
              className="hc-input" 
              value={actorName} 
              onChange={(e) => setActorName(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label className="hc-provenance-label">Role</label>
            <select 
              className="hc-select" 
              value={actorRole} 
              onChange={(e) => setActorRole(e.target.value)}
            >
              <option value="distributor">Distributor / Logistics</option>
              <option value="retailer">Retailer / Supermarket</option>
              <option value="beekeeper">Beekeeper / Apiary</option>
              <option value="admin">Quality Inspector</option>
            </select>
          </div>
        </div>

        <div>
          <label className="hc-provenance-label">Milestone Action</label>
          <select 
            className="hc-select" 
            value={action} 
            onChange={(e) => setAction(e.target.value)}
          >
            <option value="Cold-Chain Transit Dispatched">Cold-Chain Transit Dispatched</option>
            <option value="Received at Regional Distribution Hub">Received at Regional Distribution Hub</option>
            <option value="NMR & C4 Sugar Lab Test Passed">NMR & C4 Sugar Lab Test Passed</option>
            <option value="Placed on Retail Store Shelf">Placed on Retail Store Shelf</option>
            <option value="Delivered to Consumer">Delivered to Consumer</option>
          </select>
        </div>

        <div>
          <label className="hc-provenance-label">Location</label>
          <input 
            type="text" 
            className="hc-input" 
            value={location} 
            onChange={(e) => setLocation(e.target.value)} 
          />
        </div>

        <div>
          <label className="hc-provenance-label">Inspection / Transport Notes</label>
          <input 
            type="text" 
            className="hc-input" 
            value={notes} 
            onChange={(e) => setNotes(e.target.value)} 
            placeholder="e.g. Temperature readings, moisture tests, seal numbers"
          />
        </div>

        <button 
          type="submit" 
          className="hc-button-primary"
          disabled={isSubmitting}
          style={{ marginTop: 8 }}
        >
          {isSubmitting ? "Writing to Firestore..." : "📝 Record Milestone in Chain"}
        </button>
      </form>

      {/* Recent Activity */}
      <div>
        <h3 style={{ fontSize: "1.2rem", margin: "16px 0 8px 0", textAlign: "center" }}>Recent Supply Chain Milestones</h3>
        <div className="hc-timeline">
          {recentEvents.map((evt, idx) => (
            <div key={evt.eventId || idx} className="hc-timeline-item">
              <div className="hc-timeline-title">
                <strong style={{ color: "var(--color-accent)" }}>{evt.batchId}</strong>: {evt.action}
              </div>
              <div className="hc-timeline-meta">
                By <strong>{evt.actor}</strong> ({evt.actorRole}) • 📍 {evt.location}
              </div>
              {evt.notes && <div className="hc-timeline-notes">{evt.notes}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==========================================================================
// 7. Admin Login View
// ==========================================================================
function AdminLoginView({ onSuccess, onCancel }) {
  const [email, setEmail] = useState("admin@honeychain.org");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await window.authService.adminLogin(email, password);
      onSuccess();
    } catch (err) {
      setError(err.message || "Invalid administrator credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)", animation: "hcFadeIn 0.25s ease" }}>
      <div style={{ textAlign: "center" }}>
        <span className="hc-tagline">Security & Management</span>
        <h1 style={{ fontSize: "var(--font-size-h1)", margin: "4px 0", textAlign: "center" }}>Admin Portal Login</h1>
        <p style={{ color: "var(--color-text-muted)", textAlign: "center", maxWidth: "520px", margin: "0 auto" }}>
          Sign in to view real-time system metrics, manage beekeeper identities, and inspect public verification audits.
        </p>
      </div>

      {error && (
        <div style={{ background: "#FDEDEC", color: "#922B21", padding: "12px 16px", borderRadius: 12, textAlign: "center" }}>
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleLogin} style={{ 
        background: "var(--color-input-bg)", 
        border: "2.5px solid var(--color-border-input)", 
        borderRadius: 20, 
        padding: 20, 
        display: "flex", 
        flexDirection: "column", 
        gap: 12,
        maxWidth: "480px",
        margin: "0 auto",
        width: "100%"
      }}>
        <div>
          <label className="hc-provenance-label">Admin Email</label>
          <input 
            type="text" 
            className="hc-input" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label className="hc-provenance-label">Password</label>
          <input 
            type="password" 
            className="hc-input" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
          <button type="button" className="hc-button-secondary" onClick={onCancel}>Cancel</button>
          <button type="submit" className="hc-button-primary" disabled={loading}>
            {loading ? "Authenticating..." : "Sign In as Admin"}
          </button>
        </div>
      </form>
    </div>
  );
}

// ==========================================================================
// 8. Admin Dashboard View (Metrics, Verification Logs, User Management)
// ==========================================================================
function AdminDashboardView({ onNavigate, onOpenQr }) {
  const [data, setData] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshData = async () => {
    setLoading(true);
    try {
      if (window.adminService) {
        const dashboard = await window.adminService.getDashboardMetrics();
        const userList = await window.adminService.getAllUsers();
        setData(dashboard);
        setUsers(userList);
      }
    } catch (e) {
      console.warn("Failed to load admin data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <div className="hc-admin-dashboard" style={{ animation: "hcFadeIn 0.25s ease" }}>
      <div style={{ textAlign: "center", marginBottom: "var(--spacing-xs)" }}>
        <span className="hc-tagline">Real-Time Ledger Intelligence</span>
        <h1 style={{ fontSize: "var(--font-size-h1)", margin: "4px 0", textAlign: "center" }}>Admin Dashboard</h1>
        <button 
          type="button" 
          className="hc-button-secondary"
          style={{ width: "auto", minHeight: "38px", fontSize: "0.9rem", borderRadius: "12px", margin: "8px auto 0 auto", display: "inline-flex" }}
          onClick={refreshData}
        >
          🔄 Refresh
        </button>
      </div>

      {loading || !data ? (
        <div style={{ textAlign: "center", padding: "40px 0" }}>⏳ Loading analytics from Firestore...</div>
      ) : (
        <>
          {/* Key Metrics Grid */}
          <div className="hc-admin-grid">
            <div className="hc-stat-card">
              <span className="hc-stat-label">Total Beekeepers</span>
              <div className="hc-stat-number">{data.metrics.totalBeekeepers}</div>
              <span style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>Verified via Aadhaar/OTP</span>
            </div>

            <div className="hc-stat-card">
              <span className="hc-stat-label">Honey Batches</span>
              <div className="hc-stat-number">{data.metrics.totalBatches}</div>
              <span style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>Sealed with SHA-256</span>
            </div>

            <div className="hc-stat-card">
              <span className="hc-stat-label">Harvest Volume</span>
              <div className="hc-stat-number">{data.metrics.totalVolumeKg} <span style={{ fontSize: "1.2rem" }}>kg</span></div>
              <span style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>Pure Honey Tracked</span>
            </div>

            <div className="hc-stat-card">
              <span className="hc-stat-label">Consumer Verifications</span>
              <div className="hc-stat-number">{data.metrics.totalVerifications}</div>
              <span style={{ fontSize: "0.85rem", color: "#1E8449", fontWeight: 600 }}>
                {data.metrics.successRate}% Authentic Rate
              </span>
            </div>
          </div>

          {/* Verification Audit Logs */}
          <div style={{ background: "var(--color-input-bg)", border: "2.5px solid var(--color-border-input)", borderRadius: 20, padding: 20 }}>
            <h3 style={{ margin: "0 0 12px 0", fontSize: "1.2rem", textAlign: "center" }}>🔍 Real-Time Consumer Verification Audit Log</h3>
            {data.recentVerifications && data.recentVerifications.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {data.recentVerifications.map((v, i) => (
                  <div key={v.verificationId || i} style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center",
                    padding: "10px 14px",
                    borderRadius: 12,
                    background: v.result === "authentic" ? "var(--color-accent-light)" : "#FDEDEC"
                  }}>
                    <div>
                      <strong style={{ color: "var(--color-text)" }}>Batch {v.batchId}</strong>
                      <span style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", marginLeft: 10 }}>
                        {new Date(v.verifiedAt || v.verifiedAtIso).toLocaleString()}
                      </span>
                    </div>
                    <span className={`hc-role-badge ${v.result === "authentic" ? "retailer" : ""}`} style={{ fontSize: "0.85rem" }}>
                      {v.result === "authentic" ? "✅ Authentic" : "⚠️ Not Found"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "var(--color-text-muted)", textAlign: "center" }}>No verifications logged yet.</p>
            )}
          </div>

          {/* Users & Roles Management */}
          <div style={{ background: "var(--color-input-bg)", border: "2.5px solid var(--color-border-input)", borderRadius: 20, padding: 20 }}>
            <h3 style={{ margin: "0 0 12px 0", fontSize: "1.2rem", textAlign: "center" }}>👥 Registered Actors & Roles</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {users.map((u, i) => (
                <div key={u.userId || i} style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                  padding: "10px 14px",
                  borderBottom: "1px solid var(--color-border-input)"
                }}>
                  <div>
                    <strong>{u.name}</strong>
                    <div style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>{u.phone || u.email}</div>
                  </div>
                  <span className={`hc-role-badge ${u.role}`}>{u.role}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ==========================================================================
// 9. Batch QR Code Modal Component
// ==========================================================================
function BatchQrModal({ batch, onClose }) {
  const { t } = useTranslation();
  const verificationUrl = `${window.location.origin}${window.location.pathname}?batchId=${batch.batchId}`;

  return (
    <div className="hc-modal-overlay" onClick={onClose}>
      <div className="hc-modal-content" onClick={(e) => e.stopPropagation()}>
        <h3 style={{ margin: "0 0 6px 0", fontSize: "1.4rem" }}>{t("qr_modal_title")}</h3>
        <p style={{ color: "var(--color-text-muted)", fontSize: "0.95rem", margin: "0 0 14px 0" }}>
          Batch <strong>{batch.batchId}</strong> • {batch.beekeeperName}
        </p>

        <div className="hc-qr-wrapper" style={{ margin: "10px auto" }}>
          {batch.qrCodeUrl?.startsWith("data:image") ? (
            <img src={batch.qrCodeUrl} alt={`QR Code for ${batch.batchId}`} style={{ width: 220, height: 220 }} />
          ) : (
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(verificationUrl)}`} 
              alt="QR Code" 
              style={{ width: 220, height: 220 }}
            />
          )}
        </div>

        <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", wordBreak: "break-all", margin: "8px 0 16px 0" }}>
          🔐 <code>{batch.blockchainHash || "SHA-256 Sealed"}</code>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <a 
            href={batch.qrCodeUrl || verificationUrl} 
            download={`HoneyChain-${batch.batchId}.png`}
            className="hc-button-primary"
            style={{ textDecoration: "none" }}
          >
            📥 {t("qr_modal_btn_download")}
          </a>
          <button type="button" className="hc-button-secondary" onClick={onClose}>
            {t("qr_modal_btn_close")}
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================================================
// 10. Firebase Configuration Modal
// ==========================================================================
function FirebaseConfigModal({ onClose }) {
  const currentConfig = window.firebaseManager?.config || {};
  const [apiKey, setApiKey] = useState(currentConfig.apiKey || "");
  const [projectId, setProjectId] = useState(currentConfig.projectId || "");
  const [authDomain, setAuthDomain] = useState(currentConfig.authDomain || "");
  const [storageBucket, setStorageBucket] = useState(currentConfig.storageBucket || "");

  const handleSave = (e) => {
    e.preventDefault();
    if (window.firebaseManager) {
      window.firebaseManager.saveConfig({
        apiKey,
        projectId,
        authDomain,
        storageBucket
      });
      alert("✅ Firebase configuration updated successfully! Refreshing backend connections.");
      onClose();
    }
  };

  return (
    <div className="hc-modal-overlay" onClick={onClose}>
      <div className="hc-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480, textAlign: "left" }}>
        <h3 style={{ margin: "0 0 6px 0", fontSize: "1.3rem" }}>🔥 Firebase Configuration</h3>
        <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem", margin: "0 0 14px 0" }}>
          Enter your live Firebase Project credentials below to sync with your production Firebase Auth, Firestore & Storage.
        </p>

        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div>
            <label className="hc-provenance-label">API Key (apiKey)</label>
            <input type="text" className="hc-input" value={apiKey} onChange={(e) => setApiKey(e.target.value)} required />
          </div>
          <div>
            <label className="hc-provenance-label">Project ID (projectId)</label>
            <input type="text" className="hc-input" value={projectId} onChange={(e) => setProjectId(e.target.value)} required />
          </div>
          <div>
            <label className="hc-provenance-label">Auth Domain (authDomain)</label>
            <input type="text" className="hc-input" value={authDomain} onChange={(e) => setAuthDomain(e.target.value)} />
          </div>
          <div>
            <label className="hc-provenance-label">Storage Bucket (storageBucket)</label>
            <input type="text" className="hc-input" value={storageBucket} onChange={(e) => setStorageBucket(e.target.value)} />
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
            <button type="button" className="hc-button-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="hc-button-primary">Save & Connect</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==========================================================================
// App Root Mount
// ==========================================================================
const rootElement = document.getElementById("root");
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <LanguageProvider>
      <HoneyChainApp />
    </LanguageProvider>
  );
}
