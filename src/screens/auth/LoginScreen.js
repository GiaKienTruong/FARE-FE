// src/screens/auth/LoginScreen.js
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import api from '../../config/api';
import { auth } from '../../config/firebase';
import { testBackendConnection } from '../../utils/testAPI';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập email và mật khẩu');
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        // Đăng nhập (compat mode)
        await auth.signInWithEmailAndPassword(email, password);
        Alert.alert('Thành công', 'Đăng nhập thành công!');
      } else {
        // Đăng ký (compat mode)
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);

        // Đăng ký user vào backend
        try {
          const response = await api.post('/api/auth/register', {
            email: email,
            displayName: email.split('@')[0],
            height: 170,
            weight: 65,
            gender: 'male',
          });
          console.log('✅ Backend registration success:', response.data);
          Alert.alert('Thành công', 'Đăng ký thành công!');
        } catch (error) {
          console.log('⚠️ Backend registration error:', error);
          Alert.alert('Thành công', 'Đăng ký thành công! (Backend sync sẽ diễn ra sau)');
        }
      }
    } catch (error) {
      let message = 'Có lỗi xảy ra';

      if (error.code === 'auth/invalid-email') {
        message = 'Email không hợp lệ';
      } else if (error.code === 'auth/user-not-found') {
        message = 'Tài khoản không tồn tại';
      } else if (error.code === 'auth/wrong-password') {
        message = 'Mật khẩu không đúng';
      } else if (error.code === 'auth/email-already-in-use') {
        message = 'Email đã được sử dụng';
      } else if (error.code === 'auth/weak-password') {
        message = 'Mật khẩu phải có ít nhất 6 ký tự';
      }

      Alert.alert('Lỗi', message);
    } finally {
      setLoading(false);
    }
  };

  // Quick login cho test
  const quickLogin = () => {
    setEmail('test@fare.com');
    setPassword('123456');
  };

  // Test backend connection
  const testConnection = async () => {
    const result = await testBackendConnection();
    Alert.alert(
      result.success ? '✅ Kết nối thành công!' : '❌ Kết nối thất bại',
      result.success
        ? `Backend đang chạy!\n${JSON.stringify(result.data, null, 2)}`
        : `Lỗi: ${result.error}\n\nHãy chắc chắn backend đang chạy:\ncd fare-backend && npm run dev`
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Image source={require('../../../src/assets/logo.png')} style={styles.logoImage} />
        <Text style={styles.subtitle}>AI Virtual Try-On</Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TextInput
            style={styles.input}
            placeholder="Mật khẩu"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleAuth}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>
                {isLogin ? 'Đăng nhập' : 'Đăng ký'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.switchButton}
            onPress={() => setIsLogin(!isLogin)}
          >
            <Text style={styles.switchText}>
              {isLogin ? 'Chưa có tài khoản? Đăng ký' : 'Đã có tài khoản? Đăng nhập'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  logoImage: {
    width: 350,
    height: 350,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 48,
  },
  form: {
    width: '100%',
  },
  input: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  button: {
    backgroundColor: '#71D5F3',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  switchButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  switchText: {
    color: '#71D5F3',
    fontSize: 14,
  },
});