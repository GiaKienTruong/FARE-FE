import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

export function AICheckScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="sparkles-outline" size={80} color="#6366f1" />
        <Text style={styles.title}>AI Style Check</Text>
        <Text style={styles.subtitle}>AI sẽ gợi ý phối đồ ở đây</Text>
        <Text style={styles.note}>Đang phát triển...</Text>
      </View>
    </View>
  );
}