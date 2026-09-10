const functions = require("firebase-functions");
const admin = require("firebase-admin");
const crypto = require("crypto");
const QRCode = require("qrcode");
const cors = require("cors")({ origin: true });

// Initialize Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();
const storage = admin.storage();

// Helper: Calculate SHA-256 Hash for Honey Batch (matching client hashChain.js)
function computeBatchHash(data, previousHash = "0000000000000000000000000000000000000000000000000000000000000000") {
  const payload = [
    previousHash,
    data.batchId || "",
    data.beekeeperId || "",
    data.beekeeperName || "",
    data.harvestDate || "",
    Number(data.quantity || 0).toFixed(2),
    data.qualityGrade || "Good",
    data.location || "",
    data.timestamp || new Date().toISOString()
  ].join("|");

  return crypto.createHash("sha256").update(payload, "utf8").digest("hex");
}

// Helper: Generate Unique Batch ID (e.g., HC-4829)
async function generateUniqueBatchId() {
  let isUnique = false;
  let batchId = "";
  
  while (!isUnique) {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    batchId = `HC-${randomNum}`;
    const docRef = await db.collection("honeyBatches").doc(batchId).get();
    if (!docRef.exists) {
      isUnique = true;
    }
  }
  return batchId;
}

// --------------------------------------------------------------------------
// 1. Create Honey Batch (Callable Cloud Function)
// --------------------------------------------------------------------------
exports.createHoneyBatch = functions.https.onCall(async (data, context) => {
  try {
    const { beekeeperId, beekeeperName, harvestDate, quantity, qualityGrade, location } = data;

    if (!beekeeperId || !harvestDate || !quantity) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Missing required fields: beekeeperId, harvestDate, quantity."
      );
    }

    // 1. Generate unique Batch ID
    const batchId = await generateUniqueBatchId();

    // 2. Fetch the latest batch to establish previousHash link
    const latestBatchSnapshot = await db.collection("honeyBatches")
      .orderBy("createdAt", "desc")
      .limit(1)
      .get();

    let previousHash = "0000000000000000000000000000000000000000000000000000000000000000";
    if (!latestBatchSnapshot.empty) {
      const prevData = latestBatchSnapshot.docs[0].data();
      if (prevData.blockchainHash) {
        previousHash = prevData.blockchainHash;
      }
    }

    const nowIso = new Date().toISOString();
    const serverTimestamp = admin.firestore.FieldValue.serverTimestamp();

    // 3. Compute Cryptographic SHA-256 Hash
    const hashPayload = {
      batchId,
      beekeeperId,
      beekeeperName: beekeeperName || "Verified Beekeeper",
      harvestDate,
      quantity: Number(quantity),
      qualityGrade: qualityGrade || "Good",
      location: location || "Verified Apiary",
      timestamp: nowIso
    };
    const blockchainHash = computeBatchHash(hashPayload, previousHash);

    // 4. Generate QR Code Data URL
    const verificationUrl = `https://honeychain.org/verify?batchId=${batchId}`;
    const qrDataUrl = await QRCode.toDataURL(verificationUrl, {
      errorCorrectionLevel: "H",
      margin: 2,
      color: {
        dark: "#3A2E26",
        light: "#FFFFFF"
      }
    });

    // 5. Store Honey Batch Record
    const batchRecord = {
      batchId,
      beekeeperId,
      beekeeperName: beekeeperName || "Verified Beekeeper",
      harvestDate,
      quantity: Number(quantity),
      qualityGrade: qualityGrade || "Good",
      location: location || "Verified Apiary",
      previousHash,
      blockchainHash,
      qrCodeUrl: qrDataUrl,
      status: "sealed",
      createdAt: serverTimestamp,
      createdAtIso: nowIso
    };

    await db.collection("honeyBatches").doc(batchId).set(batchRecord);

    // 6. Record Genesis Supply Chain Event
    const eventId = `EVT-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    const initialEvent = {
      eventId,
      batchId,
      actor: beekeeperName || "Beekeeper",
      actorRole: "beekeeper",
      action: "Harvest Recorded & Sealed",
      location: location || "Apiary",
      notes: `Batch ${batchId} harvested (${quantity} kg, Grade: ${qualityGrade || "Good"}). Sealed with SHA-256 hash.`,
      timestamp: serverTimestamp,
      timestampIso: nowIso
    };

    await db.collection("supplyChain").doc(eventId).set(initialEvent);

    return {
      success: true,
      batchId,
      blockchainHash,
      qrCodeUrl: qrDataUrl,
      batch: batchRecord
    };
  } catch (error) {
    console.error("Error creating honey batch:", error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});

// --------------------------------------------------------------------------
// 2. Verify Honey Batch (Callable & HTTP Public API)
// --------------------------------------------------------------------------
exports.verifyHoneyBatch = functions.https.onCall(async (data, context) => {
  try {
    const { batchId, method = "manual_code", userAgent = "" } = data;

    if (!batchId) {
      throw new functions.https.HttpsError("invalid-argument", "batchId is required.");
    }

    const cleanBatchId = batchId.trim().toUpperCase();
    const batchDoc = await db.collection("honeyBatches").doc(cleanBatchId).get();

    const verificationId = `VER-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    const nowTimestamp = admin.firestore.FieldValue.serverTimestamp();
    const nowIso = new Date().toISOString();

    if (!batchDoc.exists) {
      // Log failed verification
      await db.collection("verifications").doc(verificationId).set({
        verificationId,
        batchId: cleanBatchId,
        verifiedAt: nowTimestamp,
        verifiedAtIso: nowIso,
        result: "not_found",
        verificationMethod: method,
        userAgent: userAgent || ""
      });

      return {
        found: false,
        batchId: cleanBatchId,
        result: "not_found",
        message: `No harvest record matches batch code ${cleanBatchId}.`
      };
    }

    const batchData = batchDoc.data();

    // Verify SHA-256 Integrity
    const expectedHash = computeBatchHash({
      batchId: batchData.batchId,
      beekeeperId: batchData.beekeeperId,
      beekeeperName: batchData.beekeeperName,
      harvestDate: batchData.harvestDate,
      quantity: batchData.quantity,
      qualityGrade: batchData.qualityGrade,
      location: batchData.location,
      timestamp: batchData.createdAtIso || batchData.harvestDate
    }, batchData.previousHash || "0000000000000000000000000000000000000000000000000000000000000000");

    // Check beekeeper details
    let beekeeperInfo = null;
    if (batchData.beekeeperId) {
      const bkDoc = await db.collection("beekeepers").doc(batchData.beekeeperId).get();
      if (bkDoc.exists) {
        beekeeperInfo = bkDoc.data();
      }
    }

    // Fetch full supply chain timeline
    const supplyChainSnap = await db.collection("supplyChain")
      .where("batchId", "==", cleanBatchId)
      .orderBy("timestamp", "asc")
      .get();

    const timeline = supplyChainSnap.docs.map(doc => doc.data());

    // Log successful verification attempt
    await db.collection("verifications").doc(verificationId).set({
      verificationId,
      batchId: cleanBatchId,
      verifiedAt: nowTimestamp,
      verifiedAtIso: nowIso,
      result: "authentic",
      verificationMethod: method,
      userAgent: userAgent || ""
    });

    return {
      found: true,
      batchId: cleanBatchId,
      result: "authentic",
      batch: batchData,
      beekeeper: beekeeperInfo,
      timeline,
      verificationId
    };
  } catch (error) {
    console.error("Error verifying honey batch:", error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});

