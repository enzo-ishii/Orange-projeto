// Gera a prévia web do app em ../frontend/public/app (servida pelo site em /app) e deixa ela instalável:
// manifesto, ícone da Orange e tela cheia no iPhone e no Mac (Adicionar ao Dock).
// Uso: npm run web:previa
import { execSync } from "node:child_process";
import { readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const saida = "../frontend/public/app";
rmSync(saida, { recursive: true, force: true });
execSync(`npx expo export --platform web --output-dir ${saida}`, { stdio: "inherit", env: { ...process.env, CI: "1" } });

const tags = [
  '<meta name="theme-color" content="#FF6A00"/>',
  '<link rel="manifest" href="/app/manifest.json"/>',
  '<link rel="apple-touch-icon" href="/app/apple-touch-icon.png"/>',
  '<meta name="apple-mobile-web-app-capable" content="yes"/>',
  '<meta name="mobile-web-app-capable" content="yes"/>',
  '<meta name="apple-mobile-web-app-title" content="Orange"/>',
  "<style>body{background-color:#F4EFE7;overscroll-behavior:none}</style>",
].join("");

for (const nome of readdirSync(saida).filter((n) => n.endsWith(".html"))) {
  const arq = join(saida, nome);
  let html = readFileSync(arq, "utf8");
  if (!html.includes("<script")) throw new Error(`${nome} saiu sem scripts`);
  html = html.replace('lang="en"', 'lang="pt-BR"').replace("</head>", `${tags}</head>`);
  writeFileSync(arq, html);
}
console.log("prévia web pronta em", saida);
