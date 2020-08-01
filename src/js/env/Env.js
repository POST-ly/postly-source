function newEnvTab(tabId) {
    return `
        <div>
            <h2 class="lightWeight">Create New Environment</h2>
            <div>
                <div style="margin: 9px 0;">
                    <input type="text" id="${tabId}EnvName" placeholder="Environment name" />
                    <button class="pad-6" onclick="createEnvName(event)">Create Env</button>
                </div>
                <div class="divider"></div>

                <div style="margin: 9px 0;">
                    <div style="display:flex; justify-content: space-evenly;">
                        <div class="EnvList">
                            <h3 class="lightWeight">All Envs</h3>
                            <ul id="${tabId}EnvsList">
                                <!--
                                <li class="EnvListItem">
                                    <div style="width: 100%; display: flex; align-items: center;" >
                                        <a style="padding: 0.4em 0.1em;">Prod</a><span class="icon-check color-default"></span>
                                    </div>
                                    <span class="icon-options" style="float: right; padding: 4px; position: relative;" onclick="return showDropdown('.${tabId}envOptionsDropdown')">
                                                <div class="dropdown ${tabId}envOptionsDropdown close" style="left: unset; right: 0;">
                                                    <ul>
                                                        <li><a onclick="return renameCollectionModal('')">Rename</a></li>
                                                        <li><a onclick="return deleteCollection('')">Delete</a></li>
                                                    </ul>
                                                </div>                        
                                    </span>
                                </li>
                                <li class="EnvListItem">
                                    <div style="width: 100%; display: flex; align-items: center;" >
                                        <a style="padding: 0.4em 0.1em;">Dev</a>
                                    </div>
                                    <span class="icon-options" style="float: right; padding: 4px; position: relative;" onclick="return showDropdown('.${tabId}envOptionsDropdown')">
                                                <div class="dropdown ${tabId}envOptionsDropdown close" style="left: unset; right: 0;">
                                                    <ul>
                                                        <li><a onclick="return renameCollectionModal('')">Rename</a></li>
                                                        <li><a onclick="return deleteCollection('')">Delete</a></li>
                                                    </ul>
                                                </div>                        
                                    </span>
                                </li>
                                -->
                            </ul>
                        </div>
                        <div class="EnvVarsList">
                            <div style="white-space: nowrap;display: flex;justify-content: space-between;align-items: center;">
                                <span><h3 class="lightWeight">Variables</h3></span>
                                <span><button onclick="return createVarModal(event)">Create Variable</button></span>
                            </div>
                            <table>
                                <thead>
                                    <th>NAME</th>
                                    <th>VALUE</th>
                                    <th>ACTIONS</th>
                                </thead>
                                <tbody id="${tabId}EnvVarsList">
                                    <!--<tr>                                        
                                        <td><span>base_url</span></td>
                                        <td><span>localhost:5000/api/</span></td>
                                        <td style="box-sizing: border-box;display: flex;">  
                                            <span class="icon-note" style="padding: 0.3em;display: block;"></span>
                                            <span class="icon-trash" style="padding: 0.3em;display: block;"></span>
                                        </td>
                                    </tr>-->
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>                
            </div>
        </div>
    `
}

