/* ============================================================
   DANHA — brand.js (brand.html only)
   섹션 anchor smooth-scroll
   ============================================================ */

if (document.body.classList.contains("brand-page")) {
  const anchors = document.querySelectorAll('.brand-page a[href^="#"]');
  anchors.forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });
}
