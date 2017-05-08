function removeAgars() {
  chrome.tabs.query({url: "http://agar.io/*"}, function(tabArr) {
    tabArr.forEach(function(tab) {
      chrome.tabs.remove(tab.id);
    });
  });
}

chrome.runtime.onMessage.addListener(function(msg, _, sendResponse) {
  if (msg.counter) {
    chrome.storage.local.get("nextTimeStamp", function(items) {
      if (items.nextTimeStamp && items.nextTimeStamp > Date.now()) {
        chrome.notifications.create("No Access", {
            type: "basic",
            title: "Can not access Agar yet",
            isClickable: false,
            iconUrl: chrome.runtime.getURL('icons/48.png'),
            message: "25 time interval"});
        removeAgars();
      } else {
        chrome.alarms.create("closing", {delayInMinutes: 5});
        chrome.alarms.create("warning", {delayInMinutes: 4.5});
      }
    });

  } else if (msg.now) {
    removeAgars();
  }
});

chrome.browserAction.onClicked.addListener(function() {
  chrome.tabs.create({url: "http://agar.io/?cs=true"});
});

chrome.alarms.onAlarm.addListener(function(alarm) {
  if (alarm.name == "closing") {
    removeAgars();
    var next = new Date();
    next.setMinutes(next.getMinutes()+25);
    chrome.storage.local.set({ "nextTimeStamp": next.getTime() });
  }
  if (alarm.name == "warning") {
    chrome.notifications.create("warining", {
      type: "basic",
      title: "30 seconds left",
      isClickable: false,
      iconUrl: chrome.runtime.getURL('icons/48.png'),
      message: "30 seconds left for your Agar game, time to make someone's day"});
  }
});
