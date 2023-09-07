// set local storage to empty array on install to prevent 'undefined' errors
chrome.runtime.onInstalled.addListener((details) => {
  chrome.storage.local.set({
    shows: [],
  });
  // create context menus
  chrome.contextMenus.create({
    title: "Search TV Show",
    id: "contextMenu1",
    contexts: ["page", "selection"],
  });
  chrome.contextMenus.create({
    title: "Read This Text",
    id: "contextMenu2",
    contexts: ["page", "selection"],
  });
  // data fetching and http requests
  chrome.contextMenus.onClicked.addListener((event) => {
    if (event.menuItemId === "contextMenu1") {
      fetch(`http://api.tvmaze.com/search/shows?q=${event.selectionText}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          chrome.storage.local.set({
            shows: data,
          });
        });
      // speech
    } else if (event.menuItemId === "contextMenu2") {
      chrome.tts.speak(event.selectionText, {
        lang: "en-US",
        rate: 0.5,
      });
    }
  });
});

// message passing
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  console.log(msg);
  console.log(sender);
  sendResponse("received message from background.");
  chrome.tabs.sendMessage(sender.tab.id, "Got your message from background");
});

// chrome.storage.local.get(["text"], (res) => {
//   console.log(res);
// });
