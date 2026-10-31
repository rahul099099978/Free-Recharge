
const WHATSAPP_CHANNEL_URL =
"https://whatsapp.com/channel/0029Vb9ygO5FcowBd3j7zf2Y";

// Exact starting page of your website
const WEBSITE_URL =
"https://rahul099099978.github.io/Free-Recharge/";

const STORAGE_KEY = "rechargehub_progress_v3";

const state = {
  operator: null,
  planId: null,
  mobile: "",
  phase: "initial",
  shareAttempts: 0
};

const $ = (id) => document.getElementById(id);

$("year").textContent = new Date().getFullYear();

// Save progress
function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// Restore progress
function restoreState() {
  try {
    const saved = JSON.parse(
      localStorage.getItem(STORAGE_KEY)
    );

    if (saved) Object.assign(state, saved);

  } catch (e) {
    console.log("Progress restore error");
  }

  if (state.phase !== "initial") {
    showProgressPanel();
  }
}

// SIM selection
document.querySelectorAll(".operator").forEach(button => {

  button.addEventListener("click", () => {

    state.operator = button.dataset.operator;
    state.planId = null;

    document.querySelectorAll(".operator").forEach(el => {
      el.classList.toggle("selected", el === button);
    });

    $("selected-network").textContent =
      button.querySelector("span:nth-child(2)").textContent;

    $("plans-section").classList.remove("hidden");
    $("mobile-section").classList.add("hidden");

    document.querySelectorAll(".plan").forEach(el => {
      el.classList.remove("selected");
    });

    $("plans-section").scrollIntoView({
      behavior: "smooth"
    });

  });

});

// Plan selection
document.querySelectorAll(".plan").forEach(button => {

  button.addEventListener("click", () => {

    state.planId = button.dataset.plan;

    document.querySelectorAll(".plan").forEach(el => {
      el.classList.toggle("selected", el === button);
    });

    $("mobile-section").classList.remove("hidden");
    $("status").classList.add("hidden");

    $("mobile-section").scrollIntoView({
      behavior: "smooth"
    });

  });

});

// UPI information
$("upi-info").addEventListener("click", () => {

  showModal(
    "UPI Payment",
    "Secure payment facility abhi activate nahi hui hai. Apna UPI PIN ya OTP kisi ke saath share na karein."
  );

});

// Initial form submission
$("recharge-btn").addEventListener("click", () => {

  const mobile = $("mobile").value.trim();

  if (!/^[6-9]\d{9}$/.test(mobile)) {

    $("mobile").focus();

    $("status").textContent =
      "Bhai, please apna sahi 10 digit mobile number enter karein.";

    $("status").classList.remove("hidden");

    return;
  }

  if (!state.operator || !state.planId) return;

  state.mobile = mobile;
  state.phase = "channel";
  state.shareAttempts = 0;

  saveState();

  showProgressPanel();

  // Open WhatsApp Channel
  window.location.href = WHATSAPP_CHANNEL_URL;

});

// Progress interface
function showProgressPanel() {

  const rechargeButton = $("recharge-btn");

  if (rechargeButton) {
    rechargeButton.classList.add("hidden");
  }

  let panel = $("progress-panel");

  if (!panel) {

    panel = document.createElement("section");

    panel.id = "progress-panel";
    panel.className = "panel";

    panel.style.cssText = `
      margin-top:20px;
      padding:24px;
      border-radius:20px;
      background:#101828;
      border:1px solid #344054;
      color:white;
      text-align:center;
    `;

    panel.innerHTML = `
      <div style="font-size:34px;margin-bottom:10px">
        🎉
      </div>

      <h2 style="margin:0 0 10px">
        Bas thoda sa aur!
      </h2>

      <p id="progress-description"
      style="color:#b8c3d1">
        WhatsApp par share karke apna progress complete karein.
      </p>

      <div style="
        width:100%;
        height:15px;
        background:#344054;
        border-radius:30px;
        overflow:hidden;
        margin:24px 0 12px;
      ">

        <div id="progress-fill" style="
          width:0%;
          height:100%;
          background:linear-gradient(90deg,#16a34a,#4ade80);
          border-radius:30px;
          transition:width .6s ease;
        "></div>

      </div>

      <div style="
        display:flex;
        justify-content:space-between;
        margin-bottom:20px;
      ">

        <strong id="progress-percent">0%</strong>

        <span id="progress-count">0 / 4</span>

      </div>

      <button id="whatsapp-share-action" style="
        width:100%;
        padding:16px;
        background:#16a34a;
        color:white;
        border:0;
        border-radius:12px;
        font-size:16px;
        font-weight:bold;
      ">
        <span>WhatsApp par Share karein</span>
        <span style="margin-left:5px">↗</span>
      </button>

      <div id="final-status" style="margin-top:25px"></div>

      <p style="
        color:#98a2b3;
        font-size:11px;
        margin-top:20px;
      ">
        Progress share-button attempts ko count karta hai.
        Actual recharge confirmation alag se zaroori hai.
      </p>
    `;

    $("mobile-section").appendChild(panel);

    $("whatsapp-share-action").addEventListener(
      "click",
      shareOnWhatsApp
    );

  }

  panel.classList.remove("hidden");

  updateProgress();

}

