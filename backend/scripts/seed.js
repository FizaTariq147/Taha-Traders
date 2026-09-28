#!/usr/bin/env node
/**
 * Seeds after server-ready memory DB is awkward (separate process = new memory).
 * Prefer: start API with USE_MEMORY_DB and call POST /api/dev/seed once,
 * or use a persistent MONGODB_URI with USE_MEMORY_DB=false.
 *
 * This script seeds its own in-memory/persistent DB based on .env.
 */
require('ts-node/register/transpile-only');
require('tsconfig-paths/register');
require('./src/seed.ts');
