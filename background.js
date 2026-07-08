// Dew Buddy - background.js

// Initial installation defaults
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get([
    "userName",
    "waterInterval",
    "screenInterval",
    "waterDrank",
    "breaksTaken",
    "snoozesCount"
  ], (data) => {
    chrome.storage.local.set({
      userName: data.userName || "Buddy",
      waterInterval: data.waterInterval || 30,
      screenInterval: data.screenInterval || 60,
      waterDrank: data.waterDrank || 0,
      breaksTaken: data.breaksTaken || 0,
      snoozesCount: data.snoozesCount || 0
    }, () => {
      scheduleAlarms();
    });
  });
});

// Helper to schedule alarms
function scheduleAlarms() {
  chrome.storage.local.get(["waterInterval", "screenInterval"], (data) => {
    const waterMin = data.waterInterval || 30;
    const screenMin = data.screenInterval || 60;

    // Reset current
    chrome.alarms.clearAll(() => {
      // Create Water Alarm
      chrome.alarms.create("water_alarm", { periodInMinutes: waterMin });
      const waterTarget = Date.now() + waterMin * 60000;

      // Create Screen Alarm
      chrome.alarms.create("screen_alarm", { periodInMinutes: screenMin });
      const screenTarget = Date.now() + screenMin * 60000;

      chrome.storage.local.set({
        waterAlarmTarget: waterTarget,
        screenAlarmTarget: screenTarget
      });
    });
  });
}

// Listen to Alarms
chrome.alarms.onAlarm.addListener((alarm) => {
  const type = alarm.name === "water_alarm" ? "water" : "screen";
  
  // Show standard chrome notification
  const title = type === "water" ? "Sip some water! 💧" : "Rest your eyes! 👀";
  const message = type === "water" 
    ? "Time to hydrate! Take a quick sip of water to stay fresh."
    : "Time for a screen break. Look at something 20 feet away for 20 seconds.";

  chrome.notifications.create({
    type: "basic",
    iconUrl: "icon128.png",
    title: title,
    message: message,
    priority: 2
  });

  // Inject content script overlay into active tabs
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]?.id) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "showNotification",
        type: type
      });
    }
  });
});

// Listen to Popup and Content Script Messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "resetAlarms") {
    scheduleAlarms();
    sendResponse({ success: true });
  } 
  else if (request.action === "triggerTestNotification") {
    // Immediate notification trigger for user to test easily
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: "showNotification",
          type: "water"
        });
      }
    });
    sendResponse({ success: true });
  } 
  else if (request.action === "complete") {
    const type = request.type; // "water" or "screen"
    chrome.storage.local.get(["waterDrank", "breaksTaken", "waterInterval", "screenInterval"], (data) => {
      if (type === "water") {
        const count = (data.waterDrank || 0) + 1;
        chrome.storage.local.set({ waterDrank: count });
        // Reschedule alarm for standard interval
        chrome.alarms.create("water_alarm", { periodInMinutes: data.waterInterval || 30 });
        chrome.storage.local.set({ waterAlarmTarget: Date.now() + (data.waterInterval || 30) * 60000 });
      } else {
        const count = (data.breaksTaken || 0) + 1;
        chrome.storage.local.set({ breaksTaken: count });
        // Reschedule alarm for standard interval
        chrome.alarms.create("screen_alarm", { periodInMinutes: data.screenInterval || 60 });
        chrome.storage.local.set({ screenAlarmTarget: Date.now() + (data.screenInterval || 60) * 60000 });
      }
    });
    sendResponse({ success: true });
  } 
  else if (request.action === "snooze") {
    const type = request.type;
    chrome.storage.local.get(["snoozesCount"], (data) => {
      const snoozes = (data.snoozesCount || 0) + 1;
      chrome.storage.local.set({ snoozesCount: snoozes });

      // Create a short 5 minutes snooze alarm
      const alarmName = type === "water" ? "water_alarm" : "screen_alarm";
      chrome.alarms.create(alarmName, { delayInMinutes: 5 });
      
      const targetName = type === "water" ? "waterAlarmTarget" : "screenAlarmTarget";
      chrome.storage.local.set({ [targetName]: Date.now() + 5 * 60000 });
    });
    sendResponse({ success: true });
  }
  return true;
});