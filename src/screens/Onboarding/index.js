import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
} from "react-native";
import { API, Auth, graphqlOperation } from "aws-amplify";
import {
  BUTTON,
  BUTTONTEXT,
  images,
  SIZES,
  FONTS,
  COLORS,
} from "../../constants";
import ScreenName from "../../utils/ScreenName";
import {
  getCurrentUserInfo,
  getUserSelectedRole,
} from "../../utils/services/StorageService";
import { UserRole, UserStatus } from "../../models";
import { Loader } from "../../components";
import { getUser } from "../../graphql/queries";

const DATA = [
  {
    id: "bd7acbea-c1b1-46c2-aed5-as",
    index: 1,
    image: images.onbording1,
    title: "Find Your Trainer, Schedule a Session",
    buttonText: "Next",
    description:
      "Discover certified trainers near you and book your sessions effortlessly.",
  },
  {
    id: "bd7acbea-c1b1-46c2-aed5-rd",
    image: images.onbording2,
    index: 2,
    title: "Meet your coach, start your journey",
    buttonText: "Next",
    description:
      "Embark on your fitness journey with expert guidance and support.",
  },
  {
    id: "bd7acbea-c1b1-46c2-aed5-gs",
    index: 3,
    image: images.onbording3,
    title: "Achieve Your Goals",
    buttonText: "Get Started",
    description:
      "Turn your dreams into reality with our goal-driven app.",
  },
];

const Onboarding = ({ navigation }) => {
  const [completed, setCompleted] = React.useState(false);
  const scrollX = new Animated.Value(0);
  const [userToken, setUserToken] = useState({});
  const [userInfo, setUserInfo] = useState({});
  const [isLoader, setIsLoader] = useState(false);

  React.useEffect(() => {
    scrollX.addListener(({ value }) => {
      if (Math.floor(value / SIZES.width) === DATA.length - 1) {
        setCompleted(true);
      }
    });
    return () => scrollX.removeListener();
  }, []);
  useEffect(() => {
    currentLoginUser();
  }, []);

  const currentLoginUser = async () => {
    try {
      let token = await Auth.currentAuthenticatedUser();
      let user = await getCurrentUserInfo();
      let screen = '';
      if(user && token){
        if (user && user.status === UserStatus.ACTIVE) {
          screen= (user.role === UserRole.MEMBER?ScreenName.MEMBERHOME:ScreenName.COACHHOME)
        }else{
          screen= (user.role === UserRole.MEMBER?ScreenName.INFORMATION:'Info')
        }
       setTimeout(()=>{
        navigation.reset({
          index: 0,
          routes: [{ name: screen, userInformation: user }],
        });
       },400)
      }else{
        setUserInfo(user);
        setUserToken(token);
      }
    } catch (err) {
      return err;
    }
  };

  const nextSlide = async (item) => {
    if (item.index === 3) {
      if (userToken?.signInUserSession) {
        getUserStatus();
      } else {
        navigation.replace("Welcome");
      }
    } else {
      scroll.scrollTo({ x: item.index * SIZES.width, y: 0, animated: true });
    }
    // item.index === 3
    //   ? navigation.replace("Welcome")
    //   : scroll.scrollTo({ x: item.index * SIZES.width, y: 0, animated: true });r
  };

  const getUserStatus = async () => {
    try {
      setIsLoader(true);
      const _userInfo = await Auth.currentAuthenticatedUser({
        bypassCache: true,
      });
      let existUser = await API.graphql(
        graphqlOperation(getUser, { id: _userInfo.attributes.sub })
      );
      let role = await getUserSelectedRole();
      setIsLoader(false);
      let data = existUser.data.getUser;
      let screen =
        role == UserRole.MEMBER ? ScreenName.INFORMATION : ScreenName.COACHINFO;
      let item = null;
      if (data !== null && Object.keys(data).length !== 0) {
        item = data;
        if (
          data.status == UserStatus.ACTIVE &&
          data.role == UserRole.COACH &&
          data.isVerified == false
        ) {
          screen = ScreenName.COACHVERIFICATION;
        } else {
          if (data.status == UserStatus.ACTIVE) {
            screen = ScreenName.COACHHOME;
            if (item.role == UserRole.MEMBER) {
              screen = ScreenName.MEMBERHOME;
            }
          }
        }
      }
      navigation.reset({
        index: 0,
        routes: [{ name: screen, userInformation: item }],
      });
    } catch (error) {
      setIsLoader(false);
    }
  };

  function renderContent() {
    return (
      <Animated.ScrollView
        horizontal
        pagingEnabled
        scrollEnabled
        decelerationRate={0}
        scrollEventThrottle={12}
        snapToAlignment="center"
        showsHorizontalScrollIndicator={false}
        ref={(c) => {
          scroll = c;
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
      >
        {DATA.map((item) => {
          return (
            <View
              key={item.id}
              style={{
                width: SIZES.width,
                height: SIZES.height,
              }}
            >
              <Image
                source={item.image}
                style={{
                  width: "100%",
                  height: "65%",
                  resizeMode: "cover",
                }}
              />
              <View style={styles.contentWrap}>
                <Text
                  style={{
                    ...FONTS.h1,
                    color: COLORS.white,
                    textAlign: "center",
                  }}
                >
                  {item.title}
                </Text>
                <Text
                  style={{
                    ...FONTS.body2,
                    color: COLORS.black60,
                    marginTop: SIZES.base,
                    marginBottom: SIZES.basePadding * 2,
                    textAlign: "center",
                  }}
                >
                  {item.description}
                </Text>
                <TouchableOpacity
                  style={{ ...BUTTON.primary }}
                  onPress={() => {
                    nextSlide(item);
                  }}
                >
                  <Text style={{ ...BUTTONTEXT.primary }}>
                    {item.buttonText}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </Animated.ScrollView>
    );
  }
  function renderDots() {
    const dotPosition = Animated.divide(scrollX, SIZES.width);
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          position: "absolute",
          bottom: 300,
          width: "100%",
          left: 0,
        }}
      >
        {DATA.map((item, index) => {
          const color = dotPosition.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [COLORS.black60, COLORS.primary, COLORS.black60],
            extrapolate: "clamp",
          });
          const width = dotPosition.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [10, 30, 10],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              key={`dot-${index}`}
              style={[styles.dot, { backgroundColor: color, width: width }]}
            />
          );
        })}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isLoader ? <Loader /> : null}
      {renderDots()}
      {renderContent()}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1F1918",
  },
  fullHeight: {
    height: SIZES.height,
    justifyContent: "space-between",
    paddingBottom: SIZES.base * 8,
    position: "relative",
  },
  contentWrap: {
    alignSelf: "center",
    paddingHorizontal: SIZES.base * 3,
    position: "absolute",
    bottom: SIZES.base * 6,
  },
  font: {
    fontFamily: "Medium",
    fontSize: 24,
    color: "#fff",
  },
  dot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
    marginHorizontal: SIZES.base,
  },
});

export default Onboarding;
