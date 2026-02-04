import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const { width } = Dimensions.get('window');

// Dữ liệu mẫu khớp với Figma
const outfits = [
  { id: 1, fullView: 'https://i.postimg.cc/mD3mX6zV/outfit1.png', thumbs: ['https://link-ao-1.png', 'https://link-quan-1.png'] },
  { id: 2, fullView: 'https://i.postimg.cc/7Z9Y3z0K/outfit2.png', thumbs: ['...'] },
  { id: 3, fullView: 'https://i.postimg.cc/mD3mX6zV/outfit1.png', thumbs: ['...'] }, // Added more for demo
];

const categories = [
  { id: 1, name: 'Workout', icon: 'fitness', count: '22 OUTFITS' },
  { id: 2, name: 'Cafe', icon: 'cafe', count: '15 OUTFITS' },
  { id: 3, name: 'Party', icon: 'wine', count: '10 OUTFITS' },
];

export default function WardrobeScreen({ navigation }) {
  const [selectedOutfitIndex, setSelectedOutfitIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('Workout');
  const flatListRef = useRef(null);

  // Sync scroll of main view with state
  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    if (index !== selectedOutfitIndex && index >= 0 && index < outfits.length) {
      setSelectedOutfitIndex(index);
    }
  };

  // Sync click on thumbnail to main view
  const scrollToOutfit = (index) => {
    flatListRef.current?.scrollToIndex({ index, animated: true });
    setSelectedOutfitIndex(index);
  };

  const renderOutfitItem = ({ item }) => (
    <View style={styles.outfitPage}>
      {/* Ghost images for stack effect */}
      <Image source={{ uri: item.fullView }} style={[styles.ghostImage, { right: 40, opacity: 0.2 }]} />
      <Image source={{ uri: item.fullView }} style={[styles.ghostImage, { right: 20, opacity: 0.5 }]} />

      {/* Main Image */}
      <Image
        source={{ uri: item.fullView }}
        style={styles.mainFullBody}
        resizeMode="contain"
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* --- PHẦN 1: MY WARDROBE OUTFITS --- */}
        <View style={styles.sectionHeader}>
          <Text style={styles.title}>My Wardrobe Outfits</Text>
          <TouchableOpacity><Text style={styles.moreBtn}>More</Text></TouchableOpacity>
        </View>

        {/* Categories Scroll */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
          {categories.map(cat => (
            <CategoryCard
              key={cat.id}
              icon={cat.icon}
              name={cat.name}
              count={cat.count}
              active={selectedCategory === cat.name}
              onPress={() => setSelectedCategory(cat.name)}
            />
          ))}
        </ScrollView>

        {/* Main Preview (Virtual Try-on) - Swipeable */}
        <View style={styles.previewContainer}>
          <FlatList
            ref={flatListRef}
            data={outfits}
            renderItem={renderOutfitItem}
            keyExtractor={item => item.id.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          />

          <TouchableOpacity style={styles.createBtn}>
            <Text style={styles.createBtnText}>Create New Outfit</Text>
          </TouchableOpacity>
        </View>

        {/* Outfit Selector Thumbnails */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.thumbScroll}>
          {outfits.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => scrollToOutfit(index)}
              style={[styles.outfitThumbGroup, selectedOutfitIndex === index && styles.activeThumbGroup]}
            >
              {/* Mockup item thumbs inside the group */}
              <Image source={{ uri: 'https://via.placeholder.com/50' }} style={styles.itemThumb} />
              <Image source={{ uri: 'https://via.placeholder.com/50' }} style={styles.itemThumb} />
            </TouchableOpacity>
          ))}
        </ScrollView>


        {/* --- PHẦN 2: MY WARDROBE ITEMS --- */}
        <View style={styles.sectionHeader}>
          <Text style={styles.title}>My Wardrobe Items</Text>
          <TouchableOpacity><Text style={styles.moreBtn}>More</Text></TouchableOpacity>
        </View>

        {/* Tag Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagScroll}>
          {['T-Shirt', 'Pants', 'Shoes', 'Accessories'].map((tag, index) => (
            <View key={index} style={styles.tagBtn}><Text style={styles.tagText}>{tag}</Text></View>
          ))}
        </ScrollView>

        {/* Items Grid */}
        <View style={styles.grid}>
          <TouchableOpacity style={styles.addItemCard} onPress={() => navigation.navigate('Camera')}>
            <View style={styles.addIconCircle}>
              <Ionicons name="add" size={24} color="#FFF" />
            </View>
            <Text style={styles.addItemText}>New Item</Text>
          </TouchableOpacity>

          <View style={styles.itemCard}><Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.gridImage} /></View>
          <View style={styles.itemCard}><Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.gridImage} /></View>
        </View>

      </ScrollView>
    </View>
  );
}

