import React, { useState, useRef, useEffect } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Bottomnavbar from "../../Components/Bottomnavbar";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Calendar } from "react-native-calendars";

const images = [
  require("../../../assets/Slider1.1.jpg"),
  require("../../../assets/Slider1.1.jpg"),
  require("../../../assets/Slider1.1.jpg"),
];

const { width } = Dimensions.get("window");

const Mainpage = ({ navigation, route }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const [userdata, setUserdata] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
    navigation.navigate("Details", {
      date: day.dateString,
      doc_email: userdata.doc_email,
    });
  };

  const loaddata = () => {
    AsyncStorage.getItem("user")
      .then((value) => {
        const doc_email = JSON.stringify(JSON.parse(value).user.doc_email);
        console.log("Doc_Email page1 :- ", doc_email);
        fetch("http://192.168.128.149:3000/doctordata", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + JSON.parse(value).token,
          },
          body: JSON.stringify({ email: JSON.parse(value).user.doc_email }),
        })
          .then((res) => res.json())
          .then(async (data) => {
            console.log("API Response:", data);
            if (data.message === "User data fetched succefully!!!!") {
              setUserdata(data.user);
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

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  });

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  });

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.profileCard}
        onPress={() => navigation.navigate("MyUserProfile")}
      >
        <Image
          source={require("../../../assets/MaleProfile.jpg")}
          style={styles.profileImage}
        />
        <View style={styles.textContainer}>
          <Text style={styles.nameText}>
            {userdata?.doc_name || "Loading..."}
          </Text>
          <Text style={styles.subtitleText}>
            {userdata?.doc_email || "Loading..."}
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
      <View style={styles.calendercontainer}>
        <Calendar
          style={styles.calender}
          onDayPress={onDayPress}
          markedDates={{
            [selectedDate]: { selected: true, selectedColor: "blue" },
          }}
        />
        <Text style={styles.calenderfooter}>
          Tap a date to view tasks and remainders
        </Text>
      </View>
      <Bottomnavbar navigation={navigation} page="Mainpage" />
    </SafeAreaView>
  );
};

export default Mainpage;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 16,
    flex: 1,
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
  calendercontainer: {
    marginTop: 10,
    borderRadius: 20,
    backgroundColor: "#f9fafc",
    padding: 8,
    paddingTop: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    elevation: 3,
    alignSelf: "center",
    width: width * 0.87, // Slightly reduced width
  },
  calender: {
    borderRadius: 18,
    height: 320, // Reduced height
    width: "90%",
    alignSelf: "center", // Fit parent width
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    elevation: 2,
  },
  calenderfooter: {
    textAlign: "center",
    fontSize: 12,
    color: "#666",
    marginTop: 6,
    fontWeight: "500",
  },
});
