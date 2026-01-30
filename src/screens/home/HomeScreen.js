import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    Image,
    ImageBackground,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function HomeScreen({ navigation }) {
    const { user } = useAuth();
    const [refreshing, setRefreshing] = useState(false);

    // Dữ liệu giả lập cho các brand và sản phẩm (Bạn nên fetch từ API)
    const brands = [
        { id: '1', name: 'Yody', logo: 'https://logo.com/yody' },
        { id: '2', name: 'Pull&Bear', logo: '...' },
        { id: '3', name: 'Nike', logo: '...' },
        { id: '4', name: 'H&M', logo: '...' },
    ];

    return (
        <View style={styles.container}>
            {/* Header Custom */}
            <View style={styles.header}>
                <View style={styles.userInfo}>
                    <Image
                        source={{ uri: 'https://via.placeholder.com/40' }}
                        style={styles.avatar}
                    />
                    <Text style={styles.greeting}>Hi Dino!</Text>
                </View>
                <TouchableOpacity>
                    <Ionicons name="notifications-outline" size={24} color="black" />
                </TouchableOpacity>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} />}
            >
                {/* Banner Explore */}
                <View style={styles.bannerContainer}>
                    <ImageBackground
                        source={{ uri: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d' }}
                        style={styles.bannerImage}
                        imageStyle={{ borderRadius: 20 }}
                    >
                        <View style={styles.bannerOverlay}>
                            <Text style={styles.bannerTitle}>Explore New{"\n"}Collections</Text>
                            <TouchableOpacity style={styles.exploreBtn}>
                                <Text style={styles.exploreText}>Explore more</Text>
                            </TouchableOpacity>
                        </View>
                    </ImageBackground>
                </View>

                {/* Brand Section */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Brand</Text>
                    <TouchableOpacity><Text style={styles.seeAll}>See all</Text></TouchableOpacity>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.brandList}>
                    {brands.map(brand => (
                        <View key={brand.id} style={styles.brandItem}>
                            <View style={styles.brandLogoPlaceholder}><Text>{brand.name[0]}</Text></View>
                            <Text style={styles.brandName}>{brand.name}</Text>
                        </View>
                    ))}
                </ScrollView>

                {/* Trending Outfits */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Trending Outfits</Text>
                    <TouchableOpacity><Text style={styles.seeAll}>More</Text></TouchableOpacity>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 20 }}>
                    <OutfitCard image="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f" brand="B Side" price="4.5" />
                    <OutfitCard image="https://images.unsplash.com/photo-1539109132314-34a77bd68d9a" brand="Blaze Milano" price="4.8" />
                </ScrollView>

                {/* Your Collection (Grid) */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Your collection</Text>
                </View>
                <View style={styles.collectionGrid}>
                    <Image source={{ uri: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1' }} style={styles.gridLarge} />
                    <View style={styles.gridRight}>
                        <Image source={{ uri: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2' }} style={styles.gridSmall} />
                        <View style={styles.statsBox}>
                            <Text style={styles.statsNumber}>99+</Text>
                            <Text style={styles.statsText}>Outfits</Text>
                        </View>
                    </View>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Bottom Tab Bar Fake */}
            <View style={styles.bottomTab}>
                <Ionicons name="home" size={24} color="black" />
                <Ionicons name="grid-outline" size={24} color="#9ca3af" />
                <View style={styles.addBtn}><Ionicons name="shirt-outline" size={24} color="black" /></View>
                <Ionicons name="bag-outline" size={24} color="#9ca3af" />
                <Ionicons name="person-outline" size={24} color="#9ca3af" />
            </View>
        </View>
    );
}

function OutfitCard({ image, brand, price }) {
    return (
        <View style={styles.outfitCard}>
            <Image source={{ uri: image }} style={styles.outfitImage} />
            <TouchableOpacity style={styles.heartBtn}>
                <Ionicons name="heart-outline" size={18} color="white" />
            </TouchableOpacity>
            <View style={styles.outfitInfo}>
                <Text style={styles.outfitBrand}>{brand}</Text>
                <Text style={styles.outfitRating}>⭐ {price}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 10,
    },
    userInfo: { flexDirection: 'row', alignItems: 'center' },
    avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
    greeting: { fontSize: 18, fontWeight: '700' },

    bannerContainer: { padding: 20 },
    bannerImage: { height: 180, width: '100%', overflow: 'hidden' },
    bannerOverlay: { padding: 20, justifyContent: 'center', flex: 1 },
    bannerTitle: { color: 'white', fontSize: 22, fontWeight: 'bold' },
    exploreBtn: {
        backgroundColor: '#1a1a1a',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
        alignSelf: 'flex-start',
        marginTop: 10
    },
    exploreText: { color: 'white', fontSize: 12 },

    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 25,
        marginBottom: 15,
    },
    sectionTitle: { fontSize: 22, fontWeight: 'bold' },
    seeAll: { color: '#666', fontSize: 13 },

    brandList: { paddingLeft: 20 },
    brandItem: { alignItems: 'center', marginRight: 25 },
    brandLogoPlaceholder: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' },
    brandName: { fontSize: 12, marginTop: 5, color: '#666' },

    outfitCard: { width: 160, height: 220, marginRight: 15, borderRadius: 20, overflow: 'hidden' },
    outfitImage: { width: '100%', height: '100%' },
    heartBtn: { position: 'absolute', top: 10, right: 10 },
    outfitInfo: { position: 'absolute', bottom: 10, left: 10 },
    outfitBrand: { color: 'white', fontWeight: 'bold' },
    outfitRating: { color: 'white', fontSize: 12 },

    collectionGrid: { flexDirection: 'row', paddingHorizontal: 20, gap: 10 },
    gridLarge: { flex: 1.5, height: 200, borderRadius: 20 },
    gridRight: { flex: 1, gap: 10 },
    gridSmall: { width: '100%', height: 95, borderRadius: 20 },
    statsBox: {
        width: '100%',
        height: 95,
        borderRadius: 20,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#eee',
        justifyContent: 'center',
        alignItems: 'center'
    },
    statsNumber: { fontSize: 24, fontWeight: 'bold', color: '#4facfe' },
    statsText: { fontSize: 12, color: '#666' },

    bottomTab: {
        position: 'absolute',
        bottom: 30,
        left: 20,
        right: 20,
        height: 60,
        backgroundColor: '#F8F8F8',
        borderRadius: 30,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        elevation: 5,
    },
    addBtn: { width: 45, height: 45, backgroundColor: 'white', borderRadius: 22.5, justifyContent: 'center', alignItems: 'center' }
});