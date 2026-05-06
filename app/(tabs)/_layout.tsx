import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { AuthContext } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Tabs, useRouter } from 'expo-router';
import React, { useContext, useEffect } from 'react';

export default function TabLayout() {
  const {isAuthenticated, checkForAuth } = useContext(AuthContext);

  const router = useRouter();

  const colorScheme = useColorScheme();

  useEffect(()=>{

    const authCheck = async () => {
      if (!isAuthenticated) {
        const success = await checkForAuth();
        if (!success) router.replace("/(auth)/login");
      };
    };

    authCheck();
    
  },[]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="square.grid.2x2.fill" color={color} />,
        }}
      />
      <Tabs.Screen 
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="magnifyingglass" color={color} />,
        }}
      />
      <Tabs.Screen 
        name="todo/create"
        options={{
           href: null
        }}
      />
      <Tabs.Screen 
        name="todo/[id]/edit"
        options={{
           href: null
        }}
      />
      <Tabs.Screen 
        name="todo/[id]/view"
        options={{
           href: null
        }}
      />
      <Tabs.Screen 
        name="list/create"
        options={{
           href: null
        }}
      />
      <Tabs.Screen 
        name="list/[id]/edit"
        options={{
           href: null
        }}
      />
      <Tabs.Screen 
        name="list/[id]/view"
        options={{
           href: null
        }}
      />
      <Tabs.Screen 
        name="list/[id]/public"
        options={{
           href: null
        }}
      />
    </Tabs>
  );
}

/*
<Tabs.Screen 
  name="user"
  options={{
    title: 'User',
    tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.circle" color={color} />,
  }}
/>
*/