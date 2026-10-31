const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

const operators = new Set(["airtel", "jio", "vi", "bsnl"]);

// Safe preview endpoint. Replace with a real provider integration on the server.
// Never trust a browser-side "payment successful" or "recharge successful" flag.
app.post("/api/recharge/request", async (req, res) => {
  const { mobile, operator, planId } = req.body || {};

  if (!/^[6-9]\d{9}$/.test(String(mobile || ""))) {
    return res.status(400).json({ ok: false, message: "Please enter a valid 10-digit Indian mobile number." });
  }
  if (!operators.has(operator)) {
    return res.status(400).json({ ok: false, message: "Please select a valid operator." });
  }
  if (!["plan399", "plan349"].includes(planId)) {
    return res.status(400).json({ ok: false, message: "Please select a valid plan." });
  }

  // TODO: Create a payment order with your payment gateway.
  // TODO: Verify payment via a signed server-side webhook.
  // TODO: Submit recharge to your licensed/authorized recharge provider.
  // TODO: Return success only after provider status is SUCCESS.
  return res.status(501).json({
    ok: false,
    code: "NOT_CONFIGURED",
    message: "Live payments and recharge are not configured yet. This demo does not charge you or recharge your number."
  });
});

app.get("/api/health", (_req, res) => res.json({ ok: true, mode: "preview" }));

app.listen(PORT, () => {
  console.log(`SIM Recharge Starter running at http://localhost:${PORT}`);
});
