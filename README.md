# PNV Manager

Mobile-friendly shop management PWA for PNV TRADERS (Dharga and Muneeshwar Nagar, Hosur).

## Start in GitHub Codespaces

```bash
npm install
npm run dev
```

Open port **5173** from the Codespaces **Ports** tab. For a production bundle run `npm run build`.

## Features

Dashboard, daily sales closing and cash variance, products and inventory, stock IN/OUT movements, expenses, staff attendance, and JSON/CSV backup exports. Management only: customer billing stays manual.

## Important limitations

**V1 uses browser localStorage and is device-specific.** It does not synchronize shops or provide protected multi-user logins. Use one trusted device for testing and export JSON backups regularly. Do not use for live business records across staff devices until cloud authentication, permissions, and database synchronization are implemented. PWA manifest enables an installable UI on supported browsers; offline behavior is limited and no service worker is included.

Daily sales and expenses reflect entries across all dates, not just today's transactions. Enter product sold quantities as stock OUT movements because manual billing does not automatically affect inventory. Cash refunds are assumed cash-paid in cash reconciliation.
