# Doctor Appointment & Diagnostic Prototype (HTML)

Static HTML prototype to visualize a multi-hub medical network: Central Management + Hub/Branch operations.

## Run

Use a local server (recommended so `localStorage` works reliably):

```powershell
cd "E:\My Files\projects\Doctor-appointment-prototype"
.\serve.ps1
```

Open:

- Workspace chooser: `http://localhost:5173/index.html`
- Central: `http://localhost:5173/central/`
- Hub/Branch: `http://localhost:5173/hub/`
- Mono (all-in-one): `http://localhost:5173/app/`

## End-to-End Flow (Demo)

Patient -> Appointment -> Prescription -> Diagnostics -> Billing -> Reports

- **Patients**: register/search by mobile, open profile
- **Appointments**: book online/offline, token/queue statuses, mark completed
- **Prescriptions**: create/edit, open print view
- **Diagnostics**: upload/scan (preview + QR/PDF/image scan), investigation lifecycle
- **Billing**: create invoice, discounts, track due, collect payment
- **Reports**: choose report type + filters, export CSV/Excel/PDF

## Central vs Hub

### Central (Admin)

Central responsibilities (prototype visualization):

- Manage all hubs/branches (add/edit, active/inactive) via **Central -> Manage hubs**
- Doctor assignment and scheduling via **Doctors** (includes optional hub field on doctor add)
- Accounting monitoring via **Billing** + **Accounting suite**
- Diagnostic report monitoring via **Diagnostics** + **Investigation lifecycle**
- Revenue and performance analysis via **Reports**, **Finance reports**, and **Analysis Functions**
- Centralized patient database via **Patients**

### Hub / Branch

Daily operations:

- Patient registration
- Appointment handling
- Prescriptions
- Diagnostics upload/scan
- Billing + due collection
- Reports + exports

## Reports (Menu + Filters + Export)

Report types included in **Reports**:

- Daily report
- Monthly report
- Test wise report
- Doctor wise report
- Patient type wise report
- Test type wise report
- Center wise report
- Hub wise report

Filters:

- Depending on report type: Hub, Test/Service name, Doctor, Patient type, Test type, Date, Month.

Exports:

- **CSV**: downloads `.csv`
- **Excel**: downloads `.xls` (HTML-table format, prototype-friendly)
- **PDF**: uses browser print (`Ctrl+P`) -> "Save as PDF"

### Finance Reports (Management)

In **Reports -> Finance reports**:

- Daily Cash Collection Report (branch-wise + consolidated)
- Monthly Income Statement (revenue vs expense)
- Hub/Branch-wise Revenue Comparison
- Doctor-wise Income and Commission Report (prototype estimate)
- Due Collection Aging Report (30/60/90 days)
- Expense Report by Category
- Profit & Loss Statement (monthly/quarterly/annual)
- Payment Method Breakdown Report
- Employee Medical Benefit Utilization Report

## Diagnostics: Preview + Scan

In **Diagnostics -> Upload image**:

- **Load demo image**: loads a built-in placeholder in the preview
- **Upload file**: pick an image/PDF
- **Image scan**: camera capture file input (where supported)
- **PDF scan**: select a PDF
- **QR scan**: camera QR scan (where supported)
- **Clear**: resets preview + selected file so a new image loads cleanly

Saved diagnostic entries store (demo):

- `fileName`, `fileType`, optional `previewDataUrl` (images), optional `scannedText` (QR), `source`, `hubId`

### Diagnostic Investigations Lifecycle (Ordering -> Delivery)

In **Diagnostics -> Investigation lifecycle**:

- Order tests by department (Pathology/Lab, Radiology/Imaging, Cardiology, Special Diagnostics)
- Track lifecycle stages:
  - Ordered -> Collected -> Processing -> Report Draft -> Approved -> Delivered
- Add report summary + remarks, then advance status using **Next step**

## Dashboard: Charts + "Live" Demo Data

- Dashboard includes simple charts (canvas) for revenue trend and appointment status distribution.
- **Live Ops (Prototype)** can simulate periodic incoming events to make the dashboard change.

## Accounting & Billing Suite (Advanced)

In **Billing -> Accounting suite**:

- Service billing + itemized invoices
- Discount management (percent/flat) + benefit/insurance payer tracking
- Due tracking per patient + reminder notifications (demo)
- Cash advance + deposit ledger (per branch)
- Expense entry + petty cash (per branch)
- Daily closing report (cash register reconciliation)
- Bank & mobile banking reconciliation entries

## Notes / Limitations

- No backend/database: demo data is stored in your browser (`localStorage`).
- Use **Reset demo data** in the sidebar to restore the default seed.
- QR scanning requires `BarcodeDetector` + camera permissions (typically Chrome/Edge).

