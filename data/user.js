
export default class User {
    static ID = null;
    static get id() {
        return User.ID;
    }

    static set id(v) {
        User.ID = v;
    }
}