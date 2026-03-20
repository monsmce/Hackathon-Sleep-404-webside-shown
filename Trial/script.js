const menuBtn = document.getElementById("menuBtn");
const menuBtnMobile = document.getElementById("menuBtnMobile");
const sideMenu = document.getElementById("sideMenu");
const closeMenu = document.getElementById("closeMenu");
const overlay = document.getElementById("overlay");

// OPEN MENU (desktop)
if (menuBtn) {
  menuBtn.onclick = () => {
    sideMenu.classList.add("active");
    overlay.classList.add("active");
  };
}

// OPEN MENU (mobile)
if (menuBtnMobile) {
  menuBtnMobile.onclick = () => {
    sideMenu.classList.add("active");
    overlay.classList.add("active");
  };
}

// CLOSE MENU
function closeMenuFunc() {
  sideMenu.classList.remove("active");
  overlay.classList.remove("active");
}

if (closeMenu) closeMenu.onclick = closeMenuFunc;
if (overlay) overlay.onclick = closeMenuFunc;

// FIX: reset menu when resizing
window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    sideMenu.classList.remove("active");
    overlay.classList.remove("active");
  }
});

function toggleMenu(section) {
  const all = document.querySelectorAll(".menu-section");

  all.forEach(s => {
    if (s !== section) {
      s.classList.remove("active");
      s.querySelector(".menu-title span:last-child").textContent = "+";
    }
  });

  section.classList.toggle("active");

  const icon = section.querySelector(".menu-title span:last-child");
  icon.textContent = section.classList.contains("active") ? "−" : "+";
}