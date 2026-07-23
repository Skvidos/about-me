document.addEventListener('DOMContentLoaded', () => {
  const ITEMS_PER_PAGE = 6;
  let currentPage = 1;

  const container = document.getElementById('cardsContainer');
  const paginationTop = document.getElementById('paginationTop');
  const paginationBottom = document.getElementById('paginationBottom');

  const cards = Array.from(container.getElementsByClassName('tournament-card'));

  const searchInput = document.getElementById('searchInput');
  const statusFilter = document.getElementById('statusFilter');
  const roleFilter = document.getElementById('roleFilter');
  const typeFilter = document.getElementById('typeFilter');
  const badgeFilter = document.getElementById('badgeFilter');
  const yearFilter = document.getElementById('yearFilter');
  const sortOrder = document.getElementById('sortOrder');

  const parsedCards = cards.map((card, index) => {
    const title = card.querySelector('.tournament-name')?.textContent.toLowerCase() || '';
    const host = card.querySelector('.host-name')?.textContent.toLowerCase() || '';
    const number = parseInt(card.querySelector('.tournament-number')?.textContent || index, 10);

    let status = 'completed';
    if (card.querySelector('.status-ongoing')) status = 'ongoing';
    if (card.querySelector('.status-upcoming')) status = 'upcoming';

    const roles = Array.from(card.querySelectorAll('.role-chip')).map(chip => chip.textContent.toLowerCase());

    const details = Array.from(card.querySelectorAll('.tournament-detail'));
    const typeDetail = details.find(d => d.querySelector('.detail-label')?.textContent.includes('Type'));
    const type = typeDetail ? typeDetail.querySelector('div:not(.detail-label)')?.textContent.trim() : '';

    const badgeElement = card.querySelector('.badge-value');
    const hasBadge = badgeElement ? !badgeElement.classList.contains('none') && !badgeElement.querySelector('.none') : false;

    const datesText = card.querySelector('.detail-dates')?.textContent || '';
    const yearMatch = datesText.match(/\b(202\d)\b/);
    const year = yearMatch ? yearMatch[1] : '';

    return { element: card, title, host, number, status, roles, type, hasBadge, year };
  });

  function updateDisplay() {
    const query = searchInput.value.toLowerCase().trim();
    const selectedStatus = statusFilter.value;
    const selectedRole = roleFilter.value.toLowerCase();
    const selectedType = typeFilter.value;
    const selectedBadge = badgeFilter.value;
    const selectedYear = yearFilter.value;
    const order = sortOrder.value;

    let filtered = parsedCards.filter(item => {
      const matchesSearch = item.title.includes(query) || item.host.includes(query) || item.roles.some(r => r.includes(query));
      const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
      const matchesRole = selectedRole === 'all' || item.roles.some(r => r.includes(selectedRole));
      const matchesType = selectedType === 'all' || item.type.toLowerCase() === selectedType.toLowerCase();
      const matchesYear = selectedYear === 'all' || item.year === selectedYear;

      let matchesBadge = true;
      if (selectedBadge === 'badged') matchesBadge = item.hasBadge;
      if (selectedBadge === 'nobadge') matchesBadge = !item.hasBadge;

      return matchesSearch && matchesStatus && matchesRole && matchesType && matchesBadge && matchesYear;
    });

    filtered.sort((a, b) => order === 'desc' ? b.number - a.number : a.number - b.number);

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
    if (currentPage > totalPages) currentPage = 1;

    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const paginatedItems = filtered.slice(start, end);

    container.innerHTML = '';
    paginatedItems.forEach(item => container.appendChild(item.element));

    renderPagination(totalPages);
  }

  function renderPagination(totalPages) {
    paginationTop.innerHTML = '';
    paginationBottom.innerHTML = '';

    if (totalPages <= 1) return;

    const createPaginationControls = () => {
      const fragment = document.createDocumentFragment();

      const prevBtn = document.createElement('button');
      prevBtn.className = 'page-btn';
      prevBtn.textContent = '« Prev';
      prevBtn.disabled = currentPage === 1;
      prevBtn.addEventListener('click', () => {
        currentPage--;
        updateDisplay();
      });
      fragment.appendChild(prevBtn);

      for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
        btn.textContent = i;
        btn.addEventListener('click', () => {
          currentPage = i;
          updateDisplay();
        });
        fragment.appendChild(btn);
      }

      const nextBtn = document.createElement('button');
      nextBtn.className = 'page-btn';
      nextBtn.textContent = 'Next »';
      nextBtn.disabled = currentPage === totalPages;
      nextBtn.addEventListener('click', () => {
        currentPage++;
        updateDisplay();
      });
      fragment.appendChild(nextBtn);

      return fragment;
    };

    paginationTop.appendChild(createPaginationControls());
    paginationBottom.appendChild(createPaginationControls());
  }

  [searchInput, statusFilter, roleFilter, typeFilter, badgeFilter, yearFilter, sortOrder].forEach(element => {
    element?.addEventListener('input', () => { currentPage = 1; updateDisplay(); });
  });

  updateDisplay();
});