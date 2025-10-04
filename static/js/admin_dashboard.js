let currentTicketId = null;
let filterStatus = "";

async function refreshTable() {
  const q = document.getElementById("q").value;
  const status = document.getElementById("filterStatus").value || filterStatus;
  const url = `/admin/api/tickets?${new URLSearchParams({ q, status })}`;

  const res = await fetch(url);
  const data = await res.json();
  if (!data.success) return alert("Failed to load tickets");

  const tbody = document.getElementById("ticketsBody");
  tbody.innerHTML = "";

  let countOpen = 0, countProgress = 0, countResolved = 0;

  data.tickets.forEach(t => {
    if (t.status.toLowerCase() === "open") countOpen++;
    if (t.status.toLowerCase() === "in progress") countProgress++;
    if (t.status.toLowerCase() === "resolved") countResolved++;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>TK-${t.id}</td>
      <td>${t.subject}</td>
      <td>${t.requester_email}</td>
      <td><span class="tag ${t.priority?.toLowerCase() || ''}">${t.priority || "-"}</span></td>
      <td>${t.status}</td>
      <td>${t.updated_at || t.created_at}</td>
      <td><button class="btn btn-sm btn-primary" onclick="window.location.href='/admin/ticket/${t.id}'">View</button></td>
    `;

    tbody.appendChild(tr);
  });

  document.getElementById("countOpen").textContent = countOpen;
  document.getElementById("countProgress").textContent = countProgress;
  document.getElementById("countResolved").textContent = countResolved;
}

async function openDetails(ticketId) {
  currentTicketId = ticketId;
  const res = await fetch(`/admin/api/ticket/${ticketId}`);
  const data = await res.json();
  if (!data.success) return alert("Failed to load ticket details");

  const t = data.ticket;
  document.getElementById("detailId").textContent = "TK-" + t.id;
  document.getElementById("detailPriority").textContent = t.priority || "-";
  document.getElementById("detailStatus").textContent = t.status;
  document.getElementById("detailAssignee").textContent = t.assigned_to || "-";
  document.getElementById("detailCreated").textContent = t.created_at;

  const messages = document.getElementById("messages");
  messages.innerHTML = "";
  t.comments.forEach(c => {
    const div = document.createElement("div");
    div.className = "msg " + (c.admin_id ? "agent" : "client");
    div.textContent = (c.admin_email || t.requester_email) + ": " + c.comment_text;
    messages.appendChild(div);
  });
}

async function sendReply() {
  if (!currentTicketId) return alert("Select a ticket first!");
  const text = document.getElementById("replyTxt").value;
  if (!text) return;
  await fetch(`/admin/api/ticket/${currentTicketId}/reply`, {
    method: "POST",
    body: new URLSearchParams({ text })
  });
  document.getElementById("replyTxt").value = "";
  openDetails(currentTicketId);
}

async function markResolved() {
  if (!currentTicketId) return alert("Select a ticket first!");
  await fetch(`/admin/api/ticket/${currentTicketId}`, {
    method: "POST",
    body: new URLSearchParams({ status: "resolved" })
  });
  refreshTable();
  openDetails(currentTicketId);
}

function setFilter(status) {
  filterStatus = status;
  refreshTable();
}

function createTicket() {
  alert("Ticket creation UI not implemented yet");
}

// Initial load
refreshTable();
