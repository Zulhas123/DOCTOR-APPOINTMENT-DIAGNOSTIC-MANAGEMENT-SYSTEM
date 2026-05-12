/* Prototype-only UI: SPA router + localStorage demo data */

const STORAGE_KEY = "doctor-assist-prototype:v1";
const CONTEXT =
  typeof window !== "undefined" && window.APP_CONTEXT ? window.APP_CONTEXT : "mono";

function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

function todayISO() {
  const d = new Date();
  const pad = (n) => `${n}`.padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function formatDT(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return iso;
  }
}

function normalizeBullets(text) {
  return text.replaceAll("â€¢", "•");
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) return JSON.parse(raw);

  const seed = {
    hubs: [
      { id: "hub_main", name: "Main Hub", city: "Los Angeles", active: true },
      { id: "hub_central", name: "Central", city: "Los Angeles", active: true },
    ],
    doctors: [
      { id: "doc_1", name: "Dr. A. Rahman", specialty: "Medicine", room: "201", active: true },
      { id: "doc_2", name: "Dr. S. Khan", specialty: "Cardiology", room: "305", active: true },
      { id: "doc_3", name: "Dr. M. Islam", specialty: "Radiology", room: "Imaging", active: true },
    ],
    patients: [
      {
        id: "pat_1",
        name: "Nusrat Jahan",
        mobile: "+1 (310) 555-0123",
        age: 29,
        sex: "Female",
        patientType: "General",
        address: "LA, CA",
        createdAt: new Date().toISOString(),
      },
      {
        id: "pat_2",
        name: "Imran Hossain",
        mobile: "+1 (213) 555-0188",
        age: 41,
        sex: "Male",
        patientType: "Corporate",
        address: "LA, CA",
        createdAt: new Date().toISOString(),
      },
    ],
    appointments: [
      {
        id: "apt_1",
        patientId: "pat_1",
        doctorId: "doc_1",
        date: todayISO(),
        time: "10:30",
        channel: "Offline",
        status: "Queued",
        token: 12,
        createdAt: new Date().toISOString(),
      },
      {
        id: "apt_2",
        patientId: "pat_2",
        doctorId: "doc_2",
        date: todayISO(),
        time: "12:00",
        channel: "Online",
        status: "Booked",
        token: 19,
        createdAt: new Date().toISOString(),
      },
    ],
    prescriptions: [
      {
        id: "rx_1",
        appointmentId: "apt_1",
        patientId: "pat_1",
        doctorId: "doc_1",
        language: "English",
        chiefComplaints: "Fever, cough",
        diagnosis: "Viral infection",
        medicines: ["Paracetamol 500mg — 1+1+1", "Cetirizine 10mg — 0+0+1"],
        advice: "Drink fluids, rest, return if symptoms worsen.",
        createdAt: new Date().toISOString(),
      },
    ],
    diagnostics: [
      {
        id: "dia_1",
        patientId: "pat_2",
        testType: "X-Ray",
        bodyPart: "Chest",
        status: "Uploaded",
        fileName: "xray_chest_demo.png",
        note: "Demo placeholder file (not real image).",
        createdAt: new Date().toISOString(),
      },
    ],
    invoices: [
      {
        id: "inv_1",
        patientId: "pat_2",
        items: [
          { name: "Consultation", qty: 1, unit: 20 },
          { name: "X-Ray Chest", qty: 1, unit: 35 },
        ],
        paid: 35,
        createdAt: new Date().toISOString(),
      },
    ],
    reports: [
      {
        id: "rep_1",
        patientId: "pat_2",
        title: "X-Ray Chest Report",
        status: "Pending Verification",
        findings: "No acute infiltrates. Mild peribronchial thickening.",
        verifiedBy: "",
        createdAt: new Date().toISOString(),
      },
    ],
    investigations: [
      {
        id: "invst_1",
        patientId: "pat_2",
        doctorId: "doc_2",
        hubId: "hub_main",
        category: "Pathology / Laboratory",
        testName: "Complete Blood Count (CBC)",
        priority: "Routine",
        status: "Ordered",
        orderedAt: new Date().toISOString(),
        collectedAt: "",
        processedAt: "",
        approvedAt: "",
        deliveredAt: "",
        reportSummary: "",
        remarks: "",
      },
    ],
    notes: {
      systemText: normalizeBullets(
        `The Doctor Appointment & Diagnostic Management System is designed to simplify patient management, appointment processing, diagnostics, billing, reporting, and centralized healthcare operations.\n\nCore modules:\n• Patient management\n• Doctor appointment module\n• Prescription management (Bangla & English)\n• Diagnostic & imaging management\n• Accounting & billing\n• Reporting\n\nGeneral work order flow:\n1. Patient Registration\n2. Appointment Booking\n3. Doctor Assignment\n4. Preliminary Prescription Entry\n5. Doctor Consultation\n6. Diagnostic Test Assignment\n7. Billing & Collection\n8. Diagnostic Report Upload\n9. Report Verification\n10. Final Report Delivery`
      ),
    },
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
  return seed;
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

const state = loadState();
state.notes = state.notes || {};
state.investigations = state.investigations || [];
state.expenses = state.expenses || [];
state.cashLedger = state.cashLedger || [];
state.reconciliations = state.reconciliations || [];
state.reminders = state.reminders || [];
state.paymentMethods = state.paymentMethods || [
  "Cash",
  "Card",
  "Bank Transfer",
  "bKash",
  "Nagad",
  "Rocket",
];
// Backfill missing fields for older demo states.
for (const inv of state.investigations) {
  inv.priority = inv.priority || "Routine";
  inv.status = inv.status || "Ordered";
  inv.orderedAt = inv.orderedAt || inv.createdAt || new Date().toISOString();
  inv.collectedAt = inv.collectedAt || "";
  inv.processedAt = inv.processedAt || "";
  inv.approvedAt = inv.approvedAt || "";
  inv.deliveredAt = inv.deliveredAt || "";
  inv.reportSummary = inv.reportSummary || "";
  inv.remarks = inv.remarks || "";
}
for (const inv of state.invoices || []) {
  inv.method = inv.method || "Cash";
  inv.discount = inv.discount || { type: "none", value: 0, reason: "" };
  inv.payer = inv.payer || { type: "Self", organization: "" }; // Self | Employee Benefit | Insurance
  inv.hubId = inv.hubId || "";
}

function $(sel, root = document) {
  return root.querySelector(sel);
}
function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") node.className = v;
    else if (k === "html") node.innerHTML = v;
    else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v);
  }
  for (const child of children) node.append(child);
  return node;
}

function toast(title, subtitle = "") {
  const host = $("#toastHost");
  const node = el("div", { class: "toast" }, [
    el("div", { class: "t-title" }, [document.createTextNode(title)]),
    el("div", { class: "t-sub" }, [document.createTextNode(subtitle)]),
  ]);
  host.append(node);
  setTimeout(() => node.remove(), 3800);
}

function setTitle(title, subtitle) {
  $("#pageTitle").textContent = title;
  $("#pageSubtitle").textContent = subtitle;
}

function activeNav(route) {
  for (const a of document.querySelectorAll(".nav-item")) {
    a.classList.toggle("active", a.getAttribute("data-route") === route);
  }
}

function buildNav() {
  const nav = $("#nav");
  if (!nav) return;

  const items =
    CONTEXT === "central"
      ? [
          { route: "/central", icon: "🏥", label: "Central Home" },
          { route: "/patients", icon: "👤", label: "Patient Database" },
          { route: "/doctors", icon: "🩺", label: "Doctor Scheduling" },
          { route: "/billing", icon: "💳", label: "Accounting Monitor" },
          { route: "/diagnostics", icon: "🧪", label: "Diagnostic Monitor" },
          { route: "/reports", icon: "📈", label: "Revenue & Analysis" },
          { route: "/analysis-functions", icon: "🧩", label: "Analysis Functions" },
          { divider: true },
          { route: "/ai", icon: "✨", label: "AI (Future)" },
        ]
      : CONTEXT === "hub"
        ? [
            { route: "/dashboard", icon: "▦", label: "Hub Dashboard" },
            { route: "/patients", icon: "👤", label: "Patients" },
            { route: "/appointments", icon: "📅", label: "Appointments" },
            { route: "/prescriptions", icon: "📝", label: "Prescriptions" },
            { route: "/diagnostics", icon: "🧪", label: "Diagnostics" },
            { route: "/billing", icon: "💳", label: "Billing" },
            { route: "/reports", icon: "📈", label: "Reports" },
          ]
        : [
            { route: "/dashboard", icon: "▦", label: "Dashboard" },
            { route: "/patients", icon: "👤", label: "Patients" },
            { route: "/appointments", icon: "📅", label: "Appointments" },
            { route: "/doctors", icon: "🩺", label: "Doctors" },
            { route: "/prescriptions", icon: "📝", label: "Prescriptions" },
            { route: "/diagnostics", icon: "🧪", label: "Diagnostics" },
            { route: "/billing", icon: "💳", label: "Billing" },
            { route: "/reports", icon: "📈", label: "Reports" },
            { divider: true },
            { route: "/central", icon: "🏥", label: "Central Admin" },
            { route: "/analysis-functions", icon: "🧩", label: "Analysis Functions" },
            { route: "/ai", icon: "✨", label: "AI (Future)" },
          ];

  nav.replaceChildren(
    ...items.map((it) => {
      if (it.divider) return el("div", { class: "nav-divider", role: "separator" });
      return el("a", { class: "nav-item", href: `#${it.route}`, "data-route": it.route }, [
        el("span", { class: "nav-icon", "aria-hidden": "true" }, [document.createTextNode(it.icon)]),
        el("span", {}, [document.createTextNode(it.label)]),
      ]);
    })
  );
}

function money(n) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(n);
}

function downloadBlob(filename, mime, data) {
  const blob = data instanceof Blob ? data : new Blob([data], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function csvEscape(value) {
  const s = String(value ?? "");
  if (/[",\n]/.test(s)) return `"${s.replaceAll('"', '""')}"`;
  return s;
}

function toCSV(columns, rows) {
  const head = columns.map((c) => csvEscape(c.label)).join(",");
  const body = rows
    .map((r) => columns.map((c) => csvEscape(r[c.key])).join(","))
    .join("\n");
  return `${head}\n${body}\n`;
}

function toXlsHtml(columns, rows, title) {
  const th = columns.map((c) => `<th>${String(c.label)}</th>`).join("");
  const trs = rows
    .map((r) => `<tr>${columns.map((c) => `<td>${String(r[c.key] ?? "")}</td>`).join("")}</tr>`)
    .join("");
  return `<!doctype html><html><head><meta charset="utf-8"><title>${title}</title></head><body><table border="1"><thead><tr>${th}</tr></thead><tbody>${trs}</tbody></table></body></html>`;
}

function setupCanvas(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const w = Math.max(1, Math.floor(rect.width * dpr));
  const h = Math.max(1, Math.floor(rect.height * dpr));
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
  }
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}

function drawLineChart(canvas, labels, values, color = "rgba(110,231,255,.9)") {
  const ctx = setupCanvas(canvas);
  const w = canvas.getBoundingClientRect().width;
  const h = canvas.getBoundingClientRect().height;

  ctx.clearRect(0, 0, w, h);

  const pad = 14;
  const x0 = pad;
  const y0 = pad;
  const x1 = w - pad;
  const y1 = h - pad - 18;

  const max = Math.max(1, ...values);
  const min = Math.min(0, ...values);
  const range = Math.max(1, max - min);

  // grid
  ctx.strokeStyle = "rgba(255,255,255,.10)";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = y0 + ((y1 - y0) * i) / 4;
    ctx.beginPath();
    ctx.moveTo(x0, y);
    ctx.lineTo(x1, y);
    ctx.stroke();
  }

  const n = values.length || 1;
  const px = (i) => x0 + (n === 1 ? 0 : ((x1 - x0) * i) / (n - 1));
  const py = (v) => y1 - ((v - min) * (y1 - y0)) / range;

  // area
  ctx.beginPath();
  ctx.moveTo(px(0), py(values[0] || 0));
  for (let i = 1; i < n; i++) ctx.lineTo(px(i), py(values[i] || 0));
  ctx.lineTo(px(n - 1), y1);
  ctx.lineTo(px(0), y1);
  ctx.closePath();
  ctx.fillStyle = color.replace("rgba(", "rgba(").replace(/,\s*[\d.]+\)$/, ",.10)");
  ctx.fill();

  // line
  ctx.beginPath();
  ctx.moveTo(px(0), py(values[0] || 0));
  for (let i = 1; i < n; i++) ctx.lineTo(px(i), py(values[i] || 0));
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.stroke();

  // dots
  ctx.fillStyle = color;
  for (let i = 0; i < n; i++) {
    ctx.beginPath();
    ctx.arc(px(i), py(values[i] || 0), 3.2, 0, Math.PI * 2);
    ctx.fill();
  }

  // x labels (show first, mid, last)
  ctx.fillStyle = "rgba(255,255,255,.60)";
  ctx.font = "12px system-ui, -apple-system, Segoe UI, Roboto, Arial";
  const idx = new Set([0, Math.floor((n - 1) / 2), n - 1]);
  for (const i of idx) {
    const t = labels[i] ?? "";
    const tx = px(i);
    ctx.textAlign = i === 0 ? "left" : i === n - 1 ? "right" : "center";
    ctx.fillText(String(t), tx, h - 8);
  }
}

function drawBarChart(canvas, labels, values, color = "rgba(139,92,246,.9)") {
  const ctx = setupCanvas(canvas);
  const w = canvas.getBoundingClientRect().width;
  const h = canvas.getBoundingClientRect().height;

  ctx.clearRect(0, 0, w, h);

  const pad = 14;
  const x0 = pad;
  const y0 = pad;
  const x1 = w - pad;
  const y1 = h - pad - 18;

  const max = Math.max(1, ...values);
  const n = values.length || 1;
  const gap = 10;
  const barW = Math.max(10, Math.floor((x1 - x0 - gap * (n - 1)) / n));

  // baseline
  ctx.strokeStyle = "rgba(255,255,255,.12)";
  ctx.beginPath();
  ctx.moveTo(x0, y1);
  ctx.lineTo(x1, y1);
  ctx.stroke();

  for (let i = 0; i < n; i++) {
    const v = values[i] || 0;
    const bh = ((y1 - y0) * v) / max;
    const x = x0 + i * (barW + gap);
    const y = y1 - bh;
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.9;
    ctx.fillRect(x, y, barW, bh);
    ctx.globalAlpha = 1;
  }

  ctx.fillStyle = "rgba(255,255,255,.60)";
  ctx.font = "12px system-ui, -apple-system, Segoe UI, Roboto, Arial";
  const idx = new Set([0, Math.floor((n - 1) / 2), n - 1]);
  for (const i of idx) {
    const t = labels[i] ?? "";
    const x = x0 + i * (barW + gap) + barW / 2;
    ctx.textAlign = i === 0 ? "left" : i === n - 1 ? "right" : "center";
    ctx.fillText(String(t), x, h - 8);
  }
}

function sumInvoice(inv) {
  return inv.items.reduce((acc, it) => acc + it.qty * it.unit, 0);
}

function invoiceDiscountAmount(inv) {
  const gross = sumInvoice(inv);
  const d = inv.discount || { type: "none", value: 0 };
  if (!d || d.type === "none") return 0;
  const v = Number(d.value || 0);
  if (d.type === "percent") return Math.max(0, Math.min(gross, (gross * v) / 100));
  if (d.type === "flat") return Math.max(0, Math.min(gross, v));
  return 0;
}

function invoiceNet(inv) {
  return Math.max(0, sumInvoice(inv) - invoiceDiscountAmount(inv));
}

function invoiceDue(inv) {
  return Math.max(0, invoiceNet(inv) - Number(inv.paid || 0));
}

function findById(list, id) {
  return list.find((x) => x.id === id);
}

function openModal({ title, bodyNode, primaryText = "Save", onPrimary, wide = false }) {
  const modal = $("#modal");
  $("#modalTitle").textContent = title;
  const card = $(".modal-card", modal);
  card.style.width = wide ? "min(920px, calc(100vw - 30px))" : "";
  const body = $("#modalBody");
  body.replaceChildren(bodyNode);
  const primary = $("#modalPrimary");
  primary.textContent = primaryText;

  const form = $("#modalForm");
  const handler = (ev) => {
    if (ev.submitter?.value === "cancel") return;
    ev.preventDefault();
    onPrimary?.();
    modal.close();
    form.removeEventListener("submit", handler);
  };
  form.addEventListener("submit", handler);

  modal.showModal();
}

function renderEmpty() {
  return document.importNode($("#tpl-empty").content, true);
}

function ensureLiveOps() {
  window.__liveOps = window.__liveOps || { timer: null };
  const enabled = !!state?.notes?.liveOpsEnabled;

  if (enabled && !window.__liveOps.timer) {
    window.__liveOps.timer = setInterval(() => {
      try {
        tickLiveOps();
      } catch {
        // ignore
      }
    }, 6000);
  }

  if (!enabled && window.__liveOps.timer) {
    clearInterval(window.__liveOps.timer);
    window.__liveOps.timer = null;
  }
}

function tickLiveOps() {
  const now = new Date();
  const date = todayISO();
  const time = now.toTimeString().slice(0, 5);

  const patient = state.patients[Math.floor(Math.random() * state.patients.length)];
  const doctor = state.doctors[Math.floor(Math.random() * state.doctors.length)];
  const hub = state.hubs[Math.floor(Math.random() * state.hubs.length)];

  const statuses = ["Booked", "Queued", "Completed"];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  const token = Math.max(1, ...state.appointments.filter((a) => a.date === date).map((a) => a.token || 0)) + 1;

  state.appointments.unshift({
    id: uid("apt"),
    patientId: patient.id,
    doctorId: doctor.id,
    hubId: hub.id,
    date,
    time,
    channel: Math.random() > 0.5 ? "Online" : "Offline",
    status,
    token,
    createdAt: new Date().toISOString(),
  });

  if (Math.random() > 0.55) {
    const amount = Math.random() > 0.5 ? 20 : 35;
    state.invoices.unshift({
      id: uid("inv"),
      patientId: patient.id,
      hubId: hub.id,
      items: [{ name: amount === 20 ? "Consultation" : "X-Ray Chest", qty: 1, unit: amount }],
      method: "Cash",
      paid: Math.random() > 0.3 ? amount : 0,
      createdAt: new Date().toISOString(),
    });
  }

  saveState(state);
  const route = (location.hash || "").match(/^#(\/[a-z-]+)/i)?.[1] || "/dashboard";
  if (route === "/dashboard") render();
}

function viewDashboard() {
  setTitle("Dashboard", "Overview of today’s operations");
  activeNav("/dashboard");

  const today = todayISO();
  const apptsToday = state.appointments.filter((a) => a.date === today);
  const queued = apptsToday.filter((a) => a.status === "Queued").length;
  const booked = apptsToday.filter((a) => a.status === "Booked").length;
  const done = apptsToday.filter((a) => a.status === "Completed").length;
  const pendingReports = state.reports.filter((r) => r.status !== "Verified").length;
  const due = state.invoices.reduce((acc, inv) => {
    const total = sumInvoice(inv);
    return acc + Math.max(0, total - (inv.paid || 0));
  }, 0);

  const left = el("div", { class: "grid cols-3" }, [
    statCard("Appointments (Today)", apptsToday.length, `${queued} queued · ${booked} booked · ${done} completed`),
    statCard("Patients", state.patients.length, "Centralized patient database"),
    statCard("Due Amount", money(due), `${pendingReports} report(s) pending verification`),
  ]);

  const workflow = el("div", { class: "card soft" }, [
    el("div", { class: "card-title" }, [document.createTextNode("Work Order Flow")]),
    el("div", { class: "card-subtitle" }, [document.createTextNode("Typical end-to-end patient journey")]),
    el("div", { class: "help", html: state.notes.systemText.replaceAll("\n", "<br/>") }),
    el("div", { class: "card-actions" }, [
      el("button", { class: "btn", type: "button", onclick: () => location.hash = "#/patients" }, [document.createTextNode("Register patient")]),
      el("button", { class: "btn btn-ghost", type: "button", onclick: () => location.hash = "#/appointments" }, [document.createTextNode("Book appointment")]),
      el("button", { class: "btn btn-ghost", type: "button", onclick: () => location.hash = "#/billing" }, [document.createTextNode("Create invoice")]),
    ]),
  ]);

  const ops = el("div", { class: "grid cols-2" }, [
    recentAppointmentsCard(),
    alertsCard(),
  ]);

  const liveCard = el("div", { class: "card soft" }, [
    el("div", { class: "card-title" }, [document.createTextNode("Live Ops (Prototype)")]),
    el("div", { class: "card-subtitle" }, [document.createTextNode("Simulate live updates so charts and stats change.")]),
    el("div", { style: "margin-top:10px; display:flex; gap:10px; align-items:center; flex-wrap:wrap;" }, [
      el("label", { class: "chip", style: "cursor:pointer" }, [
        el("input", {
          type: "checkbox",
          style: "margin-right:8px; transform: translateY(1px)",
          checked: state.notes?.liveOpsEnabled ? "" : null,
          onchange: (e) => {
            state.notes = state.notes || {};
            state.notes.liveOpsEnabled = !!e.target.checked;
            saveState(state);
            ensureLiveOps();
            toast("Live Ops", state.notes.liveOpsEnabled ? "Enabled" : "Disabled");
          },
        }),
        document.createTextNode("Enable live data"),
      ]),
      el(
        "button",
        {
          class: "btn btn-ghost",
          type: "button",
          onclick: () => {
            tickLiveOps();
            toast("Live event", "Generated one demo event.");
          },
        },
        [document.createTextNode("Generate event")]
      ),
      el("span", { class: "help" }, [document.createTextNode("Updates every ~6s when enabled.")]),
    ]),
  ]);

  const chartRevenue = (() => {
    const byDay = new Map();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      byDay.set(key, 0);
    }
    for (const inv of state.invoices) {
      const key = (inv.createdAt || "").slice(0, 10);
      if (!byDay.has(key)) continue;
      byDay.set(key, byDay.get(key) + sumInvoice(inv));
    }
    const labels = [...byDay.keys()].map((k) => k.slice(5));
    const values = [...byDay.values()].map((v) => Math.round(v));

    const canvas = el("canvas", { class: "chart" });
    requestAnimationFrame(() => drawLineChart(canvas, labels, values, "rgba(110,231,255,.92)"));

    return el("div", { class: "card chart-card" }, [
      el("div", { class: "card-title" }, [document.createTextNode("Revenue Trend (Last 7 days)")]),
      el("div", { class: "card-subtitle" }, [document.createTextNode("Billed amount from invoices (demo data).")]),
      el("div", { class: "chart-wrap" }, [canvas]),
      el("div", { class: "legend" }, [
        el("span", { class: "legend-item" }, [
          el("span", { class: "swatch", style: "background: rgba(110,231,255,.92)" }),
          document.createTextNode("Revenue"),
        ]),
      ]),
    ]);
  })();

  const chartAppts = (() => {
    const labels = ["Queued", "Booked", "Completed", "Cancelled"];
    const values = labels.map((s) => apptsToday.filter((a) => a.status === s).length);
    const canvas = el("canvas", { class: "chart" });
    requestAnimationFrame(() => drawBarChart(canvas, ["Q", "B", "C", "X"], values, "rgba(139,92,246,.92)"));

    return el("div", { class: "card chart-card" }, [
      el("div", { class: "card-title" }, [document.createTextNode("Appointments Today")]),
      el("div", { class: "card-subtitle" }, [document.createTextNode("Status breakdown for today (demo).")]),
      el("div", { class: "chart-wrap" }, [canvas]),
      el("div", { class: "legend" }, values.map((v, i) =>
        el("span", { class: "legend-item" }, [
          el("span", { class: "swatch", style: "background: rgba(139,92,246,.92)" }),
          document.createTextNode(`${labels[i]}: ${v}`),
        ])
      )),
    ]);
  })();

  const charts = el("div", { class: "grid cols-2" }, [chartRevenue, chartAppts]);

  ensureLiveOps();

  return el("div", { class: "grid" }, [left, el("div", { class: "split" }, [workflow, quickPanelCard()]), liveCard, charts, ops]);
}

function statCard(title, value, subtitle) {
  return el("div", { class: "card" }, [
    el("div", { class: "stat" }, [
      el("div", {}, [
        el("div", { class: "card-title" }, [document.createTextNode(title)]),
        el("div", { class: "label" }, [document.createTextNode(subtitle)]),
      ]),
      el("div", { class: "value" }, [document.createTextNode(`${value}`)]),
    ]),
  ]);
}

function quickPanelCard() {
  return el("div", { class: "card" }, [
    el("div", { class: "card-title" }, [document.createTextNode("Quick Panel")]),
    el("div", { class: "card-subtitle" }, [document.createTextNode("Fast actions for hub operations")]),
    el("div", { class: "card-actions" }, [
      el("button", { class: "btn", type: "button", onclick: () => openCreatePatient() }, [document.createTextNode("New patient")]),
      el("button", { class: "btn btn-ghost", type: "button", onclick: () => openBookAppointment() }, [document.createTextNode("Book appointment")]),
      el("button", { class: "btn btn-ghost", type: "button", onclick: () => openCreateInvoice() }, [document.createTextNode("New invoice")]),
      el("button", { class: "btn btn-ghost", type: "button", onclick: () => openUploadDiagnosticEnhanced() }, [document.createTextNode("Upload diagnostic")]),
    ]),
    el("div", { class: "help" }, [
      document.createTextNode("Tip: press "),
      el("span", { class: "tag" }, [document.createTextNode("/")]),
      document.createTextNode(" to focus search."),
    ]),
  ]);
}

function recentAppointmentsCard() {
  const rows = state.appointments
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 6);

  const table = el("table", { class: "table" }, [
    el("thead", {}, [
      el("tr", {}, [
        el("th", {}, [document.createTextNode("Patient")]),
        el("th", {}, [document.createTextNode("Doctor")]),
        el("th", {}, [document.createTextNode("Date/Time")]),
        el("th", {}, [document.createTextNode("Status")]),
      ]),
    ]),
    el("tbody", {}, rows.map((a) => {
      const p = findById(state.patients, a.patientId);
      const d = findById(state.doctors, a.doctorId);
      return el("tr", {}, [
        el("td", {}, [el("strong", {}, [document.createTextNode(p?.name || "Unknown")]), document.createTextNode(`\n${p?.mobile || ""}`)]),
        el("td", {}, [el("strong", {}, [document.createTextNode(d?.name || "Unassigned")]), document.createTextNode(`\n${d?.specialty || ""}`)]),
        el("td", {}, [document.createTextNode(`${a.date} ${a.time}`)]),
        el("td", {}, [statusChip(a.status)]),
      ]);
    })),
  ]);

  return el("div", { class: "card" }, [
    el("div", { class: "card-title" }, [document.createTextNode("Recent Appointments")]),
    el("div", { class: "card-subtitle" }, [document.createTextNode("Queue and token flow at a glance")]),
    el("div", { style: "margin-top:10px" }, [rows.length ? table : renderEmpty()]),
  ]);
}

