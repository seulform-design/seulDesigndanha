/* ============================================================
   DANHA — style.js (style.html only)
   현재는 페이지 고유 인터랙션이 별도로 필요하지 않으므로
   향후 확장(style category click → board scroll, sticker animation 등)을 위한 자리만 둠.
   ============================================================ */

if (document.body.classList.contains("style-page")) {
  /* Smooth scroll for category cards (a[href^="#"]) — 기본 anchor 동작에 추가 효과 */
  const anchors = document.querySelectorAll('.style-page a[href^="#"]');
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
