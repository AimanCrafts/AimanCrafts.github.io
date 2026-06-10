// Nav scroll
      const nav = document.getElementById("nav");
      window.addEventListener("scroll", () => {
        nav.classList.toggle("scrolled", window.scrollY > 20);
      });

      // Mobile menu
      const toggle = document.getElementById("menuToggle");
      const menu = document.getElementById("mobileMenu");
      toggle.addEventListener("click", () => {
        const open = menu.classList.toggle("open");
        toggle.setAttribute("aria-expanded", open);
        menu.setAttribute("aria-hidden", !open);
      });
      menu.querySelectorAll("a").forEach((a) => {
        a.addEventListener("click", () => {
          menu.classList.remove("open");
          toggle.setAttribute("aria-expanded", false);
          menu.setAttribute("aria-hidden", true);
        });
      });

      // Reveal on scroll
      const revealEls = document.querySelectorAll(".reveal");
      const observer = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("visible");
              observer.unobserve(e.target);
            }
          }),
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
      );
      revealEls.forEach((el) => observer.observe(el));

      // Mouse gradient on project cards
      document.querySelectorAll(".project-card").forEach((card) => {
        card.addEventListener("mousemove", (e) => {
          const r = card.getBoundingClientRect();
          card.style.setProperty(
            "--mx",
            ((e.clientX - r.left) / r.width) * 100 + "%",
          );
          card.style.setProperty(
            "--my",
            ((e.clientY - r.top) / r.height) * 100 + "%",
          );
        });
      });

      // ── THEME TOGGLE ──────────────────────────────────────
      (function initTheme() {
        const html = document.documentElement;
        const btn = document.getElementById("themeToggle");
        if (!btn) return;
        const saved = localStorage.getItem("portfolio-theme") || "dark";
        html.setAttribute("data-theme", saved);
        btn.setAttribute("aria-pressed", saved === "light");
        btn.setAttribute("aria-label", saved === "light" ? "Switch to dark mode" : "Switch to light mode");
        btn.addEventListener("click", () => {
          const next = html.getAttribute("data-theme") === "light" ? "dark" : "light";
          html.setAttribute("data-theme", next);
          localStorage.setItem("portfolio-theme", next);
          btn.setAttribute("aria-pressed", next === "light");
          btn.setAttribute("aria-label", next === "light" ? "Switch to dark mode" : "Switch to light mode");
        });
      })();

      // ── CV PDF Generator ─────────────────────────────────
      function generateCV() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ unit: "mm", format: "a4" });
        const W = 210, H = 297;
        const ml = 20, mr = 20, mt = 22;
        const contentW = W - ml - mr;
        let y = mt;

        const C = {
          bg:      [7,  11, 18],
          surface: [17, 24, 39],
          accent:  [100,255,218],
          white:   [226,232,240],
          muted:   [136,146,164],
          dim:     [75, 86, 105],
          border:  [30, 42, 58],
          violet:  [167,139,250],
        };

        // Background
        doc.setFillColor(...C.bg);
        doc.rect(0, 0, W, H, "F");

        // Subtle grid lines
        doc.setDrawColor(...C.border);
        doc.setLineWidth(0.1);
        for (let gx = 0; gx < W; gx += 20) { doc.line(gx, 0, gx, H); }
        for (let gy = 0; gy < H; gy += 20) { doc.line(0, gy, W, gy); }

        // Header accent strip
        doc.setFillColor(...C.surface);
        doc.rect(0, 0, W, 52, "F");
        doc.setDrawColor(...C.accent);
        doc.setLineWidth(0.4);
        doc.line(0, 52, W, 52);

        // Name
        doc.setFont("helvetica", "bold");
        doc.setFontSize(26);
        doc.setTextColor(...C.white);
        doc.text("Abdur Rahman Aiman", ml, y + 10);

        // Tagline
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9.5);
        doc.setTextColor(...C.accent);
        doc.text("Full-Stack Developer  ·  CS Student @ AUST  ·  ML Enthusiast", ml, y + 18);

        // Contact line
        doc.setFontSize(7.8);
        doc.setTextColor(...C.muted);
        const contacts = [
          "abdurrahmanaiman2020@gmail.com",
          "+880 1971 880055",
          "github.com/AimanCrafts",
          "linkedin.com/in/abdurrahmanaiman",
          "Dhaka, Bangladesh"
        ];
        doc.text(contacts.join("   ·   "), ml, y + 26);

        // Available badge
        doc.setFillColor(...C.accent);
        doc.roundedRect(ml, y + 30, 38, 6, 1, 1, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(6.5);
        doc.setTextColor(...C.bg);
        doc.text("● AVAILABLE FOR INTERNSHIPS", ml + 2, y + 34.5);

        y = 60;

        // Helper: section heading
        function sectionHeading(title) {
          if (y > H - 30) { doc.addPage(); doc.setFillColor(...C.bg); doc.rect(0,0,W,H,"F"); y = 18; }
          doc.setDrawColor(...C.border);
          doc.setLineWidth(0.3);
          doc.line(ml, y + 2, W - mr, y + 2);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(7.5);
          doc.setTextColor(...C.accent);
          doc.text(title.toUpperCase(), ml, y);
          doc.setDrawColor(...C.accent);
          doc.setLineWidth(0.5);
          doc.line(ml, y + 2.5, ml + title.length * 1.6, y + 2.5);
          y += 8;
        }

        // Helper: tag pills
        function tagRow(tags) {
          let tx = ml;
          tags.forEach(tag => {
            const tw = doc.getTextWidth(tag) + 6;
            if (tx + tw > W - mr) { tx = ml; y += 5.5; }
            if (y > H - 16) { doc.addPage(); doc.setFillColor(...C.bg); doc.rect(0,0,W,H,"F"); y = 18; tx = ml; }
            doc.setFillColor(...C.surface);
            doc.setDrawColor(...C.border);
            doc.setLineWidth(0.2);
            doc.roundedRect(tx, y - 3.5, tw, 5, 1, 1, "FD");
            doc.setFontSize(6);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(...C.muted);
            doc.text(tag, tx + 3, y);
            tx += tw + 3;
          });
          y += 7;
        }

        // ─── EDUCATION ──────────────────────────────────────
        sectionHeading("Education");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(...C.white);
        doc.text("B.Sc. in Computer Science & Engineering", ml, y);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(...C.accent);
        doc.text("2024 – Present", W - mr - 22, y);
        y += 5;
        doc.setTextColor(...C.muted);
        doc.text("Ahsanullah University of Science & Technology · Dhaka, Bangladesh", ml, y);
        y += 4.5;
        doc.setFontSize(7.5);
        doc.setTextColor(...C.dim);
        doc.text("Year 3 · CGPA: In Progress", ml, y);
        y += 6;
        tagRow(["Algorithms","Data Structures","ML","Computer Networking","Numerical Methods","Assembly","OS","Software Eng."]);
        y += 2;

        // ─── EXPERIENCE ─────────────────────────────────────
        sectionHeading("Experience & Projects");

        // KrishiBondhu
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(...C.white);
        doc.text("Full-Stack Developer — KrishiBondhu", ml, y);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(...C.accent);
        doc.text("2024 – Present", W - mr - 22, y);
        y += 5;
        doc.setTextColor(...C.muted);
        doc.text("Personal / Academic Project · MERN Stack", ml, y);
        y += 5;
        const kbLines = doc.splitTextToSize(
          "Designed and built a full-stack agricultural marketplace for Bangladesh — three role-based portals (farmer, buyer, admin), JWT authentication, Cloudinary image uploads, OpenWeatherMap API integration, seed-scripted MongoDB Atlas, and a fully responsive custom CSS UI.",
          contentW - 4
        );
        doc.setFontSize(7.8);
        doc.setTextColor(...C.dim);
        kbLines.forEach(line => { doc.text(line, ml + 2, y); y += 4.3; });
        y += 2;
        tagRow(["React 19","Vite","Node.js","Express 5","MongoDB Atlas","JWT","Cloudinary","OpenWeatherMap"]);

        // TrekWise
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(...C.white);
        doc.text("Mobile Developer — TrekWise", ml, y);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(...C.accent);
        doc.text("2024", W - mr - 10, y);
        y += 5;
        doc.setTextColor(...C.muted);
        doc.text("Personal Project · Flutter / Firebase", ml, y);
        y += 5;
        const twLines = doc.splitTextToSize(
          "Cross-platform travel planner for navigating fragmented transport in developing regions. Multi-modal route comparison, offline saving, expense tracking, and real-time weather alerts.",
          contentW - 4
        );
        doc.setFontSize(7.8);
        doc.setTextColor(...C.dim);
        twLines.forEach(line => { doc.text(line, ml + 2, y); y += 4.3; });
        y += 2;
        tagRow(["Flutter","Dart","Firebase","OpenStreetMap","Android","iOS"]);

        // Goblin's Curse
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(...C.white);
        doc.text("Game Developer — Goblin's Curse", ml, y);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(...C.accent);
        doc.text("2023", W - mr - 10, y);
        y += 5;
        doc.setTextColor(...C.muted);
        doc.text("Personal Project · C++ / OpenGL", ml, y);
        y += 5;
        const gcLines = doc.splitTextToSize(
          "2D action-adventure game built from scratch in C++ with iGraphics/OpenGL. Two-level campaign, progressive enemy AI, collision detection, power-up system, and custom bitmap rendering.",
          contentW - 4
        );
        doc.setFontSize(7.8);
        doc.setTextColor(...C.dim);
        gcLines.forEach(line => { doc.text(line, ml + 2, y); y += 4.3; });
        y += 2;
        tagRow(["C++","C","OpenGL","iGraphics","Visual Studio","2D Game Dev"]);

        // ─── SKILLS ─────────────────────────────────────────
        sectionHeading("Technical Skills");

        const skillCols = [
          { title: "Languages", skills: ["C / C++ — Proficient","Java — Proficient","JavaScript — Familiar","Python — Familiar","Dart — Familiar","Assembly (EMU8086) — Exposure"] },
          { title: "Frontend & Mobile", skills: ["HTML / CSS — Proficient","React + Vite — Proficient","Flutter — Familiar"] },
          { title: "Backend & Database", skills: ["Node.js / Express — Proficient","MongoDB — Proficient","MySQL — Familiar","Firebase — Familiar"] },
          { title: "Tools & Cloud", skills: ["Git / GitHub — Proficient","AWS — Familiar","VS / VS Code — Familiar","Docker — Exposure"] },
          { title: "Machine Learning", skills: ["Gradient Descent — Proficient","Linear / Logistic Reg. — Proficient","L2 Regularization — Familiar","Cost Functions — Familiar"] },
        ];

        const colW = (contentW - 8) / 3;
        let colX = ml;
        let colY = y;

        skillCols.forEach((col, i) => {
          if (i === 3) { colX = ml; colY = y; }
          doc.setFont("helvetica", "bold");
          doc.setFontSize(7.5);
          doc.setTextColor(...C.accent);
          doc.text(col.title, colX, colY);
          let cy = colY + 5;
          col.skills.forEach(s => {
            const parts = s.split(" — ");
            doc.setFont("helvetica", "normal");
            doc.setFontSize(7.5);
            doc.setTextColor(...C.white);
            doc.text(parts[0], colX + 2, cy);
            if (parts[1]) {
              doc.setFontSize(6.5);
              doc.setTextColor(...C.dim);
              doc.text(parts[1], colX + 2, cy + 3.5);
            }
            cy += 8;
          });
          if (i < 2) colX += colW + 4;
          else if (i === 2) y = colY + (skillCols.slice(0,3).reduce((m,c) => Math.max(m, c.skills.length), 0) * 8) + 12;
          if (i === 4) colX += colW + 4;
        });
        y += 8;

        // ─── Footer ─────────────────────────────────────────
        const totalPages = doc.getNumberOfPages();
        for (let p = 1; p <= totalPages; p++) {
          doc.setPage(p);
          doc.setFillColor(...C.surface);
          doc.rect(0, H - 10, W, 10, "F");
          doc.setDrawColor(...C.border);
          doc.setLineWidth(0.3);
          doc.line(0, H - 10, W, H - 10);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(6.5);
          doc.setTextColor(...C.dim);
          doc.text("Abdur Rahman Aiman · Portfolio: github.com/AimanCrafts", ml, H - 4);
          doc.text(`Page ${p} of ${totalPages}`, W - mr - 15, H - 4);
        }

        doc.save("Abdur_Rahman_Aiman_CV.pdf");
      }

      // Wire up all CV buttons
      ["downloadCVBtn","downloadCVBtn2","downloadCVHero","downloadCVContact"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener("click", generateCV);
      });
      /* ========== ADDITIONAL SCRIPTS FROM PORTFOLIO HTML ========== */