function alertsCard() {
  const dueCount = state.invoices.filter((inv) => sumInvoice(inv) > (inv.paid || 0)).length;
  const repPending = state.reports.filter((r) => r.status !== "Verified").length;
  const queue = state.appointments.filter((a) => a.status === "Queued").length;

  const list = el("div", { class: "grid" }, [
    callout(queue ? "Queue active" : "No queue", queue ? `${queue} patient(s) currently queued.` : "Today’s queue is empty.", queue ? "accent" : ""),
    callout(repPending ? "Reports need verification" : "Reports verified", repPending ? `${repPending} report(s) pending verification.` : "No pending verifications.", repPending ? "warn" : "good"),
    callout(dueCount ? "Dues to collect" : "No dues", dueCount ? `${dueCount} invoice(s) have outstanding dues.` : "All invoices are fully paid.", dueCount ? "bad" : "good"),
  ]);

  return el("div", { class: "card" }, [
    el("div", { class: "card-title" }, [document.createTextNode("Alerts")]),
    el("div", { class: "card-subtitle" }, [document.createTextNode("Operational health checks (demo)")]),
    el("div", { style: "margin-top:10px" }, [list]),
  ]);
}

function callout(title, subtitle, tone) {
  const dotTone =
    tone === "good" ? "background: var(--good); box-shadow: 0 0 0 4px rgba(52,211,153,.12)" :
    tone === "warn" ? "background: var(--warn); box-shadow: 0 0 0 4px rgba(251,191,36,.12)" :
    tone === "bad" ? "background: var(--bad); box-shadow: 0 0 0 4px rgba(251,113,133,.12)" :
    "background: var(--accent); box-shadow: 0 0 0 4px rgba(110,231,255,.10)";

  return el("div", { class: "callout" }, [
    el("div", { class: "dot", style: dotTone }),
    el("div", {}, [
      el("strong", {}, [document.createTextNode(title)]),
      el("div", { class: "sub" }, [document.createTextNode(subtitle)]),
    ]),
  ]);
}

function statusChip(status) {
  const s = String(status || "").toLowerCase();
  const cls = s.includes("verified") || s.includes("completed") ? "chip good" : s.includes("pending") ? "chip warn" : s.includes("cancel") ? "chip bad" : "chip";
  return el("span", { class: cls }, [document.createTextNode(status)]);
}

function viewPatients() {
  setTitle("Patients", "Registration, search, profile, and visit history");
  activeNav("/patients");

  const header = el("div", { class: "card soft" }, [
    el("div", { class: "card-title" }, [document.createTextNode("Patient Management")]),
    el("div", { class: "card-subtitle" }, [document.createTextNode("Register patients and quickly find them by mobile number.")]),
    el("div", { class: "card-actions" }, [
      el("button", { class: "btn", type: "button", onclick: () => openCreatePatient() }, [document.createTextNode("New patient")]),
      el("button", { class: "btn btn-ghost", type: "button", onclick: () => toast("Tip", "Use the global search bar to find by mobile.") }, [document.createTextNode("Search tip")]),
    ]),
  ]);

  const rows = state.patients
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((p) => {
      const apptCount = state.appointments.filter((a) => a.patientId === p.id).length;
      const lastAppt = state.appointments
        .filter((a) => a.patientId === p.id)
        .slice()
        .sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time))[0];

      return el("tr", {}, [
        el("td", {}, [
          el("strong", {}, [document.createTextNode(p.name)]),
          el("div", { class: "help" }, [document.createTextNode(`ID: ${p.id}`)]),
        ]),
        el("td", {}, [document.createTextNode(p.mobile)]),
        el("td", {}, [document.createTextNode(`${p.age}`)]),
        el("td", {}, [document.createTextNode(p.sex)]),
        el("td", {}, [document.createTextNode(`${apptCount}`)]),
        el("td", {}, [document.createTextNode(lastAppt ? `${lastAppt.date} ${lastAppt.time}` : "—")]),
        el("td", {}, [
          el("button", { class: "btn btn-ghost", type: "button", onclick: () => openPatientProfile(p.id) }, [document.createTextNode("Open")]),
        ]),
      ]);
    });

  const table = el("table", { class: "table" }, [
    el("thead", {}, [
      el("tr", {}, [
        el("th", {}, [document.createTextNode("Patient")]),
        el("th", {}, [document.createTextNode("Mobile")]),
        el("th", {}, [document.createTextNode("Age")]),
        el("th", {}, [document.createTextNode("Sex")]),
        el("th", {}, [document.createTextNode("Visits")]),
        el("th", {}, [document.createTextNode("Last appointment")]),
        el("th", {}, [document.createTextNode("")]),
      ]),
    ]),
    el("tbody", {}, rows),
  ]);

  return el("div", { class: "grid" }, [header, el("div", { class: "card" }, [table])]);
}

function viewAppointments() {
  setTitle("Appointments", "Online/offline booking, schedule, tokens, follow-ups");
  activeNav("/appointments");

  const header = el("div", { class: "card soft" }, [
    el("div", { class: "card-title" }, [document.createTextNode("Doctor Appointment Module")]),
    el("div", { class: "card-subtitle" }, [document.createTextNode("Book appointments, manage token queue, and mark consultations.")]),
    el("div", { class: "card-actions" }, [
      el("button", { class: "btn", type: "button", onclick: () => openBookAppointment() }, [document.createTextNode("Book appointment")]),
      el("button", { class: "btn btn-ghost", type: "button", onclick: () => openMarkCompleted() }, [document.createTextNode("Mark completed")]),
    ]),
  ]);

  const rows = state.appointments
    .slice()
    .sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time))
    .map((a) => {
      const p = findById(state.patients, a.patientId);
      const d = findById(state.doctors, a.doctorId);
      return el("tr", {}, [
        el("td", {}, [el("strong", {}, [document.createTextNode(p?.name || "Unknown")]), el("div", { class: "help" }, [document.createTextNode(p?.mobile || "")])]),
        el("td", {}, [document.createTextNode(`${a.date} ${a.time}`)]),
        el("td", {}, [document.createTextNode(d?.name || "—")]),
        el("td", {}, [document.createTextNode(a.channel)]),
        el("td", {}, [document.createTextNode(`${a.token ?? "—"}`)]),
        el("td", {}, [statusChip(a.status)]),
        el("td", {}, [
          el("button", { class: "btn btn-ghost", type: "button", onclick: () => openAppointmentDetails(a.id) }, [document.createTextNode("Details")]),
        ]),
      ]);
    });

  const table = el("table", { class: "table" }, [
    el("thead", {}, [
      el("tr", {}, [
        el("th", {}, [document.createTextNode("Patient")]),
        el("th", {}, [document.createTextNode("Date/Time")]),
        el("th", {}, [document.createTextNode("Doctor")]),
        el("th", {}, [document.createTextNode("Channel")]),
        el("th", {}, [document.createTextNode("Token")]),
        el("th", {}, [document.createTextNode("Status")]),
        el("th", {}, [document.createTextNode("")]),
      ]),
    ]),
    el("tbody", {}, rows.length ? rows : [el("tr", {}, [el("td", { colspan: "7" }, [renderEmpty()])])]),
  ]);

  return el("div", { class: "grid" }, [header, el("div", { class: "card" }, [table])]);
}

function viewDoctors() {
  setTitle("Doctors", "Scheduling, assignments, availability");
  activeNav("/doctors");

  const header = el("div", { class: "card soft" }, [
    el("div", { class: "card-title" }, [document.createTextNode("Doctor Scheduling")]),
    el("div", { class: "card-subtitle" }, [document.createTextNode("Manage doctors, room assignment, and demo schedules.")]),
    el("div", { class: "card-actions" }, [
      el("button", { class: "btn", type: "button", onclick: () => openAddDoctor() }, [document.createTextNode("Add doctor")]),
      el("button", { class: "btn btn-ghost", type: "button", onclick: () => toast("Demo", "Schedules are illustrative only (static prototype).") }, [document.createTextNode("About schedules")]),
    ]),
  ]);

  const list = el("div", { class: "grid cols-3" }, state.doctors.map((d) => {
    const apptCount = state.appointments.filter((a) => a.doctorId === d.id && a.date === todayISO()).length;
    return el("div", { class: "card" }, [
      el("div", { class: "card-title" }, [document.createTextNode(d.name)]),
      el("div", { class: "card-subtitle" }, [document.createTextNode(`${d.specialty} · Room ${d.room}`)]),
      el("div", { style: "margin-top:10px; display:flex; gap:8px; flex-wrap:wrap;" }, [
        el("span", { class: "chip" }, [document.createTextNode(`Today: ${apptCount} appt(s)`) ]),
        el("span", { class: d.active ? "chip good" : "chip bad" }, [document.createTextNode(d.active ? "Active" : "Inactive")]),
      ]),
      el("div", { class: "card-actions" }, [
        el("button", { class: "btn btn-ghost", type: "button", onclick: () => openDoctorAvailability(d.id) }, [document.createTextNode("Availability")]),
      ]),
    ]);
  }));

  return el("div", { class: "grid" }, [header, list]);
}

function viewPrescriptions() {
  setTitle("Prescriptions", "Central/Hub entry, doctor panel, printing (demo)");
  activeNav("/prescriptions");

  const header = el("div", { class: "card soft" }, [
    el("div", { class: "card-title" }, [document.createTextNode("Prescription Management")]),
    el("div", { class: "card-subtitle" }, [document.createTextNode("Create prescriptions for an appointment. Supports Bangla & English (demo).")]),
    el("div", { class: "card-actions" }, [
      el("button", { class: "btn", type: "button", onclick: () => openCreatePrescription() }, [document.createTextNode("New prescription")]),
    ]),
  ]);

  const rows = state.prescriptions
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((rx) => {
      const p = findById(state.patients, rx.patientId);
      const d = findById(state.doctors, rx.doctorId);
      return el("tr", {}, [
        el("td", {}, [el("strong", {}, [document.createTextNode(p?.name || "Unknown")]), el("div", { class: "help" }, [document.createTextNode(p?.mobile || "")])]),
        el("td", {}, [document.createTextNode(d?.name || "—")]),
        el("td", {}, [document.createTextNode(rx.language)]),
        el("td", {}, [document.createTextNode(formatDT(rx.createdAt))]),
        el("td", {}, [
          el("button", { class: "btn btn-ghost", type: "button", onclick: () => openPrescriptionPrint(rx.id) }, [document.createTextNode("Print view")]),
        ]),
      ]);
    });

  const table = el("table", { class: "table" }, [
    el("thead", {}, [
      el("tr", {}, [
        el("th", {}, [document.createTextNode("Patient")]),
        el("th", {}, [document.createTextNode("Doctor")]),
        el("th", {}, [document.createTextNode("Language")]),
        el("th", {}, [document.createTextNode("Created")]),
        el("th", {}, [document.createTextNode("")]),
      ]),
    ]),
    el("tbody", {}, rows.length ? rows : [el("tr", {}, [el("td", { colspan: "5" }, [renderEmpty()])])]),
  ]);

  return el("div", { class: "grid" }, [header, el("div", { class: "card" }, [table])]);
}

function viewDiagnostics() {
  setTitle("Diagnostics", "Imaging uploads, reports, cross-PC viewing (demo)");
  activeNav("/diagnostics");

  const header = el("div", { class: "card soft" }, [
    el("div", { class: "card-title" }, [document.createTextNode("Diagnostic & Imaging Management")]),
    el("div", { class: "card-subtitle" }, [document.createTextNode("Upload scan images and generate diagnostic reports (prototype).")]),
    el("div", { class: "card-actions" }, [
      el("button", { class: "btn", type: "button", onclick: () => openUploadDiagnosticEnhanced() }, [document.createTextNode("Upload image")]),
      el("button", { class: "btn btn-ghost", type: "button", onclick: () => openCreateReport() }, [document.createTextNode("Create report")]),
      el("button", { class: "btn btn-ghost", type: "button", onclick: () => openInvestigationLifecycle() }, [document.createTextNode("Investigation lifecycle")]),
    ]),
  ]);

  const rows = state.diagnostics
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((d) => {
      const p = findById(state.patients, d.patientId);
      return el("tr", {}, [
        el("td", {}, [el("strong", {}, [document.createTextNode(p?.name || "Unknown")]), el("div", { class: "help" }, [document.createTextNode(p?.mobile || "")])]),
        el("td", {}, [document.createTextNode(d.testType)]),
        el("td", {}, [document.createTextNode(d.bodyPart)]),
        el("td", {}, [statusChip(d.status)]),
        el("td", {}, [document.createTextNode(d.fileName || "—")]),
        el("td", {}, [
          el("button", { class: "btn btn-ghost", type: "button", onclick: () => openDiagnosticViewerEnhanced(d.id) }, [document.createTextNode("View")]),
        ]),
      ]);
    });

  const table = el("table", { class: "table" }, [
    el("thead", {}, [
      el("tr", {}, [
        el("th", {}, [document.createTextNode("Patient")]),
        el("th", {}, [document.createTextNode("Test")]),
        el("th", {}, [document.createTextNode("Body part")]),
        el("th", {}, [document.createTextNode("Status")]),
        el("th", {}, [document.createTextNode("File")]),
        el("th", {}, [document.createTextNode("")]),
      ]),
    ]),
    el("tbody", {}, rows.length ? rows : [el("tr", {}, [el("td", { colspan: "6" }, [renderEmpty()])])]),
  ]);

  return el("div", { class: "grid" }, [header, el("div", { class: "card" }, [table]), reportsMiniPanel()]);
}

