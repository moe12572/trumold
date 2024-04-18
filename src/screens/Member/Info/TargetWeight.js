import {
  SafeAreaView,
  View,
  StyleSheet,
  Platform,
  StatusBar,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { SIZES, FONTS, COLORS } from "../../../constants";
import { Footer, Header, Loader, Scale } from "../../../components";
import { API, graphqlOperation } from "aws-amplify";
import { updateUser } from "../../../graphql/mutations";

import { User } from "../../../models";
import ScreenName from "../../../utils/ScreenName";
import { setCurrentUserInfo } from "../../../utils/services/StorageService";

const TargetWeight = ({ navigation, route }) => {
  const { params } = route;
  const [targetWeight, setTargetWeight] = useState(156);
  const [selectedScale, setSelectedScale] = useState("");
  const [isLoader, setIsLoader] = useState(false);

  const saveUserInformation = async () => {
    try {
      if (targetWeight !== 0) {
        if (params && params !== null && params.userInformation) {
          let payload = {
            id: params.userInformation.id,
            traget_weight: `${targetWeight.toString()} ${selectedScale}`,
          };
          setIsLoader(true);
          let response = await API.graphql(
            graphqlOperation(updateUser, { input: payload })
          );
          setIsLoader(false);
          setCurrentUserInfo(response.data.updateUser);
          navigation.navigate(ScreenName.HEIGHT, {
            userInformation: response.data.updateUser,
          });
        }
      } else {
        Alert.alert("Your target weight more than 0 ");
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
            heading="What is your target weight?"
            subHeading="Step 3/6"
            headingInverse={true}
            navigation={navigation}
            
          />
        </View>
        <Scale
          for="weight"
          size={156}
          returnValue={setTargetWeight}
          setSelectedScale={setSelectedScale}
          type="targetWeight"
        />
        <View style={styles.spacing}>
          <Footer
            backScreen="Weight"
            nextScreen="Height"
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

export default TargetWeight;
