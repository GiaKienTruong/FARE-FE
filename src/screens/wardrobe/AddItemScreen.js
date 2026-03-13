import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import wardrobeService from '../../services/wardrobeService';

const CATEGORIES = ['Top', 'Bottom', 'Shoes', 'Dress', 'Accessory'];
const OCCASIONS = ['Casual', 'Formal', 'Party', 'Sport', 'Work'];
const COLORS = ['Black', 'White', 'Blue', 'Red', 'Green', 'Yellow', 'Pink', 'Other'];

export default function AddItemScreen({ navigation }) {
    const [image, setImage] = useState(null);
    const [name, setName] = useState('');
    const [category, setCategory] = useState('Top');
    const [color, setColor] = useState('Black');
    const [occasion, setOccasion] = useState('Casual'); // Single select for MVP
    const [loading, setLoading] = useState(false);

    const pickImage = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission needed', 'Allow access to gallery to pick image.');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 0.8,
            });

            if (!result.canceled) {
                setImage(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Pick image error:', error);
        }
    };

    const takePhoto = async () => {
        try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission needed', 'Allow access to camera to take photo.');
                return;
            }

            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                quality: 0.8,
            });

            if (!result.canceled) {
                setImage(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Camera error:', error);
        }
    };

    const handleSave = async () => {
        if (!image) {
            Alert.alert('Missing Image', 'Please select or take a photo of the item.');
            return;
        }
        if (!name.trim()) {
            Alert.alert('Missing Name', 'Please give this item a name.');
            return;
        }

        setLoading(true);
        try {
            const filename = image.split('/').pop();
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : `image/jpeg`;

            const formData = new FormData();
            formData.append('image', { uri: image, name: filename, type });
            formData.append('name', name);
            formData.append('category', category.toLowerCase());
            formData.append('color', color.toLowerCase());
            formData.append('tags', occasion.toLowerCase()); // Using tags for occasion

            await wardrobeService.addItem(formData);
            Alert.alert('Success', 'Item added to wardrobe!', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            console.error('Upload error:', error);
            Alert.alert('Error', 'Failed to save item. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Add New Item</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Image Picker Section */}
                <View style={styles.imageSection}>
                    {image ? (
                        <View style={styles.imageWrapper}>
                            <Image source={{ uri: image }} style={styles.previewImage} />
                            <TouchableOpacity style={styles.retakeBtn} onPress={() => setImage(null)}>
                                <Ionicons name="close-circle" size={24} color="#FF5252" />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.placeholderContainer}>
                            <Text style={styles.placeholderLabel}>Item Photo</Text>
                            <View style={styles.imageButtons}>
                                <TouchableOpacity style={styles.actionBtn} onPress={takePhoto}>
                                    <Ionicons name="camera" size={30} color="#6366f1" />
                                    <Text style={styles.btnText}>Camera</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.actionBtn} onPress={pickImage}>
                                    <Ionicons name="images" size={30} color="#6366f1" />
                                    <Text style={styles.btnText}>Gallery</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </View>

                {/* Name Input */}
                <View style={styles.formSection}>
                    <Text style={styles.label}>Item Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g., White Linen Shirt"
                        value={name}
                        onChangeText={setName}
                    />
                </View>

                {/* Category Selection */}
                <View style={styles.formSection}>
                    <Text style={styles.label}>Category</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                        {CATEGORIES.map(cat => (
                            <TouchableOpacity
                                key={cat}
                                style={[styles.chip, category === cat && styles.activeChip]}
                                onPress={() => setCategory(cat)}
                            >
                                <Text style={[styles.chipText, category === cat && styles.activeChipText]}>{cat}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Occasion Selection */}
                <View style={styles.formSection}>
                    <Text style={styles.label}>Occasion</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                        {OCCASIONS.map(occ => (
                            <TouchableOpacity
                                key={occ}
                                style={[styles.chip, occasion === occ && styles.activeChip]}
                                onPress={() => setOccasion(occ)}
                            >
                                <Text style={[styles.chipText, occasion === occ && styles.activeChipText]}>{occ}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Color Selection */}
                <View style={styles.formSection}>
                    <Text style={styles.label}>Color</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                        {COLORS.map(col => (
                            <TouchableOpacity
                                key={col}
                                style={[styles.colorChip, color === col && styles.activeColorChip]}
                                onPress={() => setColor(col)}
                            >
                                <View style={[styles.colorDot, { backgroundColor: col.toLowerCase() === 'other' ? '#ccc' : col.toLowerCase() }]} />
                                <Text style={[styles.chipText, color === col && { fontWeight: 'bold' }]}>{col}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

            </ScrollView>

            {/* Submit Button */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.saveBtn, (!image || !name) && styles.disabledBtn]}
                    onPress={handleSave}
                    disabled={loading || !image || !name}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.saveBtnText}>Add to Wardrobe</Text>
                    )}
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', paddingTop: 50 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827' },

    scrollContent: { paddingBottom: 100 },

    imageSection: {
        alignItems: 'center',
        marginBottom: 30,
        paddingHorizontal: 20,
    },
    imageWrapper: {
        width: '100%',
        height: 300,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        position: 'relative',
    },
    previewImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    retakeBtn: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'white',
        borderRadius: 15,
    },

    placeholderContainer: {
        width: '100%',
        height: 200,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#E5E7EB',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
    },
    placeholderLabel: {
        position: 'absolute',
        top: 20,
        fontSize: 14,
        color: '#9CA3AF',
        fontWeight: '600'
    },
    imageButtons: {
        flexDirection: 'row',
        gap: 40,
        marginTop: 10
    },
    actionBtn: { alignItems: 'center' },
    btnText: { marginTop: 8, fontSize: 14, color: '#4B5563', fontWeight: '500' },

    formSection: { paddingHorizontal: 20, marginBottom: 25 },
    label: { fontSize: 16, fontWeight: '700', color: '#374151', marginBottom: 12 },
    input: {
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
        color: '#111827',
    },

    chipScroll: { flexDirection: 'row' },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        marginRight: 10,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    activeChip: {
        backgroundColor: '#EEF2FF',
        borderColor: '#6366f1',
    },
    chipText: { fontSize: 14, color: '#4B5563' },
    activeChipText: { color: '#6366f1', fontWeight: '700' },

    colorChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        marginRight: 10,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    activeColorChip: {
        borderColor: '#6366f1',
        backgroundColor: '#EEF2FF',
    },
    colorDot: {
        width: 14,
        height: 14,
        borderRadius: 7,
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB'
    },

    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    saveBtn: {
        backgroundColor: '#6366f1',
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    disabledBtn: { backgroundColor: '#A5A6F6' },
    saveBtnText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});
