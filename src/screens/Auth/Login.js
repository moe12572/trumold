import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { Formik } from "formik";
import {
  BUTTON,
  BUTTONTEXT,
  SIZES,
  FONTS,
  COLORS,
  INPUT,
} from "../../constants";
import { Header, Input, SocialAccounts, Loader } from "../../components";
import ScreenName from "../../utils/ScreenName";
import { loginSchema } from "../../utils/FormValidation";
import { UserRole, UserStatus } from "../../models";
import { API, graphqlOperation, Auth, Hub, Amplify } from "aws-amplify";
import { getUser } from "../../graphql/queries";
import {
  getUserSelectedRole,
  setCurrentUserInfo,
  setUserSelectedRole,
} from "../../utils/services/StorageService";
import { useEffect } from "react";
import awsConfig from "../../aws-exports";
import { createUser } from "../../graphql/mutations";
import AsyncStorage from "@react-native-async-storage/async-storage";

Amplify.configure(awsConfig);

const Login = ({ navigation }) => {
  const [isLoader, setIsLoader] = useState(false);
  const [user, setUser] = useState(null);

  const onLoginPress = (form) => {
    setIsLoader(true);
    const { email, password } = form;
    Auth.signIn(email, password)
      .then((response) => {
        getUserStatus(response);
      })
      .catch((err) => {
        setIsLoader(false);
        if (!err.message) {
          Alert.alert("Error when signing in: ", err);
        } else {
          if (err.code === "UserNotConfirmedException") {
            success(email, err.message);
          } else if (err.code === "NotAuthorizedException") {
            Alert.alert("Incorrect password");
          } else if (err.message && err.code !== "UserNotConfirmedException") {
            Alert.alert(err.message);
          }
        }
      });
  };

  const getUserStatus = async (_userInfo) => {
    try {
      let existUser = await API.graphql(
        graphqlOperation(getUser, { id: _userInfo.attributes.sub })
      );
      setIsLoader(false);
      await setUserSelectedRole(_userInfo.attributes.profile);
      let role = _userInfo.attributes.profile; // await getUserSelectedRole();
      let data = existUser.data.getUser;
      let screen =
        role == UserRole.MEMBER ? ScreenName.INFORMATION : ScreenName.COACHINFO;
      let item = null;
      if (data !== null && Object.keys(data).length !== 0) {
        item = data;
       
        await setCurrentUserInfo(item);
        if (
          data.status == UserStatus.ACTIVE &&
          data.role == UserRole.COACH &&
          data.isVerified == false
        ) {
          screen = ScreenName.COACHVERIFICATION;
        } else {
          if (data.status == UserStatus.ACTIVE) {
            if (item.role == UserRole.MEMBER) {
              screen = ScreenName.MEMBERHOME;
            } else {
              screen = ScreenName.COACHHOME;
            }
          } else {
            screen = ScreenName.INFORMATION;
            if (item.role == UserRole.COACH) {
              screen = ScreenName.COACHINFO;
            }
          }
        }
      }
      navigation.reset({
        index: 0,
        routes: [{ name: screen, userInformation: item }],
      });
    } catch (error) {
      setIsLoader(false);
      if (error.message) {
        Alert.alert(error.message);
      }
    }
  };

  const getSocialLoginStatus = async (UserId, userName, email) => {
    setIsLoader(true);
    try {
      let existUser = await API.graphql(
        graphqlOperation(getUser, { id: UserId })
      );
      if (existUser && existUser.data && existUser.data.getUser !== null) {
        setIsLoader(false);
        let role = existUser.data.getUser.role; // await getUserSelectedRole();
        let data = existUser.data.getUser;
        let screen =
          role == UserRole.MEMBER
            ? ScreenName.INFORMATION
            : ScreenName.COACHINFO;
        let item = null;
        if (data !== null && Object.keys(data).length !== 0) {
          item = data;
          await setUserSelectedRole(item.role);
          await setCurrentUserInfo(item);
          if (
            data.status == UserStatus.ACTIVE &&
            data.role == UserRole.COACH &&
            data.isVerified == false
          ) {
            screen = ScreenName.COACHVERIFICATION;
          } else {
            if (data.status == UserStatus.ACTIVE) {
              if (item.role == UserRole.MEMBER) {
                screen = ScreenName.MEMBERHOME;
              } else {
                screen = ScreenName.COACHHOME;
              }
            } else {
              screen = ScreenName.INFORMATION;
              if (item.role == UserRole.COACH) {
                screen = ScreenName.COACHINFO;
              }
            }
          }
        }
        navigation.reset({
          index: 0,
          routes: [{ name: screen, userInformation: item }],
        });
      } else {
        registerUser(UserId, userName, email);
      }
    } catch (error) {
      setIsLoader(false);
      if (error.message) {
        Alert.alert(error.message);
      }
    }
  };

  const registerUser = async (UserId, userName, email) => {
    let _role = await getUserSelectedRole();
    let screen =
      _role === UserRole.COACH ? ScreenName.COACHINFO : ScreenName.INFORMATION;
    let payload = {
      id: UserId,
      role: _role,
      user_id: UserId,
      status: UserStatus.INACTIVE,
      username: userName,
      email: email,
      isVerified: UserRole.COACH ? false : true,
    };
    try {
      let response = await API.graphql(
        graphqlOperation(createUser, { input: payload })
      );
      setCurrentUserInfo(response.data.createUser);
      navigation.reset({
        index: 0,
        routes: [{ name: screen, userInformation: response.data.createUser }],
      });
    } catch (error) {
      if (error.message) {
        Alert.alert(error.message);
      }
    }
  };
  const success = (email, message) => {
    Alert.alert(
      "Confirmation",
      `${message} Please check your email address ${email}`,
      [
        {
          text: "Ok",
          onPress: async () => {
            navigation.navigate(ScreenName.CONFIRMATION, { email });
          },
        },
      ]
    );
  };

  useEffect(() => {
    const unsubscribe = Hub.listen("auth", ({ payload: { event, data } }) => {
      // setIsLoader(true)
      switch (event) {
        case "signIn":
          setUser(data);
          getSocialLoginStatus(
            data?.signInUserSession?.accessToken?.payload?.sub,
            data?.signInUserSession?.accessToken?.payload?.username,
            data?.signInUserSession?.idToken?.payload?.email
          );
          setIsLoader(false);
          break;
        case "signOut":
          setUser(null);
          break;
      }
    });
    return unsubscribe;
  }, []);

  const renderContent = () => {
    return (
      <View style={{ flex: 1, height: SIZES.height, marginBottom: 50 }}>
        {isLoader === true ? <Loader /> : null}
        <View style={styles.spacing}>
          <Header
            heading="Sign In"
            subHeading="Let's sign in with your Trumold account"
            backButton={true}
            navigation={navigation}
          />
          <Formik
            initialValues={{ email: "", password: "" }}
            onSubmit={onLoginPress}
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
                  // onPress={() => navigation.navigate("Information")}
                  onPress={handleSubmit}
                >
                  <Text style={{ ...BUTTONTEXT.primary }}>Sign In</Text>
                </TouchableOpacity>
              </>
            )}
          </Formik>
          <View style={{ alignItems: "center" }}>
            <TouchableOpacity
              style={{
                padding: SIZES.base,
                alignItems: "center",
                marginTop: SIZES.base,
              }}
              onPress={() => navigation.navigate("ForgotPassword")}
            >
              <Text
                style={{
                  ...FONTS.body1Bold,
                  color: COLORS.dark,
                  textAlign: "center",
                }}
              >
                Forgot password?
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/*Hide until we have social login setup (TRU-22)*/}
        <View>
         {/* <SocialAccounts title="Or sign in with email" /> */}
         <View style={styles.footer}>
           <TouchableOpacity
             onPress={() => navigation.navigate("Registration")}
             style={{
               flexDirection: "row",
               justifyContent: "center",
               paddingHorizontal: SIZES.base,
             }}
           >
             <Text style={{ ...FONTS.body1 }}>Don't have an account?</Text>
             <Text style={{ ...FONTS.body1Bold, paddingLeft: 2 }}>
               Sign Up
             </Text>
           </TouchableOpacity>
         </View>
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
        <SafeAreaView style={styles.container}>
          <ScrollView
            style={styles.container}
            keyboardDismissMode="interactive"
          >
            {renderContent()}
          </ScrollView>
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

export default Login;
