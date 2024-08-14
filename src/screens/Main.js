import React, { useEffect, useState } from "react";
import { BackHandler, Image, StyleSheet, TouchableOpacity, View } from "react-native";
import Users from "../tabs/users";
import Settings from "../tabs/settings";
import EditDetails from "../tabs/EditDetails";
import Feedback from "../screens/Feedback"; 


export default function MainScreen() {
  const [selectedTab, setSelectedTab] = useState(0);

  

  return (
    <View style={styles.container}>
      {selectedTab === 0 ? (
        <Users />
      ) : selectedTab === 1 ? (
        <Settings />
      ) : selectedTab === 2 ? (
        <EditDetails />
      ) : (
        <Feedback />
      )}
      <View style={styles.bottomTab}>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => {
            setSelectedTab(0);
          }}
        >
          <Image
            source={require("../images/users.png")}
            style={[styles.tabIcon, { tintColor: selectedTab === 0 ? "white" : "#A09F9F" }]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => {
            setSelectedTab(1);
          }}
        >
          <Image
            source={require("../images/setting.png")}
            style={[styles.tabIcon, { tintColor: selectedTab === 1 ? "white" : "#A09F9F" }]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => {
            setSelectedTab(2);
          }}
        >
          <Image
            source={require("../images/edit.png")}
            style={[styles.tabIcon, { tintColor: selectedTab === 2 ? "white" : "#A09F9F" }]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => {
            setSelectedTab(3);
          }}
        >
          <Image
            source={require("../images/Feedback.png")} 
            style={[styles.tabIcon, { tintColor: selectedTab === 3 ? "white" : "#A09F9F" }]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "white",
    alignItems: "center",
  },
  bottomTab: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 70,
    backgroundColor: "#5089cb",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  tab: {
    width: "20%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  tabIcon: {
    width: 40,
    height: 40,
  },  
});
