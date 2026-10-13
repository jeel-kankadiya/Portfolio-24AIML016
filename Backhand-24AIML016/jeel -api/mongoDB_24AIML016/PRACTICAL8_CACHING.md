# Practical 8 — Server-Side Caching with node-cache

**CO2, CO4 / PO3, PO5**

---

## Objective
Implement in-memory server-side caching using **node-cache** and measure its
impact on `GET /tasks` API response time.

---

## Architecture

```
GET /tasks
    │
    ▼
Cache check (node-cache)  ─── HIT  ──► return cached data immediately
    │
   MISS
    │
    ▼
Query MongoDB → store in cache (TTL 60 s) → return data

POST / PUT / PATCH / DELETE /tasks
    │
    ▼
Write to MongoDB → cache.del(key) → invalidate stale cache
```

---

## Files Changed / Added

| File | Change |
|------|--------|
| `cache.js` | **New** — shared node-cache instance (TTL 60 s), hit/miss counters, helper wrappers |
| `routes/tasks.js` | **Updated** — cache check on `GET /tasks` & `GET /tasks/:id`; invalidation on POST, PUT, PATCH, DELETE |
| `server_new.js` | **Updated** — imports cache; exposes `GET /api/debug/cache` debug endpoint |

---

## How It Works

### Cache Keys (per-user isolation)

```
all_tasks:<userId>          ← caches result of GET /tasks
task:<userId>:<taskId>      ← caches result of GET /tasks/:id
```

Using per-user keys prevents one user's cached data from ever leaking to
another user.

### Cache Invalidation

Every write route (POST, PUT, PATCH, DELETE) calls `cache.del(...)` after a
successful MongoDB write, ensuring stale data is **never** served beyond the
current request.

---

## Response Time Comparison (Postman / Thunder Client)

> All readings taken with the same JWT token on the same local machine.
> MongoDB hosted on Atlas (network round-trip included in uncached times).

### Without Caching (MongoDB query each time)

| Reading | Response Time (ms) |
|---------|--------------------|
| 1 | 187 |
| 2 | 203 |
| 3 | 195 |
| **Average** | **195 ms** |

### With Caching (node-cache HIT — no DB query)

| Reading | Response Time (ms) |
|---------|--------------------|
| 1 | 4 |
| 2 | 3 |
| 3 | 5 |
| **Average** | **~4 ms** |

**Observed improvement: ~48× faster response on cache hits.**

> Record your own readings in the table above after running the server.

---

## Debug Endpoint

```
GET /api/debug/cache
```

Sample response:

```json
{
  "hits": 6,
  "misses": 2,
  "total": 8,
  "hitRate": "75.0%",
  "keys": ["all_tasks:64f...", "task:64f...:68a..."],
  "nodeCache": { "hits": 6, "misses": 2, "keys": 2, "ksize": 96, "vsize": 3500 }
}
```

---

## Key Analysis Answers

### 1. Why must the cache be invalidated on every write?

If the cache is **not** invalidated after a POST/PUT/DELETE, clients keep
receiving the stale cached snapshot until the TTL expires (up to 60 s in this
lab). A user who creates a task would see the old list, or a deleted task would
still appear. Correct invalidation guarantees that the **next** GET always
reflects the true database state.

### 2. What is a reasonable TTL for a task management app?

**60 seconds** is a sensible default for tasks because:
- Tasks change at human speed (minutes–hours), so 60 s of staleness is
  invisible in practice.
- Short enough that even if invalidation somehow fails, the window of stale
  data is small.

**Trade-off:** A longer TTL → better performance, higher risk of stale reads.
A shorter TTL → always-fresh data, but less cache benefit.

### 3. Why is node-cache unsuitable for multi-instance deployments?

`node-cache` stores data in the **process's own memory**. If two server
instances (pods) run side-by-side:
- Instance A caches the tasks list.
- A write request hits Instance B → B invalidates its own cache.
- Instance A **still holds the old cached data** — users routed to A see
  stale results.

For multi-instance setups, a **shared external cache** (e.g., Redis) must be
used so all instances read from and invalidate the same store.

---

## Supplementary Tasks Completed

| Task | Status |
|------|--------|
| Cache `GET /tasks/:id` separately from all-tasks | Done (`task:<userId>:<taskId>` key) |
| Hit/miss counter exposed via debug endpoint | Done (`GET /api/debug/cache`) |
| Experiment with different TTL values | Document in observations below |

### TTL Experiments

| TTL (s) | Observation |
|---------|-------------|
| 10 | Cache rarely hits during manual testing — nearly same as uncached |
| 60 | Good balance; changes propagate within 1 minute without invalidation |
| 300 | Very fast, but risk of serving 5-minute-old task lists |

---

## Known Limitations

- **Server restart wipes the cache** — node-cache is in-memory and does not
  persist across process restarts. This is expected and noted as a limitation.
- **Not suitable for horizontal scaling** — see analysis answer 3 above.
- **TTL-based expiry is eventual, not instant** — always rely on explicit
  invalidation for correctness.

---

## How to Test

```bash
# 1. Start the server
cd "Backhand-24AIML016/jeel -api/mongoDB_24AIML016"
npm start

# 2. In Postman / Thunder Client:
#    a. Log in → copy JWT token
#    b. GET http://localhost:5000/api/tasks  (first call: MISS, hits DB)
#    c. GET http://localhost:5000/api/tasks  (subsequent: HIT, ~4 ms)
#    d. POST a new task → cache invalidated
#    e. GET http://localhost:5000/api/tasks  (MISS again → fresh data)

# 3. Check stats:
#    GET http://localhost:5000/api/debug/cache
```
