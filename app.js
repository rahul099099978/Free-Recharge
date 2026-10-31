// For a live deployment, set this to your HTTPS backend URL (not a secret).
const API_BASE = "";
// Replace with your real public WhatsApp Channel URL when available.
// Example: https://whatsapp.com/channel/....
const WHATSAPP_CHANNEL_URL = "https://whatsapp.com/channel/0029Vb9ygO5FcowBd3j7zf2Y";

const state = { operator: null, planId: null };
const $ = (id) => document.getElementById(id);
$("year").textContent = new Date().getFullYear();

document.querySelectorAll(".operator").forEach((button) => {
  button.addEventListener("click", () => {
    state.operator = button.dataset.operator;
    document.querySelectorAll(".operator").forEach((el) => el.classList.toggle("selected", el === button));
    $("selected-network").textContent = button.querySelector("span:nth-child(2)").textContent;
    $("plans-section").classList.remove("hidden");
    $("mobile-section").classList.add("hidden");
    state.planId = null;
    document.querySelectorAll(".plan").forEach((el) => el.classList.remove("selected"));
    $("plans-section").scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

document.querySelectorAll(".plan").forEach((button) => {
  button.addEventListener("click", () => {
    state.planId = button.dataset.plan;
    document.querySelectorAll(".plan").forEach((el) => el.classList.toggle("selected", el === button));
    $("mobile-section").classList.remove("hidden");
    $("status").classList.add("hidden");
    $("mobile-section").scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

$("upi-info").addEventListener("click", () => showModal(
  "UPI checkout not enabled",
  "A verified payment gateway must be connected on the secure server before accepting payments. Never share your UPI PIN or OTP."
));

$("recharge-btn").addEventListener("click", async () => {
  const mobile = $("mobile").value.trim();
  if (!/^[6-9]\d{9}$/.test(mobile)) {
    $("mobile").focus();
    $("status").textContent = "Please enter a valid 10-digit Indian mobile number.";
    $("status").classList.remove("hidden");
    return;
  }
  if (!state.operator || !state.planId) return;

  // Continue to the owner's WhatsApp Channel. A channel is broadcast-only:
  // customers cannot privately message the channel admin from the channel link.
  showModal(
    "Continue on WhatsApp",
    "Your number has been entered for this request. Join the WhatsApp Channel for updates, then contact the page owner through a separately provided WhatsApp chat number to arrange the recharge. No recharge has been made yet."
  );
  window.open(WHATSAPP_CHANNEL_URL, "_blank", "noopener,noreferrer");
});

$("share-btn").addEventListener("click", () => {
  const siteUrl = window.location.href.split("#")[0];
  const message = `Mujhe laga tha fake hai 😂 par sach me mujhe one month ka recharge mil gaya, tum log bhi try karo!\\n\\nOffer details: ${siteUrl}`;
  const target = WHATSAPP_CHANNEL_URL || `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(target, "_blank", "noopener,noreferrer");
});

function showModal(title, message) {
  $("modal-title").textContent = title;
  $("modal-message").textContent = message;
  $("modal").classList.remove("hidden");
}
$("modal-close").addEventListener("click", () => $("modal").classList.add("hidden"));
$("modal").addEventListener("click", (event) => {
  if (event.target === $("modal")) $("modal").classList.add("hidden");
});
