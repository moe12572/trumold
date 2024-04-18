import { View, SafeAreaView, StatusBar, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { SuccessComponent } from "../../../components";
import { COLORS } from "../../../constants";
import { getUserSelectedRole } from "../../../utils/services/StorageService";
import ScreenName from "../../../utils/ScreenName";
import { UserRole } from "../../../models";

export default function CancelledSucess({navigation}) {
  const [screen,setScreen] = useState(ScreenName.HOMECOACH)
  useEffect(()=>{
    getRole();
  },[])
  const getRole=async()=>{
    let role = await getUserSelectedRole();
    if(role==UserRole.MEMBER){
      setScreen(ScreenName.MEMBERHOME)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.dark} />
      <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
        <SuccessComponent
          title="Session Cancelled Sucessfully!"
          button={true}
          buttonLink={screen}
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
