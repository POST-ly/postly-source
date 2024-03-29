// addNewTab(null, true)

function addNewTab(evt, first) {
    var id = "requestTab" + Date.now()

    var h = `<a onclick="return requestTabClick(event, '${id}')" class="mainTabName"><b id="${id}TabMethod">POST</b> <span id="${id}TabName">Untitled request</span></a><span><a class="mainTabClose" onclick="return removeTab(event, '${id}')">X</a></span>`
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
    divNode.innerHTML = createNewTab(id)

    tabContainer.appendChild(divNode)
    tabs.push(id)
    currentTab = id
    setTabsInRequestTab(currentTab);
    // setTabsInAuthTab(currentTab);
    setCurrentTabEditor(currentTab)
    setTabs()

    // populate postData
    postData[currentTab] = {
        url: document.querySelector(`.${currentTab}UrlInput`).value,
        methodType: window[`${currentTab}methodTypeButton`].innerText,
        body: {
            mode: "form",
            form: [],
            raw: {
                lang: "json",
                content: null
            },
            graphql: {
                query: null,
                variables: null
            },
            binary: null
        },
        params: [],
        headers: [],
        tabId: id,
        name: "Untitled request",
        options: {
            previewimgvideo: false,
            downloadres: false,
            useproxy: false
        }
    }
}

function requestTabClick(evt, tabId) {
    currentTab = tabId

    if(tabs.length > 1) {
        var node = document.querySelector(".mainTabContentActive")
        node.classList.remove("mainTabContentActive")
        // node.classList.add("close")

        var mainTabActiveNode = document.querySelector(".mainTabActive")
        mainTabActiveNode.classList.remove("mainTabActive")

        document.querySelector(`.${currentTab}MainTab`)
            .classList.add("mainTabActive")

        // window[tabId].classList.remove("close")
        window[tabId].classList.add("mainTabContentActive")
    }
}

// TODO
function removeTab(evt, tabId) {
    tabs = tabs.filter(tab => tab != tabId)

    mainTab.removeChild(document.querySelector(`.${tabId}MainTab`))

    tabContainer.removeChild(window[tabId])

    if(tabs.length > 0) {

        // remove all active tabs and contents
        var mainTabActiveNode = document.querySelector(".mainTabActive")
        if(mainTabActiveNode)
            mainTabActiveNode.classList.remove("mainTabActive")

        var mainTabContentActiveNode = document.querySelector(".mainTabContentActive")
        if(mainTabContentActiveNode)
            mainTabContentActiveNode.classList.remove("mainTabContentActive")

        // set the current tab all actives
        currentTab = tabs[0]
        var node = document.querySelector(`.${currentTab}MainTab`)

        node.classList.add("mainTabActive")
        // node.classList.remove("close")
        window[currentTab].classList.add("mainTabContentActive")
    }
    // remove from postData
    delete postData[tabId]
}

function setTabsInRequestTab(tabId) {
    var nodePostDataCntTab = document.querySelectorAll("." + tabId + "postDataCntTab")
    for (var i = 0; i < nodePostDataCntTab.length; i++) {
        var tab = nodePostDataCntTab[i]
        tab.addEventListener("click", postDataTabHandler)
    }
}

