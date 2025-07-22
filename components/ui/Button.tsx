import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { ReactNode } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

interface ButtonProps {
  children: ReactNode;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  style,
  textStyle,
}: ButtonProps) {
  const getButtonStyle = () => {
    const baseStyle: ViewStyle = {
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      ...styles[`${size}Size`],
    };

    switch (variant) {
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: '#F3F4F6',
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: '#22C55E',
        };
      case 'ghost':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
        };
      default:
        return baseStyle;
    }
  };

  const getTextStyle = () => {
    const baseTextStyle: TextStyle = {
      fontWeight: '600',
      ...styles[`${size}Text`],
    };

    switch (variant) {
      case 'secondary':
        return {
          ...baseTextStyle,
          color: '#374151',
        };
      case 'outline':
        return {
          ...baseTextStyle,
          color: '#22C55E',
        };
      case 'ghost':
        return {
          ...baseTextStyle,
          color: '#6B7280',
        };
      default:
        return {
          ...baseTextStyle,
          color: '#FFFFFF',
        };
    }
  };

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        style={[getButtonStyle(), disabled && styles.disabled, style]}
        onPress={onPress}
        disabled={disabled}
      >
        <LinearGradient
          colors={['#22C55E', '#16A34A']}
          style={[styles.gradientButton, styles[`${size}Size`]]}
        >
          <Text style={[getTextStyle(), textStyle]}>{children}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[getButtonStyle(), disabled && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[getTextStyle(), textStyle]}>{children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  gradientButton: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  smSize: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    height: 36,
  },
  mdSize: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 48,
  },
  lgSize: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    height: 56,
  },
  smText: {
    fontSize: 14,
  },
  mdText: {
    fontSize: 16,
  },
  lgText: {
    fontSize: 18,
  },
});