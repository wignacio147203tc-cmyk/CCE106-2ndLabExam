import { useAuth } from '@/hooks/useAuth';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type ProfileData = {
  id?: string | number;
  name?: string;
  email?: string;
  role?: string;
};

export default function ProfileScreen() {
  const { user, token, logout } = useAuth();

  const [profile, setProfile] = useState<ProfileData | null>(user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadProfile = useCallback(async () => {
    if (!token) {
      setProfile(null);
      setError('You are not authenticated.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const profileData: ProfileData = {
        id: user?.id ?? 1,
        name: user?.name ?? 'Student User',
        email: user?.email ?? 'student@example.com',
        role: user?.role ?? 'Student',
      };

      setProfile(profileData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load profile.',
      );
    } finally {
      setLoading(false);
    }
  }, [token, user]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const displayProfile = profile || user;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>MY PROFILE</Text>

      {loading ? (
        <View style={styles.state}>
          <ActivityIndicator color="#245bb2" />
          <Text style={styles.text}>Loading profile...</Text>
        </View>
      ) : error ? (
        <View style={styles.state}>
          <Text style={styles.error}>{error}</Text>

          <Pressable
            accessibilityRole="button"
            onPress={loadProfile}
          >
            <Text style={styles.link}>Try Again</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.text}>
            {displayProfile?.name || 'Not available'}
          </Text>

          <Text style={styles.label}>Email</Text>
          <Text style={styles.text}>
            {displayProfile?.email || 'Not available'}
          </Text>

          <Text style={styles.label}>Role</Text>
          <Text style={styles.text}>
            {displayProfile?.role || 'Not available'}
          </Text>

          {displayProfile?.id !== undefined ? (
            <>
              <Text style={styles.label}>ID</Text>
              <Text style={styles.text}>
                {String(displayProfile.id)}
              </Text>
            </>
          ) : null}
        </View>
      )}

      <Text style={styles.text}>
        Session Status:{' '}
        {token ? 'Authenticated' : 'Not Available'}
      </Text>

      <Pressable
        accessibilityRole="button"
        style={styles.button}
        onPress={logout}
      >
        <Text style={styles.buttonText}>LOGOUT</Text>
      </Pressable>

      <Text style={styles.note}>
        Your session is protected using the authentication context.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    gap: 20,
    backgroundColor: '#f2f5fa',
  },

  title: {
    color: '#17324d',
    fontSize: 24,
    fontWeight: '700',
  },

  state: {
    padding: 24,
    gap: 12,
    alignItems: 'center',
  },

  card: {
    backgroundColor: '#ffffff',
    padding: 20,
    gap: 8,
    borderRadius: 12,
  },

  label: {
    color: '#17324d',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 8,
  },

  text: {
    color: '#536579',
    fontSize: 16,
  },

  error: {
    color: '#b42318',
    textAlign: 'center',
  },

  link: {
    color: '#245bb2',
    padding: 12,
    fontWeight: '600',
  },

  note: {
    color: '#536579',
    fontSize: 12,
  },

  button: {
    backgroundColor: '#245bb2',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },

  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});