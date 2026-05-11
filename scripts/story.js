/* ============================================================
   DANHA — story.js (story.html only)
   chapter anchors smooth-scroll · 향후 비주얼 컷 카루셀 자리
   ============================================================ */

if (document.body.classList.contains("story-page")) {
  const anchors = document.querySelectorAll('.story-page a[href^="#"]');
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
