import { useRouter } from 'expo-router';
import React from 'react';
import ProfileScreen from '../../screens/ProfileScreen';

type ProfileNavigation = {
  goBack: () => void;
  navigate: (routeName: string) => void;
  replace: (routeName: string) => void;
};

type ProfileScreenProps = {
  navigation: ProfileNavigation;
};

export default function ProfileTabRoute() {
  const router = useRouter();
  const RoutedProfileScreen = ProfileScreen as React.ComponentType<ProfileScreenProps>;
  const routeMap: Record<string, '/(tabs)/post-food' | '/login' | '/(tabs)'> = {
    PostFood: '/(tabs)/post-food',
    Login: '/login',
    Home: '/(tabs)',
  };

  const navigation: ProfileNavigation = {
    goBack: () => router.back(),
    navigate: (routeName) => {
      router.push(routeMap[routeName] ?? '/(tabs)');
    },
    replace: (routeName) => {
      router.replace(routeMap[routeName] ?? '/(tabs)');
    },
  };

  return <RoutedProfileScreen navigation={navigation} />;
}
