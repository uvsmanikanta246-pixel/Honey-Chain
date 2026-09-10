// ==========================================================================
// HoneyChain - Honey Batches Service (Firestore + Cryptographic Hashing)
// ==========================================================================

class BatchService {
  constructor() {
    this.STORAGE_KEY = "honeychain_batches_store";
    this.DEFAULT_PREV_HASH = "0000000000000000000000000000000000000000000000000000000000000000";
  }

  get db() {
    return window.firebaseManager?.db || (typeof firebase !== "undefined" && firebase.firestore ? firebase.firestore() : null);
  }

  // Generate unique batch ID
  async generateBatchId() {
    const existing = await this.getAllBatches();
    const existingIds = new Set(existing.map(b => b.batchId));
    let batchId = "";
    do {
      const rand = Math.floor(1000 + Math.random() * 9000);
      batchId = `HC-${rand}`;
    } while (existingIds.has(batchId));
    return batchId;
  }

  // 1. Create and Seal a New Honey Batch
  async createBatch(batchData) {
    const { beekeeperId, beekeeperName, harvestDate, quantity, qualityGrade, location } = batchData;

    if (!beekeeperId || !harvestDate || !quantity) {
      throw new Error("Missing required fields: beekeeperId, harvestDate, quantity.");
    }

    const batchId = await this.generateBatchId();
    const allBatches = await this.getAllBatches();

    // Get previous batch hash
    let previousHash = this.DEFAULT_PREV_HASH;
    if (allBatches.length > 0) {
      const lastBatch = allBatches[0]; // ordered newest first
      if (lastBatch.blockchainHash) {
        previousHash = lastBatch.blockchainHash;
      }
    }

    const nowIso = new Date().toISOString();

    // Compute Cryptographic SHA-256 Hash using hashChain.js
    let blockchainHash = "";
    if (typeof window.HoneyHashChain !== "undefined" && window.HoneyHashChain.computeBatchHash) {
      blockchainHash = await window.HoneyHashChain.computeBatchHash({
        batchId,
        beekeeperId,
        beekeeperName: beekeeperName || "Verified Beekeeper",
        harvestDate,
        quantity: Number(quantity),
        qualityGrade: qualityGrade || "Good",
        location: location || "Apiary",
        timestamp: nowIso
      }, previousHash);
    } else {
      // Fallback hash generator
      blockchainHash = Array.from(crypto.getRandomValues(new Uint8Array(32)))
        .map(b => b.toString(16).padStart(2, "0")).join("");
    }

    // Generate QR Code URL
    const verificationUrl = `${window.location.origin}${window.location.pathname}?batchId=${batchId}`;
    let qrCodeUrl = "";

    // Generate in-browser QR Data URL using QRCode library if present
    if (typeof QRCode !== "undefined" && QRCode.toDataURL) {
      try {
        qrCodeUrl = await QRCode.toDataURL(verificationUrl, {
          width: 300,
          margin: 2,
          color: { dark: "#3A2E26", light: "#FFFFFF" }
        });
      } catch (e) {
        console.warn("QR code generation warning:", e);
      }
    }

    const newBatch = {
      batchId,
      beekeeperId,
      beekeeperName: beekeeperName || "Verified Beekeeper",
      harvestDate,
      quantity: Number(quantity),
      qualityGrade: qualityGrade || "Good",
      location: location || "Apiary Location",
      previousHash,
      blockchainHash,
      qrCodeUrl: qrCodeUrl || verificationUrl,
      status: "sealed",
      createdAt: nowIso,
      createdAtIso: nowIso
    };

    // Save to Firestore
    if (this.db) {
      try {
        await this.db.collection("honeyBatches").doc(batchId).set(newBatch);
      } catch (e) {
        console.warn("Firestore batch write fallback:", e);
      }
    }

    // Save to local cache
    const currentBatches = this.getLocalBatches();
    currentBatches.unshift(newBatch);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(currentBatches));

    // Also record Genesis event in Supply Chain
    if (window.supplyChainService) {
      try {
        await window.supplyChainService.addEvent({
          batchId,
          actor: beekeeperName || "Beekeeper",
          actorRole: "beekeeper",
          action: "Harvest Recorded & Sealed",
          location: location || "Apiary Location",
          notes: `Batch ${batchId} harvested (${quantity} kg, Grade: ${qualityGrade || "Good"}). Sealed with SHA-256 hash.`
        });
      } catch (e) {
        console.warn("Genesis supply chain event notice:", e);
      }
    }

    return newBatch;
  }

  // 2. Fetch Batches for Beekeeper
  async getBatchesByBeekeeper(beekeeperId) {
    if (this.db) {
      try {
        const snap = await this.db.collection("honeyBatches")
          .where("beekeeperId", "==", beekeeperId)
          .get();

        if (!snap.empty) {
          const list = snap.docs.map(d => d.data());
          list.sort((a, b) => new Date(b.createdAt || b.createdAtIso || 0) - new Date(a.createdAt || a.createdAtIso || 0));
          return list;
        }
      } catch (e) {
        console.warn("Firestore getBatchesByBeekeeper query notice:", e);
      }
    }

    const local = this.getLocalBatches();
    return local.filter(b => b.beekeeperId === beekeeperId);
  }

  // 3. Fetch Single Batch by ID
  async getBatchById(batchId) {
    const cleanId = (batchId || "").trim().toUpperCase();
    if (!cleanId) return null;

    if (this.db) {
      try {
        const doc = await this.db.collection("honeyBatches").doc(cleanId).get();
        if (doc.exists) {
          return doc.data();
        }
      } catch (e) {
        console.warn("Firestore getBatchById notice:", e);
      }
    }

    const local = this.getLocalBatches();
    return local.find(b => (b.batchId || "").toUpperCase() === cleanId) || null;
  }

  // 4. Fetch All Batches (Admin / Ledger)
  async getAllBatches() {
    if (this.db) {
      try {
        const snap = await this.db.collection("honeyBatches").get();
        if (!snap.empty) {
          const list = snap.docs.map(d => d.data());
          list.sort((a, b) => new Date(b.createdAt || b.createdAtIso || 0) - new Date(a.createdAt || a.createdAtIso || 0));
          return list;
        }
      } catch (e) {
        console.warn("Firestore getAllBatches notice:", e);
      }
    }

    return this.getLocalBatches();
  }

  // Helper: Local fallback store
  getLocalBatches() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {}

    // Seed with initial realistic batches if store is empty
    const seed = [
      {
        batchId: "HC-8842",
        beekeeperId: "BK-1042",
        beekeeperName: "Anand Kumar",
        harvestDate: "2026-03-01",
        quantity: 24.5,
        qualityGrade: "Good",
        location: "Sundarban Delta, Sector 4",
        previousHash: "0000000000000000000000000000000000000000000000000000000000000000",
        blockchainHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        status: "retail",
        createdAt: "2026-03-01T08:30:00.000Z",
        createdAtIso: "2026-03-01T08:30:00.000Z"
      },
      {
        batchId: "HC-7109",
        beekeeperId: "BK-2088",
        beekeeperName: "Sunita Devi",
        harvestDate: "2026-03-05",
        quantity: 18.0,
        qualityGrade: "Good",
        location: "Coorg Highland Apiary, Block B",
        previousHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        blockchainHash: "ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb",
        status: "in-transit",
        createdAt: "2026-03-05T10:15:00.000Z",
        createdAtIso: "2026-03-05T10:15:00.000Z"
      }
    ];
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(seed));
    return seed;
  }
}

const batchService = new BatchService();
window.batchService = batchService;
