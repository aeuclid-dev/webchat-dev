import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";


export default class UserView extends Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
    <View
        style={{
        marginStart: 5,
        marginEnd: 90,
        marginTop: 5,
        marginBottom: 5,
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
          <Image source={this.props.profile} style={{width: 70, height: 70}}></Image>
        </View>
        <View style={{ flex: 0.8, flexDirection: "column" }} >
          <View style={{flexDirection: "row", paddingTop: 5 }}>
            <Text style={{margin: 5}}>{this.props.username}</Text>
            <Text style={{margin: 5}}>@{this.props.userid}</Text>
          </View>
          <Image source={this.props.picture} style={{marginTop: 5, marginBottom: 10, marginEnd: 5, marginStart: 5, aspectRatio: 1, width: '95%', height: undefined }}></Image>
          <Text style={{margin: 5}}>
            {this.props.children}
          </Text>
        </View>
    </View>
    );
  }
}