// Component con cho Category
const CategoryCard = ({ icon, name, count, active, onPress }) => (
  <TouchableOpacity style={[styles.catCard, active && styles.catCardActive]} onPress={onPress}>
    <View style={styles.catIconBox}>
      <Ionicons name={icon} size={20} color="black" />
    </View>
    <View style={{ marginLeft: 10 }}>
      <Text style={styles.catName}>{name}</Text>
      <Text style={styles.catCount}>{count}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', paddingTop: 40 }, // Added paddingTop for StatusBar

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 10
  },
  title: { fontSize: 20, fontWeight: 'bold', color: '#1a1a1a' },
  moreBtn: { color: '#666', fontSize: 13 },

  // Category
  catScroll: { paddingLeft: 20, marginBottom: 20 },
  catCard: {
    flexDirection: 'row',
    backgroundColor: '#F3F3F3',
    padding: 10,
    borderRadius: 12,
    marginRight: 10,
    alignItems: 'center',
    minWidth: 130,
  },
  catCardActive: { backgroundColor: '#E0E0E0', borderWidth: 1, borderColor: '#000' },
  catIconBox: { width: 30 },
  catName: { fontSize: 14, fontWeight: 'bold' },
  catCount: { fontSize: 9, color: '#888' },

  // Preview Area
  previewContainer: {
    width: width, // Full width for paging
    height: 480,
    // backgroundColor: '#f9f9f9', // Optional debug color
    position: 'relative',
    marginBottom: 20,
  },
  outfitPage: {
    width: width,
    height: 480,
    justifyContent: 'flex-start',
    alignItems: 'center',
    position: 'relative',
  },
  mainFullBody: {
    width: '80%',
    height: '90%',
    zIndex: 10,
  },
  ghostImage: {
    position: 'absolute',
    top: 0,
    width: '80%',
    height: '90%',
    tintColor: 'gray', // Optional tint for ghost effect
  },
  createBtn: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    zIndex: 20,
  },
  createBtnText: { color: 'white', fontSize: 12, fontWeight: '600' },

  // Thumbnails
  thumbScroll: { paddingLeft: 20, marginBottom: 30 },
  outfitThumbGroup: {
    flexDirection: 'row',
    backgroundColor: '#F8F8F8',
    padding: 5,
    borderRadius: 15,
    marginRight: 15,
    borderWidth: 2,
    borderColor: 'transparent'
  },
  activeThumbGroup: {
    borderColor: '#71D5F3', // Brand color highlight
  },
  itemThumb: {
    width: 50,
    height: 60,
    marginRight: 5,
    borderRadius: 10,
    backgroundColor: '#eee'
  },

  // Wardrobe Items Grid
  tagScroll: { paddingLeft: 20, marginBottom: 15 },
  tagBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#F3F3F3',
    borderRadius: 20,
    marginRight: 10,
  },
  tagText: { color: '#666', fontSize: 12 },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8
  },
  addItemText: { fontSize: 12, fontWeight: '600' },
  itemCard: {
    width: '31%',
    height: 140,
    backgroundColor: '#F8F8F8',
    borderRadius: 15,
    marginBottom: 10,
    overflow: 'hidden'
  },
  gridImage: { width: '100%', height: '100%' }
});