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
import { Auth } from "aws-amplify";
import React, { useState } from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import {
  BUTTON,
  BUTTONTEXT,
  COLORS,
  FONTS,
  icons,
  INPUT,
  SIZES,
} from "../../constants";
import { Header, Input, Loader } from "../../components";
import ScreenName from "../../utils/ScreenName";

const formSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email")
    .required("The email field is required"),
});

const changePasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, "The password must have at least 8 character")
    .required("The password field is required"),
  code: Yup.string().required("The code field is required"),
});

const ForgotPassword = ({ navigation }) => {
  const [confirmationStep, setConfirmationStep] = useState(false);
  const [isLoader, setIsLoader] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");

  const changeNewPassword = async (form) => {
    console.log("-------")
    const { code, password } = form;
    setIsLoader(true);
    Auth.forgotPasswordSubmit(emailAddress, code, password)
      .then((response) => {
        setIsLoader(false);
        verifiedEmail();
      })
      .catch((err) => {
        setIsLoader(false);
        if (err.message) {
          Alert.alert(err.message);
        }
      });
  };

  const getConfirmationCode = async (form) => {
    const { email } = form;
    setIsLoader(true);
    Auth.forgotPassword(email)
      .then(() => {
        success(email);
        setEmailAddress(email);
        setIsLoader(false);
      })
      .catch((err) => {
        setIsLoader(false);
        if (err.message) {
          Alert.alert("The Email address is not valid");
        }
      });
  };

  const success = (email) => {
    Alert.alert("Confirmation", `Please check your email address ${email}`, [
      {
        text: "Ok",
        onPress: async () => {
          setConfirmationStep(true);
        },
      },
    ]);
  };

  const verifiedEmail = () => {
    Alert.alert("Success", "Your password has been reset successfully", [
      {
        text: "Ok",
        onPress: async () => {
          navigation.navigate(ScreenName.LOGIN);
        },
      },
    ]);
  };

  const renderContentChangePassword = () => {
    return (
      <View style={{ flex: 1, height: SIZES.height }}>
        {isLoader ? <Loader /> : null}

        <View style={styles.spacing}>
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
              Forget Password
            </Text>
          </View>
          <Header
            heading="Enter New Password"
            subHeading="Please enter the code that we send on your email and set your new password."
          />
          <Formik
            initialValues={{ password: "", code: "" }}
            onSubmit={changeNewPassword}
            validationSchema={changePasswordSchema}
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
                  placeholder="Enter code"
                  onChangeText={handleChange("code")}
                  onBlur={handleBlur("code")}
                  value={values.code}
                  name="code"
                />
                {errors.code || touched.code ? (
                  <Text style={{ ...INPUT.error }}>{errors.code}</Text>
                ) : null}

                <Input
                  placeholder="Enter your new password"
                  secureTextEntry={true}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  value={values.password}
                />
                {errors.password || touched.password ? (
                  <Text style={{ ...INPUT.error }}>{errors.password}</Text>
                ) : null}
                <View style={styles.buttonView}>
                  <TouchableOpacity
                    style={{ ...BUTTON.primary, width: "110%" }}
                    onPress={handleSubmit}
                  >
                    <Text style={{ ...BUTTONTEXT.primary }}>
                      Submit new password
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Formik>
        </View>
      </View>
    );
  };

  const renderContent = () => {
    return (
      <View style={{ flex: 1, height: SIZES.height }}>
        {isLoader ? <Loader /> : null}
        <View style={styles.spacing}>
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
              Forget Password
            </Text>
          </View>
          <Header
            heading="Reset Password"
            subHeading="Enter the email associated with your account and we'll send an email to reset your password."
          />
          <Formik
            initialValues={{ email: "" }}
            onSubmit={getConfirmationCode}
            validationSchema={formSchema}
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
                  placeholder="Enter your registered email"
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  value={values.email}
                  autoCapitalize="none"
                />
                {errors.email && touched.email ? (
                  <Text style={{ ...INPUT.error }}>{errors.email}</Text>
                ) : null}
                <View style={styles.buttonView}>
                  <TouchableOpacity
                    style={{ ...BUTTON.primary, width: "110%" }}
                    onPress={handleSubmit}
                  >
                    <Text style={{ ...BUTTONTEXT.primary }}>Send Email</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Formik>
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.container} keyboardDismissMode="interactive">
      {confirmationStep ? renderContentChangePassword() : renderContent()}
    </SafeAreaView>
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
    flex: 1,
  },
  buttonView: {
    position: "absolute",
    bottom: 10,
    width: "100%",
    backgroundColor: COLORS.white,
    paddingHorizontal: SIZES.basePadding,
  },
});

export default ForgotPassword;
