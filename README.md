# PNV Manager – Cloud edition

React + Vite + Firebase Authentication + Firestore real-time shop management.

**Start:** `npm install`, copy `.env.example` to `.env`, fill in your Firebase web app config, then `npm run dev`. See [CLOUD_SETUP.md](CLOUD_SETUP.md).

**Security:** Deploy `firestore.rules` in Firebase Console before using the app. Never commit secrets or a service-account key. The public Firebase web config is not a secret, but rules are essential.

**Manager:** View both shops and assign staff profiles. **Staff:** Read/write only their assigned shop (except products are manager-maintained). Manual customer billing continues.

**Important:** This is an initial cloud implementation, not a production-certified POS or accounting system. Stock quantities and duplicate closing checks are UI-side and can race under concurrent submissions; add Firestore transactions, server-side validation, audit trails, and backup/restore before production use. Staff can record attendance for shop colleagues; this is not payroll-grade verification. Net sales/expenses dashboard totals are all-time. The app does not yet offer automatic offline support.
