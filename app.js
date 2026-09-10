// ==========================================================================
// HoneyChain - React Application
// Designed for Rural Beekeepers & Direct Consumers
// ==========================================================================

const { useState, createContext, useContext, useEffect, useRef } = React;

// --- Translation Dictionary (English & Hindi) ---
const translations = {
  en: {
    // Nav
    nav_home: "Home",
    nav_my_batches: "My Batches",
    nav_register: "Register Beekeeper",
    nav_record_harvest: "Record Harvest",
    nav_verify_honey: "Verify Honey",
    
    // Landing
    landing_tagline: "Authentic Honey Ledger",
    landing_title: "Pure Honey Provenance",
    landing_desc: "Track pure honey from hive to jar with tamper-proof origin verification.",
    landing_beekeeper_btn: "I'm a Beekeeper",
    landing_consumer_btn: "I'm a Consumer",

    // Beekeeper Profile Switcher
    select_bk_tagline: "Apiary Access",
    select_bk_title: "Select Beekeeper Profile",
    select_bk_desc: "Choose a verified beekeeper profile or register a new one.",
    select_bk_register_new: "+ Register New Beekeeper",
    select_bk_back_home: "Return to Home",

    // Registration Wizard
    reg_step: "Step {current} of {total}",
    reg_q_name: "What is your full name?",
    reg_lbl_name: "Beekeeper Full Name",
    reg_ph_name: "e.g. Anand Kumar",
    reg_btn_to_phone: "Continue to Phone Number",
    reg_btn_cancel: "Cancel Registration",

    reg_q_phone: "What is your phone number?",
    reg_lbl_phone: "10-Digit Mobile Number",
    reg_ph_phone: "e.g. 9876543210",
    reg_help_phone: "We will send a short verification code to confirm this number.",
    reg_btn_to_aadhaar: "Continue to Aadhaar Identity",
    reg_btn_back: "Go Back",

    reg_q_aadhaar: "Enter your Aadhaar number",
    reg_lbl_aadhaar: "12-Digit Aadhaar Number",
    reg_ph_aadhaar: "e.g. 5432 1098 7654",
    reg_help_aadhaar: "This links your identity to your honey batches.",
    reg_btn_to_otp: "Send OTP Verification",

    reg_q_otp: "Enter the 6-digit OTP",
    reg_lbl_otp: "6-Digit Verification Code",
    reg_ph_otp: "e.g. 123456",
    reg_help_otp: "Simulated OTP: you can type any 6 digits to proceed.",
    reg_btn_to_village: "Verify Code & Continue",

    reg_q_village: "Where is your apiary located?",
    reg_lbl_village: "Village or Apiary Location",
    reg_ph_village: "e.g. Sundarban Delta, Sector 4",
    reg_help_village: "This location will be permanently recorded with your honey harvest batches.",
    reg_btn_complete: "Complete Verification",

    reg_conf_badge: "Registration Complete",
    reg_conf_title: "You are verified ✅",
    reg_conf_id_lbl: "Assigned Beekeeper ID",
    reg_conf_name: "Name",
    reg_conf_loc: "Apiary Location",
    reg_conf_id_link: "Linked Identity",
    reg_conf_sim_note: "Aadhaar verification simulated for demo purposes.",
    reg_conf_btn_record: "Record First Honey Batch",
    reg_conf_btn_my_batches: "View My Batches",
    reg_conf_btn_home: "Return to Home",

    // Batch Entry
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
    batch_opt_good: "Good (Pure, moisture < 20%)",
    batch_opt_avg: "Average (Acceptable grade)",
    batch_opt_retest: "Needs Retest (Pending check)",
    batch_btn_to_loc: "Continue to Apiary Location",

    batch_q_loc: "Confirm apiary location",
    batch_lbl_loc: "Apiary / Village Location",
    batch_ph_loc: "e.g. Sundarban Delta, Sector 4",
    batch_help_loc: "Auto-filled from beekeeper profile. You may edit if harvested at another site.",
    batch_btn_submit: "Save & Generate QR Code",

    batch_sealed_badge: "Batch Record Sealed",
    batch_sealed_title: "Your honey batch is now traceable",
    batch_sealed_id_lbl: "Batch ID",
    batch_sealed_scan_help: "Scan to inspect full origin ledger & SHA-256 integrity.",
    batch_btn_download_qr: "Download QR",
    batch_btn_view_provenance: "View Consumer Provenance Page",
    batch_btn_view_my_batches: "Go to My Batches",

    // My Batches
    my_batches_tagline: "Beekeeper Ledger",
    my_batches_title: "My Batches",
    my_batches_desc: "All past batches sealed cryptographically on HoneyChain.",
    my_batches_active_bk: "Beekeeper",
    my_batches_lbl_date: "Harvest Date",
    my_batches_lbl_qty: "Quantity",
    my_batches_lbl_quality: "Quality Result",
    my_batches_status_verified: "✅ Verified on Chain",
    my_batches_status_error: "⚠️ Verification Issue",
    my_batches_btn_view_qr: "View QR Code",
    my_batches_empty: "No harvest batches recorded yet for this beekeeper.",
    my_batches_btn_record_new: "Record New Honey Batch",
    my_batches_btn_switch: "Switch Beekeeper Profile",

    // QR Modal
    qr_modal_title: "Batch QR Code",
    qr_modal_desc: "Scan to verify harvest origin and chain integrity.",
    qr_modal_btn_download: "Download QR",
    qr_modal_btn_close: "Close",

    // Consumer Lookup
    lookup_title: "Track Honey Batch",
    lookup_desc: "Enter or scan your batch code to view the beekeeper and verified harvest origin.",
    lookup_lbl_input: "Enter or scan batch code",
    lookup_ph_input: "e.g. HC-8842 or HC-7109",
    lookup_btn_track: "Track My Honey",
    lookup_btn_scan_demo: "📷 Scan Honey Jar Label (Demo Camera)",
    lookup_scanning_msg: "Scanning Honey Jar Label...",
    lookup_lbl_bk_name: "Beekeeper Name",
    lookup_verified_aadhaar: "(Verified via Aadhaar ✅)",
    lookup_lbl_apiary: "Apiary Location",
    lookup_lbl_date: "Harvest Date",
    lookup_lbl_qty: "Quantity",
    lookup_lbl_quality: "Quality Test Result",
    lookup_lbl_crypto: "Cryptographic Integrity",
    lookup_chain_verified: "Chain Verified ✅",
    lookup_chain_error: "Issue Detected ⚠️",
    lookup_not_found_title: "No Record Found",
    lookup_not_found_desc: "No harvest record matches \"{query}\". Please check the code printed on the jar.",
    lookup_sample_codes: "Sample codes you can try: HC-8842 or HC-7109."
  },
  hi: {
    // Nav
    nav_home: "मुख्य पृष्ठ",
    nav_my_batches: "मेरे बैच",
    nav_register: "मधुमक्खी पालक पंजीकरण",
    nav_record_harvest: "शहद दर्ज करें",
    nav_verify_honey: "शहद सत्यापन",

    // Landing
    landing_tagline: "प्रामाणिक शहद बहीखाता",
    landing_title: "शुद्ध शहद उत्पत्ति एवं प्रमाण",
    landing_desc: "छत्ते से जार तक शुद्ध शहद की उत्पत्ति और प्रामाणिकता की जांच करें।",
    landing_beekeeper_btn: "मैं मधुमक्खी पालक हूँ",
    landing_consumer_btn: "मैं ग्राहक हूँ",

    // Beekeeper Profile Switcher
    select_bk_tagline: "मधुमक्खी पालन केंद्र",
    select_bk_title: "मधुमक्खी पालक प्रोफाइल चुनें",
    select_bk_desc: "सत्यापित प्रोफाइल चुनें या नया केंद्र पंजीकृत करें।",
    select_bk_register_new: "+ नया मधुमक्खी पालक पंजीकृत करें",
    select_bk_back_home: "मुख्य पृष्ठ पर लौटें",

    // Registration Wizard
    reg_step: "चरण {current} / {total}",
    reg_q_name: "आपका पूरा नाम क्या है?",
    reg_lbl_name: "मधुमक्खी पालक का पूरा नाम",
    reg_ph_name: "उदा. आनंद कुमार",
    reg_btn_to_phone: "मोबाइल नंबर पर आगे बढ़ें",
    reg_btn_cancel: "पंजीकरण रद्द करें",

    reg_q_phone: "आपका मोबाइल नंबर क्या है?",
    reg_lbl_phone: "१० अंकों का मोबाइल नंबर",
    reg_ph_phone: "उदा. 9876543210",
    reg_help_phone: "इस नंबर की पुष्टि के लिए हम एक सत्यापन कोड भेजेंगे।",
    reg_btn_to_aadhaar: "आधार पहचान पर आगे बढ़ें",
    reg_btn_back: "पीछे जाएं",

    reg_q_aadhaar: "अपनी आधार संख्या दर्ज करें",
    reg_lbl_aadhaar: "१२ अंकों की आधार संख्या",
    reg_ph_aadhaar: "उदा. 5432 1098 7654",
    reg_help_aadhaar: "यह आपकी पहचान को आपके शहद बैचों से जोड़ता है।",
    reg_btn_to_otp: "ओटीपी सत्यापन भेजें",

    reg_q_otp: "६ अंकों का ओटीपी दर्ज करें",
    reg_lbl_otp: "६ अंकों का सत्यापन कोड",
    reg_ph_otp: "उदा. 123456",
    reg_help_otp: "डेमो ओटीपी: आगे बढ़ने के लिए कोई भी ६ अंक दर्ज करें।",
    reg_btn_to_village: "कोड सत्यापित करें और आगे बढ़ें",

    reg_q_village: "आपका मधुमक्खी पालन केंद्र कहाँ स्थित है?",
    reg_lbl_village: "गाँव या केंद्र का स्थान",
    reg_ph_village: "उदा. सुंदरबन डेल्टा, सेक्टर 4",
    reg_help_village: "यह स्थान आपके शहद बैचों के साथ हमेशा के लिए दर्ज रहेगा।",
    reg_btn_complete: "सत्यापन पूर्ण करें",

    reg_conf_badge: "पंजीकरण पूर्ण",
    reg_conf_title: "आप सत्यापित हैं ✅",
    reg_conf_id_lbl: "आवंटित मधुमक्खी पालक आईडी",
    reg_conf_name: "नाम",
    reg_conf_loc: "केंद्र का स्थान",
    reg_conf_id_link: "जुड़ी पहचान",
    reg_conf_sim_note: "डेमो उद्देश्यों के लिए आधार सत्यापन अनुकरण किया गया है।",
    reg_conf_btn_record: "पहला शहद बैच दर्ज करें",
    reg_conf_btn_my_batches: "मेरे बैच देखें",
    reg_conf_btn_home: "मुख्य पृष्ठ पर लौटें",

    // Batch Entry
    batch_step: "चरण {current} / {total} • {name}",
    batch_q_date: "शहद निकालने की तारीख क्या थी?",
    batch_lbl_date: "शहद निकालने की तारीख",
    batch_btn_to_qty: "मात्रा पर आगे बढ़ें",
    batch_btn_cancel: "रद्द करें",

    batch_q_qty: "कितने किलोग्राम शहद निकाला गया?",
    batch_lbl_qty: "शहद की मात्रा (किलोग्राम में)",
    batch_ph_qty: "उदा. 25.0",
    batch_btn_to_quality: "गुणवत्ता जांच पर आगे बढ़ें",

    batch_q_quality: "गुणवत्ता जांच परिणाम चुनें",
    batch_lbl_quality: "शुद्धता एवं नमी जांच परिणाम",
    batch_opt_good: "उत्कृष्ट (शुद्ध, नमी < २०%)",
    batch_opt_avg: "सामान्य (स्वीकार्य स्तर)",
    batch_opt_retest: "पुनः जांच आवश्यक (लंबित)",
    batch_btn_to_loc: "स्थान पर आगे बढ़ें",

    batch_q_loc: "केंद्र का स्थान सुनिश्चित करें",
    batch_lbl_loc: "केंद्र / गाँव का स्थान",
    batch_ph_loc: "उदा. सुंदरबन डेल्टा, सेक्टर 4",
    batch_help_loc: "प्रोफाइल से स्वतः भरा गया। यदि अन्य स्थान से निकाला गया है तो बदल सकते हैं।",
    batch_btn_submit: "सुरक्षित करें और क्यूआर कोड बनाएं",

    batch_sealed_badge: "बैच रिकॉर्ड सील किया गया",
    batch_sealed_title: "आपका शहद बैच अब ट्रेस करने योग्य है",
    batch_sealed_id_lbl: "बैच आईडी",
    batch_sealed_scan_help: "पूर्ण उत्पत्ति बहीखाता और SHA-256 अखंडता जांचने के लिए स्कैन करें।",
    batch_btn_download_qr: "क्यूआर डाउनलोड करें",
    batch_btn_view_provenance: "ग्राहक उत्पत्ति पृष्ठ देखें",
    batch_btn_view_my_batches: "मेरे बैच पर जाएं",

    // My Batches
    my_batches_tagline: "मधुमक्खी पालक बहीखाता",
    my_batches_title: "मेरे बैच",
    my_batches_desc: "हनीचेन पर सुरक्षित किए गए आपके पिछले सभी शहद बैच।",
    my_batches_active_bk: "मधुमक्खी पालक",
    my_batches_lbl_date: "निकालने की तारीख",
    my_batches_lbl_qty: "मात्रा",
    my_batches_lbl_quality: "गुणवत्ता परिणाम",
    my_batches_status_verified: "✅ चेन पर सत्यापित",
    my_batches_status_error: "⚠️ सत्यापन समस्या",
    my_batches_btn_view_qr: "क्यूआर कोड देखें",
    my_batches_empty: "इस मधुमक्खी पालक के लिए अभी तक कोई शहद बैच दर्ज नहीं किया गया है।",
    my_batches_btn_record_new: "नया शहद बैच दर्ज करें",
    my_batches_btn_switch: "मधुमक्खी पालक बदलें",

    // QR Modal
    qr_modal_title: "बैच क्यूआर कोड",
    qr_modal_desc: "उत्पत्ति और चेन अखंडता सत्यापित करने के लिए स्कैन करें।",
    qr_modal_btn_download: "क्यूआर डाउनलोड करें",
    qr_modal_btn_close: "बंद करें",

    // Consumer Lookup
    lookup_title: "शहद बैच की जांच करें",
    lookup_desc: "मधुमक्खी पालक और सत्यापित उत्पत्ति देखने के लिए बैच कोड दर्ज करें या स्कैन करें।",
    lookup_lbl_input: "बैच कोड दर्ज करें या स्कैन करें",
    lookup_ph_input: "उदा. HC-8842 या HC-7109",
    lookup_btn_track: "मेरा शहद ट्रैक करें",
    lookup_btn_scan_demo: "📷 शहद जार लेबल स्कैन करें (कैमरा डेमो)",
    lookup_scanning_msg: "शहद जार लेबल स्कैन हो रहा है...",
    lookup_lbl_bk_name: "मधुमक्खी पालक का नाम",
    lookup_verified_aadhaar: "(आधार द्वारा सत्यापित ✅)",
    lookup_lbl_apiary: "केंद्र का स्थान",
    lookup_lbl_date: "निकालने की तारीख",
    lookup_lbl_qty: "मात्रा",
    lookup_lbl_quality: "गुणवत्ता जांच परिणाम",
    lookup_lbl_crypto: "क्रिप्टोग्राफिक अखंडता",
    lookup_chain_verified: "चेन सत्यापित ✅",
    lookup_chain_error: "समस्या पाई गई ⚠️",
    lookup_not_found_title: "कोई रिकॉर्ड नहीं मिला",
    lookup_not_found_desc: "कोई फसल रिकॉर्ड \"{query}\" से मेल नहीं खाता। कृपया जार पर मुद्रित कोड जांचें।",
    lookup_sample_codes: "आप इन उदाहरण कोडों को आज़मा सकते हैं: HC-8842 या HC-7109।"
  }
};

