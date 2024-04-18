import React, { useState } from "react";
import { Image, View, StyleSheet, TouchableOpacity } from "react-native";
import * as Picker from "expo-image-picker";
import { images, icons } from "../../constants";
export default function ImagePicker(props) {
  const dummyImage = images.userDummyImage;
  const [image, setImage] = useState(null);
  const pickImage = async () => {
    let result = await Picker.launchImageLibraryAsync({
      mediaTypes: Picker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });    
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  
  return (
    <View style={styles.container}>
     
      {image  && <Image source={{ uri: image }} style={styles.image} />}
      {!image  && <Image source={dummyImage} style={styles.image} />}

      <TouchableOpacity
        activeOpacity={1}
        onPress={pickImage}
        style={styles.editBtn}
      >
        <Image
          source={icons.editIcon}
          style={{ height: 30, width: 30, resizeMode: "contain",}}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    position: "relative",
    height: 100,         
  },
  image: {
    height: 90,
    width: 90,
    borderRadius: 50,
    resizeMode: "cover",
    position: "absolute",
  },
  editBtn: {        
    height: 40,
    width: 40,    
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,    
    marginLeft: 70    
  },
});
