import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CameraView, Camera, CameraType } from 'expo-camera';
import axios from 'axios';

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

  // code to test Python backend server
  const name = "Freddie Mercury"
  const [error, setError] = useState('');
  const API_URL = 'http://192.168.0.107:5000/api/process';
  const sendData = async () => {
    try {
      console.log('Sending request to:', API_URL);
      const response = await axios.post(API_URL, {
        name: name
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Response:', response.data);
      setTranslation(`${response.data.message}`); 
      setError('');
    } catch (error) {
      console.log('Error details:', error.response || error);
      setError(error.response?.data?.error || error.message);
    }
  };

  const handleTranslate = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      // Send the photo to a translation API
      // For this example, we'll just set a mock translation
      await sendData();
      // setTranslation(`${responseData}`);
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
            <Text style={styles.text}>🔄 Translate</Text>
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
    flex: 0.35,
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