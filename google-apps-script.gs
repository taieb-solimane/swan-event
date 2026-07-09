/**
 * SWAN EVENTS — Reservation form → Google Sheets
 * ------------------------------------------------------------
 * SETUP (takes about 5 minutes):
 *
 * 1. Go to https://sheets.google.com and create a new spreadsheet.
 *    Name it e.g. "Swan Events — Réservations".
 *
 * 2. Rename the first tab to "Reservations" and add this header
 *    row (row 1), exactly in this order:
 *    Date | Type d'événement | Nom | Téléphone | Date événement | Lieu | Invités | Description | Langue
 *
 * 3. In the sheet, open Extensions → Apps Script.
 *    Delete any starter code and paste this entire file.
 *
 * 4. Click Deploy → New deployment.
 *    - Type: "Web app"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone"
 *    Click Deploy, then authorize the script (accept the Google
 *    permission prompts — this is your own script, running on
 *    your own sheet).
 *
 * 5. Copy the "Web app URL" you're given. It looks like:
 *    https://script.google.com/macros/s/XXXXXXXXXXXX/exec
 *
 * 6. Open js/main.js in the website files and paste that URL as
 *    the value of GOOGLE_SCRIPT_URL near the top of the file.
 *
 * 7. Whenever you edit this script later, you must create a
 *    "New deployment" again (or manage deployments → edit) for
 *    the changes to go live — updating the code alone isn't enough.
 * ------------------------------------------------------------
 */

const SHEET_ID = "1XOyVCagGPsPsLmmFexp8DbLuvHswdXPDqwLzxJYi864";
const SHEET_NAME = "Reservations";

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    const data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      new Date(),
      data.eventType || "",
      data.name || "",
      data.phone || "",
      data.date || "",
      data.location || "",
      data.guests || "",
      data.description || "",
      data.language || ""
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional: lets you sanity-check the deployment by visiting the
// Web app URL directly in a browser — should show "Swan Events form is live."
function doGet() {
  return ContentService.createTextOutput("Swan Events form is live.");
}
