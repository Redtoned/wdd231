// Stamp the hidden timestamp field with the moment the form was loaded
document.getElementById("timestamp").value = new Date().toISOString();

// Wire each membership card link to its matching <dialog> modal
document.querySelectorAll(".modal-link").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const modal = document.getElementById(link.dataset.modal);
    if (modal) {
      modal.showModal();
    }
  });
});

document.querySelectorAll(".benefits-modal").forEach((modal) => {
  const closeBtn = modal.querySelector(".modal-close");
  closeBtn.addEventListener("click", () => modal.close());

  // Close when clicking outside the modal content (on the backdrop)
  modal.addEventListener("click", (event) => {
    const rect = modal.getBoundingClientRect();
    const clickedInside =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;
    if (!clickedInside) {
      modal.close();
    }
  });
});
