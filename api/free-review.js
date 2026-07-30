<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>TruckEase | Free Risk Screening</title>
  <meta name="description"
        content="See what's publicly known about your fleet's safety score, authority status, and filing currency — free, no documents required." />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="https://truckeasesolutions.com/free-review" />
 
  <meta property="og:type"  content="website" />
  <meta property="og:image" content="https://truckeasesolutions.com/opengraph.jpg" />
  <meta property="og:title" content="TruckEase | Free Risk Screening" />
  <meta property="og:description" content="See what's publicly known about your fleet's safety score, authority status, and filing currency." />
  <meta name="twitter:card" content="summary_large_image" />
 
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        rel="stylesheet" />
 
  <style>
    :root {
      --navy:   #0c1a36;
      --orange: #e8720c;
      --teal:   #14b8a6;
      --slate:  #64748b;
      --border: #e2e8f0;
      --bg:     #f8fafc;
      --white:  #ffffff;
      --radius: 12px;
      --font:   'Inter', sans-serif;
      --max-w:  1120px;
    }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body {
      font-family: var(--font);
      background: var(--white);
      color: var(--navy);
      -webkit-font-smoothing: antialiased;
    }
    a { color: inherit; text-decoration: none; }
 
    .nav {
      position: sticky; top: 0; z-index: 100;
      background: rgba(12,26,54,0.97);
      backdrop-filter: blur(8px);
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }
    .nav-inner {
      max-width: var(--max-w);
      margin: 0 auto;
      padding: 0 24px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .nav-logo img { height: 30px; width: auto; display: block; }
    .nav-links { display: flex; align-items: center; gap: 28px; list-style: none; }
    .nav-links a {
      color: rgba(255,255,255,0.72);
      font-size: 14px; font-weight: 500;
      transition: color 0.15s;
    }
    .nav-links a:hover { color: #fff; }
    .nav-cta {
      background: var(--orange); color: #fff !important;
      padding: 9px 20px; border-radius: 8px;
      font-weight: 600; font-size: 14px;
      transition: opacity 0.15s; white-space: nowrap;
    }
    .nav-cta:hover { opacity: 0.88; }
 
    .site-footer {
      background: var(--navy);
      color: rgba(255,255,255,0.48);
      padding: 56px 24px 32px;
      font-size: 13px;
    }
    .footer-inner {
      max-width: var(--max-w);
      margin: 0 auto;
      display: flex; flex-wrap: wrap;
      gap: 40px; justify-content: space-between;
      align-items: flex-start;
      padding-bottom: 40px;
      border-bottom: 1px solid rgba(255,255,255,0.09);
      margin-bottom: 28px;
    }
    .footer-brand img {
      height: 28px; margin-bottom: 14px;
      filter: brightness(0) invert(1); opacity: 0.65;
    }
    .footer-brand p {
      font-size: 13px; max-width: 260px;
      line-height: 1.7; color: rgba(255,255,255,0.48);
    }
    .footer-links { display: flex; gap: 56px; flex-wrap: wrap; }
    .footer-col h4 {
      color: rgba(255,255,255,0.82);
      font-size: 11px; font-weight: 700;
      letter-spacing: 0.12em; text-transform: uppercase;
      margin-bottom: 16px;
    }
    .footer-col a {
      display: block;
      color: rgba(255,255,255,0.48);
      font-size: 13px; margin-bottom: 10px;
      transition: color 0.15s;
    }
    .footer-col a:hover { color: rgba(255,255,255,0.9); }
    .footer-bottom {
      max-width: var(--max-w); margin: 0 auto;
      display: flex; justify-content: space-between;
      align-items: center; flex-wrap: wrap; gap: 12px;
    }
    .footer-bottom a {
      color: rgba(255,255,255,0.4);
      transition: color 0.15s;
    }
    .footer-bottom a:hover { color: rgba(255,255,255,0.8); }
 
    .rs-hero {
      background: var(--navy);
      padding: 64px 24px 56px;
      text-align: center;
    }
    .rs-hero .eyebrow {
      display: inline-block; color: var(--orange);
      font-size: 11px; font-weight: 700; letter-spacing: 0.15em;
      text-transform: uppercase; margin-bottom: 18px;
    }
    .rs-hero h1 {
      color: #fff; font-size: clamp(26px, 4vw, 38px);
      font-weight: 700; line-height: 1.2;
      max-width: 560px; margin: 0 auto 14px;
    }
    .rs-hero p {
      color: rgba(255,255,255,0.58); font-size: 15px;
      line-height: 1.7; max-width: 460px; margin: 0 auto;
    }
 
    .tes-rs { max-width: 640px; margin: -32px auto 0; padding: 0 24px 80px; position: relative; }
    .rs-card {
      background: var(--white); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 32px;
      box-shadow: 0 12px 32px rgba(12,26,54,0.10);
    }
    .q-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 16px 0; border-bottom: 1px solid var(--border); }
    .q-row:last-child { border-bottom: none; }
    .q-text { font-size: 14.5px; color: var(--navy); font-weight: 500; flex: 1; line-height: 1.4; }
    .q-opts { display: flex; gap: 8px; flex-shrink: 0; }
    .q-btn { font-size: 12.5px; padding: 8px 14px; border-radius: 20px; border: 1px solid var(--border); background: var(--white); color: var(--navy); cursor: pointer; white-space: nowrap; transition: 0.15s; }
    .q-btn:hover { border-color: var(--orange); }
    .q-btn.active { background: var(--orange); border-color: var(--orange); color: #fff; }
    .next-btn { margin-top: 24px; width: 100%; padding: 14px; border-radius: 8px; border: none; background: var(--navy); color: #fff; font-size: 15px; font-weight: 600; cursor: pointer; transition: opacity 0.15s; }
    .next-btn:hover:not(:disabled) { opacity: 0.9; }
    .next-btn:disabled { background: #cbd5e1; cursor: not-allowed; }
    #screen2 { display: none; }
    .handoff { font-size: 15px; color: var(--navy); font-weight: 600; margin-bottom: 24px; line-height: 1.5; }
    .looks-for-label { font-size: 11px; font-weight: 700; letter-spacing: 0.12em; color: var(--orange); text-transform: uppercase; margin: 0 0 18px; }
    .lf-row { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 18px; }
    .lf-num { width: 26px; height: 26px; border-radius: 50%; background: var(--orange); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; }
    .lf-text { font-size: 14.5px; color: var(--navy); font-weight: 500; line-height: 1.5; }
    .form-fields { margin-top: 24px; border-top: 1px solid var(--border); padding-top: 24px; display: flex; flex-direction: column; gap: 12px; }
    .form-fields input, .form-fields select {
      padding: 12px 14px; border-radius: 8px; border: 1px solid var(--border);
      font-size: 14px; font-family: var(--font); color: var(--navy);
    }
    .form-fields input:focus, .form-fields select:focus { outline: none; border-color: var(--orange); }
    .submit-btn { margin-top: 4px; padding: 14px; border-radius: 8px; border: none; background: var(--orange); color: #fff; font-size: 15px; font-weight: 600; cursor: pointer; transition: opacity 0.15s; }
    .submit-btn:hover { opacity: 0.9; }
    .status { font-size: 13.5px; margin-top: 10px; }
 
    @media (max-width: 640px) {
      .nav-links { display: none; }
      .q-row { flex-direction: column; align-items: flex-start; gap: 10px; }
      .rs-card { padding: 24px; }
    }
  </style>
</head>
<body>
 
<nav class="nav">
  <div class="nav-inner">
    <a href="https://truckeasesolutions.com/" class="nav-logo">
      <img src="/truckease-logo.png" alt="TruckEase Solutions" />
    </a>
    <ul class="nav-links">
      <li><a href="https://truckeasesolutions.com/">Home</a></li>
      <li><a href="https://truckeasesolutions.com/platform">Platform</a></li>
      <li><a href="https://truckeasesolutions.com/services">Services</a></li>
      <li><a href="https://truckeasesolutions.com/about">About</a></li>
      <li><a href="https://truckeasesolutions.com/contact">Contact</a></li>
    </ul>
    <a href="https://truckeasesolutions.com/free-review" class="nav-cta">Get My Risk Screening</a>
  </div>
</nav>
 
<div class="rs-hero">
  <span class="eyebrow">Free Risk Screening</span>
  <h1>How well do you actually know your numbers?</h1>
  <p>Five quick questions. No account needed — just answer honestly.</p>
</div>
 
<div class="tes-rs">
  <div class="rs-card">
    <div id="screen1">
      <div id="quiz"></div>
      <button class="next-btn" id="nextBtn" disabled>Continue</button>
    </div>
 
    <div id="screen2">
      <p class="handoff" id="handoffLine"></p>
      <p class="looks-for-label">What your risk screening looks for</p>
      <div class="lf-row"><div class="lf-num">1</div><div class="lf-text">Public safety indicators that could attract additional regulatory attention</div></div>
      <div class="lf-row"><div class="lf-num">2</div><div class="lf-text">Authority and registration issues that may interrupt operations</div></div>
      <div class="lf-row"><div class="lf-num">3</div><div class="lf-text">Filing gaps and regulatory inconsistencies that deserve attention</div></div>
      <div class="lf-row"><div class="lf-num">4</div><div class="lf-text">Canadian compliance indicators where applicable</div></div>
 
      <form class="form-fields" id="rsForm">
        <input type="text" name="fullName" placeholder="Full name" required />
        <input type="email" name="email" placeholder="Email" required />
        <input type="tel" name="phone" placeholder="Phone" />
        <input type="text" name="dotNumber" placeholder="USDOT / MC / NSC / CVOR number" required />
        <select name="operations" required>
          <option value="">Operating region</option>
          <option value="US Only">US Only</option>
          <option value="Canada Only">Canada Only</option>
          <option value="Cross-Border">Cross-Border</option>
        </select>
        <button type="submit" class="submit-btn">Send my risk screening request</button>
        <p class="status" id="status"></p>
      </form>
    </div>
  </div>
</div>
 
<footer class="site-footer">
  <div class="footer-inner">
    <div class="footer-brand">
      <img src="/truckease-logo.png" alt="TruckEase Solutions" />
      <p>Compliance infrastructure for carriers across the US and Canada.</p>
    </div>
    <nav class="footer-links">
      <div class="footer-col">
        <h4>Platform</h4>
        <a href="https://truckeasesolutions.com/platform">Overview</a>
        <a href="https://truckeasesolutions.com/services">Services</a>
        <a href="https://truckeasesolutions.com/free-review">Get My Risk Screening</a>
      </div>
      <div class="footer-col">
        <h4>Company</h4>
        <a href="https://truckeasesolutions.com/about">About</a>
        <a href="/blog">Blog</a>
        <a href="https://truckeasesolutions.com/contact">Contact</a>
      </div>
    </nav>
  </div>
  <div class="footer-bottom">
    <span>© 2026 TruckEase Solutions Inc. All rights reserved.</span>
    <a href="mailto:support@truckeasesolutions.com">support@truckeasesolutions.com</a>
  </div>
</footer>
 
<script>
(function () {
  const questions = [
    "Which safety category is quietly closest to trouble?",
    "What would a broker see first on your DOT number?",
    "Do you actually know why your score moved \u2014 or just that it did?",
    "How many loads or contracts have you quietly lost, without anyone telling you why?",
    "Same issue, two different trucks, months apart \u2014 would you catch the connection?"
  ];
 
  const answers = new Array(questions.length).fill(null);
  const quizEl = document.getElementById('quiz');
  const nextBtn = document.getElementById('nextBtn');
 
  questions.forEach((q, i) => {
    const row = document.createElement('div');
    row.className = 'q-row';
    const text = document.createElement('div');
    text.className = 'q-text';
    text.textContent = q;
    const opts = document.createElement('div');
    opts.className = 'q-opts';
    ['Confident I know', 'Not sure'].forEach(label => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'q-btn';
      btn.textContent = label;
      btn.onclick = () => {
        answers[i] = label;
        Array.from(opts.children).forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        nextBtn.disabled = answers.includes(null);
      };
      opts.appendChild(btn);
    });
    row.appendChild(text);
    row.appendChild(opts);
    quizEl.appendChild(row);
  });
 
  nextBtn.onclick = () => {
    const unsureCount = answers.filter(a => a === 'Not sure').length;
    document.getElementById('handoffLine').textContent = unsureCount > 0
      ? `Based on what you told us, ${unsureCount} of these are worth a closer look \u2014 tell us where to send your findings.`
      : `Sounds like you know your numbers well \u2014 let's confirm it with your findings.`;
    document.getElementById('screen1').style.display = 'none';
    document.getElementById('screen2').style.display = 'block';
    window.__tesQuizAnswers = questions.map((q, i) => ({ question: q, answer: answers[i] }));
  };
 
  document.getElementById('rsForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const statusEl = document.getElementById('status');
    const fd = new FormData(e.target);
    const payload = {
      fullName: fd.get('fullName'),
      email: fd.get('email'),
      phone: fd.get('phone'),
      dotNumber: fd.get('dotNumber'),
      operations: fd.get('operations'),
      quizAnswers: window.__tesQuizAnswers || []
    };
    statusEl.textContent = 'Sending...';
    statusEl.style.color = 'var(--slate)';
    try {
      const res = await fetch('/api/free-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.ok) {
        statusEl.textContent = "Request received \u2014 we'll follow up shortly.";
        statusEl.style.color = '#16a34a';
        e.target.reset();
      } else {
        statusEl.textContent = data.error || 'Something went wrong. Try again.';
        statusEl.style.color = '#dc2626';
      }
    } catch (err) {
      statusEl.textContent = 'Network error. Try again.';
      statusEl.style.color = '#dc2626';
    }
  });
})();
</script>
</body>
</html>
 
