const ticketId = window.location.pathname.split("/").pop();

async function loadTicket() {
  try {
    const res = await axios.get(`/admin/api/ticket/${ticketId}`);
    const t = res.data.ticket;

    const messagesDiv = document.getElementById("messages");
    messagesDiv.innerHTML = '';

    // Ticket description
    const descMsg = document.createElement('div');
    descMsg.className = 'msg agent';
    descMsg.innerHTML = `<b>${t.requester_email}:</b><br>${t.description}`;
    messagesDiv.appendChild(descMsg);

    // Comments
    t.comments.forEach(c => {
      const msg = document.createElement('div');
      msg.className = c.admin_id ? 'msg agent' : 'msg user';
      msg.innerHTML = `<b>${c.admin_email || t.requester_email}:</b> ${c.comment_text}`;
      messagesDiv.appendChild(msg);
    });

    // Attachments in description
    t.attachments.forEach(a => {
      const img = document.createElement('img');
      img.src = `/attachment/${a.id}`;
      descMsg.appendChild(img);
    });

    document.getElementById("ticketId").textContent = `TK-${t.id}`;
    document.getElementById("detailPriority").textContent = t.priority;
    document.getElementById("detailStatus").textContent = t.status;
    document.getElementById("detailAssignee").textContent = t.assigned_to || "-";
    document.getElementById("detailCreated").textContent = new Date(t.created_at).toLocaleString();
    document.getElementById("detailUpdated").textContent = new Date(t.updated_at || t.created_at).toLocaleString();
    document.getElementById("detailEmail").textContent = t.requester_email;

    const attDiv = document.getElementById("detailAttachments");
    attDiv.innerHTML = '';
    t.attachments.forEach(a => {
      const img = document.createElement("img");
      img.src = `/attachment/${a.id}`;
      attDiv.appendChild(img);
    });

  } catch(err) {
    console.error(err);
    alert("Failed to load ticket");
  }
}

document.getElementById("replyBtn").addEventListener("click", async () => {
  const text = document.getElementById("replyTxt").value;
  if (!text) return;
  try {
    const form = new FormData();
    form.append("text", text);
    await axios.post(`/admin/api/ticket/${ticketId}/reply`, form);
    document.getElementById("replyTxt").value = '';
    loadTicket();
  } catch(err) {
    console.error(err);
    alert("Failed to send reply");
  }
});

document.getElementById("resolveBtn").addEventListener("click", async () => {
  const form = new FormData();
  form.append("status", "resolved");
  await axios.post(`/admin/api/ticket/${ticketId}`, form);
  loadTicket();
});

loadTicket();
