// 03 · Seu celular: o número é o login. Sem senha. Teclado numérico abre sozinho.
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { Botao, TelaCadastro } from "@/components/ui";
import { formatarCelular, sessao } from "@/lib/sessao";
import { cor, fonte } from "@/lib/tema";

export default function Celular() {
  const [digitos, setDigitos] = useState(sessao.celular);
  const [enviando, setEnviando] = useState(false);
  const valido = digitos.length === 11 && digitos[2] === "9";

  const enviar = () => {
    setEnviando(true);
    sessao.celular = digitos;
    // TODO(integração): pedir o SMS ao backend (Firebase Auth ou Twilio Verify)
    setTimeout(() => { setEnviando(false); router.push("/codigo"); }, 500);
  };

  return (
    <TelaCadastro
      titulo="Qual é o seu celular?"
      texto="Vamos mandar um código por SMS. Sem senha pra decorar."
      rodape={<Botao titulo="Enviar código" onPress={enviar} desativado={!valido} carregando={enviando} />}
    >
      <View style={e.campo}>
        <Text style={e.ddi}>+55</Text>
        <View style={e.divisor} />
        <TextInput
          style={e.input}
          value={formatarCelular(digitos)}
          onChangeText={(t) => setDigitos(t.replace(/\D/g, "").slice(0, 11))}
          placeholder="(61) 9 8765-4321"
          placeholderTextColor="#B5ADA3"
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
          autoComplete="tel-national"
          autoFocus
          returnKeyType="send"
          onSubmitEditing={() => valido && enviar()}
          accessibilityLabel="Número de celular com DDD"
        />
      </View>
      <Text style={e.termos}>Ao continuar, você aceita os Termos de Uso e a Política de Privacidade.</Text>
    </TelaCadastro>
  );
}

const e = StyleSheet.create({
  campo: { flexDirection: "row", alignItems: "center", backgroundColor: cor.branco, borderRadius: 14, height: 56, paddingHorizontal: 16, marginTop: 24 },
  ddi: { fontFamily: fonte.forte, fontSize: 16, color: cor.texto },
  divisor: { width: 1, height: 22, backgroundColor: cor.linha, marginHorizontal: 12 },
  input: { flex: 1, fontFamily: fonte.medio, fontSize: 16, color: cor.texto, height: "100%", outlineWidth: 0 },
  termos: { fontFamily: fonte.texto, fontSize: 12, lineHeight: 17, color: cor.suave, marginTop: 14 },
});
