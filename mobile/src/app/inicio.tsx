// 06 · Início (provisório): a próxima etapa desenha a tela completa do Figma (saldo, assinatura, atalhos e abas).
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar } from "@/components/Avatar";
import { sessao } from "@/lib/sessao";
import { cor, fonte } from "@/lib/tema";

function saudacao() {
  const h = new Date().getHours();
  return h < 12 ? "Bom dia," : h < 18 ? "Boa tarde," : "Boa noite,";
}

export default function Inicio() {
  return (
    <SafeAreaView style={e.tela} edges={["top"]}>
      <View style={e.topo}>
        <View>
          <Text style={e.oi}>{saudacao()}</Text>
          <Text style={e.nome}>{sessao.nome || "você"}</Text>
        </View>
        <Avatar avatar={sessao.avatar} />
      </View>
      <Text style={e.aviso}>O Início completo chega na próxima etapa.</Text>
    </SafeAreaView>
  );
}

const e = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cor.creme, paddingHorizontal: 22 },
  topo: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 16 },
  oi: { fontFamily: fonte.texto, fontSize: 14, color: cor.suave },
  nome: { fontFamily: fonte.titulo, fontSize: 30, color: cor.texto },
  aviso: { fontFamily: fonte.texto, fontSize: 14, color: cor.suave, marginTop: 40 },
});
