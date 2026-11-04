"use client";

// Copo e garrafa Orange em 3D, como página de produto: miniaturas dos ângulos, zoom, abas e cores.
// No page.tsx, importe com dynamic(() => import(...), { ssr: false }): o WebGL só existe no navegador.
import { useEffect, useRef, useState } from "react";
import { CORES, PRODUTOS, iniciarLinha, type CorLinha, type Linha3D, type Miniatura, type ProdutoLinha } from "@/lib/linha-3d";

const AMOSTRAS: Record<CorLinha, string> = { preto: "#141414", prata: "linear-gradient(135deg,#E2E4E6,#9A9EA3)", osso: "#EDE6D9", laranja: "#C1440E" };

export default function LinhaShowcase() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const linhaRef = useRef<Linha3D | null>(null);
  const [produto, setProduto] = useState<ProdutoLinha>("copo");
  const [cor, setCor] = useState<CorLinha>("preto");
  const [miniaturas, setMiniaturas] = useState<Miniatura[]>([]);
  const [angulo, setAngulo] = useState(0);
  const [falhou, setFalhou] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;
    try {
      linhaRef.current = iniciarLinha(canvasRef.current, { produto: "copo", cor: "preto", aoMiniaturas: setMiniaturas, aoMudarAngulo: setAngulo });
    } catch {
      setFalhou(true);
    }
    return () => { linhaRef.current?.destruir(); linhaRef.current = null; };
  }, []);

  if (falhou) return null;
  const P = PRODUTOS[produto];

  return (
    <div className="linha-3d">
      <div className="linha-thumbs" role="group" aria-label="Ângulos">
        {miniaturas.map((m, i) => (
          <button key={m.nome} type="button" aria-label={m.nome} title={m.nome} aria-pressed={angulo === i}
            style={{ backgroundImage: m.img ? `url(${m.img})` : undefined }} onClick={() => linhaRef.current?.irPara(i)} />
        ))}
      </div>
      <div className="linha-palco">
        <canvas ref={canvasRef} tabIndex={0} aria-label={`${P.titulo} em 3D. Arraste para girar.`} />
        <div className="linha-zoom">
          <button type="button" aria-label="Aproximar" onClick={() => linhaRef.current?.zoom(0.8)}>+</button>
          <button type="button" aria-label="Afastar" onClick={() => linhaRef.current?.zoom(1.25)}>−</button>
        </div>
      </div>
      <div className="linha-info">
        <fieldset className="linha-abas">
          <legend className="sr-only">Produto</legend>
          {(["copo", "garrafa"] as const).map((p) => (
            <label key={p}><input type="radio" name="linha-produto" checked={produto === p} onChange={() => { setProduto(p); linhaRef.current?.produto(p); }} />{p === "copo" ? "Copo" : "Garrafa"}</label>
          ))}
        </fieldset>
        <h3>{P.titulo}</h3>
        <p>{P.lead}</p>
        <fieldset className="linha-cores">
          <legend>Cor: <b>{CORES[cor].nome}</b></legend>
          <div>
            {(Object.keys(AMOSTRAS) as CorLinha[]).map((c) => (
              <label key={c} style={{ background: AMOSTRAS[c] }}>
                <input type="radio" name="linha-cor" aria-label={CORES[c].nome} checked={cor === c} onChange={() => { setCor(c); linhaRef.current?.cor(c); }} />
              </label>
            ))}
          </div>
        </fieldset>
        <ul className="linha-specs">{P.specs.map(([a, b]) => <li key={a}><span>{a}</span><span>{b}</span></li>)}</ul>
      </div>
    </div>
  );
}
