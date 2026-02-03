import { Ionicons } from '@expo/vector-icons';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';

export default function ProfileScreen() {
  const { user } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => auth.signOut(), // compat mode
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Profile</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Image
              source={{ uri: 'https://via.placeholder.com/100' }}
              style={styles.avatarImage}
            />
            <TouchableOpacity style={styles.editAvatarBtn}>
              <Ionicons name="camera" size={16} color="white" />
            </TouchableOpacity>
          </View>
          <Text style={styles.email}>{user?.email}</Text>
          <Text style={styles.memberSince}>Member since 2024</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Outfits</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>45</Text>
            <Text style={styles.statLabel}>Items</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>4.8</Text>
            <Text style={styles.statLabel}>Style Score</Text>
          </View>
        </View>

        <View style={styles.menuSection}>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconBox}><Ionicons name="person-outline" size={22} color="#333" /></View>
            <Text style={styles.menuText}>Personal Details</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconBox}><Ionicons name="settings-outline" size={22} color="#333" /></View>
            <Text style={styles.menuText}>Settings</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconBox}><Ionicons name="help-circle-outline" size={22} color="#333" /></View>
            <Text style={styles.menuText}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <View style={[styles.menuIconBox, { backgroundColor: '#FEE2E2' }]}>
              <Ionicons name="log-out-outline" size={22} color="#EF4444" />
            </View>
            <Text style={[styles.menuText, { color: '#EF4444' }]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', paddingTop: 40 },
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10, backgroundColor: '#F9FAFB' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#111827' },

  content: { flex: 1, padding: 20 },

  profileSection: { alignItems: 'center', marginBottom: 25 },
  avatar: { position: 'relative', marginBottom: 15 },
  avatarImage: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: 'white' },
  editAvatarBtn: {
    position: 'absolute', bottom: 0, right: 0,
    backgroundColor: '#333', width: 32, height: 32, borderRadius: 16,
    justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'white'
  },
  email: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 5 },
  memberSince: { fontSize: 13, color: '#9CA3AF' },

  statsRow: {
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
    backgroundColor: 'white', borderRadius: 20, padding: 20, marginBottom: 25,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2
  },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 5 },
  statLabel: { fontSize: 12, color: '#6B7280' },
  statDivider: { width: 1, height: 30, backgroundColor: '#E5E7EB' },

  menuSection: { backgroundColor: 'white', borderRadius: 20, padding: 10, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  menuIconBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  menuText: { flex: 1, fontSize: 16, fontWeight: '500', color: '#1F2937' }
});