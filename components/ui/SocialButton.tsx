import { TouchableOpacity, Text, StyleSheet, ViewStyle, View, Image } from 'react-native';
import { ReactNode } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

interface SocialButtonProps {
  children: ReactNode;
  onPress?: () => void;
  provider: 'google' | 'facebook' | 'instagram';
  disabled?: boolean;
  style?: ViewStyle;
}

export function SocialButton({
  children,
  onPress,
  provider,
  disabled = false,
  style,
}: SocialButtonProps) {
  const getButtonStyle = () => {
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 12,
      borderWidth: 1,
    };

    switch (provider) {
      case 'google':
        return {
          ...baseStyle,
          backgroundColor: '#FFFFFF',
          borderColor: '#DB4437',
        };
      case 'facebook':
        return {
          ...baseStyle,
          backgroundColor: '#FFFFFF',
          borderColor: '#4267B2',
        };
      case 'instagram':
        return {
          ...baseStyle,
          backgroundColor: '#FFFFFF',
          borderColor: '#E4405F',
        };
      default:
        return baseStyle;
    }
  };

  const getIcon = () => {
    switch (provider) {
      case 'google':
        return (
          <Image
            source={{ uri: 'https://developers.google.com/identity/images/g-logo.png' }}
            style={styles.icon}
            resizeMode="contain"
          />
        );
      case 'facebook':
        return (
          <Text style={styles.facebookIcon}>f</Text>
        );
      case 'instagram':
        return (
          <LinearGradient
            colors={['#833AB4', '#FD1D1D', '#FCB045']}
            style={styles.instagramGradient}
          >
            <Text style={styles.instagramIcon}>📷</Text>
          </LinearGradient>
        );
      default:
        return null;
    }
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), disabled && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled}
    >
      {getIcon()}
      <Text style={styles.buttonText}>{children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.5,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 12,
  },
  facebookIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4267B2',
    marginRight: 12,
    width: 20,
    textAlign: 'center',
  },
  instagramGradient: {
    width: 20,
    height: 20,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  instagramIcon: {
    fontSize: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
});