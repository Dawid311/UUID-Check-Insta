

import { google } from 'googleapis';

export default async function handler(req, res) {
  // CORS-Header setzen
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Nur POST erlaubt' });
    return;
  }

  const { uuid } = req.body;
  if (!uuid) {
    res.status(400).json({ error: 'UUID fehlt' });
    return;
  }

  // Google Sheets API Setup
  const auth = new google.auth.GoogleAuth({
    credentials: {
      type: 'service_account',
      project_id: process.env.GOOGLE_PROJECT_ID,
      private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      client_id: process.env.GOOGLE_CLIENT_ID,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  const spreadsheetId = process.env.SPREADSHEET_ID;
  const sheetName = 'Instagram';
  const range = `${sheetName}!A1:CZ1000`;

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    const rows = response.data.values;
    if (!rows || rows.length < 2) {
      res.status(404).json({ error: 'Keine Daten gefunden' });
      return;
    }
    const headers = rows[0];
    const uuidIndex = headers.indexOf('uuid (A)') !== -1 ? headers.indexOf('uuid (A)') : 0;
    const userRow = rows.find((row, idx) => idx > 0 && row[uuidIndex] === uuid);
    if (!userRow) {
      res.status(404).json({ error: 'UUID nicht gefunden' });
      return;
    }

    // Hilfsfunktion für sichere Feldzuweisung
    const get = (col) => userRow[headers.indexOf(col)] || '';

    // Level-Berechnung (wie im Blueprint)
    const expTotal = parseInt(get('expTotal (J)') || get('expTotal') || get('9'), 10) || 0;
    let level = 1;
    const levelSteps = [39,119,239,399,599,839,1119,1439,1799,2199,2639,3119,3639,4199,4799,5439,6119,6839,7599,8399,9239,10119,11039,11999,12999,14039,15119,16239,17399,18599,19839,21119,22439,23799,25199,26639,28119,29639,31199,32799,34439,36119,37839,39599,41399,43239,45119,47039,48999];
    for (let i = 0; i < levelSteps.length; i++) {
      if (expTotal > levelSteps[i]) level = i + 2;
      else break;
    }

    // MiningPower = level * globalFactor (globalFactor = Q = "miningPower (Q)" oder "globalFactor (P)")
    const globalFactor = parseFloat(get('globalFactor (P)') || get('globalFactor') || get('15')) || 0;
    const miningPower = Math.trunc(level * globalFactor * 100) / 100;

    // Response wie im Blueprint
    res.status(200).json({
      status: 'ok',
      message: 'Userboard erfolgreich geladen.',
      username: get('username (B)') || get('username') || get('1'),
      commented: (get('commented (D)') || get('commented') || get('3')).toLowerCase(),
      liked: (userRow[2] || '').toLowerCase(),
      story: (get('story (F)') || get('story') || get('5')).toLowerCase(),
      saved: (get('saved (E)') || get('saved') || get('4')).toLowerCase(),
      expTotal: expTotal.toString(),
      liveNFTBonus: userRow[14] || '',
      miningpower: miningPower.toString(),
      expTiktok: userRow[11] || '',
      expInstagram: get('expInstagram (K)') || get('expInstagram') || get('10'),
      expStream: get('expStream (N)') || get('expStream') || get('13'),
      expFacebook: userRow[12] || '',
      wallet: get('wallet (G)') || get('wallet') || get('6'),
      image: userRow[18] || '',
    });
  } catch (error) {
    res.status(500).json({ error: 'Serverfehler', details: error.message });
  }
}
