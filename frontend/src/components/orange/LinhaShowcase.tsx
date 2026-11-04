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

  useEffect(() => {
    if (!canvasRef.current) return;
    try {
      linhaRef.current = iniciarLinha(canvasRef.current, { produto: "copo", cor: "preto", aoMiniaturas: setAngulos, aoMudarAngulo: setAngulo });
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
      <div className="founders-destaque">
        <span className="founders-selo">Founders Edition · 0001 – 1000</span>
        <h3>A primeira edição é numerada.<br /><span>E só existem mil.</span></h3>
        <p>O copo e a garrafa da primeira leva saem só em preto, com o número de cada fundador gravado. Quem entra primeiro mantém o benefício enquanto a assinatura estiver ativa.</p>
        <ul>
          <li><b>Numerada</b><span>De 0001 a 1000, gravada a laser</span></li>
          <li><b>Primeiro a provar</b><span>Sabores e edições novas antes de todo mundo</span></li>
          <li><b>Não volta</b><span>Quando acabar, acabou</span></li>
        </ul>
        <a className="button button-dark" href={`mailto:oi@orange.com.br?subject=${encodeURIComponent("Quero entrar na lista da Founders Edition")}`}>Entrar na lista de espera</a>
      </div>
    </div>
  );
}
