import React, { Component } from "react";
import { View, Text, Image, ScrollView, FlatList, TextInput, Button, TouchableOpacity, Alert } from "react-native";

import UserView from "./user";

import { users } from "../data/users";
import User from "../data/user";
import Environment from "../data/environment";

export default class LoginView extends Component {
    constructor(props) {
        super(props);
    }

    componentWillUnmount(){
        console.log("login", "unmount");
        if(User.ID) {
            this.logout(User.ID);
        }
    }

    logout(userid){
        fetch(`${Environment.server}/v1/user/logout/${userid}`)
            .then(o => {
                if(o.status !== 200) {
                    Alert.alert("force logout", "fail");
                } else {
                    Alert.alert("force logout", "ok");
                }
            })
            .catch(e => console.log(e));
    }

    login(userid) {
        fetch(`${Environment.server}/v1/user/login/${userid}`)
            .then(o => {
                console.log(o.status);
                if(o.status === 200) {
                    User.ID = userid;
                    this.props.navigation.navigate("List");
                } else {
                    
                    Alert.alert("login",
                                "already login",
                                [
                                    {text: "force logout", onPress: ()=>this.logout(userid)},
                                    {text: "ok", onPress: ()=>console.log("ok")},
                                ])
                }
            })
            .catch(e => console.log(e));
    }

    render() {
        const renderItem = (o) => {
          return (<TouchableOpacity onPress={()=>this.login(o.item.userid)}>
                <UserView
                    username={o.item.username}
                    profile={o.item.profile}
                    picture={o.item.picture}
                    userid={o.item.userid}>{o.item.text}</UserView>
            </TouchableOpacity>);
        };

        return (<FlatList data={users}
                  renderItem={renderItem}
                  keyExtractor={item => item.userid}>
        </FlatList>);
      }
}