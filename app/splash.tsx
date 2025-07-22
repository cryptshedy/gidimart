import { View, Text, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Shield, Zap, Heart } from 'lucide-react-native';
import { useEffect } from 'react';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withDelay,
  withSequence,
  withTiming
} from 'react-native-reanimated';

export default function SplashScreen() {
  const logoScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const iconOpacity = useSharedValue(0);
  const iconTranslateY = useSharedValue(50);

  useEffect(() => {
    // Start animations
    logoScale.value = withSpring(1, { duration: 1000 });
    logoOpacity.value = withTiming(1, { duration: 800 });
    
    iconOpacity.value = withDelay(500, withTiming(1, { duration: 600 }));
    iconTranslateY.value = withDelay(500, withSpring(0, { duration: 800 }));

    // Navigate after animations
    const timer = setTimeout(async () => {
      try {
        const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');
        const authToken = await AsyncStorage.getItem('authToken');
        
        if (authToken) {
          router.replace('/(tabs)');
        } else if (hasSeenOnboarding) {
          router.replace('/auth/login');
        } else {
          router.replace('/onboarding');
        }
      } catch (error) {
        console.error('Navigation error:', error);
        router.replace('/onboarding');
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    opacity: iconOpacity.value,
    transform: [{ translateY: iconTranslateY.value }],
  }));

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#22C55E', '#16A34A']}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {/* Logo */}
          <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>G</Text>
            </View>
            <Text style={styles.appName}>GidiMart</Text>
            <Text style={styles.tagline}>Secure Trading Made Simple</Text>
          </Animated.View>

          {/* Feature Icons */}
          <Animated.View style={[styles.featuresContainer, iconAnimatedStyle]}>
            <View style={styles.featureItem}>
              <Shield size={24} color="#FFFFFF" />
              <Text style={styles.featureText}>Secure</Text>
            </View>
            <View style={styles.featureItem}>
              <Zap size={24} color="#FFFFFF" />
              <Text style={styles.featureText}>Fast</Text>
            </View>
            <View style={styles.featureItem}>
              <Heart size={24} color="#FFFFFF" />
              <Text style={styles.featureText}>Trusted</Text>
            </View>
          </Animated.View>

          {/* Loading Dots */}
          <View style={styles.loadingContainer}>
            <View style={styles.loadingDots}>
              <View style={[styles.dot, styles.dot1]} />
              <View style={[styles.dot, styles.dot2]} />
              <View style={[styles.dot, styles.dot3]} />
            </View>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logo: {
    width: 100,
    height: 100,
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#22C55E',
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 60,
  },
  featureItem: {
    alignItems: 'center',
  },
  featureText: {
    fontSize: 12,
    color: '#FFFFFF',
    marginTop: 8,
    fontWeight: '600',
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 80,
  },
  loadingDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 4,
  },
  dot1: {
    opacity: 1,
  },
  dot2: {
    opacity: 0.7,
  },
  dot3: {
    opacity: 0.4,
  },
});