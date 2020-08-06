function renderTeamChat() {
    var chatNode = getFromWindow("teamChatArea")
    if (IsUserAuth()) {
        chatNode.innerHTML = `
            <a onclick="return toggleTeamChatSidebar(event)" style="padding: 3px 11px; background-color: gray; color: white; border-radius: 2px; display: inline-block; white-space: nowrap;">
            <span>Chat</span>
            <span style="position: relative;">
                <span class="icon-bubbles">
                </span>
                <span class="chatIconNotif close" id="chatIconNotif"></span>
            </span>
            </a>
        `
        teamChatSidebar()
        setupSocketIOClient()
    }
}

function toggleTeamChatSidebar(evt) {
    toggleTeamChatSidebar.chatNode.classList.toggle("close")

    // render chats in chatNotifs
    if(chatNotifs.length > 0) {
        var chatHtm = chatNotifs.map(data => {
                return `
                    <div class="chatItem">
                        <div class="chatItemHead">
                            <span><b>${data.username}</b></span>
                            <span>${data.date}</span>
                        </div>
                        <div class="chatItemBody">
                            ${data.message}
                        </div>
                    </div>
                `
        }).join("")
        var node = document.querySelector(".chatBody")
        node .innerHTML = chatHtm + node.innerHTML
        // clear chats notifs
        chatNotifs.length = 0

        // clear chat notifs dom
        var n = getFromWindow("chatIconNotif")
        n.innerHTML = ""
        n.classList.add("close")
    }
}

var chatNotifs = []

function setupSocketIOClient() {
    var socket = io.connect(socketioUrl);
    toggleTeamChatSidebar.chatNode = document.querySelector(".chatWrapper")

    setupSocketIOClient.socket = socket
    setupSocketIOClient.socket.emit("join", {
        teamId: currentTeam.id
    })

    setupSocketIOClient.socket.on("message", function (data) {
        // check if chatWrapper is visible, if not put messgaes to chatNofits
        var h = ``
        if(toggleTeamChatSidebar.chatNode.classList.contains("close")) {
            chatNotifs.push(data)
            // id="chatIconNotif" class="close"
            var n = getFromWindow("chatIconNotif")
            n.innerHTML = chatNotifs.length
            n.classList.remove("close")
        } else {
            // clear textarea if chat is yours.
            if(data.username == user.username) {
                getFromWindow("teamChatInput").value = ""
                h = `
                    <div class="chatItem meChatItem">
                        <div class="chatItemHead meChatItemHead">
                            <span><b>${data.username}</b></span>
                            <span>${data.date}</span>
                        </div>
                        <div class="chatItemBody">
                            ${data.message}
                        </div>
                    </div>
                `
            } else {
                h = `
                    <div class="chatItem">
                        <div class="chatItemHead">
                            <span><b>${data.username}</b></span>
                            <span>${data.date}</span>
                        </div>
                        <div class="chatItemBody">
                            ${data.message}
                        </div>
                    </div>
                `
            }
            var node = document.querySelector(".chatBody")
            node .innerHTML = h + node.innerHTML
        }
    })
}

function teamChatSidebar(event) {
    var chatHTMLStr = `
            <div class="chatHead">
                <a onclick="return teamChatSidebar.closeChatSidebar(event);" class="icon-close"></a>
            </div>
            <div class="chatTextInput">
                <div style="display: flex;justify-content: center;align-items: center;">
                    <textarea style="font-family: inherit;flex-basis: 50%;flex-grow: 1;" placeholder="Type a message" id="teamChatInput" onkeydown="return teamChatInputKeydown(event)">
                    </textarea>
                    <button class="teamChatButton" onclick="return sendTeamMsg(event)">
                        <span class="icon-cursor"></span>
                    </button>
                </div>
            </div>
            <div class="chatBody">
                <!--
                <div class="chatItem">
                    <div class="chatItemHead">
                        <span><b>okoli</b></span>
                        <span>3:23AM Today</span>
                    </div>
                    <div>
                        Hey, did you guys see the updated url?
                    </div>
                </div>
                <div class="chatItem">
                    <div class="chatItemHead">
                        <span><b>thor</b></span>
                        <span>7:23AM Today</span>
                    </div>
                    <div>
                       okoli, yes. I saw it. Thanks for the correction.

                       Also, can you look into the body section?
                    </div>
                </div>
                <div class="chatItem meChatItem">
                    <div class="chatItemHead">
                        <span><b>Me</b></span>
                        <span>7:23AM Today</span>
                    </div>
                    <div>
                        I'll do that asap.
                    </div>
                </div>
                -->
            </div>
    `
    var chatN = document.createElement("div")
    chatN.classList.add("chatWrapper")
    chatN.classList.add("close")
    chatN.innerHTML = chatHTMLStr
    document.body.appendChild(chatN)

    teamChatSidebar.closeChatSidebar = function closeChatSidebar(event) {
        // document.body.removeChild(chatN)
        chatN.classList.toggle("close")
    }
}

function teamChatInputKeydown(evt) {
    if (evt.key == "Enter" || evt.keyCode == 13) {
        setupSocketIOClient.socket.emit("message", {
            username: user.username,
            teamId: currentTeam.id,
            message: getFromWindow("teamChatInput").value,
            date: new Date().toString()
        })
    }
    // id="teamChatInput" onkeydown="return teamChatInputKeydown(event)"

    // send message then clear input
}

function sendTeamMsg(event) {
    // get message fomr input text
    setupSocketIOClient.socket.emit("message", {
        username: user.username,
        teamId: currentTeam.id,
        message: getFromWindow("teamChatInput").value,
        date: new Date().toString()
    })
}

/*
mongoexport -h ds237855.mlab.com:37855 -d alc -c users -u nnamdi -p mlab1992 -o users.json
mongo ds237855.mlab.com:37855/alc -u nnamdi -p mlab1992
*/