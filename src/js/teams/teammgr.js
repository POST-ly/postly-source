function renderAllTeams() {
    var teamsStr = teams.map(team => {
        var check = false
        var checkHtm = `<li><a onclick="return selectTeam('${team.teamId}', '${team.name}')">Set As Team</a></li>`

        if (currentTeam.id == team.teamId) {
            check = true
            checkHtm = `<li><a disabled='true' onclick="return selectTeam('${team.teamId}', '${team.name}')">Set As Team</a></li>`
        }
        return `
            <li style="display: flex; justify-content: space-between;border-bottom: 1px solid rgb(221, 221, 221);padding: 9px 6px;background-color: rgba(221, 221, 221, 0.3);margin: 1px;">
               <span style="text-align: center;display: flex;align-items: center;">
                    <b>${team.name}</b>
                    ${check ? "<i style='padding-left: 4px;' class='icon-check'></i>" : ""}
                    <span style="margin-left: 18px;" class="close" id="wait${team.teamId}">
                        <div class="circle">
                            <div class="circle-ring"></div>
                        </div> 
                    </span>
               </span>
               <span style="position: relative;">
                    <a onclick="return showDropdown('.teamsMgrDropdown${team.teamId}')" style="position: relative;">
                        <span>Actions</span>
                        <span class="icon-arrow-down"></span>
                    </a>
                    <div class="dropdown teamsMgrDropdown${team.teamId} close">
                        <ul>
                            ${checkHtm}
                            <li><a onclick="return renameTeamView('${team.teamId}')">Rename Team</a></li>
                            <li><a onclick="return deleteTeam('${team.teamId}')">Delete Team</a></li>
                        </ul>
                    </div>
                </span>
            </li>
        `
    }).join("")
    return teamsStr
}

function allTeamsModal() {
    var allTeamsModalHtm = `

    <!-- <div class="modal"> -->
        <div class="modal-backdrop allTeamsModalBackdrop"></div>
        <div class="modal-body allTeamsModalBody">
            <div class="modal-head" style="">
                <h4 style="padding: 0;margin: 0;">Manage Teams</h4>
                <div><span onclick="return closeActiveModals(event)" class="icon-close" style="padding: 10px 9px;padding-right: 1px;"></span></div>
            </div>
            <div class="modal-inner-body" style="" id="allTeamsNode">
                <p id="modalRequestError" class="bd-rad-3 color-white bg-red pad-3 close"></p>
                <ul id="renderAllTeamsNode" style="height: 212px; overflow-y: scroll;border: 1px solid rgb(221, 221, 221);border-radius: 3px;">
                    ${renderAllTeams()}
                </ul>
            </div>

            <div class="modal-footer">
                <button onclick="return closeActiveModals(event)" class="createCollectionModalBtn bg-gray color-white pad-6 pad-left-12 pad-right-12">Cancel</button>
            </div>
        </div>

    <!-- </div> -->
    `

    var modalNode = document.createElement("div")
    modalNode.setAttribute("class", "modal")
    // modalNode.classList.add("close")
    modalNode.classList.add("saveModal")
    modalNode.innerHTML = allTeamsModalHtm
    closeActiveModals()
    modalsActive.push(modalNode)
    document.body.appendChild(modalNode)
    
    document.querySelector(".modal-backdrop.allTeamsModalBackdrop").addEventListener("click", () => {
        delete renderOverlay.goBack
        closeActiveModals()
    })
}

