import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import wardrobeService from '../../services/wardrobeService';

export default function CameraScreen({ navigation }) {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'We need camera permission to take photos.');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Navigate to AddItemScreen so user can fill in details + upload properly
  const handleContinue = () => {
    if (!image) return;
    navigation.navigate('AddItem', { prefillImageUri: image });
  };

  // Quick save: upload with default metadata directly
  const handleQuickSave = async () => {
    if (!image) return;

    setUploading(true);
    try {
      const filename = image.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      const formData = new FormData();
      formData.append('image', { uri: image, name: filename, type });
      formData.append('name', `Photo ${new Date().toLocaleDateString()}`);
      formData.append('category', 'top');
      formData.append('color', 'unknown');

      await wardrobeService.addItem(formData);
      Alert.alert('✅ Saved!', 'Item added to your wardrobe!', [
        { text: 'OK', onPress: () => { setImage(null); navigation.navigate('Wardrobe'); } }
      ]);
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', 'Failed to save item. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Add New Item</Text>
      </View>

      <View style={styles.content}>
        {image ? (
          <View style={styles.previewContainer}>
            <Image source={{ uri: image }} style={styles.previewImage} />
            <TouchableOpacity style={styles.retakeBtn} onPress={() => setImage(null)}>
              <Ionicons name="close-circle" size={30} color="white" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.placeholderContainer}>
            <Ionicons name="shirt-outline" size={100} color="#E5E7EB" />
            <Text style={styles.placeholderText}>No image selected</Text>
          </View>
        )}

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionBtn} onPress={takePhoto}>
            <Ionicons name="camera" size={24} color="#FFF" />
            <Text style={styles.btnText}>Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionBtn, styles.galleryBtn]} onPress={pickImage}>
            <Ionicons name="images" size={24} color="#333" />
            <Text style={[styles.btnText, { color: '#333' }]}>Gallery</Text>
          </TouchableOpacity>
        </View>

        {image && (
          <View style={styles.saveButtons}>
            {/* Add details then save */}
            <TouchableOpacity style={styles.continueBtn} onPress={handleContinue}>
              <Ionicons name="create-outline" size={20} color="#6366f1" style={{ marginRight: 6 }} />
              <Text style={styles.continueBtnText}>Add Details</Text>
            </TouchableOpacity>

            {/* Quick save with default metadata */}
            <TouchableOpacity
              style={[styles.saveBtn, uploading && { opacity: 0.6 }]}
              onPress={handleQuickSave}
              disabled={uploading}
            >
              {uploading
                ? <ActivityIndicator color="white" />
                : <>
                  <Ionicons name="checkmark-circle-outline" size={20} color="white" style={{ marginRight: 6 }} />
                  <Text style={styles.saveBtnText}>Quick Save</Text>
                </>
              }
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

  content: { flex: 1, alignItems: 'center', paddingHorizontal: 20 },

  placeholderContainer: {
    width: '100%',
    height: 380,
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed'
  },
  placeholderText: { marginTop: 10, color: '#9CA3AF' },

  previewContainer: {
    width: '100%',
    height: 380,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#F0F0F0'
  },
  previewImage: { width: '100%', height: '100%' },
  retakeBtn: { position: 'absolute', top: 10, right: 10 },

  actionButtons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  actionBtn: {
    flex: 0.48,
    flexDirection: 'row',
    backgroundColor: '#111827',
    paddingVertical: 14,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  galleryBtn: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  btnText: { color: 'white', fontWeight: '600' },

  saveButtons: { width: '100%', marginTop: 16, gap: 12 },
  continueBtn: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: '#6366f1',
    backgroundColor: '#EEF2FF',
  },
  continueBtnText: { color: '#6366f1', fontWeight: '700', fontSize: 15 },

  saveBtn: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#71D5F3',
    paddingVertical: 14,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: { color: 'white', fontWeight: 'bold', fontSize: 15 },
});