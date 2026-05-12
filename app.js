/* Prototype-only UI: SPA router + localStorage demo data */

const STORAGE_KEY = "doctor-assist-prototype:v1";

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
        address: "LA, CA",
        createdAt: new Date().toISOString(),
      },
      {
        id: "pat_2",
        name: "Imran Hossain",
        mobile: "+1 (213) 555-0188",
        age: 41,
        sex: "Male",
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

function money(n) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(n);
}

function sumInvoice(inv) {
  return inv.items.reduce((acc, it) => acc + it.qty * it.unit, 0);
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

  return el("div", { class: "grid" }, [left, el("div", { class: "split" }, [workflow, quickPanelCard()]), ops]);
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
      el("button", { class: "btn btn-ghost", type: "button", onclick: () => openUploadDiagnostic() }, [document.createTextNode("Upload diagnostic")]),
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
      el("button", { class: "btn", type: "button", onclick: () => openUploadDiagnostic() }, [document.createTextNode("Upload image")]),
      el("button", { class: "btn btn-ghost", type: "button", onclick: () => openCreateReport() }, [document.createTextNode("Create report")]),
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
          el("button", { class: "btn btn-ghost", type: "button", onclick: () => openDiagnosticViewer(d.id) }, [document.createTextNode("View")]),
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

function viewBilling() {
  setTitle("Billing", "Invoices, due collection, income/expense (demo)");
  activeNav("/billing");

  const header = el("div", { class: "card soft" }, [
    el("div", { class: "card-title" }, [document.createTextNode("Accounting & Billing")]),
    el("div", { class: "card-subtitle" }, [document.createTextNode("Create invoices, collect dues, and export summary (prototype).")]),
    el("div", { class: "card-actions" }, [
      el("button", { class: "btn", type: "button", onclick: () => openCreateInvoice() }, [document.createTextNode("New invoice")]),
      el("button", { class: "btn btn-ghost", type: "button", onclick: () => openCollectDue() }, [document.createTextNode("Collect due")]),
    ]),
  ]);

  const rows = state.invoices
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((inv) => {
      const p = findById(state.patients, inv.patientId);
      const total = sumInvoice(inv);
      const due = Math.max(0, total - (inv.paid || 0));
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
  setTitle("Reports", "Performance, revenue, diagnostic monitoring (demo)");
  activeNav("/reports");

  const totals = state.invoices.reduce(
    (acc, inv) => {
      acc.total += sumInvoice(inv);
      acc.paid += inv.paid || 0;
      return acc;
    },
    { total: 0, paid: 0 }
  );
  const due = Math.max(0, totals.total - totals.paid);
  const pending = state.reports.filter((r) => r.status !== "Verified").length;

  const stats = el("div", { class: "grid cols-3" }, [
    statCard("Revenue (Billed)", money(totals.total), "All invoices (demo)"),
    statCard("Collected", money(totals.paid), "Paid amount received"),
    statCard("Diagnostics Pending", pending, "Awaiting verification"),
  ]);

  const reportTable = el("table", { class: "table" }, [
    el("thead", {}, [
      el("tr", {}, [
        el("th", {}, [document.createTextNode("Report")]),
        el("th", {}, [document.createTextNode("Patient")]),
        el("th", {}, [document.createTextNode("Status")]),
        el("th", {}, [document.createTextNode("Created")]),
        el("th", {}, [document.createTextNode("")]),
      ]),
    ]),
    el("tbody", {}, state.reports.slice().sort((a,b)=>b.createdAt.localeCompare(a.createdAt)).map((r) => {
      const p = findById(state.patients, r.patientId);
      return el("tr", {}, [
        el("td", {}, [el("strong", {}, [document.createTextNode(r.title)]), el("div", { class: "help" }, [document.createTextNode(r.id)])]),
        el("td", {}, [document.createTextNode(p?.name || "Unknown")]),
        el("td", {}, [statusChip(r.status)]),
        el("td", {}, [document.createTextNode(formatDT(r.createdAt))]),
        el("td", {}, [el("button", { class: "btn btn-ghost", type: "button", onclick: () => openVerifyReport(r.id) }, [document.createTextNode("Open")])]),
      ]);
    })),
  ]);

  const insights = el("div", { class: "card soft" }, [
    el("div", { class: "card-title" }, [document.createTextNode("Insights (Prototype)")]),
    el("div", { class: "card-subtitle" }, [document.createTextNode("Central monitoring cards that could be expanded with real analytics.")]),
    el("div", { class: "grid cols-2", style: "margin-top:10px" }, [
      el("div", { class: "card" }, [
        el("div", { class: "card-title" }, [document.createTextNode("Due collection")]),
        el("div", { class: "card-subtitle" }, [document.createTextNode(`Outstanding due: ${money(due)}`)]),
        el("div", { class: "help" }, [document.createTextNode("Track dues by hub/doctor/patient in the real system.")]),
      ]),
      el("div", { class: "card" }, [
        el("div", { class: "card-title" }, [document.createTextNode("Diagnostic monitoring")]),
        el("div", { class: "card-subtitle" }, [document.createTextNode(`${pending} verification(s) pending`)]),
        el("div", { class: "help" }, [document.createTextNode("Central can monitor uploads, report status, and delivery times.")]),
      ]),
    ]),
  ]);

  return el("div", { class: "grid" }, [stats, el("div", { class: "card" }, [reportTable]), insights]);
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
  "/central": viewCentral,
  "/ai": viewAI,
};

function currentRoute() {
  const hash = location.hash || "#/dashboard";
  const m = hash.match(/^#(\/[a-z-]+)/i);
  return m ? m[1] : "/dashboard";
}

function render() {
  const route = currentRoute();
  const view = routes[route] || routes["/dashboard"];
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
    el("div", { class: "row" }, [
      fieldInput("Item 1", "item1", "Consultation"),
      fieldInput("Amount 1", "amt1", "20", "number", "20"),
    ]),
    el("div", { class: "row" }, [
      fieldInput("Item 2", "item2", "e.g., X-Ray"),
      fieldInput("Amount 2", "amt2", "e.g., 35", "number", "0"),
    ]),
    fieldSelect("Payment method", "method", ["Cash", "Card", "Mobile Banking"]),
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
        items,
        method: v.method || "Cash",
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
  const dueInvoices = state.invoices.filter((inv) => sumInvoice(inv) > (inv.paid || 0));
  const body = el("div", { class: "form" }, [
    fieldSelect("Invoice", "invoiceId", dueInvoices.map((inv) => {
      const p = findById(state.patients, inv.patientId);
      const total = sumInvoice(inv);
      const due = Math.max(0, total - (inv.paid || 0));
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

function openInvoiceDetails(invId) {
  const inv = findById(state.invoices, invId);
  if (!inv) return toast("Not found", "Invoice not found.");
  const p = findById(state.patients, inv.patientId);
  const total = sumInvoice(inv);
  const due = Math.max(0, total - (inv.paid || 0));

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
        el("span", { class: "chip" }, [document.createTextNode(`Total: ${money(total)}`)]),
        el("span", { class: "chip" }, [document.createTextNode(`Paid: ${money(inv.paid || 0)}`)]),
        el("span", { class: due === 0 ? "chip good" : "chip bad" }, [document.createTextNode(`Due: ${money(due)}`)]),
        el("span", { class: "chip" }, [document.createTextNode(`Method: ${inv.method || "—"}`)]),
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
      quickBtn("Upload diagnostic", "Imaging metadata + viewer.", () => openUploadDiagnostic()),
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
  if (!location.hash) location.hash = "#/dashboard";
  window.addEventListener("hashchange", render);
  wireGlobalSearch();
  wireReset();
  wireQuickActions();
  wireSidebarToggle();
  wireClock();
  render();
}

document.addEventListener("DOMContentLoaded", init);
