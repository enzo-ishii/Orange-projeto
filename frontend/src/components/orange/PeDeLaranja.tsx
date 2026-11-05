// Pé de laranja que cresce e floresce quando entra na tela (classe is-revealed do revelar ao rolar).
// Tronco se desenha, a copa abre, as flores brotam e viram laranjas. Com "reduzir movimento", aparece pronto.
const FOLHAS: [number, number, number][] = [
  [150, 128, 62], [98, 150, 44], [202, 150, 44], [120, 98, 40], [182, 100, 40], [150, 78, 36], [84, 186, 30], [216, 186, 30],
];
const FRUTOS: [number, number][] = [[112, 150], [186, 132], [150, 104], [208, 178], [92, 182], [160, 170]];
const FLORES: [number, number][] = [[132, 84], [176, 74], [118, 124], [196, 104], [140, 152], [230, 160], [70, 166]];

export default function PeDeLaranja() {
  return (
    <div className="pe-laranja" data-reveal aria-hidden="true">
      <svg viewBox="0 0 300 340" role="presentation">
        <ellipse className="pe-chao" cx="150" cy="318" rx="92" ry="10" />
        <path className="pe-tronco" d="M150 318 C148 280 154 252 150 214 M150 252 C134 238 120 226 106 200 M151 236 C168 222 184 210 196 188" />
        <g className="pe-copa">
          {FOLHAS.map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} style={{ ["--i" as string]: i, transformOrigin: `${x}px ${y}px` }} />
          ))}
        </g>
        <g className="pe-flores">
          {FLORES.map(([x, y], i) => (
            <g key={i} style={{ ["--i" as string]: i, transformOrigin: `${x}px ${y}px` }}>
              {[0, 72, 144, 216, 288].map((a) => (
                <ellipse key={a} cx={x} cy={y - 5} rx="3.2" ry="5" transform={`rotate(${a} ${x} ${y})`} />
              ))}
              <circle cx={x} cy={y} r="2.4" />
            </g>
          ))}
        </g>
        <g className="pe-frutos">
          {FRUTOS.map(([x, y], i) => (
            <g key={i} style={{ ["--i" as string]: i, transformOrigin: `${x}px ${y - 9}px` }}>
              <circle cx={x} cy={y} r="11" />
              <circle className="pe-brilho" cx={x - 4} cy={y - 4} r="3" />
              <path d={`M${x} ${y - 11} q4 -6 10 -5 q-3 5 -10 5`} />
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
