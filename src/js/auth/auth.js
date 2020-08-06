
function signInModal(event) {
    var signInModalHtml = `

    <!-- <div class="modal"> -->
        <div class="modal-backdrop signInModalBackdrop"></div>
        <div class="modal-body authBody">
            <div class="modal-head" style="">
                <h4 style="padding: 0;margin: 0;">Sign In</h4>
                <div><span onclick="return closeActiveModals(event)" class="icon-close" style="padding: 10px 9px;padding-right: 1px;"></span></div>
            </div>
            <div class="modal-inner-body" style="padding: 20px;">
                <div style="font-size: 14px; color: rgb(221,75,57);">
                    <span>Don't have an account? <a style="display: inline; text-decoration: underline;" onclick="return signUpModal(event)">Sign up here</a></span>
                </div>
                <p id="signInModalRequestError" class="bd-rad-3 color-white bg-red pad-3 close"></p>
                <div style="margin: 15px 0;">
                    <h4 style="margin: 4px 0;">Username:</h4>
                    <input style="width: 100%;" type="text" id="signInUsername" placeholder="Username" />
                </div>
                <div style="margin: 15px 0;">
                    <h4 style="margin: 4px 0;">Password:</h4>
                    <input style="width: 100%;" type="password" id="signInPassword" placeholder="Password" onkeydown="return signInKeyDown(event)" />
                </div>
            </div>
            <div class="modal-footer">
                <button onclick="return closeActiveModals(event)" class="createCollectionModalBtn bg-gray color-white pad-6 pad-left-12 pad-right-12">Cancel</button>
                <button onclick="return signIn(event)" id="signInButton" class="createCollectionModalBtn bg-default color-white pad-6 pad-left-12 pad-right-12">Sign In</button>
            </div>
        </div>

    <!-- </div> -->
    `
    closeActiveModals()
    var modalNode = document.createElement("div")
    modalNode.setAttribute("class", "modal")
    // modalNode.classList.add("close")
    modalNode.classList.add("saveModal")
    modalNode.innerHTML = signInModalHtml
    document.body.appendChild(modalNode)
    document.querySelector(".modal-backdrop.signInModalBackdrop").addEventListener("click", () => {
        document.body.removeChild(modalNode)
    })
    modalsActive.push(modalNode)
}

function signUpModal() {
    var registerModal = `

    <!-- <div class="modal"> -->
        <div class="modal-backdrop signUpModalBackdrop"></div>
        <div class="modal-body authBody">
            <div class="modal-head" style="">
                <h4 style="padding: 0;margin: 0;">Sign Up</h4>
                <div><span onclick="return closeActiveModals(event)" class="icon-close" style="padding: 10px 9px;padding-right: 1px;"></span></div>
            </div>
            <div class="modal-inner-body" style="padding: 20px;">
                <div style="font-size: 14px; color: rgb(221,75,57);">
                    <span>Have an account? <a style="display: inline; text-decoration: underline;" onclick="return signInModal(event)">Sign in here</a></span>
                </div>
                <p id="signUpModalRequestError" class="bd-rad-3 color-white bg-red pad-3 close"></p>
                <div style="margin: 15px 0;">
                    <h4 style="margin: 4px 0;">Username:</h4>
                    <input style="width: 100%;" type="text" id="signUpUsername" placeholder="Username" />
                </div>
                <div style="margin: 15px 0;">
                    <h4 style="margin: 4px 0;">Email:</h4>
                    <input style="width: 100%;" type="email" id="signUpEmail" placeholder="Email" />
                </div>
                <div style="margin: 15px 0;">
                    <h4 style="margin: 4px 0;">Password:</h4>
                    <input style="width: 100%;" type="password" id="signUpPassword" placeholder="Password" />
                </div>
                <div style="margin: 15px 0;">
                    <h4 style="margin: 4px 0;">Retype Password:</h4>
                    <input style="width: 100%;" type="password" id="signUpPassword2" placeholder="Retype Password" />
                </div>
            </div>
            <div style="margin: 9px 0;" class="modal-footer">
                <button onclick="return closeActiveModals(event)" class="createCollectionModalBtn bg-gray color-white pad-6 pad-left-12 pad-right-12">Cancel</button>
                <button onclick="return signUp(event)" class="createCollectionModalBtn bg-default color-white pad-6 pad-left-12 pad-right-12">Sign Up</button>
            </div>
        </div>

    <!-- </div> -->
    `
    closeActiveModals()
    var modalNode = document.createElement("div")
    modalNode.setAttribute("class", "modal")
    // modalNode.classList.add("close")
    modalNode.classList.add("saveModal")
    modalNode.innerHTML = registerModal
    document.body.appendChild(modalNode)
    document.querySelector(".modal-backdrop.signUpModalBackdrop").addEventListener("click", () => {
        document.body.removeChild(modalNode)
    })
    modalsActive.push(modalNode)
}

