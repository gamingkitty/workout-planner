import { Slot, useRouter } from "expo-router";
import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Image,
} from "react-native";

export default function RootLayout() {
  const [menuVisible, setMenuVisible] = useState(false);
  const menuAnim = useRef(new Animated.Value(-250)).current;
  const grayAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  const toggleMenu = () => {
      const toValue = menuVisible ? -250 : 0
      Animated.timing(menuAnim, {
        toValue: toValue,
        duration: 300,
        useNativeDriver: false,
      }).start();

      const toGrayValue = menuVisible ? 0 : 0.4
      Animated.timing(grayAnim, {
        toValue: toGrayValue,
        duration: 300,
        useNativeDriver: false,
      }).start();

      setMenuVisible(!menuVisible);
  };

  return (
    <View style={styles.main}>
      <View style={styles.banner}>
        <View style={{marginTop: 30, justifyContent: "center", alignItems: "flex-start"}}>
          <TouchableOpacity onPress={toggleMenu}>
            <Image
              source={require('../assets/images/menu.png')}
              style={{width: 55, height: 55}}
            />
          </TouchableOpacity>
        </View>
        <View style={{marginTop: 30, justifyContent: "center", alignItems: "center", flex: 1}}>
          <Text style={styles.text}>App Name</Text>
        </View>
        <View style={{marginTop: 30, marginRight: 10, justifyContent: "center", alignItems: "flex-end"}}>
          <TouchableOpacity>
            <Image
              source={require('../assets/images/user-icon.png')}
              style={{width: 40, height: 40}}
            />
          </TouchableOpacity>
        </View>
      </View>

      <Slot/>

      <Animated.View style={[styles.menu, {left: menuAnim}]}>
        <View style={styles.banner}>
          <View style={{marginTop: 30, justifyContent: "center", flex: 1, alignItems: "flex-end"}}>
            <TouchableOpacity onPress={toggleMenu}>
              <Image
                source={require('../assets/images/menu.png')}
                style={{width: 55, height: 55}}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{flexDirection: "column", flex: 1}}>
          <Text style={styles.text}>Stuff Goes Here</Text>
        </View>
      </Animated.View>

      <Animated.View pointerEvents={menuVisible ? "auto" : "none"} style={[styles.grayOut, {opacity: grayAnim}]}/>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={() => router.push("/calendar")}>
          <Image
            source={require('../assets/images/calendar-icon.jpg')}
            style={styles.footerIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={() => router.push("/fitness")}>
          <Image
            source={require('../assets/images/dumbell.png')}
            style={styles.footerIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={() => router.push("/diet")}>
          <Image
            source={require('../assets/images/food.png')}
            style={styles.footerIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={() => router.push("/points")}>
          <Image
            source={require('../assets/images/shop.png')}
            style={styles.footerIcon}
          />
        </TouchableOpacity>
      </View>
      <View style={{position: "absolute", bottom: 0, left: 0, right: 0, height: 50, backgroundColor: "gray"}}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: "white",
  },
  banner: {
    backgroundColor: "lightgray",
    height: 80,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    flexDirection: "row",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 110,
    backgroundColor: "lightgray",
    borderTopWidth: 1,
    borderTopColor: "gray",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  footerIcon: {
    height: 35,
    width: 35,
  },
  footerButton: {
    height: 60,
    width: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  menu: {
    top: 0,
    bottom: 0,
    width: 250,
    backgroundColor: "white",
    elevation: 5,
    position: "absolute",
    zIndex: 2,
  },
  bigText: {
    fontSize: 40,
    color: "black",
  },
  text: {
    fontSize: 24,
    color: "black",
  },
  grayOut: {
    position: "absolute",
    zIndex: 1,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "gray"
  },
});
