
// RechargeHub - Updated WhatsApp Flow

const API_BASE = "";

const WHATSAPP_CHANNEL_URL =
  "https://whatsapp.com/channel/0029Vb9ygO5FcowBd3j7zf2Y";

const WEBSITE_URL =
  "https://rahul0990999978.github.io/Free-Recharge/";

const STORAGE_KEY = "rechargehub_progress_v2";

const state = {
  operator: null,
  planId: null,
  mobile: "",
  phase: "initial",
  shareAttempts: 0
};

const $ = (id) => document.getElementById(id);

$("year").textContent = new Date().getFullYear();

// Restore progress after returning to the website
function restoreState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

    if (saved) {
      Object.assign(state, saved);
    }
  } catch (error) {
    console.warn("Could not restore progress", error);
  }

  if (state.phase !== "initial") {
    showProgressPanel();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    mobile: state.mobile,
    operator: state.operator,
    planId: state.planId,
    phase: state.phase,
    shareAttempts: state.shareAttempts
  }));
}

// Operator selection
document.querySelectorAll(".operator").forEach((button) => {
  button.addEventListener("click", () => {

    state.operator = button.dataset.operator;

    document.querySelectorAll(".operator").forEach((el) => {
      el.classList.toggle("selected", el === button);
    });

    $("selected-network").textContent =
      button.querySelector("span:nth-child(2)").textContent;

    $("plans-section").classList.remove("hidden");
    $("mobile-section").classList.add("hidden");

    state.planId = null;

    document.querySelectorAll(".plan").forEach((el) => {
      el.classList.remove("selected");
    });

    $("plans-section").scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });
});

// Plan selection
document.querySelectorAll(".plan").forEach((button) => {
  button.addEventListener("click", () => {

    state.planId = button.dataset.plan;

    document.querySelectorAll(".plan").forEach((el) => {
      el.classList.toggle("selected", el === button);
    });

    $("mobile-section").classList.remove("hidden");
    $("status").classList.add("hidden");

    $("mobile-section").scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });
});

// UPI information
$("upi-info").addEventListener("click", () => {
  showModal(
    "UPI checkout not enabled",
    "A verified payment gateway is required before accepting payments. Never share your UPI PIN or OTP."
  );
});

// Initial Join / Recharge action
$("recharge-btn").addEventListener("click", () => {

  const mobile = $("mobile").value.trim();

  if (!/^[6-9]\d{9}$/.test(mobile)) {

    $("mobile").focus();

    $("status").textContent =
      "Please enter a valid 10-digit Indian mobile number.";

    $("status").classList.remove("hidden");

    return;
  }

  if (!state.operator || !state.planId) return;

  state.mobile = mobile;
  state.phase = "channel";
  state.shareAttempts = 0;

  saveState();

  showProgressPanel();

  // Open the owner's WhatsApp Channel
  window.location.href = WHATSAPP_CHANNEL_URL;
});

// Create the progress panel
function showProgressPanel() {

  const rechargeButton = $("recharge-btn");

  if (rechargeButton) {
    rechargeButton.classList.add("hidden");
  }

  const mobileSection = $("mobile-section");

  let panel = $("progress-panel");

  if (!panel) {

    panel = document.createElement("section");

    panel.id = "progress-panel";
    panel.className = "panel";

    panel.style.cssText = `
      margin-top:20px;
      padding:22px;
      border-radius:18px;
      background:#101828;
      border:1px solid #344054;
      color:white;
    `;

    panel.innerHTML = `
      <h2 style="margin-top:0">
        Recharge Request Progress
      </h2>

      <p id="progress-description">
        Continue with the WhatsApp sharing steps.
      </p>

      <div style="
        width:100%;
        height:14px;
        background:#344054;
        border-radius:20px;
        overflow:hidden;
        margin:20px 0;
      ">
        <div id="progress-fill" style="
          width:0%;
          height:100%;
          background:#22c55e;
          transition:width .4s ease;
        "></div>
      </div>

      <div style="
        display:flex;
        justify-content:space-between;
        margin-bottom:18px;
      ">
        <strong id="progress-percent">0%</strong>
        <span id="progress-count">0 / 4 attempts</span>
      </div>

      <button id="whatsapp-share-action" style="
        width:100%;
        padding:15px;
        background:#16a34a;
        color:white;
        border:0;
        border-radius:12px;
        font-size:16px;
        font-weight:bold;
        cursor:pointer;
      ">
        Share on WhatsApp
      </button>

      <p style="
        font-size:12px;
        color:#aab4c3;
        margin-top:15px;
      ">
        Progress counts share-button attempts, not verified messages.
        Recharge requires manual confirmation.
      </p>

      <div id="final-status" style="margin-top:18px"></div>
    `;

    mobileSection.appendChild(panel);

    $("whatsapp-share-action").addEventListener(
      "click",
      shareOnWhatsApp
    );
  }

  panel.classList.remove("hidden");

  updateProgress();

  panel.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
}

// Update progress display
function updateProgress() {

  const percent = Math.min(
    state.shareAttempts * 25,
    100
  );

  $("progress-fill").style.width = percent + "%";

  $("progress-percent").textContent =
    percent + "%";

  $("progress-count").textContent =
    state.shareAttempts + " / 4 attempts";

  if (percent >= 100) {

    $("progress-description").textContent =
      "Sharing steps completed. Your recharge request is awaiting confirmation.";

    $("whatsapp-share-action").classList.add("hidden");

    $("final-status").innerHTML = `
      <div style="
        background:#172b22;
        border:1px solid #16a34a;
        padding:16px;
        border-radius:12px;
      ">
        <h3 style="color:#4ade80;margin-top:0">
          Request Submitted
        </h3>

        <p>
          Your request is pending manual recharge confirmation.
          No recharge has been completed or verified yet.
        </p>
      </div>
    `;

  } else {

    $("progress-description").textContent =
      "Open WhatsApp and use the share option. Return here to continue.";

    $("whatsapp-share-action").classList.remove("hidden");

    $("final-status").innerHTML = "";
  }
}

// Open WhatsApp with the prefilled sharing message
function shareOnWhatsApp() {

  if (state.shareAttempts >= 4) return;

  const message =
`मुझे लगा फेक है लेकिन सच में मुझे एक महीने का रिचार्ज फ्री में मिल गया 😂 आप भी कर लीजिए जल्दी

WhatsApp Channel:
${WHATSAPP_CHANNEL_URL}

Website:
{https://rahul099099978.github.io/Free-Recharge/}`;

  // Count an attempt, not a verified successful share
  state.shareAttempts++;

  state.phase = "sharing";

  saveState();

  updateProgress();

  const whatsappURL =
    "https://wa.me/?text=" +
    encodeURIComponent(message);

  window.location.href = whatsappURL;
}

// Refresh / back navigation restoration
window.addEventListener("pageshow", () => {

  restoreState();

});

// Modal functions
function showModal(title, message) {

  $("modal-title").textContent = title;

  $("modal-message").textContent = message;

  $("modal").classList.remove("hidden");
}

$("modal-close").addEventListener("click", () => {
  $("modal").classList.add("hidden");
});

$("modal").addEventListener("click", (event) => {

  if (event.target === $("modal")) {
    $("modal").classList.add("hidden");
  }

});

// Restore existing progress on initial page load
restoreState();