function reportsMiniPanel() {
  const pending = state.reports
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5)
    .map((r) => {
      const p = findById(state.patients, r.patientId);
      return el("div", { class: "callout" }, [
        el("div", { class: "dot", style: r.status === "Verified" ? "background: var(--good)" : "background: var(--warn)" }),
        el("div", {}, [
          el("strong", {}, [document.createTextNode(r.title)]),
          el("div", { class: "sub" }, [document.createTextNode(`${p?.name || "Unknown"} · ${r.status}`)]),
        ]),
        el("div", { style: "margin-left:auto" }, [
          el("button", { class: "btn btn-ghost", type: "button", onclick: () => openVerifyReport(r.id) }, [document.createTextNode("Open")]),
        ]),
      ]);
    });

  return el("div", { class: "card" }, [
    el("div", { class: "card-title" }, [document.createTextNode("Report Verification")]),
    el("div", { class: "card-subtitle" }, [document.createTextNode("Verify pending diagnostic reports (demo)")]),
    el("div", { style: "margin-top:10px" }, [pending.length ? el("div", { class: "grid" }, pending) : renderEmpty()]),
  ]);
}

function openInvestigationLifecycle() {
  const catalog = {
    "Pathology / Laboratory": [
      "Complete Blood Count (CBC)",
      "Blood Glucose (Fasting)",
      "Blood Glucose (PP)",
      "Blood Glucose (Random)",
      "Lipid Profile",
      "Liver Function Tests (LFT)",
      "Kidney Function Tests (KFT)",
      "Urine Routine & Culture",
      "Thyroid Function Tests",
      "HbA1c",
      "ESR",
      "CRP",
    ],
    "Radiology & Imaging": [
      "X-Ray (Digital/Analog) Upload",
      "Ultrasound Report & Images",
      "CT Scan Report Upload",
      "MRI Report Upload",
      "DICOM Image Viewer (Optional)",
      "Radiologist Remarks Entry",
    ],
    Cardiology: [
      "ECG Report Upload",
      "Echocardiography Report",
      "Holter Monitor Report",
      "TMT / Stress Test Report",
    ],
    "Special Diagnostics": [
      "Endoscopy Reports",
      "Biopsy / Histopathology",
      "Microbiology Culture Reports",
      "Allergy Testing Reports",
    ],
  };

  const statuses = ["Ordered", "Collected", "Processing", "Report Draft", "Approved", "Delivered"];

  const nextStatus = (s) => {
    const i = statuses.indexOf(s);
    return i >= 0 && i < statuses.length - 1 ? statuses[i + 1] : s;
  };

  const stampFor = (status) => {
    if (status === "Collected") return "collectedAt";
    if (status === "Processing") return "processedAt";
    if (status === "Approved") return "approvedAt";
    if (status === "Delivered") return "deliveredAt";
    return "";
  };

  const uniquePatients = state.patients.map((p) => ({ value: p.id, label: `${p.name} (${p.mobile})` }));
  const uniqueDoctors = state.doctors.map((d) => ({ value: d.id, label: `${d.name} — ${d.specialty}` }));
  const hubOptions = (state.hubs || []).map((h) => ({ value: h.id, label: `${h.name}${h.active ? "" : " (inactive)"}` }));

  const defaultCategory = Object.keys(catalog)[0];
  const defaultTest = catalog[defaultCategory][0];

  const root = el("div", { class: "grid cols-2" }, []);

  const buildTestSelectOptions = (category, select) => {
    const tests = catalog[category] || [];
    select.replaceChildren(...tests.map((t) => el("option", { value: t }, [document.createTextNode(t)])));
    if (tests.length) select.value = tests[0];
  };

  const openReportEditor = (invId) => {
    const inv = state.investigations.find((x) => x.id === invId);
    if (!inv) return;
    const body = el("div", { class: "form" }, [
      fieldTextarea("Report summary", "reportSummary", "Write report summary...", inv.reportSummary || ""),
      fieldTextarea("Remarks", "remarks", "Radiologist/Pathologist remarks...", inv.remarks || ""),
      fieldSelect("Status", "status", statuses, inv.status),
    ]);
    openModal({
      title: "Report Generation / Approval",
      bodyNode: body,
      primaryText: "Save",
      onPrimary: () => {
        const v = readForm(body);
        inv.reportSummary = v.reportSummary || "";
        inv.remarks = v.remarks || "";
        inv.status = v.status || inv.status;
        const stamp = stampFor(inv.status);
        if (stamp && !inv[stamp]) inv[stamp] = new Date().toISOString();
        saveState(state);
        toast("Saved", "Investigation updated.");
        renderBoard();
      },
      wide: true,
    });
  };

  const advance = (invId) => {
    const inv = state.investigations.find((x) => x.id === invId);
    if (!inv) return;
    const n = nextStatus(inv.status);
    if (n === inv.status) return;
    inv.status = n;
    const stamp = stampFor(n);
    if (stamp) inv[stamp] = new Date().toISOString();
    saveState(state);
    toast("Advanced", `Status: ${inv.status}`);
    renderBoard();
  };

  const buildOrderCard = () => {
    const card = el("div", { class: "card soft" }, [
      el("div", { class: "card-title" }, [document.createTextNode("Investigation Ordering")]),
      el("div", { class: "card-subtitle" }, [
        document.createTextNode(
          "Order tests → sample collection → processing → report draft → approval → delivery (prototype)."
        ),
      ]),
    ]);

    const form = el("div", { class: "form", style: "margin-top:10px" }, [
      fieldSelect("Patient", "patientId", uniquePatients),
      fieldSelect("Ordering doctor", "doctorId", uniqueDoctors),
      fieldSelect("Hub/Branch", "hubId", hubOptions, state.notes?.selectedHubId || (hubOptions[0]?.value || "")),
      fieldSelect("Department", "category", Object.keys(catalog), defaultCategory),
      (() => {
        const field = el("div", { class: "field" }, [
          el("label", {}, [document.createTextNode("Test name")]),
          el("select", { name: "testName" }, []),
        ]);
        const select = $("select", field);
        buildTestSelectOptions(defaultCategory, select);
        return field;
      })(),
      fieldSelect("Priority", "priority", ["Routine", "Urgent", "STAT"], "Routine"),
      fieldTextarea("Clinical note", "clinicalNote", "Reason / symptoms / instruction...", ""),
    ]);

    // Wire dynamic test list
    const categorySelect = form.querySelector("select[name='category']");
    const testSelect = form.querySelector("select[name='testName']");
    categorySelect.addEventListener("change", () => buildTestSelectOptions(categorySelect.value, testSelect));

    const actions = el("div", { class: "card-actions" }, [
      el(
        "button",
        {
          class: "btn",
          type: "button",
          onclick: () => {
            const v = readForm(form);
            if (!v.patientId || !v.doctorId) return toast("Missing fields", "Select patient and ordering doctor.");
            const inv = {
              id: uid("invst"),
              patientId: v.patientId,
              doctorId: v.doctorId,
              hubId: v.hubId || "",
              category: v.category || defaultCategory,
              testName: v.testName || defaultTest,
              priority: v.priority || "Routine",
              status: "Ordered",
              orderedAt: new Date().toISOString(),
              collectedAt: "",
              processedAt: "",
              approvedAt: "",
              deliveredAt: "",
              reportSummary: "",
              remarks: "",
              clinicalNote: v.clinicalNote || "",
            };
            state.investigations.unshift(inv);
            saveState(state);
            toast("Ordered", `${inv.testName}`);
            renderBoard();
          },
        },
        [document.createTextNode("Order test")]
      ),
      el(
        "button",
        {
          class: "btn btn-ghost",
          type: "button",
          onclick: () => {
            toast("Tip", "Use the board to move items through collection → processing → approval → delivery.");
          },
        },
        [document.createTextNode("How it works")]
      ),
    ]);

    card.append(form, actions);

    const catalogCard = el("div", { class: "card", style: "margin-top:14px" }, [
      el("div", { class: "card-title" }, [document.createTextNode("Test Catalog (Reference)")]),
      el("div", { class: "card-subtitle" }, [document.createTextNode("Available departments and tests in this prototype UI.")]),
      el(
        "div",
        { class: "grid", style: "margin-top:10px" },
        Object.entries(catalog).map(([cat, tests]) =>
          el("div", { class: "callout" }, [
            el("div", { class: "dot" }),
            el("div", {}, [
              el("strong", {}, [document.createTextNode(cat)]),
              el("div", { class: "sub" }, [document.createTextNode(tests.join(", "))]),
            ]),
          ])
        )
      ),
    ]);

    return el("div", { class: "grid" }, [card, catalogCard]);
  };

  const boardHost = el("div", { class: "grid" }, []);

  const renderBoard = () => {
    const cols = statuses.map((s) => {
      const items = state.investigations.filter((i) => i.status === s);
      const stack = el(
        "div",
        { class: "grid" },
        items.map((i) => {
          const p = findById(state.patients, i.patientId);
          const d = findById(state.doctors, i.doctorId);
          const hub = findById(state.hubs || [], i.hubId);
          return el("div", { class: "card" }, [
            el("div", { class: "card-title" }, [document.createTextNode(i.testName)]),
            el("div", { class: "card-subtitle" }, [
              document.createTextNode(`${i.category} · ${hub?.name || i.hubId || "—"}`),
            ]),
            el("div", { style: "margin-top:10px; display:flex; gap:8px; flex-wrap:wrap;" }, [
              statusChip(i.status),
              el("span", { class: i.priority === "STAT" ? "chip bad" : i.priority === "Urgent" ? "chip warn" : "chip" }, [
                document.createTextNode(i.priority),
              ]),
              el("span", { class: "chip" }, [document.createTextNode(`Patient: ${p?.name || "Unknown"}`)]),
              el("span", { class: "chip" }, [document.createTextNode(`Doctor: ${d?.name || "—"}`)]),
            ]),
            i.clinicalNote
              ? el("div", { class: "help", style: "margin-top:10px" }, [document.createTextNode(`Note: ${i.clinicalNote}`)])
              : el("div", {}),
            i.reportSummary
              ? el("div", { class: "help", style: "margin-top:10px" }, [document.createTextNode(`Report: ${i.reportSummary}`)])
              : el("div", {}),
            el("div", { class: "card-actions" }, [
              el("button", { class: "btn btn-ghost", type: "button", onclick: () => openReportEditor(i.id) }, [document.createTextNode("Report/Approve")]),
              el("button", { class: "btn", type: "button", onclick: () => advance(i.id), disabled: i.status === "Delivered" ? "" : null }, [document.createTextNode(i.status === "Delivered" ? "Done" : "Next step")]),
            ]),
          ]);
        })
      );

      return el("div", { class: "card soft" }, [
        el("div", { class: "card-title" }, [document.createTextNode(s)]),
        el("div", { class: "card-subtitle" }, [document.createTextNode(`${items.length} item(s)`) ]),
        el("div", { style: "margin-top:10px" }, [items.length ? stack : renderEmpty()]),
      ]);
    });

    boardHost.replaceChildren(
      el("div", { class: "card soft" }, [
        el("div", { class: "card-title" }, [document.createTextNode("Investigation Lifecycle Board")]),
        el("div", { class: "card-subtitle" }, [document.createTextNode("Move investigations through the lifecycle stages.")]),
      ]),
      el("div", { class: "grid cols-3" }, cols)
    );
  };

  root.replaceChildren(buildOrderCard(), boardHost);
  renderBoard();

  openModal({
    title: "Diagnostic Investigations Lifecycle",
    bodyNode: root,
    primaryText: "Close",
    onPrimary: () => {},
    wide: true,
  });
}

function viewBilling() {
  setTitle("Billing", "Invoices, due collection, income/expense (demo)");
  activeNav("/billing");

  const header = el("div", { class: "card soft" }, [
    el("div", { class: "card-title" }, [document.createTextNode("Accounting & Billing")]),
    el("div", { class: "card-subtitle" }, [document.createTextNode("Create invoices, collect dues, and export summary (prototype).")]),
    el("div", { class: "card-actions" }, [
      el("button", { class: "btn", type: "button", onclick: () => openCreateInvoice() }, [document.createTextNode("New invoice")]),
      el("button", { class: "btn btn-ghost", type: "button", onclick: () => openCollectDue() }, [document.createTextNode("Collect due")]),
      el("button", { class: "btn btn-ghost", type: "button", onclick: () => openAccountingSuite() }, [document.createTextNode("Accounting suite")]),
    ]),
  ]);

  const rows = state.invoices
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((inv) => {
      const p = findById(state.patients, inv.patientId);
      const total = invoiceNet(inv);
      const due = invoiceDue(inv);
      return el("tr", {}, [
        el("td", {}, [el("strong", {}, [document.createTextNode(inv.id)]), el("div", { class: "help" }, [document.createTextNode(formatDT(inv.createdAt))])]),
        el("td", {}, [document.createTextNode(p?.name || "Unknown")]),
        el("td", {}, [document.createTextNode(money(total))]),
        el("td", {}, [document.createTextNode(money(inv.paid || 0))]),
        el("td", {}, [due === 0 ? statusChip("Paid") : statusChip("Due")]),
        el("td", {}, [
          el("button", { class: "btn btn-ghost", type: "button", onclick: () => openInvoiceDetails(inv.id) }, [document.createTextNode("Open")]),
        ]),
      ]);
    });

  const table = el("table", { class: "table" }, [
    el("thead", {}, [
      el("tr", {}, [
        el("th", {}, [document.createTextNode("Invoice")]),
        el("th", {}, [document.createTextNode("Patient")]),
        el("th", {}, [document.createTextNode("Total")]),
        el("th", {}, [document.createTextNode("Paid")]),
        el("th", {}, [document.createTextNode("Status")]),
        el("th", {}, [document.createTextNode("")]),
      ]),
    ]),
    el("tbody", {}, rows.length ? rows : [el("tr", {}, [el("td", { colspan: "6" }, [renderEmpty()])])]),
  ]);

  return el("div", { class: "grid" }, [header, el("div", { class: "card" }, [table])]);
}

