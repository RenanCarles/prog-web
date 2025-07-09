// firebase.esm.js
import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load service account JSON
const serviceAccountPath = path.join(
  __dirname,
  "firebase-service-account.json"
);
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf-8"));

// Inicializa o Admin SDK com Firestore
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Exporta a instância do Firestore
export const db = admin.firestore();
