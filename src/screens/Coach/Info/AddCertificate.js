import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
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

const AddCertificate = ({ navigation, route }) => {
  const [image, setImage] = useState(null);
  const [coachingCertificateImageUrl, setCoachingCertificateImageUrl] =
    useState(null);
  const { params } = route;
  const [isLoader, setIsLoader] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
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
        };
        let response = await API.graphql(
          graphqlOperation(updateUser, { input: payload })
        );
        setIsLoader(false);

        setCurrentUserInfo(response.data.updateUser);
        navigation.navigate(ScreenName.CONFIRMCERTIFICATE, {
          userInformation: response.data.updateUser,
        });
      } else {
        setIsLoader(false);
        navigation.navigate(ScreenName.CONFIRMCERTIFICATE, {
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
          backgroundColor: "rgba(0, 0, 0, 0.7)",
        }}
      >
        <View style={{ flexDirection: "row", marginTop: 10 }}>
          <TouchableOpacity
            style={styles.spacing}
            onPress={() => navigation.goBack()}
          >
            <Image
              source={icons.whitearrow}
              style={{
                height: 15,
                width: 10,
                marginRight: "20%",
              }}
            />
          </TouchableOpacity>
          <Text
            style={{
              color: COLORS.white,
              ...FONTS.body2Bold,
              textAlign: "center",
            }}
          >
            Coaching Certificate
          </Text>
        </View>

        <View style={{ alignSelf: "center", marginTop: "20%" }}>
          <Text
            style={{
              ...FONTS.body2Medium,
              color: "white",
              textAlign: "center",
            }}
          >
            Add Your Certificate
          </Text>
          <Text
            style={{
              ...FONTS.body1Medium,
              color: "white",
              textAlign: "center",
              padding: SIZES.basePadding,
            }}
          >
            Lorem ipsum dolor sit amet, er adipiscing elit, sed dummy nibh
            euismod.
          </Text>
        </View>
        <TouchableOpacity
          style={{
            marginTop: 30,
            marginLeft: 10,
            marginRight: 10,
            height: 240,
          }}
          onPress={() => handleModalVisible()}
        >
          {image && <Image source={{ uri: image }} style={styles.image} />}
          {!image && (
            <Image source={images.dummyProofImage} style={styles.image} />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            alignSelf: "flex-end",
            top: -239,
            marginRight: 10,
            position: "relative",
          }}
          onPress={() => handleModalVisible()}
        >
          <Image
            source={icons.editIcon}
            style={{ height: 30, width: 30, resizeMode: "contain" }}
          />
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <>
      <SafeAreaView style={styles.container} keyboardDismissMode="interactive">
        {renderContent()}
        {isLoader ? <Loader /> : null}
        <View style={styles.buttonView}>
          <TouchableOpacity
            style={{ ...BUTTON.primary }}
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
            <Text style={{ ...FONTS.h1, color: COLORS.white }}>Take Picture</Text>
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
    paddingHorizontal: SIZES.basePadding,
    marginTop: 5,
  },
  image: {
    alignSelf: "center",
    width: "100%",
    height: "100%",
    borderRadius: 10,
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

export default AddCertificate;
