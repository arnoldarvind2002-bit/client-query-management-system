document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("ticketForm");
  const successMessage = document.getElementById("successMessage");
  const tabs = document.querySelectorAll(".sidebar nav a");
  const contents = document.querySelectorAll(".tab-content");
  const pageTitle = document.getElementById("pageTitle");
  const ticketsBody = document.getElementById("ticketsBody");

  // Tab switching
  tabs.forEach(tab => {
    tab.addEventListener("click", (e) => {
      e.preventDefault();
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      contents.forEach(c => c.classList.remove("active"));
      document.getElementById(tab.dataset.tab).classList.add("active");
      pageTitle.textContent = tab.textContent.replace("🎫 ","").replace("📂 ","").replace("👤 ","");
    });
  });

  // Ticket form submission
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const formData = new FormData(this);

    fetch("/submitTicket", {
      method: "POST",
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          successMessage.style.display = "block";
          form.reset();

          // Add ticket to history table dynamically
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>TK-${Math.floor(Math.random()*1000)}</td>
            <td>${formData.get("heading")}</td>
            <td>Open</td>
            <td>${formData.get("priority")}</td>
            <td>${new Date().toLocaleDateString()}</td>
          `;
          ticketsBody.appendChild(row);
        } else {
          alert("❌ Failed to submit ticket. Try again.");
        }
      })
      .catch(err => {
        console.error("Error:", err);
        alert("⚠️ An error occurred while submitting the ticket.");
      });
  });
});