function postDataTabHandler(evt) {
    // get active tab
    var activeTab = document.querySelector(`.${currentTab}postDataCntTab.tab-active`)
    activeTab.classList.remove("tab-active")

    // switch tabs
    var newNode = evt.target.parentNode;
    newNode.classList.add("tab-active")

    // remove the already active tab content
    var d = `.${currentTab}postDataCntTabContent.tab-content-active`
    var tabName = newNode.dataset.name
    document.querySelector(`.${currentTab}postDataCntTabContent.tab-content-active`)
        .classList.remove("tab-content-active")

    // make the tab-content of the current selected tab active
    // log(`.${currentTab}postDataCntTabContent.tab-content`)
    var tabContents = document.querySelectorAll(`.${currentTab}postDataCntTabContent.tab-content`)
    for (var i = 0; i < tabContents.length; i++) {
        var t = tabContents[i]
        if(t.dataset.name == tabName) {
            t.classList.add("tab-content-active")
            break
        }
    }

    switch (tabName) {
        case "tests":
            // check Tests has been set for this tab
            if(!currentEditors[currentTab][tabName]) {
                var value = "// Write your tests in JavaScript here.\n"
                if(postData[currentTab].tests) {
                    value = postData[currentTab].tests
                }
                currentEditors[currentTab][tabName] = setCodeEditor(document.getElementById(`${currentTab}postDataCntTabContentTestsEditor`), {
                    value: value,
                    lineNumbers: true, 
                    tabSize: 2,
                    mode: {
                        name: "javascript"
                    },
                    lineWrapping: true,
                    theme: "default",
                    autoRefresh: true
                })
                if(postData[currentTab].tests) {
                    currentEditors[currentTab][tabName].testSet = true
                }
            } else {
                var testScript = postData[currentTab].tests || "// Write your tests in JavaScript here.\n"
                var testEditor = getCodeEditor(currentTab, "tests")
                if(!testEditor.testSet) {
                    testEditor.testSet = true
                    testEditor.setValue(testScript)
                }
            }
            break;
        case "prerequest":
            if(!currentEditors[currentTab][tabName]) {
                var value = "// Pre-request script(JavaScript) goes here.\n"
                if(postData[currentTab].prerequest) {
                    value = postData[currentTab].prerequest
                }
                currentEditors[currentTab][tabName] = setCodeEditor(document.getElementById(`${currentTab}postDataCntTabContentPreRequestScriptEditor`), {
                    value: value,
                    lineNumbers: true, 
                    tabSize: 2,
                    mode: {
                        name: "javascript"
                    },
                    lineWrapping: true,
                    theme: "default",
                    autoRefresh: true
                })
                if(postData[currentTab].prerequest) {
                    currentEditors[currentTab][tabName].prerequestSet = true
                }
            } else {
                var prerequestScript = postData[currentTab].prerequest || "// Pre-request script(JavaScript) goes here.\n"
                var prerequestEditor = getCodeEditor(currentTab, "prerequest")
                if(!prerequestEditor.prerequestSet) {
                    prerequestEditor.prerequestSet = true
                    prerequestEditor.setValue(prerequestScript)
                }
            }
        break;
        case "previewrequest":
        // set code snippet here
        // ${tabId}postDataCntTabContentPreviewRequestEditor
        // ${tabId}previewRequestCodeSnippet
        if(!currentEditors[currentTab][tabName]) {
            var code = generateCodeSnippet(document.getElementById(`${currentTab}previewRequestCodeSnippet`).dataset.value)
            currentEditors[currentTab][tabName] = setCodeEditor(document.getElementById(`${currentTab}postDataCntTabContentPreviewRequestEditor`), {
                value: code,
                lineNumbers: true, 
                readOnly: true,
                tabSize: 2,
                mode: {
                    name: "javascript"
                },
                lineWrapping: true,
                theme: "default",
                autoRefresh: true
            })
        }
        break;
        case "visualizer":
            if(!currentEditors[currentTab][tabName]) {
                var value = "// Write your Visualizer code here. \n"
                if(postData[currentTab].visualizer) {
                    value = postData[currentTab].visualizer
                }
                currentEditors[currentTab][tabName] = setCodeEditor(document.getElementById(`${currentTab}postDataCntTabContentVisualizerEditor`), {
                    value: value,
                    lineNumbers: true, 
                    tabSize: 2,
                    mode: {
                        name: "javascript"
                    },
                    lineWrapping: true,
                    theme: "default",
                    autoRefresh: true
                })
                if(postData[currentTab].visualizer) {
                    currentEditors[currentTab][tabName].visualizerSet = true
                }
            } else {
                var visualizerScript = postData[currentTab].visualizer || "// Write your Visualizer code here. \n"
                var visualizerEditor = getCodeEditor(currentTab, "visualizer")
                if(!visualizerEditor.visualizerSet) {
                    visualizerEditor.visualizerSet = true
                    visualizerEditor.setValue(visualizerScript)
                }
            }
            break;
        default:
            break;
    }
}

