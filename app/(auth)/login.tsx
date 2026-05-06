import { Colors } from "@/constants/theme";
import { AuthContext } from "@/contexts/AuthContext";
import { useColorScheme } from '@/hooks/use-color-scheme';
import { loginFirebase } from "@/services/auth/authServices";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function LoginScreen() {
    const colorScheme = useColorScheme();
    const textColor = Colors[colorScheme ?? 'light'].text;
    const tint = Colors[colorScheme ?? 'light'].tint;
    const tintAlt = Colors[colorScheme ?? 'light'].tintAlt;

    const router = useRouter();

    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const handleLogin = async () => {
        if (!email || !password) {
            setError("Please fill in all fields.");
            return;
        }

        if (!EMAIL_REGEX.test(email)) {
            setError("Please enter a valid email.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

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
            className="flex-1"
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <View className="flex-1 justify-center px-6">
                {/* Header */}
                <View className="mb-10">
                    <Text 
                        style={{color: textColor}}
                        className="text-4xl font-bold tracking-tight">
                        Welcome back
                    </Text>
                    <Text className="text-base mt-2" style={{color: textColor}}>
                        Sign in to your account
                    </Text>
                </View>

                {/* Form */}
                <View className="gap-4">
                    <View>
                        <Text className="text-sm font-medium mb-1.5" style={{color: textColor}}>
                            Email
                        </Text>
                        <TextInput
                            style={{color: textColor, borderColor: tintAlt}}
                            className="rounded-xl px-4 py-3.5 text-base border"
                            placeholder="you@example.com"
                            placeholderTextColor="#52525b"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            textContentType="emailAddress"
                        />
                    </View>

                    <View>
                        <Text className="text-sm font-medium mb-1.5" style={{color: textColor}}>
                            Password
                        </Text>
                        <TextInput
                            style={{color: textColor, borderColor: tintAlt}}
                            className="rounded-xl px-4 py-3.5 text-base border"
                            placeholder="••••••••"
                            placeholderTextColor="#52525b"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            textContentType="password"
                        />
                    </View>

                    {/* Error */}
                    {error && (
                        <Text className="text-red-400 text-sm">{error}</Text>
                    )}

                    {/* Sign In */}
                    <TouchableOpacity
                        style={{backgroundColor: tintAlt}}
                        className={`rounded-xl py-4 mt-2 items-center `}
                        onPress={handleLogin}
                        disabled={loading}
                        activeOpacity={0.8}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text className="font-semibold text-base" style={{color: tint}}>
                                Sign In
                            </Text>
                        )}
                    </TouchableOpacity>

                    {/* Register */}
                    <TouchableOpacity
                        className={`rounded-xl py-4 mt-2 items-center `}
                        onPress={() => router.replace("/(auth)/register")}
                        activeOpacity={0.8}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text className="font-semibold text-base" style={{color: tint}}>
                                Register
                            </Text>
                        )}
                    </TouchableOpacity>

                </View>
            </View>
        </KeyboardAvoidingView>
    );
}