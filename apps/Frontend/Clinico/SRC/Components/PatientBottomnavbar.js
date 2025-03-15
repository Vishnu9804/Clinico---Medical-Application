import { StyleSheet, Text, View } from "react-native";
import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

const PatientBottomnavbar = ({ navigation, page }) => {
  return (
    <View style={styles.container}>
      {page === "PatientMainpage" ? (
        <MaterialIcons
          style={styles.activeicon}
          name="home"
          size={30}
          color="black"
          onPress={() => {
            navigation.navigate("PatientMainpage");
          }}
        />
      ) : (
        <MaterialIcons
          name="home"
          size={24}
          color="black"
          onPress={() => {
            navigation.navigate("PatientMainpage");
          }}
        />
      )}
      {page === "UploadPage" ? (
        <MaterialIcons
          style={styles.activeicon}
          name="history"
          size={30}
          color="black"
          onPress={() => {
            navigation.navigate("UploadPage");
          }}
        />
      ) : (
        <MaterialIcons
          name="history"
          size={24}
          color="black"
          onPress={() => {
            navigation.navigate("UploadPage");
          }}
        />
      )}
      {page === "AcceptedDoctor" ? (
        <FontAwesome6
          style={styles.activeicon}
          name="truck-medical"
          size={30}
          color="black"
          onPress={() => {
            navigation.navigate("AcceptedDoctor");
          }}
        />
      ) : (
        <FontAwesome6
          name="truck-medical"
          size={24}
          color="black"
          onPress={() => {
            navigation.navigate("AcceptedDoctor");
          }}
        />
      )}
      {page === "ManageRequest" ? (
        <MaterialIcons
          style={styles.activeicon}
          name="manage-accounts"
          size={30}
          color="black"
          onPress={() => {
            navigation.navigate("ManageRequest");
          }}
        />
      ) : (
        <MaterialIcons
          name="manage-accounts"
          size={24}
          color="black"
          onPress={() => {
            navigation.navigate("ManageRequest");
          }}
        />
      )}
    </View>
  );
};

export default PatientBottomnavbar;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#89CFF3",
    borderRadius: 50,
    position: "absolute",
    bottom: 30,
    width: "90%",
    paddingHorizontal: 25,
    paddingVertical: 10,
    alignItems: "center",
    alignSelf: "center",
  },
  activeicon: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 30,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
});
