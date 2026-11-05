// Estado do cadastro enquanto o backend de SMS não existe (fica na memória do app).
// Trocar por Firebase Auth ou Twilio Verify + armazenamento seguro na etapa de integração.
export type Avatar = "gomo" | "laranja" | { uri: string };

export const sessao = {
  logado: false,
  celular: "",
  nome: "",
  avatar: "gomo" as Avatar,
};

// (61) 9 8765-4321
export function formatarCelular(digitos: string) {
  const d = digitos.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 3) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2, 3)} ${d.slice(3)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 3)} ${d.slice(3, 7)}-${d.slice(7)}`;
}
