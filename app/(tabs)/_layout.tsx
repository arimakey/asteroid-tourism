import { Tabs } from 'expo-router';
import React from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}
    >
      {/* Pantalla Home */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />

      {/* Pantalla Explore */}
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'compass' : 'compass-outline'} color={color} />
          ),
        }}
      />

      {/* Pantalla Places */}
      <Tabs.Screen
        name="places/index" // Ruta específica de la carpeta places
        options={{
          title: 'Places',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'map' : 'map-outline'} color={color} />
          ),
        }}
      />

      {/* Pantalla Festivity */}
      <Tabs.Screen
        name="festivity/index" // Ruta específica de la carpeta festivity
        options={{
          title: 'Festivity',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'calendar' : 'calendar-outline'} color={color} />
          ),
        }}
      />

      {/* Pantalla Typical Dish */}
      <Tabs.Screen
        name="typical_dish/index" // Ruta específica de la carpeta typical_dish
        options={{
          title: 'Dishes',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'restaurant' : 'restaurant-outline'} color={color} />
          ),
        }}
      />

      {/* Itinerario */}
      <Tabs.Screen
        name="itinerario/index" // Ruta específica de la carpeta itinerario
        options={{
          title: 'Itinerary',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'time' : 'time-outline'} color={color} />
          ),
        }}
      />

      {/* Festivity [id] */}
      <Tabs.Screen
        name="festivity/[id]" // Ruta específica de la carpeta festivity
        options={{
          headerShown: false,
          title: 'Festivity',
          tabBarIcon: ()=> null
        }}
      />

      {/* Typical Dish [id] */}
      <Tabs.Screen
        name="typical_dish/[id]" // Ruta específica de la carpeta typical_dish
        options={{
          headerShown: false,
          title: 'Dish',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'restaurant' : 'restaurant-outline'} color={color} />
          ),
        }}

      />

      {/* Places [id] */}
      <Tabs.Screen
        name="places/[id]" // Ruta específica de la carpeta places
        options={{
          headerShown: false,
          title: 'Place',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'map' : 'map-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
