import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  BUTTON,
  BUTTONTEXT,
  COLORS,
  FONTS,
  icons,
  images,
  SIZES,
} from "../../../constants";
import ScreenName from "../../../utils/ScreenName";
import Reviews from "../../../components/reviews";
import React, { useState, useEffect } from "react";
import { Auth, graphqlOperation, API, Storage } from "aws-amplify";
import { Loader } from "../../../components";
import {
  getUser,
  listBookSessions,
  listCategories,
  listRatings,
} from "../../../graphql/queries";
import { AWS_API_URL, getDataWithImage } from "../../../utils";
import { setCurrentUserInfo } from "../../../utils/services/StorageService";
import { updateUser } from "../../../graphql/mutations";
export default function CoachProfileScreen({ navigation, route }) {
  const tab = {
    firstTab: "Details",
    secondTab: "Certificate",
  };
  const [tabName, setTabName] = useState(tab.firstTab);
  const [isLoader, setIsLoader] = useState(false);
  const [user, setUser] = useState({});
  const [profileImage, setProfileImage] = useState("");
  const [certificateImage, setCertificateImage] = useState("");
  const [bannerImage, setBannerImage] = useState("");
  const [totalSession, setTotalSession] = useState("");
  const [totalReview, setTotalReview] = useState([]);
  const [reviewCount, setReviewCount] = useState([]);
  const [categories, setCategories] = useState("");
  const [userId, setUserId] = useState("");
  let rating = user.totalRating;
  let review = user.totalReview;
  let totalRating = (rating / review).toFixed(1);
  useEffect(() => {
    getUserData();
    // getAccount();
    if (route.params !== undefined && route.params.stateUpdated === true) {
      delete route.params.stateUpdated;
    }
  }, [route?.params?.stateUpdated]);

  const getUserData = async () => {
    setIsLoader(true);
    try {
      const _userInfo = await Auth.currentAuthenticatedUser({
        bypassCache: true,
      });
      const _item = await API.graphql(
        graphqlOperation(getUser, {
          id: _userInfo.attributes.sub,
        })
      );
      if(!_item.data.getUser.isPaymentVerified){
        getAccount(_item.data.getUser.accountId,_userInfo.attributes.sub)
      }
      getSession(_userInfo.attributes.sub);
      getReviews(_userInfo.attributes.sub);
      setUserId(_userInfo.attributes.sub);
      setIsLoader(false);
      let item = _item.data.getUser;
      getCategoryData(_item.data.getUser.category);
      if (item !== null && Object.keys(item).length !== 0) {
        setUser(item);
        if (item.image && item.image !== null) {
          const imageKey = await Storage.get(item.image, { level: "public" });
          setProfileImage(imageKey);
        }
        if (item.banner && item.banner !== null) {
          const bannerimageKey = await Storage.get(item.banner, {
            level: "public",
          });
          setBannerImage(bannerimageKey);
        }
        if (item.coaching_certificate && item.coaching_certificate !== null) {
          const coaching_certificateimageKey = await Storage.get(
            item.coaching_certificate,
            { level: "public" }
          );
          setCertificateImage(coaching_certificateimageKey);
        }
      }
    } catch (error) {
      setIsLoader(false);
      if (error.message) {
        Alert.alert(error.message);
      }
    }
  };
  const getSession = async (coachId) => {
    try {
      let session = await API.graphql(
        graphqlOperation(listBookSessions, {
          filter: {
            status: {
              eq: "Confirmed",
            },
            coachID: {
              eq: coachId,
            },
          },
        })
      );
      setTotalSession(session.data.listBookSessions.items.length);
    } catch (error) {
      if (error.message) {
        Alert.alert(error.message);
      }
    }
  };

  const getReviews = async (coachId) => {
    try {
      let myReviews = await API.graphql(
        graphqlOperation(listRatings, {
          filter: {
            ratingCoachId: {
              eq: coachId,
            },
          },
        })
      );
      if (Object.keys(myReviews).length !== 0) {
        let items = myReviews.data.listRatings.items;
        items = await getDataWithImage(items);
        setTotalReview(items);
        setReviewCount(items.length);
      }
    } catch (error) {
      if (error.message) {
        Alert.alert(error.message);
      }
    }
  };

  const getCategoryData = async (categorylist) => {
    let newArray = categorylist.split(",");
    try {
      let category = await API.graphql(graphqlOperation(listCategories));
      let items = category.data.listCategories.items;
      let newItem = items.map(function ({ id, title }) {
        return {
          id,
          title,
        };
      });
      let intersection = newItem.filter((element) =>
        newArray.includes(element.id)
      );
      let array = intersection.map(function (item) {
        return item["title"];
      });
      setTimeout(() => {
        setCategories(array.toString());
      }, 1000);
    } catch (error) {
      if (error.message) {
        Alert.alert(error.message);
      }
    }
  };

  const getAccount = async (id, userId) => {
    let payload = {
      requestType: "getAccount",
      accountId: id,
    };
    setIsLoader(true);
    try {
      let response = await fetch(AWS_API_URL,
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );
      let result = await response.json();
      if (
        result.charges_enabled === true &&
        result.details_submitted === true &&
        result.payouts_enabled === true
      ) {
        let payload = {
          id: userId,
          isPaymentVerified: true,
        };
        try {
          let response = await API.graphql(
            graphqlOperation(updateUser, { input: payload })
          );
          setCurrentUserInfo(response.data.updateUser);
          setIsLoader(false);
        } catch (error) {
          Alert.alert(error.message);
        }
      }
      setIsLoader(false);
    } catch (error) {
      setIsLoader(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {isLoader ? <Loader /> : null}
        <StatusBar backgroundColor={COLORS.dark} />
        <View
          style={{
            paddingHorizontal: SIZES.basePadding,
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 8,
            marginBottom: 8,
          }}
        >
          <Text style={{ ...FONTS.body1Bold }}>Profile</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate(ScreenName.PROFILESETTING)}
          >
            <Image
              source={icons.settings}
              style={{ height: 17, width: 17, marginTop: 1 }}
            />
          </TouchableOpacity>
        </View>
        <View>
          <Image
            source={bannerImage ? { uri: bannerImage } : images.userDummyImage}
            style={{ height: 175, width: SIZES.width, resizeMode: "cover" }}
          />
          <View style={{ alignItems: "center", marginTop: -42 }}>
            <Image
              source={profileImage ? { uri: profileImage } : images.userDummyImage}
              style={styles.profileImage}
            />
            <Text
              style={{
                ...FONTS.h2Medium,
                marginTop: SIZES.base,
                textAlign: "center",
              }}
            >
              {user?.name}
            </Text>
            <Text
              style={{
                ...FONTS.body2,
                color: COLORS.black40,
                textAlign: "center",
              }}
            >
              {categories ? categories : null ? categories : null}
            </Text>
          </View>
        </View>
        <View
          style={{
            paddingHorizontal: SIZES.basePadding,
            paddingTop: SIZES.basePadding * 1.5,
          }}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View>
              <Text style={styles.label}>Experience</Text>
              <Text style={styles.value}>
                {user?.experience ? user?.experience : "0 Years"}
              </Text>
            </View>
            <View>
              <Text style={[styles.label, { marginLeft: -8 }]}>Sessions</Text>
              <Text style={[styles.value, { textAlign: "center" }]}>
                {totalSession ? totalSession : "0"}
              </Text>
            </View>
            <View>
              <Text style={styles.label}>Rating</Text>
              {user.totalRating && user.totalReview !== null ? (
                <Text style={[styles.value, { textAlign: "center" }]}>
                  {totalRating}
                </Text>
              ) : (
                <Text style={[styles.value, { textAlign: "center" }]}>0</Text>
              )}
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              padding: SIZES.base,
              backgroundColor: COLORS.grey,
              borderRadius: SIZES.base,
              marginTop: SIZES.base * 3,
            }}
          >
            <TouchableOpacity
              onPress={() => setTabName(tab.firstTab)}
              style={[
                styles.button,
                {
                  backgroundColor:
                    tabName === tab.firstTab ? "#fff" : COLORS.grey,
                },
              ]}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.buttonText,
                  {
                    color:
                      tabName === tab.firstTab
                        ? COLORS.primary
                        : COLORS.black100,
                  },
                ]}
              >
                Details
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor:
                    tabName === tab.secondTab ? "#fff" : COLORS.grey,
                },
              ]}
              activeOpacity={0.7}
              onPress={() => setTabName(tab.secondTab)}
            >
              <Text
                style={[
                  styles.buttonText,
                  {
                    color:
                      tabName === tab.secondTab
                        ? COLORS.primary
                        : COLORS.black100,
                  },
                ]}
              >
                Certificate
              </Text>
            </TouchableOpacity>
          </View>
          {tabName === tab.firstTab ? (
            <View>
              <View>
                <Text style={styles.title}>About</Text>
                <Text style={{ ...FONTS.body1Medium, color: COLORS.black100 }}>
                  {user?.bio}
                </Text>
              </View>

              <View style={{ marginBottom: 5}}>
                <Text style={styles.title}>Contact Details</Text>
                  <Text style={styles.rowLable}>Address</Text>
                  <Text
                    style={styles.rowValue}
                  >
                    {user?.address}
                  </Text>
              </View>
            </View>
          ) : (
            <View
              style={{
                paddingVertical: SIZES.basePadding,
                paddingBottom: SIZES.basePadding * 3,
              }}
            >
              <View style={[styles.row, { paddingBottom: SIZES.basePadding }]}>
                <Text style={[styles.title, { paddingTop: 0 }]}>
                  Certificate
                </Text>
                <View style={[styles.row]}>
                  <View style={{ paddingTop: SIZES.base - 5 }}>
                    <Image
                      source={icons.verifiedIcon}
                      style={{
                        width: SIZES.basePadding,
                        height: SIZES.basePadding,
                      }}
                    />
                  </View>
                  <Text
                    style={[styles.rowValue, { paddingHorizontal: SIZES.base }]}
                  >
                    Verified
                  </Text>
                </View>
              </View>

              <Image
                source={
                  certificateImage
                    ? { uri: certificateImage }
                    : images.certificateImage
                }
                style={{ height: 200, width: "100%", borderRadius: SIZES.base }}
              />
              <View style={{ paddingVertical: 20 }}>
                <TouchableOpacity
                  style={{ ...BUTTON.primary }}
                  onPress={() => {
                    navigation.navigate(ScreenName.ADDCERTIFICATE, {
                      userInformation: user,
                    });
                  }}
                >
                  <Text style={{ ...BUTTONTEXT.primary }}>
                    Add new Certificate
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          {totalReview.length !== 0 ? (
            <>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.title}>Reviews ({reviewCount}) </Text>
                <TouchableOpacity
                  style={{ paddingBottom: SIZES.base * 1.5 }}
                  onPress={() =>
                    navigation.navigate("TotalReview", { userId: userId })
                  }
                >
                  {totalReview.length > 3 && (
                    <Text
                      style={{
                        ...FONTS.smallBold,
                        paddingTop: SIZES.basePadding * 1.7,
                      }}
                    >
                      View All
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
              <Reviews data={totalReview.slice(0, 3)} />
            </>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  label: {
    color: COLORS.black40,
    ...FONTS.small,
  },
  value: {
    ...FONTS.body2Medium,
  },
  title: {
    ...FONTS.body2Bold,
    paddingBottom: SIZES.base * 1.5,
    paddingTop: SIZES.base * 3,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rowLable: {
    color: COLORS.black40,
    ...FONTS.body1Medium,
  },
  rowValue: {
    ...FONTS.body1Medium,
  },
  button: {
    paddingHorizontal: SIZES.base / 2,
    width: "50%",
    paddingVertical: SIZES.base * 1.2,
    borderRadius: SIZES.base,
  },
  buttonText: {
    textAlign: "center",
    ...FONTS.body2Medium,
  },
  profileImage: {
    height: 80,
    width: 80,
    overflow: "hidden",
    borderRadius: 100,
  },
});
