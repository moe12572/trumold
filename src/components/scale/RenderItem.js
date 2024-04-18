import { View, Image} from "react-native";
import React, { memo } from "react";
import { images, SIZES } from "../../constants";

const RenderItem = () => {
  return (
    <View style={{ marginHorizontal: 5 }}>       
      <Image
        source={images.scaleImage}
        style={{ width: SIZES.width, resizeMode: "contain" }}
      />
    </View>
  );
};
export default memo(RenderItem);