function createNewEnvTab() {
    // check type of Env already exist.
    var tabExist = false
    var tabExistId
    for (var index = 0; index < tabs.length; index++) {
        var tab = tabs[index];
        if(postData[tab] && postData[tab].type) {
            if(postData[tab].type == "New Env") {
                tabExist = true
                tabExistId = postData[tab].id
            }            
        }
    }

    if(tabExist){
        requestTabClick(null, tabExistId)
        return
    }
    var id = "requestTab" + Date.now()

    var h = `<a onclick="return requestTabClick(event, '${id}')" class="mainTabName">
    <b id="${id}TabMethod" class="icon-grid"></b> <span id="${id}TabName">Create New Env</span></a>
    <span><a class="mainTabClose" onclick="return removeTab(event, '${id}')">X</a></span>`

    var li = document.createElement("li")
    li.classList.add("mainTab")
    li.classList.add("mainTabActive")
    li.classList.add(`${id}MainTab`)
    // li.setAttribute("id", id)
    li.innerHTML = h 
    mainTab.appendChild(li)

    first = tabs.length <= 0 ? true:  false;

    if(first) {

    } else {
        var mainTabActiveNode = document.querySelector(".mainTabActive")
        mainTabActiveNode.classList.remove("mainTabActive")

        var mainTabContentActiveNode = document.querySelector(".mainTabContentActive")
        mainTabContentActiveNode.classList.remove("mainTabContentActive")
        // mainTabContentActiveNode.classList.add("close")
    }

    var divNode = document.createElement("div")
    divNode.classList.add("mainTabContent")
    divNode.classList.add("mainTabContentActive")
    divNode.setAttribute("id", id)
    divNode.innerHTML = newEnvTab(id)

    tabContainer.appendChild(divNode)
    tabs.push(id)
    currentTab = id
    setTabsInRequestTab(currentTab);
    setTabsInAuthTab(currentTab);
    setCurrentTabEditor(currentTab)

    // populate postData
    postData[currentTab] = {
        id: id,
        type: "New Env"
    }
    refreshEnvs()
}

function createGlobalEnv() {
    if(checkTeamIsPersonal()) {
        addEnvIdb({
            EnvId: "__globalEnv",
            name: "Global",
            vars: []
        }, (done, newEnv) => {
            // log(done, newEnv)
            // refreshEnvs()
        })
    } else {
        // network
        axios.post(url + "envs", {
            EnvId: "__globalEnv",
            name: "Global",
            vars: [],
            teamId: currentTeam.id
        }).then(res => {

        })
    }
}

function createEnvName(evt) {
    evt.target.innerHTML = "Creating..."
    evt.target.setAttribute("disabled", null)

    if(getFromWindow(`${currentTab}EnvName`).value.length <= 0) {
        return
    }
    log(getFromWindow(`${currentTab}EnvName`).value)
    if(checkTeamIsPersonal()) {
        addEnvIdb({
            EnvId: "Env" + Date.now(),
            name: getFromWindow(`${currentTab}EnvName`).value,
            vars: []
        }, (done, newEnv) => {
            log(done, newEnv)
            refreshEnvs()
        })
    } else {
        // network
        axios.post(url + "envs", {
            teamId: currentTeam.id,
            name: getFromWindow(`${currentTab}EnvName`).value,
            vars: []
        }).then(res => {
            refreshEnvs()
        })
    }
    evt.target.innerHTML = "Create Env"
    evt.target.removeAttribute("disabled")
    refreshEnvs()
}

function refreshEnvs() {
    if(checkTeamIsPersonal()) {
        refreshEnvsIdb()
    } else {
        refreshEnvsNetwork()
    }
}

function refreshEnvsIdb() {
    var envsListNode = getFromWindow(`${currentTab}EnvsList`)
    envsListNode.innerHTML = "Loading Envs..."
    var htmlStr = ""
    loadEnvsIdb((done, envs) => {
        Envs = envs
        if(done) {
            for (var index = 0; index < envs.length; index++) {
                var env = envs[index];
                var id = "Env" + Date.now() + env.EnvId
                htmlStr += `
                            <li class="EnvListItem" onclick="return setEnvVars(event, '${env.EnvId}')">
                                <div style="width: 100%; display: flex; align-items: center;" >
                                    <a style="padding: 0.4em 0.1em;">${env.name}</a>
                                </div>
                                <span class="icon-options" style="float: right; padding: 4px; position: relative;" onclick="return showDropdown('.${currentTab}${id}envOptionsDropdown')">
                                            <div class="dropdown ${currentTab}${id}envOptionsDropdown close" style="left: unset; right: 0;">
                                                <ul>
                                                    <li><a onclick="return renameEnvModal(event, '${env.EnvId}')">Rename</a></li>
                                                    <li><a onclick="return deleteEnv(event, '${env.EnvId}')">Delete</a></li>
                                                </ul>
                                            </div>                        
                                </span>
                            </li>
                `
            }
        }
        envsListNode.innerHTML = htmlStr
        loadEnvsForDropdown()
    })
}

