
// document.getElementById('main').style.width = '300px';
// document.getElementById('main').style.height = '300px';

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

chrome.tabs.query({"active": true, "lastFocusedWindow": true}, function (tabs) {
    const tabURL = tabs[0].url;
    document.getElementById("greeting").innerHTML = tabURL;
    getGpcResult(tabURL);
});

function getUserPreference() {
    if (!navigator.globalPrivacyControl) {
        return "user GPC peference: false";
    } else {
        return "user GPC preference: true";
    }
}

document.getElementById("userPreference").innerHTML = "Initial " + getUserPreference();
// Initial button text display
if (!navigator.globalPrivacyControl) {
    document.getElementById("changePreference").innerHTML = "Opt in";
} else {
    document.getElementById("changePreference").innerHTML = "Opt out";
}


function onclickFunction() {
    if (!navigator.globalPrivacyControl) {
        navigator.globalPrivacyControl = true;
        document.getElementById("changePreference").innerHTML = "Opt out";
    } else {
        navigator.globalPrivacyControl = false;
        document.getElementById("changePreference").innerHTML = "Opt in";
    }
    document.getElementById("newPreference").innerHTML = "Updated " + getUserPreference();
}

document.getElementById("changePreference").addEventListener("click", onclickFunction);

