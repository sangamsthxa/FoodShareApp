import { signOut } from 'firebase/auth';
import { useRouter } from 'expo-router';
import {
    collection,
    getDocs,
    orderBy,
    query,
    where
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { auth, db } from '../config';

export default function ProfileScreen({ navigation }= {}) {
  const router = useRouter();
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;
  const fetchMyListings = async () => {
    try {
      const q = query(
        collection(db, 'foodListings'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMyListings(data);
    } catch (error) {
      console.error('Error fetching my listings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyListings();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut(auth);
              router.replace('/login?manual=true');
            } catch (error) {
              console.error('Logout failed:', error);
              Alert.alert('Logout Failed', 'Unable to logout right now. Please try again.');
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardLeft}>
        <Text style={styles.foodEmoji}>🍱</Text>
        <View>
          <Text style={styles.foodName}>{item.foodName}</Text>
          <Text style={styles.foodDetails}>Qty: {item.quantity}</Text>
          <Text style={styles.foodDetails}>📍 {item.location}</Text>
        </View>
      </View>
      <View style={[
        styles.statusBadge,
        item.status === 'available' ? styles.available : styles.claimed
      ]}>
        <Text style={styles.statusText}>
          {item.status === 'available' ? '✅ Active' : '📦 Claimed'}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation?.goBack?.()}>
            <Text style={styles.headerButtonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation?.navigate?.('Home')}>
            <Text style={styles.headerButtonText}>Home</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Info */}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.email?.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.email}>{user?.email}</Text>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{myListings.length}</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statNumber}>
              {myListings.filter(l => l.status === 'claimed').length}
            </Text>
            <Text style={styles.statLabel}>Claimed</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statNumber}>
              {myListings.filter(l => l.status === 'available').length}
            </Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
        </View>
      </View>

      {/* My Listings */}
      <Text style={styles.sectionTitle}>My Food Listings</Text>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#2e7d32"
          style={{ marginTop: 20 }}
        />
      ) : myListings.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🍽️</Text>
          <Text style={styles.emptyText}>No listings yet</Text>
          <TouchableOpacity
            style={styles.postButton}
            onPress={() => navigation.navigate('PostFood')}
          >
            <Text style={styles.postButtonText}>+ Post Food Now</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={myListings}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
        />
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    backgroundColor: '#2e7d32',
    padding: 24,
    paddingTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  headerButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  logoutText: {
    color: '#fff',
    fontSize: 15,
    opacity: 0.9,
  },
  profileCard: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#2e7d32',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 16,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  statLabel: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  foodEmoji: {
    fontSize: 32,
    marginRight: 10,
  },
  foodName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  foodDetails: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  available: {
    backgroundColor: '#e8f5e9',
  },
  claimed: {
    backgroundColor: '#fff3e0',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  empty: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyEmoji: {
    fontSize: 50,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    marginBottom: 20,
  },
  postButton: {
    backgroundColor: '#2e7d32',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  postButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});