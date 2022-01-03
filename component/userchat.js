import React, { Component } from 'react';
import { View, Text, Image, ScrollView, FlatList, TextInput, Button } from "react-native";
import UserProfileView from './userprofile';

import AidenChavez from "../assets/avatar/AidenChavez.png";
import VincentPorter from "../assets/avatar/VincentPorter.png";
import ChristianKelly from '../assets/avatar/ChristianKelly.png';
import MikeThomas from "../assets/avatar/MikeThomas.png";
import MonicaWard from "../assets/avatar/MonicaWard.png";
import DeanHenry from "../assets/avatar/DeanHenry.png";

import VincentPorterPicture from "../assets/picture/VincentPorterPicture.jpg"
import AidenChavezPicture from "../assets/picture/AidenChavezPicture.jpg"
import ChristianKellyPicture from "../assets/picture/ChristianKellyPicture.jpg"
import MikeThomasPicture from "../assets/picture/MikeThomasPicture.jpg"
import MonicaWardPicture from "../assets/picture/MonicaWardPicture.jpg"
import DeanHenryPicture from "../assets/picture/DeanHenryPicture.jpg"

import {
    RTCPeerConnection,
    RTCIceCandidate,
    RTCSessionDescription,
    RTCView,
    MediaStream,
    MediaStreamTrack,
    mediaDevices,
    registerGlobals
  } from 'react-native-webrtc';

const user =   {
    username: "Aiden Chavez",
    userid: "AidenChavez",
    status: "offline",
    statusText: "left 10 hours ago",
    profile: AidenChavez,
    picture: AidenChavezPicture,
    text: "This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer."
};

const configuration = {"iceServers": [{"url": "stun:stun.l.google.com:19302"}]};

export default class UserChatView extends Component {
    constructor(props) {
        super(props);
//        console.log(this.props.route.params);

        this.queue = [];
        this.connection = null,
        this.client = null;

        this.state = {
            stream: null,
        };
    }

    componentDidMount() {
        console.log("mount");
        Promise.all(this.webSocketInit(), this.webRtcInit())
               .then(o => console.log(o))
               .catch(e => console.log(e));
    }

    componentWillUnmount() {
        console.log("unmount");
        this.client.close();
        // this.connection.close();
        this.connection = null;
        this.state.stream = null;
    }



    async webSocketInit() {
        console.log("web socket init");
        this.client = new WebSocket("ws://ec2-13-124-80-213.ap-northeast-2.compute.amazonaws.com:8080/ws");

        this.client.onopen = (e => this.onWebSocketOpen(e));
        this.client.onmessage = (e => this.onWebSocketMessage(e));
        this.client.onerror = (e => this.onWebSocketError(e));
        this.client.onclose = (e => this.onWebSocketClose(e));

        this.sendWebSocket(JSON.stringify({type: "ping", message: "hello"}));


        console.log("web socket done");
    }

    sendWebSocket(message) {
        if(this.client.readyState !== this.client.OPEN || this.queue.length > 0) {
            this.queue.push(message);
            console.log("1", this.queue);
            if(this.client.readyState === this.client.OPEN) {
                console.log("2", this.queue);
                this.queue.forEach(o => {
                    this.client.send(o);
                });
                this.queue = [];
            }
        } else {
            this.client.send(message);
        }

        
    }

    onWebSocketError(e) {
        console.log(e);
    }

    onWebSocketClose(e) {
        console.log(e);
    }

    onWebSocketMessage(e) {
        console.log(e);
    }

    onWebSocketOpen(e) {
        console.log("3", this.queue);
        this.queue.forEach(o => {
            this.client.send(o);
        });
        this.queue = [];
    }

    async webRtcInit() {
        console.log("web rtc init");
        const devices = await mediaDevices.enumerateDevices();
        let videoSourceId = null;
        for(let i = 0; i < devices.length; i++) {
            const device = devices[i];
            if(device.kind == "videoinput" && device.facing == "front") {
                videoSourceId = device.deviceId;
                break;
            }
        }

        const stream = await mediaDevices.getUserMedia({
            audio: true,
            video: {
              width: 480,
              height: 640,
              frameRate: 30,
              facingMode: "user",
              deviceId: videoSourceId
            }
        });

        console.log(stream);

        const connection = new RTCPeerConnection(configuration);

        const offer = await connection.createOffer();

        await connection.setLocalDescription(offer);

        this.sendWebSocket(JSON.stringify({type: "offer", from: "from", to: "to", message: offer}));

        console.log("send", "offer");

        // send offer

        this.setState({
            stream: stream,
            connection: null,
        })

        console.log("web rtc done");

        return "hello";
    }

    render() {
        return (<ScrollView>
          <View style={{flexDirection: "column"}}>
            <RTCView streamURL={this.state.stream && this.state.stream.toURL()}
                     style={{ height: 300, alignItems: 'center', backgroundColor: "black", justifyContent: 'center' }} />
            {/* <View style={{ height: 300, alignItems: 'center', backgroundColor: "black", justifyContent: 'center' }}>
                <Text style={{color: "white"}}>Video View</Text>
            </View> */}
                <UserProfileView
                    username={this.props.route.params.item.username}
                    profile={{uri: `http://ec2-13-124-80-213.ap-northeast-2.compute.amazonaws.com:8080${this.props.route.params.item.profile}`}}
                    picture={{uri: `http://ec2-13-124-80-213.ap-northeast-2.compute.amazonaws.com:8080${this.props.route.params.item.picture}`}}
                    userid={this.props.route.params.item.userid}>{this.props.route.params.item.text}</UserProfileView>
                <View style={{flexDirection: "row"}}>
                    <TextInput placeholder="useless placeholder" style={{borderStyle:"solid",
                                                                         borderColor: "black",
                                                                         borderWidth: 1,
                                                                         borderRadius: 5,
                                                                         marginStart: 5,
                                                                         marginEnd: 5,
                                                                         flex: 0.98 }}></TextInput>
                    <Button title="Comment"></Button>
                </View>
            
          </View>
        </ScrollView>);
    }
}