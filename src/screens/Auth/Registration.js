import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Platform,
  ScrollView,
  Alert,
  StatusBar,
} from "react-native";
import React, { useState } from "react";
import { Auth } from "@aws-amplify/auth";

import { Formik } from "formik";
import {
  BUTTON,
  BUTTONTEXT,
  SIZES,
  FONTS,
  COLORS,
  INPUT,
} from "../../constants";
import {
  Header,
  Input,
  SocialAccounts,
  Loader,
  PageHeader,
} from "../../components";
import ScreenName from "../../utils/ScreenName";
import { signupSchema } from "../../utils/FormValidation";
import { getUserSelectedRole } from "../../utils/services/StorageService";
import { UserRole, UserStatus } from "../../models";
import { API, graphqlOperation } from "aws-amplify";
import { createUser } from "../../graphql/mutations";
import { listUsers } from "../../graphql/queries";
import { useEffect } from "react";

function validateUsername(value) {
  let error;
  if (value === "admin") {
    error = "Nice try!";
  }
  return error;
}

const Registration = ({ navigation }) => {
  const [isLoader, setIsLoader] = useState(false);
  const [users, setUsers] = useState([]);
  useEffect(() => {
    getUsersList();
  }, []);
  const getUsersList = async () => {
    try {
      let response = await API.graphql(graphqlOperation(listUsers));
      if (response.data.listUsers && response.data.listUsers.items) {
        setUsers(response.data.listUsers.items);
      }
    } catch (error) {
      if (error.message) {
        Alert.alert(error.message);
      }
    }
  };
  const onSignupPress = async (form) => {
    const { email, name, password } = form;
    let isExistEmail = users && users.findIndex((e) => e.email === email);
    if (isExistEmail !== -1) {
      Alert.alert("This email address already exist");
      return;
    }
    setIsLoader(true);
    let role = await getUserSelectedRole();
    Auth.signUp({
      username: email,
      password,
      attributes: {
        email, // optional
        name,
        profile: role,
      },
      validationData: [], // optional
    })
      .then((response) => {
        setIsLoader(false);
        navigation.navigate(ScreenName.CONFIRMATION, { email });
        registerUser(response.userSub, name, email, role);
        success(email);
      })
      .catch((err) => {
        setIsLoader(false);
        if (err.message) {
          Alert.alert(err.message);
        }
      });
  };

  const registerUser = async (UserId, userName, email, role) => {
    let payload = {
      id: UserId,
      role: role,
      user_id: UserId,
      status: UserStatus.INACTIVE,
      username: userName,
      email: email,
      isVerified: UserRole.COACH ? false : true,
      isPaymentVerified:false
    };
    try {
      let response = await API.graphql(
        graphqlOperation(createUser, { input: payload })
      );
    } catch (error) {
      if (error.message) {
        Alert.alert(error.message);
      }
    }
  };

  const success = (email) => {
    Alert.alert("Confirmation", `Please check your email address ${email}`, [
      {
        text: "Ok",
        onPress: async () => {
          navigation.navigate(ScreenName.CONFIRMATION, { email });
        },
      },
    ]);
  };

  const renderContent = () => {
    return (
      <View style={{ flex: 1 }}>
        {isLoader === true ? <Loader /> : null}
        <View style={styles.spacing}>
          <PageHeader title="SignUp" navigation={navigation} backLink={true} />
          <Formik
            initialValues={{ email: "", name: "", password: "" }}
            onSubmit={onSignupPress}
            validationSchema={signupSchema}
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
                  placeholder="Enter username"
                  onChangeText={handleChange("name")}
                  onBlur={handleBlur("name")}
                  value={values.name}
                  name="name"
                />
                {errors.name && touched.name ? (
                  <Text style={{ ...INPUT.error }}>{errors.name}</Text>
                ) : null}
                <Input
                  placeholder="Enter your email"
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  value={values.email}
                  autoCapitalize="none"
                />
                {errors.email && touched.email ? (
                  <Text style={{ ...INPUT.error }}>{errors.email}</Text>
                ) : null}

                <Input
                  placeholder="Enter your password"
                  secureTextEntry={true}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  value={values.password}
                  autoCapitalize="none"
                />
                {errors.password && touched.password ? (
                  <Text style={{ ...INPUT.error }}>{errors.password}</Text>
                ) : null}
                <TouchableOpacity
                  style={{ ...BUTTON.primary }}
                  onPress={handleSubmit}
                >
                  <Text style={{ ...BUTTONTEXT.primary }}>Sign Up</Text>
                </TouchableOpacity>
              </>
            )}
          </Formik>
          <View style={{ alignItems: "center", marginTop: SIZES.basePadding }}>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                justifyContent: "center",
                paddingHorizontal: SIZES.base,
              }}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={{ ...FONTS.body1 }}>Already have an account?</Text>
              <Text style={{ ...FONTS.body1Bold, paddingLeft: 2 }}>
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/*Hide social login for now until we have a proper social login setup TRU-22*/}
        {/*<View>*/}
        {/*  <SocialAccounts title="Or sign up with email" />*/}

        {/*  <View style={styles.footer}>*/}
        {/*    <View*/}
        {/*      style={{*/}
        {/*        flexDirection: "row",*/}
        {/*        justifyContent: "center",*/}
        {/*        alignItems: "center",*/}
        {/*        flexWrap: "wrap",*/}
        {/*      }}*/}
        {/*    >*/}
        {/*      <Text style={{ ...FONTS.body1 }}>*/}
        {/*        By continuing forward, you agree to Trumold's*/}
        {/*      </Text>*/}
        {/*      <Text*/}
        {/*        onPress={() => Linking.openURL("http://google.com")}*/}
        {/*        style={{ ...FONTS.body1Bold, paddingLeft: 2 }}*/}
        {/*      >*/}
        {/*        Privacy Policy*/}
        {/*      </Text>*/}
        {/*      <Text style={{ ...FONTS.body1, paddingLeft: 2 }}>and</Text>*/}
        {/*      <Text*/}
        {/*        onPress={() => Linking.openURL("http://google.com")}*/}
        {/*        style={{ ...FONTS.body1Bold, paddingLeft: 2 }}*/}
        {/*      >*/}
        {/*        Terms & Conditions*/}
        {/*      </Text>*/}
        {/*    </View>*/}
        {/*  </View>*/}
        {/*</View>*/}
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container} keyboardDismissMode="interactive">
        {renderContent()}
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
    paddingTop: Platform.OS == "android" ? SIZES.base * 1.5 : 0,
    paddingHorizontal: SIZES.basePadding,
  },
  footer: {
    width: SIZES.width,
    paddingHorizontal: SIZES.basePadding,
    paddingBottom: Platform.OS == "android" ? SIZES.basePadding : 0,
    alignItems: "center",
  },
});

export default Registration;
