import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Button, Input, Image } from "react-native-elements";
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from "react";
//↓キーボードが出たときに隠れないように
import { KeyboardAvoidingView } from "react-native";
import { auth } from "../firebase";

const LoginScreen = ({ navigation }) => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      console.log(authUser)
      if (authUser) {
        navigation.replace("Home");
      }
    });

    return unsubscribe;
  }, [])

  const signIn = () => {
    auth
      .signInWithEmailAndPassword(email, password)
      .catch(error => alert(error));
  }

  return (
    //↓実機では白だがSimulatorでは灰色になる
    <ScrollView style={{ backgroundColor: "white", flex: 1 }}>
      <KeyboardAvoidingView behavior='padding' style={styles.container}>

        <StatusBar style="light" />

        <Image
          style={styles.logo}
          source={{
            uri: "https://64.media.tumblr.com/c9bc64aae77cbb62b4ac5b0a4f60b299/ed3095de260f957f-8a/s1280x1920/55bbbe4e0dc3dc872bfe0fb2d9c0e80f58efd8c2.jpg",
          }}
          style={{ width: 200, height: 200 }}
        />

        <View style={styles.inputContainer}>
          <Input
            //iOSだと自動で大文字になってえしまうのをキャンセル
            autocapitalize="off"
            placeholder="Email"
            autoFocus
            type="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <Input
            autocapitalize="off"
            placeholder="Password"
            secureTextEntry
            autoFocus
            type="Password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            // あとで一致させるために送る　
            onSubmitEditing={signIn}
          />
        </View>
        <Button containerStyle={styles.button} onPress={signIn} title="Login" />
        <Button
          onPress={() => navigation.navigate("Register")}
          containerStyle={styles.button}
          type="outline"
          title="Register" />

        <View style={{ height: 100 }} />

      </KeyboardAvoidingView >
    </ScrollView>
  );
};

export default LoginScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "white",
    marginBottom: 50
  },
  inputContainer: {
    marginTop: 50,
    width: 300,
  },
  button: {
    width: 200,
    marginTop: 10,
  },
  logo: {
    marginTop: 100,
  }
});

