import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Shield, Zap, MapPin, Users, ChevronLeft, ChevronRight, Star } from 'lucide-react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const { width } = Dimensions.get('window');

const onboardingData = [
  {
    id: 1,
    title: 'Escrow Protection',
    subtitle: 'Your money is safe until delivery',
    description: 'Shop with confidence knowing your funds are protected by our secure escrow system. Money is only released when you confirm delivery.',
    icon: Shield,
    color: '#22C55E',
    image: 'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg',
    features: ['Secure payment holding', 'Buyer protection guarantee', 'Dispute resolution support']
  },
  {
    id: 2,
    title: 'Flexible Installments',
    subtitle: 'Pay at your own pace',
    description: 'Break down large purchases into manageable daily, weekly, or monthly payments that fit your budget.',
    icon: Zap,
    color: '#F59E0B',
    image: 'https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg',
    features: ['Daily payment options', 'Weekly installments', 'Monthly payment plans']
  },
  {
    id: 3,
    title: 'Real-Time Tracking',
    subtitle: 'Know exactly where your order is',
    description: 'Track your orders from purchase to delivery with real-time updates and GPS tracking of your delivery agent.',
    icon: MapPin,
    color: '#3B82F6',
    image: 'https://images.pexels.com/photos/4386370/pexels-photo-4386370.jpeg',
    features: ['Live GPS tracking', 'Delivery notifications', 'ETA updates']
  },
  {
    id: 4,
    title: 'Verified Community',
    subtitle: 'Trade with trusted sellers',
    description: 'All sellers undergo strict KYC verification. Rate and review your experience to help build a trusted marketplace.',
    icon: Users,
    color: '#8B5CF6',
    image: 'https://images.pexels.com/photos/4386433/pexels-photo-4386433.jpeg',
    features: ['KYC verified sellers', 'Rating & review system', 'Community trust scores']
  }
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const translateX = useSharedValue(0);

  const currentData = onboardingData[currentIndex];
  const IconComponent = currentData.icon;

  const handleNext = async () => {
    if (currentIndex < onboardingData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      await completeOnboarding();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSkip = async () => {
    await completeOnboarding();
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      router.replace('/auth/login');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      router.replace('/auth/login');
    }
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      const shouldGoNext = event.translationX < -50 && currentIndex < onboardingData.length - 1;
      const shouldGoPrevious = event.translationX > 50 && currentIndex > 0;

      if (shouldGoNext) {
        runOnJS(handleNext)();
      } else if (shouldGoPrevious) {
        runOnJS(handlePrevious)();
      }

      translateX.value = withSpring(0);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[currentData.color, currentData.color + 'CC']}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.content, animatedStyle]}>
            {/* Hero Image */}
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: currentData.image }}
                style={styles.heroImage}
                resizeMode="cover"
              />
              <View style={styles.iconOverlay}>
                <IconComponent size={48} color="#FFFFFF" />
              </View>
            </View>

            {/* Text Content */}
            <View style={styles.textContainer}>
              <Text style={styles.title}>{currentData.title}</Text>
              <Text style={styles.subtitle}>{currentData.subtitle}</Text>
              <Text style={styles.description}>{currentData.description}</Text>

              {/* Features */}
              <View style={styles.featuresContainer}>
                {currentData.features.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <Star size={16} color="#FFFFFF" fill="#FFFFFF" />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
            </View>
          </Animated.View>
        </GestureDetector>

        {/* Bottom Navigation */}
        <View style={styles.bottomContainer}>
          {/* Pagination */}
          <View style={styles.pagination}>
            {onboardingData.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  index === currentIndex && styles.paginationDotActive
                ]}
              />
            ))}
          </View>

          {/* Navigation Buttons */}
          <View style={styles.navigationContainer}>
            <TouchableOpacity
              onPress={handlePrevious}
              style={[styles.navButton, currentIndex === 0 && styles.navButtonDisabled]}
              disabled={currentIndex === 0}
            >
              <ChevronLeft size={24} color={currentIndex === 0 ? '#FFFFFF50' : '#FFFFFF'} />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
              {currentIndex === onboardingData.length - 1 ? (
                <Text style={styles.nextButtonText}>Get Started</Text>
              ) : (
                <ChevronRight size={24} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          </View>

          {/* Trust Indicators */}
          <View style={styles.trustIndicators}>
            <View style={styles.trustItem}>
              <Text style={styles.trustNumber}>50K+</Text>
              <Text style={styles.trustLabel}>Happy Users</Text>
            </View>
            <View style={styles.trustItem}>
              <Text style={styles.trustNumber}>99.9%</Text>
              <Text style={styles.trustLabel}>Uptime</Text>
            </View>
            <View style={styles.trustItem}>
              <Text style={styles.trustNumber}>4.8★</Text>
              <Text style={styles.trustLabel}>App Rating</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  skipButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
  skipText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  imageContainer: {
    height: 300,
    borderRadius: 20,
    overflow: 'hidden',
    marginVertical: 40,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  iconOverlay: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 80,
    height: 80,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.8,
    marginBottom: 32,
  },
  featuresContainer: {
    alignItems: 'center',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 8,
    opacity: 0.9,
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#FFFFFF',
    width: 24,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  navButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  nextButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  nextButtonText: {
    color: '#22C55E',
    fontSize: 16,
    fontWeight: 'bold',
  },
  trustIndicators: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  trustItem: {
    alignItems: 'center',
  },
  trustNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  trustLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
    marginTop: 4,
  },
});