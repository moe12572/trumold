import React, { useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";
import { Input, Loader, PageHeader } from "../../components";
import { AirbnbRating } from "react-native-ratings";
import { COLORS, SIZES, BUTTON, BUTTONTEXT } from "../../constants";
import { API, graphqlOperation } from "aws-amplify";
import { createRating, updateUser } from "../../graphql/mutations";

export default function Review({ navigation, route }) {
  const { params } = route;
  const { coachId, sessionId, userId, session } = params;
  const [comments, setComments] = useState("");
  const [star, setStar] = useState(3);
  const [isLoader, setIsLoader] = useState(false);
  const ratingCompleted = (rating) => {
    setStar(rating);
  };
  const handleSubmit = async () => {
    setIsLoader(true)
    try {
      let payload = {
        ratingSession_idId: sessionId,
        ratingCoachId: coachId,
        ratingMemberId: userId,
        rating: star,
        description: comments
      };
      let response = await API.graphql(
        graphqlOperation(createRating, { input: payload })
      );
      let totalRating = session.coach.totalRating;
      let totalReview = session.coach.totalReview;
      let userRating ={
        totalRating: totalRating + star,
        totalReview: totalReview + 1,
        id: session.coach.id,
        _version: session.coach._version
      }
      let userUpdate = await API.graphql(graphqlOperation(updateUser,{input: userRating}))
      navigation.navigate("Home")
      setIsLoader(false)
    } catch (error){
      setIsLoader(false)
      if (error.message) {
        Alert.alert(error.message);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
        <PageHeader
          title="Rating & Review"
          navigation={navigation}
          backLink={"Session"}
        />
        {isLoader ? <Loader /> : null}
        <View style={{ paddingHorizontal: SIZES.basePadding }}>
          <AirbnbRating onFinishRating={ratingCompleted} />
          <View style={{ paddingVertical: SIZES.basePadding }}>
            <Input
              placeholder="Enter review"
              onChangeText={(e) => setComments(e)}
              value={ comments}
              name="comments"
              autoCapitalize="none"
              multiline={true}
            />
          </View>
          
          <TouchableOpacity
            style={{ ...BUTTON.primary, backgroundColor: COLORS.primary }}
            onPress={() => handleSubmit()}
          >
            <Text style={{ ...BUTTONTEXT.primary }}>Submit</Text>
          </TouchableOpacity>
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