function manageTeamModal() {
    var manageTeamModalHtm = `

    <!-- <div class="modal"> -->
        <div class="modal-backdrop manageTeamModalBackdrop"></div>
        <div class="modal-body manageTeamModal">
            <div class="modal-head" style="">
                <h4 style="padding: 0;margin: 0;">Manage Team - ${currentTeam.name}</h4>
                <div><span onclick="return closeActiveModals(event)" class="icon-close" style="padding: 10px 9px;padding-right: 1px;"></span></div>
            </div>
            <div class="modal-inner-body" style="" id="manageTeamNode">
                <p id="modalRequestError" class="bd-rad-3 color-white bg-red pad-3 close"></p>
                <div>
                        <div class="tabs">
                            <ul class="tabul flex-wrap">
                                <li data-tab="manageTeamTab:info" data-name="info" class="tab manageTeamTab tab-active"><a>Info</a></li>
                                <li data-tab="manageTeamTab:members" data-name="members" class="tab manageTeamTab"><a>Members</a></li>
                                <li data-tab="manageTeamTab:addmembers" data-name="addmembers" class="tab manageTeamTab"><a>Add Member</a></li>
                            </ul>
                            <div>
                                <div data-tab="manageTeamTab:info" data-name="info" class="tab-content manageTeamTab tab-content-active">
                                    ${renderTeamInfo()}
                                </div>
                                <div data-tab="manageTeamTab:members" data-name="info" class="tab-content manageTeamTab">
                                    <div id="renderTeamMembersNode">
                                        ${renderTeamMembers()}
                                    </div>
                                </div>
                                <div data-tab="manageTeamTab:addmembers" data-name="info" class="tab-content manageTeamTab">
                                    ${renderTeamAddMembers()}
                                </div>
                            </div>
                        </div>
                </div>
            </div>

            <div class="modal-footer">
                <button onclick="return closeActiveModals(event)" class="createCollectionModalBtn bg-gray color-white pad-6 pad-left-12 pad-right-12">Cancel</button>
            </div>
        </div>

    <!-- </div> -->
    `

    var modalNode = document.createElement("div")
    modalNode.setAttribute("class", "modal")
    // modalNode.classList.add("close")
    modalNode.classList.add("saveModal")
    modalNode.innerHTML = manageTeamModalHtm
    closeActiveModals()
    modalsActive.push(modalNode)
    document.body.appendChild(modalNode)
    setTabs()
    document.querySelector(".modal-backdrop.manageTeamModalBackdrop").addEventListener("click", () => {
        delete renderOverlay.goBack
        closeActiveModals()
    })
}


function renderTeamMembers() {
    const team = teams.find(team => {
        return team.teamId == currentTeam.id
    })

    var members = team.users.map((u, i) => {
        return `
            <tr>
                <td>${u.username}</td>
                <td>${u.role}</td>
                <td style="display: flex; position: relative;">
                    <span style="position: relative;">
                        <a onclick="return showDropdown('.teamMembersMgrDropdown')" style="position: relative;">
                            <span>Actions</span>
                            <span class="icon-arrow-down"></span>
                            <div class="dropdown right-dropdown teamMembersMgrDropdown close">
                                <ul>
                                    <li><a onclick="return removeUser(event, '${u.id}')">Remove User</a></li>
                                    <li><a onclick="return changeUserRoleView(event, '${u.id}')">Change Role</a></li>
                                </ul>
                            </div>
                        </a>
                    </span>          
                    <span style="display: flex; align-content: center; margin-left: 18px;" class="close" id="wait${u.id}">
                        <div class="circle">
                            <div class="circle-ring"></div>
                        </div> 
                    </span>
                </td>
            </tr>
        `
    }).join("")

    members = `
        <table>
            <thead>
                <tr>
                    <th>username</th>
                    <th>role</th>
                    <th>actions</th>
                </tr>
            </thead>
            <tbody>
                ${members}
            </tbody>
        </table>
    `
    return members
}

function renderTeamInfo() {
    const team = teams.find(team => {
        return team.teamId == currentTeam.id        
    })

    return `
        <div>
            <h2 class="lightWeight" style="margin: 3px 0;">
                <span>Team:</span>${team.name}
            </h2>
            <h3 class="lightWeight" style="margin: 3px 0;">
                <span>Role: <span style="text-transform: capitalize;">${team.role}</span></span>
            </h3>
        </div>    
    `
}

function renderTeamAddMembers() {
    return `
        <div>
            <input type="text" id="userToSearch" placeholder="Type to search a user" onkeyup="return searchUser(event)" />
        </div>
        <div>
            <h3 class="lightWeight">Search Results</h3>
            <div id="searchUserRes"></div>
        </div>
    `
}

