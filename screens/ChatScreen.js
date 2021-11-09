import React, { useLayoutEffect, useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, Platform, TextInput, Keyboard } from 'react-native';
import { Avatar, Input } from "react-native-elements";
// 注意！したのAvatarではなくelementsからのインポート
// import Avatar from 'react-avatar';
import { ScrollView, TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
// import * as firebase from "firebase";
// 上はV8だから↓のように
import firebase from 'firebase/compat/app';
import { db, auth } from "../firebase";

const ChatScreen = ({ navigation, route }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Chat",
      headerBackTitleVisible: false,
      headerTitleAlign: "left",
      headerTitle: () => (
        < View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Avatar
            rounded
            source={{
              uri: messages[0]?.data.photoURL,
              // ||"https://cdn-icons-png.flaticon.com/512/134/134914.png",
            }}
          />
          <Text style={{ color: "white", marginLeft: 10, fontWeight: "700" }}>
            {route.params.chatName}
          </Text>
        </View >
      ),
      headerLeft: () => (
        <TouchableOpacity
          style={{ marginLeft: 10 }}
          onPress={navigation.goBack}
        >
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: 80,
            marginRight: 20,
          }}
        >
          <TouchableOpacity>
            <FontAwesome name="video-camera" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="call" size={24} color="white" />
          </TouchableOpacity>
        </View>
      )
    });
  }, [navigation, messages]);

  const sendMessage = () => {
    // 送信後キーボードを下げる
    Keyboard.dismiss();

    db.collection("chats").doc(route.params.id).collection("messages").add({
      // ↓エラー発生、おそらくFirebaseのバージョンの問題（Version9）
      // FirebaseError: Function addDoc() called with invalid data. Unsupported field value: a custom n object (found in field timestamp in document chats/NOmgUEPdqW4j983YYi9B/messages/Owm25ZgL55pKrkSURc2c)
      // timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      timestamp: new Date().toLocaleString(),
      // ↑代替で現在時間をそのままPush、海外のユーザーが使用する場合問題あり、、、
      message: input,
      displayName: auth.currentUser.displayName,
      email: auth.currentUser.email,
      photoURL: auth.currentUser.photoURL,
    });

    setInput('');
  };

  useLayoutEffect(() => {
    const unsubscribe = db
      .collection('chats')
      .doc(route.params.id)
      .collection('messages')
      //CustomListItem.jsではDESCであることに注意↓並べ替え、Firebaseで認識される順序と表示純度が逆
      .orderBy('timestamp', 'asc')
      .onSnapshot(snapshot => setMessages(
        snapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data(),
        }))
      ));

    return unsubscribe;
  }, [route])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar style="light" />
      {/* メッセージ入力のときのキーボードで隠れないようにする↓KeywordAvoidingView */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={90}
      >

        {/* 実機だとTextInputが上に上がるためTouchあｂぇWithoutFeedbackは使用しない↓ 12ProMaxだと動くとの情報あり */}
        {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss} > */}
        <>
          <ScrollView contentContainerStyle={{ paddingTop: 15 }}>
            {/* chatHere */}
            {messages.map(({ id, data }) => (
              data.email === auth.currentUser.email ? (
                <View key={id} style={styles.reciever}>
                  <Avatar
                    //iOS
                    position="absolute"
                    rounded
                    //Web
                    containerStyle={{
                      position: "absolute",
                      bottom: -15,
                      right: -5,
                    }}
                    bottom={-15}
                    right={-5}
                    size={30}
                    source={{
                      uri: data.photoURL,
                    }}
                  />
                  <Text style={styles.recieverText}>{data.message}</Text>
                </View>
              ) : (
                <View
                  //↓だとエラー発生Uncaught Error in snapshot listener:, [FirebaseError: Quota exceeded.]
                  //key={id}
                  style={styles.sender}>
                  <Avatar
                    //iOS
                    position="absolute"
                    rounded
                    //Web
                    containerStyle={{
                      position: "absolute",
                      bottom: -15,
                      right: -5,
                    }}
                    bottom={-15}
                    right={-5}
                    size={30}
                    source={{
                      uri: data.photoURL,
                    }}
                  />
                  <Text style={styles.senderText}>{data.message}</Text>
                  <Text style={styles.senderName}>{data.displayName}</Text>
                </View>
              )
            ))}
          </ScrollView>
          <View style={styles.footer}>
            {/* よくあるエラー（ちなみにInputタグでも起きる）、ValueとonChangeがセットがないとタイプできない、詳細は下のリンク
            https://thewebdev.info/2021/05/10/how-to-fix-the-issue-where-we-cant-type-in-a-react-input-text-field/ */}
            <TextInput
              value={input}
              onChangeText={(text) => setInput(text)}
              onSubmitEditing={sendMessage}
              placeholder="Whispel Message"
              style={styles.textInput}
            />

            <TouchableOpacity onPress={sendMessage} activeOpacity={0.5}>
              <Ionicons name="send" size={24} colo="#2B68E6" />
            </TouchableOpacity>
          </View>
        </>
        {/* </TouchableWithoutFeedback> */}
      </KeyboardAvoidingView>
      {/* <Text>{route.params.chatName}</Text> */}
    </SafeAreaView>
  );
};

export default ChatScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  reciever: {
    padding: 15,
    backgroundColor: "#ECECEC",
    alignSelf: "flex-end",
    borderRadius: 20,
    marginRight: 15,
    marginBottom: 20,
    maxWidth: "80%",
    position: "relative",
  },
  sender: {
    padding: 15,
    //backgroundColor: "#d2691e",
    backgroundColor: "#fa8072",
    alignSelf: "flex-start",
    borderRadius: 20,
    margin: 15,
    maxWidth: "80%",
    position: "relative",
  },
  // senderText: {
  //   color: "white",
  //   fontWeight: "500",
  //   marginLeft: 10,
  //   marginBottom: 15,
  // },
  // recieverText: {
  //   color: "black",
  //   fontWeight: "500",
  //   marginRight: 10,
  // },
  senderName: {
    left: 10,
    paddingRight: 10,
    fontSize: 10,
    color: "white",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 15,
  },
  textInput: {
    bottom: 0,
    height: 40,
    flex: 1,
    marginRight: 15,
    borderColor: "#ECECEC",
    padding: 10,
    color: "gray",
    borderRadius: 30,
  },
})
