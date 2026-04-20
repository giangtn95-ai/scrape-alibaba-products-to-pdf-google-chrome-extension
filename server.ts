import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { google } from "googleapis";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.APP_URL}/api/auth/google/callback`
);

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

const getGoogleClient = (req: express.Request) => {
  const configCookie = req.cookies.google_client_config;
  let clientId = process.env.GOOGLE_CLIENT_ID;
  let clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (configCookie) {
    const config = JSON.parse(configCookie);
    clientId = config.clientId;
    clientSecret = config.clientSecret;
  }

  if (!clientId || !clientSecret) return null;

  return new google.auth.OAuth2(
    clientId,
    clientSecret,
    `${process.env.APP_URL}/api/auth/google/callback`
  );
};

// --- OAuth Routes ---

app.post('/api/auth/google/url', (req, res) => {
  const { clientId, clientSecret } = req.body;
  
  if (clientId && clientSecret) {
    res.cookie('google_client_config', JSON.stringify({ clientId, clientSecret }), {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    const client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      `${process.env.APP_URL}/api/auth/google/callback`
    );

    const url = client.generateAuthUrl({ access_type: 'offline', scope: SCOPES, prompt: 'consent' });
    return res.json({ url });
  }

  const client = getGoogleClient(req);
  if (!client) return res.status(400).json({ error: 'Google configuration missing' });
  const url = client.generateAuthUrl({ access_type: 'offline', scope: SCOPES, prompt: 'consent' });
  res.json({ url });
});

app.get('/api/auth/google/url', (req, res) => {
  const client = getGoogleClient(req);
  if (!client) return res.status(400).json({ error: 'Google configuration missing' });
  const url = client.generateAuthUrl({ access_type: 'offline', scope: SCOPES, prompt: 'consent' });
  res.json({ url });
});

app.get('/api/auth/google/callback', async (req, res) => {
  const { code } = req.query;
  try {
    const client = getGoogleClient(req);
    if (!client) throw new Error('Client configuration lost');

    const { tokens } = await client.getToken(code as string);
    res.cookie('google_tokens', JSON.stringify(tokens), {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    res.send(`
      <html>
        <body>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'GOOGLE_AUTH_SUCCESS' }, '*');
              window.close();
            } else {
              window.location.href = '/';
            }
          </script>
          <p>Google Drive connected! You can close this window.</p>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('OAuth error:', error);
    res.status(500).send('Authentication failed');
  }
});

app.get('/api/auth/google/status', (req, res) => {
  const tokens = req.cookies.google_tokens;
  const hasConfig = !!(process.env.GOOGLE_CLIENT_ID || req.cookies.google_client_config);
  res.json({ connected: !!tokens, hasConfig });
});

app.post('/api/auth/google/logout', (req, res) => {
  res.clearCookie('google_tokens');
  res.clearCookie('google_client_config');
  res.json({ success: true });
});

// --- Drive routes ---

app.post('/api/drive/upload', async (req, res) => {
  const tokens = req.cookies.google_tokens;
  if (!tokens) return res.status(401).json({ error: 'Not connected to Google Drive' });

  const { filename, content, mimeType } = req.body;
  
  try {
    const client = getGoogleClient(req);
    if (!client) throw new Error('Client configuration missing');

    client.setCredentials(JSON.parse(tokens));
    const drive = google.drive({ version: 'v3', auth: client });

    const fileMetadata = {
      name: filename || 'Alibaba_Sourcing_Report.json',
      mimeType: mimeType || 'application/json'
    };

    const media = {
      mimeType: mimeType || 'application/json',
      body: content
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, webViewLink'
    });

    res.json({ success: true, fileId: response.data.id, link: response.data.webViewLink });
  } catch (error: any) {
    console.error('Drive upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

// --- Vite integration ---

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
