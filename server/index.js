const path = require("path");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

// Send some boilerplate HTML for the root route to verify the server is running.
app.get("/", (_req, res) => {
  res.send(`
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>kivu-web</title>
        <style>
          :root {
            --bg: #0f172a;
            --card: #1b2536;
            --border: #2b3548;
            --text: #e6ebf4;
            --muted: #93a1b8;
            --accent: #4ade80;
          }
          * { box-sizing: border-box; }
          body {
            margin: 0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
            background: var(--bg);
            color: var(--text);
            font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          }
          .card {
            width: 100%;
            max-width: 420px;
            padding: 32px;
            border: 1px solid var(--border);
            border-radius: 12px;
            background: var(--card);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
            text-align: center;
          }
          h1 {
            margin: 0 0 8px;
            font-size: 1.6rem;
            letter-spacing: -0.01em;
          }
          p {
            margin: 0;
            color: var(--muted);
            font-size: 0.95rem;
          }
          .status {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 16px;
            padding: 4px 10px;
            border-radius: 999px;
            background: rgba(74, 222, 128, 0.12);
            color: var(--accent);
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.08em;
          }
          .dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: var(--accent);
          }
          code {
            padding: 1px 5px;
            border-radius: 4px;
            background: rgba(255, 255, 255, 0.06);
            font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          }
        </style>
      </head>
      <body>
        <main class="card">
          <span class="status"><span class="dot"></span>Online</span>
          <h1>Welcome to kivu-web</h1>
          <p>This is a simple React app. Nothing special here.</p>
          <p>Check out the <code>/health</code> endpoint for a health check.</p>
        
        </main>
      </body>
    </html>
  `);
});

// Health check used by the ALB target group (/health -> 200).
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

// Serve the compiled React build.
const publicDir = path.join(__dirname, "public");
app.use(express.static(publicDir));

// SPA fallback so client-side routes resolve to index.html.
app.get("*", (_req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

app.listen(PORT, () => {
  console.log(`kivu-web listening on port ${PORT}`);
});
