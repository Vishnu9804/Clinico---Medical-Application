import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  FlatList,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import PatientBottomnavbar from "../../Components/PatientBottomnavbar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRef } from "react";

const images = [
  require("../../../assets/Slider1.1.jpg"),
  require("../../../assets/Slider1.1.jpg"),
  require("../../../assets/Slider1.1.jpg"),
];

const { width } = Dimensions.get("window");

const PatientMainpage = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const [userdata, setUserdata] = useState(null);
  const [visitedDoctors, setVisitedDoctors] = useState([]);

  const loaddata = () => {
    AsyncStorage.getItem("user")
      .then((value) => {
        if (!value) return;
        const parsedValue = JSON.parse(value);
        const pat_email = parsedValue.user.pat_email;
        console.log("pat_Email page1 :- ", pat_email);

        fetch("http://192.168.125.149:3000/patientdata", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + parsedValue.token,
          },
          body: JSON.stringify({ email: pat_email }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("API Response:", data);
            if (data.message === "User data fetched successfully!!!!") {
              setUserdata(data.user);
              setVisitedDoctors(data.user.visited_doctors || []);
            } else {
              alert("You Logged Out");
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

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  });

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* Patient Profile */}
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.profileCard}
          onPress={() => navigation.navigate("PatientMyUserProfile")}
        >
          <Image
            source={require("../../../assets/MaleProfile.jpg")}
            style={styles.profileImage}
          />
          <View style={styles.textContainer}>
            <Text style={styles.nameText}>
              {userdata?.pat_name || "Loading"}
            </Text>
            <Text style={styles.subtitleText}>
              {userdata?.pat_email || "Loading..."}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.carouselContainer}>
          <FlatList
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={true}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Image source={item} style={styles.sliderImage} />
            )}
            contentContainerStyle={styles.flatListContent}
            onViewableItemsChanged={onViewableItemsChanged.current}
            viewabilityConfig={viewabilityConfig.current}
            ref={flatListRef}
            snapToAlignment="center"
            decelerationRate="fast"
          />
          <View style={styles.paginationContainer}>
            {images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  currentIndex === index && styles.activePaginationDot,
                ]}
              />
            ))}
          </View>
        </View>
        <View style={styles.doctorList}>
          <Text style={styles.listHeading}>List of Visited Doctors</Text>

          {visitedDoctors.length === 0 ? (
            <Text style={styles.noDoctorText}>
              No doctors have been visited yet.
            </Text>
          ) : (
            <FlatList
              data={visitedDoctors}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={{ flexGrow: 1 }} // ✅ Ensures it takes space
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.profileCardDoctor}
                  onPress={() =>
                    navigation.navigate("DoctorProfile", {
                      doc_email: item.doc_email,
                    })
                  }
                >
                  <View style={styles.textContainer}>
                    <Text style={styles.nameText}>
                      {item.doc_name || "Loading"}
                    </Text>
                    <Text style={styles.subtitleText}>
                      {item.doc_email || "Loading..."}
                    </Text>
                    <Text style={styles.subtitleText}>
                      {item.visited_at
                        ? new Date(item.visited_at).toLocaleDateString()
                        : "Loading..."}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </View>
      {/* Bottom Navigation */}
      <PatientBottomnavbar navigation={navigation} page={"PatientMainpage"} />
    </SafeAreaView>
  );
};

export default PatientMainpage;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white", // Ensure the status bar color matches
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
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
  profileCardDoctor: {
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
    elevation: 5,
    padding: 20,
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
  carouselContainer: {
    marginTop: 10,
    elevation: 10,
  },
  flatListContent: {
    alignItems: "center",
  },
  sliderImage: {
    width: width - 40,
    height: (width - 40) * 0.6, // Maintain aspect ratio
    borderRadius: 20,
    marginHorizontal: 10,
    resizeMode: "cover",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  paginationDot: {
    marginTop: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  activePaginationDot: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    width: 10,
    height: 10,
  },
  doctorList: {
    height: "48%",
    marginTop: 20,
  },
  listHeading: {
    alignSelf: "center",
    marginBottom: 20,
    fontWeight: "bold",
    fontSize: 20,
  },
  noDoctorText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
    color: "#888",
    marginTop: 10,
    paddingVertical: 10,
  },
});
