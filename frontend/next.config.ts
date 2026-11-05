import type { NextConfig } from "next";

const backendUrl = (process.env.BACKEND_URL ?? "http://localhost:4000").replace(/\/$/, "");

const config: NextConfig = {
  async rewrites() {
    return [
      { source: "/api/:path*", destination: `${backendUrl}/api/:path*` },
      // prévia web do app (mobile/, exportado com: npx expo export --platform web --output-dir ../frontend/public/app)
      { source: "/app", destination: "/app/index.html" },
      { source: "/app/:rota", destination: "/app/:rota.html" },
    ];
  },
};

export default config;
