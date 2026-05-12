# Doctor Appointment & Diagnostic Prototype (HTML)

This is a **static HTML** prototype to visualize the core features described in `E:\My Files\projects\Files\prototype.txt`:

- Patient registration + search (mobile-based)
- Appointment booking (online/offline) + token/queue statuses
- Prescriptions (Bangla/English demo) + print view
- Diagnostics metadata upload + viewer placeholder
- Billing + due collection + payment method placeholder
- Reports + verification workflow
- Central admin monitoring cards
- AI “future features” placeholders

## Run

Best experience is via a local web server (so `localStorage` works reliably):

```powershell
cd "E:\My Files\projects\Doctor-appointment-prototype"
python -m http.server 5173
```

Then open:

`http://localhost:5173/index.html`

## Notes

- No backend/database: demo data is stored in your browser (`localStorage`).
- Use **Reset demo data** in the sidebar to restore the default seed.

