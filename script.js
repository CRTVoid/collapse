
document.addEventListener("DOMContentLoaded", function() {
    const toggle = document.getElementById("toggleSwitch");
    toggle.addEventListener("change", function() {
      document.body.classList.toggle("dark-mode");
      document.documentElement.classList.toggle("dark-mode");
    });
  });