function createNewReqTab(evt, tabId, data) {
        // check if tabId exist in the tabs
        var tabExists = false
        tabs.filter(tab => {
            if(tab == tabId)
                tabExists = true
        })

        // log(data, tabs, tabExists)

        // if the tab exist, make it active
        if(tabExists) {
            currentTab = tabId
            var node = document.querySelector(".mainTabContentActive")
            node.classList.remove("mainTabContentActive")
            // node.classList.add("close")

            var mainTabActiveNode = document.querySelector(".mainTabActive")
            mainTabActiveNode.classList.remove("mainTabActive")

            document.querySelector(`.${currentTab}MainTab`)
                .classList.add("mainTabActive")

            // window[tabId].classList.remove("close")
            window[tabId].classList.add("mainTabContentActive")
        } else {
            // if the tab does not exist, add it to the tab and make it active
            var id = tabId
            var h = `<a onclick="return requestTabClick(event, '${id}')" class="mainTabName"><b id="${id}TabMethod">${data.methodType}</b> <span id="${id}TabName">${data.name}</span></a><span><a class="mainTabClose" onclick="return removeTab(event, '${id}')">X</a></span>`
            var li = document.createElement("li")
            li.classList.add("mainTab")
            li.classList.add("mainTabActive")
            li.classList.add(`${id}MainTab`)
            // li.setAttribute("id", id)
            li.innerHTML = h 
            mainTab.appendChild(li)

            var first = tabs.length == 0 ? true : false

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
            divNode.innerHTML = createNewTab(id)

            tabContainer.appendChild(divNode)
            tabs.push(id)
            currentTab = id
            setTabsInRequestTab(currentTab)
            // setTabsInAuthTab(currentTab)
            setCurrentTabEditor(currentTab)
            setTabs()

            // populate postData
            postData[currentTab] = data
            postData[currentTab].methodType = data.methodType /* window[`${currentTab}methodTypeButton`].innerText */
            postData[currentTab].tabId = id
            postData[currentTab].name = data.name // set the request name

            /*
            if(!postData[currentTab].body)
                postData[currentTab]["body"] = []
            
            */

            if(!postData[currentTab].params)
                postData[currentTab]["params"] = []
            if(!postData[currentTab].headers)
                postData[currentTab]["headers"] = []

            // TODO: set visualizer, tests and pre-request scripts
            if(postData[currentTab].tests) {
                // getCodeEditor(currentTab) = postData[currentTab].tests
            }
            // ${tabId}postDataCntTabContentVisualizerEditor
            // ${tabId}postDataCntTabContentPreRequestScriptEditor
            // ${tabId}postDataCntTabContentTestsEditor
            
            // TODO: set settings
            getFromWindow(`${tabId}requestTimeout`).value = postData.timeout || 0
            getFromWindow(`${tabId}noOfRequestRetries`).value = postData.retries || 0
            
            // set url
            document.querySelector(`.${tabId}UrlInput`).value = data.url

            // set method type
            window[`${tabId}methodTypeButton`].innerText = data.methodType

            // set options
            if(postData[currentTab].options) {
                getFromWindow(`${tabId}previewImgVideoOpt`).checked = postData[currentTab].options.previewimgvideo
                getFromWindow(`${tabId}downloadResponseOpt`).checked = postData[currentTab].options.downloadres
                getFromWindow(`${tabId}useProxyOption`).checked = postData[currentTab].options.useproxy
            }

            // set auth
            if (data.authorization) {
                setRequestAuth(data.authorization, tabId)
            }

            // set body
            if(data.body.mode == "form") {
                // add body   
                if(data.body.form) {
                    data.body.form.forEach(function(bdy) {
                        window[`${tabId}bodyKey`].value = bdy.key
                        window[`${tabId}bodyValue`].value = bdy.value
                        addBody(window[`${tabId}bodyKey`], window[`${tabId}bodyValue`], true, bdy.id)
                    });
                }         
            }
            if (data.body.mode) {
                setBodyType(data.body.mode, data.body.mode[0].toUpperCase() + data.body.mode.slice(1))
            }

            // add headers
            data.headers.forEach(function(header) {
                window[`${tabId}headersKey`].value = header.key
                window[`${tabId}headersValue`].value = header.value
                addHeaders(window[`${tabId}headersKey`], window[`${tabId}headersValue`], true, header.id)
            });

            // add params
            data.params.forEach(function(_param) {
                window[`${tabId}paramsKey`].value = _param.key
                window[`${tabId}paramsValue`].value = _param.value
                addParams(window[`${tabId}paramsKey`], window[`${tabId}paramsValue`], true, _param.id)
            });            

            if(data.response) {
                setReqResponse(data.response, tabId)
            }
        }
}