// TODO: implement
function refreshEnvsNetwork() {
    var envsListNode = getFromWindow(`${currentTab}EnvsList`)
    envsListNode.innerHTML = "Loading Envs..."
    axios.get(url + "/envs/team/" + currentTeam.id)
        .then(res => {
            var envs = res.data
            var htmlStr = ""
            envs.forEach(env => {
                var id = "Env" + Date.now() + env.EnvId
                htmlStr += `
                            <li class="EnvListItem" onclick="return setEnvVars(event, '${env.EnvId}')">
                                <div style="width: 100%; display: flex; align-items: center;" >
                                    <a style="padding: 0.4em 0.1em;">${env.name}</a>
                                </div>
                                <span class="icon-options" style="float: right; padding: 4px; position: relative;" onclick="return showDropdown('.${currentTab}${id}envOptionsDropdown')">
                                            <div class="dropdown ${currentTab}${id}envOptionsDropdown close" style="left: unset; right: 0;">
                                                <ul>
                                                    <li><a onclick="return renameEnvModal(event, '${env.EnvId}')">Rename</a></li>
                                                    <li><a onclick="return deleteEnv(event, '${env.EnvId}')">Delete</a></li>
                                                </ul>
                                            </div>                        
                                </span>
                            </li>
                `
            })
            envsListNode.innerHTML = htmlStr
            loadEnvsForDropdown()
    })
}

function setEnvVars(event, envId) {
    // remove last clicked
    if(setEnvVars.lastClicked) {
        if(!event.target.isSameNode(setEnvVars.lastClicked.target)) {
            setEnvVars.lastClicked.target.style.backgroundColor = "unset"
        }
        setEnvVars.lastClicked = { envId, target: event.target }
    } else setEnvVars.lastClicked = {envId, target: event.target }

    if(event.target.style.backgroundColor !== "white" && event.target.style.backgroundColor !== "rgb(221, 221, 221)")
        event.target.style.backgroundColor = "rgb(221, 221, 221)"
    else event.target.style.backgroundColor = "unset"

    // find env in Envs
    for (var index = 0; index < Envs.length; index++) {
        var env = Envs[index]
        
            if(env.EnvId == envId) {
                var envVars = env.vars;
                var htmlStr = ""

                for (var i = 0; i < envVars.length; i++) {
                    var vars = envVars[i];
                    htmlStr += `
                        <tr>
                            <td><span id="${vars.id}NameVar">${vars.name}</span></td>
                            <td><span id="${vars.id}ValueVar">${vars.value}</span></td>
                            <td style="box-sizing: border-box;display: flex;">  
                                <span title="Click to Save Vars" id="${vars.id}saveEnvVars" onclick="return saveEnvVars(event, '${env.EnvId}', '${vars.id}')" class="close icon-check" style="color: green; padding: 0.3em;display: block;"></span>
                                <span title="Click to Inline Edit Vars" onclick="return editEnvVars(event, '${env.EnvId}', '${vars.id}')" class="icon-note" style="padding: 0.3em;display: block;"></span>
                                <span title="Click to Delete Vars" onclick="return deleteEnvVars(event, '${env.EnvId}', '${vars.id}')" class="icon-trash" style=" color: red; padding: 0.3em;display: block;"></span>
                            </td>
                        </tr>
                    `;
                }
                getFromWindow(`${currentTab}EnvVarsList`).innerHTML = htmlStr
                return;
            }
        
    }    
}

function deleteEnv(event, EnvId) {
    if(confirm("Do you want to delete this Env?")) {
        if(checkTeamIsPersonal()) {
            deleteRequestIdb(EnvId, (done, res) => {
                log(done, res)
                if (done) {
                    refreshEnvs()                    
                }
            })
        } else {
            // network
            axios.delete(url + "envs", {
                EnvId
            }).then(res => {
                refreshEnvs()
            })
        }
    }
}

