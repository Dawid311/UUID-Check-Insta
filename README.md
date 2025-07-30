# UUID Check API

Minimal-Setup für Vercel-Deployment:

- API-Handler: /api/webhook.js
- package.json mit googleapis als Dependency
- Alle Umgebungsvariablen (GOOGLE_PROJECT_ID, GOOGLE_PRIVATE_KEY_ID, GOOGLE_PRIVATE_KEY, GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_CLIENT_ID, SPREADSHEET_ID) im Vercel Dashboard setzen!

Deployment:
1. Projekt zu Vercel pushen
2. Umgebungsvariablen im Dashboard eintragen
3. POST-Anfragen an /api/webhook

Beispiel curl:

curl -X POST https://<dein-vercel-projekt>.vercel.app/api/webhook \
  -H "Content-Type: application/json" \
  -d '{"uuid":"test-uuid-123"}'
