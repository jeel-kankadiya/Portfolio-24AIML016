// ==========================================
// SHARED CACHE MODULE (Practical 8 — node-cache)
// ==========================================
// This single instance is imported across all route files
// so every module shares the SAME in-memory store.
//
// stdTTL  : default Time-To-Live in seconds (60 s → 1 minute)
// checkperiod : how often (s) the cache auto-purges expired keys
// ==========================================

const NodeCache = require('node-cache');

const cache = new NodeCache({
    stdTTL     : 60,   // 60-second TTL for all keys unless overridden
    checkperiod: 120   // scan & purge expired keys every 2 minutes
});

// ——— Simple hit / miss counters for the debug endpoint ———
let hits   = 0;
let misses = 0;

/**
 * Wrap cache.get() and track hit/miss statistics.
 * @param {string} key
 * @returns {*} cached value or undefined
 */
function get(key) {
    const value = cache.get(key);
    if (value !== undefined) {
        hits++;
    } else {
        misses++;
    }
    return value;
}

/**
 * Store a value in the cache.
 * @param {string} key
 * @param {*} value
 * @param {number} [ttl] optional TTL override in seconds
 */
function set(key, value, ttl) {
    if (ttl !== undefined) {
        cache.set(key, value, ttl);
    } else {
        cache.set(key, value);
    }
}

/** Delete one or more cache keys. */
function del(...keys) {
    cache.del(keys);
}

/** Return the current hit/miss statistics. */
function stats() {
    return {
        hits,
        misses,
        total       : hits + misses,
        hitRate     : hits + misses === 0
            ? '0%'
            : `${((hits / (hits + misses)) * 100).toFixed(1)}%`,
        keys        : cache.keys(),
        nodeCache   : cache.getStats()
    };
}

module.exports = { get, set, del, stats };
