# Download and install PNV Manager

Open GitHub repository > Actions > **Build PNV Manager installers** > Run workflow (main). Wait until both jobs succeed. Open the completed run and download the artifacts:

- **PNV-Manager-Windows-Installer**: unzip and run the EXE on Windows. Windows SmartScreen may warn because this is unsigned software; verify it came from your own GitHub Actions build.
- **PNV-Manager-Android-APK**: unzip and copy app-debug.apk to Android, then open it to install. Android may ask to allow installation from the app used to open the APK. This is a debug-signed APK for testing, not a Play Store release. Do not publish it as a production release.

The Windows and Android apps store data **separately** on their respective devices. They do not sync with each other or with the Codespaces web preview. Export JSON from Backup before switching devices, and restore the file on the new installation. Do not uninstall or clear app data before backing up.

For development:
- `npm install`
- `npm run dev` (browser)
- `npm run desktop:package` (Windows host)
- `npm run build && npx cap add android && npx cap sync android` (first Android build)

The Actions build has not been verified yet; check each job log for errors. APK is unsigned for release purposes (debug key only), and the Windows EXE is not code-signed.
