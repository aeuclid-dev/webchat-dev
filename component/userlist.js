import React, { Component } from "react";
import { View, Text, Image, ScrollView, FlatList, Alert } from "react-native";

import User from "../data/user";

import UserCardView from "./usercard";

import Environment from "../data/environment";

export default class UserListView extends Component {
  constructor(props) {
    super(props);

    this.offset = 0;
    this.limit = 3;

    this.state = {
      users: [],
    };
  }

  componentDidMount() {
    this.fetch();
    // console.log(1);
  }

  componentWillUnmount() {
    console.log("list", "unmount");
    this.logout(User.ID);
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

  fetch() {
    
    fetch(`${Environment.server}/v1/user/list?offset=${this.offset}&limit=${this.limit}`)
        .then(response => response.json())
        .then(o => {
            this.offset = this.offset + o.length;
            o.map((value, index) => {
                this.state.users.push(value);
                this.setState({users: this.state.users});
            });
        })
        .catch(e => console.log(e));
  }

  render() {
    const renderItem = (o) => {
      return (<UserCardView profile={{uri: `${Environment.server}${o.item.profile}`}}
                        picture={{uri: `${Environment.server}${o.item.picture}`}}
                        username={o.item.username}
                        index={o.index}
                        key={o.index}
                        obj={JSON.parse(JSON.stringify(o))}
                        navigation={this.props.navigation}
                        userid={o.item.userid}>{o.item.text}</UserCardView>);
    };
    return (<FlatList data={this.state.users}
              renderItem={renderItem}
              keyExtractor={item => item.userid}
              onEndReached={()=>this.fetch()}
              onEndReachedThreshold={1}>
    </FlatList>);
  }
}

// export default App;