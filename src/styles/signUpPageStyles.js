import { StyleSheet } from 'react-native';


const styles = StyleSheet.create({
    container: {
      alignSelf: 'center',
      width: '80%',
      marginTop: 60,
      paddingHorizontal: 30,
      alignItems: 'center',
    },
    titletext: {
      fontSize: 21,
      fontWeight: '800',
      marginBottom: 20,
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
    loginbtn: {
      marginTop: 40,
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
    },
    errorText: {
      color: 'red',
      textAlign: 'center',
    },
    rowContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: 25,
    },
    halfInput: {
      width: '48%',
      height: 50,
      borderBottomWidth: 2,
      paddingHorizontal: 5,
      fontSize: 16,
    },
    
  });

  export default styles;