function removeAgars() {
  chrome.tabs.query({url: "http://agar.io/*"}, function(tabArr) {
    tabArr.forEach(function(tab) {
      chrome.tabs.remove(tab.id);
    });
  });
}

function removeAgarsAndStoreTime() {
  removeAgars();
  //chrome.storage.local.set({ "timeStamp": next.getTime() });
  chrome.storage.local.set({ "timeStamp": Date.now() });
}

function isWeekday() {
  const day = new Date().getDay();
  return (day != 6) && (day != 0)
}
chrome.runtime.onMessage.addListener(function(msg, _, sendResponse) {
  if (msg.counter) {
    chrome.storage.local.get("timeStamp", function(items) {
      console.log("Time stamp" + items.timeStamp);
      if (items.timeStamp && new Date().setMinutes(
            new Date().getMinutes()-25) < items.timeStamp ) {
        chrome.notifications.create("No Access", {
            type: "basic",
            title: "Can not access Agar yet",
            isClickable: false,
            iconUrl: chrome.runtime.getURL('icons/48.png'),
            message: "25-min time interval"});
        removeAgars();
      } else {
        if (items.timeStamp && isWeekday() && new Date().setMinutes(
            new Date().getMinutes()-240) < items.timeStamp) {
          chrome.notifications.create("Hey, take a mindful break and do some stretches", {
            type: "basic",
            title: "Mindful breaks help your memory and stretches make sure your body functions",
            isClickable: false,
            iconUrl: chrome.runtime.getURL('icons/48_cat.png'),
            message: "4 hour time interval"});
          chrome.tabs.create({url: "https://photos.app.goo.gl/PDkpfWBPXAGbpCtP2", active: true})
          removeAgars();
        } else {
          chrome.alarms.create("closing", {delayInMinutes: 5});
          chrome.alarms.create("warning", {delayInMinutes: 4});
        }
      }
    });
  } else if (msg.now) {
    removeAgarsAndStoreTime();
  }
});

chrome.browserAction.onClicked.addListener(function() {
  chrome.tabs.create({url: "http://agar.io/?cs=true"});
});

chrome.alarms.onAlarm.addListener(function(alarm) {
  if (alarm.name == "closing") {
    removeAgarsAndStoreTime();
  }
  if (alarm.name == "warning") {
    chrome.notifications.create("warining", {
      type: "basic",
      title: "1 min left",
      isClickable: false,
      iconUrl: chrome.runtime.getURL('icons/48.png'),
      message: "1 min left for your Agar game, time to make someone's day"});
  }
});
