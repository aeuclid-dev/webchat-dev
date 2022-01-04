
export default class Environment {
    static get server() {
        // return "http://ec2-13-124-80-213.ap-northeast-2.compute.amazonaws.com:8080";
        return "http://192.168.0.148:8080";
    }

    static get websocketServer() {
        // return "ws://ec2-13-124-80-213.ap-northeast-2.compute.amazonaws.com:8080/ws";
        return "ws://192.168.0.148:8080/ws";
    }
}