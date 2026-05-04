// app/_layout.tsx
import { AuthProvider } from "@/contexts/AuthContext";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import '../global.css';

export default function RootLayout() {
  const scheme = useColorScheme();

  return (
    <AuthProvider>
      <ThemeProvider value={scheme === "dark" ? DarkTheme : DefaultTheme}>

        <Stack screenOptions={{ headerShown: false }}>

          <Stack.Screen name="(tabs)" />

          <Stack.Protected guard={__DEV__}>
            <Stack.Screen name="storybook" />
          </Stack.Protected>

        </Stack>
        
      </ThemeProvider>
    </AuthProvider>
  );
}