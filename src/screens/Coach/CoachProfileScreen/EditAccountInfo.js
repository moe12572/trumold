import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Image,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import { Formik } from "formik";
import {
  SIZES,
  COLORS,
  BUTTON,
  BUTTONTEXT,
  FONTS,
  icons,
} from "../../../constants";
import { PageHeader, Input, Loader } from "../../../components";
import { setCurrentUserInfo } from "../../../utils/services/StorageService";
import { useEffect } from "react";
import ScreenName from "../../../utils/ScreenName";
import { getUser } from "../../../graphql/queries";
import { API, graphqlOperation, Auth } from "aws-amplify";
import { updateUser } from "./../../../graphql/mutations";
import SelectDropdown from "react-native-select-dropdown";

const currency = [
  {
    label: "US Dollar",
    value: "US Dollar",
  },
];

export default function EditAccountInfo({ navigation }) {
  const initilValue = {
    email: "",
    currency: "",
    phone: "",
    hourly_rate: "",
    // cancellation_charge: "",
  };
  const [userData, setUserData] = useState(initilValue);
  const [isLoader, setIsLoader] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(currency[0]);
  const [openList, setOpenList] = useState(false);

  useEffect(() => {
    getUserData();
  }, []);
  const getUserData = async () => {
    try {
      setIsLoader(true);
      const _userInfo = await Auth.currentAuthenticatedUser({
        bypassCache: true,
      });
      const _item = await API.graphql(
        graphqlOperation(getUser, {
          id: _userInfo.attributes.sub,
        })
      );
      let item = _item.data.getUser;
      if (item !== null && Object.keys(item).length !== 0) {
        // setUserId(item.id);
        setUserData((userData) => ({
          ...userData,
          ["email"]: item?.email,
          ["hourly_rate"]: item?.hourly_rate,
          ["phone"]: item?.phone,
          ["currency"]: item.currency ? item.currency : "",
        }));
        // setSelectedCurrency(item.currency ? item.currency : "");
        if (item && item.currency) {
          setSelectedCurrency({ label: item.currency, value: item.currency });
        }
        setIsLoader(false);
      }
    } catch (error) {
      setIsLoader(false);
      if (error.message) {
        Alert.alert(error.message);
      }
    }
  };

  const onPressInformation = async (userData) => {
    userData["hourly_rate"] = parseInt(userData.hourly_rate);
    setIsLoader(true);
    try {
      const _userInfo = await Auth.currentAuthenticatedUser({
        bypassCache: true,
      });
      userData["id"] = _userInfo.attributes.sub;
      userData["currency"] = selectedCurrency.value;
      let response = await API.graphql(
        graphqlOperation(updateUser, { input: userData })
      );
      navigation.navigate(ScreenName.PROFILESETTING, { stateUpdated: true });
      setCurrentUserInfo(response.data.updateUser);
      setIsLoader(false);
    } catch (error) {
      setIsLoader(false);
      if (error.message) {
        Alert.alert(error.message);
      }
    }
  };
  const renderContent = () => {
    return (
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="interactive"
      >
        {isLoader ? <Loader /> : null}
        <StatusBar backgroundColor={COLORS.dark} />
        <View
          style={{
            padding: SIZES.basePadding,
            paddingBottom: SIZES.basePadding * 3,
          }}
        >
          <PageHeader
            title="Edit Profile"
            navigation={navigation}
            backLink="Profile"
          />
          <Formik
            initialValues={userData}
            enableReinitialize
            onSubmit={(value) => onPressInformation(value)}
          >
            {({ handleChange, handleBlur, handleSubmit, values }) => (
              <>
                <Text style={styles.title}>Account Info</Text>
                <Text style={styles.title}>Email Address</Text>
                <Input
                  placeholder="Email Address"
                  onBlur={handleBlur("email")}
                  value={values.email}
                />
                <Text style={styles.title}>Contact Number</Text>
                <Input
                  placeholder="Contact Number"
                  keyboardType="number-pad"
                  onChangeText={handleChange("phone")}
                  onBlur={handleBlur("phone")}
                  value={values.phone}
                  maxLength={15}
                />

                <Text style={styles.title}>Pricing Info</Text>
                <Text style={styles.title}>Currency</Text>
                <SelectDropdown
                  data={currency}
                  onBlur={() => setOpenList(false)}
                  onSelect={(selectedItem, index) => {
                    setSelectedCurrency(selectedItem);
                  }}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem.label;
                  }}
                  rowTextForSelection={(item, index) => {
                    setOpenList(true);
                    return item.label;
                  }}
                  defaultValue={selectedCurrency}
                  defaultButtonText="Select currency"
                  buttonTextStyle={{
                    ...FONTS.body1Bold,
                    fontFamily: "Medium",
                    textAlign: "left",
                  }}
                  buttonStyle={styles.dropdown2BtnStyle}
                  rowTextStyle={{ ...FONTS.body2, color: COLORS.black60 }}
                  selectedRowStyle={{ backgroundColor: COLORS.black20 }}
                  renderDropdownIcon={() => {
                    return (
                      <Image
                        source={
                          openList ? icons.arrowUpIcon : icons.arrowDownIcon
                        }
                        style={{ height: 12, width: 15 }}
                      />
                    );
                  }}
                  dropdownIconPosition={"right"}
                />
                <Text style={styles.title}>Hourly Rate</Text>
                <Input
                  placeholder="Hourly Rate"
                  keyboardType="number-pad"
                  onChangeText={handleChange("hourly_rate")}
                  onBlur={handleBlur("hourly_rate")}
                  value={
                    values.hourly_rate ? values.hourly_rate.toString() : ""
                  }
                />

                <TouchableOpacity
                  style={{ ...BUTTON.primary }}
                  onPress={handleSubmit}
                >
                  <Text style={{ ...BUTTONTEXT.primary }}>Save</Text>
                </TouchableOpacity>
              </>
            )}
          </Formik>
        </View>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {Platform.OS === "ios" ? (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          {renderContent()}
        </KeyboardAvoidingView>
      ) : (
        <>{renderContent()}</>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    color: COLORS.dark,
    ...FONTS.body2Medium,
    marginBottom: SIZES.basePadding,
    marginTop: SIZES.base,
  },
  dropdown2BtnStyle: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.grey,
    width: Dimensions.get("window").width - 35,
    height: 54,
    left: 2,
    marginBottom: SIZES.basePadding,
  },
});
