import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./SRC/Screens/LoginSignup/Login/Login";
import ForgetPassword_EnterEmail from "./SRC/Screens/LoginSignup/ForgetPassword/ForgetPassword_EnterEmail";
import ForgotPassword_EnterVerificationCode from "./SRC/Screens/LoginSignup/ForgetPassword/ForgotPassword_EnterVerificationCode";
import ForgotPassword_ChoosePassword from "./SRC/Screens/LoginSignup/ForgetPassword/ForgotPassword_ChoosePassword";
import ForgotPassword_AccountRecovered from "./SRC/Screens/LoginSignup/ForgetPassword/ForgotPassword_AccountRecovered";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false, animation: "slide_from_bottom" }}
        initialRouteName="Login"
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen
          name="ForgotPassword_EnterEmail"
          component={ForgetPassword_EnterEmail}
        />
        <Stack.Screen
          name="ForgotPassword_EnterVerificationCode"
          component={ForgotPassword_EnterVerificationCode}
        />
        <Stack.Screen
          name="ForgotPassword_ChoosePassword"
          component={ForgotPassword_ChoosePassword}
        />
        <Stack.Screen
          name="ForgotPassword_AccountRecovered"
          component={ForgotPassword_AccountRecovered}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
