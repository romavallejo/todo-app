import api from "@/services/api";
import { login } from "@/services/auth/authServices";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
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
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [todoLoading, setTodoLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async () => {
        if (!email || !password) {
            setError("Please fill in all fields.");
            return;
        }

        setError(null);
        setLoading(true);

        try {
            const token = await login(email, password);
            console.log("Token:", token);
            await AsyncStorage.setItem("token", token);
        } catch (err: any) {
            setError(err.message ?? "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleFetchTodos = async () => {
        setTodoLoading(true);
        try {
            const response = await api.get("/todo");
            console.log("Todos:", response.data);
        } catch (err: any) {
            console.error("Failed to fetch todos:", err.message ?? err);
        } finally {
            setTodoLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-zinc-950"
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <View className="flex-1 justify-center px-6">
                {/* Header */}
                <View className="mb-10">
                    <Text className="text-white text-4xl font-bold tracking-tight">
                        Welcome back
                    </Text>
                    <Text className="text-red-800 text-base mt-2">
                        Sign in to your account
                    </Text>
                </View>

                {/* Form */}
                <View className="gap-4">
                    <View>
                        <Text className="text-zinc-400 text-sm font-medium mb-1.5">
                            Email
                        </Text>
                        <TextInput
                            className="bg-zinc-900 text-white rounded-xl px-4 py-3.5 text-base border border-zinc-800 focus:border-indigo-500"
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
                        <Text className="text-zinc-400 text-sm font-medium mb-1.5">
                            Password
                        </Text>
                        <TextInput
                            className="bg-zinc-900 text-white rounded-xl px-4 py-3.5 text-base border border-zinc-800 focus:border-indigo-500"
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
                        className={`rounded-xl py-4 mt-2 items-center ${
                            loading ? "bg-indigo-800" : "bg-indigo-600"
                        }`}
                        onPress={handleLogin}
                        disabled={loading}
                        activeOpacity={0.8}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text className="text-white font-semibold text-base">
                                Sign In
                            </Text>
                        )}
                    </TouchableOpacity>

                    {/* Fetch Todos */}
                    <TouchableOpacity
                        className={`rounded-xl py-4 items-center border ${
                            todoLoading
                                ? "border-zinc-700 bg-zinc-900"
                                : "border-zinc-700"
                        }`}
                        onPress={handleFetchTodos}
                        disabled={todoLoading}
                        activeOpacity={0.8}
                    >
                        {todoLoading ? (
                            <ActivityIndicator color="#a1a1aa" />
                        ) : (
                            <Text className="text-zinc-300 font-semibold text-base">
                                Fetch Todos
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}