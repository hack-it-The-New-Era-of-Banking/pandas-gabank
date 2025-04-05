import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    marginTop: 50,
    width: 270,
    height: 270,
    marginBottom: 30, 
  },
  signupbtn: {
    marginTop: 230,
    backgroundColor: '#023126', 
    paddingVertical: 12,
    paddingHorizontal: 67,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  loginbtn: {
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
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default styles;
