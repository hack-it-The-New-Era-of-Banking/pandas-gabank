import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import SignUp from './screens/signUp';
import SignIn from './screens/signIn';
import SplashPage from './screens/splashPage';
import LandingPage from './screens/landingPage';

export default function App() {
  return (
    <View style={styles.container}>
      <LandingPage></LandingPage>
      {/* <Text>Open up App.js to start working on your app!</Text> */}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