function searchUser(event) {
    var username = getFromWindow("userToSearch").value
    var searchUserResNode = getFromWindow("searchUserRes")

    searchUserResNode.innerHTML = `
        <div style="display: flex; justify-content: center; padding: 5px 0; margin: 2px 0;">Searching...</div>
    `

    axios.get(url + '/user/get/' + username).then(res => {
        var users = res.data
        if (!users || user.length <= 0 || users == undefined) {
            users = `
                <div style="display: flex; justify-content: space-between; background-color: rgba(221,221,221,0.3); border-bottom: rgb(221, 221, 221); padding: 5px 0; margin: 2px 0;">
                    <span>Nothing found.</span>
                </div>
            `
        } else {

            users = users.map(u => {
                return `
                <div style="display: flex; justify-content: space-between; background-color: rgba(221,221,221,0.3); border-bottom: rgb(221, 221, 221); padding: 5px 0; margin: 2px 0;">
                    <span>${u.username}</span>
                    <span>
                        <button onclick="return addUserToTeam(event, '${u._id}')">Add User</button>
                    </span>
                </div>
            `
            }).join("")
        }
        searchUserResNode.innerHTML = users

    }).catch(err => {
        searchUserResNode.innerHTML = `
        <div style="display: flex; justify-content: center; padding: 5px 0; margin: 2px 0;">Searching...</div>
    `
    })
}

function renderOverlay(htm, node) {
    node.childNodes.forEach(n => {
        if (n.classList)
            n.classList.add("close")
    })

    node.innerHTML = htm + node.innerHTML
    if (!renderOverlay.goBack) {
        renderOverlay.goBack = function () {
            node.childNodes.forEach(n => {
                if (n.classList) {
                    if (n.classList.contains("close")) {
                        n.classList.remove("close")
                    } else {
                        node.removeChild(n)
                    }
                }
            })              
          }  
        }
}

function changeUserRoleView(event, userId) {
    if (!changeUserRoleView.setRoleType) {
        changeUserRoleView.roleType = null
        changeUserRoleView.setRoleType = function (role) {
            changeUserRoleView.roleType = role
        }
    }
    renderOverlay(`
            <div class="modal-head" style="justify-content: start;">
                <div><span onclick="return renderOverlay.goBack(event)" class="icon-arrow-left" style="padding: 10px 9px;padding-right: 1px;"></span></div>
                <h4 style="padding: 0;margin: 0;">Change User Role</h4>
            </div>
            <div class="modal-inner-body" style="" id="manageTeamNode">
                <div>
                    <span style="cursor: pointer;" onclick="return changeUserRoleView.setRoleType('admin')">
                        <input name="userRole" type="radio" id="userRoleAdmin">
                        <label for="userRoleAdmin">Admin</label>
                    </span>
                    
                    <span style="cursor: pointer;" onclick="return changeUserRoleView.setRoleType('viewer')">
                        <input name="userRole" type="radio" id="userRoleViewer">
                        <label for="userRoleViewer">Viewer</label>
                    </span>

                </div>
            </div>

            <div class="modal-footer">
                <button onclick="return changeUserRole(event, '${userId}')" class="createCollectionModalBtn bg-default color-white pad-6 pad-left-12 pad-right-12">Change Role</button>
            </div>    
    `, document.querySelector(".manageTeamModal"))

    /*
            userIdToChangeRole,
            teamId,
            roleToChangeTo

    */
}

function changeUserRole(evt, userId) {
    if (!changeUserRoleView.roleType) {
        displayNotif("Please, select a role.", { type: "danger" })
        return
    }
    var targ = evt.target
    targ.setAttribute("disabled", true)
    targ.innerHTML = "Changing role..."

    var role = changeUserRoleView.roleType
    const data = {
        userIdToChangeRole: userId,
        teamId: currentTeam.id,
        roleToChangeTo: role
    }

    setTimeout(() => {
        displayNotif(JSON.stringify(data, null, "\t"))        
        targ.removeAttribute("disabled", null)
        targ.innerHTML = "Change Role"
        renderOverlay.goBack(new Event("click"))
    }, 1500);
    return

    axios.post(url + "/team/user/change/role", data).then(res => {
        targ.removeAttribute("disabled", null)
        targ.innerHTML = "Change Role"
        renderOverlay.goBack(new Event("click"))
        loadTeams()
        getFromWindow("renderTeamMembersNode").innerHTML = renderTeamMembers()
    }).catch(err => {
        targ.removeAttribute("disabled", null)
        targ.innerHTML = "Change Role"
    })
}

function renameTeamView(teamId) {
    renderOverlay(`
            <div class="modal-head" style="justify-content: start;">
                <div><span onclick="return renderOverlay.goBack(event)" class="icon-arrow-left" style="padding: 10px 9px;padding-right: 1px;"></span></div>
                <h4 style="padding: 0;margin: 0;">Rename Team</h4>
            </div>
            <div class="modal-inner-body" style="" id="manageTeamNode">
                <div>
                    <input id="newTeamName" type="text" placeholder="Team new name" />
                </div>
            </div>

            <div class="modal-footer">
                <button onclick="return renameTeam(event, '${teamId}')" class="createCollectionModalBtn bg-default color-white pad-6 pad-left-12 pad-right-12">Rename</button>
            </div>        
    `, document.querySelector(".allTeamsModalBody"))
}

