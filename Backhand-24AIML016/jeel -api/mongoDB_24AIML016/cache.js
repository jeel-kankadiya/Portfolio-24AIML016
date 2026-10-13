// ==========================================
// SHARED CACHE MODULE (Practical 8 — node-cache)
// ==========================================
// stdTTL  : default Time-To-Live in seconds (60 s → 1 minute)
// checkperiod : how often (s) the cache auto-purges expired keys
// ==========================================

const NodeCache = require('node-cache');

const cache = new NodeCache({
    stdTTL     : 60,   // 60-second TTL for all keys unless overridden
    checkperiod: 120   // scan & purge expired keys every 2 minutes
});

// ==========================================
// ANSI colour codes for terminal output
// ==========================================
const CLR = {
    reset  : '\x1b[0m',
    bold   : '\x1b[1m',
    cyan   : '\x1b[36m',
    green  : '\x1b[32m',
    yellow : '\x1b[33m',
    red    : '\x1b[31m',
    gray   : '\x1b[90m'
};

// ——— Simple hit / miss counters for the debug endpoint ———
let hits   = 0;
let misses = 0;

/**
 * Wrap cache.get() — logs a coloured HIT or MISS line to the terminal.
 * @param {string} key
 * @returns {*} cached value or undefined
 */
function get(key) {
    const value = cache.get(key);

    if (value !== undefined) {
        hits++;
        // ✅ Green [CACHE HIT]  — matches the screenshot style
        console.log(
            `${CLR.bold}${CLR.green}[CACHE HIT] ${CLR.reset}` +
            `${CLR.cyan}${key}${CLR.reset}`
        );
    } else {
        misses++;
        // ⚠️  Yellow [CACHE MISS]
        console.log(
            `${CLR.bold}${CLR.yellow}[CACHE MISS]${CLR.reset}` +
            ` ${CLR.cyan}${key}${CLR.reset}`
        );
    }

    return value;
}

/**
 * Store a value in the cache and log the SET event.
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

    // Subtle gray log so you can see when data was stored
    console.log(
        `${CLR.gray}[CACHE SET] ${key} (TTL: ${ttl ?? 60}s)${CLR.reset}`
    );
}

/**
 * Delete one or more cache keys and log the invalidation.
 * @param {...string} keys
 */
function del(...keys) {
    cache.del(keys);
    keys.forEach(k =>
        console.log(
            `${CLR.bold}${CLR.red}[CACHE DEL]${CLR.reset}` +
            ` ${CLR.cyan}${k}${CLR.reset}`
        )
    );
}

/** Return the current hit/miss statistics. */
function stats() {
    return {
        hits,
        misses,
        total  : hits + misses,
        hitRate: hits + misses === 0
            ? '0%'
            : `${((hits / (hits + misses)) * 100).toFixed(1)}%`,
        keys     : cache.keys(),
        nodeCache: cache.getStats()
    };
}

module.exports = { get, set, del, stats };
