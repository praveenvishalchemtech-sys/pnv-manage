# PNV Manager Firebase setup

1. Visit https://console.firebase.google.com and create a project named **PNV Manager**. Select a suitable Firestore region; region selection is not easily changed.
2. Add a **Web app** in Firebase project settings. Copy the web config values to your Codespaces local `.env` file (copy `.env.example`). Never commit `.env`.
3. Firebase Console > **Authentication** > **Sign-in method** > enable **Email/Password**.
4. Firebase Console > **Firestore Database** > **Create database** (production mode). Then open **Rules** and paste the full contents of `firestore.rules`; click **Publish**. Never leave test-mode rules enabled.
5. Firebase Console > Authentication > **Users** > **Add user**: create your manager email/password login. Copy the newly created user's **UID**.
6. Firestore > **Start collection**: `profiles`. Document ID: the manager UID (exactly). Fields: `name` string (e.g. Owner), `role` string `manager`, `active` boolean `true`, `shop` null. This manual bootstrap is necessary because public sign-up is disabled.
7. In Codespaces terminal: `npm install`, `cp .env.example .env`; edit `.env` with Firebase web config and run `npm run dev`. Open forwarded port 5173.
8. Sign in as manager. For each staff member, use Firebase Console > Authentication > Users > Add user; copy their UID. In PNV Manager > Access, assign role `staff` and the correct shop. Four staff accounts can be created for two shops.
9. In Firebase Authentication > Settings > Authorized domains, add the exact Codespaces preview domain if Firebase rejects the login domain. Use HTTPS preview URL.
10. Test with two separate browsers: manager sees both shops; Dharga staff cannot see Muneeshwar Nagar data; and vice versa.

## Notes

- Firebase may require a billing-enabled plan for certain hosting/services. Check current pricing and quotas before enabling them; this app uses Firebase Authentication and Firestore.
- Firestore rules are checked on the server, not just in the UI. Never use public read/write rules.
- The repository is currently public. Keep passwords, private keys, and service account JSON out of GitHub.
- No automatic migration from local browser storage is included. Export and preserve the old data before replacing the running app.
- This release needs validation for concurrency, stock reconciliation, duplicate closings, attendance integrity, audit trails, and backups before handling real shop operations.
