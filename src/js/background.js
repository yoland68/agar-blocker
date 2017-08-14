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
  const day = new Date();
  console.log("Today is " + day);
  return (day == 6) || (day == 0)
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
            message: "25 time interval"});
        removeAgars();
      } else {
        if (items.timeStamp && isWeekday() && new Date().setMinutes(
              new Date().getMinutes()-60) < items.timeStamp && Math.random()>0.5) {
          chrome.notifications.create("Hey, do some stretches", {
            type: "basic",
            title: "Do some stretches so you can live a happier life, lol",
            isClickable: false,
            iconUrl: chrome.runtime.getURL('icons/48_cat.png'),
            message: "25 time interval"});
          removeAgarsAndStoreTime();
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
