import { useAuth } from '@/hooks/useAuth';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function SignInScreen() {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setError('Please enter your email and password.');
      return;
    }

    if (!trimmedEmail.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      await login('student-token', {
        id: 1,
        name: 'Student User',
        email: trimmedEmail,
        role: 'Student',
      });

      console.log('LOGIN SUCCESS');
      console.log('TOKEN SAVED');
      console.log('GOING TO DASHBOARD');

      Alert.alert('Success', 'LOGIN SUCCESS');

      router.replace('/');
    } catch (err) {
      console.error('Login error:', err);

      setError(
        err instanceof Error
          ? err.message
          : 'Unable to sign in.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.card}>
        <Text style={styles.eyebrow}>
          CCE106 • PRACTICAL EXAMINATION
        </Text>

        <Text style={styles.title}>Student Service Portal</Text>

        <Text style={styles.subtitle}>
          Sign in to access student services.
        </Text>

        <Text style={styles.label}>Email</Text>

        <TextInput
          style={styles.input}
          accessibilityLabel="Email"
          placeholder="student@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!loading}
        />

        <Text style={styles.label}>Password</Text>

        <TextInput
          style={styles.input}
          accessibilityLabel="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!loading}
        />

        <View
          style={styles.feedback}
          accessibilityLiveRegion="polite"
        >
          {loading && (
            <ActivityIndicator
              color="#245bb2"
              accessibilityLabel="Signing in"
            />
          )}

          {error ? (
            <Text style={styles.error}>{error}</Text>
          ) : null}
        </View>

        <Pressable
          accessibilityRole="button"
          style={[
            styles.button,
            loading && styles.buttonDisabled,
          ]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Signing in...' : 'Login'}
          </Text>
        </Pressable>

        <Text style={styles.note}>
          Enter your student credentials to continue.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f2f5fa',
  },

  card: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
    padding: 24,
    borderRadius: 16,
    backgroundColor: '#ffffff',
  },

  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: '#245bb2',
    marginBottom: 12,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#17324d',
  },

  subtitle: {
    color: '#536579',
    marginTop: 8,
    marginBottom: 24,
  },

  label: {
    color: '#17324d',
    fontWeight: '600',
    marginBottom: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: '#c6d2e1',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    marginBottom: 16,
    color: '#17324d',
    backgroundColor: '#ffffff',
  },

  feedback: {
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  error: {
    color: '#b42318',
    textAlign: 'center',
  },

  button: {
    backgroundColor: '#245bb2',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: '#ffffff',
    fontWeight: '700',
  },

  note: {
    color: '#536579',
    fontSize: 12,
    marginTop: 20,
  },
});