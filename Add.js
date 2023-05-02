import { Camera, CameraType } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View ,Image} from 'react-native';
import * as ImagePicker from 'expo-image-picker';


export default function Add({navigation}) {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
const[camera,setCamera]=useState(null)
const[image,setImage]=useState(null)



const takePicture=async()=>{
 
if(camera){
  const data=await camera.takePictureAsync(null)
  setImage(data.uri)
}

}



const pickImage = async () => {
  // No permissions request is necessary for launching the image library
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  });

  console.log(result);

  if (!result.canceled) {
    setImage(result.assets[0].uri);
  }
};






  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraType() {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }

  return (
   <View style={styles.container}>
        <View   style={styles.cameraContainer}>
    <Camera
    ref={ref=>setCamera(ref)}
    style={styles.fixedRatio}
    type={type}
    ratio={"1:1"}
    
    />
    </View>
        
          <Button  onPress={toggleCameraType}
          title='Flip Image'
           
          />
            <Button title='Take Picture' onPress={()=>{takePicture( )}}/>
          <Button title='Pick Image From Gallery' onPress={()=>{pickImage()}}/>
          <Button title='Save' onPress={()=>{navigation.navigate("Save",{image})}}/>
        
        {image && <Image source={{uri:image}} style={{flex:1}}/>}
   </View>

  
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
   
  },

  cameraContainer:{
flex:1,
flexDirection:"row"
  },
  fixedRatio:{
    flex:1,
    aspectRatio:1
  },



});
