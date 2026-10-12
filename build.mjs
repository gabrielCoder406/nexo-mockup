// Genera index.html: el mockup completo en un solo archivo (sin dependencias externas salvo las fuentes).
import * as esbuild from "esbuild";
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

mkdirSync("dist", { recursive: true });
await esbuild.build({
  entryPoints: ["src/main.jsx"], bundle: true, format: "iife", minify: true, target: "es2019",
  outfile: "dist/app.js", jsx: "transform", charset: "utf8",
  define: { "process.env.NODE_ENV": '"production"' },
});
execSync("npx tailwindcss -c tailwind.config.js -i src/input.css -o dist/tw.css --minify", { stdio: "inherit" });

const js = readFileSync("dist/app.js", "utf8").replace(/<\/script/gi, "<\\/script");
const css = readFileSync("src/tokens.css", "utf8") + "\n" + readFileSync("dist/tw.css", "utf8");
writeFileSync("index.html", `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>NEXO · Plataforma de Ayuda (mockup)</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Public+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap">
<style>
${css}
</style>
</head>
<body style="margin:0">
<div id="root"></div>
<script>
${js}
</script>
</body>
</html>
`);
console.log("index.html generado");
