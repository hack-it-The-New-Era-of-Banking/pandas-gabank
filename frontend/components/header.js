import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";

const Header = ({ firstName = "Gab", lastName = "AI", profilePicUrl = null }) => {
  const initials = `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();

  const renderProfile = () => {
    if (profilePicUrl) {
      return <Image source={{ uri: profilePicUrl }} style={styles.profilePic} />;
    } else {
      return (
        <View style={styles.initialsCircle}>
          <Text style={styles.initialsText}>{initials}</Text>
        </View>
      );
    }
  };

  return (
    <View style={styles.header}>
      <Image source={require("../assets/gabank-header.png")} style={styles.logo} />
      {renderProfile()}
    </View>
  );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#fff",
        marginTop: 0,
      
        // Only bottom shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 }, // 👈 only downward
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3, // Android shadow
        zIndex: 10,
      
        paddingHorizontal: 16,
        paddingBottom: 6,
        paddingTop:4,
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
    initialsCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#6FB513",
        justifyContent: "center",
        alignItems: "center",
    },
    initialsText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
});

export default Header;
