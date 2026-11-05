import Svg, { Circle, Path } from "react-native-svg";

// Gomo, o mascote: a laranja da logo com carinha.
export function Gomo({ tamanho = 160, fundo = "#FF6A00" }: { tamanho?: number; fundo?: string }) {
  return (
    <Svg width={tamanho} height={tamanho} viewBox="0 0 200 200">
      <Circle cx="100" cy="112" r="74" fill={fundo} stroke="#1A1410" strokeWidth="14" />
      <Path d="M58 92 C62 74 74 62 90 56" stroke="#FFF4E6" strokeWidth="10" strokeLinecap="round" fill="none" />
      <Path d="M104 40 C104 30 102 24 98 18" stroke="#1A1410" strokeWidth="10" strokeLinecap="round" fill="none" />
      <Path d="M108 34 C118 12 140 6 158 10 C152 30 132 42 108 34 Z" fill="#1A1410" />
      <Circle cx="84" cy="112" r="7" fill="#1A1410" />
      <Circle cx="118" cy="112" r="7" fill="#1A1410" />
      <Path d="M86 134 Q101 146 116 134" stroke="#1A1410" strokeWidth="7" strokeLinecap="round" fill="none" />
    </Svg>
  );
}
