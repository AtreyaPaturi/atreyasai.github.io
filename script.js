/* Interface behaviour. Edit content.js to change your profile and entries. */
(() => {
  'use strict';
  const data = window.SITE_CONTENT;
  if (!data) return;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const escape = value => String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = matchMedia('(min-width: 901px)');
  const sampleBadge = item => item.sample ? '<span class="sample-badge">SAMPLE</span>' : '';
  const dateText = value => {
    if (!value) return '';
    const date = new Date(`${value}T12:00:00`);
    return Number.isNaN(date.getTime()) ? '' : new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
  };
  const byDate = items => [...items].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  function safeUrl(value) {
    if (typeof value !== 'string' || !value.trim()) return '';
    try {
      const url = new URL(value, 'https://local.invalid/');
      return ['https:', 'http:', 'mailto:'].includes(url.protocol) ? value.trim() : '';
    } catch { return ''; }
  }
  function linkHtml(label, value, className = '') {
    const url = safeUrl(value);
    if (!url) return '';
    const external = /^https?:/i.test(url) ? ' target="_blank" rel="noopener noreferrer"' : '';
    return `<a href="${escape(url)}" class="${escape(className)}"${external}>${escape(label)} <span aria-hidden="true">↗</span></a>`;
  }
  const linksHtml = links => (links || []).map(link => linkHtml(link.label, link.url)).join('');
  const sampleStatus = (items, noun) => {
    const sampleCount = items.filter(item => item.sample).length;
    return `${items.length} ${items.length === 1 ? noun : noun + 's'}${sampleCount ? ` · ${sampleCount} sample ${sampleCount === 1 ? 'entry' : 'entries'}` : ''}`;
  };
  const paragraphsHtml = paragraphs => (paragraphs || []).map(text => `<p>${escape(text)}</p>`).join('');
  const readMinutes = blog => Math.max(1, Math.ceil((blog.paragraphs || []).join(' ').trim().split(/\s+/).length / 220));
  const metric = (value, suffix) => value === null || value === undefined || value === '' ? '—' : `${escape(value)}${suffix}`;
  const routeMetrics = item => `<div><strong>${metric(item.distanceKm, ' km')}</strong><span>Distance</span></div><div><strong>${metric(item.ascentM, ' m')}</strong><span>Ascent</span></div><div><strong>${escape(item.duration || '—')}</strong><span>Time</span></div>`;

  // Identity: no unverified institution, contact address, publications, or availability.
  const profile = data.profile;
  $$('[data-profile="name"]').forEach(element => element.textContent = profile.name || 'Your Name');
  const nameParts = (profile.name || 'Your Name').trim().split(/\s+/);
  const firstLine = nameParts.shift();
  const lastLine = nameParts.join(' ');
  $('#hero-title').innerHTML = `<span>${escape(firstLine)}${lastLine ? '' : '<span class="orange-dot">.</span>'}</span>${lastLine ? `<span>${escape(lastLine)}<span class="orange-dot">.</span></span>` : ''}`;
  const longestNameLine = Math.max(firstLine.length, lastLine.length);
  if (longestNameLine > 10) $('#hero-title').style.fontSize = `clamp(52px, ${Math.max(5.5, 136 / longestNameLine)}vw, 180px)`;
  $('#hero-affiliation').textContent = [profile.role, profile.institution].filter(Boolean).join(' / ') || 'RESEARCH & LIFE';
  $('#hero-introduction').textContent = profile.introduction || 'Research, weekly reflections, and life beyond the desk.';
  document.title = `${profile.name || 'Your Name'} — Research & Life`;
  $('meta[name="description"]').setAttribute('content', profile.introduction || 'Weekly notes, research projects, and life beyond the desk.');
  $('#academic-affiliation').textContent = [profile.field, profile.role === 'Research & life' ? '' : profile.role, profile.institution].filter(Boolean).join(' · ') || 'Research field and affiliation to be added.';
  $('#profile-bio').textContent = profile.biography || 'A short academic biography will appear here.';
  $('#research-focus').textContent = profile.researchFocus || 'Research questions and their significance to be added.';
  $('#research-methods').innerHTML = profile.methods.length ? `<div class="method-tags">${profile.methods.map(method => `<span>${escape(method)}</span>`).join('')}</div>` : '<p class="profile-incomplete">Methods and areas of expertise to be added.</p>';
  $('#research-next').innerHTML = profile.futureInterests.length ? `<ul>${profile.futureInterests.map(interest => `<li>${escape(interest)}</li>`).join('')}</ul>` : '<p class="profile-incomplete">Future research directions to be added.</p>';
  $('#postdoc-status').hidden = !profile.seekingPostdoc;
  const academicLinks = [['CV / résumé', profile.cvUrl], ['Google Scholar', profile.scholarUrl], ['ORCID', profile.orcidUrl], ['GitHub', profile.githubUrl], ['LinkedIn', profile.linkedinUrl]].map(([label, url]) => linkHtml(label, url)).join('');
  $('#profile-links').innerHTML = academicLinks || '<p class="profile-incomplete">CV and academic profile links to be added.</p>';
  const email = String(profile.email || '').trim();
  $('#contact-details').innerHTML = email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? `<div class="contact-main">${linkHtml(email, `mailto:${email}`)}</div>` : '<p class="contact-empty">Contact details to be added.</p>';
  $('#current-year').textContent = new Date().getFullYear();

  // Weekly blogs, newest first. Expand the archive only when there are more entries.
  let allBlogs = false;
  function renderBlogs() {
    const blogs = byDate(data.blogs);
    const visible = allBlogs ? blogs : blogs.slice(0, 3);
    $('#blog-list').innerHTML = visible.length ? visible.map(blog => `<article class="blog-card"><div class="entry-meta"><span>${escape(blog.category || 'Notes')}</span>${sampleBadge(blog)}</div><a class="blog-link" href="#blog-${escape(blog.id)}"><h3>${escape(blog.title)}</h3><p>${escape(blog.summary)}</p><span class="blog-read"><span>${dateText(blog.date) ? escape(dateText(blog.date)) + ' · ' : ''}${readMinutes(blog)} min read</span><span aria-hidden="true">↗</span></span></a></article>`).join('') : '<p class="empty-state">The first field note is on its way.</p>';
    $('#blog-status').textContent = sampleStatus(blogs, 'note');
    $('#more-blogs').hidden = blogs.length <= 3;
    $('#more-blogs').innerHTML = `${allBlogs ? 'Show latest notes' : `View all ${blogs.length} notes`} <span aria-hidden="true">${allBlogs ? '↑' : '↗'}</span>`;
  }
  $('#more-blogs').addEventListener('click', () => { allBlogs = !allBlogs; renderBlogs(); measureProjects(); });
  renderBlogs();

  // Dated career and personal updates.
  let updateFilter = 'All';
  let allUpdates = false;
  function renderUpdates() {
    const filtered = byDate(data.updates).filter(item => updateFilter === 'All' || item.category === updateFilter);
    const visible = allUpdates ? filtered : filtered.slice(0, 6);
    $('#updates-list').innerHTML = visible.length ? visible.map(item => `<article class="update-row"><div class="update-date">${item.sample ? sampleBadge(item) : escape(dateText(item.date) || 'Undated')}</div><span class="update-category ${item.category === 'Personal' ? 'personal' : ''}">${escape(item.category)}</span><div class="update-copy"><h3>${escape(item.title)}</h3><p>${escape(item.text)}</p></div>${safeUrl(item.url) ? `<a class="update-outlink" href="${escape(safeUrl(item.url))}" target="_blank" rel="noopener noreferrer" aria-label="Read more about ${escape(item.title)}">↗</a>` : ''}</article>`).join('') : '<p class="empty-state">No updates in this category yet.</p>';
    $('#update-status').textContent = sampleStatus(filtered, 'update');
    $('#more-updates').hidden = filtered.length <= 6;
    $('#more-updates').innerHTML = `${allUpdates ? 'Show recent updates' : 'Show more updates'} <span aria-hidden="true">${allUpdates ? '↑' : '↓'}</span>`;
  }
  $$('[data-update-filter]').forEach(button => button.addEventListener('click', () => {
    updateFilter = button.dataset.updateFilter; allUpdates = false;
    $$('[data-update-filter]').forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
    renderUpdates(); measureProjects();
  }));
  $('#more-updates').addEventListener('click', () => { allUpdates = !allUpdates; renderUpdates(); measureProjects(); });
  renderUpdates();

  // The orange, scroll-driven project gallery preserves the reference's key interaction.
  $('#project-list').innerHTML = data.projects.length ? data.projects.map((item, index) => `<article class="project-card"><div class="project-card-top"><span class="project-number" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span><div class="project-status"><span>${escape(item.status)}</span>${sampleBadge(item)}</div></div><div class="project-card-content"><h3>${escape(item.title)}</h3><div><p>${escape(item.summary)}</p><a class="text-button" href="#project-${escape(item.id)}">Read project <span aria-hidden="true">↗</span></a></div></div><div class="project-tags">${(item.tags || []).map(tag => `<span>${escape(tag)}</span>`).join('')}</div></article>`).join('') : '<article class="project-card"><h3>Research projects to follow.</h3></article>';
  $('#project-dots').innerHTML = data.projects.map((item, index) => `<button type="button" data-project-jump="${index}" aria-pressed="${index === 0}" aria-label="Show project ${index + 1}: ${escape(item.title)}">${String(index + 1).padStart(2, '0')}</button>`).join('');
  const projectSection = $('#project-scroll');
  const projectViewport = $('.project-viewport');
  const projectTrack = $('.project-track');
  const projectCards = $$('.project-card');
  const projectButtons = $$('[data-project-jump]');
  let projectDistance = 0;
  let projectTop = 0;
  let scrollingProjects = false;
  let framePending = false;
  let activeProject = 0;
  function setProjectProgress(position) {
    activeProject = projectCards.reduce((current, card, index) => position >= card.offsetLeft - projectViewport.clientWidth * .42 ? index : current, 0);
    projectButtons.forEach((button, index) => button.setAttribute('aria-pressed', String(index === activeProject)));
    $('#project-counter').textContent = data.projects.length ? `${String(activeProject + 1).padStart(2, '0')} / ${String(data.projects.length).padStart(2, '0')}` : '00 / 00';
    projectSection.style.setProperty('--progress', String(projectDistance ? clamp(position / projectDistance) : 1));
  }
  function updateProjects() {
    framePending = false;
    if (!scrollingProjects) return;
    const position = clamp(window.scrollY - projectTop, 0, projectDistance);
    projectTrack.style.transform = `translate3d(${-position}px,0,0)`;
    setProjectProgress(position);
  }
  function queueProjects() { if (!framePending) { framePending = true; requestAnimationFrame(updateProjects); } }
  function measureProjects() {
    scrollingProjects = desktop.matches && !reducedMotion.matches && data.projects.length > 1;
    document.documentElement.classList.toggle('scroll-projects', scrollingProjects);
    projectDistance = Math.max(0, projectTrack.scrollWidth - projectViewport.clientWidth);
    projectSection.style.height = scrollingProjects ? `${projectDistance + $('.project-sticky').offsetHeight}px` : '';
    projectTop = projectSection.getBoundingClientRect().top + window.scrollY;
    projectTrack.style.transform = '';
    if (scrollingProjects) projectViewport.scrollLeft = 0;
    setProjectProgress(projectViewport.scrollLeft);
    queueProjects();
  }
  function goToProject(index) {
    if (!projectCards[index]) return;
    const position = clamp(projectCards[index].offsetLeft - parseFloat(getComputedStyle(projectTrack).paddingLeft), 0, projectDistance);
    const behavior = reducedMotion.matches ? 'instant' : 'smooth';
    if (scrollingProjects) window.scrollTo({ top: projectTop + position, behavior });
    else projectViewport.scrollTo({ left: position, behavior });
  }
  projectButtons.forEach(button => button.addEventListener('click', () => goToProject(Number(button.dataset.projectJump))));
  projectViewport.addEventListener('scroll', () => { if (!scrollingProjects) setProjectProgress(projectViewport.scrollLeft); }, { passive: true });
  projectViewport.addEventListener('keydown', event => {
    if (event.target !== projectViewport || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault(); goToProject(clamp(activeProject + (event.key === 'ArrowRight' ? 1 : -1), 0, projectCards.length - 1));
  });
  projectViewport.addEventListener('focusin', event => {
    if (!scrollingProjects || event.target === projectViewport) return;
    const focused = event.target.getBoundingClientRect();
    if (focused.left < 0 || focused.right > innerWidth) {
      const position = clamp(window.scrollY - projectTop, 0, projectDistance);
      window.scrollTo({ top: projectTop + clamp(position + focused.left - innerWidth * .3, 0, projectDistance), behavior: 'instant' });
    }
  });
  window.addEventListener('scroll', queueProjects, { passive: true });
  window.addEventListener('resize', measureProjects, { passive: true });
  window.addEventListener('load', measureProjects);
  reducedMotion.addEventListener('change', measureProjects);
  desktop.addEventListener('change', measureProjects);
  measureProjects();

  // Trail notes use genuine measurements when supplied; missing metrics remain blank.
  let trailFilter = 'All';
  function renderTrails() {
    const filtered = byDate(data.trails).filter(item => trailFilter === 'All' || item.type === trailFilter);
    $('#trail-list').innerHTML = filtered.length ? filtered.map((item, index) => `<article class="trail-card"><div class="trail-top"><span class="trail-type">${escape(item.type)}</span>${sampleBadge(item)}</div><div class="trail-number" aria-hidden="true">${item.type === 'Hiking' ? 'ON FOOT' : '2 WHEELS'}</div><h3>${escape(item.name)}</h3><p class="trail-location">${escape(item.location)}${dateText(item.date) ? ' · ' + escape(dateText(item.date)) : ''}</p><p class="trail-summary">${escape(item.summary)}</p><div class="trail-metrics">${routeMetrics(item).replaceAll('<div>', '<div class="trail-metric">')}</div><a class="text-button" href="#trail-${escape(item.id)}">Read the trail notes <span aria-hidden="true">↗</span></a></article>`).join('') : '<p class="empty-state">No routes in this category yet.</p>';
    $('#trail-status').textContent = sampleStatus(filtered, 'route');
  }
  $$('[data-trail-filter]').forEach(button => button.addEventListener('click', () => {
    trailFilter = button.dataset.trailFilter;
    $$('[data-trail-filter]').forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
    renderTrails();
  }));
  renderTrails();

  const publications = [...data.publications].sort((a, b) => String(b.year || '').localeCompare(String(a.year || '')));
  $('#publication-count').textContent = publications.length ? `${String(publications.length).padStart(2, '0')} SELECTED` : '';
  $('#publication-list').innerHTML = publications.length ? publications.map(item => `<article class="publication"><span class="publication-year">${escape(item.year)}</span><div><h4>${escape(item.title)}</h4><p>${escape(item.authors)}${item.venue ? ' · ' + escape(item.venue) : ''}</p><span class="publication-type">${escape(item.type)}</span>${item.finding ? `<p class="publication-finding">${escape(item.finding)}</p>` : ''}</div>${safeUrl(item.url) ? `<a href="${escape(safeUrl(item.url))}" target="_blank" rel="noopener noreferrer" aria-label="Open ${escape(item.title)}">↗</a>` : ''}</article>`).join('') : '<p class="publications-empty">Selected papers, preprints, software, and datasets will appear here, with links to the original work.</p>';

  // Accessible menu, visible section indicators, and Escape to dismiss.
  const header = $('.chapter-header');
  const menu = $('.chapter-nav');
  const menuToggle = $('.menu-toggle');
  function setMenu(open, focus = false) {
    header.classList.toggle('is-open', open); menu.inert = !open;
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (focus) menuToggle.focus();
  }
  menuToggle.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
  $$('.chapter-nav a').forEach(link => link.addEventListener('click', () => setMenu(false, true)));
  document.addEventListener('pointerdown', event => { if (!header.contains(event.target)) setMenu(false); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') setMenu(false, true); });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) $$('.chapter-nav a').forEach(link => link.classList.toggle('is-current', link.hash === '#' + entry.target.id));
    }), { rootMargin: '-15% 0px -50% 0px', threshold: 0 });
    ['blogs', 'updates', 'projects', 'trails', 'academic'].forEach(id => observer.observe(document.getElementById(id)));
  }

  // Posts, projects, and trails have linkable fragments and a native modal reader.
  const reader = $('.reader-dialog');
  const records = new Map();
  data.blogs.forEach(item => records.set('blog-' + item.id, { type: 'blog', item }));
  data.projects.forEach(item => records.set('project-' + item.id, { type: 'project', item }));
  data.trails.forEach(item => records.set('trail-' + item.id, { type: 'trail', item }));
  let returnFocus = null;
  let returnHash = '';
  let navigationClose = false;
  function fragment() { try { return decodeURIComponent(location.hash.slice(1)); } catch { return ''; } }
  document.addEventListener('click', event => {
    const link = event.target.closest('a');
    if (!link || !records.has(link.hash.slice(1))) return;
    returnFocus = link;
    returnHash = '#' + (link.closest('section')?.id || 'blogs');
    // Reopen an entry even when its fragment is already in the address bar.
    if (link.hash === location.hash) openReader();
  });
  function openReader() {
    const record = records.get(fragment());
    if (!record) { if (reader.open) { navigationClose = true; reader.close(); } return; }
    const { type, item } = record;
    if (!returnHash) returnHash = '#' + ({ blog: 'blogs', project: 'projects', trail: 'trails' })[type];
    $('#reader-title').textContent = item.title || item.name;
    $('#reader-kicker').textContent = ({ blog: 'FIELD NOTES', project: 'RESEARCH PROJECT', trail: 'OUT OF OFFICE' })[type];
    $('#reader-sample').textContent = item.sample ? 'Sample entry — replace with your own content.' : '';
    if (type === 'blog') {
      $('#reader-meta').textContent = [item.category, dateText(item.date), `${readMinutes(item)} min read`].filter(Boolean).join(' / ');
      $('#reader-body').innerHTML = paragraphsHtml(item.paragraphs) + `<div class="reader-links">${linksHtml(item.links)}</div>`;
    } else if (type === 'project') {
      $('#reader-meta').textContent = [item.label, item.status, item.year].filter(Boolean).join(' / ');
      $('#reader-body').innerHTML = [['The question', item.question], ['The approach', item.approach], ['My contribution', item.contribution], ['Outcome & next steps', item.outcome]].filter(([, text]) => text).map(([heading, text]) => `<h3>${heading}</h3><p>${escape(text)}</p>`).join('') + `<div class="reader-links">${linksHtml(item.links)}</div>`;
    } else {
      $('#reader-meta').textContent = [item.type, item.location, dateText(item.date)].filter(Boolean).join(' / ');
      $('#reader-body').innerHTML = `<div class="reader-summary">${routeMetrics(item)}</div>` + paragraphsHtml(item.notes) + (item.difficulty ? `<p>Difficulty: ${escape(item.difficulty)}</p>` : '') + `<div class="reader-links">${linkHtml('View route', item.mapUrl)}${linkHtml('GPX file', item.gpxUrl)}</div>`;
    }
    if (!reader.open) { reader.showModal(); document.body.classList.add('reader-open'); }
    reader.scrollTop = 0;
    $('.reader-close').focus();
  }
  $$('.reader-close, .reader-done').forEach(button => button.addEventListener('click', () => reader.close()));
  reader.addEventListener('click', event => {
    if (event.target !== reader) return;
    const box = reader.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) reader.close();
  });
  reader.addEventListener('close', () => {
    document.body.classList.remove('reader-open');
    if (!navigationClose && records.has(fragment())) {
      try { history.replaceState(null, '', location.pathname + location.search + returnHash); }
      catch { location.hash = returnHash || '#blogs'; }
    }
    navigationClose = false;
    if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
    returnFocus = null; returnHash = '';
  });
  window.addEventListener('hashchange', openReader);
  openReader();
})();
