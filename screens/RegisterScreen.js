import React from 'react';
import { StyleSheet, View, } from 'react-native';
import { KeyboardAvoidingView } from "react-native";
import { StatusBar } from 'expo-status-bar';
import { useState, useLayoutEffect } from "react";
import { Button, Input, Text } from "react-native-elements";
import { auth } from "../firebase"
import { ScrollView } from 'react-native-gesture-handler';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitle: "Back to Login"
    });
  }, [navigation])

  const register = () => {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then(authUser => {
        authUser.user.updateProfile({
          displayName: name,
          photoURL:
            imageUrl ||
            "https://img.cdn.nimg.jp/s/nicovideo/thumbnails/38884259/38884259.13933936.original/r1280x720l?key=735001c3a0e75cc6d7f431f7fe04cf1f2dcd63d2f2443c4e98124114a2a855f1",
        })
      })
      .catch((error) => alert(error.message));
  };

  return (
    <ScrollView style={{ backgroundColor: "white" }}>
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <StatusBar style="light" />

        <Text h3 style={{ marginBottom: 50 }}>
          Create a Whispel Account
        </Text>

        <View style={styles.inputContainer}>
          <Input
            placeholder="Full Name"
            autoFocus
            type="text"
            value={name}
            onChangeText={(text) => setName(text)}
          />
          <Input
            placeholder="email"
            type="text"
            autocapitalize="off"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <Input
            autocapitalize="off"
            placeholder="Password"
            secureTextEntry
            type="text"
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <Input
            placeholder="Profile Picture (optional)"
            type="text"
            value={imageUrl}
            onChangeText={(text) => setImageUrl(text)}
            onSubmitEditing={register}
          />
        </View>

        <Button
          containerStyle={styles.button}
          raised onPress={register} title="Register" />
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

export default RegisterScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "white",
  },
  button: {
    width: 200,
    marginTop: 10,
  },
  inputContainer: {
    width: 300,
  },
})
