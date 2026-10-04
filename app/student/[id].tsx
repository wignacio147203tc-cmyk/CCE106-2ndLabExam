import { type Student } from '@/components/StudentCard';
import { API_BASE_URL } from '@/constants/api';
import { useAuth } from '@/hooks/useAuth';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function StudentDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { token, logout } = useAuth();

  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadStudent = useCallback(async () => {
    if (!id) {
      setError('Student ID is missing.');
      setLoading(false);
      return;
    }

    if (!token) {
      setError('You are not authenticated.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      setStudent(null);

      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        await logout();
        return;
      }

      if (response.status === 404) {
        setError('Student record not found.');
        return;
      }

      if (!response.ok) {
        throw new Error(
          `Failed to load student (${response.status})`,
        );
      }

      const data = await response.json();

      if (!data || !data.id) {
        setError('Student record not found.');
        return;
      }

      const studentData: Student = {
        id: data.id,
        name: data.name,
        email: data.email,
        course: 'Student',
      };

      setStudent(studentData);
    } catch (err) {
      console.error('Load student error:', err);

      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load student details.',
      );
    } finally {
      setLoading(false);
    }
  }, [id, token, logout]);

  useEffect(() => {
    loadStudent();
  }, [loadStudent]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Student Details</Text>

      {loading ? (
        <View style={styles.state}>
          <ActivityIndicator color="#245bb2" />
          <Text style={styles.text}>Loading student...</Text>
        </View>
      ) : error ? (
        <View style={styles.state}>
          <Text style={styles.error}>{error}</Text>

          <Pressable
            accessibilityRole="button"
            onPress={loadStudent}
          >
            <Text style={styles.link}>Try Again</Text>
          </Pressable>
        </View>
      ) : !student ? (
        <View style={styles.state}>
          <Text style={styles.text}>
            No student record available.
          </Text>
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.label}>Student ID</Text>
          <Text style={styles.text}>{student.id}</Text>

          <Text style={styles.label}>Name</Text>
          <Text style={styles.text}>
            {student.name || 'Not available'}
          </Text>

          <Text style={styles.label}>Email</Text>
          <Text style={styles.text}>
            {student.email || 'Not available'}
          </Text>

          <Text style={styles.label}>Course</Text>
          <Text style={styles.text}>
            {student.course || 'Not available'}
          </Text>
        </View>
      )}

      <Pressable
        accessibilityRole="button"
        style={styles.button}
        onPress={() => router.back()}
      >
        <Text style={styles.buttonText}>Back</Text>
      </Pressable>
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
    fontSize: 28,
    fontWeight: '700',
  },

  state: {
    gap: 12,
    alignItems: 'center',
    padding: 24,
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