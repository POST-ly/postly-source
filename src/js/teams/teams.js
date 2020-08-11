function createTeamModal(event) {
    var newTeamModalHtm = `
    <!-- <div class="modal"> -->
        <div class="modal-backdrop newTeamModalBackdrop"></div>
        <div class="modal-body">
            <div class="modal-head" style="">
                <h4 style="padding: 0;margin: 0;">Create a Team</h4>
                <div><span onclick="return closeActiveModals(event)" class="icon-close" style="padding: 10px 9px;padding-right: 1px;"></span></div>
            </div>
            <div class="modal-inner-body" style="">
                <p id="modalNewTeamError" class="bd-rad-3 color-white bg-red pad-3 close"></p>
                <div>
                    <input type="text" id="newTeamName" placeholder="Team name" />
                </div>
            </div>
            <div style="margin: 4px 0;" class="modal-footer">
                <button onclick="return closeActiveModals(event)" class="createCollectionModalBtn bg-gray color-white pad-6 pad-left-12 pad-right-12">Cancel</button>
                <button onclick="return newTeam(event)" class="newTeamModalBtn bg-default color-white pad-6 pad-left-12 pad-right-12">Create Team</button>
            </div>
        </div>

    <!-- </div> -->
    `
    var mo = document.createElement("div")
    mo.classList.add("modal")
    mo.classList.add("newTeamModal")
    //mo.classList.add("close")
    closeActiveModals()
    modalsActive.push(mo)

    mo.innerHTML = newTeamModalHtm

    document.body.appendChild(mo)

    document.querySelector(".modal-backdrop.newTeamModalBackdrop").addEventListener("click", () => {
        closeActiveModals()
    })
}

function newTeam(evt) {
    var targ = evt.target
    targ.setAttribute("disabled", true)
    targ.innerText = "Creating team..."

    var newTeam = getFromWindow("newTeamName").value
    if (newTeam.length <= 0) {
        var errNode = getFromWindow("modalNewTeamError")        
        errNode.innerHTML = "Please, type a team name."
        errNode.classList.remove("close")
        return
    }

    axios.post(url + "team/create", {
        teamName: newTeam
    }).then(res => {
        targ.removeAttribute("disabled", null)
        targ.innerText = "Create Team"
        if(res.data.error) {
            displayNotif(res.data.error, { type: "danger" })
            return
        }
        loadTeams()

        displayNotif("Team succesfully created.", { type: "success" })
        closeActiveModals()
    }).catch(err => {
        targ.removeAttribute("disabled", null)
        targ.innerText = "Create Team"

        displayNotif("Error occured while creating team.", { type: "danger" })        
    })
}

function addToTeam(event) {
    var addToTeamModal = `
        <!-- <div class="modal"> -->
            <div class="modal-backdrop addToTeamModalBackdrop"></div>
            <div class="modal-body">
                <h4>Add New Team Member(s)</h4>
                <p id="modalAddNewTeamError" class="bd-rad-3 color-white bg-red pad-3 close"></p>
                <div>
                    <input type="text" id="newTeamMemberName" placeholder="Type member name" />
                </div>
                <div style="margin: 4px 0;">
                    <h3 class="resultAddTeamHead">Results:</h3>
                    <ul>
                        <li>
                            <div class="resultAddTeamItem">
                                <span style="">Chidume</span>
                                <span style="display: flex; align-items: center;">
                                    Action: 
                                    <a onclick="return showDropdown('.addTeamDropdown')" style="position: relative;">
                                        <span>Normal Member</span>
                                        <span class="icon-arrow-down"></span>
                                        <div class="dropdown addTeamDropdown close">
                                            <ul>
                                                <li><a onclick="return ">Owner</a></li>
                                                <li><a onclick="return ">Delete</a></li>
                                            </ul>
                                        </div>
                                    </a>
                                </span>
                            </div>
                        </li>
                        <li>
                            <div class="resultAddTeamItem">
                                <span style="">Nnamdi</span>
                                <span style="display: flex; align-items: center;">
                                    Action: 
                                    <a>
                                        <span>Normal Member</span>
                                        <span class="icon-arrow-down"></span>
                                    </a>
                                </span>
                            </div>
                        </li>

                    </ul>
                </div>
            </div>

        <!-- </div> -->
        `

    var mo = document.createElement("div")
    mo.classList.add("modal")
    mo.classList.add("addNewTeamModal")
    // mo.classList.add("close")
    mo.innerHTML = addToTeamModal

    document.body.appendChild(mo)

    document.querySelector(".modal-backdrop.addToTeamModalBackdrop").addEventListener("click", () => {
        document.body.removeChild(mo)
    })
}

// This will fetch all the teams the user belongs to
function loadTeams() {
        var htmlStr = `
        <li><a onclick="return selectTeam('personal', 'Personal')">Personal</a></li>
    `
        // load teams
        axios.get(url + "teams/user").then((res) => {
            if(res.data.error) {
                teamsList.innerHTML = htmlStr
                displayNotif(res.data.error, { type: "danger" })
                return
            }
            var _teams = res.data
            teams = _teams
            if (_teams.length > 1) {
                for (let index = 0; index < 2; index++) {
                    const team = _teams[index];
                    htmlStr += `<li><a onclick="return selectTeam('${team.teamId}', '${team.name}')">${team.name}</a></li>`
                }
            } else {
                const team = _teams[0];
                htmlStr += `<li><a onclick="return selectTeam('${team.teamId}', '${team.name}')">${team.name}</a></li>`
            }
            teamsList.innerHTML = htmlStr
        }).catch(e => {
            displayNotif("Error occured while loading your teams.", { type: "danger" })
        })

    if (IsUserAuth()) {
        // fetch the user details
        axios.get(url + "user/me/get").then(res => {
            if(res.data.error) {
                displayNotif(res.data.error, { type: "danger" })
                return
            }
            user = res.data
            // var userLS = JSON.parse(localStorage.getItem("user"))
        }).catch(err => {
            displayNotif("Error occured while loading your details.", { type: "danger" })
        })        
    }
}

function loadATeam(currTeam) {
    var teamId = currTeam.id
    var teamName = currTeam.name

    // load team, collections, requests, envs, mockserver

    if (teamId == "personal") {
        getFromWindow("currentTeamDisplay").innerText = teamName
    } else {
        /*
        axios.get(url + '/team/user/' + teamId).then((res) => {
            var _team = res.data
            // set team name in DOM        
            // id = "currentTeamDisplay"
            if (_team) {
                getFromWindow("currentTeamDisplay").innerText = _team.name
        }
        }).catch(e => {
            displayNotif("Error occured while loading your team.", { type: "danger" })
            log(e)
        })        
        */
    }
}

function selectTeam(teamId, teamName) {
    if(teamId == "personal") {
        localStorage.setItem("currentTeam", JSON.stringify({ id: teamId, name: teamName }))
        getFromWindow("currentTeamDisplay").innerText = teamName
        location.reload()
    } else {
        /*
        if (!IsUserAuth()) {
            displayNotif("Please, You must sign in before selecting this team.", {type: "danger"})
            return
        }
        */
        localStorage.setItem("currentTeam", JSON.stringify({ id: teamId, name: teamName }))
        getFromWindow("currentTeamDisplay").innerText = teamName
        location.reload()
    }
}
