import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
} from "react-native";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PatientMyUserProfile = ({ navigation }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [userdata, setUserData] = useState(null);
  const [userdate, setUserDate] = useState(null);
  const toggleSwitch = () => setDarkMode((previousState) => !previousState);

  const loaddata = async () => {
    try {
      const value = await AsyncStorage.getItem("user");
      const pat_email = JSON.parse(value).user.pat_email;
      console.log(pat_email);
      fetch("http://192.168.125.149:3000/patientdata", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + JSON.parse(value).token,
        },
        body: JSON.stringify({ email: pat_email }),
      })
        .then((res) => res.json())
        .then(async (data) => {
          console.log("API Response 2:", data);
          if (data.message === "User data fetched successfully!!!!") {
            setUserData(data.user);
            setUserDate(data.date);
          } else {
            alert("You Logged Out");
            navigation.navigate("Login");
          }
        })
        .catch((err) => {
          console.error("API Error:", err);
          alert("An error occurred while fetching data!");
        });
    } catch (error) {
      console.error("AsyncStorage Error:", error);
      alert("Failed to retrieve user data.");
    }
  };

  useEffect(() => {
    loaddata();
  }, []);

  useEffect(() => {
    if (userdata) {
      console.log("Updated userdata:", userdata);
      console.log("Date :---- " + userdate);
    }
  }, [userdata]);

  return (
    <ImageBackground
      source={require("../../../assets/BackGround.png")}
      style={styles.background}
      imageStyle={styles.imageStyle}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        style={[styles.container, darkMode && styles.darkContainer]}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back-ios" size={24} color="black" />
          </TouchableOpacity>
          <View style={styles.profilePicContainer}>
            <Image
              source={require("../../../assets/MaleProfile.jpg")}
              style={styles.profilePic}
            />
          </View>
          <Text style={[styles.profileName, darkMode && styles.darkText]}>
            {userdata ? userdata.pat_name : "Loading..."}
          </Text>
          <View style={styles.btnContainer}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => {
                navigation.navigate("PatientEditProfile", {
                  pat_email: userdata.pat_email,
                  pat_name: userdata.pat_name,
                  pat_phone: userdata.pat_phone,
                  pat_dob: userdata.pat_dob,
                  pat_gender: userdata.pat_gender,
                  pat_profilepic: userdata.pat_profilepic,
                  pat_add: userdata.pat_add,
                });
              }}
            >
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.LogoutButton}
              onPress={() => {
                alert("You have been Logout");
                navigation.navigate("Login");
              }}
            >
              <Text style={styles.editButtonText}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.details}>
          <View style={styles.section}>
            <Text style={styles.label}>Doctor Phone Number:</Text>
            <Text style={[styles.value, darkMode && styles.darkText]}>
              {userdata ? userdata.pat_phone : "Loading..."}
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>Email Address:</Text>
            <Text style={[styles.value, darkMode && styles.darkText]}>
              {userdata ? userdata.pat_email : "Loading..."}
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>Date of Birth:</Text>
            <Text style={[styles.value, darkMode && styles.darkText]}>
              {userdata ? userdata.pat_dob : "Loading..."}
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>Gender</Text>
            <Text style={[styles.value, darkMode && styles.darkText]}>
              {userdata ? userdata.pat_gender : "Loading..."}
            </Text>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default PatientMyUserProfile;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  imageStyle: {
    opacity: 0.2,
  },
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  scrollContent: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  darkContainer: {
    backgroundColor: "#333",
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  profilePicContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 80,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#fff",
  },
  profilePic: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  profileName: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  darkText: {
    color: "#fff",
  },
  editButton: {
    width: 120,
    backgroundColor: "#1E90FF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    elevation: 30,
    marginVertical: 10,
  },
  btnContainer: {
    width: "80%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  editButtonText: {
    alignSelf: "center",
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  LogoutButton: {
    width: 120,
    backgroundColor: "#ff0045",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    elevation: 30,
    marginVertical: 10,
  },
  details: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    paddingTop: 30,
    marginBottom: 30,
    backgroundColor: "#fff",
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "bold",
  },
  value: {
    fontSize: 16,
    color: "#333",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 16,
  },
});
