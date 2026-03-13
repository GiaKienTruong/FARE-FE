import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import aiService from '../../services/aiService';
import wardrobeService from '../../services/wardrobeService';

export default function AICheckScreen() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Quyền truy cập bị từ chối', 'Vui lòng cấp quyền truy cập thư viện ảnh để sử dụng tính năng này.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setResult(null); // Reset previous result
    }
  };

  const analyzeStyle = async () => {
    if (!image) return;

    setLoading(true);
    try {
      // 1. Upload item first (Backend requires itemID for style check)
      const filename = image.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;

      const formData = new FormData();
      formData.append('image', { uri: image, name: filename, type });
      formData.append('name', 'Analyzed Item');
      formData.append('category', 'top'); // Defaulting to top for analysis
      formData.append('color', 'unknown');

      // Call wardrobe service to upload
      const uploadRes = await wardrobeService.addItem(formData);
      const itemId = uploadRes.item.id;

      // 2. Call AI Service
      const aiResponse = await aiService.checkStyle(itemId);

      // 3. Format result — support both camelCase and snake_case from backend
      const recommendations = aiResponse.recommendations || [];
      const recText = recommendations.length > 0
        ? `We found ${recommendations.length} matching items in your wardrobe!`
        : 'Nice item! Add more clothes to get better matching advice.';

      // Derive score from API response (support various field names)
      const rawScore = aiResponse.style_score ?? aiResponse.styleScore ?? aiResponse.score ?? null;
      const scoreDisplay = rawScore !== null ? `${rawScore}/10` : 'N/A';

      setResult({
        score: scoreDisplay,
        feedback: aiResponse.message || aiResponse.feedback || recText,
        tags: aiResponse.tags || ['Style Check'],
        recommendations: recommendations
      });

    } catch (error) {
      console.error('AI Check error:', error);
      Alert.alert('Error', 'Failed to analyze style. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI Style Check</Text>
      </View>

      <View style={styles.content}>
        {!image ? (
          <TouchableOpacity style={styles.uploadArea} onPress={pickImage}>
            <View style={styles.iconCircle}>
              <Ionicons name="cloud-upload-outline" size={40} color="#6366f1" />
            </View>
            <Text style={styles.uploadTitle}>Upload your outfit</Text>
            <Text style={styles.uploadSubtitle}>Tap to choose from gallery</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.previewArea}>
            <Image source={{ uri: image }} style={styles.uploadedImage} />
            <TouchableOpacity style={styles.changeBtn} onPress={pickImage}>
              <Text style={styles.changeBtnText}>Change Photo</Text>
            </TouchableOpacity>
          </View>
        )}

        {image && !result && (
          <TouchableOpacity
            style={[styles.analyzeBtn, loading && styles.analyzeBtnDisabled]}
            onPress={analyzeStyle}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Ionicons name="sparkles" size={20} color="white" />
                <Text style={styles.analyzeBtnText}>Analyze Style</Text>
              </>
            )}
          </TouchableOpacity>
        )}

        {result && (
          <View style={styles.resultCard}>
            <View style={styles.scoreRow}>
              <Text style={styles.scoreLabel}>Score:</Text>
              <Text style={styles.scoreValue}>{result.score}</Text>
            </View>
            <Text style={styles.feedbackText}>{result.feedback}</Text>
            <View style={styles.tagsRow}>
              {result.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity style={styles.resetBtn} onPress={() => {
              setImage(null);
              setResult(null);
            }}>
              <Text style={styles.resetBtnText}>Check Another</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', paddingTop: 50 },
  header: { paddingHorizontal: 20, marginBottom: 20 },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },

  content: { flex: 1, paddingHorizontal: 20 },

  uploadArea: {
    width: '100%',
    height: 300,
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed'
  },
  iconCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 15
  },
  uploadTitle: { fontSize: 18, fontWeight: '600', color: '#111827' },
  uploadSubtitle: { color: '#6B7280', marginTop: 5 },

  previewArea: { alignItems: 'center' },
  uploadedImage: { width: '100%', height: 350, borderRadius: 20, marginBottom: 15 },
  changeBtn: { padding: 10 },
  changeBtnText: { color: '#6366f1', fontWeight: '600' },

  analyzeBtn: {
    backgroundColor: '#6366f1',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 15,
    marginTop: 20,
    gap: 10
  },
  analyzeBtnDisabled: { opacity: 0.7 },
  analyzeBtnText: { color: 'white', fontSize: 16, fontWeight: 'bold' },

  resultCard: {
    marginTop: 20,
    backgroundColor: '#F3F4F6',
    padding: 20,
    borderRadius: 20
  },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  scoreLabel: { fontSize: 18, fontWeight: 'bold' },
  scoreValue: { fontSize: 24, fontWeight: 'bold', color: '#6366f1' },
  feedbackText: { color: '#4B5563', lineHeight: 22, marginBottom: 15 },
  tagsRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap', marginBottom: 15 },
  tag: { backgroundColor: 'white', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  tagText: { fontSize: 12, fontWeight: '600', color: '#374151' },

  resetBtn: { alignSelf: 'center', marginTop: 5 },
  resetBtnText: { color: '#6366f1', fontWeight: '600' }
});