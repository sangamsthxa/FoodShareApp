import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { auth, db } from '../config';

export default function PostFoodScreen({ navigation }) {
  const [foodName, setFoodName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [expiry, setExpiry] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePost = async () => {
    // Validation
    if (!foodName || !quantity || !location || !expiry) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, 'foodListings'), {
        foodName,
        quantity,
        description,
        location,
        expiry,
        postedBy: auth.currentUser?.email,
        userId: auth.currentUser?.uid,
        createdAt: serverTimestamp(),
        status: 'available'
      });
      console.log('Food listing created:', docRef.id);

      Alert.alert(
        'Success! 🎉',
        'Your food has been posted successfully!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Failed to create food listing:', error);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post Food</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView contentContainerStyle={styles.form}>

        {/* Food Name */}
        <Text style={styles.label}>Food Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Rice, Bread, Vegetables"
          value={foodName}
          onChangeText={setFoodName}
        />

        {/* Quantity */}
        <Text style={styles.label}>Quantity *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 2kg, 3 portions, 1 bag"
          value={quantity}
          onChangeText={setQuantity}
        />

        {/* Description */}
        <Text style={styles.label}>Description (optional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Any additional details about the food..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />

        {/* Location */}
        <Text style={styles.label}>Pickup Location *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 123 Main Street, Pittsburg CA"
          value={location}
          onChangeText={setLocation}
        />

        {/* Expiry */}
        <Text style={styles.label}>Expiry / Available Until *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Today 6pm, Tomorrow, 27 April"
          value={expiry}
          onChangeText={setExpiry}
        />

        {/* Food Type Tags */}
        <Text style={styles.label}>Food Type</Text>
        <View style={styles.tags}>
          {['🥗 Vegetables', '🍞 Bread', '🍚 Rice', '🥩 Meat', '🍎 Fruits', '🥛 Dairy'].map(tag => (
            <TouchableOpacity key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Post Button */}
        <TouchableOpacity
          style={styles.postButton}
          onPress={handlePost}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.postButtonText}>🎉 Post Food</Text>
          )}
        </TouchableOpacity>

        {/* Info */}
        <Text style={styles.infoText}>
          🌱 By sharing food you're helping reduce waste and feed your community!
        </Text>

      </ScrollView>
    </KeyboardAvoidingView>
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
  backButton: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  tag: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#c8e6c9',
  },
  tagText: {
    color: '#2e7d32',
    fontSize: 13,
  },
  postButton: {
    backgroundColor: '#2e7d32',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 16,
  },
  postButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 13,
    marginBottom: 40,
    lineHeight: 20,
  },
});