function viewReports() {
  setTitle("Reports", "Daily/monthly and wise reports with export (prototype)");
  activeNav("/reports");

  state.notes = state.notes || {};
  const kinds = [
    { id: "daily", label: "Daily Report" },
    { id: "monthly", label: "Monthly Report" },
    { id: "testWise", label: "Test Wise Report" },
    { id: "doctorWise", label: "Doctor Wise Report" },
    { id: "patientTypeWise", label: "Patient Type Wise Report" },
    { id: "testTypeWise", label: "Test Type Wise Report" },
    { id: "centerWise", label: "Center Wise Report" },
    { id: "hubWise", label: "Hub Wise Report" },
  ];

  const selectedKind = state.notes.reportsKind || "daily";
  const reportDay = state.notes.reportsDay || todayISO();
  const reportMonth = state.notes.reportsMonth || reportDay.slice(0, 7);
  const reportsHubId = state.notes.reportsHubId || "all";
  const reportsTestName = state.notes.reportsTestName || "all";
  const reportsDoctorId = state.notes.reportsDoctorId || "all";
  const reportsPatientType = state.notes.reportsPatientType || "all";
  const reportsTestType = state.notes.reportsTestType || "all";

  const header = el("div", { class: "card soft" }, [
    el("div", { class: "card-title" }, [document.createTextNode("Report Menu")]),
    el("div", { class: "card-subtitle" }, [document.createTextNode("Choose a report type and export CSV/Excel/PDF (print).")]),
    el("div", { class: "row", style: "margin-top:10px" }, [
      fieldSelect("Report type", "kind", kinds.map((k) => ({ value: k.id, label: k.label })), selectedKind),
      fieldInput("Date", "day", "", "date", reportDay),
    ]),
    el("div", { class: "card-actions" }, [
      el("button", {
        class: "btn",
        type: "button",
        onclick: () => {
          const v = readForm(header);
          state.notes.reportsKind = v.kind;
          state.notes.reportsDay = v.day || todayISO();
          state.notes.reportsMonth = (v.day || todayISO()).slice(0, 7);
          saveState(state);
          render();
        },
      }, [document.createTextNode("Run report")]),
    ]),
  ]);

  const invoiceLines = state.invoices.flatMap((inv) =>
    (inv.items || []).map((it) => ({
      invoiceId: inv.id,
      patientId: inv.patientId,
      hubId: inv.hubId || "hub_main",
      createdAt: inv.createdAt,
      paid: Number(inv.paid || 0),
      name: it.name,
      qty: Number(it.qty || 0),
      unit: Number(it.unit || 0),
      total: Number(it.qty || 0) * Number(it.unit || 0),
    }))
  );

  const hubOptions = [
    { value: "all", label: "All hubs" },
    ...state.hubs.map((h) => ({ value: h.id, label: h.name })),
  ];
  const testNameOptions = [
    { value: "all", label: "All tests/services" },
    ...[...new Set(invoiceLines.map((l) => l.name).filter(Boolean))].sort().map((n) => ({ value: n, label: n })),
  ];
  const doctorOptions = [
    { value: "all", label: "All doctors" },
    ...state.doctors.map((d) => ({ value: d.id, label: `${d.name} — ${d.specialty}` })),
  ];
  const patientTypeOptions = [
    { value: "all", label: "All patient types" },
    ...[...new Set(state.patients.map((p) => p.patientType || "General"))].sort().map((t) => ({ value: t, label: t })),
  ];
  const testTypeOptions = [
    { value: "all", label: "All test types" },
    ...[...new Set(state.diagnostics.map((d) => d.testType || "Unknown"))].sort().map((t) => ({ value: t, label: t })),
  ];

  const filtersCard = (() => {
    const rows = [];

    const add = (node) => rows.push(node);

    if (selectedKind === "daily") {
      add(fieldInput("Daily date", "f_day", "", "date", reportDay));
      add(fieldSelect("Hub", "f_hubId", hubOptions, reportsHubId));
      add(fieldSelect("Test/service", "f_testName", testNameOptions, reportsTestName));
    } else if (selectedKind === "monthly") {
      add(fieldInput("Month", "f_month", "", "month", reportMonth));
      add(fieldSelect("Hub", "f_hubId", hubOptions, reportsHubId));
      add(fieldSelect("Test/service", "f_testName", testNameOptions, reportsTestName));
    } else if (selectedKind === "testWise") {
      add(fieldSelect("Test/service", "f_testName", testNameOptions, reportsTestName));
      add(fieldSelect("Hub", "f_hubId", hubOptions, reportsHubId));
      add(fieldInput("Date (optional)", "f_day", "", "date", reportDay));
    } else if (selectedKind === "doctorWise") {
      add(fieldSelect("Doctor", "f_doctorId", doctorOptions, reportsDoctorId));
      add(fieldInput("Month (optional)", "f_month", "", "month", reportMonth));
      add(fieldSelect("Hub (optional)", "f_hubId", hubOptions, reportsHubId));
    } else if (selectedKind === "patientTypeWise") {
      add(fieldSelect("Patient type", "f_patientType", patientTypeOptions, reportsPatientType));
      add(fieldInput("Month (optional)", "f_month", "", "month", reportMonth));
    } else if (selectedKind === "testTypeWise") {
      add(fieldSelect("Test type", "f_testType", testTypeOptions, reportsTestType));
      add(fieldSelect("Hub (optional)", "f_hubId", hubOptions, reportsHubId));
    } else if (selectedKind === "hubWise") {
      add(fieldSelect("Hub/Branch", "f_hubId", hubOptions, reportsHubId));
      add(fieldInput("Month (optional)", "f_month", "", "month", reportMonth));
    } else if (selectedKind === "centerWise") {
      add(fieldInput("Month (optional)", "f_month", "", "month", reportMonth));
    }

    const wrap = el("div", { class: "card" }, [
      el("div", { class: "card-title" }, [document.createTextNode("Filters")]),
      el("div", { class: "card-subtitle" }, [document.createTextNode("Select related data (hub/test/doctor/date) to prepare the report.")]),
      el("div", { class: "row", style: "margin-top:10px" }, rows),
      el("div", { class: "card-actions" }, [
        el("button", {
          class: "btn",
          type: "button",
          onclick: () => {
            const v = readForm(wrap);
            if (v.f_day) state.notes.reportsDay = v.f_day;
            if (v.f_month) state.notes.reportsMonth = v.f_month;
            if (v.f_hubId) state.notes.reportsHubId = v.f_hubId;
            if (v.f_testName) state.notes.reportsTestName = v.f_testName;
            if (v.f_doctorId) state.notes.reportsDoctorId = v.f_doctorId;
            if (v.f_patientType) state.notes.reportsPatientType = v.f_patientType;
            if (v.f_testType) state.notes.reportsTestType = v.f_testType;
            saveState(state);
            render();
          },
        }, [document.createTextNode("Apply filters")]),
        el("button", {
          class: "btn btn-ghost",
          type: "button",
          onclick: () => {
            delete state.notes.reportsHubId;
            delete state.notes.reportsTestName;
            delete state.notes.reportsDoctorId;
            delete state.notes.reportsPatientType;
            delete state.notes.reportsTestType;
            saveState(state);
            toast("Filters reset", "Filters cleared for the selected report type.");
            render();
          },
        }, [document.createTextNode("Reset filters")]),
      ]),
    ]);

    return wrap;
  })();

  const groupSum = (rows, keyFn) => {
    const map = new Map();
    for (const r of rows) {
      const key = keyFn(r);
      map.set(key, (map.get(key) || 0) + (r.total || 0));
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  };

  const filteredInvoiceLines = invoiceLines.filter((r) => {
    if (reportsHubId !== "all" && (r.hubId || "hub_main") !== reportsHubId) return false;
    if (reportsTestName !== "all" && (r.name || "") !== reportsTestName) return false;
    return true;
  });

  const byDay = filteredInvoiceLines.filter((r) => (r.createdAt || "").slice(0, 10) === reportDay);
  const byMonth = filteredInvoiceLines.filter((r) => (r.createdAt || "").slice(0, 7) === reportMonth);

  const makeTable = (title, columns, rows) => {
    const csvName = `${title.replaceAll(" ", "_").toLowerCase()}_${Date.now()}.csv`;
    const xlsName = `${title.replaceAll(" ", "_").toLowerCase()}_${Date.now()}.xls`;
    const pdfTitle = `${title} (${selectedKind})`;

    const actions = el("div", { class: "card-actions" }, [
      el("button", {
        class: "btn btn-ghost",
        type: "button",
        onclick: () => downloadBlob(csvName, "text/csv;charset=utf-8", toCSV(columns, rows)),
      }, [document.createTextNode("Export CSV")]),
      el("button", {
        class: "btn btn-ghost",
        type: "button",
        onclick: () => downloadBlob(xlsName, "application/vnd.ms-excel;charset=utf-8", toXlsHtml(columns, rows, pdfTitle)),
      }, [document.createTextNode("Export Excel")]),
      el("button", { class: "btn btn-ghost", type: "button", onclick: () => window.print() }, [document.createTextNode("Export PDF")]),
    ]);

    const table = el("table", { class: "table", style: "margin-top:10px" }, [
      el("thead", {}, [
        el("tr", {}, columns.map((c) => el("th", {}, [document.createTextNode(c.label)]))),
      ]),
      el(
        "tbody",
        {},
        rows.length
          ? rows.map((r) =>
              el("tr", {}, columns.map((c) => el("td", {}, [document.createTextNode(String(r[c.key] ?? ""))])))
            )
          : [el("tr", {}, [el("td", { colspan: `${columns.length}` }, [renderEmpty()])])]
      ),
    ]);

    return el("div", { class: "card" }, [
      el("div", { class: "card-title" }, [document.createTextNode(title)]),
      el("div", { class: "card-subtitle" }, [document.createTextNode(`Report type: ${kinds.find((k) => k.id === selectedKind)?.label || selectedKind}`)]),
      actions,
      table,
    ]);
  };

  let title = "Daily Report";
  let columns = [];
  let rows = [];

  if (selectedKind === "daily") {
    title = `Daily Report (${reportDay})`;
    const pairs = groupSum(byDay, (r) => r.name || "Unknown");
    columns = [
      { key: "service", label: "Service/Test" },
      { key: "revenue", label: "Revenue" },
    ];
    rows = pairs.map(([service, revenue]) => ({ service, revenue: money(revenue) }));
  } else if (selectedKind === "monthly") {
    title = `Monthly Report (${reportMonth})`;
    const pairs = groupSum(byMonth, (r) => r.name || "Unknown");
    columns = [
      { key: "service", label: "Service/Test" },
      { key: "revenue", label: "Revenue" },
    ];
    rows = pairs.map(([service, revenue]) => ({ service, revenue: money(revenue) }));
  } else if (selectedKind === "testWise") {
    title = "Test Wise Report";
    if (reportsTestName !== "all") {
      columns = [
        { key: "invoiceId", label: "Invoice" },
        { key: "date", label: "Date" },
        { key: "hub", label: "Hub" },
        { key: "test", label: "Test/Service" },
        { key: "amount", label: "Amount" },
      ];
      const lines = filteredInvoiceLines
        .filter((r) => (r.createdAt || "").slice(0, 10) === reportDay || selectedKind === "testWise")
        .slice()
        .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
      rows = lines.map((l) => ({
        invoiceId: l.invoiceId,
        date: (l.createdAt || "").slice(0, 10),
        hub: findById(state.hubs, l.hubId)?.name || l.hubId,
        test: l.name,
        amount: money(l.total || 0),
      }));
    } else {
      const pairs = groupSum(filteredInvoiceLines, (r) => r.name || "Unknown");
      columns = [
        { key: "test", label: "Test/Service" },
        { key: "revenue", label: "Revenue" },
      ];
      rows = pairs.map(([test, revenue]) => ({ test, revenue: money(revenue) }));
    }
  } else if (selectedKind === "doctorWise") {
    title = "Doctor Wise Report";
    const appts = state.appointments.filter((a) => {
      if (reportsDoctorId !== "all" && a.doctorId !== reportsDoctorId) return false;
      if (reportsHubId !== "all" && (a.hubId || "hub_main") !== reportsHubId) return false;
      if (reportMonth && (a.date || "").slice(0, 7) !== reportMonth) return false;
      return true;
    });
    columns = [
      { key: "doctor", label: "Doctor" },
      { key: "appointments", label: "Appointments" },
    ];
    if (reportsDoctorId !== "all") {
      const d = findById(state.doctors, reportsDoctorId);
      columns = [
        { key: "date", label: "Date" },
        { key: "time", label: "Time" },
        { key: "hub", label: "Hub" },
        { key: "patient", label: "Patient" },
        { key: "status", label: "Status" },
      ];
      rows = appts
        .slice()
        .sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time))
        .map((a) => {
          const p = findById(state.patients, a.patientId);
          return {
            date: a.date,
            time: a.time,
            hub: findById(state.hubs, a.hubId || "hub_main")?.name || a.hubId || "—",
            patient: p?.name || "Unknown",
            status: a.status,
          };
        });
      title = `Doctor Wise Report (${d?.name || "Doctor"})`;
    } else {
      rows = state.doctors
        .map((d) => ({
          doctor: d.name,
          appointments: appts.filter((a) => a.doctorId === d.id).length,
        }))
        .sort((a, b) => b.appointments - a.appointments);
    }
  } else if (selectedKind === "patientTypeWise") {
    title = "Patient Type Wise Report";
    const pairs = (() => {
      const map = new Map();
      for (const a of state.appointments) {
        const p = findById(state.patients, a.patientId);
        const t = p?.patientType || "General";
        if (reportsPatientType !== "all" && t !== reportsPatientType) continue;
        if (reportMonth && (a.date || "").slice(0, 7) !== reportMonth) continue;
        map.set(t, (map.get(t) || 0) + 1);
      }
      return [...map.entries()].sort((a, b) => b[1] - a[1]);
    })();
    columns = [
      { key: "patientType", label: "Patient Type" },
      { key: "visits", label: "Visits/Appointments" },
    ];
    rows = pairs.map(([patientType, visits]) => ({ patientType, visits }));
  } else if (selectedKind === "testTypeWise") {
    title = "Test Type Wise Report";
    const pairs = (() => {
      const map = new Map();
      for (const d of state.diagnostics) {
        const t = d.testType || "Unknown";
        if (reportsTestType !== "all" && t !== reportsTestType) continue;
        if (reportsHubId !== "all" && (d.hubId || "hub_main") !== reportsHubId) continue;
        map.set(t, (map.get(t) || 0) + 1);
      }
      return [...map.entries()].sort((a, b) => b[1] - a[1]);
    })();
    columns = [
      { key: "testType", label: "Test Type" },
      { key: "count", label: "Count" },
    ];
    rows = pairs.map(([testType, count]) => ({ testType, count }));
  } else if (selectedKind === "centerWise") {
    title = "Center Wise Report";
    columns = [
      { key: "center", label: "Center" },
      { key: "appointments", label: "Appointments" },
      { key: "reportsPending", label: "Reports Pending" },
      { key: "revenue", label: "Revenue (Billed)" },
    ];
    const revenue = filteredInvoiceLines.reduce((acc, r) => acc + (r.total || 0), 0);
    rows = [
      {
        center: "Central (All Hubs)",
        appointments: state.appointments.length,
        reportsPending: state.reports.filter((r) => r.status !== "Verified").length,
        revenue: money(revenue),
      },
    ];
  } else if (selectedKind === "hubWise") {
    title = "Hub Wise Report";
    columns = [
      { key: "hub", label: "Hub/Branch" },
      { key: "appointments", label: "Appointments" },
      { key: "revenue", label: "Revenue (Billed)" },
      { key: "reportsPending", label: "Reports Pending" },
    ];
    const hubsToShow = reportsHubId === "all" ? state.hubs : state.hubs.filter((h) => h.id === reportsHubId);
    rows = hubsToShow
      .map((h) => {
        const hubId = h.id;
        const revenue = filteredInvoiceLines.filter((r) => (r.hubId || "hub_main") === hubId && (!reportMonth || (r.createdAt || "").slice(0, 7) === reportMonth)).reduce((acc, r) => acc + (r.total || 0), 0);
        return {
          hub: h.name,
          appointments: state.appointments.filter((a) => (a.hubId || "hub_main") === hubId && (!reportMonth || (a.date || "").slice(0, 7) === reportMonth)).length,
          revenue: money(revenue),
          reportsPending: state.reports.filter((r) => (r.hubId || "hub_main") === hubId && r.status !== "Verified").length,
        };
      })
      .sort((a, b) => Number(String(b.revenue).replace(/[^\d.]/g, "")) - Number(String(a.revenue).replace(/[^\d.]/g, "")));
  }

  const menuChips = el(
    "div",
    { class: "card", style: "padding:10px" },
    [
      el("div", { class: "card-title" }, [document.createTextNode("Quick Menu")]),
      el("div", { class: "card-subtitle" }, [document.createTextNode("Daily, Monthly, and wise reports: test/doctor/patient type/test type/center/hub.")]),
      el("div", { class: "row", style: "margin-top:10px" }, [
        fieldSelect("Report type", "quickKind", kinds.map((k) => ({ value: k.id, label: k.label })), selectedKind),
        el("div", { class: "field" }, [
          el("label", {}, [document.createTextNode("Action")]),
          el(
            "button",
            {
              class: "btn",
              type: "button",
              onclick: () => {
                const v = readForm(menuChips);
                state.notes.reportsKind = v.quickKind;
                saveState(state);
                render();
              },
            },
            [document.createTextNode("Apply")]
          ),
        ]),
      ]),
      el(
        "div",
        { style: "margin-top:10px; display:flex; gap:8px; flex-wrap:wrap;" },
        kinds.map((k) =>
          el(
            "button",
            {
              class: k.id === selectedKind ? "chip good" : "chip",
              type: "button",
              onclick: () => {
                state.notes.reportsKind = k.id;
                saveState(state);
                render();
              },
            },
            [document.createTextNode(k.label)]
          )
        )
      ),
    ]
  );

  return el("div", { class: "grid" }, [header, filtersCard, menuChips, makeTable(title, columns, rows)]);
}

function viewAnalysisFunctions() {
  setTitle("Analysis Functions", "Pre-built analysis views (prototype)");
  activeNav("/analysis-functions");

  const invoiceLines = state.invoices.flatMap((inv) =>
    (inv.items || []).map((it) => ({
      invoiceId: inv.id,
      createdAt: inv.createdAt,
      hubId: inv.hubId,
      name: it.name,
      qty: Number(it.qty || 0),
      unit: Number(it.unit || 0),
      total: Number(it.qty || 0) * Number(it.unit || 0),
    }))
  );

  const groupSum = (rows, keyFn) => {
    const map = new Map();
    for (const r of rows) {
      const key = keyFn(r);
      map.set(key, (map.get(key) || 0) + (r.total || 0));
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  };

  const tableFromPairs = (title, pairs, valueFmt = money) =>
    el("div", { class: "card" }, [
      el("div", { class: "card-title" }, [document.createTextNode(title)]),
      el(
        "table",
        { class: "table", style: "margin-top:10px" },
        [
          el("thead", {}, [
            el("tr", {}, [
              el("th", {}, [document.createTextNode("Group")]),
              el("th", {}, [document.createTextNode("Value")]),
            ]),
          ]),
          el(
            "tbody",
            {},
            pairs.length
              ? pairs.map(([k, v]) =>
                  el("tr", {}, [
                    el("td", {}, [el("strong", {}, [document.createTextNode(String(k))])]),
                    el("td", {}, [document.createTextNode(valueFmt(v))]),
                  ])
                )
              : [el("tr", {}, [el("td", { colspan: "2" }, [renderEmpty()])])]
          ),
        ]
      ),
    ]);

  const revenueByCourse = groupSum(invoiceLines, (r) => r.name || "Unknown");

  const revenueByExam = groupSum(invoiceLines, (r) => {
    const n = (r.name || "").toLowerCase();
    if (n.includes("x-ray") || n.includes("xray")) return "X-Ray";
    if (n.includes("mri")) return "MRI";
    if (n.includes("ct")) return "CT Scan";
    if (n.includes("ultrasound") || n.includes("usg")) return "Ultrasound";
    if (n.includes("blood")) return "Blood Test";
    return "Other";
  });

  const visitsByOrg = state.hubs
    .map((h) => [h.name, state.appointments.filter((a) => (a.hubId || "hub_main") === h.id).length])
    .sort((a, b) => b[1] - a[1]);

  const monthKey = (iso) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "Unknown";
    return d.toLocaleString(undefined, { year: "numeric", month: "short" });
  };
  const yearKey = (iso) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "Unknown";
    return `${d.getFullYear()}`;
  };

  const monthlyRevenue = groupSum(invoiceLines, (r) => monthKey(r.createdAt));
  const yearlyRevenue = groupSum(invoiceLines, (r) => yearKey(r.createdAt));

  const profitAssumption = 0.6; // 60% cost assumption for prototype
  const totalRevenue = invoiceLines.reduce((acc, r) => acc + (r.total || 0), 0);
  const estCost = totalRevenue * profitAssumption;
  const estProfit = totalRevenue - estCost;
  const margin = totalRevenue > 0 ? (estProfit / totalRevenue) * 100 : 0;

  const header = el("div", { class: "card soft" }, [
    el("div", { class: "card-title" }, [document.createTextNode("Analysis Functions")]),
    el("div", { class: "card-subtitle" }, [document.createTextNode("These are UI placeholders for analytics requested in the SRS (no real BI engine).")]),
    el("div", { class: "card-actions" }, [
      el("button", { class: "btn btn-ghost", type: "button", onclick: () => toast("Export", "Prototype: export not implemented.") }, [document.createTextNode("Export (demo)")]),
    ]),
  ]);

  const functionsList = el("div", { class: "grid cols-2" }, [
    el("div", { class: "card" }, [
      el("div", { class: "card-title" }, [document.createTextNode("1. Revenue Analysis by Course")]),
      el("div", { class: "card-subtitle" }, [document.createTextNode("Breakdown by billed service/item name (prototype mapping).")]),
      el("div", { class: "card-actions" }, [
        el("button", { class: "btn btn-ghost", type: "button", onclick: () => toast("Analysis", "Showing revenue breakdown by course/service.") }, [document.createTextNode("Run")]),
      ]),
    ]),
    el("div", { class: "card" }, [
      el("div", { class: "card-title" }, [document.createTextNode("2. Revenue Analysis by Examination")]),
      el("div", { class: "card-subtitle" }, [document.createTextNode("Aggregates revenue by exam category (X-Ray/MRI/CT/etc).")]),
      el("div", { class: "card-actions" }, [
        el("button", { class: "btn btn-ghost", type: "button", onclick: () => toast("Analysis", "Showing revenue breakdown by examination category.") }, [document.createTextNode("Run")]),
      ]),
    ]),
    el("div", { class: "card" }, [
      el("div", { class: "card-title" }, [document.createTextNode("3. Visit Statistics by Organization")]),
      el("div", { class: "card-subtitle" }, [document.createTextNode("Counts visits/appointments grouped by hub/branch (organization).")]),
      el("div", { class: "card-actions" }, [
        el("button", { class: "btn btn-ghost", type: "button", onclick: () => toast("Analysis", "Showing visit statistics by organization/hub.") }, [document.createTextNode("Run")]),
      ]),
    ]),
    el("div", { class: "card" }, [
      el("div", { class: "card-title" }, [document.createTextNode("4. Monthly and Yearly Statistics")]),
      el("div", { class: "card-subtitle" }, [document.createTextNode("Monthly/yearly revenue totals (based on invoice dates).")]),
      el("div", { class: "card-actions" }, [
        el("button", { class: "btn btn-ghost", type: "button", onclick: () => toast("Analysis", "Showing monthly & yearly statistics.") }, [document.createTextNode("Run")]),
      ]),
    ]),
    el("div", { class: "card" }, [
      el("div", { class: "card-title" }, [document.createTextNode("5. Profit Margin Analysis")]),
      el("div", { class: "card-subtitle" }, [document.createTextNode("Estimates profit margin using a configurable cost assumption (prototype).")]),
      el("div", { class: "card-actions" }, [
        el("button", { class: "btn btn-ghost", type: "button", onclick: () => toast("Analysis", `Estimated margin: ${margin.toFixed(1)}% (assumes ${(profitAssumption*100).toFixed(0)}% cost).`) }, [document.createTextNode("Run")]),
      ]),
    ]),
  ]);

  const tables = el("div", { class: "grid cols-2" }, [
    tableFromPairs("Revenue by Course (Top)", revenueByCourse.slice(0, 8)),
    tableFromPairs("Revenue by Examination (Top)", revenueByExam),
    tableFromPairs("Visit Statistics by Organization", visitsByOrg, (v) => `${v}`),
    tableFromPairs("Monthly Revenue", monthlyRevenue.slice(0, 8)),
    tableFromPairs("Yearly Revenue", yearlyRevenue),
    el("div", { class: "card" }, [
      el("div", { class: "card-title" }, [document.createTextNode("Profit Margin (Estimate)")]),
      el("div", { class: "card-subtitle" }, [document.createTextNode("Prototype calculation using invoice totals.")]),
      el("div", { style: "margin-top:10px; display:flex; gap:8px; flex-wrap:wrap;" }, [
        el("span", { class: "chip" }, [document.createTextNode(`Revenue: ${money(totalRevenue)}`)]),
        el("span", { class: "chip" }, [document.createTextNode(`Est. Cost (${(profitAssumption * 100).toFixed(0)}%): ${money(estCost)}`)]),
        el("span", { class: "chip good" }, [document.createTextNode(`Est. Profit: ${money(estProfit)}`)]),
        el("span", { class: "chip" }, [document.createTextNode(`Margin: ${margin.toFixed(1)}%`)]),
      ]),
    ]),
  ]);

  return el("div", { class: "grid" }, [header, functionsList, tables]);
}

function viewCentral() {
  setTitle("Central Admin", "Manage hubs/branches, assignments, monitoring (demo)");
  activeNav("/central");

  const hubs = el("div", { class: "grid cols-3" }, state.hubs.map((h) => {
    return el("div", { class: "card" }, [
      el("div", { class: "card-title" }, [document.createTextNode(h.name)]),
      el("div", { class: "card-subtitle" }, [document.createTextNode(h.city)]),
      el("div", { style: "margin-top:10px; display:flex; gap:8px; flex-wrap:wrap;" }, [
        el("span", { class: h.active ? "chip good" : "chip bad" }, [document.createTextNode(h.active ? "Active" : "Inactive")]),
        el("span", { class: "chip" }, [document.createTextNode(`Doctors: ${state.doctors.length}`)]),
      ]),
      el("div", { class: "card-actions" }, [
        el("button", { class: "btn btn-ghost", type: "button", onclick: () => toast("Central", "Hub configuration is demo-only.") }, [document.createTextNode("Configure")]),
      ]),
    ]);
  }));

  const admin = el("div", { class: "card soft" }, [
    el("div", { class: "card-title" }, [document.createTextNode("Central Management Capabilities")]),
    el("div", { class: "card-subtitle" }, [document.createTextNode("In the full system, Central manages all hubs/branches.")]),
    el("div", { class: "grid cols-2", style: "margin-top:10px" }, [
      el("div", { class: "card" }, [
        el("div", { class: "card-title" }, [document.createTextNode("Scheduling & assignment")]),
        el("div", { class: "card-subtitle" }, [document.createTextNode("Doctor assignment and schedule monitoring.")]),
        el("div", { class: "help" }, [document.createTextNode("Prototype: manage doctors under the Doctors menu.")]),
      ]),
      el("div", { class: "card" }, [
        el("div", { class: "card-title" }, [document.createTextNode("Accounting & performance")]),
        el("div", { class: "card-subtitle" }, [document.createTextNode("Revenue and performance analysis dashboard.")]),
        el("div", { class: "help" }, [document.createTextNode("Prototype: see Reports for summary cards.")]),
      ]),
    ]),
  ]);

  return el("div", { class: "grid" }, [admin, hubs]);
}