// --- Initial Seed Batches with Cryptographic Hashes ---
const initialBatches = [
  {
    batchId: "HC-7109",
    beekeeperId: "BK-102",
    beekeeperName: "Sunita Devi",
    village: "Nilgiri Foothills, Ward 2",
    hiveNumber: "Box #12",
    floralSource: "Mountain Eucalyptus",
    harvestDate: "2026-09-09",
    weightKg: "34.0",
    qualityResult: "Good",
    previousHash: "0000000000000000000000000000000000000000000000000000000000000000",
    hash: "",
    verified: true
  },
  {
    batchId: "HC-8842",
    beekeeperId: "BK-101",
    beekeeperName: "Ramesh Patel",
    village: "Sundarban Delta, Sector 4",
    hiveNumber: "Box #07",
    floralSource: "Wild Forest Blossom",
    harvestDate: "2026-09-08",
    weightKg: "28.5",
    qualityResult: "Good",
    previousHash: "0000000000000000000000000000000000000000000000000000000000000000",
    hash: "",
    verified: true
  }
];

const initialBeekeepers = [
  {
    id: "BK-101",
    name: "Ramesh Patel",
    phone: "98765 43210",
    aadhaarMasked: "XXXX-XXXX-4821",
    village: "Sundarban Delta, Sector 4",
    joinedDate: "2026-02-15",
    isVerified: true
  },
  {
    id: "BK-102",
    name: "Sunita Devi",
    phone: "91234 56780",
    aadhaarMasked: "XXXX-XXXX-9103",
    village: "Nilgiri Foothills, Ward 2",
    joinedDate: "2026-03-01",
    isVerified: true
  }
];

