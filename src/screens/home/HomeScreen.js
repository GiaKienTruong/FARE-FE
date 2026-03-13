import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    Dimensions,
    Image,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';
import { ALL_PRODUCTS, BRANDS } from '../../data/brandProducts';

const { width } = Dimensions.get('window');
const CARD_W = (width - 52) / 2;

const TABS = ['Trending', 'New'];

export default function HomeScreen({ navigation }) {
    const { user } = useAuth();
    const { toggleFavorite, isFavorite } = useFavorites();
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState('Trending');
    const [selectedBrand, setSelectedBrand] = useState(null);

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
    };

    // Filter by tab + brand
    const displayProducts = ALL_PRODUCTS.filter(p => {
        if (activeTab === 'Trending' && p.category !== 'trending') return false;
        if (activeTab === 'New' && p.category !== 'new') return false;
        if (selectedBrand && p.brand !== selectedBrand) return false;
        return true;
    });

    const handleProductPress = (item) => {
        navigation.navigate('BrandItemDetail', { item });
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Explore Outfits </Text>
                    <Text style={styles.subGreeting}>Discover your style today</Text>
                </View>
                <TouchableOpacity style={styles.notifBtn}>
                    <Ionicons name="notifications-outline" size={22} color="#111" />
                </TouchableOpacity>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                {/* Banner */}
                <View style={styles.bannerWrap}>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800' }}
                        style={styles.bannerImg}
                        resizeMode="cover"
                    />
                    <View style={styles.bannerOverlay}>
                        <Text style={styles.bannerTitle}>Explore New{"\n"}Collections</Text>
                        <Text style={styles.bannerSub}>From local to global brands</Text>
                    </View>
                </View>

                {/* Brand Row */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Brands</Text>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.brandScroll}>
                    {/* All button */}
                    <TouchableOpacity
                        style={[styles.brandChip, !selectedBrand && styles.brandChipActive]}
                        onPress={() => setSelectedBrand(null)}
                    >
                        <Text style={[styles.brandChipText, !selectedBrand && styles.brandChipTextActive]}>All</Text>
                    </TouchableOpacity>
                    {BRANDS.map(b => (
                        <TouchableOpacity
                            key={b.id}
                            style={[styles.brandChip, selectedBrand === b.name && styles.brandChipActive]}
                            onPress={() => setSelectedBrand(selectedBrand === b.name ? null : b.name)}
                        >
                            <Text style={[styles.brandChipText, selectedBrand === b.name && styles.brandChipTextActive]}>
                                {b.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Tabs */}
                <View style={styles.tabRow}>
                    {TABS.map(tab => (
                        <TouchableOpacity
                            key={tab}
                            style={[styles.tab, activeTab === tab && styles.tabActive]}
                            onPress={() => setActiveTab(tab)}
                        >
                            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Product Grid */}
                <View style={styles.productGrid}>
                    {displayProducts.map(item => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.productCard}
                            onPress={() => handleProductPress(item)}
                            activeOpacity={0.85}
                        >
                            <Image source={{ uri: item.image }} style={styles.productImg} resizeMode="cover" />

                            {/* Heart Button */}
                            <TouchableOpacity
                                style={styles.heartBtn}
                                onPress={() => toggleFavorite(item.id)}
                            >
                                <Ionicons
                                    name={isFavorite(item.id) ? "heart" : "heart-outline"}
                                    size={18}
                                    color={isFavorite(item.id) ? "#EF4444" : "#111"}
                                />
                            </TouchableOpacity>

                            <View style={styles.brandTag}>
                                <Text style={styles.brandTagText}>{item.brand}</Text>
                            </View>
                            <View style={styles.productInfo}>
                                <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
                                <Text style={styles.productPrice}>{item.price}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                    {displayProducts.length === 0 && (
                        <View style={styles.emptyProducts}>
                            <Ionicons name="shirt-outline" size={40} color="#D1D5DB" />
                            <Text style={styles.emptyText}>No products found</Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },

    // Header
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 20, paddingTop: 50, paddingBottom: 10,
    },
    greeting: { fontSize: 17, fontWeight: '800', color: '#111827' },
    subGreeting: { fontSize: 12, color: '#9CA3AF', marginTop: 1 },
    notifBtn: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center', alignItems: 'center',
    },

    // Banner
    bannerWrap: {
        marginHorizontal: 20, marginTop: 12, marginBottom: 20,
        height: 170, borderRadius: 20, overflow: 'hidden',
    },
    bannerImg: { width: '100%', height: '100%' },
    bannerOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.35)',
        padding: 20, justifyContent: 'flex-end',
    },
    bannerTitle: { color: '#fff', fontSize: 22, fontWeight: '800', lineHeight: 28 },
    bannerSub: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 4 },

    // Section
    sectionHeader: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 20, marginBottom: 12,
    },
    sectionTitle: { fontSize: 18, fontWeight: '800', color: '#111827' },

    // Brand chips
    brandScroll: { paddingLeft: 20, paddingRight: 10, marginBottom: 16 },
    brandChip: {
        paddingHorizontal: 16, paddingVertical: 8,
        borderRadius: 20, backgroundColor: '#F3F4F6',
        marginRight: 8, borderWidth: 1.5, borderColor: 'transparent',
    },
    brandChipActive: { backgroundColor: '#111827', borderColor: '#111827' },
    brandChipText: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
    brandChipTextActive: { color: '#fff' },

    // Tabs
    tabRow: {
        flexDirection: 'row', paddingHorizontal: 20,
        marginBottom: 16, gap: 8,
    },
    tab: {
        paddingHorizontal: 20, paddingVertical: 8,
        borderRadius: 20, backgroundColor: '#F3F4F6',
    },
    tabActive: { backgroundColor: '#71D5F3' },
    tabText: { fontSize: 13, fontWeight: '700', color: '#6B7280' },
    tabTextActive: { color: '#fff' },

    // Product grid
    productGrid: {
        flexDirection: 'row', flexWrap: 'wrap',
        paddingHorizontal: 20, gap: 12,
    },
    productCard: {
        width: CARD_W, borderRadius: 16, overflow: 'hidden',
        backgroundColor: '#F9FAFB', marginBottom: 4,
    },
    productImg: { width: '100%', height: CARD_W * 1.25 },
    heartBtn: {
        position: 'absolute', top: 8, right: 8,
        width: 28, height: 28, borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.85)',
        justifyContent: 'center', alignItems: 'center',
        zIndex: 10,
    },
    brandTag: {
        position: 'absolute', top: 8, left: 8,
        backgroundColor: 'rgba(0,0,0,0.65)',
        paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8,
    },
    brandTagText: { color: '#fff', fontSize: 10, fontWeight: '700' },
    productInfo: { padding: 10 },
    productName: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 4, lineHeight: 18 },
    productPrice: { fontSize: 14, fontWeight: '800', color: '#71D5F3' },

    // Empty
    emptyProducts: { width: '100%', alignItems: 'center', paddingVertical: 40, gap: 8 },
    emptyText: { fontSize: 13, color: '#9CA3AF' },
});