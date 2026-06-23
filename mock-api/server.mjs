// Mock API for the Courier Onboarding exercise.
// Zero dependencies — run with:  node mock-api/server.mjs
// Serves on http://localhost:4000

import { createServer } from "node:http";

const PORT = 4000;

// --- build a large-ish city list to exercise rendering performance ----------
const realCities = [
  "Berlin", "Hamburg", "Munich", "Cologne", "Frankfurt", "Stuttgart",
  "Düsseldorf", "Leipzig", "Dortmund", "Essen", "Bremen", "Dresden",
  "Hanover", "Nuremberg", "Potsdam", "Faultown" // Faultown is a deliberate failure case
];
const cities = [...realCities];
for (let i = 1; i <= 1500; i++) cities.push(`Teststadt ${i}`);

const config = {
  vehicleTypes: [
    { id: "bicycle", label: "Bicycle",       requiredDocuments: ["id_document"] },
    { id: "ebike",   label: "E-Bike",        requiredDocuments: ["id_document"] },
    { id: "scooter", label: "Motor Scooter", requiredDocuments: ["id_document", "drivers_license", "vehicle_insurance"] },
    { id: "car",     label: "Car",           requiredDocuments: ["id_document", "drivers_license", "vehicle_insurance", "vehicle_registration"] }
  ],
  documents: {
    id_document:          { label: "ID Document" },
    drivers_license:      { label: "Driver's Licence" },
    vehicle_insurance:    { label: "Vehicle Insurance" },
    vehicle_registration: { label: "Vehicle Registration" }
  },
  cities
};

// A pre-existing, partially completed application for the "resume" feature.
const savedApplications = {
  "resume-demo": {
    applicationId: "resume-demo",
    personal: { firstName: "Mara", lastName: "Voss", email: "mara.voss@example.com", dateOfBirth: "1996-04-12" },
    eligibility: { city: "Berlin", vehicleType: "scooter" },
    documents: [{ type: "id_document", number: "ID-1122" }] // note: incomplete for a scooter
  }
};

// ----------------------------------------------------------------------------
function send(res, status, body) {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  });
  res.end(body === undefined ? "" : JSON.stringify(body));
}

function ageFrom(dob) {
  const d = new Date(dob);
  if (isNaN(d)) return NaN;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
  return age;
}

function validateSubmission(payload) {
  const errors = [];
  const p = payload?.personal ?? {};
  const e = payload?.eligibility ?? {};
  const docs = payload?.documents ?? [];

  // Server-side checks the client cannot fully know about.
  if (typeof p.email === "string" && p.email.toLowerCase().endsWith("@blocked.example")) {
    errors.push({ field: "personal.email", message: "This email domain is not eligible for onboarding." });
  }
  if (p.dateOfBirth && ageFrom(p.dateOfBirth) < 18) {
    errors.push({ field: "personal.dateOfBirth", message: "Applicants must be at least 18 years old." });
  }
  return { errors, docs, city: e.city };
}

const server = createServer((req, res) => {
  if (req.method === "OPTIONS") return send(res, 204);

  const url = new URL(req.url, `http://localhost:${PORT}`);
  const path = url.pathname;

  // GET /onboarding/config
  if (req.method === "GET" && path === "/onboarding/config") {
    return send(res, 200, config);
  }

  // GET /onboarding/applications/:id
  const getMatch = path.match(/^\/onboarding\/applications\/([^/]+)$/);
  if (req.method === "GET" && getMatch) {
    const id = decodeURIComponent(getMatch[1]);
    const app = savedApplications[id];
    if (!app) return send(res, 404, { message: "No saved application found." });
    return send(res, 200, app);
  }

  // POST /onboarding/applications/:id/submit
  const postMatch = path.match(/^\/onboarding\/applications\/([^/]+)\/submit$/);
  if (req.method === "POST" && postMatch) {
    let raw = "";
    req.on("data", (c) => (raw += c));
    req.on("end", () => {
      let payload;
      try { payload = JSON.parse(raw || "{}"); }
      catch { return send(res, 400, { message: "Invalid JSON body." }); }

      const { errors, docs, city } = validateSubmission(payload);

      // Deliberate transient failure to exercise retry handling.
      if (city === "Faultown") {
        return send(res, 503, { message: "Service temporarily unavailable. Please try again." });
      }

      // Conflict: a driver's licence number already on file.
      const dup = docs.find((d) => d.type === "drivers_license" && d.number === "DUPLICATE");
      if (dup) {
        return send(res, 409, {
          errors: [{ field: "documents.drivers_license.number", message: "This licence number is already registered." }]
        });
      }

      if (errors.length) return send(res, 422, { errors });

      return send(res, 200, { status: "submitted", applicationId: postMatch[1] });
    });
    return;
  }

  return send(res, 404, { message: "Not found." });
});

server.listen(PORT, () => {
  console.log(`Mock API running at http://localhost:${PORT}`);
  console.log("  GET  /onboarding/config");
  console.log("  GET  /onboarding/applications/:id      (try id 'resume-demo')");
  console.log("  POST /onboarding/applications/:id/submit");
});
