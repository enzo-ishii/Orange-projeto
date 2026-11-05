// 05 · Nome e foto: nome é obrigatório; foto é opcional (quem não quiser escolhe um dos dois ícones da marca).
import { useState } from "react";
import { Alert, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { Avatar } from "@/components/Avatar";
import { Botao, TelaCadastro } from "@/components/ui";
import { sessao, type Avatar as TipoAvatar } from "@/lib/sessao";
import { cor, fonte } from "@/lib/tema";

export default function Nome() {
  const [nome, setNome] = useState(sessao.nome);
  const [avatar, setAvatar] = useState<TipoAvatar>(sessao.avatar);
  const foto = typeof avatar === "object";

  const pegar = async (camera: boolean) => {
    const opcoes: ImagePicker.ImagePickerOptions = { mediaTypes: ["images"], allowsEditing: true, aspect: [1, 1], quality: 0.8 };
    if (camera) {
      const p = await ImagePicker.requestCameraPermissionsAsync();
      if (!p.granted) return;
    }
    const r = camera ? await ImagePicker.launchCameraAsync(opcoes) : await ImagePicker.launchImageLibraryAsync(opcoes);
    if (!r.canceled && r.assets[0]) setAvatar({ uri: r.assets[0].uri });
  };
  const escolherFoto = () => {
    if (Platform.OS === "web") return void pegar(false);
    Alert.alert("Foto de perfil", undefined, [
      { text: "Tirar foto", onPress: () => void pegar(true) },
      { text: "Escolher da galeria", onPress: () => void pegar(false) },
      { text: "Cancelar", style: "cancel" },
    ]);
  };

  const entrar = () => {
    Object.assign(sessao, { nome: nome.trim(), avatar, logado: true });
    router.dismissAll();
    router.replace("/inicio");
  };

  const Opcao = ({ ativa, rotulo, onPress, children }: { ativa: boolean; rotulo: string; onPress: () => void; children: React.ReactNode }) => (
    <Pressable accessibilityRole="radio" accessibilityState={{ selected: ativa }} onPress={onPress} style={[e.opcao, ativa && e.opcaoAtiva]}>
      {children}
      <Text style={e.opcaoRotulo}>{rotulo}</Text>
    </Pressable>
  );

  return (
    <TelaCadastro
      titulo="Como podemos te chamar?"
      voltar={false}
      rodape={<Botao titulo="Entrar no app" onPress={entrar} desativado={nome.trim().length < 2} />}
    >
      <TextInput
        style={e.input}
        value={nome}
        onChangeText={setNome}
        placeholder="Seu nome"
        placeholderTextColor="#B5ADA3"
        textContentType="givenName"
        autoComplete="name-given"
        autoCapitalize="words"
        autoFocus
        maxLength={40}
        accessibilityLabel="Seu nome"
      />
      <Text style={e.rotulo}>Foto de perfil (opcional)</Text>
      <View style={e.opcoes}>
        <Opcao ativa={foto} rotulo={foto ? "Trocar foto" : "Tirar ou escolher foto"} onPress={escolherFoto}>
          {foto ? <Avatar avatar={avatar} tamanho={54} /> : <View style={e.mais}><Text style={e.maisTexto}>+</Text></View>}
        </Opcao>
        <Opcao ativa={avatar === "gomo"} rotulo="Ícone Gomo" onPress={() => setAvatar("gomo")}><Avatar avatar="gomo" tamanho={54} /></Opcao>
        <Opcao ativa={avatar === "laranja"} rotulo="Ícone Laranja" onPress={() => setAvatar("laranja")}><Avatar avatar="laranja" tamanho={54} /></Opcao>
      </View>
      <Text style={e.dica}>Você pode trocar depois no Perfil.</Text>
    </TelaCadastro>
  );
}

const e = StyleSheet.create({
  input: { backgroundColor: cor.branco, borderRadius: 14, height: 56, paddingHorizontal: 16, fontFamily: fonte.medio, fontSize: 16, color: cor.texto, marginTop: 22, outlineWidth: 0 },
  rotulo: { fontFamily: fonte.forte, fontSize: 14, color: cor.texto, marginTop: 24, marginBottom: 12 },
  opcoes: { flexDirection: "row", gap: 10 },
  opcao: { flex: 1, backgroundColor: cor.branco, borderRadius: 16, paddingVertical: 14, paddingHorizontal: 6, alignItems: "center", gap: 10, borderWidth: 2, borderColor: "transparent" },
  opcaoAtiva: { borderColor: cor.laranja },
  opcaoRotulo: { fontFamily: fonte.medio, fontSize: 11, lineHeight: 14, color: cor.texto, textAlign: "center" },
  mais: { width: 54, height: 54, borderRadius: 27, backgroundColor: "#ECE5DA", alignItems: "center", justifyContent: "center" },
  maisTexto: { fontFamily: fonte.forte, fontSize: 24, color: cor.texto, marginTop: -2 },
  dica: { fontFamily: fonte.texto, fontSize: 12, color: cor.suave, marginTop: 14 },
});
