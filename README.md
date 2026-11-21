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

## Stock upgrade (KM1 workbook)

The **Products** tab imports the OCT or NOV worksheet of the KM1 stock workbook. Select a destination shop and upload the workbook, review the preview, then confirm. The importer reads **ITEM NAME** and **BALANCE STOCK SHOP** as an opening snapshot, not the workbook's historical transactions. It blocks duplicate product names in the destination shop and invalid balances.

The **Stock** tab records individual sales, purchases, transfers, damage and returns. Sales and damage subtract stock; purchases and returns add stock. Transfers subtract from the source and add to the destination in one browser state update. The app automatically creates a matching product at the destination if absent.

Stock reports export CSV with opening stock, purchases, sales, transfers, damage, returns and current balance. Transactions are dated; the current report is cumulative from the imported opening snapshot, **not a month-filtered ledger**. Do not interpret the opening stock as the start of the current month unless imported on that date.

**Data safety:** All records still live in the current browser's localStorage, without cross-device sync or login. Use Backup > Download JSON backup every day. Do not use the old generic stock-movement records in another app version to edit the same stock without reconciling totals. Transfers have no receiving approval. Deleting products via backup edits can invalidate transactions.

**Setup:** run `git pull origin main`, `npm install`, `npm run dev`. The Excel import uses the `xlsx` package. This feature has not yet been tested in the user's Codespaces environment; test with a JSON backup and sample quantities before using live stock.
