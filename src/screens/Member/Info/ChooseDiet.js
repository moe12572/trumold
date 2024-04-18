import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  StatusBar,
  Image,
  Alert,
} from "react-native";
import React, { useState,useEffect } from "react";
import { SIZES, FONTS, COLORS, images } from "../../../constants";
import { Footer, Header, Loader } from "../../../components";
import { API,graphqlOperation,graphql } from "aws-amplify";
import { User, UserRole, UserStatus } from "../../../models";
import { updateUser } from "../../../graphql/mutations";

import ScreenName from "../../../utils/ScreenName";
import { setCurrentUserInfo, setUserSelectedRole } from "../../../utils/services/StorageService";
const diets = [
  {
    title: "Standard",
    content: "Nope, i eat everything",
    icon: images.dietStandard,
  },
  {
    title: "Low-carb",
    content: "Vegetables, meat, fish, eggs, fruits...",
    icon: images.dietLowCarb,
  },
  {
    title: "Mediterranean",
    content: "Vegetables, fruits, fish, poultry...",
    icon: images.dietMediterranean,
  },
  {
    title: "Vegan",
    content: "Plant foods and eliminates ",
    icon: images.dietVegan,
  },
  {
    title: "Keto Diet",
    content: "Low-carb veggies and seafood",
    icon: images.dietKeto,
  },
  {
    title: "Other",
    icon: images.dietOther,
  },
];

const ChooseDiet = ({ navigation, route }) => {
  const [selected, setSelected] = useState(null);
  const [isLoader, setIsLoader] = useState(false);
  const selectDiet = (diet) => {
    setSelected(diet.title);
  };

  const { params } = route;

  useEffect(()=>{
    if(params && params!==null && params.userInformation){
      let meal_routine = params?.userInformation?.meal_routine?(params?.userInformation?.meal_routine):null;
      setSelected(meal_routine);
    }
  },[]) 

  const saveUserInformation = async () => {
    try {
      if (selected && selected !== null) {
        if (params && params !== null && params.userInformation) {
          // const original = await DataStore.query(
          //   User,
          //   params.userInformation.id
          // );
          // let response = await DataStore.save(
          //   User.copyOf(original, (updated) => {
          //     updated.meal_routine = selected;
          //     updated.status = UserStatus.ACTIVE;
          //   })
          // );

          // navigation.navigate(ScreenName.SUCCESS, {
          //   userInformation: response,
          // });

          let payload = {
            id: params.userInformation.id,
            meal_routine:selected,
            status:UserStatus.ACTIVE,
            _version:params.userInformation._version
          };
          let screen=ScreenName.MEMBERHOME;
          await setUserSelectedRole(params.userInformation.role)
          if(params.userInformation.role===UserRole.COACH){
            screen = ScreenName.COACHHOME;
          }
          setIsLoader(true);
          let response = await API.graphql(
            graphqlOperation(updateUser, { input: payload })
          );
         
          setIsLoader(false);
          await setCurrentUserInfo(response.data.updateUser);
                // return;
          navigation.navigate(ScreenName.SUCCESS, {
            userInformation: response.data.updateUser,
            screen
          });

        } else {
          Alert.alert("Params not found");
        }
      } else {
        Alert.alert("The Diet field is required");
      }
    } catch (error) {
      setIsLoader(false);
      if (error.message) {
        Alert.alert(error.message);
      }
    }
  };

  const renderDiet = () => {
    return diets.map((diet) => {
      return (
        <TouchableOpacity
          activeOpacity={1}
          key={diet.title}
          onPress={() => selectDiet(diet)}
          style={[
            styles.box,
            diet.title === selected && {
              backgroundColor: COLORS.primary,
              borderColor: COLORS.white,
            },
          ]}
        >
          <View style={styles.imageWrap}>
            <Image
              source={diet.icon}
              style={{ height: 40, width: 40, resizeMode: "contain" }}
            />
          </View>
          <View>
            <Text
              style={[
                styles.title,
                diet.title === selected && { color: COLORS.white },
              ]}
            >
              {diet.title}
            </Text>
            {diet.content && (
              <Text
                style={[
                  styles.content,
                  diet.title === selected && { color: COLORS.white },
                ]}
              >
                {diet.content}
              </Text>
            )}
          </View>
        </TouchableOpacity>
      );
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.dark} />
      <ScrollView style={styles.container}>
        <View style={styles.spacing}>
          {isLoader?<Loader/>:null}
          <Header
            heading="Are you currently following a meal routine?"
            subHeading="Step 6/6"
            headingInverse={true}
            navigation={navigation}
          />
          {renderDiet()}
          <Footer
            backScreen="Information"
            nextScreen="Success"
            navigation={navigation}
            onPress={saveUserInformation}
          />
        </View>
      </ScrollView>
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
  box: {
    borderWidth: 1,
    borderColor: COLORS.grey,
    height: 70,
    marginVertical: SIZES.base,
    borderRadius: SIZES.base,
    padding: SIZES.basePadding,
    flexDirection: "row",
    alignItems: "center",
  },
  imageWrap: {
    width: 40,
    marginRight: SIZES.base,
  },
  title: {
    color: COLORS.dark,
    ...FONTS.body2Bold,
  },
  content: {
    color: COLORS.black60,
  },
});

export default ChooseDiet;
