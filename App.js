import React, { Component } from "react";
import { View, Text, Image, ScrollView, FlatList } from "react-native";
import UserListView from "./component/userlist";
import UserChatView from "./component/userchat";
import LoginView from "./component/login";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default class App extends Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (<NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          Key={1}
          name="Login"
          component={LoginView} />
        <Stack.Screen
          Key={2}
          name="List"
          component={UserListView} />
        <Stack.Screen
          Key={3}
          name="Chat"
          component={UserChatView} />
        </Stack.Navigator>
    </NavigationContainer>);
    // return (<UserListView />);
  }
}

// export default App;