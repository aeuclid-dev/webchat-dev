import React, { Component } from "react";
import { View, Text, Image, ScrollView, FlatList, Alert } from "react-native";

import User from "../data/user";

import UserCardView from "./usercard";

import Environment from "../data/environment";
import WebSocketExt from "../extenstion/websocket";

export default class UserListView extends Component {
  constructor(props) {
    super(props);

    this.offset = 0;
    this.limit = 3;

    this.state = {
      users: new Map(),
    };
  }

  componentDidMount() {
    this.fetch();
    console.log("mount");
    WebSocketExt.onRefresh = (o => this.fetch());
    WebSocketExt.onInvite = (o => this.onInvite(o));
    WebSocketExt.onInvited = (o => this.onInvited(o));

    WebSocketExt.connect();
  }

  componentWillUnmount() {
    // this.logout(User.ID);
    console.log("unmount");
    WebSocketExt.disconnect();
    if(User.ID) {
      const id = User.ID;
      User.ID = null;
      this.logout(id);
    }
  }

  onInvited(o) {
    if(o.result === "ok"){
      if(o.to) {
        const to = this.state.users.get(o.to);
        if(to) {
          this.props.navigation.navigate("Chat", to);
        }
      }
    }
    Alert.alert("invitation", "fail");
  }

  onInvite(o) {
    console.log("on invite");
    Alert.alert("INVITE", `from: ${o.from}, to: ${o.to}`,
                [
                  {text: "ok", onPress: () => {
                    o.type = "invited";
                    o.result = "ok";
                    
                    let from = this.state.users.get(o.from);
                    if(from) {
                      WebSocketExt.send(JSON.stringify(o));
                      from.offer = true;
                      
                      this.props.navigation.navigate("Chat", from);
                    }
                  }},
                  {text: "cancel", onPress: () => {
                    o.type = "invited";
                    o.result = "cancel";
                    WebSocketExt.send(JSON.stringify(o));
                  }},
                ]);
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
    console.log("fetch");
    fetch(`${Environment.server}/v1/user/list?offset=${this.offset}&limit=${this.limit}`)
        .then(response => response.json())
        .then(o => {
            this.offset = this.offset + o.length;
            this.state.users = new Map();
            o.map((value, index) => {
                // console.log(value);
                if(value.userid !== User.ID) {
                  this.state.users.set(value.userid, value);
                }
            });
            this.setState({users: this.state.users});
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
    return (<FlatList data={Array.from(this.state.users.values())}
              renderItem={renderItem}
              keyExtractor={item => item.userid}
              onEndReached={()=>this.fetch()}
              onEndReachedThreshold={1}>
    </FlatList>);
  }
}

// export default App;