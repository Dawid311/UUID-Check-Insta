
const { google } = require('googleapis');

function calculateLevel(expTotal) {
  const exp = parseInt(expTotal) || 0;
  if (exp <= 39) return 1;
  if (exp <= 119) return 2;
  if (exp <= 239) return 3;
  if (exp <= 399) return 4;
  if (exp <= 599) return 5;
  if (exp <= 839) return 6;
  if (exp <= 1119) return 7;
  if (exp <= 1439) return 8;
  if (exp <= 1799) return 9;
  if (exp <= 2199) return 10;
  if (exp <= 2639) return 11;
  if (exp <= 3119) return 12;
  if (exp <= 3639) return 13;
  if (exp <= 4199) return 14;
  if (exp <= 4799) return 15;
  if (exp <= 5439) return 16;
  if (exp <= 6119) return 17;
  if (exp <= 6839) return 18;
  if (exp <= 7599) return 19;
  if (exp <= 8399) return 20;
  if (exp <= 9239) return 21;
  if (exp <= 10119) return 22;
  if (exp <= 11039) return 23;
  if (exp <= 11999) return 24;
  if (exp <= 12999) return 25;
  if (exp <= 14039) return 26;
  if (exp <= 15119) return 27;
  if (exp <= 16239) return 28;
  if (exp <= 17399) return 29;
  if (exp <= 18599) return 30;
  if (exp <= 19839) return 31;
  if (exp <= 21119) return 32;
  if (exp <= 22439) return 33;
  if (exp <= 23799) return 34;
  if (exp <= 25199) return 35;
  if (exp <= 26639) return 36;
  if (exp <= 28119) return 37;
  if (exp <= 29639) return 38;
  if (exp <= 31199) return 39;
  if (exp <= 32799) return 40;
  if (exp <= 34439) return 41;
  if (exp <= 36119) return 42;
  if (exp <= 37839) return 43;
  if (exp <= 39599) return 44;
  if (exp <= 41399) return 45;
  if (exp <= 43239) return 46;
  if (exp <= 45119) return 47;
  if (exp <= 47039) return 48;
  if (exp <= 48999) return 49;
  return 50;
}

async function getGoogleSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      type: 'service_account',
      project_id: process.env.GOOGLE_PROJECT_ID,
      private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      client_id: process.env.GOOGLE_CLIENT_ID,
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL}`
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
  });
  return google.sheets({ version: 'v4', auth });
}

async function findUserByUUID(uuid) {
  try {
    if (!process.env.GOOGLE_PRIVATE_KEY || process.env.GOOGLE_PRIVATE_KEY.includes('TEST_KEY_HIER')) {
      const mockData = {
        'test-uuid-123': {
          uuid: 'test-uuid-123',
          username: 'test_user',
          liked: 'true',
          commented: 'false',
          saved: 'true',
          story: 'false',
          wallet: '0x1234567890abcdef',
          claimed: 'false',
          level: '15',
          expTotal: '1500',
          expInstagram: '750',
          expTiktok: '500',
          expFacebook: '150',
          expStream: '100',
          liveNFTBonus: '50',
          globalFactor: '3.5',
          miningPower: '52.5',
          tokenReward: '100',
          picture: 'https://example.com/avatar.jpg',
          evaluatedAt: '2025-01-29'
        },
        'demo-uuid-456': {
          uuid: 'demo-uuid-456',
          username: 'demo_user',
          liked: 'false',
          commented: 'true',
          saved: 'false',
          story: 'true',
          wallet: '0xabcdef1234567890',
          claimed: 'true',
          level: '25',
          expTotal: '3200',
          expInstagram: '1200',
          expTiktok: '800',
          expFacebook: '600',
          expStream: '600',
          liveNFTBonus: '150',
          globalFactor: '4.2',
          miningPower: '105',
          tokenReward: '250',
          picture: 'https://example.com/demo.jpg',
          evaluatedAt: '2025-01-29'
        }
      };
      return mockData[uuid] || null;
    }
    const sheets = await getGoogleSheetsClient();
    const spreadsheetId = process.env.SPREADSHEET_ID;
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Instagram!A:CZ',
      valueRenderOption: 'FORMATTED_VALUE',
      dateTimeRenderOption: 'FORMATTED_STRING'
    });
    const rows = response.data.values;
    if (!rows || rows.length <= 1) {
      return null;
    }
    const userRow = rows.find((row, index) => {
      return index > 0 && row[0] === uuid;
    });
    if (!userRow) {
      return null;
    }
    return {
      uuid: userRow[0] || '',
      username: userRow[1] || '',
      liked: userRow[2] || '',
      commented: userRow[3] || '',
      saved: userRow[4] || '',
      story: userRow[5] || '',
      wallet: userRow[6] || '',
      claimed: userRow[7] || '',
      level: userRow[8] || '',
      expTotal: userRow[9] || '',
      expInstagram: userRow[10] || '',
      expTiktok: userRow[11] || '',
      expFacebook: userRow[12] || '',
      expStream: userRow[13] || '',
      liveNFTBonus: userRow[14] || '',
      globalFactor: userRow[15] || '',
      miningPower: userRow[16] || '',
      tokenReward: userRow[17] || '',
      picture: userRow[18] || '',
      evaluatedAt: userRow[19] || ''
    };
  } catch (error) {
    return null;
  }
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const { uuid } = req.body;
    if (!uuid) {
      return res.status(400).json({
        status: 'error',
        message: 'UUID ist erforderlich'
      });
    }
    const userData = await findUserByUUID(uuid);
    if (!userData) {
      return res.status(404).json({
        status: 'error',
        message: 'Benutzer nicht gefunden'
      });
    }
    const calculatedLevel = calculateLevel(userData.expTotal);
    const globalFactor = parseFloat(userData.globalFactor) || 1;
    const miningPower = calculatedLevel * globalFactor;
    const response = {
      status: 'ok',
      message: 'Userboard erfolgreich geladen.',
      username: userData.username,
      commented: userData.commented.toLowerCase(),
      liked: userData.liked.toLowerCase(),
      story: userData.story.toLowerCase(),
      saved: userData.saved.toLowerCase(),
      expTotal: userData.expTotal,
      liveNFTBonus: userData.liveNFTBonus,
      miningpower: Math.round(miningPower * 100) / 100,
      expTiktok: userData.expTiktok,
      expInstagram: userData.expInstagram,
      expStream: userData.expStream,
      expFacebook: userData.expFacebook,
      wallet: userData.wallet,
      image: userData.picture
    };
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Interner Server-Fehler'
    });
  }
};
