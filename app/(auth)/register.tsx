import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors, Radius, Shadow } from "@/constants/theme";
import { AuthContext } from "@/contexts/AuthContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { loginFirebase } from "@/services/auth/authServices";
import { registerUser } from "@/services/user/registerUser";
import { RegisterUser } from "@/types/RegisterUser";
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

const PasswordStrength = ({ password }: { password: string }) => {
  const colorScheme = useColorScheme();
  const C = Colors[colorScheme ?? "light"];

  if (!password) return null;

  const checks = [
    password.length >= 6,
    password.length >= 10,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;

  const levels = [
    { label: "Weak",   color: C.red },
    { label: "Fair",   color: "#F97316" },
    { label: "Good",   color: "#EAB308" },
    { label: "Strong", color: C.green },
  ];
  const level = levels[score - 1] ?? levels[0];

  return (
    <View style={{ marginTop: 8, gap: 4 }}>
      <View style={{ flexDirection: "row", gap: 4 }}>
        {[0, 1, 2, 3].map((i) => (
          <View
            key={i}
            style={{
              flex: 1,
              height: 4,
              borderRadius: Radius.full,
              backgroundColor: i < score ? level.color : C.surfaceAlt,
            }}
          />
        ))}
      </View>
      <Text style={{ fontSize: 11, color: level.color, fontWeight: "600", textAlign: "right" }}>
        {level.label}
      </Text>
    </View>
  );
};

const RegisterUserPage = () => {
  const colorScheme = useColorScheme();
  const C = Colors[colorScheme ?? "light"];
  const router = useRouter();
  const { login } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConf, setPasswordConf] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConf, setShowPasswordConf] = useState(false);

  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordConfError, setPasswordConfError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const passwordConfRef = useRef<TextInput>(null);

  const validate = (): boolean => {
    let ok = true;

    if (!name.trim()) { setNameError("Full name is required."); ok = false; }
    else setNameError(null);

    if (!email.trim()) { setEmailError("Email is required."); ok = false; }
    else if (!EMAIL_REGEX.test(email)) { setEmailError("Enter a valid email."); ok = false; }
    else setEmailError(null);

    if (!password) { setPasswordError("Password is required."); ok = false; }
    else if (password.length < 6) { setPasswordError("At least 6 characters."); ok = false; }
    else setPasswordError(null);

    if (!passwordConf) { setPasswordConfError("Please confirm your password."); ok = false; }
    else if (password !== passwordConf) { setPasswordConfError("Passwords don't match."); ok = false; }
    else setPasswordConfError(null);

    return ok;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setApiError(null);
    setLoading(true);

    const user: RegisterUser = {
      email,
      password,
      passwordConfirmation: passwordConf,
      fullName: name,
    };

    try {
      await registerUser(user);
    } catch (err: any) {
      setApiError(err.message ?? "Registration failed. Please try again.");
      setLoading(false);
      return;
    }

    try {
      const token = await loginFirebase(user.email, user.password);
      await login(null, token);
    } catch (err: any) {
      setApiError("Account created! But auto-login failed — please sign in manually.");
    } finally {
      setLoading(false);
    }
  };

  const clearApiError = () => { if (apiError) setApiError(null); };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: C.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 24,
          paddingTop: 56,
          paddingBottom: 48,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          onPress={() => router.navigate("/(auth)/login")}
          hitSlop={10}
          style={({ pressed }) => ({
            width: 36,
            height: 36,
            borderRadius: Radius.full,
            backgroundColor: pressed ? C.surfaceAlt : C.surface,
            borderWidth: 1,
            borderColor: C.border,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 28,
            ...Shadow.card,
          })}
        >
          <IconSymbol name="chevron.left" size={18} color={C.text} />
        </Pressable>

        <View style={{ marginBottom: 32 }}>
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
            Create account
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: C.textSecondary,
              marginTop: 6,
              lineHeight: 22,
            }}
          >
            Start organizing your academic tasks.
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
                Full Name
              </Text>
              {nameError && <Text style={{ fontSize: 12, color: C.red }}>{nameError}</Text>}
            </View>
            <TextInput
              value={name}
              onChangeText={(v) => { setName(v); if (nameError) setNameError(null); clearApiError(); }}
              placeholder="Ada Lovelace"
              placeholderTextColor={C.textSecondary}
              textContentType="name"
              returnKeyType="next"
              onSubmitEditing={() => emailRef.current?.focus()}
              style={{
                backgroundColor: C.surfaceAlt,
                borderRadius: Radius.md,
                paddingHorizontal: 14,
                paddingVertical: 13,
                fontSize: 15,
                color: C.text,
                borderWidth: nameError ? 1.5 : 0,
                borderColor: nameError ? C.red : "transparent",
              }}
            />
          </View>

          <View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
              <Text style={{ fontSize: 13, fontWeight: "600", color: C.textSecondary, letterSpacing: 0.4 }}>
                Email
              </Text>
              {emailError && <Text style={{ fontSize: 12, color: C.red }}>{emailError}</Text>}
            </View>
            <TextInput
              ref={emailRef}
              value={email}
              onChangeText={(v) => { setEmail(v); if (emailError) setEmailError(null); clearApiError(); }}
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
              {passwordError && <Text style={{ fontSize: 12, color: C.red }}>{passwordError}</Text>}
            </View>
            <View style={{ position: "relative" }}>
              <TextInput
                ref={passwordRef}
                value={password}
                onChangeText={(v) => { setPassword(v); if (passwordError) setPasswordError(null); clearApiError(); }}
                placeholder="••••••••"
                placeholderTextColor={C.textSecondary}
                secureTextEntry={!showPassword}
                textContentType="newPassword"
                returnKeyType="next"
                onSubmitEditing={() => passwordConfRef.current?.focus()}
                style={{
                  backgroundColor: C.surfaceAlt,
                  borderRadius: Radius.md,
                  paddingHorizontal: 14,
                  paddingVertical: 13,
                  paddingRight: 56,
                  fontSize: 15,
                  color: C.text,
                  borderWidth: passwordError ? 1.5 : 0,
                  borderColor: passwordError ? C.red : "transparent",
                }}
              />
              <Pressable
                onPress={() => setShowPassword((v) => !v)}
                hitSlop={8}
                style={{ position: "absolute", right: 14, top: 0, bottom: 0, justifyContent: "center" }}
              >
                <Text style={{ fontSize: 12, fontWeight: "600", color: C.tint }}>
                  {showPassword ? "HIDE" : "SHOW"}
                </Text>
              </Pressable>
            </View>
            <PasswordStrength password={password} />
          </View>

          <View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
              <Text style={{ fontSize: 13, fontWeight: "600", color: C.textSecondary, letterSpacing: 0.4 }}>
                Confirm Password
              </Text>
              {passwordConfError && <Text style={{ fontSize: 12, color: C.red }}>{passwordConfError}</Text>}
            </View>
            <View style={{ position: "relative" }}>
              <TextInput
                ref={passwordConfRef}
                value={passwordConf}
                onChangeText={(v) => { setPasswordConf(v); if (passwordConfError) setPasswordConfError(null); clearApiError(); }}
                placeholder="••••••••"
                placeholderTextColor={C.textSecondary}
                secureTextEntry={!showPasswordConf}
                textContentType="newPassword"
                returnKeyType="done"
                onSubmitEditing={handleRegister}
                style={{
                  backgroundColor: C.surfaceAlt,
                  borderRadius: Radius.md,
                  paddingHorizontal: 14,
                  paddingVertical: 13,
                  paddingRight: 56,
                  fontSize: 15,
                  color: C.text,
                  borderWidth: passwordConfError ? 1.5 : 0,
                  borderColor: passwordConfError ? C.red : "transparent",
                  // Live match indicator
                  borderColor: passwordConf
                    ? password === passwordConf
                      ? C.green
                      : passwordConfError
                      ? C.red
                      : "transparent"
                    : passwordConfError
                    ? C.red
                    : "transparent",
                  borderWidth: passwordConf || passwordConfError ? 1.5 : 0,
                }}
              />
              <Pressable
                onPress={() => setShowPasswordConf((v) => !v)}
                hitSlop={8}
                style={{ position: "absolute", right: 14, top: 0, bottom: 0, justifyContent: "center" }}
              >
                <Text style={{ fontSize: 12, fontWeight: "600", color: C.tint }}>
                  {showPasswordConf ? "HIDE" : "SHOW"}
                </Text>
              </Pressable>
            </View>
          </View>

          {apiError && (
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
              <Text style={{ flex: 1, color: C.red, fontSize: 13 }}>{apiError}</Text>
              <Pressable onPress={() => setApiError(null)} hitSlop={8}>
                <Text style={{ color: C.red, fontSize: 16, lineHeight: 18 }}>×</Text>
              </Pressable>
            </View>
          )}

          <TouchableOpacity
            onPress={handleRegister}
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
                Create Account
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
            Already have an account?
          </Text>
          <TouchableOpacity
            onPress={() => router.navigate("/(auth)/login")}
            activeOpacity={0.7}
            disabled={loading}
          >
            <Text style={{ fontSize: 14, fontWeight: "700", color: C.tint }}>
              Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterUserPage;