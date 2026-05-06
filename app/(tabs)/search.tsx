import ListCardView from "@/components/mine/ListCardView";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getPublicLists } from "@/services/lists/getPublicLists";
import { useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  View
} from "react-native";

export default function Search() {
  const colorScheme = useColorScheme();
  const textColor = Colors[colorScheme ?? 'light'].text;
  const tint = Colors[colorScheme ?? 'light'].tint;
  const tintAlt = Colors[colorScheme ?? 'light'].tintAlt;

  const [loading, setLoading] = useState(true);
  const [userLists, setUserLists] = useState(null);
  const [userListsError, setUserListsError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {

    const load = async () => {
      setLoading(true);
      try {
        const listsResult = await getPublicLists();
        setUserLists(listsResult);
      } catch (error) {
        setUserListsError("Error while retrieving lists.");
      }
      setLoading(false);
    };

    load();

  }, []);

  const filteredLists = useMemo(() => {
    if (!userLists) return null;
    const q = search.trim().toLowerCase();
    if (!q) return userLists;
    return userLists.filter((l) =>
      l.title?.toLowerCase().includes(q)
    );
  }, [userLists, search]);

  return (
    <ScrollView className="flex flex-col px-6">

      {/* Search bar */}
      <View
        className="mt-10 flex-row items-center px-3 rounded-lg border"
        style={{ borderColor: tintAlt }}
      >
        <IconSymbol name="magnifyingglass" size={20} color={textColor} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search lists..."
          placeholderTextColor={textColor + "99"}
          className="flex-1 py-3 ml-2"
          style={{ color: textColor, outline: 'none'}}
        />
      </View>

      {/* Lists of todos */}
      <View className="mt-6">
        <Text style={{ color: textColor }} className="mb-2 tracking-widest uppercase">
          Lists
        </Text>

        {loading ? (
          <Text style={{ color: textColor }}>Loading...</Text>
        ) : userListsError ? (
          <Text style={{ color: textColor }}>{userListsError}</Text>
        ) : filteredLists && filteredLists.length > 0 ? (
          filteredLists.map((list) => (
            <ListCardView key={list.uuid} list={list} />
          ))
        ) : search ? (
          <Text style={{ color: textColor }}>No lists match "{search}".</Text>
        ) : (
          <Text style={{ color: textColor }}>No public lists available.</Text>
        )}
      </View>

    </ScrollView>
  );
}