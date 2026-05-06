import { Colors } from "@/constants/theme";
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
  ScrollView,
  Text,
  View
} from "react-native";

export default function Index() {
  const colorScheme = useColorScheme();
  const textColor = Colors[colorScheme ?? 'light'].text;
  const tint = Colors[colorScheme ?? 'light'].tint;
  const tintAlt = Colors[colorScheme ?? 'light'].tintAlt;

  return (
    <ScrollView
      className="flex flex-col gap-4 px-6"
    >
    
      <View className="mt-10">
          <Text 
              style={{color: textColor}}
              className="text-4xl font-bold tracking-tight">
              Your Atelier
          </Text>
          <Text 
              style={{color: textColor}}
              className="text-xl tracking-tight">
              Focus on what matters today.
          </Text>
      </View>

      {/* Todos do today */}
      <View >
          <Text className="tracking-widest uppercase">
              Due Today
          </Text>
      </View>

      {/* Lists of todos */}

      <View >
          <Text>
              Lists
          </Text>
      </View>

    </ScrollView>
  );
}