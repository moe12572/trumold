import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import React from "react";
import { Formik } from "formik";
import { BUTTON, BUTTONTEXT, SIZES } from "../../constants";
import { Header, Input } from "../../components";

const ResetPassword = ({ navigation }) => {
  const renderContent = () => {
    return (
      <View style={{ flex: 1, height: SIZES.height }}>
        <View style={styles.spacing}>
          <Header
            heading="Reset Password"
            subHeading="Your new password must be different from
            previous used password."
            backButton={true}
            navigation={navigation}
          />
          <Formik
            initialValues={{ password: "", confirmPassword: "" }}
            onSubmit={(values) => console.log(values)}
          >
            {({ handleChange, handleBlur, handleSubmit, values }) => (
              <>
                <Input
                  placeholder="Enter password"
                  secureTextEntry={true}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  value={values.password}
                />
                <Input
                  placeholder="Confirm password"
                  secureTextEntry={true}
                  onChangeText={handleChange("confirmPassword")}
                  onBlur={handleBlur("confirmPassword")}
                  value={values.confirmPassword}
                />

                <TouchableOpacity
                  style={{ ...BUTTON.primary }}
                  //onPress={() => navigation.navigate("Registration")}
                  onPress={handleSubmit}
                >
                  <Text style={{ ...BUTTONTEXT.primary }}>Reset Password</Text>
                </TouchableOpacity>
              </>
            )}
          </Formik>
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.container} keyboardDismissMode="interactive">
      {renderContent()}
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
  },
});

export default ResetPassword;
