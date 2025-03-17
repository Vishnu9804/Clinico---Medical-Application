import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./SRC/Screens/LoginSignup/Login/Login";
import ForgetPassword_EnterEmail from "./SRC/Screens/LoginSignup/ForgetPassword/ForgetPassword_EnterEmail";
import ForgotPassword_EnterVerificationCode from "./SRC/Screens/LoginSignup/ForgetPassword/ForgotPassword_EnterVerificationCode";
import ForgotPassword_ChoosePassword from "./SRC/Screens/LoginSignup/ForgetPassword/ForgotPassword_ChoosePassword";
import ForgotPassword_AccountRecovered from "./SRC/Screens/LoginSignup/ForgetPassword/ForgotPassword_AccountRecovered";
import Signup_AccountCreated from "./SRC/Screens/LoginSignup/Signup/Signup_AccountCreated";
import Signup_EnterVerificationCode from "./SRC/Screens/LoginSignup/Signup/Signup_EnterVerificationCode";
import Signup_ChoosePassword from "./SRC/Screens/LoginSignup/Signup/Signup_ChoosePassword";
import Signup_EnterEmail from "./SRC/Screens/LoginSignup/Signup/Signup_EnterEmail";
import Signup_EnterInfo from "./SRC/Screens/LoginSignup/Signup/Signup_StaffEnterInfo";
import Mainpage from "./SRC/Screens/Mainpage/Mainpage";
import MyUserProfile from "./SRC/Screens/Mainpage/MyUserProfile";
import Signup_StaffEnterInfo from "./SRC/Screens/LoginSignup/Signup/Signup_StaffEnterInfo";
import Signup_PatientEnterInfo from "./SRC/Screens/LoginSignup/Signup/Signup_PatientEnterInfo";
// import History from "./SRC/Screens/Mainpage/History";
import Search from "./SRC/Screens/Mainpage/Search";
import ManageStaff from "./SRC/Screens/Mainpage/ManageStaff";
import ManagePatient from "./SRC/Screens/Mainpage/ManagePatient";
import Customization from "./SRC/Screens/Mainpage/Customization";
import Details from "./SRC/Screens/Mainpage/Details";
import EditProfile from "./SRC/Screens/Mainpage/EditProfile";
import DoctorProfile from "./SRC/Screens/Mainpage/DoctorProfile";
import PatientReport from "./SRC/Screens/Mainpage/PatientReport";
import PatientMainpage from "./SRC/PatientScreens/Mainpage/PatientMainpage";
import UploadPage from "./SRC/PatientScreens/Mainpage/UploadPage";
import ManageRequest from "./SRC/PatientScreens/Mainpage/ManageRequest";
// import AcceptedDoctor from "./SRC/PatientScreens/Mainpage/AcceptedDoctor";
// import AdminMainpage from "./SRC/StaffScreens/Mainpage/AdminMainpage";
// import AdminCustomization from "./SRC/StaffScreens/Mainpage/AdminCustomization";
// import AdminManagePatient from "./SRC/StaffScreens/Mainpage/AdminManagePatient";
// import AdminManageStaff from "./SRC/StaffScreens/Mainpage/AdminManageStaff";
// import AdminSearch from "./SRC/StaffScreens/Mainpage/AdminSearch";
// import PatientMyUserProfile from "./SRC/PatientScreens/Mainpage/PatientMyUserProfile";
// import PatientProfile from "./SRC/PatientScreens/Mainpage/PatientProfile";
// import PatientEditProfile from "./SRC/PatientScreens/Mainpage/PatientEditProfile";
// import StaffMyUserProfile from "./SRC/StaffScreens/Mainpage/StaffMyUserProfile";
// import StaffProfile from "./SRC/StaffScreens/Mainpage/StaffProfile";
// import StaffEditProfile from "./SRC/StaffScreens/Mainpage/StaffEditProfile";

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
        <Stack.Screen name="Signup_EnterEmail" component={Signup_EnterEmail} />
        <Stack.Screen
          name="Signup_AccountCreated"
          component={Signup_AccountCreated}
        />
        <Stack.Screen
          name="Signup_ChoosePassword"
          component={Signup_ChoosePassword}
        />
        <Stack.Screen
          name="Signup_EnterVerificationCode"
          component={Signup_EnterVerificationCode}
        />
        <Stack.Screen name="Signup_EnterInfo" component={Signup_EnterInfo} />
        <Stack.Screen name="Search" component={Search} />
        <Stack.Screen name="Mainpage" component={Mainpage} />
        <Stack.Screen name="MyUserProfile" component={MyUserProfile} />
        <Stack.Screen
          name="Signup_StaffEnterInfo"
          component={Signup_StaffEnterInfo}
        />
        <Stack.Screen
          name="Signup_PatientEnterInfo"
          component={Signup_PatientEnterInfo}
        />
        <Stack.Screen name="ManageStaff" component={ManageStaff} />
        <Stack.Screen name="ManagePatient" component={ManagePatient} />
        <Stack.Screen name="Customization" component={Customization} />
        <Stack.Screen name="Details" component={Details} />
        <Stack.Screen name="History" component={History} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="PatientMainpage" component={PatientMainpage} />
        <Stack.Screen name="UploadPage" component={UploadPage} />
        <Stack.Screen name="ManageRequest" component={ManageRequest} />
        <Stack.Screen name="AcceptedDoctor" component={AcceptedDoctor} />
        <Stack.Screen name="DoctorProfile" component={DoctorProfile} />
        <Stack.Screen name="PatientReport" component={PatientReport} />
        <Stack.Screen name="AdminMainpage" component={AdminMainpage} />
        <Stack.Screen
          name="AdminCustomization"
          component={AdminCustomization}
        />
        <Stack.Screen
          name="AdminManagePatient"
          component={AdminManagePatient}
        />
        <Stack.Screen name="AdminManageStaff" component={AdminManageStaff} />
        <Stack.Screen name="AdminSearch" component={AdminSearch} />
        <Stack.Screen
          name="PatientMyUserProfile"
          component={PatientMyUserProfile}
        />
        <Stack.Screen name="PatientProfile" component={PatientProfile} />
        <Stack.Screen
          name="PatientEditProfile"
          component={PatientEditProfile}
        />
        <Stack.Screen
          name="StaffMyUserProfile"
          component={StaffMyUserProfile}
        />
        <Stack.Screen name="StaffProfile" component={StaffProfile} />
        <Stack.Screen
          name="StaffEditProfile"
          component={StaffEditProfile}
        />{" "}
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
