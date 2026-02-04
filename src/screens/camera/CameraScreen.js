import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CameraScreen({ navigation }) {
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Sorry, we need camera permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    if (!image) return;
    Alert.alert('Success', 'Item saved to your wardrobe!');
    navigation.navigate('Wardrobe');
    setImage(null);
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
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>Save to Wardrobe</Text>
          </TouchableOpacity>
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
    height: 400,
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
    height: 400,
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
    marginTop: 30
  },
  actionBtn: {
    flex: 0.48,
    flexDirection: 'row',
    backgroundColor: '#111827',
    paddingVertical: 15,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10
  },
  galleryBtn: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  btnText: { color: 'white', fontWeight: '600' },

  saveBtn: {
    width: '100%',
    backgroundColor: '#71D5F3',
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 20
  },
  saveBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});