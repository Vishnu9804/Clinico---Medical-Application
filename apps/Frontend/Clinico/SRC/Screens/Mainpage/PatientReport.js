import {
  FlatList,
  SafeAreaView,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { Linking } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PatientReport = ({ navigation, route }) => {
  const { pat_email } = route.params;
  const [patientHistory, setPatientHistory] = useState([]);
  const sectionListRef = useRef(null);

  const fileOptions = [
    ...new Set(patientHistory.map((report) => report.fileName)),
  ];

  const loadPatientHistory = async () => {
    try {
      // Retrieve the logged-in doctor’s email from AsyncStorage
      const value = await AsyncStorage.getItem("user");
      const doc_email = JSON.parse(value).user.doc_email;

      // Ensure pat_email is available
      if (!pat_email) {
        console.error("Patient email is required.");
        Alert.alert("Error", "Patient email is missing.");
        return;
      }
      console.log(pat_email);
      // Make API call to fetch the secure patient history
      const response = await fetch(
        "http://192.168.128.149:3000/secure-patient-history",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ pat_email, doc_email }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch patient history");
      }

      const data = await response.json();

      // Store the retrieved patient history in the state
      setPatientHistory((prevHistory) => [
        ...prevHistory,
        ...data.patientHistory,
      ]);
    } catch (error) {
      console.error("Error fetching patient history:", error);
      Alert.alert("Error", "Failed to load patient history.");
    }
  };

  const openPDF = (filename) => {
    const pdfUrl = `http://192.168.128.149:3000/view-file/${filename}`;

    fetch(pdfUrl, {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load PDF");
        }
        return response;
      })
      .then(() => {
        Linking.openURL(pdfUrl);
      })
      .catch((error) => {
        console.error("Error opening PDF:", error);
        Alert.alert("Error", "Unable to open PDF.");
      });
  };

  const groupedHistory = fileOptions
    .map((option) => ({
      title: option,
      data: patientHistory.filter((report) => report.fileName === option),
    }))
    .filter((section) => section.data.length > 0);

  const scrollToSection = (index) => {
    sectionListRef.current?.scrollToLocation({
      sectionIndex: index,
      itemIndex: 0,
      animated: true,
    });
  };

  useEffect(() => {
    loadPatientHistory();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>PatientReport</Text>
      <View>
        <FlatList
          data={fileOptions}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() =>
                sectionListRef.current?.scrollToLocation({
                  sectionIndex: index,
                  itemIndex: 0,
                  animated: true,
                })
              }
            >
              <Text style={styles.filterButtonText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <SectionList
        style={styles.sectionListContainer}
        ref={sectionListRef}
        sections={groupedHistory}
        extraData={groupedHistory} // Ensures re-render
        keyExtractor={(item, index) => item.fileDetails.fileUrl + index}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        renderItem={({ item }) => (
          <View style={styles.historyCard}>
            <Text style={styles.historyFileName}>{item.fileName}</Text>
            <Text style={styles.historyFileDetails}>
              Uploaded At:{" "}
              {new Date(item.fileDetails.uploadedAt).toLocaleString()}
            </Text>
            <TouchableOpacity
              style={styles.viewButton}
              onPress={() => openPDF(item.fileDetails.filename)}
            >
              <Text style={styles.viewButtonText}>View</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text>No patient history found</Text>}
      />
    </SafeAreaView>
  );
};

export default PatientReport;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    alignSelf: "center",
  },
  filterButton: {
    height: "auto",
    backgroundColor: "#00A9FF",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  filterButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  sectionListContainer: {
    width: "100%",
    flexGrow: 1, // Ensures the list takes available space
    flexShrink: 1, // Prevents it from growing too much and keeps it positioned after FlatList
    marginTop: 20, // Add a small margin to give space after the FlatList
    marginBottom: 20,
  },
  historyCard: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginVertical: 10,
    borderWidth: 2,
    borderRadius: 40,
    borderColor: "#1E90FF",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  historyFileName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  historyFileDetails: {
    fontSize: 12,
    color: "#555",
    marginTop: 5,
  },
  viewButton: {
    position: "absolute", // Use absolute positioning
    top: 17, // Adjust top distance to control the button's vertical position
    right: 20, // Align the button to the right side
    backgroundColor: "#1E90FF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
  },
  viewButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  uploadButton: {
    position: "absolute",
    bottom: 120,
    right: 20,
    backgroundColor: "#00A9FF",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  uploadButtonText: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingBottom: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    padding: 5,
  },

  closeButtonText: {
    fontSize: 20,
    color: "grey",
    fontWeight: "bold",
  },
  modalButton: {
    width: 120,
    backgroundColor: "#1E90FF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginVertical: 10,
    alignSelf: "center",
  },
  greyButton: {
    width: 135,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginVertical: 10,
    alignSelf: "center",
    backgroundColor: "grey",
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
    alignSelf: "center",
  },
  dropdown: {
    height: "auto",
    borderColor: "#1E90FF",
    borderWidth: 2,
    borderRadius: 20,
    margin: 10,
    width: "80%",
    alignSelf: "center",
    paddingHorizontal: 20,
  },
  sectionHeader: {
    height: "auto",
    fontSize: 18,
    fontWeight: "bold",
    backgroundColor: "#f0f8ff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 5,
    borderRadius: 10,
    color: "#1E90FF",
    textAlign: "center",
  },
});
