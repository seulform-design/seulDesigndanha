/* ============================================================
   DANHA — lookbook.js (lookbook.html only)
   에디션 anchor smooth-scroll. 향후 캠페인 인터랙션 자리.
   ============================================================ */

if (document.body.classList.contains("lookbook-page")) {
  const anchors = document.querySelectorAll('.lookbook-page a[href^="#"]');
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
