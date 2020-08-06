window.addEventListener("DOMContentLoaded", () => {

    // check the user is logged in
    try {
        /*
            user = JSON.parse(localStorage.getItem("user"))    
        */
    } catch (err) {
        /*
            user = { name: "nnamdi chidu", id: 0 }
        */
    }

    try {
        if(!user) {
            /*
                localStorage.setItem("user", JSON.stringify({ name: "nnamdi chidu", id: 0 }))
                user = { name: "nnamdi chidu", id: 0 }
            */
        }
    } catch (err) {}

    // get the prev team the user is working on
    // localStorage.setItem("currentTeam", JSON.stringify({ id: 1, ​name: "forLoop Africa Team" }));
    try {
        currentTeam = JSON.parse(localStorage.getItem("currentTeam"));
        if (!currentTeam) {
            currentTeam = { id: "Personal", name: "Personal Team" }
        } else {
            if (currentTeam.id == "personal") {
                currentTeam = { id: "Personal", name: "Personal Team" }                
            } else {
                loadATeam(currentTeam)
            }
        }
    } catch(e) {
        currentTeam = { id: "Personal", name: "Personal Team" }         
    }
    // currentTeam = {id: 1}

    // attachCollectionModal()
    // attachSaveModal()
    if (checkTeamIsPersonal()) {
        setupMockServersIdb()
        setUpCollectionsIdb()
        setUpRequestsIdb()
        setUpHistoryIdb()
        setUpEnvIdb()        
    }

    loadTeams()
    renderAuthButtons()

    loadEnvsForDropdown()

    addNewTab(null, true)
    setVisualizerData()

    renderTeamChat()

    refreshHistoryTab()
    refreshCollections()

    currentTeamDisplay.innerText = currentTeam.name

    /*OverlayScrollbars(document.getElementById("mainTab"), {
        overflowBehavior: {
            x: "scroll",
            y: "hide"
        },
        scrollbars : {
            visibility: "auto"
        }
    });*/
  /*var Scrollbar = window.Scrollbar;

  Scrollbar.init(document.querySelector('#mainTab'));*/

})
