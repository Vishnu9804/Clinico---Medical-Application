import { StyleSheet, Text, View } from "react-native";
import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

const Bottomnavbar = ({ navigation, page }) => {
  console.log(page);
  return (
    <View style={styles.container}>
      {page === "Mainpage" ? (
        <MaterialIcons
          style={styles.activeicon}
          name="home"
          size={30}
          color="black"
          onPress={() => {
            navigation.navigate("Mainpage");
          }}
        />
      ) : (
        <MaterialIcons
          name="home"
          size={24}
          color="black"
          onPress={() => {
            navigation.navigate("Mainpage");
          }}
        />
      )}
      {/* {page === "History" ? (
        <MaterialIcons
          style={styles.activeicon}
          name="history"
          size={30}
          color="black"
          onPress={() => {
            navigation.navigate("History");
          }}
        />
      ) : (
        <MaterialIcons
          name="history"
          size={24}
          color="black"
          onPress={() => {
            navigation.navigate("History");
          }}
        />
      )} */}
      {page === "Search" ? (
        <MaterialIcons
          style={styles.activeicon}
          name="person-search"
          size={30}
          color="black"
          onPress={() => {
            navigation.navigate("Search");
          }}
        />
      ) : (
        <MaterialIcons
          name="person-search"
          size={24}
          color="black"
          onPress={() => {
            navigation.navigate("Search");
          }}
        />
      )}
      {page === "ManagePatient" ? (
        <MaterialIcons
          style={styles.activeicon}
          name="medical-services"
          size={30}
          color="black"
          onPress={() => {
            console.log(page);
            navigation.navigate("ManagePatient");
          }}
        />
      ) : (
        <MaterialIcons
          name="medical-services"
          size={24}
          color="black"
          onPress={() => {
            navigation.navigate("ManagePatient");
          }}
        />
      )}
      {page === "Customization" ? (
        <FontAwesome6
          style={styles.activeicon}
          name="truck-medical"
          size={30}
          color="black"
          onPress={() => {
            navigation.navigate("Customization");
          }}
        />
      ) : (
        <FontAwesome6
          name="truck-medical"
          size={24}
          color="black"
          onPress={() => {
            navigation.navigate("Customization");
          }}
        />
      )}
      {page === "ManageStaff" ? (
        <MaterialIcons
          style={styles.activeicon}
          name="group"
          size={30}
          color="black"
          onPress={() => {
            console.log("this is bottomnavbar managestaf");
            navigation.navigate("ManageStaff");
          }}
        />
      ) : (
        <MaterialIcons
          name="group"
          size={24}
          color="black"
          onPress={() => {
            navigation.navigate("ManageStaff");
          }}
        />
      )}
    </View>
  );
};

export default Bottomnavbar;

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
