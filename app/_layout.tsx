import { AuthProvider } from '@/context/AuthContext';
import { useAuth } from '@/hooks/useAuth';
import { Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

function RootNavigator() {
  const { authLoading } = useAuth();

  if (authLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator size="large" color="#245bb2" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerTintColor: '#17324d' }}>
      <Stack.Screen
        name="sign-in"
        options={{ title: 'Sign In' }}
      />

      <Stack.Screen
        name="(app)"
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="student/[id]"
        options={{ title: 'Student Details' }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}