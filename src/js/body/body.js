function setBodyType(type, name) {
    // <span id="${tabId}setBodyType" data-value="form">Form</span> <span class=

    // remove body tab currently active
    
    var spanNode = getFromWindow(`${currentTab}setBodyType`)
    var nodeToDeAct = getFromWindow(`${currentTab}Body${spanNode.dataset.value}`)
    nodeToDeAct.classList.add("close")

    spanNode.innerText = name
    spanNode.dataset.value = type

    // id="${tabId}Bodygraphql
    var nodeToAct = getFromWindow(`${currentTab}Body${type}`)
    nodeToAct.classList.remove("close")

    if(postData[currentTab].body) {
        postData[currentTab].body.mode = type
    }

    switch (type) {
        case "graphql":
            setGraphQLEditor()            
            break;
        case "raw":
            setRawEditor()
            break;
    
        default:
            break;
    }
}

function bodyBuilder(body) {
    var mode = body.mode
    var data
    switch (mode) {
        case "form":
            var _body = body["form"]
            data = {}
            for (var index = 0; index < _body.length; index++) {
                var bdy = _body[index];
                data[parseVarsAndReplace(bdy.key)] = parseVarsAndReplace(bdy.value)
            }
            break;
        case "raw":
            data = getRawEditorValue();
            break;
        case "graphql":
            /**
             * GraphQL query over HTTP:
             * {"query":"query { product(id: 1) { id, name, category, price }", "variables": null }
             */
            var queryVars = getGraphQLEditorValue()
            data = {
                query: queryVars.query.trim(),
                variables: queryVars.variables.trim()
            }
            break;
        case "binary":
            data = getBinaryValue()
            break;
        default:
            break;
    }
    return data
}

function setBodyForSave() {
    switch (postData[currentTab].body.mode) {
        case "raw":
            var t = getRawEditorValue(true)
            var currTab = getCurrTab()
            currTab.body.raw = t
            break;

        case "graphql":        
            var t = getGraphQLEditorValue(true)
            var currTab = getCurrTab()
            currTab.body.graphql = t
            break; 

        default:
            break;
    }
}

function setHeadersBodyType(headers, postDataBody) {
    var mode = postDataBody.mode
    // postData[currentTab].headers.push({ key: "content-type", value: valType })

    switch (mode) {
        case "form":
            headers["content-type"] = "multipart/form-data"
            break;
        case "graphql":
            headers["content-type"] = "application/json"
            break;
        case "raw":
            var lang = postDatabody["raw"].lang
            setHeadersRawMode(headers, lang)
            break;
        default:
            break;
    }

}

function setHeadersRawMode(headers, lang) {
    var valType
    switch (lang) {
        case "json":
            // set appropriate headers
            valType = "application/json"
            break;
        case "text":
            // set appropriate headers
            valType = "text/plain"
            break;
        case "xml":
            // set appropriate headers
            valType = "text/xml"
            break;
        case "javascript":
            // set appropriate headers
            valType = "application/javascript"
            break;
        case "html":
            // set appropriate headers
            valType = "text/html"
        default:
            break;
    }
    headers["content-type"] = valType
}