function viewAI() {
  setTitle("AI (Future)", "Ideas for AI-assisted workflow support");
  activeNav("/ai");

  const items = [
    ["AI Prescription Suggestions", "Recommend medicines based on diagnosis, allergies, and guidelines."],
    ["Smart Diagnostic Image Detection", "Detect anomalies and auto-flag urgent cases."],
    ["AI-Based Report Analysis", "Summarize findings, compare past reports, and reduce errors."],
    ["Patient Risk Prediction", "Predict complications and prioritize follow-ups."],
    ["Risk Prediction Analysis", "Score patient risk (e.g., complications/readmission) and prioritize follow-ups."],
    ["Automatic Proposal Report Generation by Organization", "Auto-generate proposal/summary reports tailored to the organization’s format and KPIs."],
    ["AI-based Statistical Forecasting", "Forecast patient volume, diagnostics demand, staffing, and revenue trends."],
    ["Voice-Based Appointment System", "Voice input for fast booking and call-center operations."],
    ["AI Chat Support Assistant", "Patient FAQs, appointment status, and test instructions."],
    ["Predictive Revenue & Operational Analytics", "Forecast demand, staffing, and revenue by hub."],
    ["Smart queue optimization", "Improve waiting times with load-aware token assignment."],
  ];

  const list = el("div", { class: "grid cols-2" }, items.map(([t, s]) =>
    el("div", { class: "card" }, [
      el("div", { class: "card-title" }, [document.createTextNode(t)]),
      el("div", { class: "card-subtitle" }, [document.createTextNode(s)]),
      el("div", { class: "card-actions" }, [
        el("button", { class: "btn btn-ghost", type: "button", onclick: () => toast("Future feature", t) }, [document.createTextNode("Mark as planned")]),
      ]),
    ])
  ));

  return el("div", { class: "grid" }, [
    el("div", { class: "card soft" }, [
      el("div", { class: "card-title" }, [document.createTextNode("AI Roadmap (Prototype)")]),
      el("div", { class: "card-subtitle" }, [document.createTextNode("These are placeholders to visualize future AI integrations.")]),
      el("div", { class: "help" }, [document.createTextNode("No AI logic is implemented in this HTML-only prototype.")]),
    ]),
    list,
  ]);
}

const routes = {
  "/dashboard": viewDashboard,
  "/patients": viewPatients,
  "/appointments": viewAppointments,
  "/doctors": viewDoctors,
  "/prescriptions": viewPrescriptions,
  "/diagnostics": viewDiagnostics,
  "/billing": viewBilling,
  "/reports": viewReports,
  "/analysis-functions": viewAnalysisFunctions,
  "/central": viewCentral,
  "/ai": viewAI,
};

function currentRoute() {
  const hash =
    location.hash ||
    (CONTEXT === "central" ? "#/central" : CONTEXT === "hub" ? "#/dashboard" : "#/dashboard");
  const m = hash.match(/^#(\/[a-z-]+)/i);
  return m ? m[1] : "/dashboard";
}

function render() {
  const route = currentRoute();
  const fallback = CONTEXT === "central" ? "/central" : "/dashboard";
  const view = routes[route] || routes[fallback] || routes["/dashboard"];
  const node = view();
  $("#view").replaceChildren(node);
  if (window.matchMedia("(max-width: 1020px)").matches) $(".sidebar")?.classList.remove("open");
}

function openCreatePatient() {
  const body = el("div", { class: "form" }, [
    el("div", { class: "row" }, [
      fieldInput("Name", "name", "e.g., Ayesha Begum"),
      fieldInput("Mobile", "mobile", "e.g., +1 (555) 123-4567"),
    ]),
    el("div", { class: "row" }, [
      fieldInput("Age", "age", "e.g., 34", "number"),
      fieldSelect("Sex", "sex", ["Female", "Male", "Other"]),
    ]),
    fieldSelect("Patient type", "patientType", ["General", "Corporate", "Insurance", "VIP"]),
    fieldInput("Address", "address", "City, State"),
    el("div", { class: "help" }, [document.createTextNode("Creates a patient profile and enables appointment booking and history tracking.")]),
  ]);

  openModal({
    title: "Register Patient",
    bodyNode: body,
    primaryText: "Create patient",
    onPrimary: () => {
      const v = readForm(body);
      if (!v.name || !v.mobile) return toast("Missing fields", "Name and mobile are required.");
      state.patients.unshift({
        id: uid("pat"),
        name: v.name,
        mobile: v.mobile,
        age: Number(v.age || 0),
        sex: v.sex || "Other",
        patientType: v.patientType || "General",
        address: v.address || "",
        createdAt: new Date().toISOString(),
      });
      saveState(state);
      toast("Patient created", `${v.name} registered successfully.`);
      render();
    },
  });
}

function openPatientProfile(patientId) {
  const p = findById(state.patients, patientId);
  if (!p) return toast("Not found", "Patient does not exist in demo data.");

  const appts = state.appointments.filter((a) => a.patientId === p.id).slice().sort((a,b)=> (b.date+b.time).localeCompare(a.date+a.time));
  const rx = state.prescriptions.filter((r) => r.patientId === p.id).slice().sort((a,b)=> b.createdAt.localeCompare(a.createdAt));
  const inv = state.invoices.filter((i) => i.patientId === p.id).slice().sort((a,b)=> b.createdAt.localeCompare(a.createdAt));

  const body = el("div", { class: "grid" }, [
    el("div", { class: "card" }, [
      el("div", { class: "card-title" }, [document.createTextNode(p.name)]),
      el("div", { class: "card-subtitle" }, [document.createTextNode(`${p.mobile} · ${p.sex}, ${p.age}`)]),
      el("div", { class: "help" }, [document.createTextNode(p.address || "—")]),
      el("div", { class: "card-actions" }, [
        el("button", { class: "btn", type: "button", onclick: () => { $("#modal").close(); openBookAppointment(p.id); } }, [document.createTextNode("Book appointment")]),
        el("button", { class: "btn btn-ghost", type: "button", onclick: () => { $("#modal").close(); openCreateInvoice(p.id); } }, [document.createTextNode("Create invoice")]),
      ]),
    ]),
    miniList("Appointments", appts.map((a) => `${a.date} ${a.time} · Token ${a.token ?? "—"} · ${a.status}`)),
    miniList("Prescriptions", rx.map((r) => `${formatDT(r.createdAt)} · ${r.language} · ${r.diagnosis || "—"}`)),
    miniList("Invoices", inv.map((i) => `${i.id} · Total ${money(sumInvoice(i))} · Paid ${money(i.paid || 0)}`)),
  ]);

  openModal({ title: "Patient Profile", bodyNode: body, primaryText: "Close", onPrimary: () => {} , wide: true});
}

function miniList(title, items) {
  return el("div", { class: "card" }, [
    el("div", { class: "card-title" }, [document.createTextNode(title)]),
    el("div", { style: "margin-top:10px" }, [
      items.length
        ? el("div", { class: "grid" }, items.slice(0, 6).map((t) => el("div", { class: "chip" }, [document.createTextNode(t)])))
        : renderEmpty(),
    ]),
  ]);
}

function addDaysISO(dateIso, days) {
  const d = new Date(`${dateIso}T00:00:00`);
  d.setDate(d.getDate() + days);
  const pad = (n) => `${n}`.padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function openBookAppointment(pref = "") {
  const defaults =
    typeof pref === "object" && pref
      ? {
          patientId: pref.patientId || "",
          doctorId: pref.doctorId || "",
          date: pref.date || todayISO(),
          time: pref.time || "10:00",
          channel: pref.channel || "Offline",
          status: pref.status || "Booked",
        }
      : {
          patientId: pref || "",
          doctorId: "",
          date: todayISO(),
          time: "10:00",
          channel: "Offline",
          status: "Booked",
        };

  const body = el("div", { class: "form" }, [
    el("div", { class: "row" }, [
      fieldSelect(
        "Patient",
        "patientId",
        state.patients.map((p) => ({ value: p.id, label: `${p.name} (${p.mobile})` })),
        defaults.patientId
      ),
      fieldSelect(
        "Doctor",
        "doctorId",
        state.doctors.map((d) => ({ value: d.id, label: `${d.name} — ${d.specialty}` })),
        defaults.doctorId
      ),
    ]),
    el("div", { class: "row" }, [
      fieldInput("Date", "date", "", "date", defaults.date),
      fieldInput("Time", "time", "", "time", defaults.time),
    ]),
    el("div", { class: "row" }, [
      fieldSelect("Channel", "channel", ["Offline", "Online"], defaults.channel),
      fieldSelect("Status", "status", ["Booked", "Queued", "Completed", "Cancelled"], defaults.status),
    ]),
    fieldInput("Token", "token", "Auto", "number"),
    el("div", { class: "help" }, [document.createTextNode("Supports queue/token flow and follow-up scheduling in the full system.")]),
  ]);

  openModal({
    title: "Book Appointment",
    bodyNode: body,
    primaryText: "Create appointment",
    onPrimary: () => {
      const v = readForm(body);
      const patientId = v.patientId;
      const doctorId = v.doctorId;
      if (!patientId || !doctorId) return toast("Missing fields", "Select patient and doctor.");
      const token = Number(v.token || (Math.max(0, ...state.appointments.filter((a) => a.date === v.date).map((a) => a.token || 0)) + 1));
      state.appointments.unshift({
        id: uid("apt"),
        patientId,
        doctorId,
        date: v.date || todayISO(),
        time: v.time || "10:00",
        channel: v.channel || "Offline",
        status: v.status || "Booked",
        token,
        createdAt: new Date().toISOString(),
      });
      saveState(state);
      toast("Appointment created", `Token ${token} assigned.`);
      render();
    },
  });
}

function openAppointmentDetails(appointmentId) {
  const a = findById(state.appointments, appointmentId);
  if (!a) return toast("Not found", "Appointment not found.");
  const p = findById(state.patients, a.patientId);
  const d = findById(state.doctors, a.doctorId);
  const rx = state.prescriptions.find((r) => r.appointmentId === a.id);

  const body = el("div", { class: "grid" }, [
    el("div", { class: "card" }, [
      el("div", { class: "card-title" }, [document.createTextNode("Appointment")]),
      el("div", { class: "card-subtitle" }, [document.createTextNode(`${a.date} ${a.time} · ${a.channel} · Token ${a.token ?? "—"}`)]),
      el("div", { style: "margin-top:10px; display:flex; gap:8px; flex-wrap:wrap;" }, [
        statusChip(a.status),
        el("span", { class: "chip" }, [document.createTextNode(d ? `${d.name} (${d.specialty})` : "Unassigned doctor")]),
      ]),
    ]),
    el("div", { class: "card" }, [
      el("div", { class: "card-title" }, [document.createTextNode("Patient")]),
      el("div", { class: "card-subtitle" }, [document.createTextNode(p ? `${p.name} · ${p.mobile}` : "Unknown patient")]),
      el("div", { class: "help" }, [document.createTextNode(p?.address || "—")]),
    ]),
    el("div", { class: "card" }, [
      el("div", { class: "card-title" }, [document.createTextNode("Next steps")]),
      el("div", { class: "card-actions" }, [
        el("button", { class: "btn", type: "button", onclick: () => { $("#modal").close(); openCreatePrescription(a.id); } }, [document.createTextNode(rx ? "Edit prescription" : "Create prescription")]),
        el("button", {
          class: "btn btn-ghost",
          type: "button",
          onclick: () => {
            $("#modal").close();
            openBookAppointment({
              patientId: a.patientId,
              doctorId: a.doctorId,
              date: addDaysISO(a.date, 7),
              time: a.time,
              channel: "Online",
              status: "Booked",
            });
          },
        }, [document.createTextNode("Create follow-up")]),
        el("button", { class: "btn btn-ghost", type: "button", onclick: () => { $("#modal").close(); openCreateInvoice(a.patientId); } }, [document.createTextNode("Create invoice")]),
      ]),
      el("div", { class: "help" }, [document.createTextNode("In the real system, this step links consultation → diagnostics → billing → report delivery.")]),
    ]),
  ]);

  openModal({ title: "Appointment Details", bodyNode: body, primaryText: "Close", onPrimary: () => {}, wide: true });
}

function openMarkCompleted() {
  const candidates = state.appointments.filter((a) => a.status !== "Completed").slice(0, 12);
  const body = el("div", { class: "form" }, [
    fieldSelect("Appointment", "appointmentId", candidates.map((a) => {
      const p = findById(state.patients, a.patientId);
      return { value: a.id, label: `${a.date} ${a.time} · Token ${a.token ?? "—"} · ${p?.name || "Unknown"}` };
    })),
    el("div", { class: "help" }, [document.createTextNode("Marks a consultation as completed and frees the queue.")]),
  ]);
  openModal({
    title: "Mark Appointment Completed",
    bodyNode: body,
    primaryText: "Mark completed",
    onPrimary: () => {
      const v = readForm(body);
      const a = findById(state.appointments, v.appointmentId);
      if (!a) return toast("Not found", "Appointment not found.");
      a.status = "Completed";
      saveState(state);
      toast("Updated", "Appointment marked as completed.");
      render();
    },
  });
}

function openAddDoctor() {
  const body = el("div", { class: "form" }, [
    el("div", { class: "row" }, [
      fieldInput("Doctor name", "name", "e.g., Dr. Nazmul Hasan"),
      fieldInput("Specialty", "specialty", "e.g., Orthopedics"),
    ]),
    el("div", { class: "row" }, [
      fieldInput("Room", "room", "e.g., 101"),
      fieldSelect("Status", "active", [{ value: "true", label: "Active" }, { value: "false", label: "Inactive" }]),
    ]),
  ]);
  openModal({
    title: "Add Doctor",
    bodyNode: body,
    primaryText: "Add",
    onPrimary: () => {
      const v = readForm(body);
      if (!v.name || !v.specialty) return toast("Missing fields", "Name and specialty are required.");
      state.doctors.unshift({ id: uid("doc"), name: v.name, specialty: v.specialty, room: v.room || "—", active: v.active !== "false" });
      saveState(state);
      toast("Doctor added", v.name);
      render();
    },
  });
}

function openDoctorAvailability(doctorId) {
  const d = findById(state.doctors, doctorId);
  if (!d) return toast("Not found", "Doctor not found.");
  const todays = state.appointments.filter((a) => a.doctorId === d.id && a.date === todayISO());
  const body = el("div", { class: "grid" }, [
    el("div", { class: "card" }, [
      el("div", { class: "card-title" }, [document.createTextNode(d.name)]),
      el("div", { class: "card-subtitle" }, [document.createTextNode(`${d.specialty} · Room ${d.room}`)]),
      el("div", { style: "margin-top:10px; display:flex; gap:8px; flex-wrap:wrap;" }, [
        el("span", { class: d.active ? "chip good" : "chip bad" }, [document.createTextNode(d.active ? "Active" : "Inactive")]),
        el("span", { class: "chip" }, [document.createTextNode(`Today appointments: ${todays.length}`)]),
      ]),
    ]),
    el("div", { class: "card" }, [
      el("div", { class: "card-title" }, [document.createTextNode("Today schedule (demo)")]),
      el("div", { class: "card-subtitle" }, [document.createTextNode("Illustrative, derived from booked appointments.")]),
      el("div", { style: "margin-top:10px" }, [
        todays.length
          ? el("div", { class: "grid" }, todays.map((a) => {
              const p = findById(state.patients, a.patientId);
              return el("div", { class: "chip" }, [document.createTextNode(`${a.time} · Token ${a.token ?? "—"} · ${p?.name || "Unknown"} · ${a.status}`)]);
            }))
          : renderEmpty(),
      ]),
    ]),
  ]);
  openModal({ title: "Doctor Availability", bodyNode: body, primaryText: "Close", onPrimary: () => {}, wide: true });
}

function openCreatePrescription(prefAppointmentId = "") {
  const appts = state.appointments.slice(0, 25).map((a) => {
    const p = findById(state.patients, a.patientId);
    const d = findById(state.doctors, a.doctorId);
    return { value: a.id, label: `${a.date} ${a.time} · ${p?.name || "Unknown"} · ${d?.name || "—"} · Token ${a.token ?? "—"}` };
  });
  const body = el("div", { class: "form" }, [
    fieldSelect("Appointment", "appointmentId", appts, prefAppointmentId),
    el("div", { class: "row" }, [
      fieldSelect("Language", "language", ["English", "Bangla"]),
      fieldInput("Diagnosis", "diagnosis", "e.g., Hypertension"),
    ]),
    fieldInput("Chief complaints", "chiefComplaints", "Symptoms"),
    fieldTextarea("Medicines (one per line)", "medicines", "e.g., Tablet A — 1+0+1"),
    fieldTextarea("Advice", "advice", "Follow-up instructions"),
  ]);

  openModal({
    title: "Create Prescription",
    bodyNode: body,
    primaryText: "Save prescription",
    onPrimary: () => {
      const v = readForm(body);
      const a = findById(state.appointments, v.appointmentId);
      if (!a) return toast("Missing fields", "Select an appointment.");
      const existing = state.prescriptions.find((r) => r.appointmentId === a.id);
      const meds = (v.medicines || "").split("\n").map((s) => s.trim()).filter(Boolean);
      const obj = {
        id: existing?.id || uid("rx"),
        appointmentId: a.id,
        patientId: a.patientId,
        doctorId: a.doctorId,
        language: v.language || "English",
        chiefComplaints: v.chiefComplaints || "",
        diagnosis: v.diagnosis || "",
        medicines: meds,
        advice: v.advice || "",
        createdAt: existing?.createdAt || new Date().toISOString(),
      };
      if (existing) Object.assign(existing, obj);
      else state.prescriptions.unshift(obj);
      saveState(state);
      toast("Prescription saved", "Ready for print view.");
      render();
    },
  });
}

function openPrescriptionPrint(rxId) {
  const rx = findById(state.prescriptions, rxId);
  if (!rx) return toast("Not found", "Prescription not found.");
  const p = findById(state.patients, rx.patientId);
  const d = findById(state.doctors, rx.doctorId);

  const body = el("div", { class: "card" }, [
    el("div", { class: "card-title" }, [document.createTextNode("Digital Prescription (Demo)")]),
    el("div", { class: "card-subtitle" }, [document.createTextNode(`${rx.language} · ${formatDT(rx.createdAt)}`)]),
    el("div", { style: "margin-top:12px" }, [
      el("div", { class: "chip" }, [document.createTextNode(`Patient: ${p?.name || "Unknown"} · ${p?.mobile || ""}`)]),
      document.createTextNode(" "),
      el("div", { class: "chip" }, [document.createTextNode(`Doctor: ${d?.name || "—"} · ${d?.specialty || ""}`)]),
    ]),
    el("div", { style: "margin-top:12px" }, [
      el("div", { class: "help" }, [document.createTextNode("Chief complaints")]),
      el("div", { class: "card-title" }, [document.createTextNode(rx.chiefComplaints || "—")]),
    ]),
    el("div", { style: "margin-top:12px" }, [
      el("div", { class: "help" }, [document.createTextNode("Diagnosis")]),
      el("div", { class: "card-title" }, [document.createTextNode(rx.diagnosis || "—")]),
    ]),
    el("div", { style: "margin-top:12px" }, [
      el("div", { class: "help" }, [document.createTextNode("Medicines")]),
      rx.medicines?.length
        ? el("div", { class: "grid" }, rx.medicines.map((m) => el("div", { class: "chip" }, [document.createTextNode(m)])))
        : renderEmpty(),
    ]),
    el("div", { style: "margin-top:12px" }, [
      el("div", { class: "help" }, [document.createTextNode("Advice")]),
      el("div", { class: "card-subtitle" }, [document.createTextNode(rx.advice || "—")]),
    ]),
    el("div", { class: "card-actions" }, [
      el("button", { class: "btn", type: "button", onclick: () => window.print() }, [document.createTextNode("Print")]),
    ]),
  ]);

  openModal({ title: "Print Preview", bodyNode: body, primaryText: "Close", onPrimary: () => {}, wide: true });
}

function openUploadDiagnostic() {
  const body = el("div", { class: "form" }, [
    fieldSelect("Patient", "patientId", state.patients.map((p) => ({ value: p.id, label: `${p.name} (${p.mobile})` }))),
    el("div", { class: "row" }, [
      fieldSelect("Test type", "testType", ["X-Ray", "MRI", "CT Scan", "Ultrasound", "Blood Test"]),
      fieldInput("Body part", "bodyPart", "e.g., Chest"),
    ]),
    fieldInput("File name (demo)", "fileName", "e.g., mri_brain_001.png"),
    fieldTextarea("Note", "note", "Optional"),
    el("div", { class: "help" }, [document.createTextNode("Prototype: stores metadata only (no real file upload).")]),
  ]);

  openModal({
    title: "Upload Diagnostic Image",
    bodyNode: body,
    primaryText: "Upload",
    onPrimary: () => {
      const v = readForm(body);
      if (!v.patientId) return toast("Missing fields", "Select a patient.");
      state.diagnostics.unshift({
        id: uid("dia"),
        patientId: v.patientId,
        testType: v.testType || "X-Ray",
        bodyPart: v.bodyPart || "—",
        status: "Uploaded",
        fileName: v.fileName || "demo_image.png",
        note: v.note || "",
        createdAt: new Date().toISOString(),
      });
      saveState(state);
      toast("Uploaded", "Diagnostic metadata saved.");
      render();
    },
  });
}

function openUploadDiagnosticEnhanced() {
  const placeholderText = "No preview loaded. Choose Upload/Scan or load demo image.";
  let selected = {
    fileName: "",
    fileType: "",
    previewDataUrl: "",
    scannedText: "",
    source: "",
  };
  let stream = null;
  let scanTimer = null;

  const stopQr = () => {
    if (scanTimer) {
      clearInterval(scanTimer);
      scanTimer = null;
    }
    if (stream) {
      for (const t of stream.getTracks()) t.stop();
      stream = null;
    }
  };

  const previewBox = (() => {
    const media = el("div", { class: "preview-media" }, [
      el("div", { class: "preview-placeholder" }, [document.createTextNode(placeholderText)]),
    ]);

    const meta = el("div", { class: "help" }, [document.createTextNode("File: —")]);

    const renderPreview = () => {
      media.replaceChildren();

      if (selected.previewDataUrl) {
        media.append(el("img", { src: selected.previewDataUrl, alt: "Diagnostic preview" }));
      } else if (selected.fileType === "application/pdf") {
        media.append(
          el("div", { class: "preview-placeholder" }, [
            document.createTextNode("PDF selected (preview placeholder). You can still save it to the list."),
          ])
        );
      } else if (selected.source === "qr-scan") {
        media.append(
          el("div", { class: "preview-placeholder" }, [
            el("div", { class: "card-title" }, [document.createTextNode("QR scanned text")]),
            el("div", { class: "card-subtitle" }, [document.createTextNode(selected.scannedText || "—")]),
          ])
        );
      } else {
        media.append(el("div", { class: "preview-placeholder" }, [document.createTextNode(placeholderText)]));
      }

      meta.textContent =
        selected.fileName
          ? `File: ${selected.fileName} · Type: ${selected.fileType || "—"} · Source: ${selected.source || "—"}`
          : "File: —";
    };

    const box = el("div", { class: "preview-box" }, []);

    const clearAll = () => {
      selected = { fileName: "", fileType: "", previewDataUrl: "", scannedText: "", source: "" };
      stopQr();
      const fileInput = $("input[name='__file']", box);
      const imgScanInput = $("input[name='__imgscan']", box);
      const pdfScanInput = $("input[name='__pdfscan']", box);
      if (fileInput) fileInput.value = "";
      if (imgScanInput) imgScanInput.value = "";
      if (pdfScanInput) pdfScanInput.value = "";
      const qrWrap = $("#diagQrWrap2", box);
      if (qrWrap) qrWrap.style.display = "none";
      renderPreview();
    };

    const demoBtn = el(
      "button",
      {
        class: "btn",
        type: "button",
        onclick: () => {
          const canvas = document.createElement("canvas");
          canvas.width = 960;
          canvas.height = 600;
          const ctx = canvas.getContext("2d");
          const g = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
          g.addColorStop(0, "rgba(110,231,255,.35)");
          g.addColorStop(1, "rgba(139,92,246,.35)");
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = "rgba(255,255,255,.92)";
          ctx.font = "700 32px system-ui, -apple-system, Segoe UI, Roboto, Arial";
          ctx.fillText("Demo Diagnostic Preview", 36, 76);
          ctx.fillStyle = "rgba(255,255,255,.70)";
          ctx.font = "500 18px system-ui, -apple-system, Segoe UI, Roboto, Arial";
          ctx.fillText("Prototype placeholder image (not real medical data)", 36, 112);
          ctx.strokeStyle = "rgba(255,255,255,.25)";
          ctx.lineWidth = 2;
          ctx.strokeRect(36, 150, canvas.width - 72, canvas.height - 210);
          const dataUrl = canvas.toDataURL("image/png");

          selected.fileName = `demo_scan_${Date.now()}.png`;
          selected.fileType = "image/png";
          selected.previewDataUrl = dataUrl;
          selected.scannedText = "";
          selected.source = "demo";
          renderPreview();
          toast("Loaded", "Demo image loaded.");
        },
      },
      [document.createTextNode("Load demo image")]
    );

    const clearBtn = el(
      "button",
      { class: "btn btn-ghost", type: "button", onclick: () => { clearAll(); toast("Cleared", "Preview cleared."); } },
      [document.createTextNode("Clear")]
    );

    const qrBtn = el(
      "button",
      {
        class: "btn btn-ghost",
        type: "button",
        onclick: async () => {
          try {
            if (!("mediaDevices" in navigator) || !navigator.mediaDevices.getUserMedia) {
              toast("Not supported", "Camera access is not available in this browser.");
              return;
            }
            if (!("BarcodeDetector" in window)) {
              toast("Not supported", "QR scanning requires BarcodeDetector (Chrome/Edge).");
              return;
            }

            stopQr();
            const detector = new BarcodeDetector({ formats: ["qr_code"] });
            stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
            const video = $("#diagQrVideo2", box);
            video.srcObject = stream;
            await video.play();
            $("#diagQrWrap2", box).style.display = "";

            scanTimer = setInterval(async () => {
              try {
                const barcodes = await detector.detect(video);
                if (barcodes?.length) {
                  const raw = barcodes[0].rawValue || "";
                  selected.scannedText = raw;
                  selected.source = "qr-scan";
                  selected.fileName = `qr_${Date.now()}.txt`;
                  selected.fileType = "text/qr";
                  selected.previewDataUrl = "";
                  renderPreview();
                  toast("QR detected", raw.slice(0, 80));
                  $("#diagQrWrap2", box).style.display = "none";
                  stopQr();
                }
              } catch {
                // ignore transient detect errors
              }
            }, 350);
          } catch (e) {
            stopQr();
            toast("QR scan failed", e?.message || "Unable to start camera.");
          }
        },
      },
      [document.createTextNode("QR scan")]
    );

    const stopBtn = el(
      "button",
      {
        class: "btn btn-ghost",
        type: "button",
        onclick: () => {
          stopQr();
          const qrWrap = $("#diagQrWrap2", box);
          if (qrWrap) qrWrap.style.display = "none";
          toast("Stopped", "QR scanning stopped.");
        },
      },
      [document.createTextNode("Stop scan")]
    );

    const onPickFile = async (file, source) => {
      if (!file) return;
      stopQr();
      selected.source = source;
      selected.fileName = file.name || `upload_${Date.now()}`;
      selected.fileType = file.type || "application/octet-stream";
      selected.scannedText = "";
      selected.previewDataUrl = "";

      if (selected.fileType.startsWith("image/")) {
        selected.previewDataUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result || ""));
          reader.onerror = () => resolve("");
          reader.readAsDataURL(file);
        });
      }

      renderPreview();
      toast("Loaded", selected.fileName);
    };

    const fileInput = el("input", { name: "__file", type: "file", accept: "image/*,application/pdf", style: "display:none" });
    const imgScanInput = el("input", { name: "__imgscan", type: "file", accept: "image/*", capture: "environment", style: "display:none" });
    const pdfScanInput = el("input", { name: "__pdfscan", type: "file", accept: "application/pdf", style: "display:none" });

    fileInput.addEventListener("change", (e) => onPickFile(e.target.files?.[0], "upload"));
    imgScanInput.addEventListener("change", (e) => onPickFile(e.target.files?.[0], "image-scan"));
    pdfScanInput.addEventListener("change", (e) => onPickFile(e.target.files?.[0], "pdf-scan"));

    box.replaceChildren(
      el("div", { class: "preview-head" }, [
        el("div", {}, [
          el("div", { class: "preview-title" }, [document.createTextNode("Preview & Scan")]),
          el("div", { class: "preview-sub" }, [document.createTextNode("Upload/scan then save to the list.")]),
        ]),
        el("div", { class: "preview-controls" }, [demoBtn, clearBtn]),
      ]),
      el("div", { class: "preview-body" }, [
        media,
        el("div", { class: "preview-controls" }, [
          el("button", { class: "btn btn-ghost", type: "button", onclick: () => fileInput.click() }, [document.createTextNode("Upload file")]),
          el("button", { class: "btn btn-ghost", type: "button", onclick: () => imgScanInput.click() }, [document.createTextNode("Image scan")]),
          el("button", { class: "btn btn-ghost", type: "button", onclick: () => pdfScanInput.click() }, [document.createTextNode("PDF scan")]),
          qrBtn,
          stopBtn,
        ]),
        fileInput,
        imgScanInput,
        pdfScanInput,
        el("div", { id: "diagQrWrap2", style: "display:none" }, [
          el("div", { class: "help" }, [document.createTextNode("Point the camera at a QR code to auto-fill.")]),
          el("video", { id: "diagQrVideo2", playsinline: "true", muted: "true", class: "preview-media", style: "aspect-ratio:16/10" }),
        ]),
        meta,
      ])
    );

    clearAll(); // ensure clear image load on open
    return box;
  })();

  const body = el("div", { class: "form" }, [
    el("div", { class: "row" }, [
      fieldSelect("Patient", "patientId", state.patients.map((p) => ({ value: p.id, label: `${p.name} (${p.mobile})` }))),
      fieldSelect(
        "Hub/Branch",
        "hubId",
        (state.hubs || []).map((h) => ({ value: h.id, label: `${h.name}${h.active ? "" : " (inactive)"}` })),
        state.hubs?.[0]?.id || ""
      ),
    ]),
    el("div", { class: "row" }, [
      fieldSelect("Test type", "testType", ["X-Ray", "MRI", "CT Scan", "Ultrasound", "Blood Test"]),
      fieldInput("Body part", "bodyPart", "e.g., Chest"),
    ]),
    previewBox,
    fieldInput("File name", "fileName", "Optional override (otherwise uses selected file/scan name)"),
    fieldTextarea("Note", "note", "Optional"),
    el("div", { class: "help" }, [document.createTextNode("Prototype: image previews stored as data URL. PDFs stored as metadata only.")]),
  ]);

  openModal({
    title: "Upload / Scan Diagnostic",
    bodyNode: body,
    primaryText: "Save",
    onPrimary: () => {
      const v = readForm(body);
      if (!v.patientId) return toast("Missing fields", "Select a patient.");

      const fileName = (v.fileName || selected.fileName || "demo_image.png").trim();
      state.diagnostics.unshift({
        id: uid("dia"),
        patientId: v.patientId,
        hubId: v.hubId || "",
        testType: v.testType || "X-Ray",
        bodyPart: v.bodyPart || "â€”",
        status: "Uploaded",
        fileName,
        fileType: selected.fileType || "",
        previewDataUrl: selected.previewDataUrl || "",
        scannedText: selected.scannedText || "",
        source: selected.source || "manual",
        note: v.note || "",
        createdAt: new Date().toISOString(),
      });
      saveState(state);
      stopQr();
      toast("Saved", "Diagnostic saved to list.");
      render();
    },
    wide: true,
  });
}

