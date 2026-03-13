import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    FlatList,
    Image,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import aiService from '../../services/aiService';

const { width } = Dimensions.get('window');
const ITEM_W = (width - 60) / 2;

export default function TryOnHistoryScreen({ navigation }) {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);

        try {
            const response = await aiService.getHistory(50, 0);
            // Response format from backend: { success: true, data: [...] }
            setHistory(response.data || []);
        } catch (error) {
            console.error('History load error:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleDelete = (id) => {
        Alert.alert(
            'Delete Result',
            'Are you sure you want to delete this result?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await aiService.deleteResult(id);
                            setHistory(prev => prev.filter(item => item.id !== id));
                        } catch (e) {
                            Alert.alert('Error', 'Failed to delete result.');
                        }
                    }
                }
            ]
        );
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Image
                source={{ uri: item.result_image_url }}
                style={styles.image}
                resizeMode="cover"
            />
            <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => handleDelete(item.id)}
            >
                <Ionicons name="trash-outline" size={16} color="#EF4444" />
            </TouchableOpacity>
            <View style={styles.cardFooter}>
                <Text style={styles.dateText}>
                    {new Date(item.created_at).toLocaleDateString()}
                </Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#111" />
                </TouchableOpacity>
                <Text style={styles.title}>Try-On History</Text>
                <View style={{ width: 40 }} />
            </View>

            {loading ? (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color="#6366f1" />
                </View>
            ) : history.length === 0 ? (
                <View style={styles.emptyState}>
                    <Ionicons name="images-outline" size={80} color="#E5E7EB" />
                    <Text style={styles.emptyTitle}>No history yet</Text>
                    <Text style={styles.emptySub}>Your AI Try-On results will appear here.</Text>
                    <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => navigation.navigate('TryOn')}
                    >
                        <Text style={styles.actionBtnText}>Try Something On</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={history}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    numColumns={2}
                    columnWrapperStyle={styles.columnWrapper}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={() => loadHistory(true)} />
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', paddingTop: 50 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginBottom: 20
    },
    backBtn: { width: 40, height: 40, justifyContent: 'center' },
    title: { fontSize: 20, fontWeight: '800', color: '#111' },

    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    listContent: { paddingHorizontal: 20, paddingBottom: 40 },
    columnWrapper: { justifyContent: 'space-between', marginBottom: 20 },

    card: {
        width: ITEM_W,
        borderRadius: 16,
        backgroundColor: '#F9FAFB',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    image: {
        width: '100%',
        height: ITEM_W * 1.4,
    },
    deleteBtn: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(255,255,255,0.9)',
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardFooter: {
        padding: 8,
        alignItems: 'center',
    },
    dateText: {
        fontSize: 11,
        color: '#9CA3AF',
        fontWeight: '500'
    },

    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        marginBottom: 100
    },
    emptyTitle: { fontSize: 18, fontWeight: '700', color: '#374151', marginTop: 20 },
    emptySub: { fontSize: 14, color: '#9CA3AF', textAlign: 'center', marginTop: 8 },
    actionBtn: {
        marginTop: 24,
        backgroundColor: '#111827',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 24
    },
    actionBtnText: { color: '#fff', fontWeight: '700' }
});
