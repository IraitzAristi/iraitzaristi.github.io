/* ================================================================
     PORTFOLIO OFENSIVO
     Datos en portfolio.json:
       · profile   -> portada / segundo CV
       · machines  -> catálogo con nombre, plataforma, dificultad, SO
       · sections  -> otras cosas (proyectos, notas...) como docs .md
     Rutas por hash:
       #/            -> portada
       #/machines    -> catálogo filtrable
       #<archivo.md> -> writeup o doc renderizado
     ================================================================ */

    const nav = document.getElementById('nav');
    const content = document.getElementById('content');
    const tagline = document.getElementById('tagline');
    const brandHandle = document.getElementById('brandHandle');
    const sidebar = document.getElementById('sidebar');
    const backdrop = document.getElementById('backdrop');

    const langSwitch = document.getElementById('langSwitch');

    let data = null;
    const byFile = new Map();          // ruta -> { entry, kind, section? }

    // filtros activos del catálogo
    const filters = { platform: null, difficulty: null };

    /* ================================================================
       IDIOMA (i18n) — EU / ES / EN
       · t(clave)   -> texto de interfaz en el idioma activo
       · tr(valor)  -> resuelve un campo de datos que puede ser un string
                       (igual en todos los idiomas) o un objeto {eu,es,en}
       · trArr(v)   -> igual pero para arrays ({eu:[...],es:[...],en:[...]})
       · resolveDoc -> elige el .md del idioma activo (via file_i18n)
       Para añadir un idioma nuevo: agrega su bloque a I18N, su botón en
       el HTML del selector, y su versión a los campos {eu,es,en} del JSON.
       ================================================================ */
    const LANGS = ['eu', 'es', 'en'];
    let DEFAULT_LANG = 'en';   // idioma base/canónico (se ajusta desde el JSON)
    let lang = 'en';

    const I18N = {
      eu: {
        profile: 'profila', machines: 'makinak', machinesTitle: 'Makinak',
        projects: 'Proiektuak', certifications: 'Ziurtagiriak', catalog: 'katalogoa',
        research: 'Segurtasun ikerketa', findings: 'Aurkikuntzak',
        platform: 'Plataforma', difficulty: 'Zailtasuna', os: 'SE', date: 'Data',
        machineCol: 'Makina', clean: '✕ Iragazkiak garbitu',
        byDifficulty: 'Makinak zailtasunaren arabera:',
        diff: { easy:'Erraza', medium:'Ertaina', hard:'Zaila', insane:'Zoroa' },
        empty: 'Ez dago makinarik iragazki honetarako.',
        initializing: 'Hasieratzen…', menu: '☰ menua',
        reading: f => `${f} irakurtzen…`,
        loadErr: f => `Ezin izan da «${f}» kargatu`,
        jsonErr: 'Ezin izan da portfolio.json kargatu',
        servedNote: 'fetch()-ek karpeta zerbitzatzean bakarrik funtzionatzen du (GitHub Pages edo tokiko zerbitzaria).',
        notTranslated: dl => `Eduki hau ez dago oraindik itzulita, ${dl} ikusten da.`
      },
      es: {
        profile: 'perfil', machines: 'máquinas', machinesTitle: 'Máquinas',
        projects: 'Proyectos', certifications: 'Certificaciones', catalog: 'catálogo',
        research: 'Investigación de seguridad', findings: 'Hallazgos',
        platform: 'Plataforma', difficulty: 'Dificultad', os: 'SO', date: 'Fecha',
        machineCol: 'Máquina', clean: '✕ Limpiar filtros',
        byDifficulty: 'Máquinas por dificultad:',
        diff: { easy:'Fácil', medium:'Media', hard:'Difícil', insane:'Insana' },
        empty: 'Sin máquinas para este filtro.',
        initializing: 'Inicializando…', menu: '☰ menu',
        reading: f => `Leyendo ${f}…`,
        loadErr: f => `No pude cargar «${f}»`,
        jsonErr: 'No pude cargar portfolio.json',
        servedNote: 'fetch() solo funciona sirviendo la carpeta (GitHub Pages o servidor local).',
        notTranslated: dl => `Este contenido aún no está traducido, se ve en ${dl}.`
      },
      en: {
        profile: 'profile', machines: 'machines', machinesTitle: 'Machines',
        projects: 'Projects', certifications: 'Certifications', catalog: 'catalog',
        research: 'Security research', findings: 'Findings',
        platform: 'Platform', difficulty: 'Difficulty', os: 'OS', date: 'Date',
        machineCol: 'Machine', clean: '✕ Clear filters',
        byDifficulty: 'Machines by difficulty:',
        diff: { easy:'Easy', medium:'Medium', hard:'Hard', insane:'Insane' },
        empty: 'No machines for this filter.',
        initializing: 'Initializing…', menu: '☰ menu',
        reading: f => `Loading ${f}…`,
        loadErr: f => `Couldn't load "${f}"`,
        jsonErr: "Couldn't load portfolio.json",
        servedNote: 'fetch() only works when serving the folder (GitHub Pages or a local server).',
        notTranslated: dl => `This content isn't translated yet, showing ${dl}.`
      }
    };

    // nombre de cada idioma dentro de cada idioma de interfaz (para el aviso)
    const LANG_NAME = {
      eu: { eu: 'euskaraz', es: 'gaztelaniaz', en: 'ingelesez' },
      es: { eu: 'euskera', es: 'castellano', en: 'inglés' },
      en: { eu: 'Basque', es: 'Spanish', en: 'English' }
    };

    function t(key, ...args) {
      const dict = I18N[lang] || I18N[DEFAULT_LANG];
      let v = (key in dict) ? dict[key] : I18N[DEFAULT_LANG][key];
      if (v == null) v = key;
      return typeof v === 'function' ? v(...args) : v;
    }
    function diffLabel(val) {
      const k = (val || '').toLowerCase();
      const map = (I18N[lang] && I18N[lang].diff) || I18N[DEFAULT_LANG].diff || {};
      return map[k] || val || '';
    }
    function tr(val) {
      if (val == null) return '';
      if (typeof val === 'string') return val;
      if (Array.isArray(val)) return val;
      return val[lang] || val[DEFAULT_LANG] || val[LANGS.find(l => val[l])] || '';
    }
    function trArr(val) {
      if (Array.isArray(val)) return val;
      if (val && typeof val === 'object') return val[lang] || val[DEFAULT_LANG] || [];
      return [];
    }
    // resuelve el .md a cargar según el idioma; si no hay traducción, cae al base
    function resolveDoc(entry) {
      const map = entry.file_i18n || {};
      if (map[lang]) return { path: map[lang], fallback: null };
      return { path: entry.file, fallback: (lang !== DEFAULT_LANG) ? DEFAULT_LANG : null };
    }

    function initLang() {
      if (data.defaultLang && LANGS.includes(data.defaultLang)) DEFAULT_LANG = data.defaultLang;
      let l = null;
      try { l = localStorage.getItem('lang'); } catch (e) {}
      if (!LANGS.includes(l)) {
        const nav0 = (navigator.language || '').slice(0, 2).toLowerCase();
        l = LANGS.includes(nav0) ? nav0 : DEFAULT_LANG;
      }
      lang = LANGS.includes(l) ? l : DEFAULT_LANG;
    }
    function setLang(l) {
      if (!LANGS.includes(l) || l === lang) return;
      lang = l;
      try { localStorage.setItem('lang', l); } catch (e) {}
      document.documentElement.lang = l;
      updateChrome();
      buildNav();
      route();
    }
    function updateChrome() {
      brandHandle.textContent = data.profile.handle || 'portfolio';
      tagline.textContent = tr(data.profile.role) || '';
      document.getElementById('menuBtn').textContent = t('menu');
      langSwitch.querySelectorAll('.lang-btn').forEach(b =>
        b.classList.toggle('active', b.dataset.lang === lang));
    }

    document.getElementById('menuBtn').onclick = () => toggleMenu(true);
    backdrop.onclick = () => toggleMenu(false);
    function toggleMenu(open) { sidebar.classList.toggle('open', open); backdrop.classList.toggle('show', open); }

    init();

    async function init() {
      try {
        const res = await fetch('portfolio.json', { cache: 'no-cache' });
        if (!res.ok) throw new Error('portfolio.json no encontrado (HTTP ' + res.status + ')');
        data = await res.json();
      } catch (err) {
        content.innerHTML = '<p class="status error">' + esc(t('jsonErr')) + ' — ' + esc(err.message)
          + '</p><p class="status">' + esc(t('servedNote')) + '</p>';
        tagline.textContent = 'error'; return;
      }

      initLang();
      document.documentElement.lang = lang;

      // indexar máquinas y docs para búsquedas O(1)
      (data.machines || []).forEach(m => byFile.set(m.file, { entry: m, kind: 'machine' }));
      (data.sections || []).forEach(s => (s.docs || []).forEach(d => byFile.set(d.file, { entry: d, kind: 'doc', section: s })));

      // cablear el selector de idioma
      langSwitch.querySelectorAll('.lang-btn').forEach(b =>
        b.addEventListener('click', () => setLang(b.dataset.lang)));

      updateChrome();
      buildNav();
      route();
    }

    function buildNav() {
      // enlaces principales
      nav.innerHTML =
        '<a class="nav-link" href="#/" data-route="/"><span class="glyph">$</span> ' + esc(t('profile')) + '</a>' +
        '<a class="nav-link" href="#/machines" data-route="/machines"><span class="glyph">#</span> ' + esc(t('machines')) + ' <span style="margin-left:auto;font-size:11px;color:var(--muted)">' + (data.machines || []).length + '</span></a>';

      // secciones dinámicas (proyectos, notas...)
      (data.sections || []).forEach(section => {
        const h = document.createElement('div');
        h.className = 'section-title';
        h.textContent = tr(section.name);
        nav.appendChild(h);
        (section.docs || []).forEach(d => {
          const a = document.createElement('a');
          a.className = 'entry'; a.href = '#' + d.file; a.dataset.file = d.file;
          a.innerHTML = esc(tr(d.title)) + '<span class="entry-meta">' + esc(d.date || '') + '</span>';
          a.addEventListener('click', () => toggleMenu(false));
          nav.appendChild(a);
        });
      });

      nav.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => toggleMenu(false)));
    }

    window.addEventListener('hashchange', route);

    function route() {
      const hash = decodeURIComponent(location.hash.slice(1));
      // marcar activo
      nav.querySelectorAll('.nav-link').forEach(l => l.classList.toggle('active', l.dataset.route === hash));
      nav.querySelectorAll('.entry').forEach(e => e.classList.toggle('active', e.dataset.file === hash));

      if (hash === '/machines') return renderMachines();
      if (hash && byFile.has(hash)) return renderDoc(hash);
      return renderHome();
    }

    /* ---------- PORTADA ---------- */
    function renderHome() {
      const p = data.profile;
      const machines = data.machines || [];
      const sections = data.sections || [];
      const certs = p.certs || [];

      // recuentos derivados de los datos (crecen solos al añadir cosas)
      const count = d => machines.filter(m => (m.difficulty || '').toLowerCase() === d).length;
      const projSection = sections.find(s => /proyec|proiek|project/i.test(tr(s.name)));
      const projectsCount = projSection
        ? (projSection.docs || []).length
        : sections.reduce((n, s) => n + (s.docs || []).length, 0);

      const links = (p.links || []).map(l => `<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)} ↗</a>`).join('');
      const skills = trArr(p.skills).map(s => `<span class="skill">${esc(s)}</span>`).join('');
      const certChips = certs.map(c =>
        `<span class="cert">${esc(c.name)}${c.issuer ? ` <span class="issuer">· ${esc(c.issuer)}</span>` : ''}</span>`).join('');
      const findings = p.findings || [];
      const findItems = findings.map(f =>
        `<a class="finding" href="${esc(f.url || '#')}" target="_blank" rel="noopener"><span class="finding-title">${esc(tr(f.title))}</span><span class="finding-meta">${esc(tr(f.meta || ''))}</span></a>`).join('');
      const findSection = findItems ? `<div class="findings"><span class="clabel">${esc(t('research'))}</span><div class="finding-list">${findItems}</div></div>` : '';

      // barra de estadísticas principal: se define aquí y se pinta en bucle,
      // así añadir una métrica nueva en el futuro es agregar una línea.
      const stats = [
        { n: machines.length, l: t('machines') },
        { n: projectsCount,   l: t('projects') },
        { n: certs.length,    l: t('certifications') }
      ];
      if (findings.length) stats.push({ n: findings.length, l: t('findings') });
      const statCells = stats.map(s => `<div class="cell"><div class="n">${s.n}</div><div class="l">${esc(s.l)}</div></div>`).join('');

      // desglose por dificultad (solo muestra los niveles que existen)
      const diffOrder = ['easy','medium','hard','insane'];
      const diffBreak = diffOrder.filter(k => count(k) > 0)
        .map(k => `<span class="d ${k}"><b>${count(k)}</b> ${esc(diffLabel(k))}</span>`).join('');

      // Featured / novedades: muestra items con featured:true; si no hay ninguno,
      // cae automáticamente a los 3 más recientes por fecha. Crece solo con los datos.
      const allItems = [
        ...machines.map(m => ({ kind:'machine', title: tr(m.title || m.name || ''), file: m.file, date: m.date || '', featured: !!m.featured, meta: [m.platform, m.difficulty].filter(Boolean).join(' · ') })),
        ...sections.flatMap(s => (s.docs || []).map(dd => ({ kind:'doc', title: tr(dd.title), file: dd.file, date: dd.date || '', featured: !!dd.featured, meta: tr(s.name), kindLabel: dd.kindLabel || null }))),
        ...findings.map(f => ({ kind:'finding', title: tr(f.title), file: f.url, external: true, date: f.date || '', featured: !!f.featured, meta: tr(f.meta || '') }))
      ];
      const byDate = (a,b) => (a.date < b.date ? 1 : -1);
      let feat = allItems.filter(i => i.featured).sort(byDate);
      feat = feat.concat(allItems.filter(i => i.date && !i.featured).sort(byDate)).slice(0, 3);
      const kindWord = { machine: { es:'writeup', eu:'writeup', en:'writeup' }, doc: { es:'proyecto', eu:'proiektua', en:'project' }, finding: { es:'hallazgo', eu:'aurkikuntza', en:'finding' } };
      const hrefOf = i => i.external ? `href="${esc(i.file)}" target="_blank" rel="noopener"` : `href="#${esc(i.file)}"`;
      const featLabel = { es:'// destacado', eu:'// nabarmendua', en:'// featured' }[lang] || '// featured';
      const featCards = feat.map(i => `
        <a class="feat-card" ${hrefOf(i)}>
          <span class="feat-kind">${esc(i.kindLabel ? tr(i.kindLabel) : (kindWord[i.kind][lang] || kindWord[i.kind].en))}</span>
          <span class="feat-title">${esc(i.title)}</span>
          ${i.meta ? `<span class="feat-meta">${esc(i.meta)}</span>` : ''}
        </a>`).join('');
      const featSection = feat.length
        ? `<section class="featured"><div class="feat-head">${esc(featLabel)}</div><div class="feat-grid">${featCards}</div></section>`
        : '';

      // Novedades / latest: log cronológico de los últimos items añadidos (por fecha)
      const latest = allItems.filter(i => i.date).sort((a,b) => (a.date < b.date ? 1 : -1)).slice(0, 6);
      const latestLabel = { es:'// novedades', eu:'// azkenak', en:'// latest' }[lang] || '// latest';
      const latestRows = latest.map(i => `
        <a class="latest-row" ${hrefOf(i)}>
          <span class="latest-date">${esc(i.date)}</span>
          <span class="latest-title">${esc(i.title)}</span>
          <span class="latest-kind">${esc(i.kindLabel ? tr(i.kindLabel) : (kindWord[i.kind][lang] || kindWord[i.kind].en))}</span>
        </a>`).join('');
      const latestSection = latest.length
        ? `<section class="latest"><div class="feat-head">${esc(latestLabel)}</div><div class="latest-list">${latestRows}</div></section>`
        : '';

      const heroHtml = `
        <section class="hero">
          <p class="role">${esc(tr(p.role))}</p>
          <h1>${esc(p.name || p.handle || '')}</h1>
          <p class="handle-line"><span class="at">@</span>${esc(p.handle || '')}${p.location ? `<span class="dot">·</span>${esc(p.location)}` : ''}</p>
          <p class="pitch">${esc(tr(p.pitch))}</p>
          <div class="links">${links}</div>
          ${certChips ? `<div class="certs"><span class="clabel">${esc(t('certifications'))}</span>${certChips}</div>` : ''}
          ${findSection}
          <div class="skills">${skills}</div>
        </section>`;
      const statsHtml = `
        <section class="stats-block">
          <div class="statbar">${statCells}</div>
          ${diffBreak ? `<div class="diffbar"><span style="color:var(--muted);font-size:11px;letter-spacing:0.1em;text-transform:uppercase;align-self:center">${esc(t('byDifficulty'))}</span>${diffBreak}</div>` : ''}
        </section>`;
      const aside = featSection + latestSection;
      content.className = 'content is-home';
      content.innerHTML = aside
        ? `<div class="profile-grid"><div class="profile-main">${heroHtml}</div><aside class="profile-aside">${aside}</aside></div>${statsHtml}`
        : `${heroHtml}${statsHtml}`;
      document.title = (p.name || p.handle || 'portfolio');
      window.scrollTo(0, 0);
    }

    /* ---------- CATÁLOGO DE MÁQUINAS ---------- */
    function renderMachines() {
      const machines = data.machines || [];
      const platforms = [...new Set(machines.map(m => m.platform).filter(Boolean))];
      const diffs = ['Easy', 'Medium', 'Hard', 'Insane'].filter(d => machines.some(m => (m.difficulty || '') === d));

      const chip = (label, group, val) => {
        // los chips de dificultad llevan un punto del color correspondiente
        const diffCls = group === 'difficulty' ? ' chip-diff ' + val.toLowerCase() : '';
        return `<button class="chip${diffCls} ${filters[group] === val ? 'active' : ''}" data-group="${group}" data-val="${esc(val)}">${esc(label)}</button>`;
      };

      const platChips = platforms.map(pl => chip(pl, 'platform', pl)).join('');
      const diffChips = diffs.map(d => chip(diffLabel(d), 'difficulty', d)).join('');

      const rows = machines.filter(m =>
        (!filters.platform || m.platform === filters.platform) &&
        (!filters.difficulty || m.difficulty === filters.difficulty)
      );

      const body = rows.length ? rows.map(m => {
        const dcls = (m.difficulty || '').toLowerCase();
        const tags = (m.tags || []).map(tag => `<span class="minitag">${esc(tr(tag))}</span>`).join('');
        return `
          <tr class="row" data-file="${esc(m.file)}">
            <td class="td-name" data-label="${esc(t('machineCol'))}">
              <span class="m-name">${esc(m.title)}</span>
              <div class="m-tags">${tags}</div>
            </td>
            <td data-label="${esc(t('platform'))}"><span class="badge plat">${esc(m.platform || '—')}</span></td>
            <td data-label="${esc(t('difficulty'))}"><span class="diff ${dcls}">${esc(m.difficulty ? diffLabel(m.difficulty) : '—')}</span></td>
            <td data-label="${esc(t('os'))}"><span class="badge os">${esc(m.os || '—')}</span></td>
            <td data-label="${esc(t('date'))}" style="font-family:var(--mono);color:var(--muted);font-size:12px">${esc(m.date || '')}</td>
          </tr>`;
      }).join('') : '';

      content.className = 'content is-list';
      content.innerHTML = `
        <div class="view-head">
          <p class="kicker">${esc(t('catalog'))}</p>
          <h2>${esc(t('machinesTitle'))}</h2>
        </div>
        <div class="filters">
          <div class="filter-row">
            <span class="filter-label">${esc(t('platform'))}</span>
            <div class="chip-set">${platChips}</div>
          </div>
          <div class="filter-row">
            <span class="filter-label">${esc(t('difficulty'))}</span>
            <div class="chip-set">${diffChips}</div>
          </div>
          ${(filters.platform || filters.difficulty)
            ? '<button class="chip chip-reset" data-group="reset" data-val="">' + esc(t('clean')) + '</button>'
            : ''}
        </div>
        <table class="machines-table">
          <thead><tr><th>${esc(t('machineCol'))}</th><th>${esc(t('platform'))}</th><th>${esc(t('difficulty'))}</th><th>${esc(t('os'))}</th><th>${esc(t('date'))}</th></tr></thead>
          <tbody>${body}</tbody>
        </table>
        ${rows.length ? '' : '<p class="empty">' + esc(t('empty')) + '</p>'}`;

      // eventos de filtros
      content.querySelectorAll('.chip').forEach(c => c.addEventListener('click', () => {
        const g = c.dataset.group, v = c.dataset.val;
        if (g === 'reset') { filters.platform = null; filters.difficulty = null; }
        else { filters[g] = filters[g] === v ? null : v; }
        renderMachines();
      }));
      // click en fila -> writeup
      content.querySelectorAll('tr.row').forEach(r =>
        r.addEventListener('click', () => { location.hash = '#' + r.dataset.file; }));

      document.title = t('machinesTitle') + ' · @' + data.profile.handle;
      window.scrollTo(0, 0);
    }

    /* ---------- DOC / WRITEUP ---------- */
    async function renderDoc(file) {
      const { entry, kind, section } = byFile.get(file);
      const { path, fallback } = resolveDoc(entry);
      content.className = 'content is-doc';
      content.innerHTML = '<p class="status">' + esc(t('reading', path)) + '</p>';
      try {
        const res = await fetch(path, { cache: 'no-cache' });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const md = await res.text();
        const html = DOMPurify.sanitize(marked.parse(md));

        // aviso si se muestra un idioma distinto al activo
        const banner = fallback
          ? `<div class="doc-banner">${esc(t('notTranslated', LANG_NAME[lang][fallback]))}</div>`
          : '';

        let crumb, badges = '';
        if (kind === 'machine') {
          crumb = esc(t('machines')) + ' <span class="sep">/</span> ' + esc(entry.platform || '');
          const dcls = (entry.difficulty || '').toLowerCase();
          badges = `<div class="doc-badges">
            <span class="badge plat">${esc(entry.platform || '')}</span>
            <span class="diff ${dcls}">${esc(entry.difficulty ? diffLabel(entry.difficulty) : '')}</span>
            <span class="badge os">${esc(entry.os || '')}</span>
            ${(entry.tags || []).map(tag => `<span class="minitag">${esc(tr(tag))}</span>`).join('')}
          </div>`;
        } else {
          crumb = esc(tr(section.name));
          badges = (entry.tags || []).length ? `<div class="doc-badges">${(entry.tags || []).map(tag => `<span class="minitag">${esc(tr(tag))}</span>`).join('')}</div>` : '';
        }

        content.innerHTML = `
          <div class="doc-header">
            <div class="crumb">${crumb}</div>
            <h1>${esc(tr(entry.title))}</h1>
            ${badges}
          </div>
          ${banner}
          <article class="markdown">${html}</article>`;

        content.querySelectorAll('pre code').forEach(b => hljs.highlightElement(b));
        document.title = tr(entry.title) + ' · @' + data.profile.handle;
        window.scrollTo(0, 0);
      } catch (err) {
        content.innerHTML = '<p class="status error">' + esc(t('loadErr', path)) + ' — ' + esc(err.message) + '</p>';
      }
    }

    function esc(s) { return String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])); }
