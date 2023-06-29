chrome.action.onClicked.addListener(()=>{
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, 
            {
                action: "checkRender"
            }, function(response) {
                console.log(response)
                if(response.message == "currentEditableState"){
                    let current = response.currentEditableState
                    chrome.action.setIcon({tabId:tabs[0].id,path : {
                        "16": `logo/logo16${current ? "":"disabled"}.png`,
                        "32": `logo/logo32${current ? "":"disabled"}.png`,
                        "192": `logo/logo192${current ? "":"disabled"}.png`,
                    }}, () => { /* ... */ });
                }
        })

    })
    
});

