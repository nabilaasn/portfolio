/* PORTFOLIO SITI NABILA — main.js */

const GITHUB_USERNAME = 'nabilaasn';

const LANG_COLORS = {
  JavaScript:'#f1e05a', TypeScript:'#3178c6', PHP:'#777bb4',
  Python:'#3572A5', Java:'#b07219', HTML:'#e34c26', CSS:'#563d7c',
  Kotlin:'#A97BFF', Dart:'#00B4AB', Vue:'#41b883', Shell:'#89e051',
  default:'#8888a0'
};

function repoIcon(name, desc='') {
  const s = (name+' '+desc).toLowerCase();
  if (s.match(/android|mobile|kotlin|dart/)) return '📱';
  if (s.match(/web|html|css|frontend/)) return '🌐';
  if (s.match(/api|backend|server|laravel|node/)) return '⚙️';
  if (s.match(/data|ml|predict|mining|analys/)) return '📊';
  if (s.match(/admin|crud|sistem|system|manaj/)) return '🗂️';
  if (s.match(/game/)) return '🎮';
  if (s.match(/ui|design/)) return '🎨';
  return '💻';
}

async function loadGithubRepos() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  grid.innerHTML = '<div class="projects-loading"><div class="spinner"></div><br>Mengambil proyek dari GitHub...</div>';

  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=30&type=owner`,
      { headers: { 'Accept': 'application/vnd.github.v3+json' } }
    );
    if (!res.ok) throw new Error('API error '+res.status);

    const repos = await res.json();
    const filtered = repos
      .filter(r => !r.fork && !r.archived && r.name !== GITHUB_USERNAME)
      .sort((a,b) => (b.stargazers_count - a.stargazers_count) || new Date(b.updated_at) - new Date(a.updated_at))
      .slice(0, 9);

    if (!filtered.length) {
      grid.innerHTML = '<div class="projects-loading">Belum ada repositori publik.</div>';
      return;
    }

    grid.innerHTML = filtered.map(repo => {
      const lang = repo.language || 'Other';
      const color = LANG_COLORS[lang] || LANG_COLORS.default;
      const desc = repo.description || 'Tidak ada deskripsi.';
      const icon = repoIcon(repo.name, desc);
      const updated = new Date(repo.updated_at).toLocaleDateString('id-ID',{month:'short',year:'numeric'});
      const topics = (repo.topics||[]).slice(0,3);
      const topicHTML = topics.length
        ? topics.map(t=>`<span class="proj-topic">${t}</span>`).join('')
        : `<span class="proj-topic">${lang.toLowerCase()}</span>`;
      return `
        <a href="${repo.html_url}" target="_blank" rel="noopener" class="project-card fade-up">
          <div class="proj-top">
            <div class="proj-icon-wrap">${icon}</div>
            <span class="proj-arrow">↗</span>
          </div>
          <div class="proj-name">${repo.name}</div>
          <div class="proj-desc">${desc}</div>
          <div class="proj-meta">
            <span class="proj-lang"><span class="lang-dot" style="background:${color}"></span>${lang}</span>
            <span class="proj-stars">⭐ ${repo.stargazers_count}</span>
            <span class="proj-lang" style="margin-left:auto">🕐 ${updated}</span>
          </div>
          <div class="proj-topics">${topicHTML}</div>
        </a>`;
    }).join('');

    requestAnimationFrame(() => {
      document.querySelectorAll('#projects-grid .fade-up').forEach((el,i) => {
        setTimeout(() => el.classList.add('visible'), i * 80);
      });
    });
  } catch(err) {
    console.error(err);
    grid.innerHTML = `<div class="projects-loading"><p>Gagal memuat dari GitHub.</p><p style="margin-top:0.5rem"><a href="https://github.com/${GITHUB_USERNAME}" target="_blank" style="color:var(--accent2);text-decoration:none">Kunjungi profil GitHub →</a></p></div>`;
  }
}

function initFadeObserver() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-up').forEach(el => io.observe(el));
}

function initNav() {
  const nav = document.querySelector('nav');
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY>60), {passive:true});
}

function initHeroAnim() {
  document.querySelectorAll('.hero-anim').forEach((el,i) => {
    el.style.cssText = 'opacity:0;transform:translateY(20px);transition:opacity 0.6s ease,transform 0.6s ease';
    setTimeout(() => el.style.cssText += ';opacity:1;transform:translateY(0)', 150 + i*120);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initNav(); initHeroAnim(); initFadeObserver(); loadGithubRepos();
});