function createVarModal(event) {
    var createVarModalStr = `

    <!-- <div class="modal"> -->
        <div class="modal-backdrop createVarModalBackdrop"></div>
        <div class="modal-body" style="">
            <div class="modal-head">
                <h4 style="padding: 0;margin: 0;">Create a Variable</h4>
                <div><span onclick="return closeActiveModals(event)" class="icon-close" style="padding: 10px 9px;padding-right: 1px;"></span></div>
            </div>
            <div class="modal-inner-body">
                <p id="createVarModalError" class="bd-rad-3 color-white bg-red pad-3 close"></p>
                <div class="table-responsive">
                    <table>
                        <thead>
                            <th>NAME</th>
                            <th>VALUE</th>
                            <th>ACTIONS</th>
                        </thead>
                        <tbody>
                            <tr>                                        
                                <td>
                                    <input type="text" id="varName" placeholder="Enter variable name" />
                                </td>
                                <td>
                                    <input type="text" id="varValue" placeholder="Enter variable value" />
                                </td>
                                <td style="box-sizing: border-box;display: flex;">  
                                    <span onclick="return addVar(event)" class="icon-plus" style="padding: 0.3em;display: block;"></span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div>
                    <ul class="listToAddVars" style="height: 212px; overflow-y: scroll;border: 1px solid rgb(221, 221, 221);border-radius: 3px;">
                    </ul>
                </div>
            </div>
            <div class="modal-footer" style="">
                <button onclick="return closeActiveModals(event)" class="createCollectionModalBtn bg-gray color-white pad-6 pad-left-12 pad-right-12">Cancel</button>
                <button onclick="return addAllVars(event)" class="createCollectionModalBtn bg-default color-white pad-6 pad-left-12 pad-right-12">Create</button>
            </div>
        </div>

    <!-- </div> -->
    `
    var mo = document.createElement("div")
    mo.classList.add("modal")
    mo.classList.add("createVarModal")
    mo.innerHTML = createVarModalStr
    closeActiveModals()
    modalsActive.push(mo)
    document.body.appendChild(mo)

    document.querySelector(".modal-backdrop.createVarModalBackdrop").addEventListener("click", () => {
        document.body.removeChild(mo)
        closeActiveModals();
    })
}

function addVar(event) {
    if(!addVar.addedVars) {
        addVar.addedVars = []
    }
    var vName = getFromWindow(`varName`).value
    var vValue = getFromWindow(`varValue`).value
    var id = "var" + Date.now();

    addVar.addedVars.push({
        id: id,
        name: vName,
        value: vValue
    })

    // display
    var li = document.createElement("li")
    li.classList.add(["addedVars" + id])
    li.innerHTML = `
        <span class="pad-6" style="display: flex; justify-content: space-between; margin-top: 4px; width: 100%; background: lightgrey; box-sizing: border-box">
            <span>${vName}</span>
            <span>${vValue}</span>
            <span><button onclick="return removeAddedVar(event, '${id}');">X</button></span>
        </span>
    `
    document.querySelector(".listToAddVars").appendChild(li)
}

// This removes new vars added in the "create variable" modal.
function removeAddedVar(event, id) {
    // remove from array
    addVar.addedVars = addVar.addedVars.filter(v => v.id == id)

    // remove from node.
    document.querySelector(".listToAddVars").removeChild(document.querySelector(`.addedVars${id}`))
}

