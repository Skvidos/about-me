document.addEventListener('DOMContentLoaded', async () => {
  const ITEMS_PER_PAGE = 6;
  let currentPage = 1;
  let rawTournaments = [];

  const container = document.getElementById('cardsContainer');
  const paginationTop = document.getElementById('paginationTop');
  const paginationBottom = document.getElementById('paginationBottom');

  const searchInput = document.getElementById('searchInput');
  const statusFilter = document.getElementById('statusFilter');
  const roleFilter = document.getElementById('roleFilter');
  const typeFilter = document.getElementById('typeFilter');
  const badgeFilter = document.getElementById('badgeFilter');
  const yearFilter = document.getElementById('yearFilter');
  const sortOrder = document.getElementById('sortOrder');

  // Load tournaments.json
  try {
    const response = await fetch('tournaments.json');
    rawTournaments = await response.json();
  } catch (error) {
    console.error('Failed to load tournaments.json:', error);
    container.innerHTML = '<p style="color: #ff8080; text-align: center;">Error loading tournaments data.</p>';
    return;
  }

  // Card template generator
  function createCardElement(item) {
    const card = document.createElement('div');
    card.className = 'tournament-card';

    // Render hosts
    const hostsHtml = item.hosts.map(h => `
      <a href="${h.url}" target="_blank">
        <span class="host-name">${h.name}</span>
        ${h.avatar ? `<img src="${h.avatar}" alt="${h.name}" class="host-avatar" />` : ''}
      </a>
    `).join('');

    // Render the Rucast / TC-Cast logo
    const rucastHtml = item.rucast ? `
      <a href="${item.rucast.url}" target="_blank">
        <div class="tournament-rucast ${item.rucast.class}"></div>
      </a>
    ` : '';

    // Render the badge
    let badgeHtml = '';
    if (item.badge && item.badge.hasBadge) {
      const icons = (item.badge.icons || []).map(icon => `<img src="${icon}" alt="Badge icon" class="badge-icon" />`).join('');
      badgeHtml = `<div class="badge-value">${icons}<span>${item.badge.statusText || ''}</span></div>`;
    } else {
      const badgeText = item.badge?.text || 'No badge';
      badgeHtml = `<div class="badge-value none">${badgeText}</div>`;
    }

    // Render roles
    const rolesHtml = item.roles.map(r => {
      if (r.url) {
        return `<a href="${r.url}"><span class="role-chip ${r.class}">${r.name}</span></a>`;
      }
      return `<span class="role-chip ${r.class}">${r.name}</span>`;
    }).join('');

    // Render links
    const linksHtml = item.links.map(l => `
      <a href="${l.url}" target="_blank" class="links-text-link">
        <img src="${l.icon}" alt="${l.name} Icon" class="link-icon" />
        ${l.name}
      </a>
    `).join('');

    card.innerHTML = `
      <div class="tournament-card-top">
        <div class="tournament-title-banner">
          <div class="tournament-number">${item.number}</div>
          ${rucastHtml}
          <div class="tournament-host">
            <span class="host-text">Hosted by</span>
            ${hostsHtml}
          </div>
          <div class="tournament-status status-${item.status}">${item.status}</div>
          <div class="tournament-logo-overlay">
            <img class="tournament-logo" src="${item.banner}" alt="" />
          </div>
          <div class="tournament-card-title">
            <p class="tournament-name">${item.name}</p>
            <p class="tournament-subtitle">${item.subtitle}</p>
          </div>
        </div>
      </div>
      <div class="tournament-details-grid">
        <div class="tournament-detail detail-dates">
          <div class="detail-label"><span class="detail-icon">📅</span>Dates</div>
          <div class="date-range">
            <div class="date-pill">Start: ${item.dates.start}</div>
            <div class="date-pill">End: ${item.dates.end}</div>
          </div>
        </div>
        <div class="tournament-detail">
          <div class="detail-label"><span class="detail-icon">🏅</span>Rank</div>
          <div>${item.rank}</div>
        </div>
        <div class="tournament-detail">
          <div class="detail-label"><span class="detail-icon">🎮</span>Type</div>
          <div>${item.type}</div>
        </div>
        <div class="tournament-detail">
          <div class="detail-label"><span class="detail-icon">⚔️</span>Format</div>
          <div>${item.format}</div>
        </div>
        <div class="tournament-detail">
          <div class="detail-label"><span class="detail-icon">🎖️</span>Badge</div>
          ${badgeHtml}
        </div>
        <div class="tournament-detail detail-roles">
          <div class="detail-label"><span class="detail-icon">👤</span>Roles</div>
          <div class="role-chips">${rolesHtml}</div>
        </div>
      </div>
      <div class="tournament-bottom-row">
        <div class="links-box">
          <h4 class="section-card-title">Links</h4>
          <div class="links-list">${linksHtml}</div>
        </div>
        <div class="description-box">
          <h4 class="section-card-title">Comments</h4>
          <p class="description-text">${item.comments || ''}</p>
        </div>
      </div>
    `;

    return card;
  }

  // Filtering and pagination logic
  function updateDisplay() {
    const query = searchInput.value.toLowerCase().trim();
    const selectedStatus = statusFilter.value;
    const selectedRole = roleFilter.value.toLowerCase();
    const selectedType = typeFilter.value;
    const selectedBadge = badgeFilter.value;
    const selectedYear = yearFilter.value;
    const order = sortOrder.value;

    let filtered = rawTournaments.filter(item => {
      const itemTitle = item.name.toLowerCase();
      const itemHosts = item.hosts.map(h => h.name.toLowerCase()).join(' ');
      const itemRoleNames = item.roles.map(r => r.name.toLowerCase());

      const yearMatch = (item.dates.start + ' ' + item.dates.end).match(/\b(202\d)\b/g);
      const itemYears = yearMatch ? Array.from(new Set(yearMatch)) : [];

      const matchesSearch = itemTitle.includes(query) || itemHosts.includes(query) || itemRoleNames.some(r => r.includes(query));
      const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
      const matchesRole = selectedRole === 'all' || itemRoleNames.some(r => r.toLowerCase().includes(selectedRole));
      const matchesType = selectedType === 'all' || item.type.toLowerCase() === selectedType.toLowerCase();
      const matchesYear = selectedYear === 'all' || itemYears.includes(selectedYear);

      let matchesBadge = true;
      const hasBadge = item.badge && item.badge.hasBadge;
      if (selectedBadge === 'badged') matchesBadge = hasBadge;
      if (selectedBadge === 'nobadge') matchesBadge = !hasBadge;

      return matchesSearch && matchesStatus && matchesRole && matchesType && matchesBadge && matchesYear;
    });

    // Sort by tournament number
    filtered.sort((a, b) => {
      const numA = parseInt(a.number, 10);
      const numB = parseInt(b.number, 10);
      return order === 'desc' ? numB - numA : numA - numB;
    });

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
    if (currentPage > totalPages) currentPage = 1;

    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const paginatedItems = filtered.slice(start, end);

    container.innerHTML = '';
    paginatedItems.forEach(item => {
      container.appendChild(createCardElement(item));
    });

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
    element?.addEventListener('change', () => { currentPage = 1; updateDisplay(); });
  });

  updateDisplay();
});