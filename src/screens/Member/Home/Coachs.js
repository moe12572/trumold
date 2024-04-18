import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Alert
} from "react-native";
import React, { useEffect,useState } from "react";
import { images, FONTS, icons, SIZES, COLORS } from "../../../constants";
import { Loader, PageHeader, SectionHeader } from "../../../components";
import {API,graphqlOperation} from 'aws-amplify'
import { getDataWithImage } from "../../../utils";
import { listUsers } from "../../../graphql/queries";
import { UserRole } from "../../../models";
import { getUserSelectedRole } from "../../../utils/services/StorageService";
import ScreenName from "../../../utils/ScreenName";
export default function Coachs({ navigation }) {
  const [topCoachs, setTopCoachs] = useState([]);
  const [isLoader,setIsLoader] = useState(false)
  const coachs = [
    {
      id: "coach_1",
      name: "Marco Wagner",
      rating: "5.0",
      distance: "1 km",
      image: images.userDummyImage,
    },
    {
      id: "coach_2",
      name: "Kylee Danford",
      rating: "4.5",
      distance: "1 km",
      image: images.userDummyImage,
    },
    {
      id: "coach_3",
      name: "Aileen Fullbright",
      rating: "4.9",
      distance: "1 km",
      image: images.userDummyImage,
    },
    {
      id: "coach_4",
      name: "Robin Backenbauer",
      rating: "5.0",
      distance: "1 km",
      image: images.userDummyImage,
    },
    {
      id: "coach_5",
      name: "Brittni Lando",
      rating: "4.0",
      distance: "1 km",
      image: images.userDummyImage,
    },
  ];
  
  useEffect(()=>{
    getTopCoachs();
    getRole();
  },[])

  const [screen,setScreen] = useState(ScreenName.HOMECOACH)
  const getRole=async()=>{
    let role = await getUserSelectedRole();
    if(role==UserRole.MEMBER){
      setScreen(ScreenName.MEMBERHOME)
    }
  }
  
  const getTopCoachs = async () => {
    setIsLoader(true)
    try {
      let coachs = await API.graphql(
        graphqlOperation(listUsers, {
          filter: {
            role: {
              eq: UserRole.COACH,
            },
            isPaymentVerified: {
              eq: true
            },
            isVerified: {
              eq: true
            }  
          },
        })
      );
      if (Object.keys(coachs).length !== 0) {
        let items = coachs.data.listUsers.items;
        items = await getDataWithImage(items);
        setTopCoachs(items);
      }
      setIsLoader(false)
    } catch (error) {
      setIsLoader(false)
      if (error.message) {
        Alert.alert(error.message);
      }
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <StatusBar backgroundColor={COLORS.dark} />
        <View style={{ flexDirection: "row", marginTop: 10, marginBottom:10}}>
                <TouchableOpacity style={styles.spacing} onPress={() => navigation.goBack()}>
                   <Image
                            source={icons.backIcon}
                            style={{
                              height: 30,
                              width: 30,
                              marginLeft: -8,
                              marginRight: "20%"
                            }}
                        />
                </TouchableOpacity>
                <Text style={{...FONTS.body2Bold, textAlign: "center", marginTop: 5}}>
                           Top Rated Coaches
                  </Text>
                </View>
        {isLoader?<Loader/>:null}
        <View style={{ paddingHorizontal: SIZES.basePadding }}>
          {topCoachs && topCoachs.map((coach,index) => {
             let rating = coach.totalRating;
             let review = coach.totalReview;
             let totalRating = (rating/review).toFixed(1) 
            return (
              <TouchableOpacity
                key={index}
                style={styles.cardWrap}
                onPress={() => navigation.navigate("CoachProfile",{coach} )}
                activeOpacity={0.7}
              >
                <Image
                  source={coach?.image?{uri:coach?.image}:images.userDummyImage}
                  style={styles.profileImage}
                />
                <View style={{ marginLeft: SIZES.base * 3 }}>
                  <Text style={{ ...FONTS.body2Bold }}>{coach?.name}</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      paddingTop: SIZES.base,
                    }}
                  >
                    <View style={styles.col}>
                      <Image source={icons.starIcon} style={styles.icon} />
                      {coach.totalRating && coach.totalReview !== null ?
                      <Text style={{ ...FONTS.body2Medium, }}>
                       {totalRating}
                      </Text>
                      :
                      <Text style={{ ...FONTS.body2Medium }}>
                      0
                     </Text>
                     }
                    </View>
                    <View style={styles.col}>
                      <Image
                        source={icons.locationPinIcon}
                        style={styles.icon}
                      />
                      <Text style={{ ...FONTS.body2Medium }}>
                        1km
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
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
  cardWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SIZES.base * 3,
  },
  col: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: SIZES.basePadding,
  },
  icon: {
    height: 16,
    width: 16,
    resizeMode: "contain",
    marginRight: SIZES.base / 2,
  },
  profileImage: {
    height: 60,
    width: 60,
    overflow:'hidden',
    borderRadius:100
  },
  spacing: {
    paddingHorizontal: SIZES.basePadding,
    marginTop: 5
},
});