function addAllVars(evt) {
    evt.target.setAttribute("disabled", null)
    evt.target.innerText = "Creating"
    var envIdToLook = setEnvVars.lastClicked.envId

    // find the Env in Envs
    var resEnv = Envs.find(v => v.EnvId == envIdToLook)
    if (resEnv) {
        for (var index = 0; index < addVar.addedVars.length; index++) {
            var e = addVar.addedVars[index];
            resEnv.vars.push(e)
        }
    }

    if (checkTeamIsPersonal()) {
        updateEnvIdb(resEnv, (done, d) => {
            if (done) {
                refreshEnvVars()                
            }
        })
    } else {
        // network
        axios.put(url + "envs/" + resEnv.EnvId, resEnv).then(res => {
            refreshEnvVars()
            displayNotif("Successfully added variables to environment.", { type: "success" })
        })
    }

    function refreshEnvVars() {
        // refresh Env variables
        var htmlStr = ""
        for (var i = 0; i < resEnv.vars.length; i++) {
            var vars = resEnv.vars[i];
            htmlStr += `
                <tr>
                    <td><span id="${vars.id}NameVar">${vars.name}</span></td>
                    <td><span id="${vars.id}ValueVar">${vars.value}</span></td>
                    <td style="box-sizing: border-box;display: flex;">
                        <span title="Click to Save Vars" id="${vars.id}saveEnvVars" onclick="return saveEnvVars(event, '${resEnv.EnvId}', '${vars.id}', '${vars.id}')" class="close icon-check" style="color: green; padding: 0.3em;display: block;"></span>
                        <span title="Click to Inline Edit Vars" onclick="return editEnvVars(event, '${resEnv.EnvId}', '${vars.id}')" class="icon-note" style="padding: 0.3em;display: block;"></span>
                        <span title="Click to Delete Vars" onclick="return deleteEnvVars(event, '${resEnv.EnvId}', '${vars.id}')" class="icon-trash" style="color: red; padding: 0.3em;display: block;"></span>
                    </td>
                </tr>
            `;
        }
        getFromWindow(`${currentTab}EnvVarsList`).innerHTML = htmlStr

        evt.target.removeAttribute("disabled")
        evt.target.innerText = "Create"
        closeActiveModals()
    }
}

function deleteEnvVars(evt, envId, varId) {
    if(confirm("Do you want to delete this variable?")) {
        var currEnv = Envs.find((v) => v.EnvId == envId)
        currEnv.vars = currEnv.vars.filter((v) => {
            if (v.id !== varId)
                return true
            return false
        })

        if (checkTeamIsPersonal()) {
            updateEnvIdb(currEnv, (done, res) => {
                if(done)
                    refreshEnvs()
            })
        } else {
            // network
            axios.put(url + "envs/" + currEnv.EnvId, currEnv).then(res => {
                refreshEnvs()
            })
        }
    }
}

function editEnvVars(evt, envId, varsId) {
    var nameVar = window[`${varsId}NameVar`]
    var valueVar = window[`${varsId}ValueVar`]

    window[`${varsId}saveEnvVars`].classList.remove("close")

    valueVar.setAttribute("contenteditable", true)
    valueVar.classList.add("EnvInlineEditVar")

    nameVar.setAttribute("contenteditable", true)
    nameVar.classList.add("EnvInlineEditVar")
    nameVar.focus()
}

function saveEnvVars(e, envId, varId) {
    var nameVar = window[`${varId}NameVar`]
    var valueVar = window[`${varId}ValueVar`]

    var name = nameVar.innerText
    var value = valueVar.innerText

    window[`${varId}saveEnvVars`].classList.add("close")

    valueVar.removeAttribute("contenteditable", null)
    valueVar.classList.remove("EnvInlineEditVar")

    nameVar.removeAttribute("contenteditable", null)
    nameVar.classList.remove("EnvInlineEditVar")

    // collect values from "nameVar" and "valueVar"
        var currEnv = Envs.find((v) => v.EnvId == envId);
        currEnv.vars = currEnv.vars.map((v) => {
          if (v.id == varId) {
            return {
              id: varId,
              name,
              value,
            };
          }
          return v
        });

    if (checkTeamIsPersonal()) {
        updateEnvIdb(currEnv, (done, res) => {
            if(done)
                refreshEnvs()
        })
    } else {
        // network
        axios.put(url + "envs/" + currEnv.EnvId, currEnv).then(res => {
            refreshEnvs()
        })
    }
}

