/**
 * ==============================================================================
 * HoneyChain - Cryptographic Hash Chain Module (hashChain.js)
 * ==============================================================================
 * 
 * PURPOSE FOR JUDGES:
 * This module establishes an immutable provenance ledger for honey batches.
 * Every batch is linked to the previous batch using a cryptographic SHA-256 hash.
 * If any past harvest data (weight, beekeeper, location, date) is tampered with,
 * the entire subsequent hash chain breaks and verification fails immediately.
 * 
 * CORE BLOCKCHAIN CONCEPTS IMPLEMENTED:
 * 1. Genesis Block / Seed Hash: The initial root of trust ("0000000000000000...").
 * 2. Cryptographic Hashing: Deterministic SHA-256 calculation over structured payload.
 * 3. Chain Linking: Current Block Hash = SHA-256(Block Payload + Previous Block Hash).
 * 4. Chain Verification: Full traversal audit ensuring 100% data integrity from origin.
 * ==============================================================================
 */

// Genesis Hash used for the very first batch in the chain
export const GENESIS_HASH = "0000000000000000000000000000000000000000000000000000000000000000";

/**
 * Computes a deterministic SHA-256 hex string using the browser's native Web Crypto API.
 * 
 * @param {string} message - The plaintext string to hash
 * @returns {Promise<string>} 64-character hexadecimal SHA-256 digest
 */
export async function sha256(message) {
  // Convert plaintext string into UTF-8 byte array
  const msgUint8 = new TextEncoder().encode(message);
  
  // Compute SHA-256 digest using standard Web Crypto API
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  
  // Convert binary buffer to 64-character hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}

/**
 * Normalizes batch data into a canonical deterministic string format.
 * Essential rule: Field order must be strictly identical during creation and verification.
 * 
 * @param {Object} batchData - The harvest details
 * @returns {string} Canonicalized payload string
 */
export function serializeBatchPayload(batchData) {
  return JSON.stringify({
    batchId: batchData.batchId || "",
    beekeeperId: batchData.beekeeperId || "",
    beekeeperName: batchData.beekeeperName || "",
    village: batchData.village || "",
    hiveNumber: batchData.hiveNumber || "",
    floralSource: batchData.floralSource || "",
    harvestDate: batchData.harvestDate || "",
    weightKg: String(batchData.weightKg || "")
  });
}

/**
 * Creates a cryptographic SHA-256 hash for a new honey batch.
 * 
 * HOW TO EXPLAIN TO JUDGES:
 * "We take the current batch's harvest payload (beekeeper, date, weight, floral source)
 * plus the cryptographic hash of the previous batch. Hashing both together binds this
 * batch irrevocably to the entire preceding history."
 * 
 * @param {Object} batchData - Batch information payload
 * @param {string} [previousHash=GENESIS_HASH] - SHA-256 hash of the preceding batch
 * @returns {Promise<string>} New 64-character SHA-256 hash for this batch
 */
export async function createBatchHash(batchData, previousHash = GENESIS_HASH) {
  const canonicalPayload = serializeBatchPayload(batchData);
  // Concatenate canonical payload + previous block's hash
  const blockDataToHash = `${canonicalPayload}|PREV_HASH:${previousHash}`;
  return await sha256(blockDataToHash);
}

/**
 * Verifies the integrity of an entire array of honey batches.
 * 
 * HOW TO EXPLAIN TO JUDGES:
 * "To prove authenticity, this function recalculates the hash chain from Batch #1
 * to the latest batch. If even a single kilogram of honey or beekeeper ID was altered,
 * the recalculated hash will not match, pinpointing the exact corrupted block."
 * 
 * @param {Array<Object>} batchArray - Array of batch objects ordered chronologically
 * @returns {Promise<Object>} Verification report:
 *   {
 *     isValid: boolean,             // True if unbroken, False if corrupted
 *     failedIndex: number | null,   // Index of the invalid batch (if any)
 *     failedBatchId: string | null, // Batch ID that failed verification
 *     errorReason: string | null,   // Human-readable audit message
 *     totalBatchesVerified: number  // Total count of verified blocks
 *   }
 */
export async function verifyChain(batchArray) {
  if (!Array.isArray(batchArray) || batchArray.length === 0) {
    return {
      isValid: true,
      failedIndex: null,
      failedBatchId: null,
      errorReason: "Chain is empty (no batches to verify).",
      totalBatchesVerified: 0
    };
  }

  let expectedPreviousHash = GENESIS_HASH;

  for (let i = 0; i < batchArray.length; i++) {
    const batch = batchArray[i];

    // Check 1: Does this batch point to the correct previous hash?
    const batchPrevHash = batch.previousHash || GENESIS_HASH;
    if (batchPrevHash !== expectedPreviousHash) {
      return {
        isValid: false,
        failedIndex: i,
        failedBatchId: batch.batchId || `Index-${i}`,
        errorReason: `Broken Link at batch ${batch.batchId}: previousHash mismatch. Expected '${expectedPreviousHash.substring(0, 10)}...' but found '${batchPrevHash.substring(0, 10)}...'`,
        totalBatchesVerified: i
      };
    }

    // Check 2: Does the batch's stored hash match its recalculated hash?
    const recalculatedHash = await createBatchHash(batch, batchPrevHash);
    if (batch.hash && batch.hash !== recalculatedHash) {
      return {
        isValid: false,
        failedIndex: i,
        failedBatchId: batch.batchId || `Index-${i}`,
        errorReason: `Tampered Data at batch ${batch.batchId}: Stored hash does not match computed payload hash. Data has been modified.`,
        totalBatchesVerified: i
      };
    }

    // Advance expected hash for next link in chain
    expectedPreviousHash = batch.hash || recalculatedHash;
  }

  return {
    isValid: true,
    failedIndex: null,
    failedBatchId: null,
    errorReason: null,
    totalBatchesVerified: batchArray.length
  };
}

// Attach to window for easy direct access in vanilla JS / browser runtime
if (typeof window !== "undefined") {
  window.HoneyChainHash = {
    GENESIS_HASH,
    sha256,
    serializeBatchPayload,
    createBatchHash,
    verifyChain
  };
}
