import StudentCard, { type Student } from '@/components/StudentCard';
import { API_BASE_URL } from '@/constants/api';
import { useAuth } from '@/hooks/useAuth';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function StudentsScreen() {
  const { token, logout } = useAuth();

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const loadStudents = useCallback(async () => {
    if (!token) {
      setError('You are not authenticated.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${API_BASE_URL}/users`, {
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

      if (!response.ok) {
        throw new Error(
          `Failed to load students (${response.status})`,
        );
      }

      const data = await response.json();

      const studentList: Student[] = Array.isArray(data)
        ? data.map((item) => ({
          id: item.id,
          name: item.name,
          email: item.email,
          course: 'Student',
        }))
        : [];

      setStudents(studentList);
    } catch (err) {
      console.error('Load students error:', err);

      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load students.',
      );
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  const filteredStudents = students.filter((student) =>
    (student.name || '')
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Students</Text>

      <TextInput
        style={styles.input}
        accessibilityLabel="Search students"
        placeholder="Search by name"
        value={search}
        onChangeText={setSearch}
      />

      {loading ? (
        <View style={styles.state}>
          <ActivityIndicator color="#245bb2" />
          <Text style={styles.text}>Loading students...</Text>
        </View>
      ) : error ? (
        <View
          style={styles.state}
          accessibilityLiveRegion="polite"
        >
          <Text style={styles.error}>{error}</Text>

          <Pressable
            accessibilityRole="button"
            onPress={loadStudents}
          >
            <Text style={styles.link}>Try Again</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={filteredStudents}
          keyExtractor={(item, index) =>
            String(item.id ?? index)
          }
          renderItem={({ item }) => (
            <StudentCard student={item} />
          )}
          ListEmptyComponent={
            <View style={styles.state}>
              <Text style={styles.text}>
                No students found.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f2f5fa',
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#17324d',
    marginBottom: 20,
  },

  input: {
    padding: 14,
    borderWidth: 1,
    borderColor: '#c6d2e1',
    borderRadius: 8,
    backgroundColor: '#ffffff',
    color: '#17324d',
    marginBottom: 20,
  },

  state: {
    padding: 24,
    gap: 12,
    alignItems: 'center',
  },

  text: {
    color: '#536579',
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
});