function setResponseTab(event, tabId, what) {
    // make the response tab active

    // remove the active response tab
    document.querySelector(`.${tabId}responseTab.tab-active`)
        .classList.remove("tab-active")

    // make the clicked tab active
    event.target.parentNode.classList.add("tab-active")

    // remove the active resonse tab content
    document.querySelector(`.tab-content.${tabId}responseTabContent.tab-content-active`)
        .classList.remove("tab-content-active")

    // make the cliked tab content active
    document.querySelector(`.tab-content.${tabId}responseTabContent.${what}`)
        .classList.add("tab-content-active")
}

/**
 * Fired from "Save" button in the request builder.
 * @param {*} tabId 
 * @param {*} openModal 
 */
function saveRequest(tabId, openModal) {
    if(openModal)
        attachSaveModal()
        /*document.querySelector(".saveModal")
            .classList.toggle("close") */
    else {

        collectAllRequestData(tabId)
        /*
        // collect all data
        postData[tabId].url = document.querySelector(`.${currentTab}UrlInput`).value
        postData[tabId].teamId = currentTeam.id

        // collection test, pre-request script, and visualizer
        var testsEditor = getCodeEditor(tabId, "tests")
        var prerequestEditor = getCodeEditor(tabId, "prerequest")
        var visualizerEditor = getCodeEditor(tabId, "visualizer")
        if(testsEditor) {
            postData[tabId].tests = testsEditor.getValue()
        }
        if(prerequestEditor) {
            postData[tabId].prerequest = prerequestEditor.getValue()
        }
        if(visualizerEditor) {
            postData[tabId].visualizer = visualizerEditor.getValue()
        }

        if(!postData[currentTab].requestId) {
            postData[currentTab].requestId = "requestId" + Date.now()
        }
        */

        // check if the request belongs to a collection
        if(!postData[currentTab].collectionId) {
            // if not display add to collection modal
            addToCollection(tabId)
        } else {
            if(!checkTeamIsPersonal()) {
                // edit request on server
                axios.post(url + "collection/update/request", getCurrTab()).then(res => {
                    if(res.data.error) {
                        displayNotif(res.data.error, { type: "danger" })
                        return
                    }
                    refreshCollections()
                })
            } else {
                setReqColId()
                updateRequest(postData[currentTab], (done, res) => {
                    log("saveRequest:",done, res)
                    if(done) {
                        refreshCollections()                        
                    }
                })
            }
        }

        // add to history
        if (checkTeamIsPersonal()) {
            getHistory(currentTab, (found, data) => {
                if (found == false) {
                    addHistory({
                        teamId: postData[currentTab].teamId,
                        tabId: postData[currentTab].tabId,
                        requestId: postData[currentTab].requestId
                    }, (done, addedData) => {
                        if (done == true) {
                            //log("Added Data:", addedData)
                        }
                    })
                } else {
                    // update record
                    updateHistory({
                        teamId: postData[currentTab].teamId,
                        tabId: postData[currentTab].tabId,
                        requestId: postData[currentTab].requestId
                    }, (done, updateData) => {
                        if (done == true) {
                            //log("Updated Data:", updateData)
                        }
                    })
                }
                window[`${currentTab}TabName`].innerHTML = postData[currentTab].name
                window[`${currentTab}TabMethod`].innerHTML = postData[currentTab].methodType

                refreshHistoryTab()
            })
        } else {
            // network
        }
    }
}

/**
 * Fired from "Save As" option in the request builder.
 * @param {*} evt 
 */
