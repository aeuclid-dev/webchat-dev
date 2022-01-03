import React, { Component } from "react";
import { View, Text, Image, ScrollView, FlatList } from "react-native";



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

  fetch() {
    
    fetch(`http://192.168.0.148:8080/v1/user/list?offset=${this.offset}&limit=${this.limit}`)
        .then(response => response.json())
        .then(o => {
            this.offset = this.offset + o.length;
            o.map((value, index) => {
                // console.log(index, value);
                this.state.users.push(value);
                this.setState({users: this.state.users});
                // console.log(`http://192.168.0.148:8080${value.profile}`);
            });
        })
        .catch(e => console.log(e));
  }

  render() {
    const renderItem = (o) => {
      return (<UserCardView profile={{uri: `http://192.168.0.148:8080${o.item.profile}`}}
                        picture={{uri: `http://192.168.0.148:8080${o.item.picture}`}}
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