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
  Modal,
  Pressable,
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
import {
  setCurrentUserInfo,
} from "../../../utils/services/StorageService";
import { API, graphqlOperation, Storage } from "aws-amplify";
import { updateUser } from "../../../graphql/mutations";
import ScreenName from "../../../utils/ScreenName";
import { removeImageFromS3, uploadImage } from "../../../utils";
import { Loader } from "../../../components";
import { UserRole, UserStatus } from "../../../models";
import { Camera } from "expo-camera";
const ConfirmCertificate = ({ navigation, route }) => {
  const [image, setImage] = useState(null);
  const [coachingCertificateImageUrl, setCoachingCertificateImageUrl] =
    useState(null);
  const { params } = route;
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoader, setIsLoader] = useState(false);
  const [camera, setCamera] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  useEffect(() => {
    getImageData();
  }, []);

  const getImageData = async () => {
    if (params && params.userInformation) {
      let item = params.userInformation;
      if (item.coaching_certificate && item.coaching_certificate !== null) {
        const imageKey = await Storage.get(item.coaching_certificate, {
          level: "public",
        });
        setImage(imageKey);
      }
    }
  };

  const saveUserInformation = async () => {
    try {
      setIsLoader(true);
      if (
        coachingCertificateImageUrl &&
        coachingCertificateImageUrl !== null &&
        params &&
        params !== null &&
        params.userInformation
      ) {
        let folder = await uploadImage(
          coachingCertificateImageUrl,
          "coaching_certificate"
        );
        let coaching_certificate = params.userInformation.coaching_certificate;
        if (coaching_certificate) {
          await removeImageFromS3(coaching_certificate);
        }
        let payload = {
          id: params.userInformation.id,
          coaching_certificate: folder,
          status: UserStatus.ACTIVE,
        };
        let response = await API.graphql(
          graphqlOperation(updateUser, { input: payload })
        );
        setIsLoader(false);
        if (
          response.data.updateUser.role == UserRole.COACH &&
          response.data.updateUser.isVerified == false &&
          response.data.updateUser.status == UserStatus.ACTIVE
        ) {
          navigation.navigate("CoachVerification");
        } else {
          await setCurrentUserInfo(response.data.updateUser);
          gotoHome();
        }
      } else {
        let payload = {
          id: params.userInformation.id,
          status: UserStatus.ACTIVE,
          _version: params.userInformation._version,
        };
        let response = await API.graphql(
          graphqlOperation(updateUser, { input: payload })
        );
        setIsLoader(false);
        if (
          response.data.updateUser.role == UserRole.COACH &&
          response.data.updateUser.isVerified == false &&
          response.data.updateUser.status == UserStatus.ACTIVE
        ) {
          navigation.navigate("CoachVerification");
        } else {
          await setCurrentUserInfo(response.data.updateUser);
          gotoHome();
        }
      }
    } catch (error) {
      setIsLoader(false);
      if (error.message) {
        Alert.alert(error.message);
      }
    }
  };

  const gotoHome = () => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: ScreenName.SUCCESS,
          title: "Your certificate is uploaded successfully.",
          params: { screen: ScreenName.COACHHOME },
        },
      ],
    });
  };

  const clickCertificateImage = async (type) => {
    if (type === "camera") {
      let result = await camera.takePictureAsync(null);
      if (!result.cancelled) {
        setImage(result.uri);
        setCoachingCertificateImageUrl(result.uri);
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
        setImage(result.assets[0].uri);
        setCoachingCertificateImageUrl(result.assets[0].uri);
      }
    }
  };

  const uploadCertificateImage = async (type) => {
    if (type === "upload") {
      let result = await Picker.launchImageLibraryAsync({
        mediaTypes: Picker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });
      if (!result.canceled) {
        setImage(result.assets[0].uri);
        setCoachingCertificateImageUrl(result.assets[0].uri);
      }
    }
  };

  const handleModalVisible = () => {
    setModalVisible(true);
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
          {isLoader ? <Loader /> : null}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 20,
            }}
          >
            <Text style={{ ...FONTS.body2Bold }}>Coaching Certificate</Text>
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
          {image && <Image source={{ uri: image }} style={styles.image} />}
          {!image && (
            <Image source={images.certificateImage} style={styles.image} />
          )}
          <TouchableOpacity
            style={[{ ...BUTTON.primary }, { marginTop: 20 }]}
            onPress={() => handleModalVisible()}
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
                  clickCertificateImage("camera");
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
                uploadCertificateImage("upload");
              }}
            />
          ) : (
            <TouchableOpacity
              style={{ alignItems: "center", marginTop: 10 }}
              onPress={() => {
                setModalVisible(!modalVisible);
                uploadCertificateImage("upload");
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
    height: "45%",
    width: "100%",
    borderRadius: 10,
    resizeMode: "cover",
    marginTop: 10,
  },
  buttonView: {
    position: "absolute",
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

export default ConfirmCertificate;
