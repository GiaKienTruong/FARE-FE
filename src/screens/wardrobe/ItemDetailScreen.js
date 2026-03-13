import { Ionicons } from '@expo/vector-icons';
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
import wardrobeService from '../../services/wardrobeService';

export default function ItemDetailScreen({ route, navigation }) {
    const { itemId } = route.params;
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchItem();
    }, [itemId]);

    const fetchItem = async () => {
        setLoading(true);
        try {
            const data = await wardrobeService.getItemById(itemId);
            setItem(data);
        } catch (error) {
            console.error('Error loading item:', error);
            Alert.alert('Error', 'Could not load item details.', [
                { text: 'Go Back', onPress: () => navigation.goBack() }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = () => {
        Alert.alert(
            'Delete Item',
            `Are you sure you want to remove "${item?.name}" from your wardrobe?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        setDeleting(true);
                        try {
                            await wardrobeService.deleteItem(itemId);
                            Alert.alert('Deleted', 'Item removed from your wardrobe.');
                            navigation.goBack();
                        } catch (error) {
                            console.error('Delete error:', error);
                            Alert.alert('Error', 'Failed to delete item. Please try again.');
                        } finally {
                            setDeleting(false);
                        }
                    },
                },
            ]
        );
    };

    const handleTryOn = () => {
        const imageUrl = item?.processed_image_url || item?.original_image_url;
        navigation.navigate('TryOn', { selectedGarment: imageUrl });
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#6366f1" />
            </View>
        );
    }

    if (!item) return null;

    const imageUrl = item.processed_image_url || item.original_image_url;

    const infoRows = [
        { label: 'Category', value: item.category, icon: 'pricetag-outline' },
        { label: 'Color', value: item.color, icon: 'color-palette-outline' },
        { label: 'Tags', value: item.tags || '—', icon: 'bookmark-outline' },
    ];

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1}>{item.name}</Text>
                <TouchableOpacity onPress={handleDelete} style={styles.iconBtn} disabled={deleting}>
                    {deleting
                        ? <ActivityIndicator size="small" color="#EF4444" />
                        : <Ionicons name="trash-outline" size={22} color="#EF4444" />
                    }
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Image */}
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: imageUrl }}
                        style={styles.image}
                        resizeMode="contain"
                    />
                </View>

                {/* Info Card */}
                <View style={styles.infoCard}>
                    <Text style={styles.itemName}>{item.name}</Text>

                    {infoRows.map(row => (
                        <View key={row.label} style={styles.infoRow}>
                            <View style={styles.infoIconBox}>
                                <Ionicons name={row.icon} size={18} color="#6366f1" />
                            </View>
                            <View style={styles.infoText}>
                                <Text style={styles.infoLabel}>{row.label}</Text>
                                <Text style={styles.infoValue}>{row.value ? row.value.charAt(0).toUpperCase() + row.value.slice(1) : '—'}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Try On Button */}
                <TouchableOpacity style={styles.tryOnBtn} onPress={handleTryOn}>
                    <Ionicons name="shirt-outline" size={20} color="white" style={{ marginRight: 8 }} />
                    <Text style={styles.tryOnBtnText}>Virtual Try-On</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', paddingTop: 50 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginBottom: 10,
    },
    iconBtn: {
        width: 40, height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
        textAlign: 'center',
        marginHorizontal: 8,
    },

    scrollContent: { paddingBottom: 40 },

    imageContainer: {
        width: '100%',
        height: 360,
        backgroundColor: '#F9FAFB',
        marginBottom: 20,
    },
    image: { width: '100%', height: '100%' },

    infoCard: {
        marginHorizontal: 20,
        backgroundColor: '#F9FAFB',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
    },
    itemName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 20,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    infoIconBox: {
        width: 38, height: 38,
        borderRadius: 12,
        backgroundColor: '#EEF2FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    infoText: {},
    infoLabel: { fontSize: 12, color: '#9CA3AF', marginBottom: 2 },
    infoValue: { fontSize: 15, fontWeight: '600', color: '#1F2937' },

    tryOnBtn: {
        marginHorizontal: 20,
        backgroundColor: '#6366f1',
        height: 56,
        borderRadius: 28,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
    tryOnBtnText: { color: 'white', fontSize: 17, fontWeight: 'bold' },
});
