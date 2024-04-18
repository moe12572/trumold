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
  Dimensions,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import * as Picker from "expo-image-picker";
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
import { Header, Input, Loader } from "../../../components";
import { UserStatus } from "../../../models";
import {
  getUserSelectedRole,
  loginInfo,
  setCurrentUserInfo,
} from "../../../utils/services/StorageService";
import { API, graphqlOperation, Auth, Storage } from "aws-amplify";
import { createUser, updateUser } from "../../../graphql/mutations";
import ScreenName from "../../../utils/ScreenName";
import { getUser, listCategories } from "../../../graphql/queries";
import { coachFormSchema } from "../../../utils/FormValidation";
import {
  getDataWithImage,
  removeImageFromS3,
  uploadImage,
} from "../../../utils";
import Location from "../../../components/location";
import SelectDropdown from "react-native-select-dropdown";
const selectGender = [
  {
    label: "Male",
    value: "Male",
  },
  {
    label: "Female",
    value: "Female",
  },
];
const Info = ({ navigation }) => {
  const initilValue = {
    name: "",
    age: "",
    gender: "",
    bio: "",
    phone: "",
    address: "",
    category: "",
    working_radius: "",
    hourly_rate: "",
    cancellation_charge: "",
  };

  const [user, setUser] = useState({});
  const [userId, setUserId] = useState("");
  const [isLoader, setIsLoader] = useState(false);
  const [userData, setUserData] = useState(initilValue);
  const [imageUrl, setImageUrl] = useState(null);
  const dummyImage = images.userDummyImage;
  const [image, setImage] = useState(null);
  const [gender, setGender] = useState(selectGender[0]);
  const [categories, setCategories] = useState([]);
  const [role, setRole] = useState("");
  const [address, setAddress] = useState("");
  const [openList, setOpenList] = useState(false);

  useEffect(() => {
    const screenChange = navigation.addListener("focus", async () => {
      getData();
    });
    return screenChange;
  }, []);

  const getData = async () => {
    setIsLoader(true);
    let userRole = await getUserSelectedRole();
    let userData = await loginInfo();
    setRole(userRole);
    setUser(userData);
    if (userData.id) {
      getUserData(userData.id);
    }
  };

  const getUserData = async () => {
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
          ["experience"]: item.experience?item.experience:'',
          // ["country"]: item.country?item.country:'',
          ["phone"]: item.phone?item.phone:'',
          ["address"]: item.address?item.address:'',
          // ["state"]: item.state?item.state:'',
          ["image"]: item?.image,
          // ["city"]: item?.city?item?.city:'',
          ["gender"]: item.gender ? item.gender : "",
          ["hourly_rate"]: item.hourly_rate ? item.hourly_rate : "",
          ["category"]: item.category ? item.category : "",
          ["working_radius"]: item.working_radius ? item.working_radius : "",
          ["cancellation_charge"]: item.cancellation_charge
            ? item.cancellation_charge
            : "",
        }));
        setAddress(item?.address?item?.address:'')
        if(item && item.gender){
          setGender({ label: item.gender, value: item.gender });
        }
        getCategoryData(item);
      }else{
        getCategoryData();
      }
    } catch (error) {
      setIsLoader(false);
      if (error.message) {
        Alert.alert(error.message);
      }
    }
  };

  const PickImage = async () => {
    let result = await Picker.launchImageLibraryAsync({
      mediaTypes: Picker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setImageUrl(result.assets[0].uri);
    }
  };

  const imageUploaded = () => {
    return (
      <View style={styles.imageContainer}>
        {image && <Image source={{ uri: image }} style={styles.image} />}
        {!image && <Image source={dummyImage} style={styles.image} />}
        <TouchableOpacity
          activeOpacity={1}
          onPress={PickImage}
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

  const onPressInformation = async (form) => {  
    form["status"] = UserStatus.INACTIVE;
    form["username"] = user?.attributes?.name ? user?.attributes?.name : user?.username ? user?.attributes?.name : user?.username;
    form["email"] = user?.attributes?.email ? user?.attributes?.email : user?.email ? user?.attributes?.email : user?.email;
    // // form["role"] = user?.attributes?.profile.toUpperCase();
    form["role"] = role;
    form["user_id"] = user?.id;
    form["age"] = form.age ? parseInt(form.age) : 0;
    form["hourly_rate"] = form.hourly_rate ? parseInt(form.hourly_rate) : 0;
    form["cancellation_charge"] = form.cancellation_charge
      ? parseInt(form.cancellation_charge)
      : 0;
    form["gender"] = gender.value;
    if (categories && categories.length !== 0) {
      let _cat = [];
      categories.map((e) => {
        if (e.selected === true) {
          _cat.push(e.id);
        }
      });
      form["category"] = _cat.toString();
    }
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
        navigation.navigate(ScreenName.PRIMARYID, {
          userInformation: response.data.updateUser,
        });
        setCurrentUserInfo(response.data.updateUser);
        setIsLoader(false);
      } 
      
      else {
        let response = await API.graphql(
          graphqlOperation(createUser, { input: form })
        );
        navigation.navigate(ScreenName.PRIMARYID, {
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

  const getCategoryData = async (existAddress={}) => {
    try {
      let category = await API.graphql(graphqlOperation(listCategories));
      if (Object.keys(category).length !== 0) {
        let items = category.data.listCategories.items;
        items = await getDataWithImage(items);
        if (items && items.length !== 0) {
          for (let i = 0; i < items.length; i++) {
            let flag = false;
            if(Object.keys(existAddress).length!==0){
              if(existAddress.address){
                let index = existAddress?.category?.split(',').findIndex((e)=>e===items[i].id);
                if(index!==-1){
                  flag = true;
                }
              }
            }
            items[i]["selected"] = flag;
          }
        }
        setCategories(items);
        setIsLoader(false);
      }
    } catch (error) {
      setIsLoader(false);
      if (error.message) {
        Alert.alert(error.message);
      }
    }
  };

  const handleClickCategory = (category, index) => {
    let _catArray = [...categories];
    if (category.selected) {
      _catArray[index].selected = false;
    } else {
      _catArray[index].selected = true;
    }
    setCategories(_catArray);
  };

  const handleAddress = (name, value) => {
    userData.address = value;
    setUserData(userData);
  };

  const renderContent = () => {
    return (
      <ScrollView style={styles.container} keyboardDismissMode="interactive" keyboardShouldPersistTaps='always'>
        {isLoader ? <Loader /> : null}
        <View style={styles.spacing}>
          <Header
            heading="Register As Coach"
            subHeading="Please fill your primary information."
          />
          <Formik
            initialValues={userData}
            onSubmit={onPressInformation}
            validationSchema={coachFormSchema}
            enableReinitialize
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
                {/* <ImagePicker /> */}
                {imageUploaded()}
                <Text style={styles.title}>Personal Info</Text>
                <Input
                  placeholder="Name"
                  onChangeText={handleChange("name")}
                  onBlur={handleBlur("name")}
                  value={values.name}
                />
                {errors.name && touched.name ? (
                  <Text style={{ ...INPUT.error }}>{errors.name}</Text>
                ) : null}
                <Input
                  placeholder="Age"
                  keyboardType="number-pad"
                  onChangeText={handleChange("age")}
                  onBlur={handleBlur("age")}
                  value={values.age ? values.age.toString() : ""}
                  maxLength={2}
                />
                {errors.age && touched.age ? (
                  <Text style={{ ...INPUT.error }}>{errors.age}</Text>
                ) : null}
                <SelectDropdown
                      data={selectGender}
                      onBlur={() => setOpenList(false)}
                      onSelect={(selectedItem, index) => {
                        setGender(selectedItem);
                      }}
                      buttonTextAfterSelection={(selectedItem, index) => {
                        return selectedItem.label;
                      }}
                      rowTextForSelection={(item, index) => {
                        setOpenList(true);
                        return item.label;
                      }}
                      defaultValue={gender}
                      defaultButtonText="Select gender"
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
                <Input
                  placeholder="Bio"
                  onChangeText={handleChange("bio")}
                  onBlur={handleBlur("bio")}
                  value={values.bio}
                  multiline={true}
                />
                {errors.bio && touched.bio ? (
                  <Text style={{ ...INPUT.error }}>{errors.bio}</Text>
                ) : null}
                <Input
                  placeholder="Experience in Years"
                  onChangeText={handleChange("experience")}
                  onBlur={handleBlur("experience")}
                  value={values.experience}
                />
                {errors.experience && touched.experience ? (
                  <Text style={{ ...INPUT.error }}>{errors.experience}</Text>
                ) : null}
                {/* Contact Info */}
                <Text style={styles.title}>Contact Info</Text>
                <Input
                  placeholder="Contact Number"
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
                    handleAddress("address", data.description);
                    values.address = data.description;
                    setAddress(data.description);
                    let _address =data.description;
                    let event = {target: {name: 'address', value:_address}}
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
                  <Text style={{ ...INPUT.error,marginTop:0.5 }}>{errors.address}</Text>
                ) : null}
                <Input
                  placeholder="Working Radius"
                  onChangeText={handleChange("working_radius")}
                  onBlur={handleBlur("working_radius")}
                  value={values.working_radius}
                />
                <Text style={styles.title}>Expertise</Text>
                {renderCategories()}

                {/* Pricing */}
                <Text style={styles.title}>Pricing</Text>
                <Input
                  placeholder="Set Hourly Rate"
                  keyboardType="phone-pad"
                  onChangeText={handleChange("hourly_rate")}
                  onBlur={handleBlur("hourly_rate")}
                  value={
                    values.hourly_rate ? values.hourly_rate.toString() : ""
                  }
                />
                {errors.hourly_rate && touched.hourly_rate ? (
                  <Text style={{ ...INPUT.error }}>{errors.hourly_rate}</Text>
                ) : null}
                <Input
                  placeholder="Set Cancellation Charge"
                  onChangeText={handleChange("cancellation_charge")}
                  onBlur={handleBlur("cancellation_charge")}
                  value={
                    values.cancellation_charge
                      ? values.cancellation_charge.toString()
                      : ""
                  }
                  keyboardType="phone-pad"
                />
                <TouchableOpacity
                  style={[{ ...BUTTON.primary }, { marginBottom: 15 }]}
                  onPress={handleSubmit}
                >
                  <Text style={{ ...BUTTONTEXT.primary }}>Save & Proceed</Text>
                </TouchableOpacity>
              </>
            )}
          </Formik>
        </View>
      </ScrollView>
    );
  };
  const renderCategories = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          marginBottom: 20,
        }}
      >
        {categories &&
          categories.map((category, index) => {
            return (
              <TouchableOpacity
                onPress={() => handleClickCategory(category, index)}
                activeOpacity={0.7}
                key={index}
                style={[
                  {
                    paddingTop: SIZES.basePadding,
                    marginRight: SIZES.basePadding,
                    marginBottom: SIZES.basePadding,
                    position: "relative",
                    alignItems: "center",
                    width: 100,
                    height: 100,
                    borderRadius: 10,
                    borderColor: category.selected
                      ? COLORS.primary
                      : COLORS.grey,
                    borderWidth: 1,
                  },
                ]}
              >
                <Image
                  source={{ uri: category?.image }}
                  style={{
                    height: 40,
                    width: 40,
                    resizeMode: "contain",
                    tintColor: COLORS.primary,
                  }}
                />
                <Text
                  style={{
                    textAlign: "center",
                    ...FONTS.small,
                    marginTop: SIZES.base,
                    color: category.selected ? COLORS.primary : COLORS.black100,
                    // ...FONTS.smallBold
                  }}
                >
                  {category.title}
                </Text>
              </TouchableOpacity>
            );
          })}
      </View>
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

export default Info;
