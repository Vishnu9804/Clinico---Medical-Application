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

const PatientProfile = ({ navigation, route }) => {
  const { pat_email } = route.params;
  const [darkMode, setDarkMode] = useState(false);
  const [userdata, setUserData] = useState(null);
  const [userdate, setUserDate] = useState(null);
  const toggleSwitch = () => setDarkMode((previousState) => !previousState);

  const loaddata = async () => {
    try {
      console.log(pat_email);
      fetch("http://192.168.125.149:3000/patientprofiledata", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pat_email: pat_email }),
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

export default PatientProfile;

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
    backgroundColor: "#1E90FF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    elevation: 30,
    marginVertical: 10,
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
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
