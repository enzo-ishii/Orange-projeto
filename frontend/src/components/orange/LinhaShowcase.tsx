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
  const [numero, setNumero] = useState(427);
  const [digitado, setDigitado] = useState("427");

  const escolherNumero = (texto: string) => {
    setDigitado(texto);
    const n = Math.round(Number(texto));
    if (n >= 1 && n <= 1000) { setNumero(n); linhaRef.current?.numero(n); }
  };
  const numeroTexto = String(numero).padStart(4, "0");

  useEffect(() => {
    if (!canvasRef.current) return;
    try {
      linhaRef.current = iniciarLinha(canvasRef.current, { produto: "copo", cor: "preto", numero: 427, aoMiniaturas: setAngulos, aoMudarAngulo: setAngulo });
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
          <label htmlFor="founders-numero">
            Escolha um número de 1 a 1000
            <input id="founders-numero" type="number" min={1} max={1000} inputMode="numeric" value={digitado}
              onChange={(e) => escolherNumero(e.target.value)} />
          </label>
        </div>
        <div className="founders-texto">
          <h3>Mil números. Um deles é seu.</h3>
          <p>O copo e a garrafa da primeira leva saem só em preto, com o número de cada fundador gravado a laser no inox, logo abaixo do logo. Quem entra primeiro mantém os benefícios enquanto a assinatura estiver ativa.</p>
          <dl>
            <div><dt>Numerada</dt><dd>De 0001 a 1000. Cada número existe uma vez só.</dd></div>
            <div><dt>Primeiro a provar</dt><dd>Sabores e edições novas chegam antes para quem é fundador.</dd></div>
            <div><dt>Não volta</dt><dd>Quando o milésimo número sair, a edição fecha.</dd></div>
          </dl>
          <a className="button button-dark founders-acao"
            href={`mailto:oi@orange.com.br?subject=${encodeURIComponent(`Quero o número ${numeroTexto} da Founders Edition`)}&body=${encodeURIComponent(`Oi! Quero entrar na lista de espera da Founders Edition. Se ainda estiver livre, quero o número ${numeroTexto}.`)}`}>
            Quero o número {numeroTexto}
          </a>
        </div>
      </div>
    </div>
  );
}
