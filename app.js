
    // ============================================================
    // START → app.js / state (shared mutable "today" — read by Calendar,
    // Stats, and the Rollover service. This is the risky shared-global
    // I flagged in the original blueprint. Do not duplicate this
    // variable into multiple files — there must be exactly one copy.)
    // ============================================================
    let today = new Date();
    // ============================================================
    // END → app.js / state
    // ============================================================