// ==========================================================================
// HoneyChain - Supply Chain Tracking Service (Custody & Journey Events)
// ==========================================================================

class SupplyChainService {
  constructor() {
    this.STORAGE_KEY = "honeychain_supplychain_store";
  }

  get db() {
    return window.firebaseManager?.db || (typeof firebase !== "undefined" && firebase.firestore ? firebase.firestore() : null);
  }

  // 1. Add Supply Chain Event
  async addEvent(eventData) {
    const { batchId, actor, actorRole = "distributor", action, location, notes } = eventData;

    if (!batchId || !actor || !action) {
      throw new Error("batchId, actor, and action are required.");
    }

    const cleanBatchId = batchId.trim().toUpperCase();
    const eventId = `EVT-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    const nowIso = new Date().toISOString();

    const newEvent = {
      eventId,
      batchId: cleanBatchId,
      actor,
      actorRole,
      action,
      location: location || "Logistics Hub",
      notes: notes || "",
      timestamp: nowIso,
      timestampIso: nowIso
    };

    // Save to Firestore
    if (this.db) {
      try {
        await this.db.collection("supplyChain").doc(eventId).set(newEvent);
        
        // Update batch status
        let status = "sealed";
        if (action.toLowerCase().includes("transit") || action.toLowerCase().includes("dispatched")) {
          status = "in-transit";
        } else if (action.toLowerCase().includes("retail") || action.toLowerCase().includes("shelf")) {
          status = "retail";
        }
        await this.db.collection("honeyBatches").doc(cleanBatchId).set({ status }, { merge: true });
      } catch (e) {
        console.warn("Firestore supplyChain write fallback:", e);
      }
    }

    // Save to LocalStorage cache
    const events = this.getLocalEvents();
    events.push(newEvent);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(events));

    return newEvent;
  }

  // 2. Get Full Timeline for a Batch
  async getBatchTimeline(batchId) {
    const cleanId = (batchId || "").trim().toUpperCase();
    if (!cleanId) return [];

    if (this.db) {
      try {
        const snap = await this.db.collection("supplyChain")
          .where("batchId", "==", cleanId)
          .get();

        if (!snap.empty) {
          const list = snap.docs.map(d => d.data());
          list.sort((a, b) => new Date(a.timestamp || a.timestampIso || 0) - new Date(b.timestamp || b.timestampIso || 0));
          return list;
        }
      } catch (e) {
        console.warn("Firestore getBatchTimeline notice:", e);
      }
    }

    const local = this.getLocalEvents();
    const filtered = local.filter(e => (e.batchId || "").toUpperCase() === cleanId);
    filtered.sort((a, b) => new Date(a.timestamp || a.timestampIso || 0) - new Date(b.timestamp || b.timestampIso || 0));
    return filtered;
  }

  // 3. Get Recent Events for Admin/Audits
  async getRecentEvents(limitCount = 20) {
    if (this.db) {
      try {
        const snap = await this.db.collection("supplyChain")
          .orderBy("timestamp", "desc")
          .limit(limitCount)
          .get();

        if (!snap.empty) {
          return snap.docs.map(d => d.data());
        }
      } catch (e) {
        console.warn("Firestore getRecentEvents notice:", e);
      }
    }

    const local = this.getLocalEvents();
    local.sort((a, b) => new Date(b.timestamp || b.timestampIso || 0) - new Date(a.timestamp || a.timestampIso || 0));
    return local.slice(0, limitCount);
  }

  getLocalEvents() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {}

    const seed = [
      {
        eventId: "EVT-1001",
        batchId: "HC-8842",
        actor: "Anand Kumar",
        actorRole: "beekeeper",
        action: "Harvest Recorded & Sealed",
        location: "Sundarban Delta, Sector 4",
        notes: "Moisture 17.8%, Raw Unprocessed Wild Flora Honey",
        timestamp: "2026-03-01T08:30:00.000Z",
        timestampIso: "2026-03-01T08:30:00.000Z"
      },
      {
        eventId: "EVT-1002",
        batchId: "HC-8842",
        actor: "Eastern Honey Logistics",
        actorRole: "distributor",
        action: "Cold Chain Transport & Quality Gate Passed",
        location: "Kolkata Central Distribution Hub",
        notes: "Passed HMF & C4 Sugar isotope ratio test (NDDB certified)",
        timestamp: "2026-03-03T14:20:00.000Z",
        timestampIso: "2026-03-03T14:20:00.000Z"
      },
      {
        eventId: "EVT-1003",
        batchId: "HC-8842",
        actor: "Organic Mart",
        actorRole: "retailer",
        action: "Stocked on Retail Shelf",
        location: "Organic Mart Store #14, South Extension",
        notes: "Jars labeled with tamper-evident QR code",
        timestamp: "2026-03-04T11:00:00.000Z",
        timestampIso: "2026-03-04T11:00:00.000Z"
      }
    ];
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(seed));
    return seed;
  }
}

const supplyChainService = new SupplyChainService();
window.supplyChainService = supplyChainService;
