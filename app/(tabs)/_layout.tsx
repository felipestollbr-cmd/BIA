import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Text } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#ea580c',
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: {
          backgroundColor: '#0f172a',
          borderTopColor: '#1e293b',
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingBottom: Platform.OS === 'ios' ? 28 : 12,
        },
        headerStyle: {
          backgroundColor: '#0f172a',
        },
        headerTintColor: '#fff',
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color }) => <TabIcon name="🏠" color={color} />,
        }}
      />
      <Tabs.Screen
        name="neuro"
        options={{
          title: 'Neuro',
          tabBarIcon: ({ color }) => <TabIcon name="🧠" color={color} />,
        }}
      />
      <Tabs.Screen
        name="exercises"
        options={{
          title: 'Exercícios',
          tabBarIcon: ({ color }) => <TabIcon name="🎮" color={color} />,
        }}
      />
      <Tabs.Screen
        name="tests"
        options={{
          title: 'Testes',
          tabBarIcon: ({ color }) => <TabIcon name="🎯" color={color} />,
        }}
      />
      <Tabs.Screen
        name="caregiver"
        options={{
          title: 'Cuidador',
          tabBarIcon: ({ color }) => <TabIcon name="👥" color={color} />,
        }}
      />
    </Tabs>
  );
}

function TabIcon({ name, color }: { name: string; color: string }) {
  return (
    <Text style={{ fontSize: 24, color }}>
      {name}
    </Text>
  );
}
