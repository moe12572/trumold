import { View, SafeAreaView, StatusBar, StyleSheet } from "react-native";
import React from "react";
import { SuccessComponent } from "../../../components";
import { COLORS } from "../../../constants";

export default function Success({navigation,route}) {
  const { params,title,content } = route;
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.dark} />
      <View style={{ justifyContent: "center", flex: 1 }}>
        <SuccessComponent
          title={title?title:"Account has been created successfully"}
          button={true}
          buttonLink={params.screen}
          navigation={navigation}
        />
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
