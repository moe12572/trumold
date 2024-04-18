import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  StatusBar,
  Alert,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import {
  BUTTON,
  BUTTONTEXT,
  SIZES,
  FONTS,
  COLORS,
  images,
  icons,
  INPUT,
} from "../../../constants";
import { Header, Input, Loader, Select } from "../../../components";
import States from "../../../utils/States";

import * as Picker from "expo-image-picker";
import {
  getUserSelectedRole,
  loginInfo,
  setCurrentUserInfo,
} from "../../../utils/services/StorageService";
import { API, graphqlOperation, Auth, Storage } from "aws-amplify";
import { UserStatus } from "../../../models";
import { createUser, updateUser } from "./../../../graphql/mutations";
import { getUser } from "../../../graphql/queries";
import ScreenName from "../../../utils/ScreenName";
import { removeImageFromS3, uploadImage } from "../../../utils";
import { informationSchema } from "../../../utils/FormValidation";
import Location from "../../../components/location";
const Information = ({ navigation }) => {
  const [role, setRole] = useState("");
  const [user, setUser] = useState({});
  const [userId, setUserId] = useState("");
  const [isLoader, setIsLoader] = useState(false);
  const [address, setAddress] = useState("");

  const initialValue = {
    name: "",
    age: "",
    bio: "",
    phone: "",
    address: "",
  };
  const [userData, setUserData] = useState(initialValue);
  const [imageUrl, setImageUrl] = useState(null);
  const dummyImage = images.userDummyImage;
  const [image, setImage] = useState(null);
  useEffect(() => {
    getRole();
  }, []);
  const getRole = async () => {
    setIsLoader(true);
    let userrole = await getUserSelectedRole();
    let userData = await loginInfo();
    setRole(userrole);
    setUser(userData);
    if (userData.id) {
      getUserData(userData.id);
    }
  };
  const getUserData = async (user_id) => {
    // setIsLoader(true);
    try {
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
        setUserId(item.id);
        if (item.image && item.image !== null) {
          const imageKey = await Storage.get(item.image, { level: "public" });
          setImage(imageKey);
        }
        setUserData((userData) => ({
          ...userData,
          ["name"]: item.name?item.name:'',
          ["age"]: item.age?item.age:'',
          ["bio"]: item.bio?item.bio:'',
          // ["country"]: item.country?item.country:'',
          ["phone"]: item.phone?item.phone:'',
          ["address"]: item.address?item.address:'',
          // ["state"]: item.state?item.state:'',
          ["image"]: item?.image,
        }));
        setAddress(item?.address?item?.address:'')
      }
      setIsLoader(false);
    } catch (error) {
      setIsLoader(false);
      if (error.message) {
        Alert.alert(error.message);
      }
    }
  };
  const onPressInformation = async (form) => {
    form["role"] = role;
    form["status"] = UserStatus.INACTIVE;
    form["username"] = user?.attributes?.name
      ? user?.attributes?.name
      : user?.username;
    form["email"] = user?.attributes?.email
      ? user?.attributes?.email
      : user?.username;
    form["user_id"] = user?.id;
    form["age"] = parseInt(form.age);
    setIsLoader(true);
    try {
      const _userInfo = await Auth.currentAuthenticatedUser({
        bypassCache: true,
      });
      form["id"] = _userInfo.attributes.sub;
      if (imageUrl !== null) {
        let folder = await uploadImage(imageUrl);
        if (form.image) {
          await removeImageFromS3(form.image);
        }
        form["image"] = folder;
      }
      if (userId) {
        let response = await API.graphql(
          graphqlOperation(updateUser, { input: form })
        );
        navigation.navigate(ScreenName.GENDER, {
          userInformation: response.data.updateUser,
        });
        setCurrentUserInfo(response.data.updateUser);
        setIsLoader(false);
      } else {
        let response = await API.graphql(
          graphqlOperation(createUser, { input: form })
        );
        navigation.navigate(ScreenName.GENDER, {
          userInformation: response.data.createUser,
        });
        setCurrentUserInfo(response.data.createUser);
        setIsLoader(false);
      }
    } catch (error) {
      setIsLoader(false);
      if (error.message) {
        Alert.alert(error.message);
      }
    }
  };
  const pickImage = async () => {
    let result = await Picker.launchImageLibraryAsync({
      mediaTypes: Picker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setImageUrl(result.assets[0].uri);
    }
  };
  const handleAddress = (name, value) => {
    userData.address = value;
    setUserData(userData);
  };
  const imageUploaded = () => {
    return (
      <View style={styles.imageContainer}>
        {image && <Image source={{ uri: image }} style={styles.image} />}
        {!image && <Image source={dummyImage} style={styles.image} />}
        <TouchableOpacity
          activeOpacity={1}
          onPress={pickImage}
          style={styles.editBtn}
        >
          <Image
            source={icons.editIcon}
            style={{ height: 30, width: 30, resizeMode: "contain" }}
          />
        </TouchableOpacity>
      </View>
    );
  };
  const renderContent = () => {
    return (
      <ScrollView style={styles.container} keyboardDismissMode="interactive" keyboardShouldPersistTaps='always'>
        {isLoader ? <Loader /> : null}
        <View style={styles.spacing}>
          <Header
            heading="Primary information"
            subHeading="Please fill your primary information."
          />
          <Formik
            initialValues={userData}
            onSubmit={onPressInformation}
            enableReinitialize
            validationSchema={informationSchema}
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
                {imageUploaded()}
                <Text style={styles.title}>Personal Info</Text>
                <Input
                  placeholder="Enter your name"
                  onChangeText={handleChange("name")}
                  onBlur={handleBlur("name")}
                  value={values.name}
                />
                {errors.name && touched.name ? (
                  <Text style={{ ...INPUT.error }}>{errors.name}</Text>
                ) : null}
                <Input
                  placeholder="Enter your age"
                  keyboardType="number-pad"
                  onChangeText={handleChange("age")}
                  onBlur={handleBlur("age")}
                  value={values.age ? values.age.toString() : ""}
                  maxLength={2}
                />
                {errors.age && touched.age ? (
                  <Text style={{ ...INPUT.error }}>{errors.age}</Text>
                ) : null}
                <Input
                  placeholder="Enter your brief bio"
                  onChangeText={handleChange("bio")}
                  onBlur={handleBlur("bio")}
                  value={values.bio}
                  multiline={true}
                />
                {errors.bio && touched.bio ? (
                  <Text style={{ ...INPUT.error }}>{errors.bio}</Text>
                ) : null}
                {/* Contact Info */}
                <Text style={styles.title}>Contact Info</Text>
                <Input
                  placeholder="Enter your contact number"
                  keyboardType="phone-pad"
                  onChangeText={handleChange("phone")}
                  onBlur={handleBlur("phone")}
                  value={values.phone}
                  maxLength={10}
                />
                {errors.phone && touched.phone ? (
                  <Text style={{ ...INPUT.error }}>{errors.phone}</Text>
                ) : null}
                <Location
                  placeholder="Enter your address"
                  onPress={(data, details = null) => {
                    let _address =data.description;
                    let event = {target: {name: 'address', value:_address}}
                    handleAddress("address", data.description);
                    values.address = data.description;
                    setAddress(data.description);
                    handleChange(event)
                  }}
 
                  textInputProps={{
                    onChangeText: (value) => {
                      setAddress(value)
                      let event = {target: {name: 'address', value:value}}
                      handleChange(event)
                    },
                    value: address
                  }}
                />
                {errors.address && touched.address ? (
                  <Text style={{ ...INPUT.error }}>{errors.address}</Text>
                ) : null}
                {/* <Input
                  placeholder="Enter your country"
                  onChangeText={handleChange("country")}
                  onBlur={handleBlur("country")}
                  value={values.country}
                />
                {errors.country && touched.country ? (
                  <Text style={{ ...INPUT.error }}>{errors.country}</Text>
                ) : null} */}

                {/* <Select
                  placeholder="Select your state"
                  data={States}
                  onValueChange={(value) => {
                    setSelectedState(value)
                    let event = {target: {name: 'state', value: value}}
                    handleChange(event)
                  }}
                  value={selectedState ? selectedState : values.state}
                />
                  {errors.state && touched.state ? (
                  <Text style={{ ...INPUT.error }}>{errors.state}</Text>
                ) : null} */}
                <TouchableOpacity
                  style={{ ...BUTTON.primary }}
                  onPress={handleSubmit}
                >
                  <Text style={{ ...BUTTONTEXT.primary }}>Continue</Text>
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
      <StatusBar backgroundColor={COLORS.dark} />
      {Platform.OS === "ios" ? (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          {renderContent()}
        </KeyboardAvoidingView>
      ) : (
        renderContent()
      )}
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
  title: {
    color: COLORS.dark,
    ...FONTS.body2Medium,
    marginBottom: SIZES.basePadding,
    marginTop: SIZES.base,
  },
  imageContainer: {
    alignItems: "center",
    position: "relative",
    height: 100,
  },
  image: {
    height: 90,
    width: 90,
    borderRadius: 50,
    resizeMode: "cover",
    position: "absolute",
  },
  editBtn: {
    height: 40,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
    marginLeft: 70,
  },
});
export default Information;