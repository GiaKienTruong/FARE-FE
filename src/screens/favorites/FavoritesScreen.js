import { Ionicons } from '@expo/vector-icons';
import {
    Dimensions,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useFavorites } from '../../context/FavoritesContext';
import { ALL_PRODUCTS } from '../../data/brandProducts';

const { width } = Dimensions.get('window');
const CARD_W = (width - 52) / 2;

export default function FavoritesScreen({ navigation }) {
    const { favorites, toggleFavorite } = useFavorites();

    // Intersection of all products and favorites list
    const favoriteItems = ALL_PRODUCTS.filter(p => favorites.includes(p.id));

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.productCard}
            onPress={() => navigation.navigate('BrandItemDetail', { item })}
            activeOpacity={0.85}
        >
            <Image source={{ uri: item.image }} style={styles.productImg} resizeMode="cover" />

            <TouchableOpacity
                style={styles.heartBtn}
                onPress={() => toggleFavorite(item.id)}
            >
                <Ionicons name="heart" size={20} color="#EF4444" />
            </TouchableOpacity>

            <View style={styles.brandTag}>
                <Text style={styles.brandTagText}>{item.brand}</Text>
            </View>
            <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.productPrice}>{item.price}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Your Favorites</Text>
                <Text style={styles.subtitle}>{favoriteItems.length} items saved</Text>
            </View>

            {favoriteItems.length === 0 ? (
                <View style={styles.emptyState}>
                    <Ionicons name="heart-dislike-outline" size={80} color="#E5E7EB" />
                    <Text style={styles.emptyTitle}>Nothing here yet</Text>
                    <Text style={styles.emptySub}>Items you like from the Home feed will appear here.</Text>
                    <TouchableOpacity
                        style={styles.exploreBtn}
                        onPress={() => navigation.navigate('Home')}
                    >
                        <Text style={styles.exploreBtnText}>Explore Brands</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={favoriteItems}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    numColumns={2}
                    columnWrapperStyle={styles.columnWrapper}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', paddingTop: 60 },
    header: { paddingHorizontal: 20, marginBottom: 20 },
    title: { fontSize: 26, fontWeight: '800', color: '#111827' },
    subtitle: { fontSize: 13, color: '#9CA3AF', marginTop: 4 },

    listContent: { paddingHorizontal: 20, paddingBottom: 40 },
    columnWrapper: { justifyContent: 'space-between', marginBottom: 16 },

    productCard: {
        width: CARD_W, borderRadius: 16, overflow: 'hidden',
        backgroundColor: '#F9FAFB',
    },
    productImg: { width: '100%', height: CARD_W * 1.25 },
    heartBtn: {
        position: 'absolute', top: 8, right: 8,
        width: 32, height: 32, borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.9)',
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
    productPrice: { fontSize: 14, fontWeight: '800', color: '#6366f1' },

    emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
    emptyTitle: { fontSize: 20, fontWeight: '700', color: '#374151', marginTop: 20 },
    emptySub: { fontSize: 14, color: '#9CA3AF', textAlign: 'center', marginTop: 10, lineHeight: 20 },
    exploreBtn: {
        marginTop: 24, paddingVertical: 12, paddingHorizontal: 24,
        backgroundColor: '#111827', borderRadius: 25,
    },
    exploreBtnText: { color: '#fff', fontWeight: '700' },
});
