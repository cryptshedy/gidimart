import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Wallet as WalletIcon, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Eye, 
  EyeOff,
  Plus,
  Shield,
  Clock
} from 'lucide-react-native';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

const transactions = [
  {
    id: 1,
    type: 'payment',
    title: 'iPhone 14 Pro - Installment 3/12',
    amount: -37500,
    status: 'completed',
    date: '2024-01-16',
    time: '14:30',
    category: 'Installment Payment'
  },
  {
    id: 2,
    type: 'escrow',
    title: 'MacBook Air M2 - Escrow Hold',
    amount: -70833,
    status: 'pending',
    date: '2024-01-16',
    time: '10:15',
    category: 'Escrow Payment'
  },
  {
    id: 3,
    type: 'refund',
    title: 'Refund - Samsung Galaxy Watch',
    amount: 45000,
    status: 'completed',
    date: '2024-01-15',
    time: '16:45',
    category: 'Refund'
  },
  {
    id: 4,
    type: 'topup',
    title: 'Wallet Top-up',
    amount: 100000,
    status: 'completed',
    date: '2024-01-14',
    time: '09:20',
    category: 'Top-up'
  },
];

const paymentMethods = [
  { id: 1, type: 'card', name: 'GTBank **** 1234', default: true },
  { id: 2, type: 'bank', name: 'Access Bank **** 5678', default: false },
];

