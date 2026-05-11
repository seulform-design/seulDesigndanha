/* ============================================================
   DANHA — detail.js (detail.html only)
   PDP options · qty stepper · gallery thumb · sticky-bar sync
   ============================================================ */

const optionButtons = document.querySelectorAll(".option-btn");
const buyNowBtn = document.querySelector("#buy-now-btn");
const addCartBtn = document.querySelector("#add-cart-btn");
const stickyBuyBtn = document.querySelector("#sticky-buy-btn");
const stickyCartBtn = document.querySelector("#sticky-cart-btn");
const errorMessage = document.querySelector("#pdp-error");
const qtyValue = document.querySelector("#qty-value");
const qtyButtons = document.querySelectorAll("[data-qty-action]");
const pdpMainImage = document.querySelector("#pdp-main-image");
const pdpThumbButtons = document.querySelectorAll(".pdp-thumb");

/* ---------- Options + buy state sync ---------- */
if (optionButtons.length && buyNowBtn) {
  const selectedOptions = { size: "", color: "" };
  let quantity = 1;

  const syncBuyState = () => {
    const isReady = !!selectedOptions.size && !!selectedOptions.color;
    buyNowBtn.disabled = !isReady;
    if (stickyBuyBtn) stickyBuyBtn.disabled = !isReady;
    if (errorMessage) errorMessage.hidden = isReady;
  };

  optionButtons.forEach((button) => {
    button.setAttribute("aria-pressed", "false");
    button.addEventListener("click", () => {
      const group = button.dataset.optionGroup;
      const value = button.dataset.optionValue;
      if (!group || !value) return;
      optionButtons.forEach((item) => {
        if (item.dataset.optionGroup === group) {
          item.classList.remove("is-active");
          item.setAttribute("aria-pressed", "false");
        }
      });
      button.classList.add("is-active");
      button.setAttribute("aria-pressed", "true");
      selectedOptions[group] = value;
      syncBuyState();
    });
  });

  qtyButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.qtyAction;
      quantity = action === "plus" ? quantity + 1 : Math.max(1, quantity - 1);
      if (qtyValue) qtyValue.textContent = String(quantity);
    });
  });

  const handleTryPurchase = () => {
    if (!selectedOptions.size || !selectedOptions.color) {
      if (errorMessage) errorMessage.hidden = false;
      const optionsSection = document.querySelector(".pdp-options");
      if (optionsSection) optionsSection.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (errorMessage) errorMessage.hidden = true;
  };

  buyNowBtn.addEventListener("click", handleTryPurchase);
  if (stickyBuyBtn) stickyBuyBtn.addEventListener("click", handleTryPurchase);
  if (addCartBtn) addCartBtn.addEventListener("click", handleTryPurchase);
  if (stickyCartBtn) stickyCartBtn.addEventListener("click", handleTryPurchase);
}

/* ---------- Gallery thumb switching ---------- */
if (pdpMainImage && pdpThumbButtons.length) {
  pdpThumbButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const nextSrc = button.dataset.fullSrc;
      const nextAlt = button.dataset.fullAlt;
      if (!nextSrc) return;
      pdpMainImage.src = nextSrc;
      if (nextAlt) pdpMainImage.alt = nextAlt;
      pdpThumbButtons.forEach((item) => {
        item.classList.remove("is-active");
        item.setAttribute("aria-selected", "false");
      });
      button.classList.add("is-active");
      button.setAttribute("aria-selected", "true");
    });
  });
}
