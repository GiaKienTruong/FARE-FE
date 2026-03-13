import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import wardrobeService from '../../services/wardrobeService';

const { width } = Dimensions.get('window');

const CATEGORIES = ['All', 'Top', 'Bottom', 'Shoes', 'Dress', 'Accessory'];
const OCCASIONS = ['All', 'Casual', 'Formal', 'Party', 'Sport', 'Work'];
const COLORS = ['All', 'Black', 'White', 'Blue', 'Red', 'Green', 'Yellow', 'Pink', 'Other'];

const COLOR_MAP = {
  black: '#000', white: '#fff', blue: '#3B82F6', red: '#EF4444',
  green: '#22C55E', yellow: '#EAB308', pink: '#EC4899', other: '#D1D5DB',
};

export default function WardrobeScreen({ navigation }) {
  const [allItems, setAllItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Filters
  const [filterCat, setFilterCat] = useState('All');
  const [filterOcc, setFilterOcc] = useState('All');
  const [filterColor, setFilterColor] = useState('All');

  // Fetch all items once, filter client-side
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const fetchData = async () => {
    setLoading(true);
    try {
      const [itemsData, statsData] = await Promise.all([
        wardrobeService.getItems(), // all items
        wardrobeService.getStats()
      ]);
      setAllItems(itemsData.items || []);
      setStats(statsData);
    } catch (error) {
      console.log('Error fetching wardrobe data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  // Client-side filtering
  const filteredItems = allItems.filter(item => {
    if (filterCat !== 'All' && item.category?.toLowerCase() !== filterCat.toLowerCase()) return false;
    // Occasion is stored in 'tags' field
    if (filterOcc !== 'All') {
      const itemOccasion = (item.tags || item.occasion || '').toLowerCase();
      if (itemOccasion !== filterOcc.toLowerCase()) return false;
    }
    if (filterColor !== 'All' && item.color?.toLowerCase() !== filterColor.toLowerCase()) return false;
    return true;
  });

  const handleAddItem = () => {
    navigation.navigate('AddItem');
  };

  const resetFilters = () => {
    setFilterCat('All');
    setFilterOcc('All');
    setFilterColor('All');
  };

  const hasActiveFilter = filterCat !== 'All' || filterOcc !== 'All' || filterColor !== 'All';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >

        {/* ── Header ── */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>My Wardrobe</Text>
          <Text style={styles.totalText}>{allItems.length} items</Text>
        </View>

        {/* ── Filter: Category ── */}
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            {CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat}
                style={[styles.filterChip, filterCat === cat && styles.filterChipActive]}
                onPress={() => setFilterCat(cat)}
              >
                <Text style={[styles.filterChipText, filterCat === cat && styles.filterChipTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ── Filter: Occasion ── */}
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Occasion</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            {OCCASIONS.map(occ => (
              <TouchableOpacity
                key={occ}
                style={[styles.filterChip, filterOcc === occ && styles.filterChipActive]}
                onPress={() => setFilterOcc(occ)}
              >
                <Text style={[styles.filterChipText, filterOcc === occ && styles.filterChipTextActive]}>
                  {occ}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ── Filter: Color ── */}
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Color</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            {COLORS.map(col => (
              <TouchableOpacity
                key={col}
                style={[styles.colorChip, filterColor === col && styles.colorChipActive]}
                onPress={() => setFilterColor(col)}
              >
                {col !== 'All' && (
                  <View style={[styles.colorDot, { backgroundColor: COLOR_MAP[col.toLowerCase()] || '#ccc' }]} />
                )}
                <Text style={[styles.filterChipText, filterColor === col && styles.filterChipTextActive]}>
                  {col}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Reset filters */}
        {hasActiveFilter && (
          <TouchableOpacity style={styles.resetBtn} onPress={resetFilters}>
            <Ionicons name="close-circle-outline" size={16} color="#EF4444" />
            <Text style={styles.resetText}>Bỏ filter ({filteredItems.length} kết quả)</Text>
          </TouchableOpacity>
        )}



        {/* ── Items Grid ── */}
        <View style={styles.grid}>
          <TouchableOpacity style={styles.addItemCard} onPress={handleAddItem}>
            <View style={styles.addIconCircle}>
              <Ionicons name="camera" size={24} color="#FFF" />
            </View>
            <Text style={styles.addItemText}>Add Photo</Text>
          </TouchableOpacity>

          {loading && !refreshing ? (
            <ActivityIndicator size="large" color="black" style={{ marginLeft: 20 }} />
          ) : filteredItems.length === 0 && !loading ? (
            <View style={styles.emptyGrid}>
              <Ionicons name="shirt-outline" size={32} color="#D1D5DB" />
              <Text style={styles.emptyText}>
                {hasActiveFilter ? 'Không có item khớp filter' : 'Chưa có item nào'}
              </Text>
            </View>
          ) : (
            filteredItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.itemCard}
                onPress={() => navigation.navigate('ItemDetail', { itemId: item.id })}
              >
                <Image
                  source={{ uri: item.processed_image_url || item.original_image_url }}
                  style={styles.gridImage}
                  resizeMode="cover"
                />
                <View style={styles.itemTag}>
                  <Text style={styles.itemTagText}>{item.category}</Text>
                </View>
                {item.color && (
                  <View style={[styles.itemColorDot, { backgroundColor: COLOR_MAP[item.color?.toLowerCase()] || '#ccc' }]} />
                )}
              </TouchableOpacity>
            ))
          )}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', paddingTop: 50 },

  // Header
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  title: { fontSize: 22, fontWeight: '800', color: '#111827' },
  totalText: { fontSize: 13, color: '#9CA3AF', fontWeight: '600' },

  // Filters
  filterSection: { paddingLeft: 20, marginBottom: 12 },
  filterLabel: { fontSize: 13, fontWeight: '700', color: '#6B7280', marginBottom: 8 },
  filterScroll: { flexDirection: 'row' },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  filterChipActive: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  filterChipText: { fontSize: 13, color: '#4B5563', fontWeight: '600' },
  filterChipTextActive: { color: '#fff', fontWeight: '700' },

  // Color filter
  colorChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  colorChipActive: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  // Reset
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  resetText: { fontSize: 12, color: '#EF4444', fontWeight: '600' },

  // AI button
  aiBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: '#333',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 20,
    marginBottom: 16,
  },
  aiBtnText: { color: 'white', fontSize: 12, fontWeight: '600' },

  // Grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    justifyContent: 'flex-start',
    gap: 8,
  },
  addItemCard: {
    width: '31%',
    height: 140,
    backgroundColor: '#F0F0F0',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  addIconCircle: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#333',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 8,
  },
  addItemText: { fontSize: 12, fontWeight: '600' },
  itemCard: {
    width: '31%',
    height: 140,
    backgroundColor: '#F8F8F8',
    borderRadius: 15,
    marginBottom: 10,
    overflow: 'hidden',
  },
  gridImage: { width: '100%', height: '100%' },
  itemTag: {
    position: 'absolute', bottom: 5, right: 5,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: 8,
  },
  itemTagText: {
    color: 'white', fontSize: 10, fontWeight: '600',
    textTransform: 'capitalize',
  },
  itemColorDot: {
    position: 'absolute', top: 6, left: 6,
    width: 10, height: 10, borderRadius: 5,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.8)',
  },

  // Empty
  emptyGrid: {
    width: '60%',
    alignItems: 'center',
    paddingVertical: 30,
    gap: 8,
  },
  emptyText: { fontSize: 13, color: '#9CA3AF', textAlign: 'center' },
});