// --- React Context ---
const HoneyChainContext = createContext(null);

function HoneyChainProvider({ children }) {
  const [language, setLanguage] = useState("en");
  const [currentPage, setCurrentPage] = useState("landing");
  const [pageParams, setPageParams] = useState({});
  const [beekeepers, setBeekeepers] = useState(initialBeekeepers);
  const [batches, setBatches] = useState(initialBatches);
  const [activeBeekeeperId, setActiveBeekeeperId] = useState(null); // Unregistered by default; enabled upon registration

  // Translation helper function
  const t = (key, params = {}) => {
    const dict = translations[language] || translations.en;
    let text = dict[key] || translations.en[key] || key;
    Object.keys(params).forEach((p) => {
      text = text.replace(new RegExp(`\\{${p}\\}`, "g"), params[p]);
    });
    return text;
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "hi" : "en"));
  };

  // Initialize hash chain values on mount
  useEffect(() => {
    async function initSeedHashes() {
      if (window.HoneyChainHash) {
        // Build chain from oldest (batches[1]) to newest (batches[0])
        const b1Hash = await window.HoneyChainHash.createBatchHash(
          initialBatches[1],
          window.HoneyChainHash.GENESIS_HASH
        );
        const b2Hash = await window.HoneyChainHash.createBatchHash(
          initialBatches[0],
          b1Hash
        );
        setBatches([
          { ...initialBatches[0], previousHash: b1Hash, hash: b2Hash },
          { ...initialBatches[1], previousHash: window.HoneyChainHash.GENESIS_HASH, hash: b1Hash }
        ]);
      }
    }
    initSeedHashes();
  }, []);

  const navigate = (page, params = {}) => {
    setCurrentPage(page);
    setPageParams(params);
    window.scrollTo(0, 0);
  };

  const registerBeekeeper = (beekeeperData) => {
    const newId = `BK-${100 + beekeepers.length + 1}`;
    const rawAadhaar = beekeeperData.aadhaar || "000000000000";
    const last4 = rawAadhaar.slice(-4) || "0000";
    const masked = `XXXX-XXXX-${last4}`;

    const newRecord = {
      ...beekeeperData,
      id: newId,
      aadhaarMasked: masked,
      joinedDate: new Date().toISOString().split("T")[0],
      isVerified: true
    };
    setBeekeepers((prev) => [newRecord, ...prev]);
    setActiveBeekeeperId(newId);
    return newRecord;
  };

  const createBatch = async (batchData) => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newBatchId = `HC-${randomSuffix}`;
    const lastBatch = batches[0];
    const prevHash = lastBatch ? lastBatch.hash : (window.HoneyChainHash?.GENESIS_HASH || "0000000000000000000000000000000000000000000000000000000000000000");

    const newBatchPayload = {
      ...batchData,
      batchId: newBatchId,
      previousHash: prevHash,
      verified: true
    };

    let computedHash = "simulated_sha256_" + Math.random().toString(36).substring(2);
    if (window.HoneyChainHash) {
      computedHash = await window.HoneyChainHash.createBatchHash(newBatchPayload, prevHash);
    }

    const completedBatch = {
      ...newBatchPayload,
      hash: computedHash
    };

    setBatches((prev) => [completedBatch, ...prev]);
    return completedBatch;
  };

  const findBatch = (idQuery) => {
    if (!idQuery) return null;
    const cleanQuery = idQuery.trim().toUpperCase();
    return batches.find((b) => b.batchId.toUpperCase() === cleanQuery) || null;
  };

  const activeBeekeeper = activeBeekeeperId
    ? beekeepers.find((b) => b.id === activeBeekeeperId) || null
    : null;

  return (
    <HoneyChainContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        currentPage,
        pageParams,
        navigate,
        beekeepers,
        batches,
        activeBeekeeperId,
        setActiveBeekeeperId,
        activeBeekeeper,
        registerBeekeeper,
        createBatch,
        findBatch
      }}
    >
      {children}
    </HoneyChainContext.Provider>
  );
}

function useHoneyChain() {
  const context = useContext(HoneyChainContext);
  if (!context) {
    throw new Error("useHoneyChain must be used within HoneyChainProvider");
  }
  return context;
}

// --- Step Progress Dots Component ---
function StepTracker({ currentStep, totalSteps }) {
  return (
    <div className="hc-step-tracker" aria-label={`Step ${currentStep} of ${totalSteps}`}>
      {Array.from({ length: totalSteps }).map((_, idx) => {
        const stepNum = idx + 1;
        let statusClass = "";
        if (stepNum === currentStep) statusClass = "active";
        else if (stepNum < currentStep) statusClass = "completed";
        return <span key={stepNum} className={`hc-step-dot ${statusClass}`} />;
      })}
    </div>
  );
}

