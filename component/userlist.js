import React, { Component } from "react";
import { View, Text, Image, ScrollView, FlatList } from "react-native";

import User from "../data/user";

import UserCardView from "./usercard";



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
    fetch(`http://ec2-13-124-80-213.ap-northeast-2.compute.amazonaws.com:8080/v1/user/logout/${userid}`)
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
    
    fetch(`http://ec2-13-124-80-213.ap-northeast-2.compute.amazonaws.com:8080/v1/user/list?offset=${this.offset}&limit=${this.limit}`)
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
      return (<UserCardView profile={{uri: `http://ec2-13-124-80-213.ap-northeast-2.compute.amazonaws.com:8080${o.item.profile}`}}
                        picture={{uri: `http://ec2-13-124-80-213.ap-northeast-2.compute.amazonaws.com:8080${o.item.picture}`}}
                        username={o.item.username}
                        index={o.index}
                        key={o.index}
                        obj={JSON.parse(JSON.stringify(o))}
                        navigation={this.props.navigation}
                        userid={o.item.userid}>{o.item.text}</UserCardView>);
    };
    return (<FlatList data={this.state.users}
              renderItem={renderItem}
              keyExtractor={item => item.index}
              onEndReached={()=>this.fetch()}
              onEndReachedThreshold={1}>
    </FlatList>);
  }
}

// export default App;