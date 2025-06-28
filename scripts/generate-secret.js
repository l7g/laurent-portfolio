#!/usr/bin/env node

/**
 * Generate a secure NEXTAUTH_SECRET for production deployment
 * Run with: node scripts/generate-secret.js
 */

const crypto = require("crypto");

function generateSecret() {
  const secret = crypto.randomBytes(32).toString("base64");

  console.log("🔐 Generated secure NEXTAUTH_SECRET:");
  console.log("");
  console.log(`NEXTAUTH_SECRET="${secret}"`);
  console.log("");
  console.log("📋 Next steps:");
  console.log("1. Copy the secret above");
  console.log("2. Add it to your production environment variables");
  console.log("3. Update your .env.local for local development");
  console.log("4. Use the SAME secret in all environments");
  console.log("");
  console.log("⚠️  IMPORTANT: Never change this secret after deployment!");

  return secret;
}

// Run if called directly
if (require.main === module) {
  generateSecret();
}

module.exports = { generateSecret };