function renameTeam(evt, teamId) {
    // id = newTeamName
    var teamName = getFromWindow("newTeamName").value

    if (teamName.length <= 0) {
        displayNotif("Pease, enter a team name", { type: "danger" })
        return
    }

    if (teamName.length <= 2) {
        displayNotif("Team name is too short.", { type: "danger" })
        return
    }

    var targ = evt.target
    targ.setAttribute("disabled", true)
    targ.innerHTML = "Renaming team..."

    axios.post(url + "teams/edit/" + teamId, {
        name: teamName
    }).then(res => {
        targ.removeAttribute("disabled", null)
        targ.innerHTML = "Rename Team"
        if (res.data.error) {
            displayNotif(res.data.error, { type: "danger" })
            return 
        }
        displayNotif("Team successfully renamed.", { type: "success" })
        loadTeams()
        getFromWindow("renderAllTeamsNode").innerHTML = renderAllTeams()
        renderOverlay.goBack(new Event("click"))
    }).catch(err => {
        targ.removeAttribute("disabled", null)
        targ.innerHTML = "Rename Team"
        displayNotif(err, { type: "danger" })
    })
}

function removeUser(event, userId) {
    var w = getFromWindow("wait" + userId)
    if (confirm("Do you really wish to remove this user?")) {
        w.classList.remove("close")

        setTimeout(() => {
            displayNotif(JSON.stringify({
                userIdToRemoveFromTeam: userId,
                teamId: currentTeam.id
            }, null, "\t"))
            w.classList.add("close")            
        }, 1000);
        return

        axios.post(url + "/team/remove/user", {
            userIdToRemoveFromTeam: userId,
            teamId: currentTeam.id
        }).then(res => {
            w.classList.add("close")
            loadTeams()
            getFromWindow("renderTeamMembersNode").innerHTML = renderTeamMembers()
        }).catch(err => {
            w.classList.add("close")
            displayNotif("Error occured while trying to remove the user", {type: "danger"})
        })
    }
}

function deleteTeam(teamId) {
    var w = getFromWindow("wait" + teamId)
    if (confirm("Dou you really wish to delete this team?")) {
        w.classList.remove("close")

        /*
        setTimeout(() => {
            displayNotif(JSON.stringify({
                teamId
            }, null, "\t"))
            w.classList.add("close")            
        }, 1000);
        return */

        axios.delete(url + "/teams/" + teamId).then(res => {
            w.classList.add("close")
            if (res.data.error) {
                displayNotif(res.data.error, { type: "danger" })
                return
            }
            loadTeams()
            getFromWindow("renderAllTeamsNode").innerHTML = renderAllTeam()
        }).catch(err => {
            w.classList.add("close")
            displayNotif("Error occured while trying to remove the user", {type: "danger"})
        })
    }
}

function addUserToTeam(event, userId) {
    var targ = event.target
    targ.setAttribute("disabled", true)
    targ.innerHTML = "Adding user..."
    var data = {
        userIdToAdd: userId,
        roleOfUserToAdd: "viewer",
        teamId: currentTeam.id
    }
    setTimeout(() => {
        loadTeams()
        getFromWindow("renderTeamMembersNode").innerHTML = renderTeamMembers()
        displayNotif("Successfully added user to team.", {type: "success"})
        displayNotif(JSON.stringify(data, null, "\t"))

        targ.classList.add("bg-green")
        targ.removeAttribute("disabled", null)
        targ.innerHTML = "User added"
        targ.removeEventListener("click", null)
    }, 1500);
    return
    axios.post(url + "/team/add/user", data).then(res => {
        loadTeams()
        getFromWindow("renderTeamMembersNode").innerHTML = renderTeamMembers()
        displayNotif("Successfully added user to team.", {type: "success"})

        targ.classList.add("bg-green")
        targ.removeAttribute("disabled", null)
        targ.innerHTML = "User added"
        targ.removeEventListener("click", null)
    }).catch(e => {
        displayNotif("Error occured while adding to team.", {type: "danger"})
        targ.removeAttribute("disabled", null)
        targ.innerHTML = "Add User"
    })
}



