import { useRouter } from 'expo-router';
import React from 'react';
import ProfileScreen from '../screens/ProfileScreen';

type ProfileNavigation = {
  goBack: () => void;
  navigate: (routeName: string) => void;
  replace: (routeName: string) => void;
};

type ProfileScreenProps = {
  navigation: ProfileNavigation;
};

export default function ProfileRoute() {
  const router = useRouter();
  const RoutedProfileScreen = ProfileScreen as React.ComponentType<ProfileScreenProps>;
  const routeMap: Record<string, '/post-food' | '/login' | '/'> = {
    PostFood: '/post-food',
    Login: '/login',
    Home: '/',
  };

  const navigation: ProfileNavigation = {
    goBack: () => router.back(),
    navigate: (routeName) => {
      router.push(routeMap[routeName] ?? '/');
    },
    replace: (routeName) => {
      router.replace(routeMap[routeName] ?? '/');
    },
  };

  return (
    <RoutedProfileScreen navigation={navigation} />
  );
}
