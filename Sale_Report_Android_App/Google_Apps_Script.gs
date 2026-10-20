/** Sale Report -> Google Sheets bridge.
 * Spreadsheet ID is the user's supplied spreadsheet.
 * Creates/uses "Sales Log" and "Expenses" tabs.
 */
const SPREADSHEET_ID = '1bnIb_MAOdlQr2yzLXqtT88XmroTknqKM4lFexEfJBfc';

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const payload = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (!payload.record || !payload.type) throw new Error('Missing type or record');
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    if (payload.type === 'sale') {
      const r = payload.record;
      const sh = getSheet_(ss, 'Sales Log', ['ID','Date','Product','Quantity','Unit Price (INR)','Total (INR)','Notes','Received At']);
      if (alreadyExists_(sh, r.id)) return json_({ok:true, duplicate:true});
      sh.appendRow([String(r.id || ''), String(r.date || ''), String(r.product || ''), Number(r.qty || 0), Number(r.unitPrice || 0), Number(r.total || 0), String(r.notes || ''), new Date()]);
    } else if (payload.type === 'expense') {
      const r = payload.record;
      const sh = getSheet_(ss, 'Expenses', ['ID','Date','Amount (INR)','Category','Description','Received At']);
      if (alreadyExists_(sh, r.id)) return json_({ok:true, duplicate:true});
      sh.appendRow([String(r.id || ''), String(r.date || ''), Number(r.amount || 0), String(r.category || 'Other'), String(r.description || ''), new Date()]);
    } else {
      throw new Error('Unsupported type');
    }
    return json_({ok:true});
  } catch (err) {
    return json_({ok:false, error:String(err)});
  } finally {
    lock.releaseLock();
  }
}

function getSheet_(ss, name, headers) {
  let sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);
  if (sh.getLastRow() === 0) {
    sh.appendRow(headers);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  }
  return sh;
}

function alreadyExists_(sh, id) {
  if (!id || sh.getLastRow() < 2) return false;
  const ids = sh.getRange(2, 1, sh.getLastRow() - 1, 1).getDisplayValues();
  return ids.some(row => row[0] === String(id));
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
