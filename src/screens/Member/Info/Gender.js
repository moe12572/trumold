import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  StatusBar,
  Image,
  FlatList,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { SIZES, FONTS, COLORS, icons } from "../../../constants";
import { Footer, Header,Loader } from "../../../components";
import { useEffect } from "react";
import { API, DataStore, graphqlOperation } from "aws-amplify";
import { User } from "../../../models";
import ScreenName from "../../../utils/ScreenName";
import { updateUser } from "../../../graphql/mutations";
const gendersType = [
  {
    label: "Male",
    icon: icons.maleIcon,
    selectedIcon: icons.maleIconWhite,
  },
  {
    label: "Female",
    icon: icons.femaleIcon,
    selectedIcon: icons.femaleIconWhite,
  },
  {
    label: "Transgender",
    icon: icons.transgenderIcon,
    selectedIcon: icons.transgenderIconWhite,
  },
  {
    label: "Gender Neutral",
    icon: icons.genderNeutralIcon,
    selectedIcon: icons.genderNeutralIconWhite,
  },
  {
    label: "Non-Binary",
    icon: icons.nonBinaryIcon,
    selectedIcon: icons.nonBinaryIconWhite,
  },
  {
    label: "Not mentioned",
    icon: icons.notMentionedIcon,
    selectedIcon: icons.notMentionedIconWhite,
  },
  {
    label: "Prefer Not to Say",
  },
];
const Item = ({
  onPress,
  backgroundColor,
  textColor,
  item,
  tintColor,
  borderColor,
}) => (
  <TouchableOpacity
    activeOpacity={1}
    onPress={onPress}
    style={[
      styles.box,
      item.icon ? null : styles.boxSmall,
      backgroundColor,
      borderColor,
    ]}
  >
    {item.icon && (
      <Image
        source={item.icon}
        style={[{ height: 48, width: 48, resizeMode: "contain" }, tintColor]}
      />
    )}
    <Text style={[styles.title, textColor]}>{item.label}</Text>
  </TouchableOpacity>
);

const Gender = ({ navigation, route }) => {
  
  const { params } = route;
  const [selected, setSelected] = useState(null);
  const [isLoader,setIsLoader] = useState(false)
  useEffect(()=>{
    if(params && params!==null && params.userInformation){
      setSelected(params.userInformation?.gender)
    }
  },[])    

  
  const saveUserInformation = async () => {
    try {
      if (selected && selected !== null) {
        if (params && params!==null && params.userInformation) {
          setIsLoader(true)
          let payload ={
            id:params.userInformation.id,
            gender:selected
          }
          let response = await API.graphql(graphqlOperation(updateUser,{input:payload}));
          setIsLoader(false)
          navigation.navigate(ScreenName.WEIGHT, { userInformation: response.data.updateUser });
        }
      } else {
        Alert.alert("The Gender field is required");
      }
    } catch (error) {
      setIsLoader(false)
      if (error.message) {
        Alert.alert(error.message);
      }
    }
  };

  const renderItem = ({ item }) => {
    const backgroundColor =
      item.label === selected ? COLORS.primary : COLORS.white;
    const color = item.label === selected ? COLORS.white : COLORS.dark;
    const tintColor = item.label === selected ? COLORS.white : COLORS.primary;
    const borderColor = item.label === selected ? COLORS.primary : COLORS.grey;
    return (
      <Item
        item={item}
        onPress={() => setSelected(item.label)}
        backgroundColor={{ backgroundColor }}
        borderColor={{ borderColor }}
        textColor={{ color }}
        tintColor={{ tintColor }}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.dark} />
      <ScrollView style={styles.container}>
      {isLoader ?<Loader/>:null}
        <View style={styles.spacing}>
          <Header
            heading="Which gender do you identify?"
            subHeading="Step 1/6"
            headingInverse={true}
            navigation={navigation}
          />

          <FlatList
            data={gendersType}
            numColumns={2}
            renderItem={renderItem}
            keyExtractor={(item) => item.label}
            extraData={selected}
            contentContainerStyle={styles.boxContainer}
          />

          <Footer
            backScreen="Information"
            nextScreen="Weight"
            navigation={navigation}
            onPress={saveUserInformation}
          />
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
  spacing: {
    paddingBottom: Platform.OS == "android" ? SIZES.basePadding * 2 : 0,
    paddingHorizontal: SIZES.basePadding,
  },
  boxContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  box: {
    borderWidth: 1,
    height: 128,
    width: SIZES.width / 2 - SIZES.basePadding * 2,
    marginVertical: SIZES.base * 1.5,
    borderRadius: SIZES.base,
    justifyContent: "space-around",
    padding: SIZES.basePadding,
    marginHorizontal: SIZES.base,
  },
  boxSmall: {
    height: 64,
    width: SIZES.width - SIZES.basePadding * 3,
  },
  title: {
    color: COLORS.dark,
    ...FONTS.body2Bold,
  },
});

export default Gender;
