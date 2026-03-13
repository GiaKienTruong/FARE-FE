import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system/legacy';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import aiService from '../../services/aiService';

export default function TryOnScreen({ route, navigation }) {
    const { selectedGarment } = route.params || {};

    const [personImage, setPersonImage] = useState(null);
    const [garmentImage, setGarmentImage] = useState(null);
    const [resultImage, setResultImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            const response = await aiService.getHistory(10, 0);
            if (response.success) {
                setHistory(response.data);
            }
        } catch (e) {
            console.error('Failed to load history:', e);
        }
    };

    useEffect(() => {
        if (selectedGarment) {
            setGarmentImage(selectedGarment);
        }
    }, [selectedGarment]);

    const pickImage = async (setImage) => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission needed', 'Please grant camera roll permissions.');
                return;
            }
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 0.8,
            });
            if (!result.canceled) {
                setImage(result.assets[0].uri);
                setResultImage(null);
            }
        } catch (error) {
            console.error("Error picking image:", error);
        }
    };

    const handleTryOn = async () => {
        if (!personImage || !garmentImage) {
            Alert.alert('Missing Images', 'Please select both a person photo and a garment photo.');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();

            const personFilename = personImage.split('/').pop();
            const personType = /\.(\w+)$/.exec(personFilename)?.[1] || 'jpeg';
            formData.append('person_image', {
                uri: personImage,
                name: personFilename,
                type: `image/${personType}`
            });

            if (garmentImage.startsWith('http')) {
                formData.append('garment_image_url', garmentImage);
            } else {
                const garmentFilename = garmentImage.split('/').pop();
                const garmentType = /\.(\w+)$/.exec(garmentFilename)?.[1] || 'jpeg';
                formData.append('garment_image', {
                    uri: garmentImage,
                    name: garmentFilename,
                    type: `image/${garmentType}`
                });
            }

            const response = await aiService.generateTryOn(formData);
            const responseData = response?.data || response;
            const tryonId = responseData?.id;

            if (responseData?.status === 'processing' && tryonId) {
                // Start polling
                startPolling(tryonId);
            } else {
                const resultUrl =
                    responseData?.result_image_url ||
                    responseData?.resultImageUrl ||
                    responseData?.image_url ||
                    responseData?.imageUrl ||
                    responseData?.result ||
                    null;

                if (resultUrl) {
                    setResultImage(resultUrl);
                    loadHistory();
                    setLoading(false);
                } else {
                    console.warn('Unexpected AI response structure:', JSON.stringify(response));
                    Alert.alert('Error', 'Received unexpected response from AI service.');
                    setLoading(false);
                }
            }
        } catch (error) {
            console.error('Try-On error:', error);
            Alert.alert('Error', 'Failed to generate Virtual Try-On. Please try again.');
            setLoading(false);
        }
    };

    const startPolling = (id) => {
        console.log(`🔍 Starting polling for task: ${id}`);
        // Poll every 5 seconds for Fal.ai (which takes ~10s)
        const intervalId = setInterval(async () => {
            try {
                const response = await aiService.getTryOnResult(id);
                const data = response?.data || response;

                if (data.status === 'completed') {
                    clearInterval(intervalId);
                    setResultImage(data.result_image_url || data.resultImageUrl);
                    setLoading(false);
                    loadHistory();
                    Alert.alert('✨ Success!', 'Your virtual try-on is ready!');
                } else if (data.status === 'failed') {
                    clearInterval(intervalId);
                    setLoading(false);
                    Alert.alert('Error', 'AI processing failed: ' + (data.error_message || 'Unknown error'));
                } else {
                    console.log(`Still processing task ${id} (Fal.ai)...`);
                }
            } catch (error) {
                console.error('Polling error:', error);
                // Don't stop polling on single network error, wait for next attempt
            }
        }, 5000);

        // Store interval internally if needed for cleanup
    };

    const handleSaveToGallery = async () => {
        if (!resultImage) return;

        setSaving(true);
        try {
            // Request Media Library permission
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    'Permission Required',
                    'Please allow access to your gallery to save photos.',
                    [{ text: 'OK' }]
                );
                setSaving(false);
                return;
            }

            let fileUri;

            if (resultImage.startsWith('data:image')) {
                // Base64 image - save to temp file first
                const base64Data = resultImage.split(',')[1];
                fileUri = FileSystem.cacheDirectory + `tryon_${Date.now()}.png`;
                await FileSystem.writeAsStringAsync(fileUri, base64Data, {
                    encoding: 'base64',  // Use string literal instead of FileSystem.EncodingType.Base64
                });
            } else if (resultImage.startsWith('http')) {
                // URL - download it first
                fileUri = FileSystem.cacheDirectory + `tryon_${Date.now()}.png`;
                const downloadResult = await FileSystem.downloadAsync(resultImage, fileUri);
                fileUri = downloadResult.uri;
            } else {
                fileUri = resultImage;
            }

            // Save to device gallery in "FARE" album
            const asset = await MediaLibrary.createAssetAsync(fileUri);
            await MediaLibrary.createAlbumAsync('FARE', asset, false);

            Alert.alert(
                'Saved!',
                'Save successfully!',
                [{ text: 'Great!' }]
            );
        } catch (error) {
            console.error('Save error:', error);
            Alert.alert('Error', 'Failed to save image. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 50 }}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <View>
                    <Text style={styles.title}>Virtual Try-On</Text>
                    <Text style={styles.subtitle}>See how clothes look on you</Text>
                </View>
                <View style={{ width: 24 }} />
            </View>

            {/* Input Section */}
            <View style={styles.inputContainer}>
                {/* Person Input */}
                <View style={styles.inputCard}>
                    <Text style={styles.label}>Your Photo</Text>
                    <TouchableOpacity style={styles.imageBox} onPress={() => pickImage(setPersonImage)}>
                        {personImage ? (
                            <Image source={{ uri: personImage }} style={styles.previewImage} resizeMode="cover" />
                        ) : (
                            <View style={styles.placeholder}>
                                <Ionicons name="person" size={30} color="#ccc" />
                                <Text style={styles.placeholderText}>Select Photo</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                <Ionicons name="add-circle" size={30} color="#ccc" style={{ alignSelf: 'center', marginTop: 20 }} />

                {/* Garment Input */}
                <View style={styles.inputCard}>
                    <Text style={styles.label}>Garment Photo</Text>
                    <TouchableOpacity style={styles.imageBox} onPress={() => pickImage(setGarmentImage)}>
                        {garmentImage ? (
                            <Image source={{ uri: garmentImage }} style={styles.previewImage} resizeMode="cover" />
                        ) : (
                            <View style={styles.placeholder}>
                                <Ionicons name="shirt" size={30} color="#ccc" />
                                <Text style={styles.placeholderText}>Select Garment</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            {/* Tip */}
            <View style={styles.tipBox}>
                <Ionicons name="information-circle-outline" size={16} color="#71D5F3" />
                <Text style={styles.tipText}>Tip: Stand straight with a simple background for best results</Text>
            </View>

            {/* Recent Results Section */}
            {history.length > 0 && (
                <View style={styles.historyContainer}>
                    <View style={styles.historyHeader}>
                        <Text style={styles.historyTitle}>Recent Results</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('TryOnHistory')}>
                            <Text style={styles.seeAllText}>See All</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.historyScroll}>
                        {history.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.historyCard}
                                onPress={() => {
                                    setResultImage(item.result_image_url);
                                    setPersonImage(item.person_image_url);
                                    // Optionally load garment if we have garment_id/url
                                    if (item.garment_image_url) setGarmentImage(item.garment_image_url);
                                }}
                            >
                                <Image source={{ uri: item.result_image_url }} style={styles.historyThumb} />
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}

            {/* Action Button */}
            <TouchableOpacity
                style={[styles.generateBtn, loading && styles.disabledBtn, { marginTop: 20 }]}
                onPress={handleTryOn}
                disabled={loading}
            >
                {loading ? (
                    <>
                        <ActivityIndicator color="white" style={{ marginRight: 10 }} />
                        <Text style={styles.generateBtnText}>Please wait...</Text>
                    </>
                ) : (
                    <>
                        <Ionicons name="sparkles" size={20} color="white" style={{ marginRight: 8 }} />
                        <Text style={styles.generateBtnText}>Generate Try-On</Text>
                    </>
                )}
            </TouchableOpacity>

            {/* Result Section */}
            {resultImage && (
                <View style={styles.resultContainer}>
                    <Text style={styles.resultTitle}>✨ Result</Text>
                    <Image source={{ uri: resultImage }} style={styles.resultImage} resizeMode="contain" />
                    <TouchableOpacity
                        style={[styles.saveBtn, saving && styles.disabledBtn]}
                        onPress={handleSaveToGallery}
                        disabled={saving}
                    >
                        {saving ? (
                            <ActivityIndicator size="small" color="#71D5F3" />
                        ) : (
                            <>
                                <Ionicons name="download-outline" size={20} color="#71D5F3" />
                                <Text style={styles.saveBtnText}>Save to Gallery</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            )}

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', paddingTop: 50 },
    header: {
        paddingHorizontal: 20,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    backBtn: { padding: 5 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#111827', textAlign: 'center' },
    subtitle: { fontSize: 13, color: '#6B7280', marginTop: 2, textAlign: 'center' },

    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    inputCard: { width: '42%' },
    label: { fontSize: 14, fontWeight: '600', marginBottom: 10, color: '#374151', textAlign: 'center' },
    imageBox: {
        height: 180,
        backgroundColor: '#F3F4F6',
        borderRadius: 15,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center'
    },
    placeholder: { alignItems: 'center' },
    placeholderText: { fontSize: 12, color: '#9CA3AF', marginTop: 5 },
    previewImage: { width: '100%', height: '100%' },

    tipBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        marginBottom: 20,
        padding: 10,
        backgroundColor: '#E8F8FD',
        borderRadius: 10,
        gap: 6,
    },
    tipText: { fontSize: 12, color: '#3AAFA9', flex: 1 },

    generateBtn: {
        marginHorizontal: 20,
        backgroundColor: '#71D5F3',
        height: 56,
        borderRadius: 28,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        shadowColor: '#71D5F3',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5
    },
    disabledBtn: { opacity: 0.7 },
    generateBtnText: { color: 'white', fontSize: 18, fontWeight: 'bold' },

    resultContainer: {
        marginHorizontal: 20,
        padding: 20,
        backgroundColor: '#F9FAFB',
        borderRadius: 20,
        alignItems: 'center'
    },
    resultTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, alignSelf: 'flex-start' },
    resultImage: { width: '100%', height: 400, borderRadius: 10, marginBottom: 20 },
    saveBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 12,
        paddingHorizontal: 24,
        backgroundColor: '#E8F8FD',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#71D5F3',
    },
    saveBtnText: { fontWeight: '700', color: '#71D5F3', fontSize: 15 },

    // History Styles
    historyContainer: { marginTop: 30, paddingHorizontal: 20 },
    historyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12
    },
    historyTitle: { fontSize: 16, fontWeight: '700', color: '#111' },
    seeAllText: { fontSize: 13, color: '#71D5F3', fontWeight: '600' },
    historyScroll: { gap: 12 },
    historyCard: {
        width: 100,
        height: 140,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#F3F4F6'
    },
    historyThumb: { width: '100%', height: '100%' },
});
