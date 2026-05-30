import { Colors, Radius, Shadow } from "@/constants/theme";
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Text, View } from "react-native";

type Comment = {
    content: string;
    authorName: string;
};

type CommentProps = {
    comment: Comment;
};

const getInitials = (name: string) =>
    name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() ?? "")
        .join("");

const avatarHue = (name: string) => {
    let h = 0;
    for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360;
    return h;
};

const Comment = ({ comment }: CommentProps) => {
    const colorScheme = useColorScheme();
    const C = Colors[colorScheme ?? 'light'];

    const hue = avatarHue(comment.authorName);
    const avatarBg = `hsl(${hue}, 60%, ${colorScheme === 'dark' ? '28%' : '88%'})`;
    const avatarFg = `hsl(${hue}, 55%, ${colorScheme === 'dark' ? '72%' : '32%'})`;

    return (
        <View
            style={{
                backgroundColor: C.surface,
                borderRadius: Radius.md,
                padding: 14,
                ...Shadow.card,
                gap: 8,
            }}
        >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <View
                    style={{
                        width: 32,
                        height: 32,
                        borderRadius: Radius.full,
                        backgroundColor: avatarBg,
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 12,
                            fontWeight: "700",
                            color: avatarFg,
                            letterSpacing: 0.5,
                        }}
                    >
                        {getInitials(comment.authorName)}
                    </Text>
                </View>

                <Text
                    numberOfLines={1}
                    style={{
                        fontSize: 13,
                        fontWeight: "700",
                        color: C.text,
                        flex: 1,
                    }}
                >
                    {comment.authorName}
                </Text>
            </View>

            <View
                style={{
                    height: 1,
                    backgroundColor: C.divider,
                    marginHorizontal: -14,
                    marginBottom: -4,
                }}
            />

            <Text
                style={{
                    fontSize: 14,
                    color: C.textSecondary,
                    lineHeight: 20,
                }}
            >
                {comment.content}
            </Text>
        </View>
    );
};

export default Comment;