let websiteList = new Set();
let currentURL = "";
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ websiteList:new Set() });
    chrome.storage.sync.set({ currentURL: ""});
});