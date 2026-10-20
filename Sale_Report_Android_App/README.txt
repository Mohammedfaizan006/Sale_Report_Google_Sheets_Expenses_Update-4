SALE REPORT — ANDROID WEB APP / PWA

PACKAGE CONTENTS
- index.html: Sale Report app with sales, expenses, monthly reports, CSV exports, backup/restore and Google Sheets sync settings.
- manifest.json and sw.js: installable Progressive Web App files.
- Google_Apps_Script.gs: receiver code for your Google Sheet.

IMPORTANT
This is an installable web app package, not a standalone APK. Host these files on an HTTPS static host, then open the hosted page in Chrome on Android and choose Install app / Add to Home screen. The app stores records locally on the device.

CONNECT YOUR GOOGLE SHEET
1. Open your spreadsheet:
   https://docs.google.com/spreadsheets/d/1bnIb_MAOdlQr2yzLXqtT88XmroTknqKM4lFexEfJBfc/edit
2. Open Extensions > Apps Script.
3. Replace the editor contents with the code from Google_Apps_Script.gs and save.
4. Click Deploy > New deployment. Select type: Web app.
5. Set Execute as: Me. For access, choose the option that permits access from your app (often “Anyone”). This means anyone who obtains the deployed URL may be able to add rows, so keep the URL private. If your Google account does not permit public web apps, use an authenticated deployment approach instead.
6. Click Deploy, approve the Google permissions, and copy the Web app URL ending in /exec.
7. Open Sale Report app > Settings, paste the /exec URL under Google Apps Script Web App URL, then tap Save sync settings.
8. Test by saving one small sale and one expense, then check the “Sales Log” and “Expenses” tabs in your spreadsheet. The script creates these tabs and their headers automatically.

SYNC BEHAVIOUR / LIMITATIONS
- New sales and expenses are sent when saved while the device is online and the URL is configured.
- The browser uses a no-cors request, so it cannot verify that Google accepted the request; check the spreadsheet during your first test.
- Entries created before sync was configured are NOT automatically uploaded. This version does not queue and retry offline entries. If offline, the app keeps the entry on the device; you must add it to the sheet manually or export and transfer it.
- Deleting an entry from the app does not delete its already-synced Google Sheets row.
- The Google Sheet is not read back into the app; it is an outgoing sync only.
- Keep regular backups using Settings > Data backup.