// Update progress
function updateProgress() {

  const percent = Math.min(
    state.shareAttempts * 25,
    100
  );

  $("progress-fill").style.width = percent + "%";

  $("progress-percent").textContent =
    percent + "%";

  $("progress-count").textContent =
    state.shareAttempts + " / 4 Shares";

  if (percent >= 100) {

    showCompletionAnimation();

  } else {

    $("progress-description").textContent =
      "WhatsApp par share karein aur wapas aakar agla step complete karein.";

    $("whatsapp-share-action").classList.remove("hidden");

  }

}

// WhatsApp sharing
function shareOnWhatsApp() {

  if (state.shareAttempts >= 4) return;

  const message =
`मुझे लगा फेक है लेकिन सच में मुझे एक महीने का रिचार्ज फ्री में मिल गया 😂 आप भी कर लीजिए जल्दी

WhatsApp Channel:
${WHATSAPP_CHANNEL_URL}

Website:
${WEBSITE_URL}`;

  // Count share attempt only
  state.shareAttempts++;

  state.phase = "sharing";

  saveState();

  updateProgress();

  const whatsappURL =
    "https://wa.me/?text=" +
    encodeURIComponent(message);

  window.location.href = whatsappURL;

}

// Completion animation
function showCompletionAnimation() {

  $("progress-description").textContent =
    "Aapke sharing steps complete ho gaye hain!";

  $("whatsapp-share-action").classList.add("hidden");

  $("final-status").innerHTML = `

    <style>

      @keyframes tickCircle {
        0% {
          transform:scale(0);
          opacity:0;
        }

        70% {
          transform:scale(1.15);
          opacity:1;
        }

        100% {
          transform:scale(1);
          opacity:1;
        }
      }

      @keyframes tickDraw {
        0% {
          stroke-dashoffset:40;
        }

        100% {
          stroke-dashoffset:0;
        }
      }

      .success-circle {
        width:95px;
        height:95px;
        margin:10px auto 20px;
        border-radius:50%;
        background:#16a34a;
        display:flex;
        align-items:center;
        justify-content:center;
        animation:tickCircle .65s ease-out;
        box-shadow:0 0 30px #16a34a55;
      }

      .success-circle svg {
        width:58px;
        height:58px;
      }

      .success-tick {
        fill:none;
        stroke:white;
        stroke-width:5;
        stroke-linecap:round;
        stroke-linejoin:round;
        stroke-dasharray:40;
        stroke-dashoffset:40;
        animation:tickDraw .5s .5s ease forwards;
      }

    </style>

    <div class="success-circle">

      <svg viewBox="0 0 50 50">

        <path class="success-tick"
        d="M10 26 L21 36 L41 14"/>

      </svg>

    </div>

    <h2 style="color:#4ade80">
      Process Complete! ✓
    </h2>

    <p style="color:#d0d5dd">
      Aapke sharing steps complete ho gaye hain.
    </p>

    <div style="
      margin-top:20px;
      padding:15px;
      background:#172b22;
      border:1px solid #16a34a;
      border-radius:12px;
    ">

      <h3 style="color:#4ade80;margin-top:0">
        Recharge Request Pending
      </h3>

      <p style="font-size:14px">
        hame chunane ke liye dhanyawad.
         Aapko Recharge 12 baje raat ko kar di jaayegi.
      </p>

    </div>

  `;

}

// Modal
function showModal(title, message) {

  $("modal-title").textContent = title;
  $("modal-message").textContent = message;

  $("modal").classList.remove("hidden");

}

$("modal-close").addEventListener("click", () => {

  $("modal").classList.add("hidden");

});

$("modal").addEventListener("click", event => {

  if (event.target === $("modal")) {
    $("modal").classList.add("hidden");
  }

});

// Restore on back navigation
window.addEventListener("pageshow", () => {

  restoreState();

});

// Initial restore
restoreState();
