import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AICheckScreen() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const pickImage = async () => {
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

  const analyzeStyle = () => {
    if (!image) return;

    setLoading(true);
    // Mock AI analysis process
    setTimeout(() => {
      setLoading(false);
      setResult({
        score: '9.5/10',
        feedback: "Amazing outfit! The color coordination is perfect for a casual summer day. Maybe add a watch to complete the look.",
        tags: ['Casual', 'Summer', 'Trendy']
      });
    }, 2000);
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