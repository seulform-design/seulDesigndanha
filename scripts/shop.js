/* ============================================================
   DANHA — shop.js (shop.html only)
   다축 필터 (category × style) + sort + pagination + result count
   ============================================================ */

if (document.body.classList.contains("shop-page")) {
  const shopCards = document.querySelectorAll(".shop-grid-section .product-card");
  const filterGroups = document.querySelectorAll(".filter-bar .filter-bar__group");
  const resultCount = document.querySelector(".shop-grid__count strong");
  const mainMeta = document.querySelector(".shop-minimal-main__meta");
  const filterNote = document.querySelector(".filter-bar__note");
  const totalCount = shopCards.length;

  const CATS = new Set(["all", "top", "skirt", "set", "outer"]);
  const state = { cat: "all", style: "all", sort: "popular" };

  const applyAll = () => {
    let visible = 0;
    shopCards.forEach((card) => {
      const cat = card.dataset.cat || "";
      const tag = card.dataset.styleTag || "";
      const matchCat = state.cat === "all" || cat === state.cat;
      const matchStyle = state.style === "all" || tag === state.style;
      const shouldShow = matchCat && matchStyle;
      card.hidden = !shouldShow;
      card.setAttribute("aria-hidden", shouldShow ? "false" : "true");
      if (shouldShow) visible += 1;
    });
    if (resultCount) resultCount.textContent = String(visible);
    if (mainMeta) {
      mainMeta.textContent = `필터 적용 결과 · ${visible} ITEMS`;
    }
    if (filterNote) {
      filterNote.textContent = `선택 즉시 반영 · 결과 ${visible}개 / ${totalCount}개 중 표시 중`;
    }
  };

  filterGroups.forEach((group) => {
    const buttons = group.querySelectorAll("button");
    buttons.forEach((button) => {
      button.setAttribute("aria-pressed", button.classList.contains("is-active") ? "true" : "false");
      button.addEventListener("click", () => {
        buttons.forEach((b) => {
          b.classList.remove("is-active");
          b.setAttribute("aria-pressed", "false");
        });
        button.classList.add("is-active");
        button.setAttribute("aria-pressed", "true");

        const filterValue = button.dataset.filter;
        const sortValue = button.dataset.sort;
        if (filterValue) {
          if (CATS.has(filterValue)) state.cat = filterValue;
          else state.style = filterValue;
        } else if (sortValue) {
          state.sort = sortValue;
        }
        applyAll();
      });
    });
  });

  applyAll();

  /* Pagination demo: active toggle + scroll */
  const paginationButtons = document.querySelectorAll(".pagination .pagination__page");
  paginationButtons.forEach((button) => {
    button.addEventListener("click", () => {
      paginationButtons.forEach((b) => {
        b.classList.remove("is-active");
        b.removeAttribute("aria-current");
      });
      button.classList.add("is-active");
      button.setAttribute("aria-current", "page");
      const target = document.querySelector(".shop-grid-section");
      if (target) window.scrollTo({ top: target.offsetTop, behavior: "smooth" });
    });
  });
}
