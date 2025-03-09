import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MyUserProfile = ({ navigation }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [userdata, setUserData] = useState(null);
  const [userdate, setUserDate] = useState(null);
  const toggleSwitch = () => setDarkMode((previousState) => !previousState);

  const loaddata = () => {
    AsyncStorage.getItem("user")
      .then((value) => {
        fetch("http://192.168.128.149:3000/doctordata", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + JSON.parse(value).token,
          },
          body: JSON.stringify({ email: JSON.parse(value).user.email }),
        })
          .then((res) => res.json())
          .then(async (data) => {
            console.log("API Response 2:", data);
            if (data.message === "User data fetched succefully!!!!") {
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
      })
      .catch((err) => alert(err));
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
          <View style={styles.profilePicContainer}>
            <Image
              source={require("../../../assets/MaleProfile.jpg")}
              style={styles.profilePic}
            />
          </View>
          <Text style={[styles.profileName, darkMode && styles.darkText]}>
            Dr. {userdata ? userdata.doc_name : "Loading..."}
          </Text>
          <View style={styles.btnContainer}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => {
                navigation.navigate("EditProfile", {
                  doc_email: userdata.doc_email,
                  doc_name: userdata.doc_name,
                  doc_phone: userdata.doc_phone,
                  doc_exp: userdata.doc_exp,
                  doc_spec: userdata.doc_spec,
                  doc_dob: userdata.doc_dob,
                  doc_degree: userdata.doc_degree,
                  doc_gender: userdata.doc_gender,
                  clinic_phone: userdata.clinic_phone,
                  clinic_name: userdata.clinic_name,
                  clinic_add: userdata.clinic_add,
                  clinic_time: userdata.clinic_time,
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
              {userdata ? userdata.doc_phone : "Loading..."}
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>Clinic Name:</Text>
            <Text style={[styles.value, darkMode && styles.darkText]}>
              {userdata ? userdata.clinic_name : "Loading..."}
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>Clinic Phone Number:</Text>
            <Text style={[styles.value, darkMode && styles.darkText]}>
              {userdata ? userdata.clinic_phone : "Loading..."}
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>Email Address:</Text>
            <Text style={[styles.value, darkMode && styles.darkText]}>
              {userdata ? userdata.doc_email : "Loading..."}
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>Clinic Address:</Text>
            <Text style={[styles.value, darkMode && styles.darkText]}>
              {userdata ? userdata.clinic_add : "Loading..."}
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>Date of Birth:</Text>
            <Text style={[styles.value, darkMode && styles.darkText]}>
              {userdata ? userdata.doc_dob : "Loading..."}
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>Gender</Text>
            <Text style={[styles.value, darkMode && styles.darkText]}>
              {userdata ? userdata.doc_gender : "Loading..."}
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>Degree</Text>
            <Text style={[styles.value, darkMode && styles.darkText]}>
              {userdata ? userdata.doc_degree : "Loading..."}
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>Specialization</Text>
            <Text style={[styles.value, darkMode && styles.darkText]}>
              {userdata ? userdata.doc_spec : "Loading..."}
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>Years Of Expirience</Text>
            <Text style={[styles.value, darkMode && styles.darkText]}>
              {userdata ? userdata.doc_exp : "Loading..."}
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>Clinic Time:</Text>
            <Text style={[styles.value, darkMode && styles.darkText]}>
              {userdata ? userdata.clinic_time : "Loading..."}
            </Text>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default MyUserProfile;

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
});
