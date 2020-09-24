class Chatroom {
    
    constructor(room, username) {
        this.room = room;
        this.username = username;
        this.chats = db.collection('chats'); 
        this.unsub;
    }

    set room(value) {
        this._room = value;
    }
    set username(value) {
        if (value.match(/[^\s][a-zA-Z]{2,10}/)) {
            this._username = value;
            localStorage.setItem('username', value);
        } else {
            alert('Username must be 2-10 characters in length (A-Z) and cannot be empty.')
        }
    }

    get room() {
        return this._room;
    }
    get username() {
        return this._username;
    }

    updateUsername(username) {
        this.username = username;
    }

    updateRoom(room) {
        this.room = room;
        if (this.unsub) {
            this.unsub();
        }
    }

    async addChat(message) {
        const date = new Date();
        let docChat = {
            message: message,
            username: this.username,
            room: this.room,
            created_at: firebase.firestore.Timestamp.fromDate(date)
        }
        return await this.chats.add(docChat);
    }

    getChats(callback) {
        this.unsub = this.chats
        .where('room', '==', this.room)
        .orderBy('created_at')
        .onSnapshot(snapshot => {
            snapshot.docChanges().forEach(change => {
                if (change.type == 'added') {
                    callback(change.doc.data());
                }
            });
        });
    }
}

export default Chatroom;