// --- Navigation Bar (Text Only, English / हिंदी Toggle) ---
function NavigationBar() {
  const { currentPage, navigate, activeBeekeeper, language, toggleLanguage, t } = useHoneyChain();

  const isVerifiedBeekeeper = Boolean(activeBeekeeper && activeBeekeeper.isVerified);

  const navItems = [
    { key: "landing", label: t("nav_home") },
    ...(isVerifiedBeekeeper ? [{ key: "my-batches", label: t("nav_my_batches") }] : []),
    { key: "register", label: t("nav_register") },
    { key: "batch-entry", label: t("nav_record_harvest") },
    { key: "lookup", label: t("nav_verify_honey") }
  ];

  return (
    <nav className="hc-nav-bar" aria-label="Main Navigation">
      <div className="hc-nav-container">
        <div className="hc-brand-group" onClick={() => navigate("landing")}>
          <img src="logo.svg" alt="HoneyChain Logo" className="hc-brand-logo" width="34" height="34" />
          <span className="hc-brand-text">HoneyChain</span>
        </div>
        
        <div className="hc-nav-links">
          {navItems.map((item) => {
            const isActive = currentPage === item.key;
            return (
              <button
                key={item.key}
                type="button"
                className={`hc-nav-link ${isActive ? "active" : ""}`}
                onClick={() => navigate(item.key)}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Text-Only Language Toggle (No Flag Icons) */}
        <button
          type="button"
          className="hc-lang-toggle"
          onClick={toggleLanguage}
          aria-label="Toggle language: English or Hindi"
          title="Switch Language / भाषा बदलें"
        >
          <span className={language === "en" ? "hc-lang-active" : "hc-lang-inactive"}>English</span>
          <span className="hc-lang-sep">/</span>
          <span className={language === "hi" ? "hc-lang-active" : "hc-lang-inactive"}>हिंदी</span>
        </button>
      </div>
    </nav>
  );
}

// --- 1. Landing Page ---
function LandingPage() {
  const { navigate, activeBeekeeper, t } = useHoneyChain();

  const handleBeekeeperClick = () => {
    if (activeBeekeeper && activeBeekeeper.isVerified) {
      navigate("my-batches");
    } else {
      navigate("register");
    }
  };

  return (
    <div className="hc-screen-container">
      <header className="hc-header" style={{ textAlign: "center" }}>
        <span className="hc-tagline">{t("landing_tagline")}</span>
        <h1 className="hc-h1" style={{ fontSize: "2.5rem", marginTop: "8px", marginBottom: "12px" }}>
          {t("landing_title")}
        </h1>
        <p className="hc-body" style={{ maxWidth: "460px", margin: "0 auto" }}>
          {t("landing_desc")}
        </p>
      </header>

      {/* Single Simple Minimalist Honey Hive & Floating Bee Illustration */}
      <main className="hc-content" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div className="hc-illustration hc-float-bee" aria-hidden="true">
          <svg width="150" height="150" viewBox="0 0 100 100" fill="none" stroke="#3A2E26" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            {/* Minimalist Artisan Beehive */}
            <path d="M50 14 C32 14 24 24 24 32 C24 38 28 42 28 48 C28 54 22 58 22 66 C22 76 32 82 50 82 C68 82 78 76 78 66 C78 58 72 54 72 48 C72 42 76 38 76 32 C76 24 68 14 50 14 Z" />
            <path d="M30 36 H70" />
            <path d="M26 52 H74" />
            <path d="M28 68 H72" />
            {/* Beehive Door */}
            <ellipse cx="50" cy="68" rx="8" ry="6" fill="#3A2E26" />
            
            {/* Warm Orange Golden Honey Drop */}
            <path d="M50 38 C46 43 42 46 42 50 A8 8 0 0 0 58 50 C58 46 54 43 50 38 Z" fill="#E8892B" stroke="#E8892B" strokeWidth="1.5" />
            
            {/* Minimalist Line Bee Accent */}
            <ellipse cx="78" cy="24" rx="5" ry="3" fill="#E8892B" stroke="#3A2E26" strokeWidth="1.5" />
            <path d="M78 21 C76 17 73 17 74 20" stroke="#3A2E26" strokeWidth="1.5" />
            <path d="M80 21 C82 17 85 17 84 20" stroke="#3A2E26" strokeWidth="1.5" />
          </svg>
        </div>
      </main>

      {/* Two Large Buttons Only */}
      <footer className="hc-footer-action hc-stack-md">
        <button
          className="hc-button-primary"
          type="button"
          onClick={handleBeekeeperClick}
        >
          <span>{t("landing_beekeeper_btn")}</span>
        </button>

        <button
          className="hc-button-secondary"
          type="button"
          onClick={() => navigate("lookup")}
        >
          <span>{t("landing_consumer_btn")}</span>
        </button>
      </footer>
    </div>
  );
}

// --- 2. Beekeeper Registration Wizard (One Question Per Screen) ---
function BeekeeperRegistrationPage() {
  const { registerBeekeeper, navigate, t } = useHoneyChain();
  const [step, setStep] = useState(1);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [otp, setOtp] = useState("");
  const [village, setVillage] = useState("");

  const [registeredProfile, setRegisteredProfile] = useState(null);

  const handleAadhaarChange = (e) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 12);
    setAadhaar(raw);
  };

  const handlePhoneChange = (e) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhone(raw);
  };

  const handleOtpChange = (e) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(raw);
  };

  const handleCompleteRegistration = () => {
    const record = registerBeekeeper({
      name: name.trim(),
      phone: phone.trim(),
      aadhaar: aadhaar.trim(),
      village: village.trim()
    });
    setRegisteredProfile(record);
    setStep("confirmed");
  };

  // Confirmation View
  if (step === "confirmed" && registeredProfile) {
    return (
      <div className="hc-screen-container">
        <header className="hc-header">
          <div className="hc-icon-text-pair" style={{ marginBottom: "16px" }}>
            <svg className="hc-icon-lg" viewBox="0 0 24 24">
              <polyline className="hc-animated-check" points="20 6 9 17 4 12"></polyline>
            </svg>
            <span className="hc-h2" style={{ marginBottom: 0 }}>{t("reg_conf_badge")}</span>
          </div>
          <h1 className="hc-h1">{t("reg_conf_title")}</h1>
          <span className="hc-text-muted">{t("reg_conf_id_lbl")}</span>
          <div className="hc-display-number">{registeredProfile.id}</div>
        </header>

        <main className="hc-content hc-stack-md">
          <p className="hc-body">
            {t("reg_conf_name")}: <strong>{registeredProfile.name}</strong>
            <br />
            {t("reg_conf_loc")}: <strong>{registeredProfile.village}</strong>
            <br />
            {t("reg_conf_id_link")}: <strong>{registeredProfile.aadhaarMasked}</strong>
          </p>

          <p className="hc-text-muted" style={{ fontStyle: "italic" }}>
            {t("reg_conf_sim_note")}
          </p>
        </main>

        <footer className="hc-footer-action hc-stack-sm">
          <button
            className="hc-button-primary"
            type="button"
            onClick={() => navigate("batch-entry", { selectedBeekeeperId: registeredProfile.id })}
          >
            <span>{t("reg_conf_btn_record")}</span>
            <svg className="hc-icon" viewBox="0 0 24 24">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>

          <button
            className="hc-button-secondary"
            type="button"
            onClick={() => navigate("my-batches")}
          >
            <span>{t("reg_conf_btn_my_batches")}</span>
          </button>

          <button
            className="hc-button-text"
            type="button"
            onClick={() => navigate("landing")}
          >
            <span>{t("reg_conf_btn_home")}</span>
          </button>
        </footer>
      </div>
    );
  }

  // Step 1: Name
  if (step === 1) {
    return (
      <div className="hc-screen-container">
        <header className="hc-header">
          <div className="hc-header-row">
            <span className="hc-text-muted">{t("reg_step", { current: 1, total: 5 })}</span>
            <StepTracker currentStep={1} totalSteps={5} />
          </div>
          <h1 className="hc-h1" style={{ marginTop: "4px" }}>{t("reg_q_name")}</h1>
        </header>

        <main className="hc-content">
          <label className="hc-label" htmlFor="step-name">
            {t("reg_lbl_name")}
          </label>
          <input
            id="step-name"
            className="hc-input"
            type="text"
            placeholder={t("reg_ph_name")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
        </main>

        <footer className="hc-footer-action hc-stack-sm">
          <button
            className="hc-button-primary"
            type="button"
            disabled={!name.trim()}
            onClick={() => setStep(2)}
          >
            <span>{t("reg_btn_to_phone")}</span>
            <svg className="hc-icon" viewBox="0 0 24 24">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>

          <button
            className="hc-button-text"
            type="button"
            onClick={() => navigate("landing")}
          >
            <span>{t("reg_btn_cancel")}</span>
          </button>
        </footer>
      </div>
    );
  }

  // Step 2: Phone Number
  if (step === 2) {
    return (
      <div className="hc-screen-container">
        <header className="hc-header">
          <div className="hc-header-row">
            <span className="hc-text-muted">{t("reg_step", { current: 2, total: 5 })}</span>
            <StepTracker currentStep={2} totalSteps={5} />
          </div>
          <h1 className="hc-h1" style={{ marginTop: "4px" }}>{t("reg_q_phone")}</h1>
        </header>

        <main className="hc-content">
          <label className="hc-label" htmlFor="step-phone">
            {t("reg_lbl_phone")}
          </label>
          <input
            id="step-phone"
            className="hc-input"
            type="tel"
            placeholder={t("reg_ph_phone")}
            value={phone}
            onChange={handlePhoneChange}
            autoFocus
          />
          <p className="hc-text-muted" style={{ marginTop: "12px", marginBottom: 0 }}>
            {t("reg_help_phone")}
          </p>
        </main>

        <footer className="hc-footer-action hc-stack-sm">
          <button
            className="hc-button-primary"
            type="button"
            disabled={phone.length < 10}
            onClick={() => setStep(3)}
          >
            <span>{t("reg_btn_to_aadhaar")}</span>
            <svg className="hc-icon" viewBox="0 0 24 24">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>

          <button
            className="hc-button-text"
            type="button"
            onClick={() => setStep(1)}
          >
            <span>{t("reg_btn_back")}</span>
          </button>
        </footer>
      </div>
    );
  }

  // Step 3: Aadhaar Number
  if (step === 3) {
    return (
      <div className="hc-screen-container">
        <header className="hc-header">
          <div className="hc-header-row">
            <span className="hc-text-muted">{t("reg_step", { current: 3, total: 5 })}</span>
            <StepTracker currentStep={3} totalSteps={5} />
          </div>
          <h1 className="hc-h1" style={{ marginTop: "4px" }}>{t("reg_q_aadhaar")}</h1>
        </header>

        <main className="hc-content">
          <label className="hc-label" htmlFor="step-aadhaar">
            {t("reg_lbl_aadhaar")}
          </label>
          <input
            id="step-aadhaar"
            className="hc-input"
            type="text"
            placeholder={t("reg_ph_aadhaar")}
            value={aadhaar}
            onChange={handleAadhaarChange}
            autoFocus
          />
          <p className="hc-text-muted" style={{ marginTop: "12px", marginBottom: 0 }}>
            {t("reg_help_aadhaar")}
          </p>
        </main>

        <footer className="hc-footer-action hc-stack-sm">
          <button
            className="hc-button-primary"
            type="button"
            disabled={aadhaar.length < 12}
            onClick={() => setStep(4)}
          >
            <span>{t("reg_btn_to_otp")}</span>
            <svg className="hc-icon" viewBox="0 0 24 24">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>

          <button
            className="hc-button-text"
            type="button"
            onClick={() => setStep(2)}
          >
            <span>{t("reg_btn_back")}</span>
          </button>
        </footer>
      </div>
    );
  }

  // Step 4: Simulated OTP
  if (step === 4) {
    return (
      <div className="hc-screen-container">
        <header className="hc-header">
          <div className="hc-header-row">
            <span className="hc-text-muted">{t("reg_step", { current: 4, total: 5 })}</span>
            <StepTracker currentStep={4} totalSteps={5} />
          </div>
          <h1 className="hc-h1" style={{ marginTop: "4px" }}>{t("reg_q_otp")}</h1>
        </header>

        <main className="hc-content">
          <label className="hc-label" htmlFor="step-otp">
            {t("reg_lbl_otp")}
          </label>
          <input
            id="step-otp"
            className="hc-input"
            type="text"
            placeholder={t("reg_ph_otp")}
            value={otp}
            onChange={handleOtpChange}
            autoFocus
          />
          <p className="hc-text-muted" style={{ marginTop: "12px", marginBottom: 0 }}>
            {t("reg_help_otp")}
          </p>
        </main>

        <footer className="hc-footer-action hc-stack-sm">
          <button
            className="hc-button-primary"
            type="button"
            disabled={otp.length < 6}
            onClick={() => setStep(5)}
          >
            <span>{t("reg_btn_to_village")}</span>
            <svg className="hc-icon" viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </button>

          <button
            className="hc-button-text"
            type="button"
            onClick={() => setStep(3)}
          >
            <span>{t("reg_btn_back")}</span>
          </button>
        </footer>
      </div>
    );
  }

  // Step 5: Apiary Location
  if (step === 5) {
    return (
      <div className="hc-screen-container">
        <header className="hc-header">
          <div className="hc-header-row">
            <span className="hc-text-muted">{t("reg_step", { current: 5, total: 5 })}</span>
            <StepTracker currentStep={5} totalSteps={5} />
          </div>
          <h1 className="hc-h1" style={{ marginTop: "4px" }}>{t("reg_q_village")}</h1>
        </header>

        <main className="hc-content">
          <label className="hc-label" htmlFor="step-village">
            {t("reg_lbl_village")}
          </label>
          <input
            id="step-village"
            className="hc-input"
            type="text"
            placeholder={t("reg_ph_village")}
            value={village}
            onChange={(e) => setVillage(e.target.value)}
            autoFocus
          />
          <p className="hc-text-muted" style={{ marginTop: "12px", marginBottom: 0 }}>
            {t("reg_help_village")}
          </p>
        </main>

        <footer className="hc-footer-action hc-stack-sm">
          <button
            className="hc-button-primary"
            type="button"
            disabled={!village.trim()}
            onClick={handleCompleteRegistration}
          >
            <span>{t("reg_btn_complete")}</span>
            <svg className="hc-icon" viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </button>

          <button
            className="hc-button-text"
            type="button"
            onClick={() => setStep(4)}
          >
            <span>{t("reg_btn_back")}</span>
          </button>
        </footer>
      </div>
    );
  }

  return null;
}