function openDiagnosticViewer(diagnosticId) {
  const d = findById(state.diagnostics, diagnosticId);
  if (!d) return toast("Not found", "Diagnostic record not found.");
  const p = findById(state.patients, d.patientId);

  const body = el("div", { class: "grid" }, [
    el("div", { class: "card" }, [
      el("div", { class: "card-title" }, [document.createTextNode("Viewer (Demo)")]),
      el("div", { class: "card-subtitle" }, [document.createTextNode("Fast-loading viewer placeholder for cross-PC viewing.")]),
      el("div", { style: "margin-top:10px" }, [
        el("div", { class: "chip" }, [document.createTextNode(`Patient: ${p?.name || "Unknown"} · ${p?.mobile || ""}`)]),
        document.createTextNode(" "),
        el("div", { class: "chip" }, [document.createTextNode(`${d.testType} · ${d.bodyPart}`)]),
      ]),
      el("div", { style: "margin-top:12px" }, [
        el("div", { class: "help" }, [document.createTextNode("File")]),
        el("div", { class: "card-title" }, [document.createTextNode(d.fileName || "—")]),
        el("div", { class: "card-subtitle" }, [document.createTextNode(d.note || "No note.")]),
      ]),
      el("div", { class: "card-actions" }, [
        el("button", { class: "btn btn-ghost", type: "button", onclick: () => toast("Viewer", "In a real system, image bytes would load here with pan/zoom.") }, [document.createTextNode("Pan/zoom demo")]),
        el("button", { class: "btn", type: "button", onclick: () => { $("#modal").close(); openCreateReport(p?.id); } }, [document.createTextNode("Create report")]),
      ]),
    ]),
  ]);

  openModal({ title: "Diagnostic Viewer", bodyNode: body, primaryText: "Close", onPrimary: () => {} , wide: true});
}

function openDiagnosticViewerEnhanced(diagnosticId) {
  const d = findById(state.diagnostics, diagnosticId);
  if (!d) return toast("Not found", "Diagnostic record not found.");
  const p = findById(state.patients, d.patientId);
  const hub = findById(state.hubs || [], d.hubId);

  const preview = el("div", { class: "preview-media" }, [
    d.previewDataUrl
      ? el("img", { src: d.previewDataUrl, alt: "Diagnostic preview" })
      : el("div", { class: "preview-placeholder" }, [
          document.createTextNode(d.fileType === "application/pdf" ? "PDF stored (no inline preview in prototype)." : "No image preview stored."),
        ]),
  ]);

  const metaChips = el("div", { style: "margin-top:10px; display:flex; gap:8px; flex-wrap:wrap;" }, [
    el("span", { class: "chip" }, [document.createTextNode(`Hub: ${hub?.name || d.hubId || "—"}`)]),
    el("span", { class: "chip" }, [document.createTextNode(`Type: ${d.testType || "—"}`)]),
    el("span", { class: "chip" }, [document.createTextNode(`Body: ${d.bodyPart || "—"}`)]),
    el("span", { class: "chip" }, [document.createTextNode(`Source: ${d.source || "—"}`)]),
  ]);

  const body = el("div", { class: "grid" }, [
    el("div", { class: "card" }, [
      el("div", { class: "card-title" }, [document.createTextNode("Viewer")]),
      el("div", { class: "card-subtitle" }, [document.createTextNode("Preview image/scan details (prototype).")]),
      el("div", { style: "margin-top:10px; display:flex; gap:8px; flex-wrap:wrap;" }, [
        el("div", { class: "chip" }, [document.createTextNode(`Patient: ${p?.name || "Unknown"} · ${p?.mobile || ""}`)]),
        el("div", { class: "chip" }, [document.createTextNode(`File: ${d.fileName || "—"}`)]),
      ]),
      metaChips,
      el("div", { style: "margin-top:12px" }, [
        el("div", { class: "help" }, [document.createTextNode("Preview")]),
        preview,
        d.scannedText ? el("div", { class: "help", style: "margin-top:10px" }, [document.createTextNode(`QR: ${d.scannedText}`)]) : el("div", {}),
        el("div", { class: "help", style: "margin-top:10px" }, [document.createTextNode("Note")]),
        el("div", { class: "card-subtitle" }, [document.createTextNode(d.note || "No note.")]),
      ]),
      el("div", { class: "card-actions" }, [
        el("button", { class: "btn btn-ghost", type: "button", onclick: () => toast("Viewer", "In a real system, image bytes would load here with pan/zoom.") }, [document.createTextNode("Pan/zoom demo")]),
        el("button", { class: "btn", type: "button", onclick: () => { $("#modal").close(); openCreateReport(p?.id); } }, [document.createTextNode("Create report")]),
      ]),
    ]),
  ]);

  openModal({ title: "Diagnostic Viewer", bodyNode: body, primaryText: "Close", onPrimary: () => {}, wide: true });
}

function openCreateReport(prefPatientId = "") {
  const body = el("div", { class: "form" }, [
    fieldSelect("Patient", "patientId", state.patients.map((p) => ({ value: p.id, label: `${p.name} (${p.mobile})` })), prefPatientId),
    fieldInput("Report title", "title", "e.g., MRI Brain Report"),
    fieldTextarea("Findings", "findings", "Write findings here..."),
    fieldSelect("Status", "status", ["Pending Verification", "Verified"]),
  ]);

  openModal({
    title: "Create Diagnostic Report",
    bodyNode: body,
    primaryText: "Save report",
    onPrimary: () => {
      const v = readForm(body);
      if (!v.patientId || !v.title) return toast("Missing fields", "Patient and title are required.");
      state.reports.unshift({
        id: uid("rep"),
        patientId: v.patientId,
        title: v.title,
        status: v.status || "Pending Verification",
        findings: v.findings || "",
        verifiedBy: v.status === "Verified" ? "Central (Demo)" : "",
        createdAt: new Date().toISOString(),
      });
      saveState(state);
      toast("Report saved", "Ready for verification workflow.");
      render();
    },
  });
}

function openVerifyReport(reportId) {
  const r = findById(state.reports, reportId);
  if (!r) return toast("Not found", "Report not found.");
  const p = findById(state.patients, r.patientId);

  const body = el("div", { class: "form" }, [
    el("div", { class: "card" }, [
      el("div", { class: "card-title" }, [document.createTextNode(r.title)]),
      el("div", { class: "card-subtitle" }, [document.createTextNode(`${p?.name || "Unknown"} · ${p?.mobile || ""}`)]),
      el("div", { style: "margin-top:10px; display:flex; gap:8px; flex-wrap:wrap;" }, [
        statusChip(r.status),
        el("span", { class: "chip" }, [document.createTextNode(`Created: ${formatDT(r.createdAt)}`)]),
      ]),
    ]),
    fieldTextarea("Findings", "findings", "Findings...", r.findings || ""),
    fieldSelect("Status", "status", ["Pending Verification", "Verified"], r.status),
    fieldInput("Verified by", "verifiedBy", "e.g., Dr. Reviewer", "text", r.verifiedBy || ""),
  ]);

  openModal({
    title: "Verify Report",
    bodyNode: body,
    primaryText: "Save",
    onPrimary: () => {
      const v = readForm(body);
      r.findings = v.findings || "";
      r.status = v.status || "Pending Verification";
      r.verifiedBy = r.status === "Verified" ? (v.verifiedBy || "Central (Demo)") : "";
      saveState(state);
      toast("Updated", `Report status: ${r.status}`);
      render();
    },
    wide: true,
  });
}

function openCreateInvoice(prefPatientId = "") {
  const body = el("div", { class: "form" }, [
    fieldSelect("Patient", "patientId", state.patients.map((p) => ({ value: p.id, label: `${p.name} (${p.mobile})` })), prefPatientId),
    fieldSelect(
      "Hub/Branch",
      "hubId",
      (state.hubs || []).map((h) => ({ value: h.id, label: `${h.name}${h.active ? "" : " (inactive)"}` })),
      state.hubs?.[0]?.id || ""
    ),
    el("div", { class: "row" }, [
      fieldInput("Item 1", "item1", "Consultation"),
      fieldInput("Amount 1", "amt1", "20", "number", "20"),
    ]),
    el("div", { class: "row" }, [
      fieldInput("Item 2", "item2", "e.g., X-Ray"),
      fieldInput("Amount 2", "amt2", "e.g., 35", "number", "0"),
    ]),
    fieldSelect("Payment method", "method", state.paymentMethods || ["Cash", "Card", "Bank Transfer", "bKash", "Nagad", "Rocket"]),
    fieldInput("Paid now", "paid", "0", "number", "0"),
    el("div", { class: "help" }, [document.createTextNode("Prototype: adds up to two items. Extendable to full billing with services, dues, and mobile banking integration.")]),
  ]);

  openModal({
    title: "Create Invoice",
    bodyNode: body,
    primaryText: "Create invoice",
    onPrimary: () => {
      const v = readForm(body);
      if (!v.patientId) return toast("Missing fields", "Select a patient.");
      const items = [];
      if (v.item1 && Number(v.amt1 || 0) > 0) items.push({ name: v.item1, qty: 1, unit: Number(v.amt1) });
      if (v.item2 && Number(v.amt2 || 0) > 0) items.push({ name: v.item2, qty: 1, unit: Number(v.amt2) });
      if (!items.length) return toast("Missing items", "Add at least one billed item.");
      state.invoices.unshift({
        id: uid("inv"),
        patientId: v.patientId,
        hubId: v.hubId || "",
        items,
        method: v.method || "Cash",
        discount: { type: "none", value: 0, reason: "" },
        payer: { type: "Self", organization: "" },
        paid: Number(v.paid || 0),
        createdAt: new Date().toISOString(),
      });
      saveState(state);
      toast("Invoice created", `Items: ${items.length}`);
      render();
    },
  });
}

