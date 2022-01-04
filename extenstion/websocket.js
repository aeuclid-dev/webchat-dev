import Environment from "../data/environment";
import User from "../data/user";

export default class WebSocketExt {
    static _client = null;
    static _queue = [];

    static get client() {
        return WebSocketExt._client;
    }

    static connect() {
        if(WebSocketExt._client === null){
            console.log("connect");
            WebSocketExt._client = new WebSocket(Environment.websocketServer);

            WebSocketExt._client.onopen = (e => WebSocketExt.onOpen(e));
            WebSocketExt._client.onmessage = (e => WebSocketExt.onMessage(e));
            WebSocketExt._client.onerror = (e => WebSocketExt.onError(e));
            WebSocketExt._client.onclose = (e => WebSocketExt.onClose(e));

            WebSocketExt.send(JSON.stringify({type: 'login', user: User.ID}));
        }
    }

    static disconnect() {
        if(WebSocketExt._client !== null) {
            console.log("disconnect");
            WebSocketExt._client.close();
            WebSocketExt._client = null;
        }
    }

    static onOpen(e) {
        WebSocketExt._queue.forEach(o => {
            WebSocketExt._client.send(o);
        });
        WebSocketExt._queue = [];
    }

    static onMessage(e) {
        console.log("message", " => ", e.toString());
    }

    static onError(e) {
        
    }

    static onClose(e) {

    }

    static send(message) {
        if(WebSocketExt._client.readyState !== WebSocketExt._client.OPEN || WebSocketExt._queue.length > 0) {
            WebSocketExt._queue.push(message);

            if(WebSocketExt._client.readyState === WebSocketExt._client.OPEN) {
                WebSocketExt._queue.forEach(o => {
                    WebSocketExt._client.send(o);
                });
                WebSocketExt._queue = [];
            }
        } else {
            WebSocketExt._client.send(message);
        }
    }
}
