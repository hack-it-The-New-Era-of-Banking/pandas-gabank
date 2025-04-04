import React from "react";
import { View, Image, StyleSheet } from "react-native";

const Header = () => {
  return (
    <View style={styles.header}>
      <Image source={require("../assets/gabank-header.png")} style={styles.logo} />
      <Image source={{ uri: "https://via.placeholder.com/50" }} style={styles.profilePic} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    
    marginTop: -7,
  },
  logo: {
    width: 100,
    height: 85,
    resizeMode: "contain",
    
    marginVertical: -15,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});

export default Header;
