import { useRouter } from 'expo-router';
import React from 'react';
import PostFoodScreen from '../screens/PostFoodScreen';

export default function PostFoodRoute() {
  const router = useRouter();

  return (
    <PostFoodScreen
      navigation={{
        goBack: () => router.back(),
      }}
    />
  );
}
