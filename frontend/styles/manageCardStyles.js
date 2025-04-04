import { StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get("window").width;

export default StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff", 
    marginHorizontal: 30, 
    paddingVertical: 20 
  },
  titletext: {
    fontSize: 21,
    fontWeight: '800',
    marginBottom: 20,
    marginTop: 20,
    textAlign: 'center',
    color: '#403D3D',
  },
  selectCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  selectCardText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  card: {
    width: screenWidth - 60,  // smaller than screen
    padding: 25,
    borderRadius: 10,
    alignItems: "center",
    height: 200,  // Reduced height
    marginBottom: 15,  // Reduced margin to fix large gap
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: 'center',
    width: "100%",
  },
  cardTitle: { 
    color: "#fff", 
    fontSize: 14, 
    marginBottom: 20,
    flex: 1,
  },
  bankName: {
    color: "#fff", 
    fontSize: 14, 
    marginBottom: 20,
    flex: 1,
    textAlign: 'right',
  },
  cardBalance: { 
    fontSize: 32, 
    fontWeight: "bold", 
    color: "#fff", 
    marginVertical: 10 
  },
  cardUserName: { 
    fontSize: 18, 
    color: "#fff", 
    marginVertical: 5, 
    justifyContent: "flex-start", 
    textAlign: "left", 
    marginVertical: 10 
  },
  accountInfo: { fontSize: 14, color: "#fff" },
  expiryDate: { fontSize: 14, color: "#fff" },
});
