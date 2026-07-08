// Dew Buddy - content.js

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "showNotification") {
    showOverlay(request.type);
  }
});

function showOverlay(type) {
  // Check if exists
  let existingHost = document.getElementById("dew-buddy-host");
  if (existingHost) {
    existingHost.remove();
  }

  // Create Host Element
  const host = document.createElement("div");
  host.id = "dew-buddy-host";
  
  // Style Host to place at the bottom left with high z-index
  host.style.position = "fixed";
  host.style.bottom = "24px";
  host.style.left = "24px";
  host.style.zIndex = "2147483647";
  host.style.width = "340px";
  host.style.fontFamily = "'Quicksand', 'Inter', sans-serif";
  
  document.body.appendChild(host);

  // Attach Shadow DOM
  const shadow = host.attachShadow({ mode: "open" });

  // Load Google Fonts inside Shadow DOM
  const fontLink = document.createElement("link");
  fontLink.rel = "stylesheet";
  fontLink.href = "https://fonts.googleapis.com/css2?family=Quicksand:wght@500;700&display=swap";
  shadow.appendChild(fontLink);

  // Style sheet
  const styles = document.createElement("style");
  styles.textContent = `
    .overlay-card {
      background-color: #FFFDF0;
      border: 3.5px solid #333333;
      border-radius: 28px;
      padding: 20px;
      box-shadow: 6px 6px 0px #333333;
      display: flex;
      flex-direction: column;
      gap: 16px;
      transform: translateY(100px);
      opacity: 0;
      transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.4s;
    }

    .overlay-card.show {
      transform: translateY(0);
      opacity: 1;
    }

    .header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .title-area {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .title {
      font-size: 18px;
      font-weight: 700;
      color: #333333;
      margin: 0;
    }

    .subtitle {
      font-size: 12px;
      font-weight: 500;
      color: #333333;
      opacity: 0.8;
      margin: 0;
    }

    .mascot {
      width: 52px;
      height: 52px;
    }

    .button-group {
      display: flex;
      gap: 10px;
    }

    .btn {
      flex: 1;
      border: 2.5px solid #333333;
      border-radius: 20px;
      padding: 10px 14px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: 2px 2px 0px #333333;
      transition: transform 0.1s, box-shadow 0.1s;
    }

    .btn:active {
      transform: translate(1px, 1px);
      box-shadow: 1px 1px 0px #333333;
    }

    .btn-done {
      background-color: #4A908F;
      color: #FFFFFF;
    }

    .btn-snooze {
      background-color: #F2C94C;
      color: #333333;
    }

    .badge {
      display: inline-block;
      align-self: flex-start;
      padding: 4px 10px;
      font-size: 11px;
      font-weight: 700;
      border-radius: 12px;
      color: white;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .water-badge {
      background-color: #4A908F;
    }

    .break-badge {
      background-color: #EB5757;
    }
  `;
  shadow.appendChild(styles);

  // Card element
  const card = document.createElement("div");
  card.className = "overlay-card";
  
  const isWater = type === "water";
  const badgeClass = isWater ? "water-badge" : "break-badge";
  const badgeText = isWater ? "Hydration Alert" : "Screen Break";
  const titleText = isWater ? "Time for a sip!" : "Look away for a rest!";
  const subText = isWater 
    ? "Refresh your mind with a cool glass of water." 
    : "Look 20 feet away for 20 seconds to rest your eyes.";

  card.innerHTML = `
    <div class="header-row">
      <div class="title-area">
        <span class="badge ${badgeClass}">${badgeText}</span>
        <h3 class="title">${titleText}</h3>
        <p class="subtitle">${subText}</p>
      </div>
      <div class="mascot">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" width="100%" height="100%" style="image-rendering:pixelated;shape-rendering:crispedges;"><rect x="4" y="0" width="1" height="1" fill="#4A908F" /><rect x="5" y="0" width="1" height="1" fill="#4A908F" /><rect x="6" y="0" width="1" height="1" fill="#4A908F" /><rect x="7" y="0" width="1" height="1" fill="#4A908F" /><rect x="3" y="1" width="1" height="1" fill="#4A908F" /><rect x="4" y="1" width="1" height="1" fill="#FFFDF0" /><rect x="5" y="1" width="1" height="1" fill="#FFFDF0" /><rect x="6" y="1" width="1" height="1" fill="#FFFDF0" /><rect x="7" y="1" width="1" height="1" fill="#FFFDF0" /><rect x="8" y="1" width="1" height="1" fill="#4A908F" /><rect x="2" y="2" width="1" height="1" fill="#4A908F" /><rect x="3" y="2" width="1" height="1" fill="#FFFDF0" /><rect x="4" y="2" width="1" height="1" fill="#FFFDF0" /><rect x="5" y="2" width="1" height="1" fill="#FFFDF0" /><rect x="6" y="2" width="1" height="1" fill="#FFFDF0" /><rect x="7" y="2" width="1" height="1" fill="#FFFDF0" /><rect x="8" y="2" width="1" height="1" fill="#FFFDF0" /><rect x="9" y="2" width="1" height="1" fill="#4A908F" /><rect x="1" y="3" width="1" height="1" fill="#4A908F" /><rect x="2" y="3" width="1" height="1" fill="#FFFDF0" /><rect x="3" y="3" width="1" height="1" fill="#FFFDF0" /><rect x="4" y="3" width="1" height="1" fill="#FFFFFF" /><rect x="5" y="3" width="1" height="1" fill="#FFFDF0" /><rect x="6" y="3" width="1" height="1" fill="#FFFDF0" /><rect x="7" y="3" width="1" height="1" fill="#FFFDF0" /><rect x="8" y="3" width="1" height="1" fill="#FFFDF0" /><rect x="9" y="3" width="1" height="1" fill="#FFFDF0" /><rect x="10" y="3" width="1" height="1" fill="#4A908F" /><rect x="0" y="4" width="1" height="1" fill="#4A908F" /><rect x="1" y="4" width="1" height="1" fill="#FFFDF0" /><rect x="2" y="4" width="1" height="1" fill="#FFFDF0" /><rect x="3" y="4" width="1" height="1" fill="#FFFFFF" /><rect x="4" y="4" width="1" height="1" fill="#FFFDF0" /><rect x="5" y="4" width="1" height="1" fill="#FFFDF0" /><rect x="6" y="4" width="1" height="1" fill="#FFFDF0" /><rect x="7" y="4" width="1" height="1" fill="#FFFDF0" /><rect x="8" y="4" width="1" height="1" fill="#FFFDF0" /><rect x="9" y="4" width="1" height="1" fill="#FFFDF0" /><rect x="10" y="4" width="1" height="1" fill="#FFFDF0" /><rect x="11" y="4" width="1" height="1" fill="#4A908F" /><rect x="0" y="5" width="1" height="1" fill="#4A908F" /><rect x="1" y="5" width="1" height="1" fill="#FFFDF0" /><rect x="2" y="5" width="1" height="1" fill="#EB5757" /><rect x="3" y="5" width="1" height="1" fill="#FFFDF0" /><rect x="4" y="5" width="1" height="1" fill="#FFFDF0" /><rect x="5" y="5" width="1" height="1" fill="#E6E3D1" /><rect x="6" y="5" width="1" height="1" fill="#FFFDF0" /><rect x="7" y="5" width="1" height="1" fill="#FFFDF0" /><rect x="8" y="5" width="1" height="1" fill="#EB5757" /><rect x="9" y="5" width="1" height="1" fill="#FFFDF0" /><rect x="10" y="5" width="1" height="1" fill="#4A908F" /><rect x="11" y="5" width="1" height="1" fill="#4A908F" /><rect x="0" y="6" width="1" height="1" fill="#4A908F" /><rect x="1" y="6" width="1" height="1" fill="#FFFDF0" /><rect x="2" y="6" width="1" height="1" fill="#FFFDF0" /><rect x="3" y="6" width="1" height="1" fill="#FFFDF0" /><rect x="5" y="6" width="1" height="1" fill="#FFFDF0" /><rect x="6" y="6" width="1" height="1" fill="#FFFDF0" /><rect x="8" y="6" width="1" height="1" fill="#FFFDF0" /><rect x="9" y="6" width="1" height="1" fill="#FFFDF0" /><rect x="10" y="6" width="1" height="1" fill="#FFFDF0" /><rect x="11" y="6" width="1" height="1" fill="#4A908F" /><rect x="0" y="7" width="1" height="1" fill="#4A908F" /><rect x="1" y="7" width="1" height="1" fill="#FFFDF0" /><rect x="2" y="7" width="1" height="1" fill="#FFFDF0" /><rect x="3" y="7" width="1" height="1" fill="#FFFDF0" /><rect x="4" y="7" width="1" height="1" fill="#FFFDF0" /><rect x="5" y="7" width="1" height="1" fill="#FFFDF0" /><rect x="6" y="7" width="1" height="1" fill="#FFFDF0" /><rect x="7" y="7" width="1" height="1" fill="#FFFDF0" /><rect x="8" y="7" width="1" height="1" fill="#FFFDF0" /><rect x="9" y="7" width="1" height="1" fill="#FFFDF0" /><rect x="10" y="7" width="1" height="1" fill="#FFFDF0" /><rect x="11" y="7" width="1" height="1" fill="#4A908F" /><rect x="0" y="8" width="1" height="1" fill="#4A908F" /><rect x="1" y="8" width="1" height="1" fill="#FFFDF0" /><rect x="2" y="8" width="1" height="1" fill="#FFFDF0" /><rect x="3" y="8" width="1" height="1" fill="#FFFDF0" /><rect x="4" y="8" width="1" height="1" fill="#FFFDF0" /><rect x="6" y="8" width="1" height="1" fill="#FFFDF0" /><rect x="8" y="8" width="1" height="1" fill="#FFFDF0" /><rect x="9" y="8" width="1" height="1" fill="#FFFDF0" /><rect x="10" y="8" width="1" height="1" fill="#FFFDF0" /><rect x="11" y="8" width="1" height="1" fill="#4A908F" /><rect x="1" y="9" width="1" height="1" fill="#4A908F" /><rect x="2" y="9" width="1" height="1" fill="#FFFDF0" /><rect x="3" y="9" width="1" height="1" fill="#FFFDF0" /><rect x="4" y="9" width="1" height="1" fill="#FFFDF0" /><rect x="5" y="9" width="1" height="1" fill="#F2C94C" /><rect x="6" y="9" width="1" height="1" fill="#F2C94C" /><rect x="7" y="9" width="1" height="1" fill="#FFFDF0" /><rect x="8" y="9" width="1" height="1" fill="#FFFDF0" /><rect x="9" y="9" width="1" height="1" fill="#FFFDF0" /><rect x="10" y="9" width="1" height="1" fill="#4A908F" /><rect x="2" y="10" width="1" height="1" fill="#4A908F" /><rect x="3" y="10" width="1" height="1" fill="#FFFDF0" /><rect x="4" y="10" width="1" height="1" fill="#FFFDF0" /><rect x="5" y="10" width="1" height="1" fill="#FFFDF0" /><rect x="6" y="10" width="1" height="1" fill="#FFFDF0" /><rect x="7" y="10" width="1" height="1" fill="#FFFDF0" /><rect x="8" y="10" width="1" height="1" fill="#FFFDF0" /><rect x="9" y="10" width="1" height="1" fill="#4A908F" /><rect x="3" y="11" width="1" height="1" fill="#4A908F" /><rect x="4" y="11" width="1" height="1" fill="#4A908F" /><rect x="5" y="11" width="1" height="1" fill="#4A908F" /><rect x="6" y="11" width="1" height="1" fill="#4A908F" /><rect x="7" y="11" width="1" height="1" fill="#4A908F" /><rect x="8" y="11" width="1" height="1" fill="#4A908F" /></svg>
      </div>
    </div>
    <div class="button-group">
      <button class="btn btn-done" id="done-btn">Done</button>
      <button class="btn btn-snooze" id="snooze-btn">Snooze (5m)</button>
    </div>
  `;

  shadow.appendChild(card);

  // Slide-in animation on next frame
  requestAnimationFrame(() => {
    card.classList.add("show");
  });

  // Action listeners
  shadow.getElementById("done-btn").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "complete", type: type });
    dismiss();
  });

  shadow.getElementById("snooze-btn").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "snooze", type: type });
    dismiss();
  });

  function dismiss() {
    card.classList.remove("show");
    setTimeout(() => {
      host.remove();
    }, 500);
  }
}
