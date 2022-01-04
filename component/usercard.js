import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity, Alert } from "react-native";

import commentIcon from '../assets/icon/comment.png';
import heartIcon from '../assets/icon/heart.png';
import shareIcon from '../assets/icon/share.png';
import bookmarkIcon from '../assets/icon/bookmark.png';
import postIcon from '../assets/icon/post.png';

import User from "../data/user";
import Environment from "../data/environment";

export default class UserCardView extends Component {
  constructor(props){
    super(props);
  }

  move(){
    if(this.props.userid !== User.ID) {
      this.props.navigation.navigate('Chat', this.props.obj)
    } else {
      Alert.alert("Chat", "It's me!");
    }
  }

  logout(userid) {
    console.log(User.ID);
    if(userid === User.ID) {
      fetch(`${Environment.server}/v1/user/logout/${userid}`)
        .then(o => {
          if(o.status === 200) {
            this.props.navigation.navigate('Login');
          } else {
            alert("1")
          }
        })
        .catch(e => console.log(e));
    } else {
    }
  }

  render() {
    return (
    <View
        style={{
        marginStart: 5,
        marginEnd: 5,
        marginTop: 5,
        flexDirection: "row",
        borderBottomEndRadius: 5,
        borderBottomStartRadius: 5,
        borderTopEndRadius: 5,
        borderTopStartRadius: 5,
        borderWidth: 1,
        borderColor: '#000000'
        }}
    >
        <View style={{ flex: 0.2, paddingTop: 5, alignItems: 'center' }} >
          <TouchableOpacity onPress={()=>this.logout(this.props.userid)}>
            <Image source={this.props.profile} style={{width: 70, height: 70}}></Image>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 0.8, flexDirection: "column" }} >
          <View style={{flexDirection: "row", paddingTop: 5 }}>
            <Text style={{margin: 5}}>{this.props.username}</Text>
            <Text style={{margin: 5}}>@{this.props.userid}</Text>
          </View>
          <Text style={{margin: 5}}>
            {this.props.children}
          </Text>
          <Image source={this.props.picture} style={{margin: 5, aspectRatio: 1, width: '95%', height: undefined }}></Image>
          <View style={{ flexDirection: "row" }} >
            <View style={{ flex: 0.5, flexDirection: "row" }} >
              <Image source={commentIcon} style={{margin: 15, aspectRatio: 1, width: 24, height: undefined }} />
              <Image source={heartIcon} style={{margin: 15, aspectRatio: 1, width: 24, height: undefined }} />
              <Image source={shareIcon} style={{margin: 15, aspectRatio: 1, width: 24, height: undefined }} />
              <Image source={bookmarkIcon} style={{margin: 15, aspectRatio: 1, width: 24, height: undefined }} />
            </View>
            <View style={{ flex: 0.5, alignItems: 'flex-end' }} >
              <TouchableOpacity onPress={()=>this.move()}>
                <Image source={postIcon} style={{margin: 15, aspectRatio: 1, width: 24, height: undefined }} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
    </View>
    );
  }
}
