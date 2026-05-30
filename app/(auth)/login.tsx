import { Colors, Radius, Shadow } from "@/constants/theme";
import { AuthContext } from "@/contexts/AuthContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { loginFirebase } from "@/services/auth/authServices";
import { useRouter } from "expo-router";
import { useContext, useRef, useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const C = Colors[colorScheme ?? "light"];
  const router = useRouter();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const passwordRef = useRef<TextInput>(null);

  const validate = (): boolean => {
    let ok = true;
    if (!email.trim()) {
      setEmailError("Email is required.");
      ok = false;
    } else if (!EMAIL_REGEX.test(email)) {
      setEmailError("Enter a valid email address.");
      ok = false;
    } else {
      setEmailError(null);
    }

    if (!password) {
      setPasswordError("Password is required.");
      ok = false;
    } else if (password.length < 6) {
      setPasswordError("At least 6 characters.");
      ok = false;
    } else {
      setPasswordError(null);
    }
    return ok;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setError(null);
    setLoading(true);
    try {
      const token = await loginFirebase(email, password);
      await login(null, token);
    } catch (err: any) {
      setError(err.message ?? "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: C.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          paddingHorizontal: 24,
          paddingVertical: 48,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={{ marginBottom: 40 }}>
          <Text
            style={{
              fontSize: 13,
              fontWeight: "600",
              color: C.tint,
              letterSpacing: 1.4,
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            A00573055 Todo app
          </Text>
          <Text
            style={{
              fontSize: 32,
              fontWeight: "800",
              color: C.text,
              letterSpacing: -0.5,
              lineHeight: 38,
            }}
          >
            Welcome back
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: C.textSecondary,
              marginTop: 6,
              lineHeight: 22,
            }}
          >
            Sign in to continue to your atelier.
          </Text>
        </View>

        <View
          style={{
            backgroundColor: C.surface,
            borderRadius: Radius.lg,
            padding: 20,
            ...Shadow.card,
            gap: 16,
          }}
        >
          <View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
              <Text style={{ fontSize: 13, fontWeight: "600", color: C.textSecondary, letterSpacing: 0.4 }}>
                Email
              </Text>
              {emailError && (
                <Text style={{ fontSize: 12, color: C.red }}>{emailError}</Text>
              )}
            </View>
            <TextInput
              value={email}
              onChangeText={(v) => { setEmail(v); if (emailError) setEmailError(null); if (error) setError(null); }}
              placeholder="you@example.com"
              placeholderTextColor={C.textSecondary}
              autoCapitalize="none"
              keyboardType="email-address"
              textContentType="emailAddress"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
              style={{
                backgroundColor: C.surfaceAlt,
                borderRadius: Radius.md,
                paddingHorizontal: 14,
                paddingVertical: 13,
                fontSize: 15,
                color: C.text,
                borderWidth: emailError ? 1.5 : 0,
                borderColor: emailError ? C.red : "transparent",
              }}
            />
          </View>

          <View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
              <Text style={{ fontSize: 13, fontWeight: "600", color: C.textSecondary, letterSpacing: 0.4 }}>
                Password
              </Text>
              {passwordError && (
                <Text style={{ fontSize: 12, color: C.red }}>{passwordError}</Text>
              )}
            </View>
            <View style={{ position: "relative" }}>
              <TextInput
                ref={passwordRef}
                value={password}
                onChangeText={(v) => { setPassword(v); if (passwordError) setPasswordError(null); if (error) setError(null); }}
                placeholder="••••••••"
                placeholderTextColor={C.textSecondary}
                secureTextEntry={!showPassword}
                textContentType="password"
                returnKeyType="done"
                onSubmitEditing={handleLogin}
                style={{
                  backgroundColor: C.surfaceAlt,
                  borderRadius: Radius.md,
                  paddingHorizontal: 14,
                  paddingVertical: 13,
                  paddingRight: 46,
                  fontSize: 15,
                  color: C.text,
                  borderWidth: passwordError ? 1.5 : 0,
                  borderColor: passwordError ? C.red : "transparent",
                }}
              />
              <Pressable
                onPress={() => setShowPassword((v) => !v)}
                hitSlop={8}
                style={{
                  position: "absolute",
                  right: 14,
                  top: 0,
                  bottom: 0,
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: "600", color: C.tint }}>
                  {showPassword ? "HIDE" : "SHOW"}
                </Text>
              </Pressable>
            </View>
          </View>

          {error && (
            <View
              style={{
                backgroundColor: C.redSubtle,
                borderRadius: Radius.md,
                padding: 12,
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Text style={{ flex: 1, color: C.red, fontSize: 13 }}>{error}</Text>
              <Pressable onPress={() => setError(null)} hitSlop={8}>
                <Text style={{ color: C.red, fontSize: 16, lineHeight: 18 }}>×</Text>
              </Pressable>
            </View>
          )}

          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            style={{
              backgroundColor: C.tint,
              borderRadius: Radius.md,
              paddingVertical: 15,
              alignItems: "center",
              marginTop: 4,
              opacity: loading ? 0.75 : 1,
              ...Shadow.card,
            }}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
                Sign In
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 24,
            gap: 4,
          }}
        >
          <Text style={{ fontSize: 14, color: C.textSecondary }}>
            Don't have an account?
          </Text>
          <TouchableOpacity
            onPress={() => router.replace("/(auth)/register")}
            activeOpacity={0.7}
            disabled={loading}
          >
            <Text style={{ fontSize: 14, fontWeight: "700", color: C.tint }}>
              Register
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}