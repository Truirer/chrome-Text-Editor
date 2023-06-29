// This script gets injected into any opened page
// whose URL matches the pattern defined in the manifest
// (see "content_script" key).
// Several foreground scripts can be declared
// and injected into the same or different pages.
let currentEditableState = true;
function create(name, props) {
    let el = document.createElement(name);
    for (let p in props) {
        if (p == "innerText") {
            el.innerText = props[p];
        } else if (p == "innerHTML") {
            el.innerHTML = props[p];
        } else {
            el.setAttribute(p, props[p]);
        }
    }
    return el;
}
function renderer(){
    let div = document.createElement("div")
    div.id = "contentEditable"
    div.innerHTML ="Content is Editable"
    document.body.appendChild(div)
}

renderer()
function updateMessage(currentAttribute){
    document.querySelector("#contentEditable").innerHTML = currentAttribute?  "Content is Editable": "Content is not Editable"
    document.querySelector("#contentEditable").classList.remove("keyframeAnimation")
    window.setTimeout(()=>{
        document.querySelector("#contentEditable").classList.add("keyframeAnimation")        
    })
}
function textNodesUnder(el){
    var n, a=[], walk=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,null,false);
    while(n=walk.nextNode()) a.push(n);
    return a;
}

function addButtonListeners(currentAttribute){
    let allTextNodes = textNodesUnder(document.body)
    allTextNodes.forEach(el=>{
        el.parentElement.setAttribute("contenteditable",currentAttribute)
        if(currentAttribute){
            el.parentElement.classList.add("disabled")
        }
    })
}
function linkEditor(currentAttribute){
    let allLinks = document.querySelectorAll("a")
    if(currentAttribute){
        allLinks.forEach(el=>{
            el.classList.add("disabled")
        })
    }
    else{
        allLinks.forEach(el=>{
            el.classList.remove("disabled")
        })    
    }

    let allClicks = document.querySelectorAll("*")
    if(currentAttribute){
        allClicks.forEach(el=>{
            el.addEventListener("click",remover)
        })
    }
    else{
        allClicks.forEach(el=>{
            el.removeEventListener("click",remover)
        })    
    }
}
function remover(e){
    e.preventDefault();
    return false
}
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request.action === "checkRender"){
            addButtonListeners(currentEditableState)
            updateMessage(currentEditableState)
            linkEditor(currentEditableState)
            sendResponse({
                message:"currentEditableState",
                currentEditableState:currentEditableState
            })
            currentEditableState = !currentEditableState

        }else{
            sendResponse("ok!")
        }


    }
);
