const path = require("path");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

// Send some boilerplate HTML for the root route to verify the server is running.
app.get("/", (_req, res) => {
  res.send(`
    <html>
      <head>
        <title>kivu-web</title>
      </head>
      <body>
        <h1>Welcome to kivu-web</h1>
        <p>Server is running on port ${PORT}</p>
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
