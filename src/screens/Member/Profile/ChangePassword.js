import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import React,{useState} from "react";
import { Auth } from "aws-amplify";

import { Formik } from "formik";
import { SIZES, COLORS, BUTTON, BUTTONTEXT, INPUT } from "../../../constants";
import { PageHeader, Input, Loader } from "../../../components";
import { changePasswordSchema } from "../../../utils/FormValidation";
import ScreenName from "../../../utils/ScreenName";

export default function ChangePassword({ navigation }) {
  const [isLoader, setIsLoader] = useState(false);

  const onPressHandle = (form) => {
    
    const {password,newPassword} = form;
    try {
      setIsLoader(true)
      Auth.currentAuthenticatedUser()
        .then((user) => {
          return Auth.changePassword(user, password, newPassword);
        })
        .then((data) =>{
          setIsLoader(false)
          Alert.alert("You password has been changed successfully")
          navigation.navigate(ScreenName.PROFILE)
        })
        .catch((error) => {
          setIsLoader(false)
          if(error.message){
            Alert.alert("Old password is incorrect")
          }
        });
    } catch (error) {
      setIsLoader(false)
      if(error.message){
        Alert.alert(error.message)
      }
    }
    
  };
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="interactive"
        >
          <StatusBar backgroundColor={COLORS.dark} />
          {isLoader?<Loader/>:null}
          <View style={{ padding: SIZES.basePadding }}>
            <PageHeader
              title="Change Password"
              navigation={navigation}
              backLink="Profile"
            />
            <Formik
              initialValues={{
                password: "",
                newPassword: "",
                confirmNewPassword: "",
              }}
              onSubmit={onPressHandle}
              validationSchema={changePasswordSchema}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors,touched, }) => (
                <>
                  <Input
                    placeholder="Enter old Password"
                    secureTextEntry={true}
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    value={values.password}
                  />

                {errors.password && touched.password ? (
                  <Text style={{...INPUT.error}}>{errors.password}</Text>
                ) : null}

                  <Input
                    placeholder="Enter New password"
                    secureTextEntry={true}
                    onChangeText={handleChange("newPassword")}
                    onBlur={handleBlur("newPassword")}
                    value={values.newPassword}
                  />
                   {errors.newPassword && touched.newPassword ? (
                  <Text style={{...INPUT.error}}>{errors.newPassword}</Text>
                ) : null}
                  <Input
                    placeholder="Confirm New Password"
                    secureTextEntry={true}
                    onChangeText={handleChange("confirmNewPassword")}
                    onBlur={handleBlur("confirmNewPassword")}
                    value={values.confirmNewPassword}
                  />
                  {errors.confirmNewPassword && touched.confirmNewPassword ? (
                  <Text style={{...INPUT.error}}>{errors.confirmNewPassword}</Text>
                ) : null}
                  <TouchableOpacity
                    style={{ ...BUTTON.primary }}
                    onPress={handleSubmit}
                  >
                    <Text style={{ ...BUTTONTEXT.primary }}>
                      Update Password
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </Formik>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
