import {
  SafeAreaView,
  View,
  StyleSheet,
  Platform,
  StatusBar,
  Image,
  Text,
  Alert,
} from "react-native";
import React, { useState,useEffect } from "react";
import { SIZES, FONTS, COLORS, icons } from "../../../constants";
import { Footer, Header, Loader } from "../../../components";
import { TouchableOpacity } from "react-native-gesture-handler";
import { API,graphqlOperation,graphql } from "aws-amplify";
import { User } from "../../../models";
import { updateUser } from "../../../graphql/mutations";

import ScreenName from "../../../utils/ScreenName";

const activityLevel = [
  {
    icon: icons.inactiveIcon,
    label: "Extremely inactive",
  },
  {
    icon: icons.activeIcon,
    label: "Vigorously active",
  },
  {
    icon: icons.moderateActiveIcon,
    label: "Moderately active",
  },
];

const ActivityLevel = ({ navigation, route }) => {
  const [selected, setSelected] = useState("Vigorously active");
  const [isLoader, setIsLoader] = useState(false);

  const selectItem = (item) => {
    setSelected(item.label);
  };
  const { params } = route;

  useEffect(()=>{
    if(params && params!==null && params.userInformation){
      let current_activity_lebel = params?.userInformation?.current_activity_lebel?(params?.userInformation?.current_activity_lebel):'Vigorously active';
      setSelected(current_activity_lebel);
    }
  },[]) 

  const saveUserInformation = async () => {
    try {
      if (params && params !== null && params.userInformation) {
       

        let payload = {
          id: params.userInformation.id,
          current_activity_lebel:selected,
        };
        setIsLoader(true);
        let response = await API.graphql(
          graphqlOperation(updateUser, { input: payload })
        );
        setIsLoader(false);
        navigation.navigate(ScreenName.CHOOSEDIET, {
          userInformation: response.data.updateUser,
        });

      }else{
        Alert.alert("Params not found")
      }
    } catch (error) {
      setIsLoader(false);
      if (error.message) {
        Alert.alert(error.message);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.dark} />
      <View style={styles.boxContainer}>
        {isLoader?<Loader/>:null}
        <View style={styles.spacing}>
          <Header
            heading="What’s your current activity level?"
            subHeading="Step 5/6"
            headingInverse={true}
            navigation={navigation}
          />
        </View>
        <View style={styles.row}>
          {activityLevel.map((item) => {
            return (
              <TouchableOpacity
                onPress={() => selectItem(item)}
                key={item.label}
                activeOpacity={1}
                style={styles.box}
              >
                <View
                  style={[
                    selected === item.label
                      ? [styles.imageWrap, { borderColor: COLORS.primary }]
                      : styles.imageWrap,
                  ]}
                >
                  <Image
                    source={item.icon}
                    style={[
                      selected === item.label
                        ? { height: 50, width: 50 }
                        : { height: 40, width: 40 },
                      { resizeMode: "contain" },
                    ]}
                  />
                </View>
                <Text
                  style={[
                    selected === item.label
                      ? styles.activeTitle
                      : styles.inactiveTitle,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={styles.spacing}>
          <Footer
            backScreen="Height"
            nextScreen="ChooseDiet"
            navigation={navigation}
            onPress={saveUserInformation}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  spacing: {
    paddingBottom: Platform.OS == "android" ? SIZES.basePadding * 2 : 0,
    paddingHorizontal: SIZES.basePadding,
  },
  boxContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  row: {
    paddingHorizontal: SIZES.basePadding,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  box: {
    alignItems: "center",
    width: 100,
  },
  imageWrap: {
    width: 80,
    height: 80,
    marginBottom: SIZES.basePadding,
    borderColor: COLORS.grey,
    borderWidth: 1,
    borderRadius: SIZES.base,
    alignItems: "center",
    justifyContent: "center",
  },
  inactiveTitle: {
    color: COLORS.black40,
    ...FONTS.body1,
    textAlign: "center",
  },
  activeTitle: {
    color: COLORS.primary,
    ...FONTS.body2Bold,
    textAlign: "center",
  },
});

export default ActivityLevel;
