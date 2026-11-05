import Svg, { Path } from "react-native-svg";
import { LOGO_ALTURA, LOGO_LARGURA, LOGO_PATHS } from "@/lib/logo-paths";

export function LogoOrange({ altura = 120, cor = "#1A1410" }: { altura?: number; cor?: string }) {
  return (
    <Svg width={(altura * LOGO_LARGURA) / LOGO_ALTURA} height={altura} viewBox={`0 0 ${LOGO_LARGURA} ${LOGO_ALTURA}`}>
      {LOGO_PATHS.map((d, i) => <Path key={i} d={d} fill={cor} />)}
    </Svg>
  );
}
