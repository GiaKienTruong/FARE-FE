import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

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
