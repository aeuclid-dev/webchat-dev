import Environment from "../data/environment";
import User from "../data/user";

export default class WebSocketExt {
    static _client = null;
    static _queue = [];
    static onRefresh = null;
    static onInvite = null;
    static onInvited = null;
    static onOffer = null;
    static onAnswer = null;


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
        const json = JSON.parse(e.data);
        console.log("message ", "=============================>")
        console.log(json);

        if(json.type === "refresh") {
            if(WebSocketExt.onRefresh) {
                WebSocketExt.onRefresh(json);
            }
        } else if(json.type === "offer") {
            if(WebSocketExt.onOffer) {
                WebSocketExt.onOffer(json);
            }
        } else if(json.type === "invite") {
            if(WebSocketExt.onInvite) {
                WebSocketExt.onInvite(json);
            }
        } else if(json.type === "invited") {
            if(WebSocketExt.onInvited) {
                WebSocketExt.onInvited(json);
            }
        } else if(json.type === "offer") {
            if(WebSocketExt.onOffer) {
                WebSocketExt.onOffer(json);
            }
        } else if(json.type === "answer") {
            if(WebSocketExt.onAnswer) {
                WebSocketExt.onAnswer(json);
            }
        }
    }

    static onError(e) {
        console.log("error");
    }

    static onClose(e) {
        console.log("close");
    }

    static send(message) {
        console.log(WebSocketExt._client);
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
