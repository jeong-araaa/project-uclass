// 1) 페이지 로드 시: hidden.value가 있으면 버튼 라벨로 보여주고 has-value 유지
document.querySelectorAll('.form-row').forEach(row => {
  const btn = row.querySelector('.btn-select');
  const hid = row.querySelector('input[type="hidden"]');
  if (!btn || !hid) return;

  if (!btn.dataset.default) btn.dataset.default = btn.textContent.trim();

  const v = (hid.value || '').trim();
  if (v) {
    btn.textContent = v;          // 👉 초기 라벨 채움
    row.classList.add('has-value');
  } else {
    btn.textContent = btn.dataset.default || btn.textContent;
    row.classList.remove('has-value');
  }

  // hidden.value가 코드로 변경되는 경우도 따라감
  new MutationObserver(() => {
    const nv = (hid.value || '').trim();
    if (nv) {
      btn.textContent = nv;
      row.classList.add('has-value');
    } else {
      btn.textContent = btn.dataset.default || btn.textContent;
      row.classList.remove('has-value');
    }
  }).observe(hid, { attributes: true, attributeFilter: ['value'] });
});

// 2) select-list 클릭 시: 버튼 라벨/hidden 값/상태 갱신 (모달 닫기 X)
document.addEventListener('click', (e) => {
  const li = e.target.closest('.select-list li');
  if (!li) return;

  const modal   = li.closest('.modal');
  const trigger = modal && document.querySelector(`[data-modal-open="${modal.id}"]`);
  if (!trigger) return;

  const row = trigger.closest('.form-row');
  const hid = row?.querySelector('input[type="hidden"]');

  const label = (li.dataset.label || li.textContent || '').trim();
  const value = (li.dataset.value || li.dataset.att || label).trim();

  trigger.textContent = label;     // 버튼 표시
  if (hid) hid.value = value;      // hidden 값
  row?.classList.add('has-value'); // 상태 유지
  row?.classList.remove('is-focus');

  // 선택 표시(스타일용)
  li.parentElement.querySelectorAll('li.is-selected,[aria-selected="true"]').forEach(s => {
    s.classList.remove('is-selected'); s.removeAttribute('aria-selected');
  });
  li.classList.add('is-selected'); li.setAttribute('aria-selected', 'true');

  // 출결 전용: 필드 토글 (있을 때만)
  if (li.dataset.att) {
    document.querySelectorAll('[data-att-fields]').forEach(box => {
      box.hidden = box.dataset.attFields !== li.dataset.att;
    });
  }
});

// 3) 버튼 클릭 시 포커스 표시만 (퍼블)
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-select');
  if (!btn) return;
  btn.closest('.form-row')?.classList.add('is-focus');
});

// 4) 바깥 클릭 시 포커스 해제, 값 없으면 기본 라벨 복원
document.addEventListener('click', (e) => {
  document.querySelectorAll('.form-row').forEach(row => {
    if (row.contains(e.target)) return;
    const btn = row.querySelector('.btn-select');
    const hid = row.querySelector('input[type="hidden"]');
    row.classList.remove('is-focus');
    if (btn && hid && !hid.value && btn.dataset.default) {
      btn.textContent = btn.dataset.default;
      row.classList.remove('has-value');
    }
  });
});