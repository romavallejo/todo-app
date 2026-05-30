import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors, Radius, Shadow } from "@/constants/theme";
import { AuthContext } from "@/contexts/AuthContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { getUser } from "@/services/user/getUser";
import { UserType } from "@/types/UserType";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useContext, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const Avatar = ({ name, size = 80 }: { name: string; size?: number }) => {
  const colorScheme = useColorScheme();
  const C = Colors[colorScheme ?? "light"];

  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: C.tintSubtle,
        borderWidth: 3,
        borderColor: C.tint,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          fontSize: size * 0.35,
          fontWeight: "800",
          color: C.tint,
          letterSpacing: 1,
        }}
      >
        {initials || "?"}
      </Text>
    </View>
  );
};

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) => {
  const colorScheme = useColorScheme();
  const C = Colors[colorScheme ?? "light"];
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        paddingVertical: 14,
      }}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: Radius.md,
          backgroundColor: C.tintSubtle,
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <IconSymbol name={icon as any} size={17} color={C.tint} />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 11,
            fontWeight: "600",
            color: C.textSecondary,
            letterSpacing: 0.8,
            textTransform: "uppercase",
            marginBottom: 2,
          }}
        >
          {label}
        </Text>
        <Text
          style={{ fontSize: 15, fontWeight: "500", color: C.text }}
          numberOfLines={1}
        >
          {value}
        </Text>
      </View>
    </View>
  );
};

const Divider = () => {
  const colorScheme = useColorScheme();
  const C = Colors[colorScheme ?? "light"];
  return (
    <View style={{ height: 1, backgroundColor: C.divider, marginHorizontal: -20 }} />
  );
};

const ProfileSkeleton = () => {
  const colorScheme = useColorScheme();
  const C = Colors[colorScheme ?? "light"];
  return (
    <View style={{ alignItems: "center", gap: 12, paddingVertical: 8 }}>
      <View
        style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: C.surfaceAlt,
        }}
      />
      <View style={{ width: 140, height: 16, borderRadius: Radius.sm, backgroundColor: C.surfaceAlt }} />
      <View style={{ width: 100, height: 12, borderRadius: Radius.sm, backgroundColor: C.surfaceAlt }} />
    </View>
  );
};

