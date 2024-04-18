import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { Auth } from "@aws-amplify/auth";

import React, { useState } from "react";
import { Formik } from "formik";
import {
  BUTTON,
  BUTTONTEXT,
  SIZES,
  INPUT,
  icons,
  FONTS,
} from "../../constants";
import { Header, Input, Loader } from "../../components";
import * as Yup from "yup";
import ScreenName from "../../utils/ScreenName";

const loginSchema = Yup.object().shape({
  authCode: Yup.string().required("The confirmation code field is required"),
});

const Confirmation = ({ navigation, route }) => {
  const { email } = route.params;
  const [isLoader, setIsLoader] = useState(false);

  const confirmSignUp = async (form) => {
    setIsLoader(true);
    await Auth.confirmSignUp(email, form.authCode)
      .then(() => {
        setIsLoader(false);
        verifiedEmail();
      })
      .catch((err) => {
        setIsLoader(false);
        if (!err.message) {
          Alert.alert("Something went wrong, please contact support!");
        } else {
          Alert.alert(err.message);
        }
      });
  };

  const verifiedEmail = () => {
    Alert.alert("Verified", `Your account has been created successfully`, [
      {
        text: "Ok",
        onPress: async () => {
          navigation.navigate(ScreenName.LOGIN);
        },
      },
    ]);
  };

  const renderContent = () => {
    return (
      <View style={{ flex: 1, height: SIZES.height }}>
        <View style={styles.spacing}>
          {isLoader === true ? <Loader /> : null}
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image
                source={icons.backIcon}
                style={{
                  height: 30,
                  width: 30,
                  marginRight: "23%",
                  marginLeft: -10,
                }}
              />
            </TouchableOpacity>
            <Text style={{ ...FONTS.h2, textAlign: "center" }}>
              Email Verification
            </Text>
          </View>
          <Header
            heading="Confirmation"
            subHeading="Please enter the confirmation code sent to your email."
          />
          <Formik
            initialValues={{ email: "", password: "" }}
            onSubmit={confirmSignUp}
            validationSchema={loginSchema}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <>
                <Input
                  placeholder="Enter confirmation code"
                  onChangeText={handleChange("authCode")}
                  onBlur={handleBlur("authCode")}
                  value={values.authCode}
                  name="authCode"
                />
                {errors.authCode ? (
                  <Text style={{ ...INPUT.error }}>{errors.authCode}</Text>
                ) : null}

                <TouchableOpacity
                  style={{ ...BUTTON.primary }}
                  onPress={handleSubmit}
                >
                  <Text style={{ ...BUTTONTEXT.primary }}>
                    Confirm & Sign In
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </Formik>
        </View>
      </View>
    );
  };

  return (
    <>
      {Platform.OS == "android" ? (
        <ScrollView style={styles.container} keyboardDismissMode="interactive">
          {renderContent()}
        </ScrollView>
      ) : (
        <SafeAreaView
          style={styles.container}
          keyboardDismissMode="interactive"
        >
          {renderContent()}
        </SafeAreaView>
      )}
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  spacing: {
    paddingTop: Platform.OS == "android" ? SIZES.basePadding : 0,
    paddingHorizontal: SIZES.basePadding,
  },
  footer: {
    // position: "absolute",
    // bottom: SIZES.basePadding * 2,
    // left: 0,
    width: SIZES.width,
    paddingHorizontal: SIZES.basePadding,
    alignItems: "center",
  },
});

export default Confirmation;
