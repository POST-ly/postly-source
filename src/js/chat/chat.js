function renderTeamChat() {
    var chatNode = getFromWindow("teamChatArea")
    if (IsUserAuth()) {
        chatNode.innerHTML = `
            <a onclick="return teamChatSidebar(event)" style="padding: 3px;background: gray;color: white;border-radius: 2px;display: inline-block;white-space: nowrap;">
            <span>Chat</span>
            <span class="icon-bubbles"></span>
            </a>
        `
    }
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
            </div>
    `
    var chatN = document.createElement("div")
    chatN.classList.add("chatWrapper")
    chatN.innerHTML = chatHTMLStr
    document.body.appendChild(chatN)

    teamChatSidebar.closeChatSidebar = function closeChatSidebar(event) {
        document.body.removeChild(chatN)
    }
}

function teamChatInputKeydown(evt) {
    if (evt.key == "") {
        
    }
    //id="teamChatInput" onkeydown="return teamChatInputKeydown(event)"
}

function sendTeamMsg(event) {
    // get messgae fomr input text
}

/*

*/