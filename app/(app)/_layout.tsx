import { useAuth } from '@/hooks/useAuth';
import { Redirect, Tabs } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

export default function AppLayout() {
  const { token, authLoading } = useAuth();

  if (authLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!token) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#245bb2',
        headerTintColor: '#17324d',
        tabBarIconStyle: { display: 'none' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Home' }}
      />

      <Tabs.Screen
        name="students"
        options={{ title: 'Students' }}
      />

      <Tabs.Screen
        name="profile"
        options={{ title: 'Profile' }}
      />
    </Tabs>
  );
}