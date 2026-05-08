import { Colors } from "@/constants/theme";
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Text, View } from "react-native";

type Comment = {
    content: string;
    authorName: string;
};

type CommentProps = {
    comment: Comment
};

const Comment = ({ comment }: CommentProps) => {
    const colorScheme = useColorScheme();
    const textColor = Colors[colorScheme ?? 'light'].text;
    const bg = Colors[colorScheme ?? 'light'].background;
    const tintAlt = Colors[colorScheme ?? 'light'].tintAlt;

    return (
        <View
            className="flex-col w-full p-3 rounded-lg border-2"
            style={{ backgroundColor: bg , borderColor: tintAlt}}
        >

                <Text
                    className="text-md font-bold flex-1 italic"
                    style={{
                        color: textColor,
                    }}
                    numberOfLines={1}
                >
                    {comment.authorName}
                </Text>  
      
                <Text style={{ color: textColor }}>
                    {comment.content}
                </Text>

        </View>
    );
};

export default Comment;