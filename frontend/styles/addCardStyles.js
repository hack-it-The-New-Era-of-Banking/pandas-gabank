import { StyleSheet } from 'react-native';


const addCardStyles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff", padding: 40, paddingVertical: 20 },
    titletext: {
      fontSize: 21,
      fontWeight: '800',
      marginBottom: 20,
      marginTop:35,
      textAlign: 'center',
      color: '403D3D',
    },
  
    logo: {
      width: 120,
      height: 120,
      marginBottom: 40,
    },
    input: {
      width: '100%',
      height: 50,
      borderBottomWidth: 2,
      paddingHorizontal: 5,
      fontSize: 16,
      marginBottom: 25,
    },
    errorText: {
      color: 'red',
      textAlign: 'center',
    },
    loginbtn: {
      marginTop: 80,
      backgroundColor: '#6FB513',
      paddingVertical: 12,
      paddingHorizontal: 77,
      borderRadius: 10,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      marginBottom: 20,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
      textAlign: 'center',
    },
  });

  export default addCardStyles;
  