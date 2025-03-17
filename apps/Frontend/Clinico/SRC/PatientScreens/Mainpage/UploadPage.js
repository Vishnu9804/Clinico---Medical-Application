import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Alert,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Linking,
  FlatList,
  SectionList,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import * as DocumentPicker from "expo-document-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PatientBottomnavbar from "../../Components/PatientBottomnavbar";
import { useEffect, useRef } from "react";

const UploadPage = ({ navigation }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState(""); // State to hold the file name input by the user
  const [modalVisible, setModalVisible] = useState(false); // State to control modal visibility
  const [patientHistory, setPatientHistory] = useState([]); // State to hold the fetched patient history
  const sectionListRef = useRef(null);

  const fileOptions = [
    ...new Set(patientHistory.map((report) => report.fileName)),
  ];

  const reportTypes = [
    "Blood Report",
    "Diabetes Report",
    "UrineTest Report",
    "Vaccine Reports",
    "Medical Prescriptions",
    "Allergy Test Report",
    "ECG Report",
    "Cholesterol Report",
    "Blood Pressure Report",
  ];

  const loadPatientHistory = async () => {
    const value = await AsyncStorage.getItem("user");
    const pat_email = JSON.parse(value).user.pat_email;

    try {
      const response = await fetch(
        "http://192.168.125.149:3000/patient-history",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ pat_email }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch patient history");
      }
      const data = await response.json();
      setPatientHistory(data.patientHistory); // Set the patient history data
    } catch (error) {
      console.error("Error fetching patient history:", error);
      Alert.alert("Error", "Failed to load patient history.");
    }
  };

  // Function to pick a PDF file
  // Function to pick a PDF or image file
  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/jpeg", "image/png", "image/jpg"],
      });

      if (result.canceled) return;

      const file = result.assets[0]; // Extract the picked file

      if (!file) {
        Alert.alert("Error", "No file selected.");
        return;
      }

      console.log("Picked file:", file);

      // **File size validation**
      if (file.size) {
        if (
          file.mimeType === "application/pdf" &&
          file.size > 10 * 1024 * 1024
        ) {
          Alert.alert("File too large", "PDF file size should be under 10MB.");
          return;
        }
        if (file.mimeType.startsWith("image/") && file.size > 5 * 1024 * 1024) {
          Alert.alert("File too large", "Image file size should be under 5MB.");
          return;
        }
      }

      setSelectedFile(file); // Set file only if it passes size validation
    } catch (error) {
      console.error("Error picking file:", error);
      Alert.alert("Error", "Failed to pick file.");
    }
  };

  // Function to upload the file to the backend
  const uploadFile = async () => {
    if (!selectedFile || !selectedFile.uri) {
      console.log("selectedFile.uri :- ", selectedFile?.uri);
      Alert.alert("No file selected", "Please pick a file first.");
      return;
    }
    if (!fileName) {
      Alert.alert("File name required", "Please enter a file name.");
      return;
    }

    const value = await AsyncStorage.getItem("user");
    const pat_email = JSON.parse(value)?.user?.pat_email; // Ensure we don't crash if `value` is null

    try {
      const formData = new FormData();

      // Append the file with correct type
      formData.append("file", {
        uri: selectedFile.uri, // No need to encodeURI
        name: selectedFile.name || `file_${Date.now()}`, // Use default if name is missing
        type:
          selectedFile.mimeType ||
          selectedFile.type ||
          "application/octet-stream", // Ensure correct type
      });

      formData.append("pat_email", pat_email);
      formData.append("fileName", fileName);

      const response = await fetch("http://192.168.125.149:3000/upload-file", {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data", // Explicitly set this
        },
      });

      const responseData = await response.text();
      console.log("Upload response:", responseData);
      Alert.alert("Success", "File uploaded successfully!");

      setFileName(""); // Reset file name input
      setSelectedFile(null); // Reset selected file
    } catch (error) {
      console.error("Upload error:", error);
      Alert.alert("Upload Failed", "An error occurred while uploading.");
    }
  };

  const openPDF = (filename) => {
    const pdfUrl = `http://192.168.125.149:3000/view-file/${filename}`;

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

  // Format patient history into sections based on file type
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
  }, [patientHistory]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Upload Page</Text>
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
      {/* Modal to select and upload file */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select or Upload File</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>
            </View>
            {/* Dropdown for selecting file type, stored in fileName */}
            <Dropdown
              style={styles.dropdown}
              data={reportTypes.map((item) => ({ label: item, value: item }))}
              search
              labelField="label"
              valueField="value"
              placeholder="Select a report type"
              searchPlaceholder="Search..."
              value={fileName}
              onChange={(item) => setFileName(item.value)}
            />
            {/* Button to pick file */}
            <TouchableOpacity
              style={!selectedFile ? styles.modalButton : styles.greyButton}
              onPress={pickFile}
              disabled={selectedFile} // Disable "Select File" button if a file is selected
            >
              <Text style={styles.modalButtonText}>
                {selectedFile ? "File Selected" : "Select File"}
              </Text>
            </TouchableOpacity>

            {/* Upload file button */}
            <TouchableOpacity
              style={
                selectedFile && fileName
                  ? styles.modalButton
                  : styles.greyButton
              }
              onPress={uploadFile}
              disabled={!selectedFile || !fileName} // Disable if file or name is missing
            >
              <Text style={styles.modalButtonText}>Upload File</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Bottom right upload button to open modal */}
      <TouchableOpacity
        style={styles.uploadButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.uploadButtonText}>+</Text>
      </TouchableOpacity>

      <PatientBottomnavbar navigation={navigation} page={"UploadPage"} />
    </SafeAreaView>
  );
};

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
    marginBottom: 95,
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
    paddingVertical: 5,
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

export default UploadPage;
