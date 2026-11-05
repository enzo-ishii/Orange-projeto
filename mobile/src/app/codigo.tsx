// 04 · Código SMS: 6 dígitos, preenche sozinho no iPhone e no Android. Vale 5 min, reenviar após 45 s.
// Erro: as caixas ficam vermelhas.
import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { Botao, TelaCadastro } from "@/components/ui";
import { formatarCelular, sessao } from "@/lib/sessao";
import { cor, fonte } from "@/lib/tema";

const ESPERA = 45;

export default function Codigo() {
  const [codigo, setCodigo] = useState("");
  const [erro, setErro] = useState("");
  const [falta, setFalta] = useState(ESPERA);
  const [conferindo, setConferindo] = useState(false);
  const campo = useRef<React.ComponentRef<typeof TextInput>>(null);

  useEffect(() => {
    if (falta <= 0) return;
    const t = setTimeout(() => setFalta(falta - 1), 1000);
    return () => clearTimeout(t);
  }, [falta]);

  const confirmar = (c = codigo) => {
    if (c.length < 6) return;
    setConferindo(true);
    // TODO(integração): conferir o código no backend. Por enquanto, 000000 simula um código errado.
    setTimeout(() => {
      setConferindo(false);
      if (c === "000000") { setErro("Código errado. Confira o SMS e tente de novo."); return; }
      router.push("/nome");
    }, 500);
  };

  const mudar = (t: string) => {
    const d = t.replace(/\D/g, "").slice(0, 6);
    setCodigo(d); setErro("");
    if (d.length === 6) confirmar(d);
  };

  return (
    <TelaCadastro
      titulo="Digite o código"
      texto={`Enviamos 6 números para ${formatarCelular(sessao.celular) || "o seu celular"}.`}
      rodape={<Botao titulo="Confirmar" onPress={() => confirmar()} desativado={codigo.length < 6} carregando={conferindo} />}
    >
      <Pressable accessibilityRole="button" onPress={() => router.back()}><Text style={e.trocar}>Trocar número</Text></Pressable>
      <Pressable style={e.caixas} onPress={() => campo.current?.focus()} accessibilityLabel="Código de 6 números">
        {Array.from({ length: 6 }, (_, i) => {
          const ativa = i === codigo.length && !erro;
          return (
            <View key={i} style={[e.caixa, ativa && e.caixaAtiva, !!erro && e.caixaErro]}>
              <Text style={e.digito}>{codigo[i] ?? ""}</Text>
            </View>
          );
        })}
      </Pressable>
      {/* campo invisível que recebe o teclado e o preenchimento automático do SMS */}
      <TextInput
        ref={campo}
        value={codigo}
        onChangeText={mudar}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        autoFocus
        maxLength={6}
        style={e.oculto}
        caretHidden
      />
      {erro ? <Text style={e.erro} accessibilityRole="alert">{erro}</Text> : null}
      {falta > 0 ? (
        <Text style={e.reenviar}>Reenviar código em 0:{String(falta).padStart(2, "0")}</Text>
      ) : (
        <Pressable accessibilityRole="button" onPress={() => { setFalta(ESPERA); setCodigo(""); setErro(""); }}>
          <Text style={[e.reenviar, e.link]}>Reenviar código</Text>
        </Pressable>
      )}
    </TelaCadastro>
  );
}

const e = StyleSheet.create({
  trocar: { fontFamily: fonte.forte, fontSize: 14, color: cor.laranja, marginTop: 14 },
  caixas: { flexDirection: "row", gap: 8, marginTop: 22 },
  caixa: { flex: 1, aspectRatio: 0.82, maxWidth: 52, borderRadius: 12, backgroundColor: cor.branco, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: "transparent" },
  caixaAtiva: { borderColor: cor.laranja },
  caixaErro: { borderColor: cor.erro, backgroundColor: "#FDECEA" },
  digito: { fontFamily: fonte.titulo, fontSize: 24, color: cor.texto },
  oculto: { position: "absolute", opacity: 0, width: 1, height: 1 },
  erro: { fontFamily: fonte.medio, fontSize: 13, color: cor.erro, marginTop: 12 },
  reenviar: { fontFamily: fonte.texto, fontSize: 14, color: cor.suave, marginTop: 20 },
  link: { color: cor.laranja, fontFamily: fonte.forte },
});
