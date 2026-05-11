/* ============================================================
   DANHA — style-test.js (style-test.html only)
   3문항 multi-choice + 결과 텍스트 동적 생성
   ============================================================ */

const styleTestChoiceButtons = document.querySelectorAll(".question .options button[data-test-group]");
const styleTestSubmitButton = document.querySelector("#test-submit");
const styleTestResultText = document.querySelector("#test-result");

if (styleTestChoiceButtons.length) {
  styleTestChoiceButtons.forEach((button) => {
    button.setAttribute("aria-pressed", button.classList.contains("is-active") ? "true" : "false");
    button.addEventListener("click", () => {
      const group = button.dataset.testGroup;
      if (!group) return;
      styleTestChoiceButtons.forEach((item) => {
        if (item.dataset.testGroup === group) {
          item.classList.remove("is-active");
          item.setAttribute("aria-pressed", "false");
        }
      });
      button.classList.add("is-active");
      button.setAttribute("aria-pressed", "true");
    });
  });
}

if (styleTestSubmitButton && styleTestResultText) {
  styleTestSubmitButton.addEventListener("click", () => {
    const selected = { mood: "", scene: "", fit: "" };
    styleTestChoiceButtons.forEach((button) => {
      if (button.classList.contains("is-active")) {
        const group = button.dataset.testGroup;
        const value = button.dataset.testValue;
        if (!group || !value) return;
        selected[group] = value;
      }
    });

    if (!selected.mood || !selected.scene || !selected.fit) {
      styleTestResultText.textContent = "3개 항목을 모두 선택하면 추천 결과를 확인할 수 있어요.";
      return;
    }

    const recommendation =
      selected.scene === "오피스"
        ? "모던 저고리 재킷 + 랩 미디 스커트"
        : selected.scene === "데이트"
          ? "실크 랩 스커트 + 소프트 레이어 원피스"
          : selected.scene === "여행"
            ? "데일리 한복 셔츠 + 와이드 팬츠 + 스니커즈"
            : "데일리 한복 셔츠 + 소프트 무드 스니커즈";

    styleTestResultText.textContent = `${selected.mood} · ${selected.scene} · ${selected.fit} 기준 추천: ${recommendation} / 추천 근거: 최근 ${selected.scene} 무드 탐색과 ${selected.fit} 선호`;
  });
}
