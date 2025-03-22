import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";

const AcceptedDoctor = ({ navigation }) => {
  // Static array of accepted doctors
  const acceptedDoctors = [
    {
      id: "1",
      doc_name: "Dr. John Doe",
      doc_email: "johndoe@example.com",
      image: require("../../../assets/MaleProfile.jpg"),
    },
    {
      id: "2",
      doc_name: "Dr. Jane Smith",
      doc_email: "janesmith@example.com",
      image: require("../../../assets/MaleProfile.jpg"),
    },
    {
      id: "3",
      doc_name: "Dr. Emma Brown",
      doc_email: "emmabrown@example.com",
      image: require("../../../assets/MaleProfile.jpg"),
    },
    {
      id: "4",
      doc_name: "Dr. Michael Lee",
      doc_email: "michaellee@example.com",
      image: require("../../../assets/MaleProfile.jpg"),
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <FlatList
        data={acceptedDoctors}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.profileCard}
            onPress={() => navigation.navigate("MyUserProfile")}
          >
            <Image source={item.image} style={styles.profileImage} />
            <View style={styles.textContainer}>
              <Text style={styles.nameText}>{item.doc_name}</Text>
              <Text style={styles.subtitleText}>{item.doc_email}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </ScrollView>
  );
};

export default AcceptedDoctor;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#00A9FF",
    borderRadius: 45,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 50,
    padding: 12,
    marginBottom: 10,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  nameText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  subtitleText: {
    fontSize: 14,
    color: "#666",
  },
});
