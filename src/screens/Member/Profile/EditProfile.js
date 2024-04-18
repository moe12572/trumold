import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import { Formik } from "formik";
import { API, graphqlOperation, Auth, Storage } from "aws-amplify";
import { updateUser } from "./../../../graphql/mutations";

import {
  SIZES,
  COLORS,
  BUTTON,
  BUTTONTEXT,
  FONTS,
  images,
  icons,
} from "../../../constants";
import { PageHeader, Input, Loader } from "../../../components";
import { setCurrentUserInfo } from "../../../utils/services/StorageService";
import { useEffect } from "react";
import ScreenName from "../../../utils/ScreenName";
import { getUser, listCategories } from "../../../graphql/queries";
import * as Picker from "expo-image-picker";
import { UserRole } from "../../../models";
import Diets from "../../../utils/Diets";
import ActivityLevel from "../../../utils/ActivityLevel";
import { getDataWithImage } from "../../../utils";
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

export default function EditProfile({ navigation }) {
  const initilValue = {
    name: "",
    age: "",
    bio: "",
    phone: "",
    address: "",
    image: "",
    hourly_rate: "",
  };
  const [userData, setUserData] = useState(initilValue);
  const [isLoader, setIsLoader] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(Diets[0]);
  const [selectedActivityLevel, setSelectedActivityLevel] = useState(
    ActivityLevel[0]
  );
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);
  const [bannerImageUrl, setBannerImageUrl] = useState(null);
  const [roleType, setRoleType] = useState(UserRole.MEMBER);
  const dummyImage = images.userDummyImage;
  const [categories, setCategories] = useState([]);
  const [gender, setGender] = useState(selectGender[0]);
  const [address, setAddress] = useState("");
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
      setRoleType(_userInfo.attributes.profile);
      const _item = await API.graphql(
        graphqlOperation(getUser, {
          id: _userInfo.attributes.sub,
        })
      );
      let item = _item.data.getUser;
      setRoleType(_item.data.getUser.role);
      if (item !== null && Object.keys(item).length !== 0) {
        if (item.image && item.image !== null) {
          const imageKey = await Storage.get(item.image, { level: "public" });
          setImage(imageKey);
        }
        if (item.banner && item.banner !== null) {
          const imageKey = await Storage.get(item.banner, { level: "public" });
          setBannerImage(imageKey);
        }
        setUserData((userData) => ({
          ...userData,
          ["name"]: item?.name,
          ["age"]: item?.age,
          ["bio"]: item?.bio,
          ["experience"]: item?.experience,
          ["category"]: item?.category,
          ["height"]: item?.height,
          ["weight"]: item?.weight,
          ["gender"]: item?.gender ? item.gender : "",
          ["hourly_rate"]: item?.hourly_rate,
          ["cancellation_charge"]: item?.cancellation_charge,
          ["meal_routine"]: item?.meal_routine,
          ["current_activity_lebel"]: item?.current_activity_lebel,
          ["phone"]: item?.phone,
          ["address"]: item?.address,
          ["image"]: item?.image,
          ["banner"]: item?.banner,
        }));
        setAddress(item?.address);
        if (item && item.gender) {
          setGender({ label: item.gender, value: item.gender });
        }
        if (item && item.meal_routine) {
          setSelectedMeal({
            label: item.meal_routine,
            value: item.meal_routine,
          });
        }
        if (item && item.current_activity_lebel) {
          setSelectedActivityLevel({
            label: item.current_activity_lebel,
            value: item.current_activity_lebel,
          });
        }
        setIsLoader(false);
        getCategoryData(item);
      }
    } catch (error) {
      setIsLoader(false);
      if (error.message) {
        Alert.alert(error.message);
      }
    }
  };
  const removeImageFromS3 = async (name) => {
    await Storage.remove(name)
      .then((result) => console.log("Deleted", result))
      .catch((err) => err);
  };
  const onPressInformation = async (form) => {
    form["age"] = parseInt(form.age);
    form["meal_routine"] = selectedMeal.value;
    form["current_activity_lebel"] = selectedActivityLevel.value;
    form["address"] = address;
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
      if (imageUrl !== null) {
        const photo = await fetch(imageUrl);
        const photoBlob = await photo.blob();
        const fileName = `${form.name}_${Math.random()
          .toString(18)
          .slice(3)
          .substr(0, 10)}.jpeg`;
        const folder = `images/${fileName}`;
        await Storage.put(folder, photoBlob, {
          level: "public",
          contentType: "image/jpg",
        });
        if (form.image) {
          await removeImageFromS3(form.image);
        }
        form["image"] = folder;
      }
      if (bannerImageUrl !== null) {
        const photo = await fetch(bannerImageUrl);
        const photoBlob = await photo.blob();
        const fileName = `${form.name}_${Math.random()
          .toString(18)
          .slice(3)
          .substr(0, 10)}.jpeg`;
        const folder = `images/${fileName}`;
        await Storage.put(folder, photoBlob, {
          level: "public",
          contentType: "image/jpg",
        });
        if (form.banner) {
          await removeImageFromS3(form.banner);
        }
        form["banner"] = folder;
      }
      const _userInfo = await Auth.currentAuthenticatedUser({
        bypassCache: true,
      });
      form["id"] = _userInfo.attributes.sub;
      let response = await API.graphql(
        graphqlOperation(updateUser, { input: form })
      );
      navigation.navigate(ScreenName.PROFILE, { stateUpdated: true });
      Alert.alert("Profile updated successfully");
      setCurrentUserInfo(response.data.updateUser);
      setIsLoader(false);
    } catch (error) {
      setIsLoader(false);
      if (error.message) {
        Alert.alert(error.message);
      }
    }
  };

  const uploadImage = async () => {
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

  const uploadBannerImage = async () => {
    let result = await Picker.launchImageLibraryAsync({
      mediaTypes: Picker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!result.canceled) {
      setBannerImage(result.assets[0].uri);
      setBannerImageUrl(result.assets[0].uri);
    }
  };

  const getCategoryData = async (userInfo) => {
    try {
      let category = await API.graphql(graphqlOperation(listCategories));
      if (Object.keys(category).length !== 0) {
        let items = category.data.listCategories.items;
        items = await getDataWithImage(items);
        if (items && items.length !== 0) {
          for (let i = 0; i < items.length; i++) {
            if (userInfo.category) {
              let allCat = userInfo.category;
              let _cat = allCat.split(",");
              let index = _cat.findIndex((e) => e === items[i].id);
              if (index !== -1) {
                items[i]["selected"] = true;
              } else {
                items[i]["selected"] = false;
              }
            } else {
              items[i]["selected"] = false;
            }
          }
        }
        setCategories(items);
      }
    } catch (error) {
      if (error.message) {
        Alert.alert(error.message);
      }
    }
  };

  const imageUploaded = () => {
    return (
      <View style={styles.imageContainer}>
        {image && <Image source={{ uri: image }} style={[styles.image]} />}
        {!image && <Image source={dummyImage} style={[styles.image]} />}

        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            uploadImage();
          }}
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
  const coachImageUploaded = () => {
    return (
      <View style={styles.coachimageContainer}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            uploadBannerImage();
          }}
          style={[{ position: "absolute", right: 0, top: 10, zIndex: 1 }]}
        >
          <Image
            source={icons.editIcon}
            style={{ height: 30, width: 30, resizeMode: "contain" }}
          />
        </TouchableOpacity>

        {bannerImage && (
          <Image
            source={{ uri: bannerImage }}
            style={{ height: 175, width: SIZES.width, resizeMode: "cover" }}
          />
        )}
        {!bannerImage && (
          <Image
            source={images.userDummyImage}
            style={{ height: 175, width: SIZES.width, resizeMode: "cover" }}
          />
        )}

        <View style={{ marginTop: -15 }}>
          {image && (
            <Image
              source={{ uri: image }}
              style={[styles.image, { marginTop: -30, position: "relative" }]}
            />
          )}
          {!image && (
            <Image
              source={dummyImage}
              style={[styles.image, { marginTop: -30, position: "relative" }]}
            />
          )}
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              uploadImage();
            }}
            style={[
              styles.editBtn,
              { marginTop: -38, marginRight: 0, marginLeft: 60 },
            ]}
          >
            <Image
              source={icons.editIcon}
              style={{ height: 30, width: 30, resizeMode: "contain" }}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
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
  const renderContent = () => {
    return (
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="always"
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
            onSubmit={onPressInformation}
          >
            {({ handleChange, handleBlur, handleSubmit, values }) => (
              <>
                {/* <ImagePicker setImageUrl={setImageUrl} profileImage={profileImage}/> */}
                {roleType === UserRole.COACH
                  ? coachImageUploaded()
                  : imageUploaded()}
                {/* {imageUploaded()} */}
                <Text style={styles.title}>Personal Info</Text>
                <Text style={styles.title}>Name</Text>
                <Input
                  placeholder="Name"
                  onChangeText={handleChange("name")}
                  onBlur={handleBlur("name")}
                  value={values.name}
                />
                <Text style={styles.title}>Age</Text>
                <Input
                  placeholder="Age"
                  keyboardType="number-pad"
                  onChangeText={handleChange("age")}
                  onBlur={handleBlur("age")}
                  value={values.age ? values.age.toString() : ""}
                  maxLength={2}
                />
                <Text style={styles.title}>About</Text>
                <Input
                  placeholder="About"
                  onChangeText={handleChange("bio")}
                  onBlur={handleBlur("bio")}
                  value={values.bio}
                  multiline={true}
                />
                <Text style={styles.title}>Gender</Text>
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
                {roleType === UserRole.COACH && (
                  <View style={{ top: 15 }}>
                    <Text style={styles.title}>Experience</Text>
                    <Input
                      placeholder="Experience in Years"
                      onChangeText={handleChange("experience")}
                      onBlur={handleBlur("experience")}
                      value={values.experience}
                    />
                    <Text style={styles.title}>Hourly Rate</Text>
                    <Input
                      placeholder="Hourly Rate"
                      onChangeText={handleChange("hourly_rate")}
                      onBlur={handleBlur("hourly_rate")}
                      value={
                        values.hourly_rate ? values.hourly_rate.toString() : ""
                      }
                    />
                    <Text style={styles.title}>Cancellation Charge</Text>
                    <Input
                      placeholder="Cancellation Charge"
                      onChangeText={handleChange("cancellation_charge")}
                      onBlur={handleBlur("cancellation_charge")}
                      value={values.cancellation_charge}
                    />
                    <Text style={styles.title}>Expertise</Text>
                    {renderCategories()}
                  </View>
                )}
                {roleType !== UserRole.COACH && (
                  <View style={{ marginTop: SIZES.basePadding }}>
                    <Text style={styles.title}>Height</Text>
                    <Input
                      placeholder="Height"
                      onChangeText={handleChange("height")}
                      onBlur={handleBlur("height")}
                      value={values.height}
                    />
                    <Text style={styles.title}>Weight</Text>
                    <Input
                      placeholder="Weight"
                      onChangeText={handleChange("weight")}
                      onBlur={handleBlur("weight")}
                      value={values.weight}
                    />
                    <Text style={styles.title}>Diets</Text>
                    <SelectDropdown
                      data={Diets}
                      onBlur={() => setOpenList(false)}
                      onSelect={(selectedItem, index) => {
                        setSelectedMeal(selectedItem);
                      }}
                      buttonTextAfterSelection={(selectedItem, index) => {
                        return selectedItem.label;
                      }}
                      rowTextForSelection={(item, index) => {
                        setOpenList(true);
                        return item.label;
                      }}
                      defaultValue={selectedMeal}
                      defaultButtonText="Select meal"
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
                            style={{ height: 12, width: 14 }}
                          />
                        );
                      }}
                      dropdownIconPosition={"right"}
                    />
                    <Text style={styles.title}>ActivityLevel</Text>
                    <SelectDropdown
                      data={ActivityLevel}
                      onBlur={() => setOpenList(false)}
                      onSelect={(selectedItem, index) => {
                        setSelectedActivityLevel(selectedItem);
                      }}
                      buttonTextAfterSelection={(selectedItem, index) => {
                        return selectedItem.label;
                      }}
                      rowTextForSelection={(item, index) => {
                        setOpenList(true);
                        return item.label;
                      }}
                      defaultValue={selectedActivityLevel}
                      defaultButtonText="Select activity level"
                      buttonTextStyle={{
                        ...FONTS.body1Bold,
                        fontFamily: "Medium",
                        textAlign: "left",
                      }}
                      buttonStyle={[
                        styles.dropdown2BtnStyle,
                        { marginTop: SIZES.basePadding },
                      ]}
                      rowTextStyle={{ ...FONTS.body2, color: COLORS.black60 }}
                      selectedRowStyle={{ backgroundColor: COLORS.black20 }}
                      renderDropdownIcon={() => {
                        return (
                          <Image
                            source={
                              openList ? icons.arrowUpIcon : icons.arrowDownIcon
                            }
                            style={{ height: 12, width: 14 }}
                          />
                        );
                      }}
                      dropdownIconPosition={"right"}
                    />
                  </View>
                )}
                <Text style={styles.title}>Contact Info</Text>

                <Text style={styles.title}>Contact Number</Text>
                <Input
                  placeholder="Contact Number"
                  onChangeText={handleChange("phone")}
                  onBlur={handleBlur("phone")}
                  value={values.phone}
                />
                <Text style={styles.title}>Address</Text>
                <Location
                  onPress={(data, details = null) => {
                    setAddress(data.description);
                  }}
                  placeholder="Address"
                  textInputProps={{
                    onChangeText: (value) => {
                      setAddress(value);
                    },
                    value: address,
                  }}
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
    <>
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
    </>
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
  imageContainer: {
    alignItems: "center",
    position: "relative",
    height: 100,
  },
  coachimageContainer: {
    alignItems: "center",
    position: "relative",
    // height: 100,
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
    marginBottom: 1,
  },
});
