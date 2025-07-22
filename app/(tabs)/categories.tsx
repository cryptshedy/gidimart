import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Filter, Grid3x3 as Grid3X3, List } from 'lucide-react-native';
import { useState } from 'react';

const categories = [
  { id: 1, name: 'Electronics', icon: '📱', count: '1,234', subcategories: ['Phones', 'Laptops', 'Tablets', 'Accessories'] },
  { id: 2, name: 'Fashion & Beauty', icon: '👕', count: '2,456', subcategories: ['Clothing', 'Shoes', 'Bags', 'Beauty'] },
  { id: 3, name: 'Home & Living', icon: '🏠', count: '856', subcategories: ['Furniture', 'Appliances', 'Decor', 'Kitchen'] },
  { id: 4, name: 'Books & Education', icon: '📚', count: '645', subcategories: ['Textbooks', 'Fiction', 'Educational', 'Children'] },
  { id: 5, name: 'Sports & Outdoors', icon: '⚽', count: '432', subcategories: ['Equipment', 'Apparel', 'Fitness', 'Outdoor'] },
  { id: 6, name: 'Health & Wellness', icon: '🏥', count: '321', subcategories: ['Supplements', 'Personal Care', 'Medical', 'Fitness'] },
  { id: 7, name: 'Automotive', icon: '🚗', count: '567', subcategories: ['Parts', 'Accessories', 'Tools', 'Maintenance'] },
  { id: 8, name: 'Baby & Kids', icon: '👶', count: '789', subcategories: ['Toys', 'Clothing', 'Baby Care', 'Education'] },
];

export default function CategoriesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Categories</Text>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search categories..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filter Bar */}
        <View style={styles.filterBar}>
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={18} color="#6B7280" />
            <Text style={styles.filterText}>Filter</Text>
          </TouchableOpacity>
          
          <View style={styles.viewToggle}>
            <TouchableOpacity
              style={[styles.viewButton, viewMode === 'grid' && styles.viewButtonActive]}
              onPress={() => setViewMode('grid')}
            >
              <Grid3X3 size={18} color={viewMode === 'grid' ? '#FFFFFF' : '#6B7280'} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.viewButton, viewMode === 'list' && styles.viewButtonActive]}
              onPress={() => setViewMode('list')}
            >
              <List size={18} color={viewMode === 'list' ? '#FFFFFF' : '#6B7280'} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={viewMode === 'grid' ? styles.gridContainer : styles.listContainer}>
          {filteredCategories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={viewMode === 'grid' ? styles.gridCard : styles.listCard}
            >
              <View style={styles.categoryIcon}>
                <Text style={styles.categoryEmoji}>{category.icon}</Text>
              </View>
              
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryCount}>{category.count} items</Text>
                
                {viewMode === 'list' && (
                  <View style={styles.subcategories}>
                    {category.subcategories.map((sub, index) => (
                      <Text key={index} style={styles.subcategoryText}>
                        {sub}{index < category.subcategories.length - 1 ? ' • ' : ''}
                      </Text>
                    ))}
                  </View>
                )}
              </View>

              {viewMode === 'grid' && (
                <View style={styles.itemCount}>
                  <Text style={styles.itemCountText}>{category.count}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
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
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#111827',
  },
  filterBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  filterText: {
    marginLeft: 8,
    color: '#6B7280',
    fontWeight: '600',
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 2,
  },
  viewButton: {
    padding: 8,
    borderRadius: 6,
  },
  viewButtonActive: {
    backgroundColor: '#22C55E',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  listContainer: {
    flex: 1,
  },
  gridCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  listCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    backgroundColor: '#F3F4F6',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  categoryEmoji: {
    fontSize: 28,
  },
  categoryInfo: {
    flex: 1,
    marginLeft: 16,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  subcategories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  subcategoryText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  itemCount: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    position: 'absolute',
    top: 8,
    right: 8,
  },
  itemCountText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});