function saveRequestUrlName(evt) {
    var tabId = currentTab
    var requestName = requestUrlName.value
    if(requestName.length <= 0) {
        modalRequestError.innerHTML = "Please, enter a request name."
        modalRequestError.classList.remove("close")
        return;
    }
    evt.target.innerText = "saving..."
    evt.target.setAttribute("disabled", null)

    postData[currentTab]["name"] = requestName
    collectAllRequestData(currentTab)
    /*
    if(!postData[currentTab].requestId) {
        postData[currentTab].requestId = "requestId" + Date.now()
    }

    // TODO: gather all the tests and pre-request scripts.

    postData[currentTab]["teamId"] = currentTeam.id
    postData[currentTab]["name"] = requestName

    // collection test, pre-request script, and visualizer
    var testsEditor = getCodeEditor(tabId, "tests")
    var prerequestEditor = getCodeEditor(tabId, "prerequest")
    var visualizerEditor = getCodeEditor(tabId, "visualizer")
    if(testsEditor) {
        postData[tabId].tests = testsEditor.getValue()
    }
    if(prerequestEditor) {
        postData[tabId].prerequest = prerequestEditor.getValue()
    }
    if(visualizerEditor) {
        postData[tabId].visualizer = visualizerEditor.getValue()
    }

    postData[currentTab].url = document.querySelector(`.${currentTab}UrlInput`).value

    if(selectedColId) {
        postData[currentTab]["collectionId"] = selectedColId
    }
    */

    if (!checkTeamIsPersonal()) {
        var currTab = getCurrTab()
        if (!currTab.requestId) {
            // check a collection is selected.
            if (!currTab.collectionId) {
                displayNotif("Please, select a collection.", {type: "danger"})
                evt.target.innerText = "Save"
                evt.target.removeAttribute("disabled")
                return;
            }

            // add as new request
            // post to network
            axios.post(url + "/collection/add/request/" + currTab.collectionId, currTab)
                .then(res => {
                    evt.target.innerText = "Save"
                    evt.target.removeAttribute("disabled")
                    if(res.data.error) {
                        displayNotif(res.data.error, { type: "danger" })
                        return
                    }
                    refreshCollections()
                    var addedReq = res.data
                    currTab.requestId = addedReq.requestId

                    modalRequestError.innerHTML = ""
                    modalRequestError.classList.add("close")
                    requestUrlName.value = ""
                    window[`${currentTab}TabName`].innerHTML = requestName
                    window[`${currentTab}TabMethod`].innerHTML = currTab.methodType

                    closeActiveModals()
                    displayNotif("Successfully added request to collection", { type: "success" })
                }).catch(err => {
                    evt.target.innerText = "Save"
                    evt.target.removeAttribute("disabled")
                    displayNotif("Error occured while adding request to collection", { type: "danger" })
                })
        } else {
            // edit request on server
            axios.post(url + "/collection/update/request", currTab)
                .then(res => {
                    evt.target.innerText = "Save"
                    evt.target.removeAttribute("disabled")
                    if(res.data.error) {
                        displayNotif(res.data.error, { type: "danger" })
                        return
                    }
                    modalRequestError.innerHTML = ""
                    modalRequestError.classList.add("close")
                    requestUrlName.value = ""
                    refreshCollections()
                    window[`${currentTab}TabName`].innerHTML = requestName
                    window[`${currentTab}TabMethod`].innerHTML = postData[currentTab].methodType
                    closeActiveModals()
                }).catch(err => {
                    evt.target.innerText = "Save"
                    evt.target.removeAttribute("disabled")
                })            
        }     
    } else {
        setReqColId()
        updateRequest(postData[currentTab], (doneReqUpdate, res) => {
            log(doneReqUpdate, res)
            // reset the modal    
            evt.target.innerText = "Save"
            evt.target.removeAttribute("disabled")
            if (doneReqUpdate) {
                modalRequestError.innerHTML = ""
                modalRequestError.classList.add("close")
                requestUrlName.value = ""
                refreshCollections()
                window[`${currentTab}TabName`].innerHTML = requestName
                window[`${currentTab}TabMethod`].innerHTML = postData[currentTab].methodType
                closeActiveModals()
            }
        })
    }

    // update and refresh history
    if (checkTeamIsPersonal()) {
        getHistory(currentTab, (found, data) => {
            if (found == false) {
                // log("Adding history")
                addHistory({
                    teamId: postData[currentTab].teamId,
                    tabId: postData[currentTab].tabId,
                    requestId: postData[currentTab].requestId
                }, (done, addedData) => {
                    if (done == true) {
                        // log("Added Data:", updateData)
                    }
                })
            } else {
                // update record
                // log("Updating history")
                updateHistory({
                    teamId: postData[currentTab].teamId,
                    tabId: postData[currentTab].tabId,
                    requestId: postData[currentTab].requestId
                }, (done, updateData) => {
                    if (done == true) {
                        // log("Updated Data:", updateData)
                    }
                })
            }
            window[`${currentTab}TabName`].innerHTML = requestName
            window[`${currentTab}TabMethod`].innerHTML = postData[currentTab].methodType
            refreshHistoryTab()
        })
    } else {
        // network
    }
}