function loadEnvsForDropdown() {
    var envsListNode = getFromWindow(`envsList`)
    envsListNode.innerHTML = "Loading Envs..."
    var htmlStr = ""
    if (checkTeamIsPersonal()) {
        loadEnvsIdb((done, envs) => {
            Envs = envs
            if (done) {
                for (var index = 0; index < envs.length; index++) {
                    var env = envs[index];
                    htmlStr += `
                    <li><a onclick="return selectEnv(event, '${env.EnvId}')">${env.name}</a></li>
                `
                }
            }
            htmlStr += `
            <li class="divider"></li>
            <li><a onclick="return createNewEnvTab()">Create New Env</a></li>
        `
            envsListNode.innerHTML = htmlStr
        })
    } else {
        // network        
        axios.get(url + "/envs/team/" + currentTeam.id)
            .then(res => {
                var envs = res.data
                Envs = envs
                var htmlStr = ""
                envs.forEach(env => {
                    var id = "Env" + Date.now() + env.EnvId
                    htmlStr += `
                        <li><a onclick="return selectEnv(event, '${env.EnvId}')">${env.name}</a></li>
                    `
                })
                htmlStr += `
                    <li class="divider"></li>
                    <li><a onclick="return createNewEnvTab()">Create New Env</a></li>
                `
                envsListNode.innerHTML = htmlStr
            }).catch(err => {
                envsListNode.innerHTML = `
                    <li class="divider"></li>
                    <li><a onclick="return createNewEnvTab()">Create New Env</a></li>
                `
            })
    }
}

function selectEnv(event, envId) {
    //id="currentEnvDisplay"
    // set dataSet.value
    var currEnv = Envs.find(v => v.EnvId == envId)
    currentEnv = currEnv
    var currEnvDisplayNode = getFromWindow(`currentEnvDisplay`)
    currEnvDisplayNode.innerText = currentEnv.name
    currEnvDisplayNode.dataset.value = currentEnv.EnvId
}

function renameEnvModal(event, envId) {
    var renameEnvModalStr = `

    <!-- <div class="modal"> -->
        <div class="modal-backdrop renameEnvModalBackdrop"></div>
        <div class="modal-body" style="">
            <div class="modal-head">
                <h4 style="padding: 0;margin: 0;">Rename Env</h4>
                <div><span onclick="return closeActiveModals(event)" class="icon-close" style="padding: 10px 9px;padding-right: 1px;"></span></div>
            </div>
            <div class="modal-inner-body">
                <p id="renameEnvModalError" class="bd-rad-3 color-white bg-red pad-3 close"></p>
                    <div style="margin: 9px 0;">
                        <h4 style="margin: 4px 0;">Env name here:</h4>
                        <input type="text" id="${envId}EnvNewName" placeholder="Env new name here" />
                    </div>                
            </div>
            <div class="modal-footer" style="">
                <button onclick="return closeActiveModals(event)" class="createCollectionModalBtn bg-gray color-white pad-6 pad-left-12 pad-right-12">Cancel</button>
                <button onclick="return renameEnv(event, '${envId}EnvNewName', '${envId}')" class="createCollectionModalBtn bg-default color-white pad-6 pad-left-12 pad-right-12">Rename</button>
            </div>
        </div>

    <!-- </div> -->
    `
    var mo = document.createElement("div")
    mo.classList.add("modal")
    mo.classList.add("renameEnvModal")
    mo.innerHTML = renameEnvModalStr
    closeActiveModals()
    modalsActive.push(mo)
    document.body.appendChild(mo)

    document.querySelector(".modal-backdrop.renameEnvModalBackdrop").addEventListener("click", () => {
        document.body.removeChild(mo)
        closeActiveModals();
    })    
}

function renameEnv(event, envNewName, envId) {
    var targ = event.target
    targ.setAttribute("disabled", true)
    targ.innerText = "Renaming..."

    var newEnvName = window[envNewName].value
    if (newEnvName.length <= 0) {
        var errorNode = window["renameEnvModalError"]
        errorNode.innerText = "Please, type a name"
        errorNode.classList.remove("close")
        return
    }
    var cEnv = Envs.find(v => {
        return v.EnvId == envId
    })

    cEnv.name = newEnvName

    if (checkTeamIsPersonal()) {
        updateEnvIdb(cEnv, (done, res) => {
            if (done) {
                refreshEnvs()
                targ.removeAttribute("disabled", true)
                targ.innerText = "Rename"
                closeActiveModals()
            }
        })
    } else {
        // network
        axios.put(url + "envs/" + cEnv.EnvId, cEnv).then(res => {
            refreshEnvs()
            targ.removeAttribute("disabled", true)
            targ.innerText = "Rename"
            closeActiveModals()
        }).catch(err => {
            targ.removeAttribute("disabled", true)
            targ.innerText = "Rename"
        })
    }
}
