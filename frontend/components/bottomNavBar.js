import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather'; // or any other icon set

const BottomNavBar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { name: 'Home', icon: 'home' },
    { name: 'Search', icon: 'search' },
    { name: 'Store', icon: 'shopping-bag' },
    { name: 'Cart', icon: 'shopping-cart' },
    { name: 'Profile', icon: 'user' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab, index) => {
        const isCenter = tab.name === 'Store';
        const isActive = activeTab === tab.name;

        return (
          <TouchableOpacity
            key={index}
            onPress={() => setActiveTab(tab.name)}
            style={[styles.tabButton, isCenter && styles.centerTab]}
          >
            <View
              style={[
                styles.iconWrapper,
                isCenter && styles.centerIconWrapper,
                isActive && styles.activeIconWrapper,
              ]}
            >
              <Icon
                name={tab.icon}
                size={24}
                color={isActive ? '#fff' : '#B6E6A7'}
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
    top: -20,
  },
  centerIconWrapper: {
    backgroundColor: '#78E08F',
    borderRadius: 30,
    padding: 14,
  },
  activeIconWrapper: {
    backgroundColor: '#78E08F',
    borderRadius: 30,
  },
});

export default BottomNavBar;
