import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
  ScrollView,
  Alert,
  Pressable,
  Modal,
  Button,
} from "react-native";
import React, { useState, useEffect } from "react";
import {
  BUTTON,
  BUTTONTEXT,
  COLORS,
  FONTS,
  icons,
  images,
  SIZES,
} from "../../../constants";
import * as Picker from "expo-image-picker";
import { setCurrentUserInfo } from "../../../utils/services/StorageService";
import { API, graphqlOperation, Storage } from "aws-amplify";
import { updateUser } from "../../../graphql/mutations";
import ScreenName from "../../../utils/ScreenName";
import { removeImageFromS3, uploadImage } from "../../../utils";
import { Loader } from "../../../components";
import { Camera } from "expo-camera";

const ConfirmId = ({ navigation, route }) => {
  const [primaryImage, setPrimaryImage] = useState(null);
  const [secondaryImage, setSecondaryImage] = useState(null);
  const [secondaryImageUrl, setSecondaryImageUrl] = useState(null);
  const [primaryImageUrl, setPrimaryImageUrl] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [camera, setCamera] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [forms, setForms] = useState({
    secondary_id: "",
    primary_id: "",
    id: "",
  });

  const { params } = route;
  const [isLoader, setIsLoader] = useState(false);

  useEffect(() => {
    if (params && params.userInformation) {
      let item = params.userInformation;
      setForms((forms) => ({
        ...forms,
        ["secondary_id"]: item.secondary_id,
        ["primary_id"]: item.primary_id,
        ["id"]: item.id,
      }));
    }
    getImageData();
}, []);

  const getImageData = async () => {
    if (params && params.userInformation) {
      let item = params.userInformation;
      if (item.secondary_id && item.secondary_id !== null) {
        const imageKey = await Storage.get(item.secondary_id, {
          level: "public",
        });
        setSecondaryImage(imageKey);
      }
      if (item.primary_id && item.primary_id !== null) {
        const primaryimageKey = await Storage.get(item.primary_id, {
          level: "public",
        });
        setPrimaryImage(primaryimageKey);
      }
    }
  };

  const takePicture = async (type) => {
    if (type === "camera") {
      let result = await camera.takePictureAsync(null);
      if (!result.cancelled) {
        if (modalType === "secondary_id") {
          setSecondaryImage(result.uri);
          setSecondaryImageUrl(result.uri);
        } else {
          setPrimaryImage(result.uri);
          setPrimaryImageUrl(result.uri);
        }
      }
    }
  };
  const pickImage = async (type) => {
    if (type === "camera") {
      let result = await Picker.launchCameraAsync({
        mediaTypes: Picker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });
      if (!result.canceled) {
        if (modalType === "secondary_id") {
          setSecondaryImage(result.assets[0].uri);
          setSecondaryImageUrl(result.assets[0].uri);
        } else {
          setPrimaryImage(result.assets[0].uri);
          setPrimaryImageUrl(result.assets[0].uri);
        }
      }
    }
  };

  const uploadImageToggled = async (type) => {
    if (type === "upload") {
      let result = await Picker.launchImageLibraryAsync({
        mediaTypes: Picker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });
      if (!result.canceled) {
        if (modalType === "secondary_id") {
          setSecondaryImage(result.assets[0].uri);
          setSecondaryImageUrl(result.assets[0].uri);
        } else {
          setPrimaryImage(result.assets[0].uri);
          setPrimaryImageUrl(result.assets[0].uri);
        }
      }
    }
  };

  const handleModalVisible = (type) => {
    setModalVisible(true);
    setModalType(type);
  };
 
  const saveUserInformation = async () => {
    try {
      setIsLoader(true);
      if (
        (primaryImageUrl !== null || secondaryImageUrl !== null) &&
        params &&
        params !== null &&
        params.userInformation
      ) {
        let userForm = { ...forms };

        if (secondaryImageUrl && secondaryImageUrl !== null) {
          let folder = await uploadImage(secondaryImageUrl, "secondry_id");
          userForm.secondary_id = folder;
          setForms((forms) => ({
            ...forms,
            ["secondary_id"]: folder,
          }));
          let secondary_id = params.userInformation.secondary_id;
          if (secondary_id) {
            await removeImageFromS3(secondary_id);
          }
        }
        if (primaryImageUrl && primaryImageUrl !== null) {
          let primary_folder = await uploadImage(primaryImageUrl, "primary_id");
          setForms((forms) => ({
            ...forms,
            ["primary_id"]: primary_folder,
          }));
          userForm.primary_id = primary_folder;
          let primary_id = params.userInformation.primary_id;
          if (primary_id) {
            await removeImageFromS3(primary_id);
          }
        }

        let response = await API.graphql(
          graphqlOperation(updateUser, { input: userForm })
        );
        setIsLoader(false);
        setCurrentUserInfo(response.data.updateUser);
        navigation.navigate(ScreenName.ADDCERTIFICATE, {
          userInformation: response.data.updateUser,
        });
      } else {
        setIsLoader(false);
        navigation.navigate(ScreenName.ADDCERTIFICATE, {
          userInformation: params.userInformation,
        });
      }
    } catch (error) {
      setIsLoader(false);
      if (error.message) {
        Alert.alert(error.message);
      }
    }
  };

  const renderContent = () => {
    return (
      <View
        style={{
          flex: 1,
          height: SIZES.height,
        }}
      >
        <View style={styles.spacing}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 20,
            }}
          >
            <Text style={{ ...FONTS.body2Bold }}>Primary ID</Text>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Image
                source={icons.verifiedIcon}
                style={{
                  height: 20,
                  width: 20,
                  resizeMode: "contain",
                  marginTop: 2,
                }}
              />
              <Text style={{ ...FONTS.body1Medium, marginLeft: 5 }}>
                Verified
              </Text>
            </View>
          </View>
          {primaryImage && (
            <Image source={{ uri: primaryImage }} style={styles.image} />
          )}
          {!primaryImage && (
            <Image source={images.dummyProofImage} style={styles.image} />
          )}
          <TouchableOpacity
            style={[{ ...BUTTON.primary }, { marginTop: 20 }]}
            onPress={() => {
              handleModalVisible("primary_id");
            }}
          >
            <Text style={{ color: "white", ...FONTS.body2Medium }}>Retake</Text>
          </TouchableOpacity>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            <Text style={{ ...FONTS.body2Bold }}>Secondary ID</Text>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Image
                source={icons.verifiedIcon}
                style={{
                  height: 20,
                  width: 20,
                  resizeMode: "contain",
                  marginTop: 2,
                }}
              />
              <Text style={{ ...FONTS.body1Medium, marginLeft: 5 }}>
                Verified
              </Text>
            </View>
          </View>
          {secondaryImage && (
            <Image source={{ uri: secondaryImage }} style={styles.image} />
          )}
          {!secondaryImage && (
            <Image source={images.dummyProofImage} style={styles.image} />
          )}
          <TouchableOpacity
            style={[{ ...BUTTON.primary }, { marginTop: 20 }]}
            onPress={() => {
              handleModalVisible("secondary_id");
            }}
          >
            <Text style={{ color: "white", ...FONTS.body2Medium }}>Retake</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  return (
    <>
      <SafeAreaView style={styles.container} keyboardDismissMode="interactive">
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {isLoader ? <Loader /> : null}
          {renderContent()}
        </ScrollView>
        <View style={styles.buttonView}>
          <TouchableOpacity
            style={[
              { ...BUTTON.primary },
              {
                width: "45%",
                backgroundColor: COLORS.white,
                borderWidth: 1,
                borderColor: COLORS.grey,
              },
            ]}
            onPress={() => navigation.goBack()}
          >
            <Text style={{ ...FONTS.body1Medium }}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[{ ...BUTTON.primary }, { width: "45%" }]}
            onPress={saveUserInformation}
          >
            <Text style={{ ...BUTTONTEXT.primary }}>Save & Next</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View
          style={{
            backgroundColor: "rgba(52, 52, 52, 0.8)",
            borderWidth: 1,
            borderColor: COLORS.grey,
            borderLeftRadius: 10,
            borderRightRadius: 10,
            justifyContent: "space-between",
            bottom: 0,
            position: "absolute",
            width: SIZES.width,
          }}
        >
          <Pressable
            onPress={() => {
              setModalVisible(!modalVisible);
            }}
            style={{ marginBottom: 10 }}
          >
            <Image
              source={icons.closeWhiteIcon}
              style={{ height: 24, width: 24, alignSelf: "flex-end" }}
            />
          </Pressable>
          {Platform.OS === "ios" ? (
            <>
              <Camera
                ref={(ref) => setCamera(ref)}
                style={styles.fixedRatio}
                type={type}
                ratio={"1:1"}
              />
              <Button
                title={"Take Picture"}
                onPress={() => {
                  setModalVisible(!modalVisible);
                  takePicture("camera");
                }}
              />
            </>
          ) : (
          <TouchableOpacity
            style={{ alignItems: "center", marginTop: -10 }}
            onPress={() => {
              setModalVisible(!modalVisible);
              pickImage("camera");
            }}
          >
            <Text style={{ ...FONTS.h1, color: COLORS.white }}>
              Take Picture
            </Text>
          </TouchableOpacity>
          )}
          <View
            style={{
              borderWidth: 0.8,
              borderColor: COLORS.white,
              marginTop: 10,
            }}
          ></View>
           {Platform.OS === "ios" ? (
            <Button
              title={"Gallery"}
              onPress={() => {
                setModalVisible(!modalVisible);
                uploadImageToggled("upload");
              }}
            />
          ) : (
          <TouchableOpacity
            style={{ alignItems: "center", marginTop: 10 }}
            onPress={() => {
              setModalVisible(!modalVisible);
              uploadImageToggled("upload");
            }}
          >
            <Text style={{ ...FONTS.h1, color: COLORS.white }}>Gallery</Text>
          </TouchableOpacity>
          )}
          <View style={{ marginBottom: 10 }}></View>
        </View>
      </Modal>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 1,
  },
  spacing: {
    paddingTop: Platform.OS == "android" ? SIZES.basePadding : 0,
    paddingHorizontal: SIZES.basePadding,
  },
  image: {
    height: "30%",
    width: "100%",
    borderRadius: 10,
    resizeMode: "cover",
    marginTop: 10,
  },
  buttonView: {
    position: "relative",
    bottom: 0,
    width: "100%",
    padding: SIZES.basePadding,
    backgroundColor: COLORS.white,
    borderTopColor: COLORS.grey,
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default ConfirmId;
