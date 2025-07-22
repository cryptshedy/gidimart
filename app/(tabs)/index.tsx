import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Bell, MapPin, Star, Shield } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const categories = [
  { id: 1, name: 'Electronics', icon: '📱', color: '#3B82F6' },
  { id: 2, name: 'Fashion', icon: '👕', color: '#EC4899' },
  { id: 3, name: 'Home', icon: '🏠', color: '#8B5CF6' },
  { id: 4, name: 'Books', icon: '📚', color: '#10B981' },
];

const featuredProducts = [
  {
    id: 1,
    name: 'iPhone 14 Pro',
    price: '₦450,000',
    installment: '₦37,500/month',
    image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg',
    rating: 4.8,
    seller: 'TechHub Lagos',
    condition: 'New',
    escrow: true
  },
  {
    id: 2,
    name: 'Nike Air Max',
    price: '₦65,000',
    installment: '₦5,400/month',
    image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg',
    rating: 4.6,
    seller: 'SneakerWorld',
    condition: 'New',
    escrow: true
  },
];

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Good morning! 👋</Text>
              <View style={styles.locationContainer}>
                <MapPin size={16} color="#6B7280" />
                <Text style={styles.location}>Lagos, Nigeria</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <Bell size={24} color="#374151" />
              <View style={styles.notificationBadge} />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Search size={20} color="#6B7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for products..."
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Escrow Banner */}
        <LinearGradient
          colors={['#22C55E', '#16A34A']}
          style={styles.escrowBanner}
        >
          <Shield size={24} color="#FFFFFF" />
          <View style={styles.escrowContent}>
            <Text style={styles.escrowTitle}>Protected by Escrow</Text>
            <Text style={styles.escrowSubtitle}>Your money is safe until delivery</Text>
          </View>
        </LinearGradient>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            {categories.map((category) => (
              <TouchableOpacity key={category.id} style={[styles.categoryCard, { borderColor: category.color }]}>
                <View style={[styles.categoryIcon, { backgroundColor: category.color + '20' }]}>
                  <Text style={styles.categoryEmoji}>{category.icon}</Text>
                </View>
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Products</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          
          {featuredProducts.map((product) => (
            <TouchableOpacity key={product.id} style={styles.productCard}>
              <Image source={{ uri: product.image }} style={styles.productImage} />
              <View style={styles.productInfo}>
                <View style={styles.productHeader}>
                  <Text style={styles.productName}>{product.name}</Text>
                  {product.escrow && (
                    <View style={styles.escrowBadge}>
                      <Shield size={12} color="#22C55E" />
                      <Text style={styles.escrowBadgeText}>Escrow</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.productPrice}>{product.price}</Text>
                <Text style={styles.installmentPrice}>From {product.installment}</Text>
                <View style={styles.productMeta}>
                  <View style={styles.ratingContainer}>
                    <Star size={14} color="#F59E0B" fill="#F59E0B" />
                    <Text style={styles.rating}>{product.rating}</Text>
                  </View>
                  <View style={styles.conditionBadge}>
                    <Text style={styles.conditionText}>{product.condition}</Text>
                  </View>
                </View>
                <Text style={styles.sellerName}>by {product.seller}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Installment Info Banner */}
        <View style={styles.installmentBanner}>
          <View style={styles.installmentContent}>
            <Text style={styles.installmentTitle}>Pay in Installments</Text>
            <Text style={styles.installmentSubtitle}>Flexible daily, weekly, or monthly payments</Text>
          </View>
          <Text style={styles.installmentEmoji}>💳</Text>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  location: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    backgroundColor: '#EF4444',
    borderRadius: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#111827',
  },
  escrowBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
    padding: 16,
    borderRadius: 12,
  },
  escrowContent: {
    marginLeft: 12,
  },
  escrowTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  escrowSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  seeAll: {
    fontSize: 14,
    color: '#22C55E',
    fontWeight: '600',
  },
  categoriesScroll: {
    marginTop: 16,
  },
  categoryCard: {
    alignItems: 'center',
    marginRight: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    minWidth: 80,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryEmoji: {
    fontSize: 24,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  productImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
  },
  productInfo: {
    flex: 1,
    marginLeft: 16,
  },
  productHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    flex: 1,
  },
  escrowBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  escrowBadgeText: {
    fontSize: 10,
    color: '#22C55E',
    fontWeight: '600',
    marginLeft: 2,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#22C55E',
    marginBottom: 4,
  },
  installmentPrice: {
    fontSize: 14,
    color: '#F59E0B',
    fontWeight: '600',
    marginBottom: 8,
  },
  productMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  rating: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
    fontWeight: '600',
  },
  conditionBadge: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  conditionText: {
    fontSize: 10,
    color: '#374151',
    fontWeight: '600',
  },
  sellerName: {
    fontSize: 12,
    color: '#6B7280',
  },
  installmentBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FEF3C7',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  installmentContent: {
    flex: 1,
  },
  installmentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#92400E',
  },
  installmentSubtitle: {
    fontSize: 14,
    color: '#A16207',
  },
  installmentEmoji: {
    fontSize: 32,
  },
  bottomSpacing: {
    height: 20,
  },
});