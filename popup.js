// Dew Buddy - popup.js
document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const waterIntervalInput = document.getElementById("water-interval");
  const screenIntervalInput = document.getElementById("screen-interval");
  const saveBtn = document.getElementById("save-btn");
  const testBtn = document.getElementById("test-btn");

  const waterTimeLabel = document.getElementById("water-time");
  const screenTimeLabel = document.getElementById("screen-time");
  const waterProgressRing = document.getElementById("water-progress");
  const screenProgressRing = document.getElementById("screen-progress");

  const statWater = document.getElementById("stat-water");
  const statBreaks = document.getElementById("stat-breaks");
  const statScore = document.getElementById("stat-score");

  // Load saved state
  function loadState() {
    chrome.storage.local.get([
      "waterInterval", 
      "screenInterval", 
      "waterAlarmTarget", 
      "screenAlarmTarget",
      "waterDrank",
      "breaksTaken",
      "snoozesCount"
    ], (data) => {
      if (data.waterInterval) waterIntervalInput.value = data.waterInterval;
      if (data.screenInterval) screenIntervalInput.value = data.screenInterval;
      
      if (data.waterDrank !== undefined) statWater.innerText = data.waterDrank;
      if (data.breaksTaken !== undefined) statBreaks.innerText = data.breaksTaken;

      // Calculate score
      const snoozes = data.snoozesCount || 0;
      const completed = (data.waterDrank || 0) + (data.breaksTaken || 0);
      const total = completed + snoozes;
      const score = total > 0 ? Math.round((completed / total) * 100) : 100;
      statScore.innerText = score + "%";

      updateCountdown(data.waterAlarmTarget, data.screenAlarmTarget, data.waterInterval, data.screenInterval);
    });
  }

  // Update SVG Ring Dashoffset
  function setProgress(element, percent) {
    if (!element) return;
    const radius = element.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percent / 100) * circumference;
    element.style.strokeDasharray = `${circumference} ${circumference}`;
    element.style.strokeDashoffset = offset;
  }

  // Countdown timers
  let timerId = null;
  function updateCountdown(waterTarget, screenTarget, waterInt, screenInt) {
    if (timerId) clearInterval(timerId);

    function tick() {
      const now = Date.now();

      // Water Alarm
      if (waterTarget) {
        const diff = Math.max(0, waterTarget - now);
        const mins = Math.floor(diff / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        waterTimeLabel.innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        
        const totalMs = (waterInt || 30) * 60000;
        const percent = Math.min(100, Math.max(0, (diff / totalMs) * 100));
        setProgress(waterProgressRing, percent);
      } else {
        waterTimeLabel.innerText = "Paused";
        setProgress(waterProgressRing, 0);
      }

      // Screen Alarm
      if (screenTarget) {
        const diff = Math.max(0, screenTarget - now);
        const mins = Math.floor(diff / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        screenTimeLabel.innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

        const totalMs = (screenInt || 60) * 60000;
        const percent = Math.min(100, Math.max(0, (diff / totalMs) * 100));
        setProgress(screenProgressRing, percent);
      } else {
        screenTimeLabel.innerText = "Paused";
        setProgress(screenProgressRing, 0);
      }
    }

    tick();
    timerId = setInterval(tick, 1000);
  }

  // Save changes and reset alarms
  saveBtn.addEventListener("click", () => {
    const waterInt = parseInt(waterIntervalInput.value) || 30;
    const screenInt = parseInt(screenIntervalInput.value) || 60;

    chrome.storage.local.set({
      waterInterval: waterInt,
      screenInterval: screenInt
    }, () => {
      // Send message to background script to re-schedule alarms
      chrome.runtime.sendMessage({ action: "resetAlarms" }, () => {
        loadState();
      });
    });
  });

  // Test notification triggers instantly
  testBtn.addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "triggerTestNotification" });
  });

  loadState();
});