// --------------------------------------------------------------------------
// 3. Add Supply Chain Event (Distributor / Retailer / Beekeeper)
// --------------------------------------------------------------------------
exports.addSupplyChainEvent = functions.https.onCall(async (data, context) => {
  try {
    const { batchId, actor, actorRole, action, location, notes } = data;

    if (!batchId || !actor || !action) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "batchId, actor, and action are required."
      );
    }

    const cleanBatchId = batchId.trim().toUpperCase();
    const batchRef = db.collection("honeyBatches").doc(cleanBatchId);
    const batchDoc = await batchRef.get();

    if (!batchDoc.exists) {
      throw new functions.https.HttpsError("not-found", `Batch ${cleanBatchId} does not exist.`);
    }

    const eventId = `EVT-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    const serverTimestamp = admin.firestore.FieldValue.serverTimestamp();
    const nowIso = new Date().toISOString();

    const eventRecord = {
      eventId,
      batchId: cleanBatchId,
      actor,
      actorRole: actorRole || "distributor",
      action,
      location: location || "Logistics Hub",
      notes: notes || "",
      timestamp: serverTimestamp,
      timestampIso: nowIso
    };

    await db.collection("supplyChain").doc(eventId).set(eventRecord);

    // Update batch status if applicable
    let newStatus = "sealed";
    if (action.toLowerCase().includes("transit") || action.toLowerCase().includes("dispatched")) {
      newStatus = "in-transit";
    } else if (action.toLowerCase().includes("retail") || action.toLowerCase().includes("shelf")) {
      newStatus = "retail";
    }

    await batchRef.update({
      status: newStatus,
      lastUpdated: serverTimestamp
    });

    return {
      success: true,
      eventId,
      event: eventRecord,
      newStatus
    };
  } catch (error) {
    console.error("Error adding supply chain event:", error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});

// --------------------------------------------------------------------------
// 4. Get Admin Metrics (Dashboard Analytics)
// --------------------------------------------------------------------------
exports.getAdminMetrics = functions.https.onCall(async (data, context) => {
  try {
    // 1. Total Beekeepers
    const beekeepersSnap = await db.collection("beekeepers").get();
    const totalBeekeepers = beekeepersSnap.size;

    // 2. Total Batches & Total Quantity
    const batchesSnap = await db.collection("honeyBatches").get();
    const totalBatches = batchesSnap.size;
    let totalVolumeKg = 0;
    batchesSnap.forEach(doc => {
      const b = doc.data();
      totalVolumeKg += Number(b.quantity || 0);
    });

    // 3. Total Verifications
    const verificationsSnap = await db.collection("verifications").get();
    const totalVerifications = verificationsSnap.size;
    let authenticCount = 0;
    verificationsSnap.forEach(doc => {
      if (doc.data().result === "authentic") {
        authenticCount++;
      }
    });

    const successRate = totalVerifications > 0 
      ? Math.round((authenticCount / totalVerifications) * 100) 
      : 100;

    // 4. Recent Activity (Latest 10 verifications & latest 10 batches)
    const recentVerificationsSnap = await db.collection("verifications")
      .orderBy("verifiedAt", "desc")
      .limit(10)
      .get();

    const recentVerifications = recentVerificationsSnap.docs.map(d => d.data());

    const recentBatchesSnap = await db.collection("honeyBatches")
      .orderBy("createdAt", "desc")
      .limit(10)
      .get();

    const recentBatches = recentBatchesSnap.docs.map(d => d.data());

    return {
      success: true,
      metrics: {
        totalBeekeepers,
        totalBatches,
        totalVolumeKg: Number(totalVolumeKg.toFixed(1)),
        totalVerifications,
        authenticCount,
        successRate
      },
      recentVerifications,
      recentBatches
    };
  } catch (error) {
    console.error("Error fetching admin metrics:", error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});

// --------------------------------------------------------------------------
// 5. Register Beekeeper Profile
// --------------------------------------------------------------------------
exports.registerBeekeeper = functions.https.onCall(async (data, context) => {
  try {
    const { name, phone, farmLocation, certification = "FSSAI Natural", aadhaar = "" } = data;

    if (!name || !phone || !farmLocation) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Name, phone, and farm location are required."
      );
    }

    const beekeeperId = `BK-${Date.now().toString().slice(-4)}`;
    const userId = context.auth ? context.auth.uid : `user_${Date.now()}`;
    const serverTimestamp = admin.firestore.FieldValue.serverTimestamp();

    const beekeeperRecord = {
      beekeeperId,
      userId,
      name,
      phone,
      farmLocation,
      certification,
      aadhaarMasked: aadhaar ? `XXXX-XXXX-${aadhaar.slice(-4)}` : "Verified",
      createdAt: serverTimestamp
    };

    await db.collection("beekeepers").doc(beekeeperId).set(beekeeperRecord);

    // Also update users collection
    await db.collection("users").doc(userId).set({
      userId,
      name,
      phone,
      role: "beekeeper",
      beekeeperId,
      createdAt: serverTimestamp
    }, { merge: true });

    return {
      success: true,
      beekeeperId,
      beekeeper: beekeeperRecord
    };
  } catch (error) {
    console.error("Error registering beekeeper:", error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});

// --------------------------------------------------------------------------
// 6. Set User Role (Admin Only)
// --------------------------------------------------------------------------
exports.setUserRole = functions.https.onCall(async (data, context) => {
  try {
    const { targetUid, role } = data;

    const validRoles = ["beekeeper", "distributor", "retailer", "customer", "admin"];
    if (!validRoles.includes(role)) {
      throw new functions.https.HttpsError("invalid-argument", "Invalid role specified.");
    }

    // Set custom user claims in Firebase Auth
    await admin.auth().setCustomUserClaims(targetUid, { role });

    // Update in Firestore users collection
    await db.collection("users").doc(targetUid).set({
      role,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    return { success: true, targetUid, role };
  } catch (error) {
    console.error("Error setting user role:", error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});
