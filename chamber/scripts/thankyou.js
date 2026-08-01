const params = new URLSearchParams(window.location.search);

function formatTimestamp(value) {
  if (!value) return "Unknown";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

function setField(id, value, fallback = "Not provided") {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = value || fallback;
  }
}

setField("summary-first-name", params.get("firstName"));
setField("summary-last-name", params.get("lastName"));
setField("summary-email", params.get("email"));
setField("summary-phone", params.get("phone"));
setField("summary-org-name", params.get("orgName"));
setField("summary-timestamp", formatTimestamp(params.get("timestamp")));
