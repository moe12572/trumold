import {
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  StatusBar,
  Alert,
} from "react-native";
import React,{useEffect,useState} from "react";
import {  API, graphqlOperation } from "aws-amplify";

import { PageHeader, CategoryCard, Loader } from "../../../components";
import { SIZES, COLORS } from "../../../constants";
import { getUserSelectedRole } from "../../../utils/services/StorageService";
import { UserRole } from "../../../models";
import ScreenName from "../../../utils/ScreenName";
import { listUsers } from "../../../graphql/queries";
import { getDataWithImage } from "../../../utils";
import EmptyState from "../../../components/empty-state";

export default function CategorySingle(props) {
  let routeInfo = props.route.params.category;
  const [screen,setScreen] = useState(ScreenName.HOMECOACH)
  const [categoryDetails, setCategoryDetails] = useState([]);
  const [isLoader, setIsLoader] = useState("");

  useEffect(()=>{
    getRole();
  },[])

  useEffect(()=>{
    getCategoryDetails();
  },[routeInfo.id])

  const getRole=async()=>{
    let role = await getUserSelectedRole();
    if(role==UserRole.MEMBER){
      setScreen(ScreenName.MEMBERHOME)
    }
  }
 const getCategoryDetails = async () => {
    let CatId =routeInfo.id;
    try {
      setIsLoader(true)
     let users = await API.graphql(
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
      if (Object.keys(users).length !== 0) {
        let items = users.data.listUsers.items;
        items = await getDataWithImage(items);
        if(items && items.length!==0){
          let _categoryId =[];
          items.map((item)=>{
            if(item.category){
              let _catArray= item.category.split(",");
              let index = _catArray.findIndex((e)=>e===CatId);
              if(index!==-1){
                _categoryId.push(item)
              }
            }
          })
          setTimeout(()=>{
            setCategoryDetails(_categoryId)
            setIsLoader(false)
          },3000)
        }
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
        <StatusBar backgroundColor={COLORS.dark} />
        <View style={{ paddingHorizontal: SIZES.basePadding }}>
        {isLoader === true ? <Loader/> : null}  
          <PageHeader
            title={routeInfo?.title}
            navigation={props.navigation}
            backLink={screen}
          />
          {!isLoader && categoryDetails.length === 0 ? (
          <View
            style={{
              paddingHorizontal: SIZES.basePadding,
              alignSelf: "center",
            }}
          >
          <EmptyState content={`Oops! don't find any ${routeInfo.title} expertise`} />
          </View>
        ) : (
          <CategoryCard data={categoryDetails} navigation={props.navigation}/>
        )}
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
});
