import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Package, Clock, CircleCheck as CheckCircle, Circle as XCircle, Truck, Shield } from 'lucide-react-native';
import { useState } from 'react';

const orderStatuses = ['All', 'Pending', 'In Transit', 'Delivered', 'Cancelled'];

const orders = [
  {
    id: '#GDM001234',
    status: 'In Transit',
    productName: 'iPhone 14 Pro Max',
    price: '₦450,000',
    installmentInfo: '3 of 12 payments made',
    escrowStatus: 'Protected',
    estimatedDelivery: 'Tomorrow, 2:00 PM',
    trackingSteps: ['Order Confirmed', 'Payment Processed', 'In Transit', 'Out for Delivery'],
    currentStep: 2,
    date: '2024-01-15'
  },
  {
    id: '#GDM001235',
    status: 'Delivered',
    productName: 'Samsung Galaxy S23',
    price: '₦320,000',
    installmentInfo: 'Paid in full',
    escrowStatus: 'Released',
    estimatedDelivery: 'Delivered Jan 12, 2024',
    trackingSteps: ['Order Confirmed', 'Payment Processed', 'In Transit', 'Delivered'],
    currentStep: 3,
    date: '2024-01-10'
  },
  {
    id: '#GDM001236',
    status: 'Pending',
    productName: 'MacBook Air M2',
    price: '₦850,000',
    installmentInfo: '1 of 24 payments made',
    escrowStatus: 'Held',
    estimatedDelivery: 'Processing order...',
    trackingSteps: ['Order Confirmed', 'Payment Processing', 'Preparing', 'Shipped'],
    currentStep: 0,
    date: '2024-01-16'
  }
];

export default function OrdersScreen() {
  const [selectedStatus, setSelectedStatus] = useState('All');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return '#22C55E';
      case 'In Transit':
        return '#3B82F6';
      case 'Pending':
        return '#F59E0B';
      case 'Cancelled':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered':
        return <CheckCircle size={16} color="#22C55E" />;
      case 'In Transit':
        return <Truck size={16} color="#3B82F6" />;
      case 'Pending':
        return <Clock size={16} color="#F59E0B" />;
      case 'Cancelled':
        return <XCircle size={16} color="#EF4444" />;
      default:
        return <Package size={16} color="#6B7280" />;
    }
  };

  const filteredOrders = selectedStatus === 'All' 
    ? orders 
    : orders.filter(order => order.status === selectedStatus);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Orders</Text>
        
        {/* Status Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statusFilter}>
          {orderStatuses.map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.statusButton,
                selectedStatus === status && styles.statusButtonActive
              ]}
              onPress={() => setSelectedStatus(status)}
            >
              <Text style={[
                styles.statusButtonText,
                selectedStatus === status && styles.statusButtonTextActive
              ]}>
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredOrders.map((order) => (
          <TouchableOpacity key={order.id} style={styles.orderCard}>
            {/* Order Header */}
            <View style={styles.orderHeader}>
              <View style={styles.orderIdContainer}>
                <Text style={styles.orderId}>{order.id}</Text>
                <Text style={styles.orderDate}>{order.date}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + '20' }]}>
                {getStatusIcon(order.status)}
                <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                  {order.status}
                </Text>
              </View>
            </View>

            {/* Product Info */}
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{order.productName}</Text>
              <Text style={styles.productPrice}>{order.price}</Text>
            </View>

            {/* Installment Info */}
            <View style={styles.installmentInfo}>
              <View style={styles.installmentRow}>
                <Text style={styles.installmentLabel}>Payment Progress:</Text>
                <Text style={styles.installmentValue}>{order.installmentInfo}</Text>
              </View>
              <View style={styles.escrowInfo}>
                <Shield size={14} color="#22C55E" />
                <Text style={styles.escrowText}>Escrow {order.escrowStatus}</Text>
              </View>
            </View>

            {/* Delivery Info */}
            <View style={styles.deliveryInfo}>
              <Truck size={16} color="#6B7280" />
              <Text style={styles.deliveryText}>{order.estimatedDelivery}</Text>
            </View>

            {/* Tracking Progress */}
            <View style={styles.trackingProgress}>
              <Text style={styles.trackingTitle}>Order Progress</Text>
              <View style={styles.progressSteps}>
                {order.trackingSteps.map((step, index) => (
                  <View key={index} style={styles.progressStep}>
                    <View style={[
                      styles.stepCircle,
                      index <= order.currentStep && styles.stepCircleActive
                    ]}>
                      <View style={styles.stepDot} />
                    </View>
                    <Text style={[
                      styles.stepText,
                      index <= order.currentStep && styles.stepTextActive
                    ]}>
                      {step}
                    </Text>
                    {index < order.trackingSteps.length - 1 && (
                      <View style={[
                        styles.stepLine,
                        index < order.currentStep && styles.stepLineActive
                      ]} />
                    )}
                  </View>
                ))}
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>Track Order</Text>
              </TouchableOpacity>
              {order.status === 'Delivered' && (
                <TouchableOpacity style={[styles.actionButton, styles.primaryActionButton]}>
                  <Text style={[styles.actionButtonText, styles.primaryActionButtonText]}>
                    Rate & Review
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        ))}

        {filteredOrders.length === 0 && (
          <View style={styles.emptyState}>
            <Package size={64} color="#D1D5DB" />
            <Text style={styles.emptyStateTitle}>No orders found</Text>
            <Text style={styles.emptyStateText}>
              You haven't placed any {selectedStatus.toLowerCase()} orders yet.
            </Text>
          </View>
        )}
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
  statusFilter: {
    marginBottom: 8,
  },
  statusButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    marginRight: 8,
  },
  statusButtonActive: {
    backgroundColor: '#22C55E',
  },
  statusButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  statusButtonTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  orderCard: {
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
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderIdContainer: {
    flex: 1,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  orderDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  productInfo: {
    marginBottom: 12,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    color: '#22C55E',
    fontWeight: '600',
  },
  installmentInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  installmentRow: {
    flex: 1,
  },
  installmentLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  installmentValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  escrowInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  escrowText: {
    fontSize: 12,
    color: '#22C55E',
    fontWeight: '600',
    marginLeft: 4,
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  deliveryText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  trackingProgress: {
    marginBottom: 16,
  },
  trackingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  progressSteps: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressStep: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  stepCircleActive: {
    backgroundColor: '#22C55E',
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  stepText: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
  },
  stepTextActive: {
    color: '#22C55E',
    fontWeight: '600',
  },
  stepLine: {
    position: 'absolute',
    top: 12,
    left: '50%',
    right: '-50%',
    height: 2,
    backgroundColor: '#E5E7EB',
    zIndex: -1,
  },
  stepLineActive: {
    backgroundColor: '#22C55E',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  primaryActionButton: {
    backgroundColor: '#22C55E',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  primaryActionButtonText: {
    color: '#FFFFFF',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginTop: 16,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
    maxWidth: 280,
  },
});