export default function WalletScreen() {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [selectedTab, setSelectedTab] = useState('overview');

  const walletBalance = 285750;
  const escrowBalance = 156333;
  const availableBalance = walletBalance - escrowBalance;

  const formatCurrency = (amount: number) => {
    return `₦${Math.abs(amount).toLocaleString()}`;
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'payment':
      case 'escrow':
        return <ArrowUpRight size={16} color="#EF4444" />;
      case 'refund':
      case 'topup':
        return <ArrowDownLeft size={16} color="#22C55E" />;
      default:
        return <WalletIcon size={16} color="#6B7280" />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Wallet</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Balance Card */}
        <LinearGradient
          colors={['#22C55E', '#16A34A']}
          style={styles.balanceCard}
        >
          <View style={styles.balanceHeader}>
            <View>
              <Text style={styles.balanceLabel}>Total Balance</Text>
              <View style={styles.balanceRow}>
                <Text style={styles.balanceAmount}>
                  {balanceVisible ? formatCurrency(walletBalance) : '₦****'}
                </Text>
                <TouchableOpacity 
                  style={styles.eyeButton}
                  onPress={() => setBalanceVisible(!balanceVisible)}
                >
                  {balanceVisible ? 
                    <Eye size={20} color="#FFFFFF" /> : 
                    <EyeOff size={20} color="#FFFFFF" />
                  }
                </TouchableOpacity>
              </View>
            </View>
            <WalletIcon size={32} color="#FFFFFF" />
          </View>

          <View style={styles.balanceBreakdown}>
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownLabel}>Available</Text>
              <Text style={styles.breakdownValue}>
                {balanceVisible ? formatCurrency(availableBalance) : '₦****'}
              </Text>
            </View>
            <View style={styles.breakdownItem}>
              <Shield size={14} color="#FFFFFF" />
              <Text style={styles.breakdownLabel}>In Escrow</Text>
              <Text style={styles.breakdownValue}>
                {balanceVisible ? formatCurrency(escrowBalance) : '₦****'}
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionIcon, { backgroundColor: '#DCFCE7' }]}>
              <Plus size={24} color="#22C55E" />
            </View>
            <Text style={styles.actionText}>Add Money</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionIcon, { backgroundColor: '#DBEAFE' }]}>
              <CreditCard size={24} color="#3B82F6" />
            </View>
            <Text style={styles.actionText}>Pay Bills</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionIcon, { backgroundColor: '#FEF3C7' }]}>
              <ArrowUpRight size={24} color="#F59E0B" />
            </View>
            <Text style={styles.actionText}>Transfer</Text>
          </TouchableOpacity>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabNavigation}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'overview' && styles.tabActive]}
            onPress={() => setSelectedTab('overview')}
          >
            <Text style={[styles.tabText, selectedTab === 'overview' && styles.tabTextActive]}>
              Overview
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'transactions' && styles.tabActive]}
            onPress={() => setSelectedTab('transactions')}
          >
            <Text style={[styles.tabText, selectedTab === 'transactions' && styles.tabTextActive]}>
              Transactions
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'cards' && styles.tabActive]}
            onPress={() => setSelectedTab('cards')}
          >
            <Text style={[styles.tabText, selectedTab === 'cards' && styles.tabTextActive]}>
              Cards
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {selectedTab === 'transactions' && (
          <View style={styles.transactionsList}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            {transactions.map((transaction) => (
              <TouchableOpacity key={transaction.id} style={styles.transactionItem}>
                <View style={styles.transactionIcon}>
                  {getTransactionIcon(transaction.type)}
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionTitle}>{transaction.title}</Text>
                  <Text style={styles.transactionCategory}>{transaction.category}</Text>
                  <Text style={styles.transactionDate}>
                    {transaction.date} • {transaction.time}
                  </Text>
                </View>
                <View style={styles.transactionAmount}>
                  <Text style={[
                    styles.transactionAmountText,
                    { color: transaction.amount > 0 ? '#22C55E' : '#EF4444' }
                  ]}>
                    {transaction.amount > 0 ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </Text>
                  <View style={[
                    styles.transactionStatus,
                    { backgroundColor: transaction.status === 'completed' ? '#DCFCE7' : '#FEF3C7' }
                  ]}>
                    <Text style={[
                      styles.transactionStatusText,
                      { color: transaction.status === 'completed' ? '#22C55E' : '#F59E0B' }
                    ]}>
                      {transaction.status === 'completed' ? 'Completed' : 'Pending'}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {selectedTab === 'cards' && (
          <View style={styles.cardsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Payment Methods</Text>
              <TouchableOpacity>
                <Text style={styles.addNewText}>Add New</Text>
              </TouchableOpacity>
            </View>
            
            {paymentMethods.map((method) => (
              <TouchableOpacity key={method.id} style={styles.paymentMethodCard}>
                <View style={styles.paymentMethodIcon}>
                  <CreditCard size={24} color="#6B7280" />
                </View>
                <View style={styles.paymentMethodInfo}>
                  <Text style={styles.paymentMethodName}>{method.name}</Text>
                  {method.default && (
                    <Text style={styles.defaultLabel}>Default</Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {selectedTab === 'overview' && (
          <View style={styles.overviewSection}>
            {/* Installment Summary */}
            <View style={styles.summaryCard}>
              <View style={styles.summaryHeader}>
                <Clock size={20} color="#F59E0B" />
                <Text style={styles.summaryTitle}>Active Installments</Text>
              </View>
              <Text style={styles.summaryValue}>2 ongoing payments</Text>
              <Text style={styles.summarySubtext}>Next payment due in 3 days</Text>
            </View>

            {/* Escrow Summary */}
            <View style={styles.summaryCard}>
              <View style={styles.summaryHeader}>
                <Shield size={20} color="#22C55E" />
                <Text style={styles.summaryTitle}>Escrow Protection</Text>
              </View>
              <Text style={styles.summaryValue}>{formatCurrency(escrowBalance)}</Text>
              <Text style={styles.summarySubtext}>Protecting 2 orders</Text>
            </View>
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
  },
  content: {
    flex: 1,
    padding: 20,
  },
  balanceCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 12,
  },
  eyeButton: {
    padding: 4,
  },
  balanceBreakdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
  },
  breakdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  breakdownLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
    marginLeft: 4,
  },
  breakdownValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 2,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 32,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  tabNavigation: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: '#22C55E',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addNewText: {
    fontSize: 14,
    color: '#22C55E',
    fontWeight: '600',
  },
  transactionsList: {},
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  transactionCategory: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  transactionAmountText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  transactionStatus: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  transactionStatusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  cardsSection: {},
  paymentMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  paymentMethodIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  paymentMethodInfo: {
    flex: 1,
  },
  paymentMethodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  defaultLabel: {
    fontSize: 12,
    color: '#22C55E',
    fontWeight: '600',
  },
  overviewSection: {},
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  summarySubtext: {
    fontSize: 14,
    color: '#6B7280',
  },
});