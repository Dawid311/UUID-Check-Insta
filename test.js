const webhook = require('./api/webhook');

// Test-Daten
const testRequest = {
  method: 'POST',
  body: {
    uuid: 'test-uuid-123'
  }
};

const testResponse = {
  setHeader: (key, value) => console.log(`Header: ${key} = ${value}`),
  status: (code) => ({
    json: (data) => console.log(`Status: ${code}\nResponse:`, JSON.stringify(data, null, 2)),
    end: () => console.log(`Status: ${code} - Request ended`)
  })
};

console.log('Testing webhook function...\n');

// Mock Environment Variables für Test
process.env.SPREADSHEET_ID = '159BP31mnBsZXyseTP36tBooaeCnVCHSoI3kvrV-UntQ';

webhook(testRequest, testResponse).catch(console.error);