function openCollectDue() {
  const dueInvoices = state.invoices.filter((inv) => invoiceDue(inv) > 0);
  const body = el("div", { class: "form" }, [
    fieldSelect("Invoice", "invoiceId", dueInvoices.map((inv) => {
      const p = findById(state.patients, inv.patientId);
      const total = invoiceNet(inv);
      const due = invoiceDue(inv);
      return { value: inv.id, label: `${inv.id} · ${p?.name || "Unknown"} · Due ${money(due)}` };
    })),
    fieldInput("Collect amount", "collect", "0", "number", "10"),
    el("div", { class: "help" }, [document.createTextNode("Prototype: collects payment against an invoice.")]),
  ]);
  openModal({
    title: "Collect Due",
    bodyNode: body,
    primaryText: "Collect",
    onPrimary: () => {
      const v = readForm(body);
      const inv = findById(state.invoices, v.invoiceId);
      if (!inv) return toast("Not found", "Invoice not found.");
      inv.paid = Number(inv.paid || 0) + Number(v.collect || 0);
      saveState(state);
      toast("Payment recorded", `Invoice ${inv.id} updated.`);
      render();
    },
  });
}

function openAccountingSuite() {
  const serviceCatalog = [
    { name: "Consultation Fee", unit: 500 },
    { name: "Procedure Fee", unit: 1500 },
    { name: "Complete Blood Count (CBC)", unit: 700 },
    { name: "Blood Glucose (Fasting)", unit: 300 },
    { name: "Lipid Profile", unit: 1200 },
    { name: "LFT (Liver Function Tests)", unit: 1400 },
    { name: "KFT (Kidney Function Tests)", unit: 1400 },
    { name: "Thyroid Function Tests", unit: 1600 },
    { name: "HbA1c", unit: 1200 },
    { name: "CRP", unit: 900 },
    { name: "X-Ray Chest", unit: 1200 },
    { name: "Ultrasound (USG)", unit: 2500 },
    { name: "ECG", unit: 800 },
    { name: "Echocardiography", unit: 4500 },
    { name: "CT Scan", unit: 8000 },
    { name: "MRI", unit: 12000 },
    { name: "Endoscopy", unit: 9000 },
  ];

  const hubs = state.hubs || [];
  const hubOptions = [{ value: "", label: "All hubs" }, ...hubs.map((h) => ({ value: h.id, label: h.name }))];
  const payMethods = state.paymentMethods || ["Cash", "Card", "Bank Transfer", "bKash", "Nagad", "Rocket"];

  const active = { tab: "billing" };

  const wrapper = el("div", { class: "grid" }, []);
  const tabBar = el("div", { class: "card soft" }, [
    el("div", { class: "card-title" }, [document.createTextNode("Accounting & Billing Suite")]),
    el("div", { class: "card-subtitle" }, [document.createTextNode("Service billing, discounts, dues, expenses, closing, and reconciliation (prototype).")]),
    el("div", { style: "margin-top:10px; display:flex; gap:8px; flex-wrap:wrap;" }, [
      tabBtn("billing", "Service Billing"),
      tabBtn("discounts", "Discounts"),
      tabBtn("dues", "Dues & Reminders"),
      tabBtn("benefits", "Employee/Insurance"),
      tabBtn("cash", "Cash Advance/Deposit"),
      tabBtn("expenses", "Expenses & Petty Cash"),
      tabBtn("closing", "Daily Closing"),
      tabBtn("recon", "Bank/Mobile Reconciliation"),
    ]),
  ]);

  const content = el("div", { class: "grid" }, []);

  function tabBtn(id, label) {
    return el(
      "button",
      {
        class: active.tab === id ? "chip good" : "chip",
        type: "button",
        onclick: () => {
          active.tab = id;
          renderTab();
        },
      },
      [document.createTextNode(label)]
    );
  }

  function exportButtons(title, columns, rows) {
    return el("div", { class: "card-actions" }, [
      el(
        "button",
        {
          class: "btn btn-ghost",
          type: "button",
          onclick: () => downloadBlob(`${title.replaceAll(" ", "_")}.csv`, "text/csv;charset=utf-8", toCSV(columns, rows)),
        },
        [document.createTextNode("Export CSV")]
      ),
      el(
        "button",
        {
          class: "btn btn-ghost",
          type: "button",
          onclick: () => downloadBlob(`${title.replaceAll(" ", "_")}.xls`, "application/vnd.ms-excel;charset=utf-8", toXlsHtml(columns, rows, title)),
        },
        [document.createTextNode("Export Excel")]
      ),
      el("button", { class: "btn btn-ghost", type: "button", onclick: () => window.print() }, [document.createTextNode("Export PDF")]),
    ]);
  }

  function renderTab() {
    // refresh active styling
    tabBar.replaceChildren(
      tabBar.firstChild,
      tabBar.childNodes[1],
      tabBar.childNodes[2]
    );
    // rebuild tab buttons row (simpler)
    tabBar.replaceChildren(
      el("div", { class: "card-title" }, [document.createTextNode("Accounting & Billing Suite")]),
      el("div", { class: "card-subtitle" }, [document.createTextNode("Service billing, discounts, dues, expenses, closing, and reconciliation (prototype).")]),
      el("div", { style: "margin-top:10px; display:flex; gap:8px; flex-wrap:wrap;" }, [
        tabBtn("billing", "Service Billing"),
        tabBtn("discounts", "Discounts"),
        tabBtn("dues", "Dues & Reminders"),
        tabBtn("benefits", "Employee/Insurance"),
        tabBtn("cash", "Cash Advance/Deposit"),
        tabBtn("expenses", "Expenses & Petty Cash"),
        tabBtn("closing", "Daily Closing"),
        tabBtn("recon", "Bank/Mobile Reconciliation"),
      ])
    );

    if (active.tab === "billing") return renderBilling();
    if (active.tab === "discounts") return renderDiscounts();
    if (active.tab === "dues") return renderDues();
    if (active.tab === "benefits") return renderBenefits();
    if (active.tab === "cash") return renderCash();
    if (active.tab === "expenses") return renderExpenses();
    if (active.tab === "closing") return renderClosing();
    if (active.tab === "recon") return renderRecon();
  }

  function renderBilling() {
    const form = el("div", { class: "card soft" }, [
      el("div", { class: "card-title" }, [document.createTextNode("Service Billing")]),
      el("div", { class: "card-subtitle" }, [document.createTextNode("Create an itemized invoice (consultation, tests, procedures) with discounts and payment methods.")]),
    ]);

    const line = (idx) => {
      const field = el("div", { class: "row" }, [
        fieldSelect(
          `Service ${idx}`,
          `svc_${idx}`,
          [{ value: "", label: "—" }, ...serviceCatalog.map((s) => ({ value: s.name, label: `${s.name} (৳${s.unit})` }))]
        ),
        fieldInput(`Qty ${idx}`, `qty_${idx}`, "1", "number", "1"),
      ]);
      return field;
    };

    const body = el("div", { class: "form", style: "margin-top:10px" }, [
      fieldSelect("Patient", "patientId", state.patients.map((p) => ({ value: p.id, label: `${p.name} (${p.mobile})` }))),
      fieldSelect("Hub/Branch", "hubId", hubs.map((h) => ({ value: h.id, label: h.name })), hubs[0]?.id || ""),
      line(1),
      line(2),
      line(3),
      el("div", { class: "row" }, [
        fieldSelect("Discount type", "discountType", [{ value: "none", label: "None" }, { value: "percent", label: "Percent (%)" }, { value: "flat", label: "Flat (৳)" }], "none"),
        fieldInput("Discount value", "discountValue", "0", "number", "0"),
      ]),
      fieldInput("Discount reason", "discountReason", "e.g., Employee benefit / promo / flat adjustment"),
      el("div", { class: "row" }, [
        fieldSelect("Payer", "payerType", ["Self", "Employee Benefit", "Insurance"], "Self"),
        fieldInput("Organization / Insurer", "organization", "Optional"),
      ]),
      el("div", { class: "row" }, [
        fieldSelect("Payment method", "method", payMethods, payMethods[0] || "Cash"),
        fieldInput("Paid now (৳)", "paid", "0", "number", "0"),
      ]),
      el("div", { class: "help" }, [document.createTextNode("Bangladesh digital payments supported in the prototype: bKash, Nagad, Rocket, plus bank transfer/card/cash.")]),
    ]);

    const actions = el("div", { class: "card-actions" }, [
      el(
        "button",
        {
          class: "btn",
          type: "button",
          onclick: () => {
            const v = readForm(body);
            if (!v.patientId) return toast("Missing fields", "Select a patient.");

            const items = [];
            for (const idx of [1, 2, 3]) {
              const name = (v[`svc_${idx}`] || "").trim();
              const qty = Number(v[`qty_${idx}`] || 0);
              if (!name || qty <= 0) continue;
              const svc = serviceCatalog.find((s) => s.name === name);
              items.push({ name, qty, unit: svc ? svc.unit : 0 });
            }
            if (!items.length) return toast("Missing items", "Select at least one service/test.");

            const inv = {
              id: uid("inv"),
              patientId: v.patientId,
              hubId: v.hubId || "",
              items,
              discount: { type: v.discountType || "none", value: Number(v.discountValue || 0), reason: v.discountReason || "" },
              payer: { type: v.payerType || "Self", organization: v.organization || "" },
              method: v.method || "Cash",
              paid: Number(v.paid || 0),
              createdAt: new Date().toISOString(),
            };
            state.invoices.unshift(inv);
            saveState(state);
            toast("Invoice created", `Net ${money(invoiceNet(inv))} · Due ${money(invoiceDue(inv))}`);
            render(); // refresh main screen tables
            renderTab(); // refresh suite
          },
        },
        [document.createTextNode("Create invoice")]
      ),
    ]);

    const recent = state.invoices
      .slice(0, 10)
      .map((inv) => {
        const p = findById(state.patients, inv.patientId);
        return {
          id: inv.id,
          patient: p?.name || "Unknown",
          hub: findById(hubs, inv.hubId)?.name || inv.hubId || "—",
          net: money(invoiceNet(inv)),
          due: money(invoiceDue(inv)),
          payer: inv.payer?.type || "Self",
          method: inv.method || "—",
          createdAt: formatDT(inv.createdAt),
        };
      });
    const cols = [
      { key: "id", label: "Invoice" },
      { key: "patient", label: "Patient" },
      { key: "hub", label: "Hub" },
      { key: "net", label: "Net" },
      { key: "due", label: "Due" },
      { key: "payer", label: "Payer" },
      { key: "method", label: "Method" },
      { key: "createdAt", label: "Created" },
    ];

    const table = el("table", { class: "table", style: "margin-top:10px" }, [
      el("thead", {}, [el("tr", {}, cols.map((c) => el("th", {}, [document.createTextNode(c.label)])))]),
      el("tbody", {}, recent.map((r) => el("tr", {}, cols.map((c) => el("td", {}, [document.createTextNode(String(r[c.key]))]))))),
    ]);

    content.replaceChildren(form, body, actions, el("div", { class: "card" }, [el("div", { class: "card-title" }, [document.createTextNode("Recent Invoices")]), exportButtons("recent_invoices", cols, recent), table]));
  }

  function renderDiscounts() {
    const card = el("div", { class: "card soft" }, [
      el("div", { class: "card-title" }, [document.createTextNode("Discount Management")]),
      el("div", { class: "card-subtitle" }, [document.createTextNode("Percentage, flat-rate, and employee benefit discounts (prototype).")]),
    ]);

    const rows = state.invoices
      .filter((i) => i.discount && i.discount.type !== "none" && Number(i.discount.value || 0) > 0)
      .slice(0, 20)
      .map((inv) => {
        const p = findById(state.patients, inv.patientId);
        return {
          invoice: inv.id,
          patient: p?.name || "Unknown",
          type: inv.discount.type,
          value: inv.discount.value,
          amount: money(invoiceDiscountAmount(inv)),
          reason: inv.discount.reason || "",
          net: money(invoiceNet(inv)),
        };
      });

    const cols = [
      { key: "invoice", label: "Invoice" },
      { key: "patient", label: "Patient" },
      { key: "type", label: "Type" },
      { key: "value", label: "Value" },
      { key: "amount", label: "Amount" },
      { key: "reason", label: "Reason" },
      { key: "net", label: "Net" },
    ];

    const table = el("table", { class: "table", style: "margin-top:10px" }, [
      el("thead", {}, [el("tr", {}, cols.map((c) => el("th", {}, [document.createTextNode(c.label)])))]),
      el("tbody", {}, rows.length ? rows.map((r) => el("tr", {}, cols.map((c) => el("td", {}, [document.createTextNode(String(r[c.key]))])))) : [el("tr", {}, [el("td", { colspan: `${cols.length}` }, [renderEmpty()])])]),
    ]);

    content.replaceChildren(card, el("div", { class: "card" }, [exportButtons("discounts", cols, rows), table]));
  }

  function renderDues() {
    const card = el("div", { class: "card soft" }, [
      el("div", { class: "card-title" }, [document.createTextNode("Due Balance Tracking + Reminders")]),
      el("div", { class: "card-subtitle" }, [document.createTextNode("Track due per patient and send reminder notifications (prototype).")]),
    ]);

    const balances = state.patients
      .map((p) => {
        const invs = state.invoices.filter((i) => i.patientId === p.id);
        const due = invs.reduce((acc, i) => acc + invoiceDue(i), 0);
        return { patient: p.name, mobile: p.mobile, due: Math.round(due), id: p.id };
      })
      .filter((x) => x.due > 0)
      .sort((a, b) => b.due - a.due);

    const cols = [
      { key: "patient", label: "Patient" },
      { key: "mobile", label: "Mobile" },
      { key: "due", label: "Due (৳)" },
    ];

    const table = el("table", { class: "table", style: "margin-top:10px" }, [
      el("thead", {}, [el("tr", {}, cols.map((c) => el("th", {}, [document.createTextNode(c.label)])))]),
      el("tbody", {}, balances.length ? balances.map((r) => el("tr", {}, [
        el("td", {}, [el("strong", {}, [document.createTextNode(r.patient)])]),
        el("td", {}, [document.createTextNode(r.mobile)]),
        el("td", {}, [document.createTextNode(`৳${r.due}`)]),
      ])) : [el("tr", {}, [el("td", { colspan: `${cols.length}` }, [renderEmpty()])])]),
    ]);

    const reminderForm = el("div", { class: "card" }, [
      el("div", { class: "card-title" }, [document.createTextNode("Reminder Notification")]),
      el("div", { class: "card-subtitle" }, [document.createTextNode("Prototype: stores a reminder log and shows a toast.")]),
      el("div", { class: "form", style: "margin-top:10px" }, [
        fieldSelect("Patient", "patientId", [{ value: "", label: "—" }, ...state.patients.map((p) => ({ value: p.id, label: `${p.name} (${p.mobile})` }))]),
        fieldTextarea("Message", "message", "Reminder message...", "Your due balance is pending. Please clear your due at your earliest convenience."),
      ]),
    ]);

    const reminderActions = el("div", { class: "card-actions" }, [
      el("button", {
        class: "btn",
        type: "button",
        onclick: () => {
          const v = readForm(reminderForm);
          if (!v.patientId) return toast("Missing fields", "Select a patient for reminder.");
          const p = findById(state.patients, v.patientId);
          state.reminders.unshift({ id: uid("rem"), patientId: v.patientId, message: v.message || "", createdAt: new Date().toISOString() });
          saveState(state);
          toast("Reminder sent (demo)", `${p?.name || "Patient"}: ${(v.message || "").slice(0, 80)}`);
          renderTab();
        },
      }, [document.createTextNode("Send reminder")]),
    ]);

    const logRows = state.reminders.slice(0, 12).map((r) => {
      const p = findById(state.patients, r.patientId);
      return { patient: p?.name || "Unknown", message: r.message, createdAt: formatDT(r.createdAt) };
    });
    const logCols = [
      { key: "patient", label: "Patient" },
      { key: "message", label: "Message" },
      { key: "createdAt", label: "Time" },
    ];
    const logTable = el("table", { class: "table", style: "margin-top:10px" }, [
      el("thead", {}, [el("tr", {}, logCols.map((c) => el("th", {}, [document.createTextNode(c.label)])))]),
      el("tbody", {}, logRows.length ? logRows.map((r) => el("tr", {}, logCols.map((c) => el("td", {}, [document.createTextNode(String(r[c.key]))])))) : [el("tr", {}, [el("td", { colspan: `${logCols.length}` }, [renderEmpty()])])]),
    ]);

    content.replaceChildren(card, el("div", { class: "card" }, [exportButtons("due_balances", cols, balances.map((b) => ({ patient: b.patient, mobile: b.mobile, due: b.due }))), table]), reminderForm, reminderActions, el("div", { class: "card" }, [el("div", { class: "card-title" }, [document.createTextNode("Reminder Log")]), logTable]));
  }

  function renderBenefits() {
    const card = el("div", { class: "card soft" }, [
      el("div", { class: "card-title" }, [document.createTextNode("Employee Benefit & Insurance Billing")]),
      el("div", { class: "card-subtitle" }, [document.createTextNode("Track invoices billed to employee benefits or insurers (prototype).")]),
    ]);

    const rows = state.invoices
      .filter((i) => (i.payer?.type || "Self") !== "Self")
      .slice(0, 25)
      .map((inv) => {
        const p = findById(state.patients, inv.patientId);
        return {
          invoice: inv.id,
          patient: p?.name || "Unknown",
          payer: inv.payer?.type || "Self",
          org: inv.payer?.organization || "",
          net: money(invoiceNet(inv)),
          due: money(invoiceDue(inv)),
          createdAt: formatDT(inv.createdAt),
        };
      });

    const cols = [
      { key: "invoice", label: "Invoice" },
      { key: "patient", label: "Patient" },
      { key: "payer", label: "Payer" },
      { key: "org", label: "Organization/Insurer" },
      { key: "net", label: "Net" },
      { key: "due", label: "Due" },
      { key: "createdAt", label: "Created" },
    ];

    const table = el("table", { class: "table", style: "margin-top:10px" }, [
      el("thead", {}, [el("tr", {}, cols.map((c) => el("th", {}, [document.createTextNode(c.label)])))]),
      el("tbody", {}, rows.length ? rows.map((r) => el("tr", {}, cols.map((c) => el("td", {}, [document.createTextNode(String(r[c.key]))])))) : [el("tr", {}, [el("td", { colspan: `${cols.length}` }, [renderEmpty()])])]),
    ]);

    content.replaceChildren(card, el("div", { class: "card" }, [exportButtons("benefit_insurance", cols, rows), table]));
  }

  function renderCash() {
    const card = el("div", { class: "card soft" }, [
      el("div", { class: "card-title" }, [document.createTextNode("Cash Advance & Deposit Management")]),
      el("div", { class: "card-subtitle" }, [document.createTextNode("Record advances, deposits, and withdrawals per branch (prototype).")]),
    ]);

    const form = el("div", { class: "card" }, [
      el("div", { class: "card-title" }, [document.createTextNode("New Cash Entry")]),
      el("div", { class: "form", style: "margin-top:10px" }, [
        fieldSelect("Hub/Branch", "hubId", hubs.map((h) => ({ value: h.id, label: h.name })), hubs[0]?.id || ""),
        el("div", { class: "row" }, [
          fieldSelect("Type", "type", ["Cash Advance", "Deposit", "Withdraw"], "Deposit"),
          fieldInput("Amount (৳)", "amount", "0", "number", "0"),
        ]),
        el("div", { class: "row" }, [
          fieldSelect("Method", "method", payMethods, payMethods[0] || "Cash"),
          fieldInput("Reference", "ref", "Txn/Slip no."),
        ]),
        fieldInput("Note", "note", "Optional"),
      ]),
    ]);

    const actions = el("div", { class: "card-actions" }, [
      el("button", {
        class: "btn",
        type: "button",
        onclick: () => {
          const v = readForm(form);
          const amt = Number(v.amount || 0);
          if (!v.hubId || amt <= 0) return toast("Missing fields", "Hub and amount are required.");
          state.cashLedger.unshift({
            id: uid("cash"),
            hubId: v.hubId,
            type: v.type || "Deposit",
            amount: amt,
            method: v.method || "Cash",
            ref: v.ref || "",
            note: v.note || "",
            createdAt: new Date().toISOString(),
          });
          saveState(state);
          toast("Saved", "Cash ledger entry recorded.");
          renderTab();
        },
      }, [document.createTextNode("Save entry")]),
    ]);

    const rows = state.cashLedger.slice(0, 25).map((e) => ({
      hub: findById(hubs, e.hubId)?.name || e.hubId,
      type: e.type,
      amount: `৳${Math.round(e.amount)}`,
      method: e.method,
      ref: e.ref,
      createdAt: formatDT(e.createdAt),
    }));
    const cols = [
      { key: "hub", label: "Hub" },
      { key: "type", label: "Type" },
      { key: "amount", label: "Amount" },
      { key: "method", label: "Method" },
      { key: "ref", label: "Ref" },
      { key: "createdAt", label: "Time" },
    ];
    const table = el("table", { class: "table", style: "margin-top:10px" }, [
      el("thead", {}, [el("tr", {}, cols.map((c) => el("th", {}, [document.createTextNode(c.label)])))]),
      el("tbody", {}, rows.length ? rows.map((r) => el("tr", {}, cols.map((c) => el("td", {}, [document.createTextNode(String(r[c.key] ?? ""))])))) : [el("tr", {}, [el("td", { colspan: `${cols.length}` }, [renderEmpty()])])]),
    ]);

    content.replaceChildren(card, form, actions, el("div", { class: "card" }, [exportButtons("cash_ledger", cols, rows), table]));
  }

  function renderExpenses() {
    const card = el("div", { class: "card soft" }, [
      el("div", { class: "card-title" }, [document.createTextNode("Expense Entry & Petty Cash (Per Branch)")]),
      el("div", { class: "card-subtitle" }, [document.createTextNode("Record expenses and track petty cash usage per branch (prototype).")]),
    ]);

    const categories = ["Utilities", "Supplies", "Maintenance", "Salary/HR", "Transport", "Petty Cash", "Other"];

    const form = el("div", { class: "card" }, [
      el("div", { class: "card-title" }, [document.createTextNode("New Expense")]),
      el("div", { class: "form", style: "margin-top:10px" }, [
        fieldSelect("Hub/Branch", "hubId", hubs.map((h) => ({ value: h.id, label: h.name })), hubs[0]?.id || ""),
        el("div", { class: "row" }, [
          fieldSelect("Category", "category", categories, "Petty Cash"),
          fieldInput("Amount (৳)", "amount", "0", "number", "0"),
        ]),
        fieldSelect("Payment method", "method", payMethods, payMethods[0] || "Cash"),
        fieldInput("Note", "note", "Optional"),
      ]),
    ]);

    const actions = el("div", { class: "card-actions" }, [
      el("button", {
        class: "btn",
        type: "button",
        onclick: () => {
          const v = readForm(form);
          const amt = Number(v.amount || 0);
          if (!v.hubId || amt <= 0) return toast("Missing fields", "Hub and amount are required.");
          state.expenses.unshift({
            id: uid("exp"),
            hubId: v.hubId,
            category: v.category || "Other",
            amount: amt,
            method: v.method || "Cash",
            note: v.note || "",
            createdAt: new Date().toISOString(),
          });
          saveState(state);
          toast("Saved", "Expense entry recorded.");
          renderTab();
        },
      }, [document.createTextNode("Save expense")]),
    ]);

    const rows = state.expenses.slice(0, 25).map((e) => ({
      hub: findById(hubs, e.hubId)?.name || e.hubId,
      category: e.category,
      amount: `৳${Math.round(e.amount)}`,
      method: e.method,
      note: e.note,
      createdAt: formatDT(e.createdAt),
    }));
    const cols = [
      { key: "hub", label: "Hub" },
      { key: "category", label: "Category" },
      { key: "amount", label: "Amount" },
      { key: "method", label: "Method" },
      { key: "note", label: "Note" },
      { key: "createdAt", label: "Time" },
    ];
    const table = el("table", { class: "table", style: "margin-top:10px" }, [
      el("thead", {}, [el("tr", {}, cols.map((c) => el("th", {}, [document.createTextNode(c.label)])))]),
      el("tbody", {}, rows.length ? rows.map((r) => el("tr", {}, cols.map((c) => el("td", {}, [document.createTextNode(String(r[c.key] ?? ""))])))) : [el("tr", {}, [el("td", { colspan: `${cols.length}` }, [renderEmpty()])])]),
    ]);

    content.replaceChildren(card, form, actions, el("div", { class: "card" }, [exportButtons("expenses", cols, rows), table]));
  }

  function renderClosing() {
    const card = el("div", { class: "card soft" }, [
      el("div", { class: "card-title" }, [document.createTextNode("Daily Closing Report (Cash Register Reconciliation)")]),
      el("div", { class: "card-subtitle" }, [document.createTextNode("Summarize cash in/out and reconcile daily register (prototype).")]),
    ]);

    const form = el("div", { class: "card" }, [
      el("div", { class: "card-title" }, [document.createTextNode("Select day + hub")]),
      el("div", { class: "row", style: "margin-top:10px" }, [
        fieldInput("Date", "day", "", "date", todayISO()),
        fieldSelect("Hub/Branch", "hubId", hubOptions, ""),
      ]),
    ]);

    const v = readForm(form);
    const day = v.day || todayISO();
    const hubId = v.hubId || "";

    const filterHub = (xHubId) => !hubId || xHubId === hubId;

    const cashInFromInvoices = state.invoices
      .filter((inv) => (inv.createdAt || "").slice(0, 10) === day)
      .filter((inv) => filterHub(inv.hubId || ""))
      .filter((inv) => (inv.method || "Cash") === "Cash")
      .reduce((acc, inv) => acc + Number(inv.paid || 0), 0);

    const cashDeposits = state.cashLedger
      .filter((e) => (e.createdAt || "").slice(0, 10) === day)
      .filter((e) => filterHub(e.hubId))
      .filter((e) => e.type === "Deposit" && (e.method || "Cash") === "Cash")
      .reduce((acc, e) => acc + Number(e.amount || 0), 0);

    const cashAdvances = state.cashLedger
      .filter((e) => (e.createdAt || "").slice(0, 10) === day)
      .filter((e) => filterHub(e.hubId))
      .filter((e) => e.type === "Cash Advance" && (e.method || "Cash") === "Cash")
      .reduce((acc, e) => acc + Number(e.amount || 0), 0);

    const cashExpenses = state.expenses
      .filter((e) => (e.createdAt || "").slice(0, 10) === day)
      .filter((e) => filterHub(e.hubId))
      .filter((e) => (e.method || "Cash") === "Cash")
      .reduce((acc, e) => acc + Number(e.amount || 0), 0);

    const cashNet = cashInFromInvoices + cashDeposits - cashAdvances - cashExpenses;

    const summary = [
      { item: "Cash collected from invoices", amount: money(cashInFromInvoices) },
      { item: "Cash deposits", amount: money(cashDeposits) },
      { item: "Cash advances", amount: money(cashAdvances) },
      { item: "Cash expenses", amount: money(cashExpenses) },
      { item: "Expected closing cash (net)", amount: money(cashNet) },
    ];

    const cols = [
      { key: "item", label: "Item" },
      { key: "amount", label: "Amount" },
    ];

    const table = el("table", { class: "table", style: "margin-top:10px" }, [
      el("thead", {}, [el("tr", {}, cols.map((c) => el("th", {}, [document.createTextNode(c.label)])))]),
      el("tbody", {}, summary.map((r) => el("tr", {}, cols.map((c) => el("td", {}, [document.createTextNode(String(r[c.key]))]))))),
    ]);

    const actions = el("div", { class: "card-actions" }, [
      el("button", {
        class: "btn",
        type: "button",
        onclick: () => {
          toast("Closing (demo)", "In a real system this would lock the day and store reconciliation signatures.");
        },
      }, [document.createTextNode("Finalize closing (demo)")]),
    ]);

    // Make form reactive
    form.addEventListener("change", () => renderTab());

    content.replaceChildren(card, form, el("div", { class: "card" }, [exportButtons(`daily_closing_${day}`, cols, summary), table, actions]));
  }

  function renderRecon() {
    const card = el("div", { class: "card soft" }, [
      el("div", { class: "card-title" }, [document.createTextNode("Bank & Mobile Banking Entry Reconciliation")]),
      el("div", { class: "card-subtitle" }, [document.createTextNode("Log and reconcile bank/mobile entries across branches (prototype).")]),
    ]);

    const channels = ["Bank", "Mobile Banking"];
    const mobileMethods = ["bKash", "Nagad", "Rocket"];
    const bankMethods = ["Bank Transfer", "Card"];

    const invoiceOptions = [{ value: "", label: "— (optional)" }, ...state.invoices.slice(0, 50).map((i) => ({ value: i.id, label: i.id }))];

    const form = el("div", { class: "card" }, [
      el("div", { class: "card-title" }, [document.createTextNode("New Reconciliation Entry")]),
      el("div", { class: "form", style: "margin-top:10px" }, [
        fieldSelect("Hub/Branch", "hubId", hubs.map((h) => ({ value: h.id, label: h.name })), hubs[0]?.id || ""),
        el("div", { class: "row" }, [
          fieldSelect("Channel", "channel", channels, "Mobile Banking"),
          fieldInput("Amount (৳)", "amount", "0", "number", "0"),
        ]),
        fieldSelect("Method", "method", [...new Set([...mobileMethods, ...bankMethods])]),
        el("div", { class: "row" }, [
          fieldInput("Reference", "ref", "Txn / bank slip no."),
          fieldSelect("Match invoice (optional)", "invoiceId", invoiceOptions),
        ]),
        fieldSelect("Status", "status", ["Unmatched", "Matched", "Investigate"], "Unmatched"),
        fieldInput("Note", "note", "Optional"),
      ]),
    ]);

    const actions = el("div", { class: "card-actions" }, [
      el("button", {
        class: "btn",
        type: "button",
        onclick: () => {
          const v = readForm(form);
          const amt = Number(v.amount || 0);
          if (!v.hubId || amt <= 0 || !v.ref) return toast("Missing fields", "Hub, amount, and reference are required.");
          state.reconciliations.unshift({
            id: uid("rec"),
            hubId: v.hubId,
            channel: v.channel || "Mobile Banking",
            method: v.method || "",
            amount: amt,
            ref: v.ref || "",
            invoiceId: v.invoiceId || "",
            status: v.status || "Unmatched",
            note: v.note || "",
            createdAt: new Date().toISOString(),
          });
          saveState(state);
          toast("Saved", "Reconciliation entry recorded.");
          renderTab();
        },
      }, [document.createTextNode("Save entry")]),
    ]);

    const rows = state.reconciliations.slice(0, 25).map((r) => ({
      hub: findById(hubs, r.hubId)?.name || r.hubId,
      channel: r.channel,
      method: r.method,
      amount: `৳${Math.round(r.amount)}`,
      ref: r.ref,
      invoiceId: r.invoiceId || "",
      status: r.status,
      createdAt: formatDT(r.createdAt),
    }));
    const cols = [
      { key: "hub", label: "Hub" },
      { key: "channel", label: "Channel" },
      { key: "method", label: "Method" },
      { key: "amount", label: "Amount" },
      { key: "ref", label: "Reference" },
      { key: "invoiceId", label: "Invoice" },
      { key: "status", label: "Status" },
      { key: "createdAt", label: "Time" },
    ];
    const table = el("table", { class: "table", style: "margin-top:10px" }, [
      el("thead", {}, [el("tr", {}, cols.map((c) => el("th", {}, [document.createTextNode(c.label)])))]),
      el("tbody", {}, rows.length ? rows.map((r) => el("tr", {}, cols.map((c) => el("td", {}, [document.createTextNode(String(r[c.key] ?? ""))])))) : [el("tr", {}, [el("td", { colspan: `${cols.length}` }, [renderEmpty()])])]),
    ]);

    content.replaceChildren(card, form, actions, el("div", { class: "card" }, [exportButtons("reconciliation_entries", cols, rows), table]));
  }

  wrapper.replaceChildren(tabBar, content);
  renderTab();

  openModal({
    title: "Accounting & Billing Suite",
    bodyNode: wrapper,
    primaryText: "Close",
    onPrimary: () => {},
    wide: true,
  });
}

