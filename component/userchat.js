import React, { Component } from 'react';
import { View, Text, Image, ScrollView, FlatList, TextInput, Button } from "react-native";
import UserProfileView from './userprofile';

import Environment from "../data/environment";

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
import User from '../data/user';
import WebSocketExt from '../extenstion/websocket';

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

        this.connection = null,
        this.state = {
            stream: null,
        };
    }

    componentDidMount() {
        WebSocketExt.onOffer = (o => this.onOffer(o));
        WebSocketExt.onAnswer = (o => this.onAnswer(o));

        console.log("mount");
        if(!this.state.stream){
            this.webRtcInit()
                .then(o => console.log(o))
                .catch(e => console.log(e));
        }
    }

    componentWillUnmount() {
        console.log("chat", "unmount");

        this.connection = null;
        this.state.stream = null;
    }

    onIceCandidate(channel, to, e){
        console.log("onIceCandidate");
    }

    onIceConnectionStateChange(channel, to, e){
        
    }

    onTrack(channel, to, e){
        this.state.stream = e.streams[0];
    }

    async onAnswer(o) {
        await this.state.connection.setRemoteDescription(new RTCSessionDescription(o.message));
    }

    async onOffer(o) {

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
        const connection = new RTCPeerConnection(configuration);
        connection.addStream(stream);

        connection.onicecandidate = e => this.onIceCandidate(this.props.route.params.userid, e);
        connection.oniceconnectionstatechange =  e => this.onIceConnectionStateChange(this.props.route.params.userid, e);
        connection.ontrack = e => this.onTrack(this.props.route.params.userid, e);
        console.log(o.message);
        await connection.setRemoteDescription(new RTCSessionDescription(o.message));
        const answer = await connection.createAnswer();
        await connection.setLocalDescription(answer);
        console.log("send answer");

        this.setState({
            stream: stream,
            connection: connection,
        });

        WebSocketExt.send(JSON.stringify({type: 'answer', from: User.ID, to: o.from, message: answer}));
    }

    async webRtcInit() {
        
        if(this.props.route.params.offer) {
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
            const connection = new RTCPeerConnection(configuration);
            connection.addStream(stream);

            connection.onicecandidate = e => this.onIceCandidate(this.props.route.params.userid, e);
            connection.oniceconnectionstatechange =  e => this.onIceConnectionStateChange(this.props.route.params.userid, e);
            connection.ontrack = e => this.onTrack(this.props.route.params.userid, e);
            const offer = await connection.createOffer();

            await connection.setLocalDescription(offer);

            WebSocketExt.send(JSON.stringify({type: "offer", from: User.ID, to: this.props.route.params.userid, message: offer}));

            this.setState({
                stream: stream,
                connection: connection,
            });

            console.log("web rtc done");
        }
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
                    username={this.props.route.params.username}
                    profile={{uri: `${Environment.server}${this.props.route.params.profile}`}}
                    picture={{uri: `${Environment.server}${this.props.route.params.picture}`}}
                    userid={this.props.route.params.userid}>{this.props.route.params.text}</UserProfileView>
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