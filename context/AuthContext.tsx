import * as SecureStore from 'expo-secure-store';
import {
  createContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { Platform } from 'react-native';

export type User = {
  id?: string | number;
  name?: string;
  email?: string;
  role?: string;
};

type AuthContextValue = {
  token: string | null;
  user: User | null;
  authLoading: boolean;
  login: (accessToken: string, userData: User) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

const TOKEN_KEY = 'student_token';
const USER_KEY = 'student_user';

async function saveToken(token: string) {
  if (Platform.OS === 'web') {
    localStorage.setItem(TOKEN_KEY, token);
    return;
  }

  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

async function getSavedToken() {
  if (Platform.OS === 'web') {
    return localStorage.getItem(TOKEN_KEY);
  }

  return SecureStore.getItemAsync(TOKEN_KEY);
}

async function saveUser(user: User) {
  const userData = JSON.stringify(user);

  if (Platform.OS === 'web') {
    localStorage.setItem(USER_KEY, userData);
    return;
  }

  await SecureStore.setItemAsync(USER_KEY, userData);
}

async function getSavedUser(): Promise<User | null> {
  let userData: string | null;

  if (Platform.OS === 'web') {
    userData = localStorage.getItem(USER_KEY);
  } else {
    userData = await SecureStore.getItemAsync(USER_KEY);
  }

  if (!userData) {
    return null;
  }

  try {
    return JSON.parse(userData) as User;
  } catch {
    return null;
  }
}

async function removeSavedSession() {
  if (Platform.OS === 'web') {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    return;
  }

  await SecureStore.deleteItemAsync(TOKEN_KEY);
  await SecureStore.deleteItemAsync(USER_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const login = useCallback(
    async (accessToken: string, userData: User) => {
      await saveToken(accessToken);
      await saveUser(userData);

      setToken(accessToken);
      setUser(userData);
    },
    [],
  );

  const logout = useCallback(async () => {
    await removeSavedSession();

    setToken(null);
    setUser(null);
  }, []);

  const restoreSession = useCallback(async () => {
    try {
      setAuthLoading(true);

      const savedToken = await getSavedToken();
      const savedUser = await getSavedUser();

      if (savedToken) {
        setToken(savedToken);
        setUser(savedUser);
      } else {
        setToken(null);
        setUser(null);
      }
    } catch (error) {
      console.error('Session restoration error:', error);

      setToken(null);
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        authLoading,
        login,
        logout,
        restoreSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}