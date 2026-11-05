import { useEffect } from "react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useFonts, Fraunces_900Black } from "@expo-google-fonts/fraunces";
import { DMSans_400Regular, DMSans_500Medium, DMSans_700Bold } from "@expo-google-fonts/dm-sans";
import { cor } from "@/lib/tema";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function Layout() {
  const [prontas, erro] = useFonts({ Fraunces_900Black, DMSans_400Regular, DMSans_500Medium, DMSans_700Bold });
  useEffect(() => { if (prontas || erro) SplashScreen.hideAsync().catch(() => {}); }, [prontas, erro]);
  if (!prontas && !erro) return null;
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: cor.creme }, animation: "slide_from_right" }}>
        <Stack.Screen name="index" options={{ animation: "fade" }} />
        <Stack.Screen name="boas-vindas" options={{ animation: "fade" }} />
        <Stack.Screen name="inicio" options={{ animation: "fade", gestureEnabled: false }} />
      </Stack>
    </>
  );
}
