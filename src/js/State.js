var postlyApi= {}

postlyApi.state = {
    url: "http://localhost:5000/api/",
    proxyUrl : "https://node-app08.herokuapp.com/proxy/",

    modalsActive: [],
    tabs : [],
    currentTab: undefined,
    postData : {},

    currentMockServer: undefined,
    mockCalls : false,

    currentEnv: undefined,
    Envs : [],
    envInterpolationStart : "{{",
    envInterpolationEnd : "}}",
    codeGenStrategies : {
        generateCurlCode: generateCurlCode,
        generateNodejsAxiosCode: generateNodejsAxiosCode,
        generateFetchCode: generateFetchCode
    },

    teams : [],
    collections : [],
    postly : {
        // describe
    },

    dropdownsActive : [],
    dropdownClicked : false,

    currentEditors : {},

    currentTeam: undefined,
    user: undefined,
    
    lastEl: undefined,
    selectedColId: undefined

}

function dispatch(action, payload) {
    return reducer(action, payload)
}

function reducer(action, payload) {

}