function signInKeyDown(event) {
    if(event.key == "Enter" && event.keyCode == 13) {
        // sign in.
        // get signInButton node
        var signInButtonNode = getFromWindow("signInButton")
        signInButtonNode.click()
    }
}

function signIn(evt) {
    var username = getFromWindow("signInUsername").value
    var password = getFromWindow("signInPassword").value

    if (username.length <= 0 || password.length <= 0) {
        displayNotif("Please, type in your username and password.", {type: "danger"})
        return
    }

    var targ = evt.target
    targ.setAttribute("disabled", true)
    targ.innerText = "Signing in..."

    axios.post(url + "/user/login", { username, password }).then(res => {
        if(res.data.error) {
            displayNotif(res.data.error, { type: "danger" })
            targ.removeAttribute("disabled", null)
            targ.innerText = "Sign In"
            return    
        }
        var data = res.data
        targ.removeAttribute("disabled", null)
        targ.innerText = "Sign In"

        // set the retrieved token in localStorage
        localStorage.setItem("token", data)
        localStorage.setItem("user", JSON.stringify({ username }))

        closeActiveModals()
        location.reload()
    }).catch(err => {
        displayNotif(err.toString(), {type: "danger"})
        targ.removeAttribute("disabled", null)
        targ.innerText = "Sign In"
    })
}

function signUp(evt) {
    var username = getFromWindow("signUpUsername").value
    var password = getFromWindow("signUpPassword").value
    var password2 = getFromWindow("signUpPassword2").value
    var email = getFromWindow("signUpEmail").value

    if (username.length <= 0 || password.length <= 0 || password2.length <= 0 || email.length <= 0) {
        displayNotif("Please, complete the fields.", {type: "danger"})
        return;
    }

    if (password !== password2) {
        displayNotif("The passwords does not match", { type: "danger" })
        return
    }

    var targ = evt.target
    targ.setAttribute("disabled", true)
    targ.innerText = "Signing up..."

    axios.post(url + "/user/register", {
        username,
        password,
        email
    }).then(res => {
        if(res.data.error) {
            targ.removeAttribute("disabled", null)
            targ.innerText = "Sign Up"
            displayNotif(res.data.error, { type: "danger" })
            return            
        }
        var data = res.data

        // set the retrieved token in localStorage
        localStorage.setItem("token", data)

        localStorage.setItem("user", JSON.stringify({ username, email }))
        closeActiveModals()
        location.reload()
    }).catch(err => {
        displayNotif(err.toString(), {type: "danger"})
        targ.removeAttribute("disabled", null)
        targ.innerText = "Sign Up"
    })
}

function renderAuthButtons() {
    var htm = ""
    var token = localStorage.getItem("token")

    if (token && token.length > 1) {
        // get your user name
        var username = JSON.parse(localStorage.getItem("user")).username
        // render logout button
        htm = `
            <a style="position: relative;" class="nav-btn" onclick="return showDropdown('.authOptsDropdown')">
                <span>${username}</span>
                <span class="icon-user"></span>
            </a>
            <div class="dropdown authOptsDropdown close">
                <ul>
                    <li>
                        <a onclick="return logOut(event)"><span>Log Out </span><span class="icon-logout"></span></a>
                    </li>
                </ul>
            </div>
        `
    } else {
        // render sign in button
        htm = `<a class="nav-btn" onclick="return signInModal(event)"><span>Sign In </span><span class="icon-login"></span></a>`
    }

    getFromWindow("authButtons").innerHTML = htm
}

function logOut(evt) {
    localStorage.removeItem("token")
    localStorage.removeItem("currentTeam")
    location.reload()
}

function IsUserAuth() {
    var token = localStorage.getItem("token")
    var currentTeam = localStorage.getItem("currentTeam")

    if (token && token.length > 0) {
        if (currentTeam && (currentTeam.id !== "personal" || currentTeam.id !== "Personal")) {
            return true
        }
    }
    return false
}