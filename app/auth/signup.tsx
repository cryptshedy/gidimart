import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Mail, Lock, Phone, Eye, EyeOff, CircleAlert as AlertCircle } from 'lucide-react-native';
import { useState } from 'react';
import { Link, router } from 'expo-router';
import { authService, AuthResponse } from '@/services/auth';

const userTypes = [
  { id: 'buyer', label: 'Buyer', description: 'Shop for products with escrow protection' },
  { id: 'seller', label: 'Seller', description: 'Sell products and earn money' },
  { id: 'both', label: 'Both', description: 'Buy and sell on the platform' },
];

export default function SignupScreen() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [userType, setUserType] = useState('buyer');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState('');
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  const handleSignup = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email || 
        !formData.phone || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!acceptTerms) {
      setError('Please accept the terms and conditions');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result: AuthResponse = await authService.signup({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        userType,
      });
      
      if (result.success) {
        router.replace('/(tabs)');
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignup = async (provider: 'google' | 'facebook' | 'instagram') => {
    setSocialLoading(provider);
    setError('');

    try {
      let result: AuthResponse;
      
      switch (provider) {
        case 'google':
          result = await authService.loginWithGoogle();
          break;
        case 'facebook':
          result = await authService.loginWithFacebook();
          break;
        case 'instagram':
          result = await authService.loginWithInstagram();
          break;
        default:
          result = { success: false, error: 'Invalid provider' };
      }

      if (result.success) {
        router.replace('/(tabs)');
      } else {
        setError(result.error || `${provider} signup failed`);
      }
    } catch (error) {
      console.error(`${provider} auth error:`, error);
      setError(`${provider} authentication failed. Please try again.`);
    } finally {
      setSocialLoading(null);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Join GidiMart for secure trading with escrow protection
            </Text>
            
            {/* Error Message */}
            {error ? (
              <View style={styles.errorContainer}>
                <AlertCircle size={16} color="#EF4444" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}
          </View>

          {/* Social Signup Options */}
          <View style={styles.socialSection}>
            <Text style={styles.socialTitle}>Quick Sign Up</Text>
            <View style={styles.socialButtons}>
              <TouchableOpacity 
                style={[styles.socialButton, styles.googleButton]}
                onPress={() => handleSocialSignup('google')}
                disabled={socialLoading !== null}
              >
                <Image
                  source={{ uri: 'https://developers.google.com/identity/images/g-logo.png' }}
                  style={styles.socialIcon}
                />
                <Text style={styles.socialButtonText}>
                  {socialLoading === 'google' ? 'Connecting...' : 'Google'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.socialButton, styles.facebookButton]}
                onPress={() => handleSocialSignup('facebook')}
                disabled={socialLoading !== null}
              >
                <Text style={styles.facebookIcon}>f</Text>
                <Text style={[styles.socialButtonText, styles.facebookText]}>
                  {socialLoading === 'facebook' ? 'Connecting...' : 'Facebook'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.socialButton, styles.instagramButton]}
                onPress={() => handleSocialSignup('instagram')}
                disabled={socialLoading !== null}
              >
                <LinearGradient
                  colors={['#833AB4', '#FD1D1D', '#FCB045']}
                  style={styles.instagramGradient}
                >
                  <Text style={styles.instagramIcon}>📷</Text>
                </LinearGradient>
                <Text style={styles.socialButtonText}>
                  {socialLoading === 'instagram' ? 'Connecting...' : 'Instagram'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Or sign up with email</Text>
              <View style={styles.dividerLine} />
            </View>
          </View>

          {/* User Type Selection */}
          <View style={styles.userTypeSection}>
            <Text style={styles.sectionTitle}>I want to:</Text>
            <View style={styles.userTypeOptions}>
              {userTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.userTypeOption,
                    userType === type.id && styles.userTypeOptionSelected
                  ]}
                  onPress={() => setUserType(type.id)}
                >
                  <View style={styles.userTypeContent}>
                    <Text style={[
                      styles.userTypeLabel,
                      userType === type.id && styles.userTypeLabelSelected
                    ]}>
                      {type.label}
                    </Text>
                    <Text style={[
                      styles.userTypeDescription,
                      userType === type.id && styles.userTypeDescriptionSelected
                    ]}>
                      {type.description}
                    </Text>
                  </View>
                  <View style={[
                    styles.radioButton,
                    userType === type.id && styles.radioButtonSelected
                  ]}>
                    {userType === type.id && <View style={styles.radioButtonDot} />}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Name Inputs */}
            <View style={styles.nameRow}>
              <View style={[styles.inputContainer, styles.halfWidth]}>
                <User size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="First Name"
                  placeholderTextColor="#9CA3AF"
                  value={formData.firstName}
                  onChangeText={(value) => updateFormData('firstName', value)}
                />
              </View>
              <View style={[styles.inputContainer, styles.halfWidth]}>
                <TextInput
                  style={styles.input}
                  placeholder="Last Name"
                  placeholderTextColor="#9CA3AF"
                  value={formData.lastName}
                  onChangeText={(value) => updateFormData('lastName', value)}
                />
              </View>
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Mail size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor="#9CA3AF"
                value={formData.email}
                onChangeText={(value) => updateFormData('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Phone Input */}
            <View style={styles.inputContainer}>
              <Phone size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Phone Number (+234)"
                placeholderTextColor="#9CA3AF"
                value={formData.phone}
                onChangeText={(value) => updateFormData('phone', value)}
                keyboardType="phone-pad"
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Lock size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Password"
                placeholderTextColor="#9CA3AF"
                value={formData.password}
                onChangeText={(value) => updateFormData('password', value)}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={20} color="#6B7280" />
                ) : (
                  <Eye size={20} color="#6B7280" />
                )}
              </TouchableOpacity>
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
              <Lock size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Confirm Password"
                placeholderTextColor="#9CA3AF"
                value={formData.confirmPassword}
                onChangeText={(value) => updateFormData('confirmPassword', value)}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} color="#6B7280" />
                ) : (
                  <Eye size={20} color="#6B7280" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Terms & Conditions */}
          <TouchableOpacity
            style={styles.termsContainer}
            onPress={() => setAcceptTerms(!acceptTerms)}
          >
            <View style={[styles.checkbox, acceptTerms && styles.checkboxSelected]}>
              {acceptTerms && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.termsText}>
              I agree to the{' '}
              <Text style={styles.termsLink}>Terms & Conditions</Text>
              {' '}and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </TouchableOpacity>

          {/* Signup Button */}
          <TouchableOpacity
            style={[
              styles.signupButton,
              (!acceptTerms || isLoading) && styles.signupButtonDisabled
            ]}
            onPress={handleSignup}
            disabled={!acceptTerms || isLoading}
          >
            <LinearGradient
              colors={['#22C55E', '#16A34A']}
              style={styles.gradientButton}
                resizeMode="contain"
            >
              <Text style={styles.signupButtonText}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <Link href="/auth/login" style={styles.loginLink}>
              <Text style={styles.loginLinkText}>Sign In</Text>
            </Link>
          </View>

          {/* Next Steps Info */}
          <View style={styles.nextStepsInfo}>
            <Text style={styles.nextStepsTitle}>What's Next?</Text>
            <View style={styles.nextStepItem}>
              <Text style={styles.stepNumber}>1</Text>
              <Text style={styles.stepText}>Complete KYC verification</Text>
            </View>
            <View style={styles.nextStepItem}>
              <Text style={styles.stepNumber}>2</Text>
              <Text style={styles.stepText}>Set up payment methods</Text>
            </View>
            <View style={styles.nextStepItem}>
              <Text style={styles.stepNumber}>3</Text>
              <Text style={styles.stepText}>Start buying or selling</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    marginBottom: 16,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    marginLeft: 8,
    flex: 1,
  },
  socialSection: {
    marginBottom: 24,
  },
  socialTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
    textAlign: 'center',
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 24,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  googleButton: {
    borderColor: '#DB4437',
  },
  facebookButton: {
    borderColor: '#4267B2',
  },
  instagramButton: {
    borderColor: '#E4405F',
  },
  socialIcon: {
    width: 16,
    height: 16,
    marginRight: 6,
  },
  facebookIcon: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4267B2',
    marginRight: 6,
    width: 16,
    textAlign: 'center',
  },
  instagramGradient: {
    width: 16,
    height: 16,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  instagramIcon: {
    fontSize: 10,
  },
  socialButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  facebookText: {
    color: '#4267B2',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    fontSize: 14,
    color: '#6B7280',
    paddingHorizontal: 16,
  },
  userTypeSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  userTypeOptions: {
    gap: 12,
  },
  userTypeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  userTypeOptionSelected: {
    borderColor: '#22C55E',
    backgroundColor: '#F0FDF4',
  },
  userTypeContent: {
    flex: 1,
  },
  userTypeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  userTypeLabelSelected: {
    color: '#22C55E',
  },
  userTypeDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  userTypeDescriptionSelected: {
    color: '#16A34A',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: '#22C55E',
  },
  radioButtonDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
  },
  form: {
    marginBottom: 24,
  },
  nameRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  halfWidth: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  passwordInput: {
    paddingRight: 40,
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    padding: 4,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkboxSelected: {
    backgroundColor: '#22C55E',
    borderColor: '#22C55E',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  termsLink: {
    color: '#22C55E',
    fontWeight: '600',
  },
  signupButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
  },
  signupButtonDisabled: {
    opacity: 0.7,
  },
  gradientButton: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
  },
  signupButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  loginText: {
    fontSize: 14,
    color: '#6B7280',
  },
  loginLink: {
    marginLeft: 4,
  },
  loginLinkText: {
    fontSize: 14,
    color: '#22C55E',
    fontWeight: '600',
  },
  nextStepsInfo: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  nextStepsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  nextStepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#22C55E',
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 12,
  },
  stepText: {
    fontSize: 14,
    color: '#6B7280',
  },
});