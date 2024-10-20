import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CameraView, Camera, CameraType } from 'expo-camera';

const Index: React.FC = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [translation, setTranslation] = useState<string>('');
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleTranslate = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      // Send the photo to a translation API
      // For this example, we'll just set a mock translation
      setTranslation('बधाई हो 😊');
    }
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleTranslate}>
            <Text style={styles.text}>Translate</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
      <View style={styles.translationContainer}>
        <Text style={styles.translationTitle}>Translation:</Text>
        <Text style={styles.translationText}>{translation}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 5,
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
  translationContainer: {
    padding: 20,
    backgroundColor: 'black',
  },
  translationTitle: {
    fontSize: 18,
    color: 'white',
    marginBottom: 10,
  },
  translationText: {
    fontSize: 24,
    color: 'white',
  },
});

export default Index;