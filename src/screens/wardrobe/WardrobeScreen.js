import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width } = Dimensions.get('window');

export default function WardrobeScreen({ navigation }) {
  // State quản lý ảnh preview full body
  // Ban đầu có thể là ảnh mặc định của người dùng
  const [previewBody, setPreviewBody] = useState('https://your-default-body-image.png');
  const [selectedCategory, setSelectedCategory] = useState('Workout');

  // Dữ liệu giả lập (Bạn sẽ thay bằng data từ API)
  const outfits = [
    { id: '1', image: 'https://link-to-outfit-1.png', preview: 'https://link-to-fullbody-1.png' },
    { id: '2', image: 'https://link-to-outfit-2.png', preview: 'https://link-to-fullbody-2.png' },
  ];

  const categories = [
    { id: '1', name: 'Workout', icon: 'fitness', count: 22 },
    { id: '2', name: 'Cafe', icon: 'cafe', count: 15 },
    { id: '3', name: 'Party', icon: 'wine', count: 10 },
  ];

  const handleSelectOutfit = (outfit) => {
    // Khi ấn vào outfit, cập nhật ảnh Full Body preview
    setPreviewBody(outfit.preview);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Wardrobe Outfits</Text>
          <TouchableOpacity><Text style={styles.moreBtn}>More</Text></TouchableOpacity>
        </View>

        {/* Category Horizontal Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catList}>
          {categories.map(cat => (
            <TouchableOpacity 
              key={cat.id} 
              style={[styles.catCard, selectedCategory === cat.name && styles.catCardActive]}
              onPress={() => setSelectedCategory(cat.name)}
            >
              <Ionicons name={cat.icon} size={18} color="black" />
              <View style={{marginLeft: 8}}>
                <Text style={styles.catName}>{cat.name}</Text>
                <Text style={styles.catCount}>{cat.count} OUTFITS</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* VIRTUAL TRY-ON PREVIEW AREA */}
        <View style={styles.previewContainer}>
          <Image 
            source={{ uri: previewBody }} 
            style={styles.fullBodyImage} 
            resizeMode="contain"
          />
          <TouchableOpacity style={styles.createBtn}>
            <Text style={styles.createBtnText}>Create New Outfit</Text>
          </TouchableOpacity>
        </View>

        {/* Outfit Selection (Horizontal) */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.outfitList}>
          {outfits.map(outfit => (
            <TouchableOpacity key={outfit.id} onPress={() => handleSelectOutfit(outfit)}>
              <Image source={{ uri: outfit.image }} style={styles.outfitThumb} />
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Wardrobe Items Section */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Wardrobe Items</Text>
          <TouchableOpacity><Text style={styles.moreBtn}>More</Text></TouchableOpacity>
        </View>

        {/* Item Grid */}
        <View style={styles.itemGrid}>
           {/* Nút Thêm Mới */}
          <TouchableOpacity style={styles.addItemCard} onPress={() => navigation.navigate('Camera')}>
            <View style={styles.addIconCircle}>
              <Ionicons name="add" size={24} color="white" />
            </View>
            <Text style={styles.addItemText}>New Item</Text>
          </TouchableOpacity>

          {/* Render các item cá nhân của người dùng ở đây */}
          <View style={styles.itemCardPlaceholder} />
          <View style={styles.itemCardPlaceholder} />
        </View>
        
        <View style={{height: 100}} />
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', paddingTop: 50 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    alignItems: 'center',
    marginVertical: 15,
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#1a1a1a' },
  moreBtn: { color: '#666', fontSize: 12 },

  catList: { paddingLeft: 20, marginBottom: 20 },
  catCard: {
    flexDirection: 'row',
    backgroundColor: '#F3F3F3',
    padding: 12,
    borderRadius: 12,
    marginRight: 10,
    alignItems: 'center',
    minWidth: 120,
  },
  catCardActive: { backgroundColor: '#E0E0E0', borderWidth: 1, borderColor: '#000' },
  catName: { fontSize: 14, fontWeight: 'bold' },
  catCount: { fontSize: 9, color: '#888' },

  previewContainer: {
    width: width - 40,
    height: 450,
    backgroundColor: '#FFF',
    alignSelf: 'center',
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  fullBodyImage: { width: '100%', height: '100%' },
  createBtn: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  createBtnText: { color: 'white', fontSize: 12, fontWeight: '600' },

  outfitList: { paddingLeft: 20, marginVertical: 20 },
  outfitThumb: { width: 100, height: 100, borderRadius: 15, backgroundColor: '#F8F8F8', marginRight: 12 },

  itemGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    justifyContent: 'space-between',
  },
  addItemCard: {
    width: '31%',
    height: 150,
    backgroundColor: '#E5E5E5',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  addIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  addItemText: { fontSize: 12, fontWeight: '600' },
  itemCardPlaceholder: { width: '31%', height: 150, backgroundColor: '#F8F8F8', borderRadius: 15, marginBottom: 10 },
});