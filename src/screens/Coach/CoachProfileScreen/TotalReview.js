import { View, Text, SafeAreaView, ScrollView, StyleSheet, Alert } from "react-native";
import React from "react";
import { useEffect, useState } from "react";
import { graphqlOperation, API } from "aws-amplify";
import { Loader, PageHeader } from "../../../components";
import { listRatings } from "../../../graphql/queries";
import { getDataWithImage } from "../../../utils";
import Reviews from "../../../components/reviews";
import { SIZES } from "../../../constants";

export default function TotalReview ({navigation,route}) {
const { params } = route;
const {userId} = params;
const [totalReview, setTotalReview] = useState([]);
const [isLoader, setIsLoader] = useState("");

useEffect(() =>{
 getReviews();
},[])
  const getReviews = async () => {
    setIsLoader(true)
    try {
      let myReviews = await API.graphql(
        graphqlOperation(listRatings, {
          filter: {
            ratingCoachId: {
              eq: userId,
            },
          },
        })
      );
      if (Object.keys(myReviews).length !== 0) {
        let items = myReviews.data.listRatings.items;
        items = await getDataWithImage(items);
        setTotalReview(items);
        setIsLoader(false)
      }
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
      <View style={{ paddingHorizontal: SIZES.basePadding }}>
      {isLoader ? <Loader/> : null }
      <PageHeader
            title="Reviews"
            navigation={navigation}
            backLink="CoachProfile"
          />
        <Reviews data={totalReview} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },
})
