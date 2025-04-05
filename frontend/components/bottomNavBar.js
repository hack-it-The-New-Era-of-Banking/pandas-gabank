import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import for navigation

const BottomNavBar = ({ activeTab, setActiveTab }) => {
  const navigation = useNavigation(); // Hook for navigation
  
  const tabs = [
    { name: 'Home', icon: require('../assets/home.png'), screen: 'HomePage' },
    { name: 'Receive', icon: require('../assets/receive.png'), screen: 'ReceiveMoney' },
    { name: 'Dream', icon: require('../assets/dream.png'), screen: 'DreamScreen' }, // center
    { name: 'Save', icon: require('../assets/save.png'), screen: 'SaveMoney' },
    { name: 'Profile', icon: require('../assets/budget.png'), screen: 'BudgetMoney' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab, index) => {
        const isCenter = tab.name === 'Dream';
        const isActive = activeTab === tab.name;

        return (
          <TouchableOpacity
            key={index}
            onPress={() => {
              setActiveTab(tab.name); // Make sure setActiveTab is passed properly
              navigation.navigate(tab.screen); // Navigate to the respective screen
            }}
            style={[styles.tabButton, isCenter && styles.centerTab]}
          >
            <View
              style={[
                styles.iconWrapper,
                isCenter && styles.centerIconWrapper,
                isActive && styles.activeIconWrapper,
              ]}
            >
              <Image
                source={tab.icon}
                style={[styles.icon, { tintColor: isActive ? '#fff' : '#B6E6A7' }]}
              />
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 70,
    backgroundColor: '#042F1A',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
  },
  iconWrapper: {
    padding: 10,
  },
  centerTab: {
    position: 'relative',
    top: -25,
  },
  centerIconWrapper: {
    backgroundColor: '#78E08F',
    borderRadius: 30,
    border: 2,
    borderColor: 'fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    padding: 14,
  },
  activeIconWrapper: {
    backgroundColor: '#78E08F',
    borderRadius: 30,
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
});

export default BottomNavBar;
