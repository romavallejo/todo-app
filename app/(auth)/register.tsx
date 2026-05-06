import { Colors } from "@/constants/theme";
import { AuthContext } from "@/contexts/AuthContext";
import { useColorScheme } from '@/hooks/use-color-scheme';
import { loginFirebase } from "@/services/auth/authServices";
import { registerUser } from "@/services/user/registerUser";
import { RegisterUser } from "@/types/RegisterUser";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const RegisterUserPage = () => {
    const colorScheme = useColorScheme();
        const textColor = Colors[colorScheme ?? 'light'].text;
        const tint = Colors[colorScheme ?? 'light'].tint;
        const tintAlt = Colors[colorScheme ?? 'light'].tintAlt;
    
        const router = useRouter();
    
        const { login } = useContext(AuthContext);

        const [name, setName] = useState(""); 
        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");
        const [passwordConf, setPasswordConf] = useState("");
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState<string | null>(null);
    
        const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const handleRegister = async () => {
            if (!name || !email || !password || !passwordConf) {
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
            if (password != passwordConf)
                {
                setError("Password are not equal.");
                return;
            }
            
    
            setError(null);
            setLoading(true);

            let user: RegisterUser = {
                email: email,
                password: password,
                passwordConfirmation: passwordConf,
                fullName: name
            };
    
            try {
                await registerUser(user);
            } catch (err: any) {
                setError(err.message ?? "Registration Failed. Please try again.");
            }

            try {
                const token = await loginFirebase(user.email, user.password);
                await login(null, token);
            } catch (err: any) {
                setError(err.message ?? "Account created successfully. Login failed. Try again later.");
            } finally {
                setLoading(false);
            }
            
        };
    
        return (
            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <TouchableOpacity
                    onPress={() => router.navigate("/(auth)/login")}
                    className="px-4 pt-6 pb-2"
                    activeOpacity={0.7}
                >
                    <Text style={{ color: tint }} className="text-2xl">←</Text>
                </TouchableOpacity>
                
                <View className="flex-1 justify-center px-6">
                    {/* Header */}
                    <View className="mb-10">
                        <Text 
                            style={{color: textColor}}
                            className="text-4xl font-bold tracking-tight">
                            Register
                        </Text>
                    </View>
    
                    {/* Form */}
                    <View className="gap-4">

                        <View>
                            <Text className="text-sm font-medium mb-1.5" style={{color: textColor}}>
                                Full Name
                            </Text>
                            <TextInput
                                style={{color: textColor, borderColor: tintAlt}}
                                className="rounded-xl px-4 py-3.5 text-base border"
                                placeholder="Farmacias Benavides"
                                placeholderTextColor="#52525b"
                                value={name}
                                onChangeText={setName}
                                autoCapitalize="none"
                                keyboardType="ascii-capable"
                                textContentType="name"
                            />
                        </View>
                        
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

                        <View>
                            <Text className="text-sm font-medium mb-1.5" style={{color: textColor}}>
                                Password Confirmation
                            </Text>
                            <TextInput
                                style={{color: textColor, borderColor: tintAlt}}
                                className="rounded-xl px-4 py-3.5 text-base border"
                                placeholder="••••••••"
                                placeholderTextColor="#52525b"
                                value={passwordConf}
                                onChangeText={setPasswordConf}
                                secureTextEntry
                                textContentType="password"
                            />
                        </View>
    
                        {/* Error */}
                        {error && (
                            <Text className="text-red-400 text-sm">{error}</Text>
                        )}
    
                        {/* Register */}
                        <TouchableOpacity
                            style={{backgroundColor: tintAlt}}
                            className={`rounded-xl py-4 mt-2 items-center `}
                            onPress={handleRegister}
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
    
                    </View>
                </View>
            </KeyboardAvoidingView>
        );
};

export default RegisterUserPage;