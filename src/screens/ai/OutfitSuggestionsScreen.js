import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import aiService from '../../services/aiService';
import wardrobeService from '../../services/wardrobeService';

const HISTORY_KEY = '@outfit_builder_history';
const { width } = Dimensions.get('window');
const ITEM_SIZE = (width - 48 - 16) / 3;

const CATEGORY_ORDER = ['top', 'bottom', 'shoes', 'dress', 'accessory'];

export default function OutfitSuggestionsScreen({ navigation }) {
    const [wardrobeItems, setWardrobeItems] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [personImage, setPersonImage] = useState(null);
    const [resultImage, setResultImage] = useState(null);
    const [history, setHistory] = useState([]);
    const [tryOnRound, setTryOnRound] = useState(0);

    useEffect(() => {
        fetchItems();
        loadHistory();
    }, []);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const data = await wardrobeService.getItems();
            setWardrobeItems(data.items || []);
        } catch (e) {
            console.error('Failed to fetch wardrobe items:', e);
        } finally {
            setLoading(false);
        }
    };

    // ── History (Backend Synced) ──
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

    const clearHistory = async () => {
        // Implementation for clearing history could be added if needed
        setHistory([]);
    };

    // ── Person image picker ──
    const pickPersonImage = async (useCamera = false) => {
        try {
            let result;
            if (useCamera) {
                const { status } = await ImagePicker.requestCameraPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Cần quyền', 'Cho phép truy cập camera.');
                    return;
                }
                result = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.8 });
            } else {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Cần quyền', 'Cho phép truy cập thư viện ảnh.');
                    return;
                }
                result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    quality: 0.8,
                });
            }
            if (!result.canceled) {
                setPersonImage(result.assets[0].uri);
                setResultImage(null);
            }
        } catch (e) {
            console.error('Pick person image error:', e);
        }
    };

    // ── Toggle item selection (only 1 at a time) ──
    const selectItem = useCallback((id) => {
        setSelectedId(prev => prev === id ? null : id);
        setResultImage(null);
    }, []);

    // ── Generate Try-On ──
    const handleGenerate = async () => {
        const sourceImage = resultImage || personImage; // Use previous result if layering
        if (!sourceImage) {
            Alert.alert('Thiếu ảnh', 'Hãy upload ảnh cơ thể trước nhé!');
            return;
        }
        if (!selectedId) {
            Alert.alert('Chọn quần áo', 'Hãy chọn 1 món đồ từ tủ.');
            return;
        }

        const garmentItem = wardrobeItems.find(i => i.id === selectedId);
        if (!garmentItem) return;
        const garmentUri = garmentItem.processed_image_url || garmentItem.original_image_url;

        setGenerating(true);

        try {
            const formData = new FormData();

            // Person/source image
            const sourceFilename = sourceImage.split('/').pop();
            const sourceType = /\.(\w+)$/.exec(sourceFilename)?.[1] || 'jpeg';

            if (sourceImage.startsWith('http')) {
                // Result image from previous round is a URL
                formData.append('person_image_url', sourceImage);
            } else {
                formData.append('person_image', {
                    uri: sourceImage,
                    name: sourceFilename,
                    type: `image/${sourceType}`,
                });
            }

            // Garment image — from URL (backend-stored)
            if (garmentUri.startsWith('http')) {
                formData.append('garment_image_url', garmentUri);
            } else {
                const garmentFilename = garmentUri.split('/').pop();
                const garmentType = /\.(\w+)$/.exec(garmentFilename)?.[1] || 'jpeg';
                formData.append('garment_image', {
                    uri: garmentUri,
                    name: garmentFilename,
                    type: `image/${garmentType}`,
                });
            }

            const response = await aiService.generateTryOn(formData);

            // Handle various backend response formats
            const responseData = response?.data || response;
            const resultUrl =
                responseData?.result_image_url ||
                responseData?.resultImageUrl ||
                responseData?.image_url ||
                responseData?.imageUrl ||
                responseData?.result ||
                null;

            if (resultUrl) {
                setResultImage(resultUrl);
                setTryOnRound(prev => prev + 1);
                setSelectedId(null);
                loadHistory(); // Đồng bộ lịch sử mới từ server
            } else {
                Alert.alert('Lỗi', 'Không nhận được kết quả từ AI. Thử lại nhé!');
            }
        } catch (error) {
            console.error('TryOn error:', error);
            const msg = error.response?.data?.error?.message || error.message || '';
            if (msg.includes('timeout')) {
                Alert.alert('AI đang bận', 'Server AI mất quá lâu để xử lý. Hãy thử lại sau vài phút nhé.');
            } else {
                Alert.alert('Lỗi', 'Không thể tạo outfit lúc này. Thử lại sau nhé.');
            }
        } finally {
            setGenerating(false);
        }
    };

    const handleReset = () => {
        setSelectedId(null);
        setResultImage(null);
        setTryOnRound(0);
    };

    const handleFullReset = () => {
        handleReset();
        setPersonImage(null);
    };

    // Grouped wardrobe items
    const grouped = CATEGORY_ORDER.map(cat => ({
        category: cat,
        items: wardrobeItems.filter(i => i.category === cat),
    })).filter(g => g.items.length > 0);

    const selectedItem = wardrobeItems.find(i => i.id === selectedId);

    return (
        <View style={styles.container}>
            {/* ── Header ── */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#111" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>AI Stylist</Text>
                {(selectedId || resultImage) ? (
                    <TouchableOpacity onPress={handleFullReset}>
                        <Text style={styles.resetText}>Reset</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={{ width: 40 }} />
                )}
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>

                {/* ── Step 1: Person Image ── */}
                <View style={styles.stepSection}>
                    <Text style={styles.stepLabel}>
                        <Text style={styles.stepNum}>①</Text>  Upload ảnh của bạn
                    </Text>
                    {personImage ? (
                        <View style={styles.personPreviewWrap}>
                            <Image source={{ uri: personImage }} style={styles.personPreview} resizeMode="cover" />
                            <TouchableOpacity style={styles.removeBtn} onPress={() => { setPersonImage(null); setResultImage(null); }}>
                                <Ionicons name="close-circle" size={26} color="#EF4444" />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.pickerRow}>
                            <TouchableOpacity style={styles.pickerBtn} onPress={() => pickPersonImage(false)}>
                                <Ionicons name="image-outline" size={28} color="#6B7280" />
                                <Text style={styles.pickerText}>Thư viện</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.pickerBtn} onPress={() => pickPersonImage(true)}>
                                <Ionicons name="camera-outline" size={28} color="#6B7280" />
                                <Text style={styles.pickerText}>Chụp ảnh</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {/* ── Step 2: Select 1 Item ── */}
                <View style={styles.stepSection}>
                    <Text style={styles.stepLabel}>
                        <Text style={styles.stepNum}>②</Text>  {
                            tryOnRound > 0
                                ? 'Chọn tiếp món khác để phối thêm'
                                : 'Chọn 1 món đồ để phối'
                        }
                    </Text>

                    {/* Selected preview chip */}
                    {selectedItem && (
                        <View style={styles.selectedChips}>
                            <View style={styles.chip}>
                                <Image
                                    source={{ uri: selectedItem.processed_image_url || selectedItem.original_image_url }}
                                    style={styles.chipImg}
                                    resizeMode="cover"
                                />
                                <Text style={styles.chipText}>{selectedItem.category}</Text>
                                <TouchableOpacity onPress={() => selectItem(selectedItem.id)}>
                                    <Ionicons name="close" size={16} color="#6B7280" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                    {loading ? (
                        <ActivityIndicator size="large" color="#111" style={{ marginTop: 20 }} />
                    ) : wardrobeItems.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Ionicons name="shirt-outline" size={40} color="#D1D5DB" />
                            <Text style={styles.emptyText}>Tủ đồ trống — thêm quần áo trước nhé!</Text>
                            <TouchableOpacity style={styles.emptyBtn} onPress={() => navigation.navigate('AddItem')}>
                                <Text style={styles.emptyBtnText}>+ Thêm quần áo</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        grouped.map(({ category, items }) => (
                            <View key={category} style={styles.catSection}>
                                <Text style={styles.catLabel}>
                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                    <Text style={styles.catCount}> ({items.length})</Text>
                                </Text>
                                <View style={styles.itemsGrid}>
                                    {items.map(item => {
                                        const isSelected = item.id === selectedId;
                                        return (
                                            <TouchableOpacity
                                                key={item.id}
                                                style={[styles.itemCell, isSelected && styles.itemSelected]}
                                                onPress={() => selectItem(item.id)}
                                                activeOpacity={0.8}
                                            >
                                                <Image
                                                    source={{ uri: item.processed_image_url || item.original_image_url }}
                                                    style={styles.itemImg}
                                                    resizeMode="cover"
                                                />
                                                {isSelected && (
                                                    <View style={styles.checkBadge}>
                                                        <Ionicons name="checkmark-circle" size={22} color="#fff" />
                                                    </View>
                                                )}
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </View>
                        ))
                    )}
                </View>

                {/* ── Result ── */}
                {(resultImage || generating) && (
                    <View style={styles.resultSection}>
                        <Text style={styles.resultTitle}>
                            ✨ {tryOnRound > 1 ? `Kết quả lần ${tryOnRound}` : 'Kết quả phối đồ'}
                        </Text>
                        {generating ? (
                            <View style={styles.generatingBox}>
                                <ActivityIndicator size="large" color="#111" />
                                <Text style={styles.generatingText}>AI đang phối đồ cho bạn...</Text>
                                <Text style={styles.generatingHint}>Có thể mất 30–60 giây</Text>
                            </View>
                        ) : resultImage ? (
                            <>
                                <Image
                                    source={{ uri: resultImage }}
                                    style={styles.resultImg}
                                    resizeMode="contain"
                                />
                                {/* Action buttons after result */}
                                <View style={styles.resultActions}>
                                    <TouchableOpacity
                                        style={styles.layerMoreBtn}
                                        onPress={() => {
                                            // Scroll back up so user can pick next item
                                            // The resultImage stays as source for next round
                                        }}
                                    >
                                        <Ionicons name="add-circle-outline" size={18} color="#6366f1" />
                                        <Text style={styles.layerMoreText}>Phối thêm món khác</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.redoBtn}
                                        onPress={handleReset}
                                    >
                                        <Ionicons name="refresh" size={18} color="#EF4444" />
                                        <Text style={styles.redoText}>Làm lại</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        ) : null}
                    </View>
                )}

                {/* ── History (Hành trình phối đồ) ── */}
                {history.length > 0 && (
                    <View style={styles.historySection}>
                        <View style={styles.historyHeader}>
                            <Text style={styles.historyTitle}>Bộ đồ đã phối gần đây</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('TryOnHistory')}>
                                <Text style={styles.seeAllText}>Xem tất cả</Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.historyScrollHorizontal}>
                            {history.map(h => (
                                <TouchableOpacity
                                    key={h.id}
                                    style={styles.historyItemBtn}
                                    onPress={() => {
                                        setResultImage(h.result_image_url);
                                        setPersonImage(h.person_image_url);
                                        setTryOnRound(1);
                                    }}
                                >
                                    <Image source={{ uri: h.result_image_url }} style={styles.historyImgThumb} />
                                    <Text style={styles.historyDateSmall}>
                                        {new Date(h.created_at).toLocaleDateString('vi-VN')}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                )}
            </ScrollView>

            {/* ── Sticky Generate Button ── */}
            {(personImage || resultImage) && selectedId && !generating && (
                <View style={styles.stickyWrap}>
                    <TouchableOpacity style={styles.generateBtn} onPress={handleGenerate} activeOpacity={0.85}>
                        <Ionicons name="sparkles" size={20} color="#fff" style={{ marginRight: 8 }} />
                        <Text style={styles.generateText}>
                            {tryOnRound > 0 ? 'Phối thêm' : 'Phối đồ ngay'}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },

    // Header
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 20, paddingTop: 54, paddingBottom: 14,
        borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
    },
    backBtn: { padding: 4 },
    headerTitle: { fontSize: 18, fontWeight: '800', color: '#111' },
    resetText: { color: '#EF4444', fontWeight: '700', fontSize: 14 },

    // Steps
    stepSection: { paddingHorizontal: 16, marginTop: 20 },
    stepLabel: { fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 12 },
    stepNum: { fontSize: 16, color: '#6366f1' },
    stepHint: { fontSize: 12, fontWeight: '400', color: '#9CA3AF' },

    // Person picker
    pickerRow: { flexDirection: 'row', gap: 12 },
    pickerBtn: {
        flex: 1, height: 100, backgroundColor: '#F3F4F6', borderRadius: 16,
        borderWidth: 1.5, borderColor: '#E5E7EB', borderStyle: 'dashed',
        justifyContent: 'center', alignItems: 'center', gap: 6,
    },
    pickerText: { fontSize: 12, fontWeight: '600', color: '#6B7280' },
    personPreviewWrap: {
        width: 130, height: 190, borderRadius: 16, overflow: 'hidden',
        backgroundColor: '#F3F4F6', position: 'relative',
    },
    personPreview: { width: '100%', height: '100%' },
    removeBtn: { position: 'absolute', top: 6, right: 6, backgroundColor: '#fff', borderRadius: 13 },

    // Selected chips
    selectedChips: { flexDirection: 'row', gap: 8, marginBottom: 12, flexWrap: 'wrap' },
    chip: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6',
        borderRadius: 20, paddingRight: 10, overflow: 'hidden', gap: 6,
    },
    chipImg: { width: 32, height: 32, borderRadius: 16 },
    chipText: { fontSize: 12, fontWeight: '600', color: '#374151', textTransform: 'capitalize' },

    // Category
    catSection: { marginTop: 16 },
    catLabel: { fontSize: 14, fontWeight: '700', color: '#374151', marginBottom: 8 },
    catCount: { fontSize: 12, fontWeight: '400', color: '#9CA3AF' },
    itemsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },

    // Item cell
    itemCell: {
        width: ITEM_SIZE, height: ITEM_SIZE * 1.2, borderRadius: 12,
        overflow: 'hidden', backgroundColor: '#F3F4F6',
        borderWidth: 2, borderColor: 'transparent',
    },
    itemSelected: { borderColor: '#6366f1', borderWidth: 2.5 },
    itemImg: { width: '100%', height: '100%' },
    checkBadge: {
        ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(99,102,241,0.3)',
        justifyContent: 'flex-start', alignItems: 'flex-end', padding: 6,
    },

    // Empty
    emptyState: { alignItems: 'center', paddingVertical: 40, gap: 8 },
    emptyText: { fontSize: 14, color: '#9CA3AF', textAlign: 'center' },
    emptyBtn: { backgroundColor: '#111827', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20 },
    emptyBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },

    // Result
    resultSection: { paddingHorizontal: 16, marginTop: 28 },
    resultTitle: { fontSize: 18, fontWeight: '800', color: '#111827', marginBottom: 16 },
    generatingBox: { alignItems: 'center', paddingVertical: 40, gap: 12 },
    generatingText: { fontSize: 15, fontWeight: '600', color: '#374151' },
    generatingHint: { fontSize: 12, color: '#9CA3AF' },
    resultImg: {
        width: '100%', height: width * 1.3, borderRadius: 20,
        backgroundColor: '#F3F4F6',
    },
    resultActions: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
        marginTop: 16,
    },
    layerMoreBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        paddingVertical: 10, paddingHorizontal: 18,
        borderRadius: 20, borderWidth: 1.5, borderColor: '#6366f1',
    },
    layerMoreText: { color: '#6366f1', fontWeight: '700', fontSize: 13 },
    redoBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        paddingVertical: 10, paddingHorizontal: 18,
        borderRadius: 20, borderWidth: 1.5, borderColor: '#E5E7EB',
    },
    redoText: { color: '#EF4444', fontWeight: '700', fontSize: 13 },

    // History
    historySection: { paddingHorizontal: 16, marginTop: 32, marginBottom: 40 },
    historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    historyTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
    seeAllText: { color: '#6366f1', fontWeight: '600', fontSize: 13 },
    historyScrollHorizontal: { gap: 12, paddingBottom: 10 },
    historyItemBtn: { width: 100, alignItems: 'center' },
    historyImgThumb: { width: 100, height: 140, borderRadius: 12, backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#E5E7EB' },
    historyDateSmall: { fontSize: 10, color: '#9CA3AF', marginTop: 6, fontWeight: '500' },

    // Sticky button
    stickyWrap: { position: 'absolute', bottom: 90, left: 20, right: 20 },
    generateBtn: {
        height: 56, borderRadius: 28, backgroundColor: '#111827',
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
        shadowColor: '#000', shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25, shadowRadius: 12, elevation: 8,
    },
    generateText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
