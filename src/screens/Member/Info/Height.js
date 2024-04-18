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
import { updateUser } from "../../../graphql/mutations";
import { API, graphqlOperation } from "aws-amplify";
import ScreenName from "../../../utils/ScreenName";
import { setCurrentUserInfo } from "../../../utils/services/StorageService";
const Height = ({ navigation, route }) => {
  const [userHeight, setUserHeight] = useState(5);
  const [selectedScale, setSelectedScale] = useState("");
  const { params } = route;
  const [isLoader, setIsLoader] = useState(false);

  const saveUserInformation = async () => {
    try {
      if (userHeight !== 0) {
        if (params && params !== null) {
          let payload = {
            id: params.userInformation.id,
            height: `${userHeight.toString()} ${selectedScale}`,
          };
          setIsLoader(true);
          let response = await API.graphql(
            graphqlOperation(updateUser, { input: payload })
          );
          setIsLoader(false);
          setCurrentUserInfo(response.data.updateUser)
          navigation.navigate(ScreenName.ACTIVITYLEVEL, {
            userInformation: response.data.updateUser,
          });
        }
      } else {
        Alert.alert("Your height more than 0 ");
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
        {isLoader ? <Loader /> : null}
        <View style={styles.spacing}>
          <Header
            heading="What is your height?"
            subHeading="Step 4/6"
            headingInverse={true}
            navigation={navigation}
          />
        </View>
        <Scale
          for="height"
          size={5}
          returnValue={setUserHeight}
          setSelectedScale={setSelectedScale}
          type="height"
        />
        <View style={styles.spacing}>
          <Footer
            backScreen="Gender"
            nextScreen="ActivityLevel"
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

export default Height;
