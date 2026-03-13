import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    Dimensions,
    Image,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useFavorites } from '../../context/FavoritesContext';

const { width } = Dimensions.get('window');

export default function BrandItemDetailScreen({ route, navigation }) {
    const { item } = route.params;
    const { toggleFavorite, isFavorite } = useFavorites();
    const [selectedSize, setSelectedSize] = useState(null);

    const handleBuyNow = async () => {
        if (item.buyUrl) {
            try {
                await Linking.openURL(item.buyUrl);
            } catch (e) {
                console.error('Cannot open URL:', e);
            }
        }
    };

    const liked = isFavorite(item.id);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
                    <Ionicons name="arrow-back" size={22} color="#111" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => toggleFavorite(item.id)} style={styles.headerBtn}>
                    <Ionicons name={liked ? "heart" : "heart-outline"} size={22} color={liked ? "#EF4444" : "#111"} />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
                {/* Product Image */}
                <Image
                    source={{ uri: item.image }}
                    style={styles.productImage}
                    resizeMode="cover"
                />

                {/* Brand badge */}
                <View style={styles.brandBadge}>
                    <Text style={styles.brandBadgeText}>{item.brand}</Text>
                </View>

                {/* Info */}
                <View style={styles.infoSection}>
                    <Text style={styles.productName}>{item.name}</Text>
                    <Text style={styles.productPrice}>{item.price}</Text>

                    {item.description && (
                        <Text style={styles.description}>{item.description}</Text>
                    )}

                    {/* Sizes */}
                    {item.sizes && item.sizes.length > 0 && (
                        <View style={styles.sizeSection}>
                            <Text style={styles.sizeLabel}>Size</Text>
                            <View style={styles.sizeRow}>
                                {item.sizes.map(size => (
                                    <TouchableOpacity
                                        key={size}
                                        style={[styles.sizeChip, selectedSize === size && styles.sizeChipActive]}
                                        onPress={() => setSelectedSize(size)}
                                    >
                                        <Text style={[styles.sizeText, selectedSize === size && styles.sizeTextActive]}>
                                            {size}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Colors available */}
                    {item.colors && item.colors.length > 0 && (
                        <View style={styles.colorSection}>
                            <Text style={styles.sizeLabel}>Colors</Text>
                            <View style={styles.colorRow}>
                                {item.colors.map((c, i) => (
                                    <View key={i} style={[styles.colorCircle, { backgroundColor: c }]} />
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Brand info card */}
                    <View style={styles.brandCard}>
                        <Ionicons name="storefront-outline" size={20} color="#6366f1" />
                        <View style={{ flex: 1, marginLeft: 10 }}>
                            <Text style={styles.brandCardName}>{item.brand}</Text>
                            <Text style={styles.brandCardSub}>{item.brandOrigin || 'Fashion Brand'}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                    </View>
                </View>
            </ScrollView>

            {/* Buy Button */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.buyBtn} onPress={handleBuyNow} activeOpacity={0.85}>
                    <Ionicons name="bag-handle-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                    <Text style={styles.buyBtnText}>Buy Now</Text>
                </TouchableOpacity>
                <Text style={styles.footerHint}>Redirection to {item.brand}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },

    header: {
        flexDirection: 'row', justifyContent: 'space-between',
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
        paddingTop: 50, paddingHorizontal: 20,
    },
    headerBtn: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.9)',
        justifyContent: 'center', alignItems: 'center',
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
    },

    productImage: { width, height: width * 1.2 },

    brandBadge: {
        position: 'absolute', top: width * 1.2 - 20,
        left: 20, backgroundColor: '#111827',
        paddingHorizontal: 14, paddingVertical: 5,
        borderRadius: 12,
    },
    brandBadgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },

    infoSection: { paddingHorizontal: 20, paddingTop: 30 },
    productName: { fontSize: 22, fontWeight: '800', color: '#111827', marginBottom: 6 },
    productPrice: { fontSize: 20, fontWeight: '700', color: '#6366f1', marginBottom: 14 },
    description: { fontSize: 14, color: '#6B7280', lineHeight: 22, marginBottom: 20 },

    sizeSection: { marginBottom: 20 },
    sizeLabel: { fontSize: 14, fontWeight: '700', color: '#374151', marginBottom: 10 },
    sizeRow: { flexDirection: 'row', gap: 8 },
    sizeChip: {
        width: 44, height: 44, borderRadius: 22,
        borderWidth: 1.5, borderColor: '#E5E7EB',
        justifyContent: 'center', alignItems: 'center',
    },
    sizeChipActive: { borderColor: '#111827', backgroundColor: '#111827' },
    sizeText: { fontSize: 13, fontWeight: '600', color: '#374151' },
    sizeTextActive: { color: '#fff' },

    colorSection: { marginBottom: 20 },
    colorRow: { flexDirection: 'row', gap: 10 },
    colorCircle: {
        width: 28, height: 28, borderRadius: 14,
        borderWidth: 2, borderColor: '#E5E7EB',
    },

    brandCard: {
        flexDirection: 'row', alignItems: 'center',
        padding: 14, backgroundColor: '#F9FAFB',
        borderRadius: 14, borderWidth: 1, borderColor: '#E5E7EB',
    },
    brandCardName: { fontSize: 14, fontWeight: '700', color: '#111827' },
    brandCardSub: { fontSize: 12, color: '#9CA3AF' },

    footer: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: 16, paddingBottom: 30,
        backgroundColor: '#fff',
        borderTopWidth: 1, borderTopColor: '#F3F4F6',
        alignItems: 'center',
    },
    buyBtn: {
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
        width: '100%', height: 54, borderRadius: 27,
        backgroundColor: '#111827',
    },
    buyBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
    footerHint: { fontSize: 11, color: '#9CA3AF', marginTop: 6 },
});
