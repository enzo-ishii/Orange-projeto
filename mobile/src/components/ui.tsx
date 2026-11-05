import type { ReactNode } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { cor, fonte } from "@/lib/tema";

// Botão principal (laranja) e secundário (só texto), como no Figma.
export function Botao({ titulo, onPress, desativado, carregando, variante = "principal" }: {
  titulo: string; onPress: () => void; desativado?: boolean; carregando?: boolean; variante?: "principal" | "texto";
}) {
  const texto = variante === "texto";
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!desativado }}
      disabled={desativado || carregando}
      onPress={onPress}
      style={({ pressed }) => [s.botao, texto && s.botaoTexto, (desativado && !texto) && s.botaoOff, pressed && { opacity: 0.85, transform: [{ scale: 0.99 }] }]}
    >
      {carregando ? <ActivityIndicator color={cor.texto} /> : <Text style={s.botaoRotulo}>{titulo}</Text>}
    </Pressable>
  );
}

// Tela do cadastro: Voltar, título grande, texto e o botão preso embaixo (sobe com o teclado).
export function TelaCadastro({ titulo, texto, children, rodape, voltar = true }: {
  titulo: string; texto?: ReactNode; children?: ReactNode; rodape: ReactNode; voltar?: boolean;
}) {
  return (
    <SafeAreaView style={s.tela} edges={["top", "bottom"]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={s.conteudo}>
          {voltar && (
            <Pressable accessibilityRole="button" hitSlop={12} onPress={() => (router.canGoBack() ? router.back() : router.replace("/boas-vindas"))}>
              <Text style={s.voltar}>‹ Voltar</Text>
            </Pressable>
          )}
          <Text style={s.titulo} accessibilityRole="header">{titulo}</Text>
          {texto ? <Text style={s.texto}>{texto}</Text> : null}
          {children}
        </View>
        <View style={s.rodape}>{rodape}</View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export function Cartao({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[s.cartao, style]}>{children}</View>;
}

export const s = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cor.creme },
  conteudo: { flex: 1, paddingHorizontal: 22, paddingTop: 12 },
  rodape: { paddingHorizontal: 22, paddingBottom: 12, gap: 6 },
  voltar: { fontFamily: fonte.forte, fontSize: 14, color: cor.texto, paddingVertical: 6 },
  titulo: { fontFamily: fonte.titulo, fontSize: 32, lineHeight: 36, color: cor.texto, marginTop: 14, letterSpacing: -0.5 },
  texto: { fontFamily: fonte.texto, fontSize: 15, lineHeight: 22, color: cor.suave, marginTop: 12 },
  botao: { height: 54, borderRadius: 27, backgroundColor: cor.laranja, alignItems: "center", justifyContent: "center" },
  botaoTexto: { backgroundColor: "transparent", height: 44 },
  botaoOff: { opacity: 0.45 },
  botaoRotulo: { fontFamily: fonte.forte, fontSize: 15, color: cor.texto },
  cartao: { backgroundColor: cor.branco, borderRadius: 16 },
});