(function() {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  let mx = 0, my = 0, rx = 0, ry = 0;
  
  if (dot && ring) {
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; dot.style.left = mx + 'px'; dot.style.top = my + 'px'; });
    (function ringLoop() {
      rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
      requestAnimationFrame(ringLoop);
    })();
    document.querySelectorAll('a, button, [data-tooltip], .project-card, .skill-item, .contact-card, .cert-card, .stat-card').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  const progressBar = document.getElementById('progress-bar');
  function updateProgress() {
    if (!progressBar) return;
    const s = document.documentElement.scrollTop || document.body.scrollTop;
    const h = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    progressBar.style.width = (s / h * 100) + '%';
  }

  const nav = document.getElementById('nav');
  const navLinks = document.querySelectorAll('.nav__link');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    updateProgress();
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);
    const btt = document.getElementById('back-to-top');
    if (btt) btt.classList.toggle('visible', window.scrollY > 400);
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    navLinks.forEach(l => {
      l.classList.toggle('active', l.dataset.section === current);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  const toggle = document.getElementById('menuToggle');
  const menu = document.getElementById('mobileMenu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
      menu.setAttribute('aria-hidden', !open);
    });
    menu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', false);
        menu.setAttribute('aria-hidden', true);
      });
    });
  }

  const revealEls = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => revealObs.observe(el));

  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX - r.left) / r.width) * 100 + '%');
      card.style.setProperty('--my', ((e.clientY - r.top) / r.height) * 100 + '%');
    });
  });

  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    if (isNaN(target)) return;
    const duration = 1200;
    const start = performance.now();
    function step(now) {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      const val = Math.round(ease * target);
      el.textContent = val + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  const countEls = document.querySelectorAll('[data-count]');
  const countObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { animateCount(e.target); countObs.unobserve(e.target); }
    });
  }, { threshold: 0.5 });
  countEls.forEach(el => countObs.observe(el));

  const typedEl = document.getElementById('typed-text');
  if (typedEl) {
    const phrases = ['End to end.', 'Full stack.', 'Ships fast.', 'Built to last.'];
    let pi = 0, ci = 0, deleting = false;
    const cursor = document.createElement('span');
    cursor.className = 'typed-cursor'; cursor.textContent = '|';
    typedEl.after(cursor);
    typedEl.textContent = '';
    function typeStep() {
      const current = phrases[pi];
      if (!deleting) {
        typedEl.textContent = current.slice(0, ci + 1);
        ci++;
        if (ci === current.length) { deleting = true; setTimeout(typeStep, 2200); return; }
        setTimeout(typeStep, 70 + Math.random() * 30);
      } else {
        typedEl.textContent = current.slice(0, ci - 1);
        ci--;
        if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; setTimeout(typeStep, 400); return; }
        setTimeout(typeStep, 35);
      }
    }
    setTimeout(typeStep, 2000);
  }

  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    backToTop.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }

  if (typeof window.jspdf !== 'undefined') {
    function generateCV() {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({ unit: "mm", format: "a4" });
      const W = 210, H = 297, ml = 20, mr = 20, mt = 22;
      const contentW = W - ml - mr;
      let y = mt;
      const C = {
        bg:[7,11,18], surface:[17,24,39], accent:[100,255,218],
        white:[226,232,240], muted:[136,146,164], dim:[75,86,105],
        border:[30,42,58], violet:[167,139,250],
      };
      doc.setFillColor(...C.bg); doc.rect(0,0,W,H,"F");
      doc.setDrawColor(...C.border); doc.setLineWidth(0.1);
      for (let gx=0;gx<W;gx+=20) doc.line(gx,0,gx,H);
      for (let gy=0;gy<H;gy+=20) doc.line(0,gy,W,gy);
      doc.setFillColor(...C.surface); doc.rect(0,0,W,52,"F");
      doc.setDrawColor(...C.accent); doc.setLineWidth(0.4); doc.line(0,52,W,52);
      doc.setFont("helvetica","bold"); doc.setFontSize(26); doc.setTextColor(...C.white);
      doc.text("Abdur Rahman Aiman",ml,y+10);
      doc.setFont("helvetica","normal"); doc.setFontSize(9.5); doc.setTextColor(...C.accent);
      doc.text("Full-Stack Developer  ·  CSE Student @ AUST  ·  ML Enthusiast",ml,y+18);
      doc.setFontSize(7.8); doc.setTextColor(...C.muted);
      doc.text(["abdurrahmanaiman2020@gmail.com","+880 1971 880055","github.com/AimanCrafts","linkedin.com/in/abdurrahmanaiman","Dhaka, Bangladesh"].join("   ·   "),ml,y+26);
      doc.setFillColor(...C.accent); doc.roundedRect(ml,y+30,38,6,1,1,"F");
      doc.setFont("helvetica","bold"); doc.setFontSize(6.5); doc.setTextColor(...C.bg);
      doc.text("● AVAILABLE FOR INTERNSHIPS",ml+2,y+34.5);
      y=60;
      function sectionHeading(title) {
        if(y>H-30){doc.addPage();doc.setFillColor(...C.bg);doc.rect(0,0,W,H,"F");y=18;}
        doc.setDrawColor(...C.border);doc.setLineWidth(0.3);doc.line(ml,y+2,W-mr,y+2);
        doc.setFont("helvetica","bold");doc.setFontSize(7.5);doc.setTextColor(...C.accent);
        doc.text(title.toUpperCase(),ml,y);
        doc.setDrawColor(...C.accent);doc.setLineWidth(0.5);doc.line(ml,y+2.5,ml+title.length*1.6,y+2.5);
        y+=8;
      }
      function tagRow(tags) {
        let tx=ml;
        tags.forEach(tag=>{
          const tw=doc.getTextWidth(tag)+6;
          if(tx+tw>W-mr){tx=ml;y+=5.5;}
          if(y>H-16){doc.addPage();doc.setFillColor(...C.bg);doc.rect(0,0,W,H,"F");y=18;tx=ml;}
          doc.setFillColor(...C.surface);doc.setDrawColor(...C.border);doc.setLineWidth(0.2);
          doc.roundedRect(tx,y-3.5,tw,5,1,1,"FD");
          doc.setFontSize(6);doc.setFont("helvetica","normal");doc.setTextColor(...C.muted);
          doc.text(tag,tx+3,y);tx+=tw+3;
        });y+=7;
      }
      sectionHeading("Education");
      doc.setFont("helvetica","bold");doc.setFontSize(9);doc.setTextColor(...C.white);
      doc.text("B.Sc. in Computer Science & Engineering",ml,y);
      doc.setFont("helvetica","normal");doc.setFontSize(7.5);doc.setTextColor(...C.accent);
      doc.text("2024 – Present",W-mr-22,y);y+=5;
      doc.setTextColor(...C.muted);doc.text("Ahsanullah University of Science & Technology · Dhaka, Bangladesh",ml,y);y+=4.5;
      doc.setFontSize(7.5);doc.setTextColor(...C.dim);doc.text("Year 3 · CGPA: In Progress",ml,y);y+=6;
      tagRow(["Algorithms","Data Structures","ML","Computer Networking","Numerical Methods","Assembly","OS","Software Eng."]);y+=2;
      sectionHeading("Experience & Projects");
      doc.setFont("helvetica","bold");doc.setFontSize(9);doc.setTextColor(...C.white);
      doc.text("Full-Stack Developer — KrishiBondhu",ml,y);
      doc.setFont("helvetica","normal");doc.setFontSize(7.5);doc.setTextColor(...C.accent);
      doc.text("2024 – Present",W-mr-22,y);y+=5;
      doc.setTextColor(...C.muted);doc.text("Personal / Academic Project · MERN Stack",ml,y);y+=5;
      const kbLines=doc.splitTextToSize("Designed and built a full-stack agricultural marketplace for Bangladesh — three role-based portals (farmer, buyer, admin), JWT authentication, Cloudinary image uploads, OpenWeatherMap API integration, seed-scripted MongoDB Atlas, and a fully responsive custom CSS UI.",contentW-4);
      doc.setFontSize(7.8);doc.setTextColor(...C.dim);
      kbLines.forEach(line=>{doc.text(line,ml+2,y);y+=4.3;});y+=2;
      tagRow(["React 19","Vite","Node.js","Express 5","MongoDB Atlas","JWT","Cloudinary","OpenWeatherMap"]);
      doc.setFont("helvetica","bold");doc.setFontSize(9);doc.setTextColor(...C.white);
      doc.text("Mobile Developer — TrekWise",ml,y);
      doc.setFont("helvetica","normal");doc.setFontSize(7.5);doc.setTextColor(...C.accent);
      doc.text("2024",W-mr-10,y);y+=5;
      doc.setTextColor(...C.muted);doc.text("Personal Project · Flutter / Firebase",ml,y);y+=5;
      const twLines=doc.splitTextToSize("Cross-platform travel planner for navigating fragmented transport in developing regions. Multi-modal route comparison, offline saving, expense tracking, and real-time weather alerts.",contentW-4);
      doc.setFontSize(7.8);doc.setTextColor(...C.dim);
      twLines.forEach(line=>{doc.text(line,ml+2,y);y+=4.3;});y+=2;
      tagRow(["Flutter","Dart","Firebase","OpenStreetMap","Android","iOS"]);
      sectionHeading("Technical Skills");
      const skillCols=[
        {title:"Languages",skills:["C / C++ — Proficient","Java — Proficient","JavaScript — Proficient","Python — Familiar","Dart — Familiar","Assembly — Exposure"]},
        {title:"Frontend & Mobile",skills:["HTML / CSS — Proficient","React + Vite — Proficient","Flutter — Familiar"]},
        {title:"Backend & Database",skills:["Node.js / Express — Proficient","MongoDB — Proficient","MySQL — Familiar","Firebase — Familiar"]},
        {title:"Tools & Cloud",skills:["Git / GitHub — Proficient","AWS — Familiar","Docker — Exposure"]},
        {title:"Machine Learning",skills:["Gradient Descent — Proficient","Linear / Logistic Reg. — Proficient","L2 Regularization — Familiar"]},
      ];
      const colW=(contentW-8)/3;let colX=ml,colY=y;
      skillCols.forEach((col,i)=>{
        if(i===3){colX=ml;colY=y;}
        doc.setFont("helvetica","bold");doc.setFontSize(7.5);doc.setTextColor(...C.accent);
        doc.text(col.title,colX,colY);
        let cy=colY+5;
        col.skills.forEach(s=>{
          const parts=s.split(" — ");
          doc.setFont("helvetica","normal");doc.setFontSize(7.5);doc.setTextColor(...C.white);
          doc.text(parts[0],colX+2,cy);
          if(parts[1]){doc.setFontSize(6.5);doc.setTextColor(...C.dim);doc.text(parts[1],colX+2,cy+3.5);}
          cy+=8;
        });
        if(i<2)colX+=colW+4;
        else if(i===2)y=colY+(skillCols.slice(0,3).reduce((m,c)=>Math.max(m,c.skills.length),0)*8)+12;
        if(i===4)colX+=colW+4;
      });y+=8;
      const totalPages=doc.getNumberOfPages();
      for(let p=1;p<=totalPages;p++){
        doc.setPage(p);
        doc.setFillColor(...C.surface);doc.rect(0,H-10,W,10,"F");
        doc.setDrawColor(...C.border);doc.setLineWidth(0.3);doc.line(0,H-10,W,H-10);
        doc.setFont("helvetica","normal");doc.setFontSize(6.5);doc.setTextColor(...C.dim);
        doc.text("Abdur Rahman Aiman · Portfolio: github.com/AimanCrafts",ml,H-4);
        doc.text(`Page ${p} of ${totalPages}`,W-mr-15,H-4);
      }
      doc.save("Abdur_Rahman_Aiman_CV.pdf");
    }
    ["downloadCVBtn","downloadCVBtn2","downloadCVHero","downloadCVContact"].forEach(id=>{
      const el=document.getElementById(id);
      if(el)el.addEventListener('click',generateCV);
    });
  }

  document.querySelectorAll('.tag-row').forEach(row => {
    row.querySelectorAll('.tag').forEach((tag, i) => {
      tag.style.transitionDelay = (i * 0.03) + 's';
    });
  });

  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const r = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(r.width, r.height) * 2;
      ripple.style.cssText = `
        position:absolute;width:${size}px;height:${size}px;
        left:${e.clientX-r.left-size/2}px;top:${e.clientY-r.top-size/2}px;
        border-radius:50%;background:rgba(255,255,255,0.15);
        transform:scale(0);animation:ripple 0.5s ease-out forwards;pointer-events:none;
      `;
      if (!document.querySelector('#ripple-style')) {
        const s = document.createElement('style');
        s.id = 'ripple-style';
        s.textContent = '@keyframes ripple{to{transform:scale(1);opacity:0;}}';
        document.head.appendChild(s);
      }
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  onScroll();
})();