function collectAllRequestData(tabId) {
    // TODO: gather all the tests and pre-request scripts.

    postData[currentTab]["teamId"] = currentTeam.id

    // collect all data
    postData[tabId].url = document.querySelector(`.${currentTab}UrlInput`).value
    postData[tabId].teamId = currentTeam.id

    // collection test, pre-request script, and visualizer
    var testsEditor = getCodeEditor(tabId, "tests")
    var prerequestEditor = getCodeEditor(tabId, "prerequest")
    var visualizerEditor = getCodeEditor(tabId, "visualizer")
    if(testsEditor) {
        postData[tabId].tests = testsEditor.getValue()
    }
    if(prerequestEditor) {
        postData[tabId].prerequest = prerequestEditor.getValue()
    }
    if(visualizerEditor) {
        postData[tabId].visualizer = visualizerEditor.getValue()
    }

    if(selectedColId) {
        postData[currentTab]["collectionId"] = selectedColId
    }
    setBodyForSave()
}

function setReqColId() {
    if (!postData[currentTab].requestId) {
        postData[currentTab].requestId = "requestId" + Date.now()
    }
}

function setRequestAuth(auth, tabId) {
    // set .${tabId}AuthTab.tab
    var authName = auth.type

    /*
    document.querySelectorAll(`.${tabId}AuthTab.tab`)
    .dataset.tab = authName
    */

    switch (authName) {
        case 'Basic':
            getFromWindow(`${tabId}authBasicUsername`).value = auth.username
            getFromWindow(`${tabId}authBasicPassword`).value = auth.password
            break;
        case 'Bearer':
            getFromWindow(`${tabId}authBearerToken`).value = auth.token
            break;
        case "Digest":
            break;

        case "APIKey":
            getFromWindow(`${tabId}authAPIKey`).value = auth.auth_key
            getFromWindow(`${tabId}authAPIValue`).value = auth.auth_value
            getFromWindow(`${tabId}setApiKeyAddToType`).dataset.value = auth.whereToAdd
            if (auth.whereToAdd == "params") {
                getFromWindow(`${tabId}setApiKeyAddToType`).innerHTML = "Query Params"
            } else {
                if (auth.whereToAdd == "header") {
                    getFromWindow(`${tabId}setApiKeyAddToType`).innerHTML = "Header"
                }
            }
            break;

        default:
            break;
    }

    authName = `${tabId}AuthTab:` + authName.toLowerCase()

    // remove the active tab and tab-content
    document.querySelector(`.${tabId}AuthTab.tab-active`).classList.remove("tab-active")
    document.querySelector(`.${tabId}AuthTab.tab-content-active`).classList.remove("tab-content-active")

    // data-tab="${tabId}AuthTab:apiKey"
    document.querySelectorAll(`.${tabId}AuthTab.tab`).forEach(n => {
        if (n.dataset.tab.toLowerCase() == authName.toLowerCase()) {
            n.classList.add("tab-active")
        }
    })

    document.querySelectorAll(`.${tabId}AuthTab.tab-content`).forEach(n => {
        if (n.dataset.tab.toLowerCase() == authName.toLowerCase()) {
            n.classList.add("tab-content-active")
        }
    })

    // check if icon-check exist and remove it
    var nodeExist = document.querySelector(`.${tabId}AuthTabCheck.icon-check`)
    if (nodeExist) {
        nodeExist.parentNode.removeChild(nodeExist)
    }
    // set this 
    document.querySelector(`.${tabId}AuthTab.tab-active`)
        .innerHTML += `<span class="${tabId}AuthTabCheck icon-check" style="padding-right: 8px; color: rgb(221,75,57); font-weight: 800;" class="icon-check"></span>`
}

function setReqResponse(res, tabId) {
    try {
        // set response headers
        setResponseHeaders(res.headers, tabId)

        // set response status
        setResponseStatus(res.status, tabId)

        // set response status text
        setResponseStatusText(res.statusText, tabId)

        var data = res.data

        setDisplay(data, res, false)

        if (res.time) {
            setTimeResponse(res.time.startTime, res.time.endTime)            
        }

        /*
        runTests(res, tabId, event, api)
        runVisualizer(res, tabId, api)
        */

    } catch (error) {
        setDisplay(error.toString(), error, true)
    }
}