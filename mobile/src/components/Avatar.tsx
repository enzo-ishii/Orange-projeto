import { Image, StyleSheet, View } from "react-native";
import { Gomo } from "@/components/Gomo";
import { LogoOrange } from "@/components/LogoOrange";
import type { Avatar as TipoAvatar } from "@/lib/sessao";
import { cor } from "@/lib/tema";

// Foto da pessoa ou um dos dois ícones da marca (Gomo ou Laranja)
export function Avatar({ avatar, tamanho = 44 }: { avatar: TipoAvatar; tamanho?: number }) {
  const base = { width: tamanho, height: tamanho, borderRadius: tamanho / 2 };
  if (typeof avatar === "object") return <Image source={{ uri: avatar.uri }} style={base} accessibilityIgnoresInvertColors />;
  return (
    <View style={[base, e.fundo, avatar === "laranja" && { backgroundColor: "#F3E3D3" }]}>
      {avatar === "gomo" ? <Gomo tamanho={tamanho * 0.86} /> : <LogoOrange altura={tamanho * 0.6} />}
    </View>
  );
}

const e = StyleSheet.create({ fundo: { alignItems: "center", justifyContent: "center", backgroundColor: cor.laranja, overflow: "hidden" } });
