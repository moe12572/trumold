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
import React from "react";
import { PageHeader } from "../../../components";
import {
  BUTTON,
  BUTTONTEXT,
  COLORS,
  FONTS,
  icons,
  images,
  SIZES,
} from "../../../constants";
import { useState, useEffect } from "react";
import { getUserSelectedRole } from "../../../utils/services/StorageService";
import { UserRole } from "../../../models";
import ScreenName from "../../../utils/ScreenName";
import { API, graphqlOperation } from "aws-amplify";
import {
  listBookSessions,
  listRatings,
  listCategories,
} from "../../../graphql/queries";
import Reviews from "../../../components/reviews";
import { getDataWithImage } from "../../../utils";
export default function CoachProfile({ navigation, route }) {
  const { params } = route;
  const { coach } = params;
  const [totalSession, setTotalSession] = useState("");
  const [totalReview, setTotalReview] = useState([]);
  const [reviewCount, setReviewCount] = useState([]);
  let rating = coach.totalRating;
  let review = coach.totalReview;
  let totalRating = (rating / review).toFixed(1);
  const Coach = {
    name: coach?.name ? coach?.name : "Marco Wagner",
    profile: "Cardio Trainer",
    image: coach?.image ? { uri: coach.image } : images.userDummyImage,
    banner: coach?.banner ? { uri: coach.banner } : images.userDummyImage,
    experience: coach?.experience ? coach?.experience : "0 Years",
    sessions: "1.08k",
    rating: totalRating,
    about: coach?.bio
      ? coach?.bio
      : "Tom Cruisher offers it’s members a one stop shop for everything fitness - all the things that matter: Personal Training, Group Training, Boxing training. Lorem ipsum dolor sit amet, er adipiscing it, sed dianummy nibh euismoding it.",
    city: coach?.address,
    coaching_certificate: coach?.coaching_certificate
      ? coach?.coaching_certificate
      : images.certificateImage,
  };
  const tab = {
    firstTab: "Details",
    secondTab: "Certificate",
  };
  const [tabName, setTabName] = useState(tab.firstTab);
  const [screen, setScreen] = useState(ScreenName.HOMECOACH);
  const [categories, setCategories] = useState("");

  useEffect(() => {
    getRole();
    getSession();
    getReviews();
  }, []);
  const getRole = async () => {
    let role = await getUserSelectedRole();
    if (role == UserRole.MEMBER) {
      setScreen(ScreenName.MEMBERHOME);
    }
  };

  const getSession = async () => {
    const categoryData = coach.category;
    getCategoryData(categoryData);
    const id = coach.id;
    try {
      let session = await API.graphql(
        graphqlOperation(listBookSessions, {
          filter: {
            status: {
              eq: "Confirmed",
            },
            coachID: {
              eq: id,
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

  const getReviews = async () => {
    const coachId = coach.id;
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <StatusBar backgroundColor={COLORS.dark} />
        <View style={{ paddingHorizontal: SIZES.basePadding }}>
          <PageHeader
            title="Coach Profile"
            navigation={navigation}
            backLink={screen}
          />
        </View>
        <View>
          <Image
            source={Coach.banner}
            style={{ height: 175, width: SIZES.width, resizeMode: "cover" }}
          />
          <View style={{ alignItems: "center", marginTop: -42 }}>
            <Image source={Coach.image} style={styles.profileImage} />
            <Text
              style={{
                ...FONTS.h2Medium,
                marginTop: SIZES.base,
                textAlign: "center",
              }}
            >
              {Coach.name}
            </Text>
            <Text
              style={{
                ...FONTS.body2,
                color: COLORS.black40,
                textAlign: "center",
              }}
            >
              {categories}
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
              <Text style={styles.value}>{Coach.experience}</Text>
            </View>
            <View>
              <Text style={[styles.label, { marginLeft: -8 }]}>Sessions</Text>
              <Text style={[styles.value, { textAlign: "center" }]}>
                {totalSession}
              </Text>
            </View>
            <View>
              <Text style={styles.label}>Rating</Text>
              {coach.totalRating && coach.totalReview !== null ? (
                <Text style={[styles.value, { textAlign: "center" }]}>
                  {Coach.rating}
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
                <Text style={{ ...FONTS.body1Medium }}>{Coach.about}</Text>
              </View>
              <View>
                <Text style={styles.title}>Contact Details</Text>
                  <Text style={styles.rowLable}>Address</Text>
                  <Text
                    style={[styles.rowValue, { marginBottom: 15 }]}
                  >
                    {Coach.city}
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
                  coach.coaching_certificate
                    ? { uri: coach.coaching_certificate }
                    : images.certificateImage
                }
                style={{ height: 200, width: "100%", borderRadius: SIZES.base }}
              />
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
                <Text
                  style={{
                    ...FONTS.body2Bold,
                    paddingBottom: SIZES.base * 1.5,
                  }}
                >
                  Reviews ({reviewCount}){" "}
                </Text>
                <TouchableOpacity
                  style={{ paddingBottom: SIZES.base }}
                  onPress={() =>
                    navigation.navigate("TotalReview", { userId: coach?.id })
                  }
                >
                  {totalReview.length > 3 && (
                    <Text
                      style={{ ...FONTS.smallBold, paddingTop: SIZES.base - 4 }}
                    >
                      View All
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
              <Reviews data={totalReview.slice(0, 3)} />
            </>
          ) : null}
          <View
            style={{
              position: "relative",
              bottom: 0,
              width: "107%",
              padding: SIZES.basePadding,
              backgroundColor: COLORS.white,
              borderTopColor: COLORS.grey,
              borderTopWidth: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              left: -12,
            }}
          >
            <View style={{ alignItems: "center", marginTop: 5 }}>
              <Text style={styles.rowLable}>Total</Text>
              <Text style={styles.rowValue}>
                ${coach.hourly_rate ? coach.hourly_rate : 0}
              </Text>
            </View>
            <TouchableOpacity
              style={{ ...BUTTON.primary, width: "80%" }}
              onPress={() =>
                navigation.navigate("CreateSession", {
                  coachDetail: coach
                })
              }
            >
              <Text style={{ ...BUTTONTEXT.primary }}>Book Session</Text>
            </TouchableOpacity>
          </View>
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
