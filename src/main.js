import './style.css';
import { archives2025, tournaments2026 } from './data.js';

const statusLabels = {
  upcoming: 'UPCOMING',
  today: 'TODAY',
  ended: 'ENDED',
};

/** JSTを含むISO日時を基準に、開催日の0時からTODAYを返す。 */
function getTournamentStatus(tournament, now = new Date()) {
  const start = new Date(tournament.start);
  const end = new Date(tournament.end);
  const jstDate = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
  const eventDate = tournament.start.slice(0, 10);

  if (jstDate < eventDate) return 'upcoming';
  if (jstDate === eventDate && now <= end) return 'today';
  return 'ended';
}

function tournamentTemplate(tournament, index) {
  const status = getTournamentStatus(tournament);
  return `
    <article class="tournament-card tournament-card--${tournament.id} reveal" style="--delay: ${index % 3}" aria-labelledby="${tournament.id}-title">
      <span class="tournament-card__ghost" aria-hidden="true">${tournament.number}</span>
      <div class="tournament-card__top">
        <span class="tournament-card__number">${tournament.number}</span>
        <span class="status status--${status}"><i aria-hidden="true"></i>${statusLabels[status]}</span>
      </div>
      <div class="tournament-card__body">
        <p>GAME TITLE</p>
        <h3 id="${tournament.id}-title">${tournament.shortTitle}</h3>
        <span class="tournament-card__star" aria-hidden="true">✦</span>
      </div>
      <div class="tournament-card__schedule">
        <p><span>${tournament.dateLabel}</span><strong>${tournament.timeLabel} <small>JST</small></strong></p>
        <p><span>ENTRY</span><strong>${tournament.teams} TEAMS / ${tournament.players} PLAYERS</strong></p>
      </div>
    </article>`;
}

function rosterTemplate(archive) {
  const headerCells = archive.columns.map((column) => `<th scope="col">${column}</th>`).join('');
  const rows = archive.roster
    .map(([role, ...players]) => `
      <tr>
        <th scope="row">${role}</th>
        ${players.map((player) => `<td>${player}</td>`).join('')}
      </tr>`)
    .join('');

  return `
    <div class="roster-table-wrap" tabindex="0" role="region" aria-label="${archive.champion}の選手一覧">
      <table>
        <thead><tr><th scope="col">ROLE</th>${headerCells}</tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

function archiveTemplate(archive, index) {
  return `
    <article class="archive-card reveal" style="--delay: ${index}" aria-labelledby="archive-${archive.edition}-title">
      <div class="archive-card__rail"><span>${archive.edition}</span><i></i><small>2025</small></div>
      <div class="archive-card__content">
        <div class="archive-card__title-row">
          <div><p>TOURNAMENT ${archive.edition}</p><h3 id="archive-${archive.edition}-title">${archive.title}</h3></div>
          <a class="stream-button" href="${archive.stream}" target="_blank" rel="noopener noreferrer" aria-label="${archive.title}の配信アーカイブをYouTubeで見る（新しいタブで開きます）">
            <span><small>YOUTUBE / FULL STREAM</small>▶ WATCH ARCHIVE</span><b aria-hidden="true">↗</b>
          </a>
        </div>
        <div class="archive-card__facts"><span>${archive.date}</span><span>${archive.time}</span><span>${archive.teams} TEAMS</span><span>${archive.players} PLAYERS</span></div>
        <div class="champion">
          <div class="champion__heading"><span class="trophy" aria-hidden="true">♕</span><div><p>CHAMPION</p><h4>${archive.champion}</h4></div></div>
          ${rosterTemplate(archive)}
        </div>
      </div>
    </article>`;
}

document.querySelector('[data-tournaments]').innerHTML = tournaments2026.map(tournamentTemplate).join('');
document.querySelector('[data-archives]').innerHTML = archives2025.map(archiveTemplate).join('');

const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('[data-menu-button]');
const menu = document.querySelector('[data-menu]');
const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

function setMenu(open) {
  menuButton.setAttribute('aria-expanded', String(open));
  menu.hidden = !open;
  document.body.classList.toggle('menu-open', open);
  menuButton.querySelector('span').textContent = open ? 'CLOSE' : 'MENU';
}

menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMenu(false);
});

const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !motionQuery.matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  reveals.forEach((element) => revealObserver.observe(element));
} else {
  reveals.forEach((element) => element.classList.add('is-visible'));
}

const hero = document.querySelector('[data-hero]');
const heroMedia = document.querySelector('[data-hero-media]');
const heroGlow = document.querySelector('[data-hero-glow]');
let pointerFrame;

hero.addEventListener('pointermove', (event) => {
  if (motionQuery.matches || event.pointerType === 'touch') return;
  cancelAnimationFrame(pointerFrame);
  pointerFrame = requestAnimationFrame(() => {
    const bounds = hero.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    heroGlow.style.setProperty('--pointer-x', `${x * 100}%`);
    heroGlow.style.setProperty('--pointer-y', `${y * 100}%`);
    heroMedia.style.setProperty('--parallax-x', `${(x - 0.5) * -10}px`);
    heroMedia.style.setProperty('--parallax-y', `${(y - 0.5) * -8}px`);
  });
});

document.querySelector('[data-paw]').addEventListener('click', (event) => {
  event.currentTarget.classList.remove('is-bouncing');
  requestAnimationFrame(() => event.currentTarget.classList.add('is-bouncing'));
});