const ConfirmLogoutModal = ({
  visible,
  onConfirm,
  onCancel,
  loading,
}: {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) => {
  const colorScheme = useColorScheme();
  const C = Colors[colorScheme ?? "light"];
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable
        onPress={onCancel}
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.45)",
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 28,
        }}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={{
            backgroundColor: C.surface,
            borderRadius: Radius.lg,
            padding: 24,
            width: "100%",
            alignItems: "center",
            ...Shadow.modal,
          }}
        >
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: Radius.full,
              backgroundColor: C.redSubtle,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <Text style={{ fontSize: 26 }}>👋</Text>
          </View>

          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: C.text,
              marginBottom: 8,
              textAlign: "center",
            }}
          >
            Sign out?
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: C.textSecondary,
              textAlign: "center",
              lineHeight: 20,
              marginBottom: 24,
            }}
          >
            You'll need to sign back in to access your lists and todos.
          </Text>

          <View style={{ flexDirection: "row", gap: 12, width: "100%" }}>
            <TouchableOpacity
              onPress={onCancel}
              disabled={loading}
              style={{
                flex: 1,
                paddingVertical: 14,
                borderRadius: Radius.md,
                alignItems: "center",
                backgroundColor: C.surfaceAlt,
              }}
              activeOpacity={0.75}
            >
              <Text style={{ color: C.textSecondary, fontWeight: "600", fontSize: 15 }}>
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onConfirm}
              disabled={loading}
              style={{
                flex: 1,
                paddingVertical: 14,
                borderRadius: Radius.md,
                alignItems: "center",
                backgroundColor: C.red,
                opacity: loading ? 0.7 : 1,
                ...Shadow.card,
              }}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>
                  Sign Out
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default function UserScreen() {
  const colorScheme = useColorScheme();
  const C = Colors[colorScheme ?? "light"];

  const {logout} = useContext(AuthContext);
  const router = useRouter();

  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUser();
      setUser(data);
    } catch {
      setError("Couldn't load profile. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      logout();
      router.replace("/(auth)/login");
    } catch {
      setError("Couldn't sign out. Please try again.");
    } finally {
      setLoggingOut(false);
      setConfirmVisible(false);
    }
  };

  const StatusPill = ({ active }: { active: boolean }) => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        backgroundColor: active ? C.greenSubtle : C.redSubtle,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: Radius.full,
        alignSelf: "center",
        marginTop: 8,
      }}
    >
      <View
        style={{
          width: 7,
          height: 7,
          borderRadius: Radius.full,
          backgroundColor: active ? C.green : C.red,
        }}
      />
      <Text
        style={{
          fontSize: 12,
          fontWeight: "600",
          color: active ? C.green : C.red,
          letterSpacing: 0.3,
        }}
      >
        {active ? "Active" : "Inactive"}
      </Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: C.background }}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 56,
          paddingBottom: 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "600",
              color: C.tint,
              letterSpacing: 1.2,
              textTransform: "uppercase",
              marginBottom: 4,
            }}
          >
            Account
          </Text>
          <Text
            style={{
              fontSize: 26,
              fontWeight: "800",
              color: C.text,
              letterSpacing: -0.5,
            }}
          >
            Profile
          </Text>
        </View>

        <View
          style={{
            backgroundColor: C.surface,
            borderRadius: Radius.lg,
            padding: 24,
            alignItems: "center",
            marginBottom: 14,
            ...Shadow.card,
          }}
        >
          {loading ? (
            <ProfileSkeleton />
          ) : error ? (
            <View style={{ alignItems: "center", gap: 10 }}>
              <Text style={{ fontSize: 32 }}>😕</Text>
              <Text style={{ color: C.textSecondary, fontSize: 14, textAlign: "center" }}>
                {error}
              </Text>
              <TouchableOpacity
                onPress={load}
                style={{
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  backgroundColor: C.tint,
                  borderRadius: Radius.md,
                  ...Shadow.card,
                }}
                activeOpacity={0.85}
              >
                <Text style={{ color: "#fff", fontWeight: "700", fontSize: 14 }}>
                  Retry
                </Text>
              </TouchableOpacity>
            </View>
          ) : user ? (
            <>
              <Avatar name={user.fullName} size={84} />

              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "800",
                  color: C.text,
                  marginTop: 14,
                  letterSpacing: -0.3,
                  textAlign: "center",
                }}
              >
                {user.fullName}
              </Text>

              <Text
                style={{
                  fontSize: 14,
                  color: C.textSecondary,
                  marginTop: 3,
                  textAlign: "center",
                }}
              >
                {user.email}
              </Text>

              <StatusPill active={user.active} />
            </>
          ) : null}
        </View>

        {!loading && !error && user && (
          <View
            style={{
              backgroundColor: C.surface,
              borderRadius: Radius.lg,
              paddingHorizontal: 20,
              marginBottom: 14,
              ...Shadow.card,
            }}
          >
            <InfoRow
              icon="person.fill"
              label="Full Name"
              value={user.fullName}
            />
            <Divider />
            <InfoRow
              icon="envelope.fill"
              label="Email"
              value={user.email}
            />
            <Divider />
            <InfoRow
              icon="number"
              label="User ID"
              value={user.id}
            />
          </View>
        )}

        {!loading && !error && user && (
          <View
            style={{
              backgroundColor: C.surface,
              borderRadius: Radius.lg,
              paddingHorizontal: 20,
              marginBottom: 28,
              ...Shadow.card,
            }}
          >
            <TouchableOpacity
              onPress={() => setConfirmVisible(true)}
              activeOpacity={0.75}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 14,
                paddingVertical: 16,
              }}
            >
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: Radius.md,
                  backgroundColor: C.redSubtle,
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <IconSymbol name="rectangle.portrait.and.arrow.right" size={17} color={C.red} />
              </View>
              <Text
                style={{
                  flex: 1,
                  fontSize: 15,
                  fontWeight: "600",
                  color: C.red,
                }}
              >
                Sign Out
              </Text>
              <IconSymbol name="chevron.right" size={14} color={C.textSecondary} />
            </TouchableOpacity>
          </View>
        )}

        <Text
          style={{
            textAlign: "center",
            fontSize: 12,
            color: C.textSecondary,
            opacity: 0.6,
          }}
        >
          A00573055 · v1.0.0
        </Text>
      </ScrollView>

      <ConfirmLogoutModal
        visible={confirmVisible}
        onConfirm={handleLogout}
        onCancel={() => setConfirmVisible(false)}
        loading={loggingOut}
      />
    </View>
  );
}