import {
  SafeAreaView,
  View,
  StyleSheet,
  Platform,
  StatusBar,
  Alert,
} from "react-native";
import React, { useState,useEffect } from "react";
import { SIZES, FONTS, COLORS } from "../../../constants";
import { Footer, Header, Loader, Scale } from "../../../components";
import { API, graphqlOperation } from "aws-amplify";
import { User } from "../../../models";
import ScreenName from "../../../utils/ScreenName";
import { updateUser } from "../../../graphql/mutations";
import { setCurrentUserInfo } from "../../../utils/services/StorageService";

const Weight = ({ navigation, route }) => {
  const { params } = route;
  const [userWeight, setUserWeight] = useState(166);
  const [selectedScale, setSelectedScale] = useState("");
  const [isLoader,setIsLoader] = useState(false);
  const saveUserInformation = async () => {
    try {
      if (userWeight !== 0) {
        if (params && params!==null && params.userInformation) {
          let payload ={
            id:params.userInformation.id,
            weight:`${userWeight.toString()}${selectedScale}`
          }
          setIsLoader(true)
          let response = await API.graphql(graphqlOperation(updateUser,{input:payload}));
          setCurrentUserInfo(response.data.updateUser)
          setIsLoader(false)
          navigation.navigate(ScreenName.TARGETWEIGHT, {
            userInformation: response.data.updateUser,
          });
        }
      } else {
        Alert.alert("Your weight more than 0 ");
      }
    } catch (error) {
      setIsLoader(false)
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
            heading="What is your weight?"
            subHeading="Step 2/6"
            headingInverse={true}
            navigation={navigation}
          />
        </View>
        <Scale
          for="weight"
          size={166}
          returnValue={setUserWeight}
          setSelectedScale={setSelectedScale}
          type="weight"
        />
        <View style={styles.spacing}>
          <Footer
            backScreen="Gender"
            nextScreen="TargetWeight"
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
  title: {
    color: COLORS.dark,
    ...FONTS.body2Bold,
  },
});

export default Weight;
