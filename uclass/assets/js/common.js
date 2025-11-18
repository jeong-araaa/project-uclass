// ==========================
// 뒤로가기 버튼 공통
// ==========================
document.addEventListener('click', (e) => {
  const backBtn = e.target.closest('.btn--back');
  if (!backBtn) return;

  e.preventDefault();

  // (1) data-back-url 속성이 있으면 해당 페이지로 이동
  const targetUrl = backBtn.dataset.backUrl;
  if (targetUrl) {
    window.location.href = targetUrl;
    return;
  }

  // (2) 브라우저 히스토리 뒤로가기
  if (window.history.length > 1) {
    window.history.back();
  } else {
    // (3) 히스토리가 없을 때 fallback (예: 메인으로 이동)
    window.location.href = '/index.html';
  }
});