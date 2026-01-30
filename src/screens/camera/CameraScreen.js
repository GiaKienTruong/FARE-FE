import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

export default function CameraScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="camera-outline" size={80} color="#6366f1" />
        <Text style={styles.title}>Camera Screen</Text>
        <Text style={styles.subtitle}>Chức năng chụp ảnh sẽ có ở đây</Text>
        <Text style={styles.note}>Đang phát triển...</Text>
      </View>
    </View>
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
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 24,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 12,
    textAlign: 'center',
  },
  note: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 8,
    fontStyle: 'italic',
  },
});