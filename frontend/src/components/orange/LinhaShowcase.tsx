"use client";

// Copo e garrafa Orange em 3D (por enquanto só na cor preta), sobre o fundo do site,
// com uma barra para trocar de produto, mudar o ângulo e dar zoom.
// No page.tsx, importe com dynamic(() => import(...), { ssr: false }): o WebGL só existe no navegador.
import { useEffect, useRef, useState } from "react";
import { PRODUTOS, iniciarLinha, type Linha3D, type Miniatura, type ProdutoLinha } from "@/lib/linha-3d";

export default function LinhaShowcase() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const linhaRef = useRef<Linha3D | null>(null);
  const [produto, setProduto] = useState<ProdutoLinha>("copo");
  const [angulos, setAngulos] = useState<Miniatura[]>([]);
  const [angulo, setAngulo] = useState(0);
  const [falhou, setFalhou] = useState(false);
  // Os números saem pela ordem de compra. Quantos já foram vendidos vem da variável NEXT_PUBLIC_FOUNDERS_VENDIDOS.
  const vendidos = Math.min(1000, Math.max(0, Number(process.env.NEXT_PUBLIC_FOUNDERS_VENDIDOS) || 0));
  const esgotado = vendidos >= 1000;
  const numero = esgotado ? 1000 : vendidos + 1;
  const numeroTexto = String(numero).padStart(4, "0");

  useEffect(() => {
    if (!canvasRef.current) return;
    try {
      linhaRef.current = iniciarLinha(canvasRef.current, { produto: "copo", cor: "preto", numero, aoMiniaturas: setAngulos, aoMudarAngulo: setAngulo });
    } catch {
      setFalhou(true);
    }
    return () => { linhaRef.current?.destruir(); linhaRef.current = null; };
  }, []);

  if (falhou) return null;
  const P = PRODUTOS[produto]; // usado no rótulo do canvas

  return (
    <div className="linha-3d">
      <div className="linha-palco">
        <canvas ref={canvasRef} tabIndex={0} aria-label={`${P.titulo} em 3D. Arraste para girar.`} />
      </div>
      <nav className="linha-barra" aria-label="Controles do 3D">
        <div className="linha-grupo" role="group" aria-label="Produto">
          {(["copo", "garrafa"] as const).map((p) => (
            <button key={p} type="button" aria-pressed={produto === p} onClick={() => { setProduto(p); linhaRef.current?.produto(p); }}>
              {p === "copo" ? "Copo" : "Garrafa"}
            </button>
          ))}
        </div>
        <span className="linha-divisor" aria-hidden="true" />
        <div className="linha-grupo" role="group" aria-label="Ângulo">
          {angulos.map((a, i) => (
            <button key={a.nome} type="button" aria-pressed={angulo === i} onClick={() => linhaRef.current?.irPara(i)}>{a.nome}</button>
          ))}
        </div>
        <span className="linha-divisor" aria-hidden="true" />
        <div className="linha-grupo" role="group" aria-label="Zoom">
          <button type="button" aria-label="Afastar" onClick={() => linhaRef.current?.zoom(1.25)}>−</button>
          <button type="button" aria-label="Aproximar" onClick={() => linhaRef.current?.zoom(0.8)}>+</button>
        </div>
      </nav>
      {/* Founders Edition: o número é o protagonista. O que a pessoa digita aparece gravado no copo e na garrafa acima. */}
      <div className="founders-edicao">
        <div className="founders-numero">
          <p className="founders-algarismos" aria-live="polite"><span className="sr-only">Número </span>{numeroTexto}</p>
          <p className="founders-status">
            {esgotado ? "Os mil números já têm dono. A edição fechou." : `Próximo número livre. ${vendidos} de 1000 já têm dono.`}
          </p>
        </div>
        <div className="founders-texto">
          <h3>Mil números. Um deles é seu.</h3>
          <p>O copo e a garrafa da primeira leva saem só em preto, com o número de cada fundador gravado a laser no inox, logo abaixo do logo. O número segue a ordem de compra: quem garante primeiro fica com o menor. Quem entra mantém os benefícios enquanto a assinatura estiver ativa.</p>
          <dl>
            <div><dt>Numerada</dt><dd>De 0001 a 1000. Cada número existe uma vez só.</dd></div>
            <div><dt>Primeiro a provar</dt><dd>Sabores e edições novas chegam antes para quem é fundador.</dd></div>
            <div><dt>Não volta</dt><dd>Quando o milésimo número sair, a edição fecha.</dd></div>
          </dl>
          <a className="button button-dark founders-acao"
            href={`mailto:oi@orange.com.br?subject=${encodeURIComponent(`Founders Edition: quero garantir o número ${numeroTexto}`)}&body=${encodeURIComponent(`Oi! Quero entrar na lista de espera da Founders Edition. Quero garantir o próximo número livre (hoje, o ${numeroTexto}).`)}`}>
            {esgotado ? "Entrar na lista para a próxima edição" : `Garantir o número ${numeroTexto}`}
          </a>
        </div>
      </div>
    </div>
  );
}
