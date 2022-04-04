
// document.getElementById('main').style.width = '300px';
// document.getElementById('main').style.height = '300px';
var background = chrome.extension.getBackgroundPage();


// Add a callback when HTML is loaded.
document.addEventListener('DOMContentLoaded', domLoadedCallback, false);
// This is a callback method once HTML is loaded. 
function domLoadedCallback() {
    // get the origin url 
	chrome.storage.sync.get('headerInjectionEnable', function(items) {
        if (items.headerInjectionEnable == true) {
			navigator.globalPrivacyControl = true;
            document.getElementById("changePreference").innerHTML = "Opt in";
			document.getElementById("newPreference").innerHTML = "Updated " + getUserPreference();
        }
		else{
			navigator.globalPrivacyControl = false;
			document.getElementById("changePreference").innerHTML = "Opt out";
			document.getElementById("newPreference").innerHTML = "Updated " + getUserPreference();

		}
    });
	/*
	
	*/
	displayList();
}

function rewriteUserAgentHeader(e) {
    var gpc_header = new Headers();
    gpc_header.name = "gpc";
    gpc_header.value = "true";
    e.requestHeaders.push(gpc_header);
    e.requestHeaders.forEach(function(header){
      if (header.name.toLowerCase() == "gpc") {
        header.value = "true";
        //alert("Has conformed to GPC");
      }
    });

}

function getGpcResult(url) {
    const gpcSuffix = ".well-known/gpc.json";
    jQuery.getJSON(url + gpcSuffix, function(data) {
        if (data.gpc == true) {
            document.getElementById("gpc").innerHTML = "Website abides to GPC";
        } else {
            document.getElementById("gpc").innerHTML = "Website does not abides to GPC";
        }
    })
    .fail(function() {
        document.getElementById("gpc").innerHTML = "Website does not have GPC configuration";
    });
}

chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    let tabURL = tabs[0].url;
    background.currentURL = tabURL;
    document.getElementById("greeting").innerHTML = tabURL;
    getGpcResult(tabURL);
});

function getUserPreference() {
    if (!navigator.globalPrivacyControl) {
        return "user GPC preference: false";
    } else {
        return "user GPC preference: true";
    }
}
/*
document.getElementById("userPreference").innerHTML = "Initial " + getUserPreference();
// Initial button text display
if (!navigator.globalPrivacyControl) {
    document.getElementById("changePreference").innerHTML = "Opt out";
} else {
    document.getElementById("changePreference").innerHTML = "Opt in";
}
*/

function displayList() {
    let list = document.getElementById("websiteList");
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
    background.websiteList.forEach((item)=>{
        let li = document.createElement("li");
        li.innerText = item;
        list.appendChild(li);
    })
}

function onclickFunction() {
    if (!navigator.globalPrivacyControl) {
		
		setHeaders();
        navigator.globalPrivacyControl = true;
        document.getElementById("changePreference").innerHTML = "Opt in";
        if(background.websiteList == undefined){
            background.websiteList = new Set();
        }
        background.websiteList.add(background.currentURL);
        displayList();
    } else {
		removeHeaders();
        navigator.globalPrivacyControl = false;
        document.getElementById("changePreference").innerHTML = "Opt out";
        if(background.websiteList == undefined){
            background.websiteList = new Set();
        }
        background.websiteList.delete(background.currentURL);
        displayList();
    }
    document.getElementById("newPreference").innerHTML = "Updated " + getUserPreference();
}

document.getElementById("changePreference").addEventListener("click", onclickFunction);

function setHeaders() {
	//alert("setheaders");
    chrome.storage.sync.set({
        'headerJson': [{ "name": "Sec-GPC", "value": "1" }]
    }, function () { });
    chrome.storage.sync.set({
        'headerInjectionEnable': true
    }, function () { });
}

function removeHeaders() {
	//alert("Removed headers");
    chrome.storage.sync.set({
        'headerJson': undefined
    }, function () { });
    chrome.storage.sync.set({
        'headerInjectionEnable': false
    }, function () { });
}