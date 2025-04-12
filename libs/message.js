export const showMessage = (elementId, message) => {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.textContent = message;
  el.classList.add("show");
  setTimeout(() => {
    el.classList.remove("show");
    el.textContent = "";
  }, 2500);
};