function openInvoiceDetails(invId) {
  const inv = findById(state.invoices, invId);
  if (!inv) return toast("Not found", "Invoice not found.");
  const p = findById(state.patients, inv.patientId);
  const gross = sumInvoice(inv);
  const discountAmt = invoiceDiscountAmount(inv);
  const total = invoiceNet(inv);
  const due = invoiceDue(inv);

  const itemsTable = el("table", { class: "table" }, [
    el("thead", {}, [el("tr", {}, [
      el("th", {}, [document.createTextNode("Item")]),
      el("th", {}, [document.createTextNode("Qty")]),
      el("th", {}, [document.createTextNode("Unit")]),
      el("th", {}, [document.createTextNode("Line total")]),
    ])]),
    el("tbody", {}, inv.items.map((it) => el("tr", {}, [
      el("td", {}, [el("strong", {}, [document.createTextNode(it.name)])]),
      el("td", {}, [document.createTextNode(`${it.qty}`)]),
      el("td", {}, [document.createTextNode(money(it.unit))]),
      el("td", {}, [document.createTextNode(money(it.qty * it.unit))]),
    ]))),
  ]);

  const body = el("div", { class: "grid" }, [
    el("div", { class: "card" }, [
      el("div", { class: "card-title" }, [document.createTextNode(`Invoice ${inv.id}`)]),
      el("div", { class: "card-subtitle" }, [document.createTextNode(`${p?.name || "Unknown"} · ${formatDT(inv.createdAt)}`)]),
      el("div", { style: "margin-top:10px; display:flex; gap:8px; flex-wrap:wrap;" }, [
        el("span", { class: "chip" }, [document.createTextNode(`Gross: ${money(gross)}`)]),
        el("span", { class: "chip" }, [document.createTextNode(`Discount: ${money(discountAmt)}`)]),
        el("span", { class: "chip" }, [document.createTextNode(`Net: ${money(total)}`)]),
        el("span", { class: "chip" }, [document.createTextNode(`Paid: ${money(inv.paid || 0)}`)]),
        el("span", { class: due === 0 ? "chip good" : "chip bad" }, [document.createTextNode(`Due: ${money(due)}`)]),
        el("span", { class: "chip" }, [document.createTextNode(`Method: ${inv.method || "—"}`)]),
        el("span", { class: "chip" }, [document.createTextNode(`Payer: ${inv.payer?.type || "Self"}`)]),
      ]),
      el("div", { class: "card-actions" }, [
        el("button", { class: "btn", type: "button", onclick: () => window.print() }, [document.createTextNode("Print")]),
        el("button", { class: "btn btn-ghost", type: "button", onclick: () => { $("#modal").close(); openCollectDue(); } }, [document.createTextNode("Collect due")]),
      ]),
    ]),
    el("div", { class: "card" }, [
      el("div", { class: "card-title" }, [document.createTextNode("Items")]),
      el("div", { style: "margin-top:10px" }, [itemsTable]),
    ]),
  ]);

  openModal({ title: "Invoice Details", bodyNode: body, primaryText: "Close", onPrimary: () => {}, wide: true });
}

function fieldInput(label, name, placeholder = "", type = "text", value = "") {
  const id = uid("f");
  return el("div", { class: "field" }, [
    el("label", { for: id }, [document.createTextNode(label)]),
    el("input", { id, name, placeholder, type, value }),
  ]);
}

function fieldTextarea(label, name, placeholder = "", value = "") {
  const id = uid("f");
  return el("div", { class: "field" }, [
    el("label", { for: id }, [document.createTextNode(label)]),
    el("textarea", { id, name, placeholder }, [document.createTextNode(value)]),
  ]);
}

function fieldSelect(label, name, options, value = "") {
  const id = uid("f");
  const opts = Array.isArray(options) ? options : [];
  const nodeOptions = opts.map((o) => {
    if (typeof o === "string") return el("option", { value: o, selected: value ? o === value : false }, [document.createTextNode(o)]);
    return el("option", { value: o.value, selected: value ? o.value === value : false }, [document.createTextNode(o.label)]);
  });
  return el("div", { class: "field" }, [
    el("label", { for: id }, [document.createTextNode(label)]),
    el("select", { id, name }, nodeOptions),
  ]);
}

function readForm(root) {
  const out = {};
  for (const input of root.querySelectorAll("input,select,textarea")) {
    out[input.name] = input.value;
  }
  return out;
}

function wireGlobalSearch() {
  const input = $("#globalSearch");
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const q = input.value.trim().toLowerCase();
      if (!q) return;

      const patient = state.patients.find((p) => `${p.name} ${p.mobile} ${p.id}`.toLowerCase().includes(q));
      if (patient) {
        toast("Found patient", patient.name);
        openPatientProfile(patient.id);
        return;
      }
      const invoice = state.invoices.find((inv) => inv.id.toLowerCase().includes(q));
      if (invoice) {
        toast("Found invoice", invoice.id);
        openInvoiceDetails(invoice.id);
        return;
      }
      toast("No match", "Try searching by patient mobile or invoice id.");
    }
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "/" && document.activeElement !== input && !e.metaKey && !e.ctrlKey && !e.altKey) {
      e.preventDefault();
      input.focus();
    }
  });
}

function wireReset() {
  $("#resetBtn").addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  });
}

function wireQuickActions() {
  $("#quickActionBtn").addEventListener("click", () => {
    const body = el("div", { class: "grid cols-2" }, [
      quickBtn("Register patient", "Creates a new patient profile.", () => openCreatePatient()),
      quickBtn("Book appointment", "Online/offline booking & token queue.", () => openBookAppointment()),
      quickBtn("Create prescription", "Doctor panel + print view.", () => openCreatePrescription()),
      quickBtn("Upload diagnostic", "Imaging metadata + viewer.", () => openUploadDiagnosticEnhanced()),
      quickBtn("Create invoice", "Billing + due tracking.", () => openCreateInvoice()),
      quickBtn("Verify report", "Central verification workflow.", () => {
        const r = state.reports[0];
        if (r) openVerifyReport(r.id);
        else toast("No reports", "Create a report in Diagnostics first.");
      }),
    ]);

    openModal({ title: "Quick Actions", bodyNode: body, primaryText: "Close", onPrimary: () => {} , wide: true});
  });
}

function quickBtn(title, subtitle, onClick) {
  return el("button", { class: "card", type: "button", onclick: () => { $("#modal").close(); onClick(); } }, [
    el("div", { class: "card-title" }, [document.createTextNode(title)]),
    el("div", { class: "card-subtitle" }, [document.createTextNode(subtitle)]),
  ]);
}

function wireSidebarToggle() {
  const sidebar = $(".sidebar");
  $("#sidebarToggle").addEventListener("click", () => sidebar.classList.toggle("open"));
  document.addEventListener("click", (e) => {
    if (!window.matchMedia("(max-width: 1020px)").matches) return;
    if (sidebar.classList.contains("open")) {
      const within = e.target.closest(".sidebar") || e.target.closest("#sidebarToggle");
      if (!within) sidebar.classList.remove("open");
    }
  });
}

function wireClock() {
  const node = $("#clock");
  const tick = () => {
    node.textContent = new Date().toLocaleString(undefined, { weekday: "short", hour: "2-digit", minute: "2-digit" });
  };
  tick();
  setInterval(tick, 30_000);
}

function init() {
  buildNav();
  if (!location.hash) location.hash = CONTEXT === "central" ? "#/central" : "#/dashboard";
  window.addEventListener("hashchange", render);
  wireGlobalSearch();
  wireReset();
  wireQuickActions();
  wireSidebarToggle();
  wireClock();
  render();
}

document.addEventListener("DOMContentLoaded", init);
