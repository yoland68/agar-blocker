function removeAgars() {
  chrome.tabs.query({url: "http://agar.io/*"}, function(tabArr) {
    tabArr.forEach(function(tab) {
      chrome.tabs.remove(tab.id);
    });
  });
}

function removeAgarsAndStoreTime() {
  removeAgars();
  chrome.storage.local.set({ "timeStamp": Date.now() });
}

function isHighFocusPeriod() {
  const day = new Date().getDay();
  const hour = new Date().getHours();
  return (day != 6) && (day != 0) && (hour < 18)
}
chrome.runtime.onMessage.addListener(function(msg, _, sendResponse) {
  if (msg.counter) {
    chrome.storage.local.get("timeStamp", function(items) {
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
        if (items.timeStamp && isHighFocusPeriod() && new Date().setMinutes(
            new Date().getMinutes()-60) < items.timeStamp) {
          chrome.notifications.create("Hey, take a mindful break and do some stretches", {
            type: "basic",
            title: "Mindful breaks help your memory and stretches make sure your body functions",
            isClickable: false,
            iconUrl: chrome.runtime.getURL('icons/48_cat.png'),
            message: "4 hour time interval"});
          chrome.tabs.create({url: "https://photos.app.goo.gl/PDkpfWBPXAGbpCtP2", active: true})
          removeAgars();
        } else {
          if (!isHighFocusPeriod()) {
            const time = 5+Math.min(Math.floor(Math.abs(items.timeStamp - new Date())/36e5), 5);
            chrome.notifications.create("notify", {
              type: "basic",
              title: time + " min of gameplay",
              isClickable: false,
              iconUrl: chrome.runtime.getURL('icons/clippy.png'),
              message: "You have " + time + " min for your Agar game"});
            chrome.alarms.create("closing", {delayInMinutes: time});
            chrome.alarms.create("warning", {delayInMinutes: time-1});
          } else {
            chrome.notifications.create("notify", {
              type: "basic",
              title: "5 min of gameplay",
              isClickable: false,
              iconUrl: chrome.runtime.getURL('icons/clippy.png'),
              message: "You have 5 min for your Agar game"});
            chrome.alarms.create("closing", {delayInMinutes: 5});
            chrome.alarms.create("warning", {delayInMinutes: 4});
          }
          
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
