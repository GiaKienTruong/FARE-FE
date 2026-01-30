// src/screens/auth/LoginScreen.js
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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
        // Đăng nhập
        await signInWithEmailAndPassword(auth, email, password);
        Alert.alert('Thành công', 'Đăng nhập thành công!');
      } else {
        // Đăng ký
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
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
          // Không cần Alert vì có thể user đã tồn tại, nhưng Firebase auth đã thành công
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
        <Text style={styles.logo}>FARE</Text>
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

          {/* Development tools */}
          {__DEV__ && (
            <>
              <TouchableOpacity
                style={styles.quickLoginBtn}
                onPress={quickLogin}
              >
                <Text style={styles.quickLoginText}>🧪 Quick Login (test)</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.testBtn}
                onPress={testConnection}
              >
                <Text style={styles.testBtnText}>🔗 Test Backend Connection</Text>
              </TouchableOpacity>
            </>
          )}
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
  logo: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#6366f1',
    textAlign: 'center',
    marginBottom: 8,
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
    backgroundColor: '#6366f1',
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
    color: '#6366f1',
    fontSize: 14,
  },
  quickLoginBtn: {
    marginTop: 24,
    padding: 12,
    backgroundColor: '#fef3c7',
    borderRadius: 8,
    alignItems: 'center',
  },
  quickLoginText: {
    color: '#92400e',
    fontSize: 12,
    fontWeight: '600',
  },
  testBtn: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#e0f2fe',
    borderRadius: 8,
    alignItems: 'center',
  },
  testBtnText: {
    color: '#0369a1',
    fontSize: 12,
    fontWeight: '600',
  },
});