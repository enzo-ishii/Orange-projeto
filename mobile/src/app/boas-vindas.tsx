// 02 · Boas-vindas: 3 telas que deslizam (cashback, assine e receba, devolva e ganhe). Pular no topo.
import { useRef, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Gomo } from "@/components/Gomo";
import { Botao } from "@/components/ui";
import { cor, fonte } from "@/lib/tema";

const SLIDES = [
  { titulo: "Cada garrafa volta pra você.", texto: "Ganhe cashback em toda compra, assine e receba em casa, e devolva a garrafa pra ganhar mais." },
  { titulo: "Assine e receba gelado.", texto: "Suco feito no dia, entregue gelado em Brasília no dia que você escolher." },
  { titulo: "Devolva e ganhe.", texto: "Garrafa vazia volta com o entregador ou num ponto de coleta, e o valor cai no seu saldo." },
];

export default function BoasVindas() {
  const { width } = useWindowDimensions();
  const [atual, setAtual] = useState(0);
  const lista = useRef<FlatList>(null);
  const largura = width - 44;
  const ultimo = atual === SLIDES.length - 1;
  const seguir = () => (ultimo ? router.push("/celular") : lista.current?.scrollToIndex({ index: atual + 1 }));

  return (
    <SafeAreaView style={e.tela} edges={["top", "bottom"]}>
      <View style={e.topo}>
        {!ultimo && <Pressable accessibilityRole="button" hitSlop={12} onPress={() => router.push("/celular")}><Text style={e.pular}>Pular</Text></Pressable>}
      </View>
      <FlatList
        ref={lista}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => String(i)}
        getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
        onMomentumScrollEnd={(ev) => setAtual(Math.round(ev.nativeEvent.contentOffset.x / width))}
        renderItem={({ item, index }) => (
          <View style={{ width, paddingHorizontal: 22 }}>
            <View style={[e.arte, { height: largura * 0.92 }]}><Gomo tamanho={largura * 0.55} fundo={index === 1 ? "#FFB347" : cor.laranja} /></View>
            <Text style={e.titulo}>{item.titulo}</Text>
            <Text style={e.texto}>{item.texto}</Text>
          </View>
        )}
      />
      <View style={e.pontos} accessibilityLabel={`Tela ${atual + 1} de ${SLIDES.length}`}>
        {SLIDES.map((_, i) => <View key={i} style={[e.ponto, i === atual && e.pontoAtivo]} />)}
      </View>
      <View style={e.rodape}>
        <Botao titulo={ultimo ? "Começar" : "Continuar"} onPress={seguir} />
        <Botao variante="texto" titulo="Já tenho conta" onPress={() => router.push("/celular")} />
      </View>
    </SafeAreaView>
  );
}

const e = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cor.creme },
  topo: { height: 40, alignItems: "flex-end", justifyContent: "center", paddingHorizontal: 22 },
  pular: { fontFamily: fonte.forte, fontSize: 14, color: cor.suave },
  arte: { backgroundColor: cor.laranja, borderRadius: 24, alignItems: "center", justifyContent: "center", marginTop: 8 },
  titulo: { fontFamily: fonte.titulo, fontSize: 30, lineHeight: 34, color: cor.texto, marginTop: 24, letterSpacing: -0.5 },
  texto: { fontFamily: fonte.texto, fontSize: 15, lineHeight: 22, color: cor.suave, marginTop: 12 },
  pontos: { flexDirection: "row", gap: 6, paddingHorizontal: 22, marginBottom: 18 },
  ponto: { width: 6, height: 6, borderRadius: 3, backgroundColor: cor.linha },
  pontoAtivo: { width: 22, backgroundColor: cor.laranja },
  rodape: { paddingHorizontal: 22, paddingBottom: 12, gap: 6 },
});
