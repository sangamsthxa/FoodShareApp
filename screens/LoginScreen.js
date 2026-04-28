import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword
} from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { auth, db } from '../config';

export default function LoginScreen() {
  const router = useRouter();
  const { manual } = useLocalSearchParams();
  const isManualLogin = manual === 'true';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const getFriendlyAuthError = (error) => {
    const code = error?.code || '';

    if (code.includes('invalid-email')) return 'Please enter a valid email address.';
    if (code.includes('missing-password')) return 'Please enter your password.';
    if (code.includes('weak-password')) return 'Password must be at least 6 characters long.';
    if (code.includes('email-already-in-use')) return 'This email is already registered. Please log in.';
    if (code.includes('user-not-found')) return 'No account found with this email. Please sign up first.';
    if (code.includes('wrong-password') || code.includes('invalid-credential')) return 'Email or password is incorrect.';
    if (code.includes('too-many-requests')) return 'Too many attempts. Please wait a moment and try again.';
    if (code.includes('network-request-failed')) return 'Network issue. Please check your internet and try again.';
    if (code.includes('permission-denied')) return 'Your request could not be completed due to app permissions.';

    return 'Something went wrong. Please try again.';
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && !isManualLogin) {
        router.replace('/main');
      }
    });

    return unsubscribe;
  }, [isManualLogin, router]);

  const handleAuth = async () => {
    setSuccessMessage('');
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Please fill in all fields');
      return;
    }
    if (!isLogin && (!phoneNumber || !address || !gender)) {
      setErrorMessage('Please fill in phone number, address, and gender');
      return;
    }
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        router.replace('/main');
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Keep account creation successful even if profile write is blocked by Firestore rules.
        try {
          await setDoc(doc(db, 'users', userCredential.user.uid), {
            email,
            phoneNumber,
            address,
            gender,
            createdAt: serverTimestamp(),
          });
        } catch (profileError) {
          console.warn('User profile save failed after signup:', profileError);
        }

        setSuccessMessage('Account created successfully. Redirecting to main...');
        setTimeout(() => router.replace('/main'), 900);
      }
    } catch (error) {
      console.error('Authentication failed:', error);
      setErrorMessage(getFriendlyAuthError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* Logo / Title */}
      <View style={styles.header}>
        <Text style={styles.emoji}>🥗</Text>
        <Text style={styles.title}>FoodShare</Text>
        <Text style={styles.subtitle}>Share food, reduce waste</Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        {!!successMessage && (
          <View style={styles.successBanner}>
            <Text style={styles.successText}>{successMessage}</Text>
          </View>
        )}
        {!!errorMessage && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {!isLogin && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
            <TextInput
              style={styles.input}
              placeholder="Address"
              value={address}
              onChangeText={setAddress}
            />
            <TextInput
              style={styles.input}
              placeholder="Gender"
              value={gender}
              onChangeText={setGender}
            />
          </>
        )}

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleAuth}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {isLogin ? 'Login' : 'Sign Up'}
            </Text>
          )}
        </TouchableOpacity>

        {/* Toggle Login/Signup */}
        <TouchableOpacity
          onPress={() => {
            setIsLogin(!isLogin);
            setSuccessMessage('');
            setErrorMessage('');
          }}
        >
          <Text style={styles.toggleText}>
            {isLogin
              ? "Don't have an account? Sign Up"
              : 'Already have an account? Login'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  emoji: {
    fontSize: 60,
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    marginTop: 4,
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  successBanner: {
    backgroundColor: '#e8f5e9',
    borderWidth: 1,
    borderColor: '#c8e6c9',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  successText: {
    color: '#2e7d32',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
  errorBanner: {
    backgroundColor: '#ffebee',
    borderWidth: 1,
    borderColor: '#ef9a9a',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  button: {
    backgroundColor: '#2e7d32',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  toggleText: {
    textAlign: 'center',
    color: '#2e7d32',
    fontSize: 14,
  },
});