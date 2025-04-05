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
    budgetinput: {
      width: '100%',
      height: 50,
      borderBottomWidth: 2,
      paddingHorizontal: 5,
      fontSize: 16,
      marginBottom: 15,
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

    genbutton: {
        marginTop: 20,
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
    subtitleText: {
        fontSize: 16,
        fontWeight: '400',
        marginBottom: 20,
        marginTop:15,
        textAlign: 'center',
        color: '403D3D',
      },

      toggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 10,
      },
      toggleLabel: {
        fontWeight: 'bold',
        fontSize: 14,
        color: '#333',
      },
      budgetBox: {
        backgroundColor: '#F2F2F2',
        padding: 15,
        borderRadius: 12,
        marginTop: 10,
      },
      budgetTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#222',
      },
      budgetLine: {
        fontSize: 14,
        marginTop: 8,
        color: '#555',
      },
      addButton: {
        backgroundColor: '#6FB513',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
      },
      addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
      }
      
      
  });

  export default addCardStyles;
  