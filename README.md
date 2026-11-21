# PNV Manager — Local Storage Edition

Mobile-friendly management-only PWA for PNV TRADERS, covering Dharga and Muneeshwar Nagar shops.

## Run in GitHub Codespaces

```bash
git pull origin main
npm install
npm run dev
```

Open forwarded port **5173** in your browser.

## Features

- Both shops in one interface, with shop selector
- Daily sales closings and cash reconciliation
- Product catalog and inventory movements
- Expenses and staff attendance
- JSON backups and CSV exports
- Mobile-friendly responsive interface

## Important data safety limitations

Records are saved in the **current browser's localStorage**, not on GitHub or Firebase. Different devices and browsers do **not** share data. Clearing site data, changing the preview URL/origin, private browsing, or losing the device can erase or isolate records. Export JSON backups frequently from the **Backup** tab, and keep the backup somewhere safe. Import backups on another device if you need to transfer records.

There is **no authentication, no staff access control, no automatic synchronization, and no server backup**. Don't share the app with untrusted users or rely on it as the only copy of critical shop records. This edition is intended for a single trusted manager device or testing. Billing remains manual.

Firebase files are retained in the repository for possible future use but are **not imported by the running local app**.
