// 01 · Abertura: logo animada por 2 s. Com sessão salva, vai direto pro Início.
import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LogoOrange } from "@/components/LogoOrange";
import { sessao } from "@/lib/sessao";
import { cor, fonte } from "@/lib/tema";

export default function Abertura() {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(v, { toValue: 1, duration: 900, easing: Easing.out(Easing.back(1.6)), useNativeDriver: true }).start();
    const t = setTimeout(() => router.replace(sessao.logado ? "/inicio" : "/boas-vindas"), 2000);
    return () => clearTimeout(t);
  }, [v]);
  const escala = v.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] });
  const rot = v.interpolate({ inputRange: [0, 1], outputRange: ["-25deg", "0deg"] });
  return (
    <View style={e.tela}>
      <StatusBar style="dark" />
      <View style={e.centro}>
        <Animated.View style={{ opacity: v, transform: [{ scale: escala }, { rotate: rot }] }}>
          <LogoOrange altura={128} />
        </Animated.View>
        <Animated.View style={{ opacity: v, alignItems: "center" }}>
          <Text style={e.marca}>Orange.</Text>
          <Text style={e.sub}>suco de laranja 100% natural</Text>
        </Animated.View>
      </View>
      <Text style={e.local}>Brasília · DF</Text>
    </View>
  );
}

const e = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cor.laranja, alignItems: "center", justifyContent: "center" },
  centro: { alignItems: "center", gap: 18 },
  marca: { fontFamily: fonte.titulo, fontSize: 52, color: cor.texto, letterSpacing: -1 },
  sub: { fontFamily: fonte.medio, fontSize: 14, color: cor.texto, marginTop: 4 },
  local: { position: "absolute", bottom: 48, fontFamily: fonte.medio, fontSize: 12, color: "rgba(26,20,16,.6)" },
});
