class ChatUI {

    constructor(ul) {
        this.ul = ul;
    }
    
    set ul(value) {
        this._ul = value;
    }
    get ul() {
        return this._ul;
    }

    clearUl() {
        this.ul.innerHTML = '';
    }

    templateLI(doc) {
        let date = doc.created_at.toDate();
        let now = new Date();

        let hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        let minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();

        let dateTime;
        if (this.formatDate(date) == this.formatDate(now)) {
            dateTime = `${hours}:${minutes}`;
        } else {
            dateTime = `${this.formatDate(date)} at ${hours}:${minutes}`;
        }

        // Align messages
        let currentUser = localStorage.getItem('username');
        let htmlLi;
        if (doc.username == currentUser) {
            htmlLi = 
            `<li class="me">
                <div class="username">${doc.username}:&nbsp;</div>
                <div class="message">${doc.message}</div>
                <div class="date right">${dateTime}</div>
            </li>`;
        } else {
            htmlLi = 
            `<li>
                <div class="date">${dateTime}</div>
                <div class="username">${doc.username}:&nbsp;</div>
                <div class="message">${doc.message}</div>
            </li>`;
        }
        this.ul.innerHTML += htmlLi;

        // Update username placeholder
        let inputUsername = document.getElementById('username');
        inputUsername.placeholder = "Username: " + localStorage.getItem('username');

        // Scroll to bottom
        let ulMessages = document.querySelector('.messages');
        ulMessages.scrollTop = ulMessages.scrollHeight;
    }

    formatDate(date) {
        let day = date.getDate();
        let month = date.getMonth();
        let year = date.getFullYear();

        day = day.toString().padStart(2, "0");
        month = month.toString().padStart(2, "0");

        return day + "." + month + "." + year;
    }
}

export default ChatUI;