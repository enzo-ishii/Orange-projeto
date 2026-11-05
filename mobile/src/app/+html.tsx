// HTML da versão web: deixa o app instalável na tela de início (abre em tela cheia, com ícone da Orange).
import { ScrollViewStyleReset } from "expo-router/html";
import type { PropsWithChildren } from "react";

export default function Html({ children }: PropsWithChildren) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, shrink-to-fit=no" />
        <title>Orange</title>
        <meta name="theme-color" content="#FF6A00" />
        <link rel="manifest" href="/app/manifest.json" />
        <link rel="apple-touch-icon" href="/app/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Orange" />
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: "body{background-color:#F4EFE7;overscroll-behavior:none}" }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