// --- 3. Batch Entry Page (Step-by-Step, One Field Per Screen) ---
function BatchEntryPage() {
  const { beekeepers, activeBeekeeper, createBatch, pageParams, navigate, t } = useHoneyChain();

  const selectedBeekeeper = beekeepers.find((b) => b.id === pageParams.selectedBeekeeperId) || activeBeekeeper || beekeepers[0] || {
    id: "BK-101",
    name: "Ramesh Patel",
    village: "Sundarban Delta, Sector 4"
  };

  const [step, setStep] = useState(1);
  const [harvestDate, setHarvestDate] = useState(new Date().toISOString().split("T")[0]);
  const [quantityKg, setQuantityKg] = useState("");
  const [qualityResult, setQualityResult] = useState("Good");
  const [location, setLocation] = useState(selectedBeekeeper.village || "");
  const [createdBatch, setCreatedBatch] = useState(null);

  const qrContainerRef = useRef(null);

  useEffect(() => {
    if (step === "completed" && createdBatch && qrContainerRef.current) {
      qrContainerRef.current.innerHTML = "";
      if (window.QRCode) {
        new window.QRCode(qrContainerRef.current, {
          text: `https://honeychain.org/verify?batch=${createdBatch.batchId}`,
          width: 180,
          height: 180,
          colorDark: "#3A2E26",
          colorLight: "#FFFFFF",
          correctLevel: window.QRCode.CorrectLevel.H
        });
      }
    }
  }, [step, createdBatch]);

  const handleFinalSubmit = async () => {
    const newRecord = await createBatch({
      beekeeperId: selectedBeekeeper.id,
      beekeeperName: selectedBeekeeper.name,
      village: location.trim() || selectedBeekeeper.village,
      hiveNumber: "Apiary Box #01",
      floralSource: "Pure Multifloral Blossom",
      harvestDate: harvestDate,
      weightKg: quantityKg.trim(),
      qualityResult: qualityResult
    });

    setCreatedBatch(newRecord);
    setStep("completed");
  };

  const handleDownloadQR = () => {
    if (!qrContainerRef.current) return;
    const canvas = qrContainerRef.current.querySelector("canvas");
    const img = qrContainerRef.current.querySelector("img");

    let dataUrl = "";
    if (canvas) {
      dataUrl = canvas.toDataURL("image/png");
    } else if (img && img.src) {
      dataUrl = img.src;
    }

    if (dataUrl) {
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `HoneyChain_QR_${createdBatch?.batchId || "Batch"}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  // Result Screen
  if (step === "completed" && createdBatch) {
    return (
      <div className="hc-screen-container">
        <header className="hc-header" style={{ textAlign: "center" }}>
          <span className="hc-tagline">{t("batch_sealed_badge")}</span>
          <h1 className="hc-h1" style={{ marginTop: "8px" }}>
            {t("batch_sealed_title")}
          </h1>
          <p className="hc-body">
            {t("batch_sealed_id_lbl")}: <strong>{createdBatch.batchId}</strong>
          </p>
        </header>

        <main className="hc-content" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div className="hc-qr-wrapper" ref={qrContainerRef}>
            {/* QRCode attaches here */}
          </div>
          <p className="hc-text-muted" style={{ textAlign: "center", marginTop: "8px" }}>
            {t("batch_sealed_scan_help")}
          </p>
        </main>

        <footer className="hc-footer-action hc-stack-sm">
          <button
            className="hc-button-primary"
            type="button"
            onClick={handleDownloadQR}
          >
            <span>{t("batch_btn_download_qr")}</span>
            <svg className="hc-icon" viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </button>

          <button
            className="hc-button-secondary"
            type="button"
            onClick={() => navigate("my-batches")}
          >
            <span>{t("batch_btn_view_my_batches")}</span>
          </button>

          <button
            className="hc-button-text"
            type="button"
            onClick={() => navigate("lookup", { autoQuery: createdBatch.batchId })}
          >
            <span>{t("batch_btn_view_provenance")}</span>
          </button>
        </footer>
      </div>
    );
  }

  // Step 1: Harvest Date
  if (step === 1) {
    return (
      <div className="hc-screen-container">
        <header className="hc-header">
          <div className="hc-header-row">
            <span className="hc-text-muted">{t("batch_step", { current: 1, total: 4, name: selectedBeekeeper.name })}</span>
            <StepTracker currentStep={1} totalSteps={4} />
          </div>
          <h1 className="hc-h1" style={{ marginTop: "4px" }}>{t("batch_q_date")}</h1>
        </header>

        <main className="hc-content">
          <label className="hc-label" htmlFor="step-date">
            {t("batch_lbl_date")}
          </label>
          <input
            id="step-date"
            className="hc-input"
            type="date"
            value={harvestDate}
            onChange={(e) => setHarvestDate(e.target.value)}
            autoFocus
            required
          />
        </main>

        <footer className="hc-footer-action hc-stack-sm">
          <button
            className="hc-button-primary"
            type="button"
            disabled={!harvestDate}
            onClick={() => setStep(2)}
          >
            <span>{t("batch_btn_to_qty")}</span>
            <svg className="hc-icon" viewBox="0 0 24 24">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>

          <button
            className="hc-button-text"
            type="button"
            onClick={() => navigate("landing")}
          >
            <span>{t("batch_btn_cancel")}</span>
          </button>
        </footer>
      </div>
    );
  }

  // Step 2: Quantity in kg
  if (step === 2) {
    return (
      <div className="hc-screen-container">
        <header className="hc-header">
          <div className="hc-header-row">
            <span className="hc-text-muted">{t("batch_step", { current: 2, total: 4, name: selectedBeekeeper.name })}</span>
            <StepTracker currentStep={2} totalSteps={4} />
          </div>
          <h1 className="hc-h1" style={{ marginTop: "4px" }}>{t("batch_q_qty")}</h1>
        </header>

        <main className="hc-content">
          <label className="hc-label" htmlFor="step-qty">
            {t("batch_lbl_qty")}
          </label>
          <input
            id="step-qty"
            className="hc-input"
            type="number"
            step="0.1"
            min="0.1"
            placeholder={t("batch_ph_qty")}
            value={quantityKg}
            onChange={(e) => setQuantityKg(e.target.value)}
            autoFocus
          />
        </main>

        <footer className="hc-footer-action hc-stack-sm">
          <button
            className="hc-button-primary"
            type="button"
            disabled={!quantityKg || Number(quantityKg) <= 0}
            onClick={() => setStep(3)}
          >
            <span>{t("batch_btn_to_quality")}</span>
            <svg className="hc-icon" viewBox="0 0 24 24">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>

          <button
            className="hc-button-text"
            type="button"
            onClick={() => setStep(1)}
          >
            <span>{t("reg_btn_back")}</span>
          </button>
        </footer>
      </div>
    );
  }

  // Step 3: Quality Test Result
  if (step === 3) {
    return (
      <div className="hc-screen-container">
        <header className="hc-header">
          <div className="hc-header-row">
            <span className="hc-text-muted">{t("batch_step", { current: 3, total: 4, name: selectedBeekeeper.name })}</span>
            <StepTracker currentStep={3} totalSteps={4} />
          </div>
          <h1 className="hc-h1" style={{ marginTop: "4px" }}>{t("batch_q_quality")}</h1>
        </header>

        <main className="hc-content">
          <label className="hc-label" htmlFor="step-quality">
            {t("batch_lbl_quality")}
          </label>
          <select
            id="step-quality"
            className="hc-select"
            value={qualityResult}
            onChange={(e) => setQualityResult(e.target.value)}
            autoFocus
          >
            <option value="Good">{t("batch_opt_good")}</option>
            <option value="Average">{t("batch_opt_avg")}</option>
            <option value="Needs Retest">{t("batch_opt_retest")}</option>
          </select>
        </main>

        <footer className="hc-footer-action hc-stack-sm">
          <button
            className="hc-button-primary"
            type="button"
            onClick={() => setStep(4)}
          >
            <span>{t("batch_btn_to_loc")}</span>
            <svg className="hc-icon" viewBox="0 0 24 24">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>

          <button
            className="hc-button-text"
            type="button"
            onClick={() => setStep(2)}
          >
            <span>{t("reg_btn_back")}</span>
          </button>
        </footer>
      </div>
    );
  }

  // Step 4: Apiary Location
  if (step === 4) {
    return (
      <div className="hc-screen-container">
        <header className="hc-header">
          <div className="hc-header-row">
            <span className="hc-text-muted">{t("batch_step", { current: 4, total: 4, name: selectedBeekeeper.name })}</span>
            <StepTracker currentStep={4} totalSteps={4} />
          </div>
          <h1 className="hc-h1" style={{ marginTop: "4px" }}>{t("batch_q_loc")}</h1>
        </header>

        <main className="hc-content">
          <label className="hc-label" htmlFor="step-loc">
            {t("batch_lbl_loc")}
          </label>
          <input
            id="step-loc"
            className="hc-input"
            type="text"
            placeholder={t("batch_ph_loc")}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            autoFocus
          />
          <p className="hc-text-muted" style={{ marginTop: "12px", marginBottom: 0 }}>
            {t("batch_help_loc")}
          </p>
        </main>

        <footer className="hc-footer-action hc-stack-sm">
          <button
            className="hc-button-primary"
            type="button"
            disabled={!location.trim()}
            onClick={handleFinalSubmit}
          >
            <span>{t("batch_btn_submit")}</span>
            <svg className="hc-icon" viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </button>

          <button
            className="hc-button-text"
            type="button"
            onClick={() => setStep(3)}
          >
            <span>{t("reg_btn_back")}</span>
          </button>
        </footer>
      </div>
    );
  }

  return null;
}

// --- 4. "My Batches" Page (Simple Vertical List, No Cards, Verified on Chain Indicator) ---
function MyBatchesPage() {
  const { batches, activeBeekeeper, navigate, t } = useHoneyChain();
  const [selectedBatchForQR, setSelectedBatchForQR] = useState(null);
  const [chainValid, setChainValid] = useState(true);
  const modalQrRef = useRef(null);

  // Run chain verification on mount / batches update
  useEffect(() => {
    async function checkChainIntegrity() {
      if (window.HoneyChainHash) {
        const audit = await window.HoneyChainHash.verifyChain(batches);
        setChainValid(audit.isValid);
      }
    }
    checkChainIntegrity();
  }, [batches]);

  // Generate QR in Modal when a batch is chosen for viewing
  useEffect(() => {
    if (selectedBatchForQR && modalQrRef.current) {
      modalQrRef.current.innerHTML = "";
      if (window.QRCode) {
        new window.QRCode(modalQrRef.current, {
          text: `https://honeychain.org/verify?batch=${selectedBatchForQR.batchId}`,
          width: 190,
          height: 190,
          colorDark: "#3A2E26",
          colorLight: "#FFFFFF",
          correctLevel: window.QRCode.CorrectLevel.H
        });
      }
    }
  }, [selectedBatchForQR]);

  const handleDownloadModalQR = () => {
    if (!modalQrRef.current || !selectedBatchForQR) return;
    const canvas = modalQrRef.current.querySelector("canvas");
    const img = modalQrRef.current.querySelector("img");

    let dataUrl = "";
    if (canvas) {
      dataUrl = canvas.toDataURL("image/png");
    } else if (img && img.src) {
      dataUrl = img.src;
    }

    if (dataUrl) {
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `HoneyChain_QR_${selectedBatchForQR.batchId}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  // Filter batches belonging exclusively to the current active verified beekeeper
  const beekeeperBatches = batches.filter(
    (b) => activeBeekeeper && b.beekeeperId === activeBeekeeper.id
  );

  return (
    <div className="hc-screen-container">
      <header className="hc-header">
        <span className="hc-tagline">{t("my_batches_tagline")}</span>
        <h1 className="hc-h1" style={{ marginTop: "4px" }}>
          {t("my_batches_title")}
        </h1>
        <p className="hc-body" style={{ marginBottom: "6px" }}>
          {t("my_batches_desc")}
        </p>
        {activeBeekeeper && (
          <p className="hc-text-muted" style={{ fontWeight: 600 }}>
            {t("my_batches_active_bk")}: {activeBeekeeper.name} ({activeBeekeeper.id}) • {activeBeekeeper.village}
          </p>
        )}
      </header>

      <main className="hc-content" style={{ justifyContent: "flex-start" }}>
        {beekeeperBatches.length === 0 ? (
          <div style={{ padding: "32px 0", textAlign: "center" }}>
            <p className="hc-body">{t("my_batches_empty")}</p>
          </div>
        ) : (
          /* Simple Vertical List (Not Cards, No Boxes, No Shadows, No Tables, No Filters) */
          <ul className="hc-batch-list">
            {beekeeperBatches.map((batch) => {
              const isVerified = chainValid && batch.verified;
              return (
                <li key={batch.batchId} className="hc-batch-list-item">
                  <div className="hc-batch-header-row">
                    <span className="hc-batch-title">{batch.batchId}</span>
                    <span className="hc-batch-status-tag">
                      {isVerified
                        ? t("my_batches_status_verified")
                        : t("my_batches_status_error")}
                    </span>
                  </div>

                  <div className="hc-batch-meta-grid">
                    <div className="hc-batch-meta-line">
                      <strong>{t("my_batches_lbl_date")}:</strong> {batch.harvestDate}
                    </div>
                    <div className="hc-batch-meta-line">
                      <strong>{t("my_batches_lbl_qty")}:</strong> {batch.weightKg} kg
                    </div>
                    <div className="hc-batch-meta-line">
                      <strong>{t("my_batches_lbl_quality")}:</strong> {batch.qualityResult || "Good"}
                    </div>
                  </div>

                  {/* Small QR Line Icon + Text Button to Re-view & Re-download */}
                  <button
                    type="button"
                    className="hc-batch-qr-btn"
                    onClick={() => setSelectedBatchForQR(batch)}
                    aria-label={`View QR code for batch ${batch.batchId}`}
                  >
                    <svg className="hc-icon" style={{ width: "20px", height: "20px" }} viewBox="0 0 24 24">
                      <rect x="3" y="3" width="7" height="7"></rect>
                      <rect x="14" y="3" width="7" height="7"></rect>
                      <rect x="14" y="14" width="7" height="7"></rect>
                      <rect x="3" y="14" width="7" height="7"></rect>
                    </svg>
                    <span>{t("my_batches_btn_view_qr")}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </main>

      <footer className="hc-footer-action hc-stack-sm">
        <button
          className="hc-button-primary"
          type="button"
          onClick={() => navigate("batch-entry", { selectedBeekeeperId: activeBeekeeper?.id })}
        >
          <span>{t("my_batches_btn_record_new")}</span>
          <svg className="hc-icon" viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>

        <button
          className="hc-button-text"
          type="button"
          onClick={() => navigate("beekeeper-select")}
        >
          <span>{t("my_batches_btn_switch")}</span>
        </button>
      </footer>

      {/* Re-View / Re-Download QR Code Modal */}
      {selectedBatchForQR && (
        <div className="hc-modal-backdrop" onClick={() => setSelectedBatchForQR(null)}>
          <div className="hc-modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="hc-tagline">{selectedBatchForQR.batchId}</span>
            <h2 className="hc-h2" style={{ marginTop: "4px" }}>
              {t("qr_modal_title")}
            </h2>
            <p className="hc-text-muted" style={{ marginBottom: "16px" }}>
              {selectedBatchForQR.harvestDate} • {selectedBatchForQR.weightKg} kg • {selectedBatchForQR.qualityResult}
            </p>

            <div className="hc-qr-wrapper" ref={modalQrRef}>
              {/* Dynamic QR injected here */}
            </div>

            <p className="hc-text-muted" style={{ fontSize: "16px", marginTop: "8px", marginBottom: "20px" }}>
              {t("qr_modal_desc")}
            </p>

            <div className="hc-stack-xs">
              <button
                className="hc-button-primary"
                type="button"
                onClick={handleDownloadModalQR}
              >
                <span>{t("qr_modal_btn_download")}</span>
                <svg className="hc-icon" viewBox="0 0 24 24">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
              </button>

              <button
                className="hc-button-text"
                type="button"
                onClick={() => setSelectedBatchForQR(null)}
              >
                <span>{t("qr_modal_btn_close")}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- 5. Beekeeper Profile Switcher / Login Page ---
function BeekeeperSelectPage() {
  const { beekeepers, activeBeekeeperId, setActiveBeekeeperId, navigate, t } = useHoneyChain();

  const handleSelect = (id) => {
    setActiveBeekeeperId(id);
    navigate("my-batches");
  };

  return (
    <div className="hc-screen-container">
      <header className="hc-header">
        <span className="hc-tagline">{t("select_bk_tagline")}</span>
        <h1 className="hc-h1" style={{ marginTop: "4px" }}>
          {t("select_bk_title")}
        </h1>
        <p className="hc-body">
          {t("select_bk_desc")}
        </p>
      </header>

      <main className="hc-content" style={{ justifyContent: "flex-start" }}>
        <ul className="hc-provenance-list" style={{ marginTop: 0 }}>
          {beekeepers.map((bk) => {
            const isSelected = bk.id === activeBeekeeperId;
            return (
              <li
                key={bk.id}
                className="hc-provenance-item"
                style={{
                  cursor: "pointer",
                  paddingBottom: "16px",
                  borderBottom: "1.5px solid var(--color-border-input)"
                }}
                onClick={() => handleSelect(bk.id)}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <span className="hc-provenance-label">{bk.id} • {bk.village}</span>
                    <div className="hc-provenance-value">{bk.name}</div>
                  </div>
                  {isSelected && (
                    <span className="hc-highlight" style={{ fontSize: "16px" }}>Active ✓</span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </main>

      <footer className="hc-footer-action hc-stack-sm">
        <button
          className="hc-button-primary"
          type="button"
          onClick={() => navigate("register")}
        >
          <span>{t("select_bk_register_new")}</span>
        </button>

        <button
          className="hc-button-text"
          type="button"
          onClick={() => navigate("landing")}
        >
          <span>{t("select_bk_back_home")}</span>
        </button>
      </footer>
    </div>
  );
}

// --- 6. Consumer Lookup Page ---
function ConsumerLookupPage() {
  const { findBatch, batches, pageParams, t } = useHoneyChain();
  const [searchQuery, setSearchQuery] = useState(pageParams.autoQuery || "");
  const [searched, setSearched] = useState(Boolean(pageParams.autoQuery));
  const [resultBatch, setResultBatch] = useState(() =>
    pageParams.autoQuery ? findBatch(pageParams.autoQuery) : null
  );
  const [chainStatus, setChainStatus] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    async function auditChain() {
      if (searched && resultBatch && window.HoneyChainHash) {
        const audit = await window.HoneyChainHash.verifyChain(batches);
        setChainStatus(audit.isValid ? t("lookup_chain_verified") : t("lookup_chain_error"));
      }
    }
    auditChain();
  }, [searched, resultBatch, batches]);

  const handleLookup = async (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    const res = findBatch(searchQuery);
    setResultBatch(res);
    setSearched(true);
    setIsScanning(false);

    if (window.HoneyChainHash) {
      const audit = await window.HoneyChainHash.verifyChain(batches);
      setChainStatus(audit.isValid ? t("lookup_chain_verified") : t("lookup_chain_error"));
    }
  };

  // Simulated Instant Scanner for Jar QR Code
  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      const sampleId = batches[0]?.batchId || "HC-7109";
      setSearchQuery(sampleId);
      const res = findBatch(sampleId);
      setResultBatch(res);
      setSearched(true);
      setIsScanning(false);
    }, 1400);
  };

  return (
    <div className="hc-screen-container">
      <header className="hc-header">
        <h1 className="hc-h1">{t("lookup_title")}</h1>
        <p className="hc-body">
          {t("lookup_desc")}
        </p>
      </header>

      <main className="hc-content">
        {/* Scanner Simulation Viewfinder */}
        {isScanning ? (
          <div className="hc-scanner-box">
            <div className="hc-scanner-laser"></div>
            <span className="hc-text-muted" style={{ fontWeight: 600 }}>{t("lookup_scanning_msg")}</span>
          </div>
        ) : (
          <form onSubmit={handleLookup} className="hc-stack-sm">
            <label className="hc-label" htmlFor="consumer-batch-input">
              {t("lookup_lbl_input")}
            </label>
            <input
              id="consumer-batch-input"
              className="hc-input"
              type="text"
              placeholder={t("lookup_ph_input")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </form>
        )}

        {/* Calm, Clean Vertical List (Not Cards, Not Boxes) */}
        {searched && resultBatch && !isScanning && (
          <ul className="hc-provenance-list">
            <li className="hc-provenance-item">
              <span className="hc-provenance-label">{t("lookup_lbl_bk_name")}</span>
              <div className="hc-provenance-value hc-icon-text-pair">
                <span>{resultBatch.beekeeperName}</span>
                <span className="hc-text-muted" style={{ fontSize: "16px", fontWeight: "normal" }}>
                  {t("lookup_verified_aadhaar")}
                </span>
              </div>
            </li>

            <li className="hc-provenance-item">
              <span className="hc-provenance-label">{t("lookup_lbl_apiary")}</span>
              <div className="hc-provenance-value">{resultBatch.village}</div>
            </li>

            <li className="hc-provenance-item">
              <span className="hc-provenance-label">{t("lookup_lbl_date")}</span>
              <div className="hc-provenance-value">{resultBatch.harvestDate}</div>
            </li>

            <li className="hc-provenance-item">
              <span className="hc-provenance-label">{t("lookup_lbl_qty")}</span>
              <div className="hc-provenance-value">{resultBatch.weightKg} kg</div>
            </li>

            <li className="hc-provenance-item">
              <span className="hc-provenance-label">{t("lookup_lbl_quality")}</span>
              <div className="hc-provenance-value">{resultBatch.qualityResult || "Good"}</div>
            </li>

            <li className="hc-provenance-item" style={{ marginTop: "8px" }}>
              <span className="hc-provenance-label">{t("lookup_lbl_crypto")}</span>
              <div className="hc-provenance-value" style={{ fontSize: "1.35rem" }}>
                {chainStatus || t("lookup_chain_verified")}
              </div>
            </li>
          </ul>
        )}

        {searched && !resultBatch && !isScanning && (
          <div style={{ marginTop: "32px" }}>
            <h2 className="hc-h2">{t("lookup_not_found_title")}</h2>
            <p className="hc-body">
              {t("lookup_not_found_desc", { query: searchQuery })}
            </p>
            <p className="hc-text-muted">
              {t("lookup_sample_codes")}
            </p>
          </div>
        )}
      </main>

      <footer className="hc-footer-action hc-stack-sm">
        <button
          className="hc-button-primary"
          type="button"
          onClick={handleLookup}
          disabled={!searchQuery.trim() || isScanning}
        >
          <span>{t("lookup_btn_track")}</span>
          <svg className="hc-icon" viewBox="0 0 24 24">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>

        <button
          className="hc-button-text"
          type="button"
          onClick={handleSimulateScan}
        >
          <span>{t("lookup_btn_scan_demo")}</span>
        </button>
      </footer>
    </div>
  );
}

// --- Main App Root ---
function App() {
  const { currentPage } = useHoneyChain();

  return (
    <div className="hc-app-wrapper">
      <NavigationBar />
      {currentPage === "landing" && <LandingPage />}
      {currentPage === "register" && <BeekeeperRegistrationPage />}
      {currentPage === "batch-entry" && <BatchEntryPage />}
      {currentPage === "my-batches" && <MyBatchesPage />}
      {currentPage === "beekeeper-select" && <BeekeeperSelectPage />}
      {currentPage === "lookup" && <ConsumerLookupPage />}
    </div>
  );
}

// Mount React Root
const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);
root.render(
  <HoneyChainProvider>
    <App />
  </HoneyChainProvider>
);
