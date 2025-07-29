# UUID Check API

Eine Node.js API für Vercel, die UUID-basierte Benutzerabfragen mit Google Sheets Integration unterstützt.

## Features

- Webhook-Endpunkt für UUID-Abfragen
- Google Sheets Integration
- Automatische Level-Berechnung basierend auf expTotal
- Mining Power Berechnung
- CORS-Unterstützung

## Setup

### 1. Environment Variables

Erstellen Sie die folgenden Environment Variables in Ihrem Vercel Dashboard:

```
GOOGLE_PROJECT_ID=ihr-google-project-id
GOOGLE_PRIVATE_KEY_ID=ihre-private-key-id
GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nIhr Private Key\n-----END PRIVATE KEY-----\n
GOOGLE_SERVICE_ACCOUNT_EMAIL=ihr-service-account@projekt.iam.gserviceaccount.com
GOOGLE_CLIENT_ID=ihre-client-id
SPREADSHEET_ID=159BP31mnBsZXyseTP36tBooaeCnVCHSoI3kvrV-UntQ
```

### 2. Google Service Account

1. Gehen Sie zur [Google Cloud Console](https://console.cloud.google.com/)
2. Erstellen Sie ein neues Projekt oder wählen Sie ein bestehendes
3. Aktivieren Sie die Google Sheets API
4. Erstellen Sie einen Service Account
5. Erstellen Sie einen JSON-Key für den Service Account
6. Teilen Sie Ihr Google Sheet mit der Service Account E-Mail

### 3. Deployment

```bash
npm install
vercel --prod
```

## API Verwendung

### Endpoint
```
POST /api/webhook
```

### Request Body
```json
{
  "uuid": "user-uuid-here"
}
```

### Response
```json
{
  "status": "ok",
  "message": "Userboard erfolgreich geladen.",
  "username": "benutzername",
  "commented": "false",
  "liked": "true",
  "story": "false",
  "saved": "true",
  "expTotal": "1500",
  "liveNFTBonus": "0",
  "miningpower": "45.00",
  "expTiktok": "500",
  "expInstagram": "750",
  "expStream": "250",
  "expFacebook": "0",
  "wallet": "0x...",
  "image": "https://example.com/image.jpg"
}
```

## Level Berechnung

Die Level werden basierend auf dem `expTotal` Wert berechnet:

- Level 1: 0-39 EXP
- Level 2: 40-119 EXP
- Level 3: 120-239 EXP
- ... bis Level 50

## Mining Power

Mining Power = Berechnetes Level × globalFactor (aus Google Sheet)

## Entwicklung

```bash
npm run dev
```

Die API läuft dann auf `http://localhost:3000/api/webhook`