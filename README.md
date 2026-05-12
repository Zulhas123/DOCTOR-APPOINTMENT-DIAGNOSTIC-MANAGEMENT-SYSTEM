# Doctor Appointment & Diagnostic Prototype (HTML)

Static HTML prototype to visualize the system described in `E:\My Files\projects\Files\prototype.txt`.

## Run

Use a local server (recommended so `localStorage` works reliably):

```powershell
cd "E:\My Files\projects\Doctor-appointment-prototype"
python -m http.server 5173
```

Open:

- Workspace chooser: `http://localhost:5173/index.html`
- Central: `http://localhost:5173/central/`
- Hub/Branch: `http://localhost:5173/hub/`

## End-to-End Flow (Demo)

Patient → Appointment → Prescription → Diagnostics → Billing → Reports

- **Patients**: register/search by mobile, open profile
- **Appointments**: book online/offline, token/queue statuses, mark completed
- **Prescriptions**: create/edit, open print view
- **Diagnostics**:
  - **Upload image** (basic)
  - **Upload / Scan Diagnostic** (enhanced: preview + scan sources)
- **Billing**: create invoice, track due, collect payment
- **Reports**: choose report type + filters, export CSV/Excel/PDF

## Central vs Hub

### Central (Admin)

Implements the requested central responsibilities:

- Manage hubs/branches (add/edit, active/inactive)
- Doctor assignment & scheduling (assign doctors to hubs)
- Accounting monitoring (invoice/dues overview)
- Diagnostic report monitoring + verification workflow
- Revenue/performance analysis + **Analysis Functions**
- Centralized patient database

### Hub / Branch

Daily operations (per branch):

- Patient registration
- Appointment handling
- Prescriptions
- Diagnostics upload/scan
- Billing + due collection
- Reports

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
- **PDF**: uses browser print (`Ctrl+P`) → “Save as PDF”

## Diagnostics: Preview + Scan

In **Diagnostics → Upload / Scan Diagnostic**:

- **Load demo image**: loads a built-in placeholder image in the preview
- **Upload file**: pick an image/PDF
- **Image scan**: camera capture file input (where supported)
- **PDF scan**: select a PDF
- **QR scan**: camera QR scan (where supported)
- **Clear**: resets preview + selected file so a new image loads cleanly

Saved diagnostics store (demo):

- `fileName`, `fileType`, optional `previewDataUrl` (images), optional `scannedText` (QR), `source`, `hubId`

## Dashboard: Charts + “Live” Demo Data

- Dashboard includes simple charts (canvas) for revenue trend and appointment status distribution.
- **Live Ops (Prototype)** can simulate periodic incoming events to make the dashboard change.

## Notes / Limitations

- No backend/database: demo data is stored in your browser (`localStorage`).
- Use **Reset demo data** in the sidebar to restore the default seed.
- QR scanning requires `BarcodeDetector` + camera permissions (typically Chrome/Edge).

