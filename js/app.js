/* Aceso — interactive bits. No tracking, no cookies. Anything saved stays in your own browser. */
(function () {
  "use strict";
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const root = document.documentElement;
  const store = {
    get(k, d = null) { try { const v = localStorage.getItem("aceso:" + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem("aceso:" + k, JSON.stringify(v)); return true; } catch (e) { return false; } },
    del(k) { try { localStorage.removeItem("aceso:" + k); } catch (e) {} }
  };
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Sprout, the mascot ---------- */
  function sprout(mood = "happy", extra = "") {
    const eyes = {
      happy: `<ellipse class="blink" cx="46" cy="66" rx="5" ry="6.5" fill="#3b2a22"/><ellipse class="blink" cx="74" cy="66" rx="5" ry="6.5" fill="#3b2a22"/><circle cx="47.5" cy="63.5" r="1.8" fill="#fff"/><circle cx="75.5" cy="63.5" r="1.8" fill="#fff"/>`,
      sleepy: `<path d="M40 66 q6 5 12 0 M68 66 q6 5 12 0" stroke="#3b2a22" stroke-width="3.5" fill="none" stroke-linecap="round"/>`,
      sad: `<ellipse class="blink" cx="46" cy="68" rx="4.5" ry="5.5" fill="#3b2a22"/><ellipse class="blink" cx="74" cy="68" rx="4.5" ry="5.5" fill="#3b2a22"/><path d="M38 58 l10 3 M82 58 l-10 3" stroke="#3b2a22" stroke-width="3" stroke-linecap="round"/><path d="M80 74 q3 7 0 9 q-3 -2 0 -9z" fill="#8cc3e0" stroke="#3b2a22" stroke-width="1.5"/>`,
      calm: `<path d="M40 67 q6 -5 12 0 M68 67 q6 -5 12 0" stroke="#3b2a22" stroke-width="3.5" fill="none" stroke-linecap="round"/>`,
      wow: `<circle class="blink" cx="46" cy="65" r="7" fill="#3b2a22"/><circle class="blink" cx="74" cy="65" r="7" fill="#3b2a22"/><circle cx="48" cy="62" r="2.4" fill="#fff"/><circle cx="76" cy="62" r="2.4" fill="#fff"/>`
    }[mood] || "";
    const mouth = {
      happy: `<path d="M52 78 q8 8 16 0" stroke="#3b2a22" stroke-width="3.5" fill="none" stroke-linecap="round"/>`,
      sleepy: `<ellipse cx="60" cy="80" rx="4" ry="3" fill="#3b2a22"/>`,
      sad: `<path d="M53 83 q7 -6 14 0" stroke="#3b2a22" stroke-width="3.5" fill="none" stroke-linecap="round"/>`,
      calm: `<path d="M54 79 q6 5 12 0" stroke="#3b2a22" stroke-width="3.5" fill="none" stroke-linecap="round"/>`,
      wow: `<ellipse cx="60" cy="81" rx="5" ry="6" fill="#3b2a22"/>`
    }[mood] || "";
    return `<svg class="sprout" viewBox="0 0 120 120" aria-hidden="true">
      <ellipse cx="60" cy="112" rx="34" ry="5" fill="#3b2a22" opacity=".15"/>
      <g class="leaf">
        <path d="M60 36 C60 26 60 22 60 16" stroke="#3b2a22" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="M60 22 C48 8 34 14 34 22 C44 28 54 28 60 22Z" fill="#7fb08b" stroke="#3b2a22" stroke-width="3.5" stroke-linejoin="round"/>
        <path d="M60 20 C70 4 88 8 88 16 C78 24 66 26 60 20Z" fill="#9cc5a1" stroke="#3b2a22" stroke-width="3.5" stroke-linejoin="round"/>
      </g>
      <g class="body">
        <path d="M60 34 C88 34 102 58 100 82 C98 102 82 110 60 110 C38 110 22 102 20 82 C18 58 32 34 60 34Z" fill="var(--sprout)" stroke="#3b2a22" stroke-width="4"/>
        <path d="M34 60 C36 50 42 44 50 41" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".5"/>
        ${eyes}
        <ellipse cx="36" cy="78" rx="7" ry="4.5" fill="#f08e9a" opacity=".55"/>
        <ellipse cx="84" cy="78" rx="7" ry="4.5" fill="#f08e9a" opacity=".55"/>
        ${mouth}
        ${extra}
      </g>
    </svg>`;
  }
  window.acesoSprout = sprout;
  $$("[data-sprout]").forEach(el => { el.innerHTML = sprout(el.dataset.sprout); });
  const heroSprout = $("#heroSprout");
  if (heroSprout) {
    const arm = `<path class="wave-arm" d="M96 72 C108 66 114 56 112 44" stroke="#3b2a22" stroke-width="4" fill="none" stroke-linecap="round"/><circle class="wave-arm" cx="112" cy="42" r="6" fill="var(--sprout)" stroke="#3b2a22" stroke-width="3"/>`;
    heroSprout.innerHTML = sprout("happy", arm).replace("<svg ", '<svg width="130" height="130" overflow="visible" ');
  }

  /* ---------- theme (day / night) ---------- */
  const themeBtn = $("#themeToggle");
  function currentTheme() {
    return root.dataset.theme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  }
  function paintThemeBtn() {
    const t = currentTheme();
    themeBtn.innerHTML = t === "dark" ? "☀️" : "🌙";
    themeBtn.setAttribute("aria-label", t === "dark" ? "Switch to daytime" : "Switch to night-time");
    themeBtn.title = themeBtn.getAttribute("aria-label");
  }
  themeBtn.addEventListener("click", () => {
    const next = currentTheme() === "dark" ? "light" : "dark";
    root.dataset.theme = next; store.set("theme", next); paintThemeBtn();
  });
  paintThemeBtn();

  /* ---------- calm mode (pause animations) ---------- */
  const calmBtn = $("#calmToggle");
  function setCalm(on) {
    root.classList.toggle("calm", on);
    calmBtn.setAttribute("aria-pressed", String(on));
    calmBtn.title = on ? "Resume gentle animations" : "Pause all animations";
    calmBtn.setAttribute("aria-label", calmBtn.title);
    store.set("calm", on);
  }
  calmBtn.addEventListener("click", () => setCalm(!root.classList.contains("calm")));
  setCalm(!!store.get("calm", false));

  /* ---------- quick exit ---------- */
  function quickExit() {
    try { window.open("https://www.bbc.com/weather", "_blank", "noopener"); } catch (e) {}
    window.location.replace("https://www.google.com/search?q=weather");
  }
  $$("[data-quick-exit]").forEach(b => b.addEventListener("click", quickExit));
  let escCount = 0, escTimer;
  document.addEventListener("keydown", e => {
    if (e.key !== "Escape") return;
    if ($("#drawer").classList.contains("open")) { closeDrawer(); return; }
    escCount++; clearTimeout(escTimer); escTimer = setTimeout(() => (escCount = 0), 900);
    if (escCount >= 3) quickExit();
  });

  /* ---------- drawer ---------- */
  const drawer = $("#drawer"), backdrop = $("#drawerBackdrop"), menuBtn = $("#menuBtn");
  function openDrawer() { drawer.classList.add("open"); backdrop.classList.add("show"); drawer.setAttribute("aria-hidden", "false"); menuBtn.setAttribute("aria-expanded", "true"); $("a, button", drawer).focus(); }
  function closeDrawer() { drawer.classList.remove("open"); backdrop.classList.remove("show"); drawer.setAttribute("aria-hidden", "true"); menuBtn.setAttribute("aria-expanded", "false"); menuBtn.focus({ preventScroll: true }); }
  menuBtn.addEventListener("click", openDrawer);
  backdrop.addEventListener("click", closeDrawer);
  $("#drawerClose").addEventListener("click", closeDrawer);
  // build drawer list from chapter stops
  const drawerList = $("#drawerList");
  $$("[data-stop]").forEach(sec => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="#${sec.id}"><span class="em" aria-hidden="true">${sec.dataset.emoji || "•"}</span>${sec.dataset.stop}</a>`;
    drawerList.appendChild(li);
  });
  drawerList.addEventListener("click", e => { if (e.target.closest("a")) closeDrawer(); });

  /* ---------- progress snail + back-to-top ---------- */
  const trail = $(".progress-trail"), snail = $(".snail"), toTop = $("#toTop");
  let ticking = false;
  function onScroll() {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const p = h > 0 ? Math.min(1, window.scrollY / h) : 0;
    trail.style.width = (p * 100) + "%";
    snail.style.left = `calc(${p * 100}% * 0.96 + 2%)`;
    toTop.classList.toggle("show", window.scrollY > 900);
    ticking = false;
  }
  window.addEventListener("scroll", () => { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
  onScroll();

  /* ---------- falling leaves ---------- */
  if (!reduceMotion) {
    const leaves = $(".leaves");
    const bits = ["🍃", "🌸", "✨", "🍂", "🌼"];
    for (let i = 0; i < 9; i++) {
      const s = document.createElement("span");
      s.textContent = bits[i % bits.length];
      s.style.left = (Math.random() * 100) + "vw";
      s.style.animationDuration = (22 + Math.random() * 22) + "s";
      s.style.animationDelay = (-Math.random() * 40) + "s";
      s.style.fontSize = (0.9 + Math.random() * 0.8) + "rem";
      leaves.appendChild(s);
    }
  }

  /* ---------- help-now region tabs ---------- */
  const regionBtns = $$(".region-tabs button");
  function showRegion(r) {
    regionBtns.forEach(b => b.setAttribute("aria-pressed", String(b.dataset.region === r)));
    $$(".hotline").forEach(h => { h.hidden = !(r === "all" || h.dataset.region.split(" ").includes(r)); });
    store.set("region", r);
  }
  regionBtns.forEach(b => b.addEventListener("click", () => showRegion(b.dataset.region)));
  showRegion(store.get("region", "all"));

  /* ---------- inner weather check-in ---------- */
  const WEATHER = {
    stormy: { mood: "wow", title: "Stormy & racing — anxious or panicky", text: "Thunder in the chest, thoughts going a hundred miles an hour. That's your alarm system working overtime, not you failing. First, slow the body down — the mind follows.", steps: ["Try the breathing bubble below: long, slow out-breaths tell your body it's safe.", "Name 5 things you can see. Out loud if you can.", "Cold water on your face or wrists can calm a panic spike quickly."], links: [["#breathe", "🫧 Breathing bubble"], ["#ch-anxiety", "📖 Anxiety & panic"], ["#ground", "🖐️ 5-4-3-2-1"]] },
    rainy: { mood: "sad", title: "Rainy — sad, low, heavy", text: "It's okay for it to rain. You don't have to force the sun out. Today, the goal is just to be gentle with yourself and do one small kind thing.", steps: ["Drink a glass of water and eat something, even something small.", "Message one person — even just \"hey, rough day\".", "Open a window or step outside for two minutes."], links: [["#ch-low", "📖 Low mood"], ["#jar", "🫙 Kind notes jar"], ["#garden", "🌷 Tiny wins garden"]] },
    foggy: { mood: "calm", title: "Foggy — numb, flat, disconnected", text: "Fog is often your mind's way of protecting you when things feel like too much. Gently bringing your senses back online can help the fog lift a little.", steps: ["Hold something with a strong texture or temperature — ice, a warm mug, a soft blanket.", "Put on a song you used to love and notice one detail in it.", "Move a little: stretch, shake out your hands, walk around the room."], links: [["#ground", "🖐️ Grounding"], ["#ch-trauma", "📖 The nervous system"], ["#ch-low", "📖 Low mood"]] },
    windy: { mood: "wow", title: "Windy — overwhelmed, too much at once", text: "When everything's blowing around, the trick is to make the world smaller. Not the whole list — just the very next tiny step.", steps: ["Write everything down so your brain doesn't have to hold it.", "Circle just ONE thing. Do the first 2 minutes of it.", "Cancel or postpone one thing if you can. That's allowed."], links: [["#ch-stress", "📖 Stress & burnout"], ["#selfcare", "🧭 Self-care check"], ["#breathe", "🫧 Breathe"]] },
    hot: { mood: "wow", title: "Scorching — angry, irritable, on edge", text: "Anger is information — it often means a boundary got crossed or a need isn't being met. It's safe to feel it; we just want to stop it steering the car.", steps: ["Change your body temperature: splash cold water, step outside.", "Move hard for 60 seconds — fast walk, push-ups, squeeze a pillow.", "Wait to send that message. Write it, don't send it."], links: [["#ch-anger", "📖 Anger & big feelings"], ["#breathe", "🫧 Breathe"]] },
    tired: { mood: "sleepy", title: "Drizzly & grey — exhausted, running on empty", text: "Tiredness can be your body, your mind or your heart. Sometimes all three. Rest isn't a reward you earn — it's maintenance.", steps: ["Is there a 20-minute rest you can take? Lying down counts even without sleep.", "Lower the bar: what's the 'good enough' version of today?", "Check the basics — food, water, a shower can be weirdly powerful."], links: [["#ch-sleep", "📖 Sleep"], ["#ch-stress", "📖 Burnout"], ["#selfcare", "🧭 Self-care check"]] },
    lonely: { mood: "sad", title: "Cloudy & cold — lonely", text: "Loneliness is one of the most human feelings there is, and it doesn't mean something's wrong with you. It's a signal, like hunger, that you need connection.", steps: ["Send a low-pressure message: a meme, a photo, \"thinking of you\".", "Be around people without needing to talk — a café, library, park.", "Talk to a warm, anonymous listener — see peer support in the library."], links: [["#ch-lonely", "📖 Loneliness"], ["#library", "🫶 Peer support"]] },
    sunny: { mood: "happy", title: "Sunny spells — doing okay!", text: "Yay! Good days are a great time to plant seeds for harder ones. Future-you will be grateful.", steps: ["Fill in your safety plan / toolkit while your head is clear.", "Note down what helped you feel okay today.", "Send someone you love a kind word."], links: [["#safety-plan", "🗺️ Build your toolkit"], ["#garden", "🌷 Tiny wins"], ["#map", "🧭 Explore the guide"]] }
  };
  const weatherOut = $("#weatherResult");
  $$(".weather-btn").forEach(btn => btn.addEventListener("click", () => {
    $$(".weather-btn").forEach(b => b.setAttribute("aria-pressed", "false"));
    btn.setAttribute("aria-pressed", "true");
    const w = WEATHER[btn.dataset.weather];
    weatherOut.innerHTML = `<div class="card weather-result" role="status">
      ${sprout(w.mood)}
      <div><h3>${w.title}</h3><p>${w.text}</p>
      <ul>${w.steps.map(s => `<li>${s}</li>`).join("")}</ul>
      <div class="links">${w.links.map(([h, t]) => `<a class="chip" href="${h}">${t}</a>`).join("")}</div>
      <p style="margin:.8rem 0 0;font-size:.92rem;color:var(--ink-soft)">If it feels like a hurricane — like you might not be safe — please <a href="#help-now">reach out for help now</a>. 💛</p></div></div>`;
  }));

  /* ---------- breathing bubble ---------- */
  const PATTERNS = {
    calm: { name: "Calm 4–6", steps: [["Breathe in", 4, 1.35], ["Breathe out", 6, .8]] },
    box: { name: "Box 4–4–4–4", steps: [["Breathe in", 4, 1.35], ["Hold", 4, 1.35], ["Breathe out", 4, .8], ["Hold", 4, .8]] },
    478: { name: "4–7–8", steps: [["Breathe in", 4, 1.35], ["Hold", 7, 1.35], ["Breathe out slowly", 8, .8]] },
    sigh: { name: "Double sigh", steps: [["Breathe in", 2, 1.2], ["…a little more", 1, 1.4], ["Long sigh out", 6, .8]] }
  };
  const blob = $("#breatheBlob"), bLabel = $("#breatheLabel"), bCount = $("#breatheCount"), bStart = $("#breatheStart");
  blob.innerHTML = `<svg class="face" viewBox="0 0 60 40" aria-hidden="true"><path d="M12 16 q5 -5 10 0 M38 16 q5 -5 10 0" stroke="#3b2a22" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M24 26 q6 5 12 0" stroke="#3b2a22" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`;
  let pattern = "calm", bTimer = null, bRunning = false, cycles = 0;
  $$("[data-pattern]").forEach(b => b.addEventListener("click", () => {
    pattern = b.dataset.pattern;
    $$("[data-pattern]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
    if (bRunning) { stopBreathing(); startBreathing(); }
  }));
  function stopBreathing() {
    bRunning = false; clearTimeout(bTimer); clearInterval(bCount._i);
    blob.style.transitionDuration = "1s"; blob.style.transform = "scale(.8)";
    bLabel.textContent = cycles ? `Nice. ${cycles} breath${cycles > 1 ? "s" : ""} 💛` : "Press start when ready";
    bCount.textContent = ""; bStart.textContent = "▶ Start";
  }
  function startBreathing() {
    bRunning = true; cycles = 0; bStart.textContent = "■ Stop";
    const steps = PATTERNS[pattern].steps; let i = 0;
    (function next() {
      if (!bRunning) return;
      const [label, secs, scale] = steps[i];
      bLabel.textContent = label;
      blob.style.transitionDuration = secs + "s";
      blob.style.transform = `scale(${scale})`;
      let left = secs; bCount.textContent = left;
      clearInterval(bCount._i);
      bCount._i = setInterval(() => { left--; bCount.textContent = left > 0 ? left : ""; }, 1000);
      i = (i + 1) % steps.length; if (i === 0) cycles++;
      bTimer = setTimeout(next, secs * 1000);
    })();
  }
  bStart.addEventListener("click", () => (bRunning ? stopBreathing() : startBreathing()));

  /* ---------- 5-4-3-2-1 grounding ---------- */
  const G = [
    [5, "things you can see", "Look around slowly. A colour, a shadow, a crack in the ceiling. Name them."],
    [4, "things you can feel", "Your feet on the floor, fabric on your skin, the air temperature, the chair holding you up."],
    [3, "things you can hear", "Far away sounds, close sounds, your own breathing."],
    [2, "things you can smell", "Or two smells you like, if nothing's around — coffee? rain? a warm towel?"],
    [1, "thing you can taste", "Or one kind thing you can say to yourself right now."]
  ];
  const gBox = $("#groundStep"); let gi = 0;
  function renderGround() {
    if (gi >= G.length) {
      gBox.innerHTML = `<div>${sprout("happy")}</div><h4>You're here. You're now.</h4><p>Notice your breath for a moment. How do you feel compared to before?</p><div><button class="btn sage small" id="gAgain">↺ Again</button></div>`;
      $(".sprout", gBox).style.width = "90px"; $(".sprout", gBox).style.margin = "0 auto";
      $("#gAgain").addEventListener("click", () => { gi = 0; renderGround(); });
      return;
    }
    const [n, what, hint] = G[gi];
    gBox.innerHTML = `<div class="ground-num">${n}</div><h4>${what}</h4><p style="color:var(--ink-soft);margin:0 auto;max-width:34ch">${hint}</p>
      <div class="dots" role="group" aria-label="Tap a dot for each one you notice">${Array.from({ length: n }, (_, k) => `<button class="dot" aria-label="Noticed ${k + 1}"></button>`).join("")}</div>`;
    $$(".dot", gBox).forEach(d => d.addEventListener("click", () => {
      d.classList.toggle("on");
      if ($$(".dot.on", gBox).length === n) setTimeout(() => { gi++; renderGround(); }, 450);
    }));
  }
  renderGround();
  $("#groundSkip").addEventListener("click", () => { gi = Math.min(G.length, gi + 1); renderGround(); });
  $("#groundReset").addEventListener("click", () => { gi = 0; renderGround(); });

  /* ---------- kind notes jar ---------- */
  const NOTES = [
    "You've survived every hard day so far. That's a 100% record.",
    "Rest is productive. Your body is doing repairs.",
    "You don't have to feel better all at once. A little less bad counts.",
    "Feelings are weather, not climate. This will shift.",
    "Somebody's day is better because you exist in it.",
    "It's okay to do the bare minimum today. Bare minimum is still something.",
    "You're allowed to take up space.",
    "Asking for help is a skill, not a weakness.",
    "Drink some water. Future-you says thanks. 💧",
    "You are not behind. There is no timeline.",
    "Your worth isn't measured in productivity.",
    "Be as kind to yourself as you'd be to a friend having this exact day.",
    "Tiny steps still move you forward. Snails get there too. 🐌",
    "You don't need to earn rest, food, or kindness.",
    "Brains are weird and sometimes lie. Not every thought is true.",
    "You made it to this page, looking for help. That's brave.",
    "It's okay to cry. Tears are just feelings leaving the building.",
    "One day at a time. Or one hour. Or one breath.",
    "The fact that you care so much is a beautiful thing about you.",
    "You're doing better than you think you are.",
    "Healing isn't linear. A wobble isn't a reset.",
    "Some days the win is just getting through. That's a real win.",
    "You are a whole person, not a problem to be solved.",
    "There are people who would really want to help, if they knew.",
    "Today you get to be a beginner at feeling better.",
    "Your softness is not a flaw.",
    "Go gently. You're in the middle of something hard.",
    "Look up for a second. The sky's still there. So are you. ☁️"
  ];
  const jarNote = $("#jarNote"); let lastNote = -1;
  $("#jarBtn").addEventListener("click", () => {
    let n; do { n = Math.floor(Math.random() * NOTES.length); } while (n === lastNote && NOTES.length > 1);
    lastNote = n; jarNote.classList.remove("pop"); void jarNote.offsetWidth;
    jarNote.textContent = NOTES[n]; jarNote.classList.add("pop");
  });

  /* ---------- tiny wins garden ---------- */
  const WINS = ["💧 Drank water", "🍞 Ate something", "🚿 Washed / showered", "🌤️ Went outside", "💊 Took meds", "🗣️ Talked to someone", "🧘 Took a breath break", "🛏️ Rested", "🎵 Did something I like", "🧹 One small chore", "🚶 Moved my body", "📵 Phone break"];
  const today = new Date().toISOString().slice(0, 10);
  let gardenState = store.get("garden", {});
  if (gardenState.date !== today) gardenState = { date: today, done: [] };
  const winsEl = $("#wins"), bed = $("#flowerbed"), gMsg = $("#gardenMsg");
  const FLOWER_COLORS = ["#e07a5f", "#f2b84b", "#9c6b98", "#a8d5e2", "#f4a3b8", "#f9d98c"];
  function flower(i) {
    const c = FLOWER_COLORS[i % FLOWER_COLORS.length], h = 40 + ((i * 17) % 35);
    return `<svg class="flower" viewBox="0 0 34 90" style="height:${h + 30}px;animation-delay:0s, ${-(i * .7)}s" aria-hidden="true">
      <path d="M17 90 C17 70 15 55 17 ${90 - h}" stroke="#4f7d5c" stroke-width="3" fill="none"/>
      <path d="M17 75 q-10 -4 -12 -12 q9 0 12 10" fill="#7fb08b" stroke="#3b2a22" stroke-width="1.5"/>
      <g transform="translate(17 ${90 - h})">${[0, 72, 144, 216, 288].map(a => `<ellipse cx="0" cy="-8" rx="5.5" ry="8" fill="${c}" stroke="#3b2a22" stroke-width="1.8" transform="rotate(${a})"/>`).join("")}<circle r="4.5" fill="#f9d98c" stroke="#3b2a22" stroke-width="1.8"/></g></svg>`;
  }
  function renderGarden() {
    bed.innerHTML = gardenState.done.map((_, i) => flower(i)).join("") || `<span class="hand" style="font-size:1.3rem;color:var(--ink-soft);align-self:center">your garden is resting… 🌱</span>`;
    const n = gardenState.done.length;
    gMsg.textContent = n === 0 ? "Tick anything you've done today. Every tiny thing counts." : n < 3 ? `${n} little win${n > 1 ? "s" : ""}! Look at that, something's growing.` : n < 6 ? `${n} wins — your garden's blooming 🌷` : `${n} wins?! That's a whole meadow. Proud of you.`;
  }
  winsEl.innerHTML = WINS.map((w, i) => `<label class="win"><input type="checkbox" value="${i}" ${gardenState.done.includes(i) ? "checked" : ""}> ${w}</label>`).join("");
  winsEl.addEventListener("change", e => {
    const i = +e.target.value;
    gardenState.done = e.target.checked ? [...new Set([...gardenState.done, i])] : gardenState.done.filter(x => x !== i);
    store.set("garden", gardenState); renderGarden();
  });
  renderGarden();

  /* ---------- self-care check (step-through) ---------- */
  const FLOW = [
    ["Are you safe right now?", "If you're thinking about hurting yourself, or you're in danger, that comes first.", "no-safe"],
    ["Have you had some water in the last few hours?", "Even mild dehydration can make you feel anxious, foggy and grumpy.", "Go get a glass of water. Sip it slowly. We'll wait right here. 💧"],
    ["Have you eaten in the last 3–4 hours?", "Low blood sugar can feel a lot like anxiety or despair.", "Eat something, anything — toast, a banana, crackers, cereal straight from the box. Something with a bit of protein is a bonus."],
    ["Have you taken any medications you're supposed to?", "Including anything for pain, allergies or periods. (If you don't take any, tap yes.)", "If it's time, take them. If you missed a dose, check the leaflet or ask a pharmacist what to do."],
    ["Did you sleep okay last night?", "Not-enough sleep makes everything feel ten times heavier.", "If you can, take a 20-minute rest or nap. If not, be extra gentle — today is a 'tired brain' day and that changes how things look."],
    ["Have you been outside or seen daylight today?", "Natural light helps your body clock and mood.", "Step outside for 5 minutes, or just open a window and look at the sky."],
    ["Have you moved your body at all today?", "Not exercise — just movement. Stretching totally counts.", "Try one song's worth of movement: stretch, sway, walk around the house, dance badly."],
    ["Are you physically comfortable?", "Too hot? Too cold? Need the loo? Clothes scratchy? Sitting in a weird position?", "Fix one physical thing — grab a jumper, change into soft clothes, adjust the temperature."],
    ["Have you showered or washed recently?", "It's surprising how much a little reset can help.", "If a full shower is too much: wash your face, brush your teeth, put on clean clothes. Small resets count."],
    ["Have you talked to another human today?", "Connection is a basic need, like food.", "Send someone a message — even just a meme. Or try a warm, anonymous listener from the peer support section."],
    ["Have you been on your phone / online for a long time?", "The internet can quietly drain us.", "Put the phone face-down for 15 minutes. Look at something far away. Pet an animal if one's nearby."]
  ];
  const flowEl = $("#flow"); let fi = 0;
  function renderFlow(answer) {
    if (fi >= FLOW.length) {
      flowEl.innerHTML = `<p class="flow-q">You've checked all the basics. 💛</p><p>If you still feel awful, that's okay — it means this is something deeper than a basic need, and that deserves care too. Wait 20–30 minutes after doing any of the above, then check in again. Try the <a href="#breathe">breathing bubble</a>, a <a href="#jar">kind note</a>, or read the <a href="#map">guide</a> for what you're feeling. And it's always okay to <a href="#help-now">talk to someone</a>.</p><button class="btn sky small" id="flowReset">↺ Start over</button>`;
      $("#flowReset").addEventListener("click", () => { fi = 0; renderFlow(); });
      return;
    }
    const [q, sub] = FLOW[fi];
    flowEl.innerHTML = `<span class="flow-progress">question ${fi + 1} of ${FLOW.length}</span>
      <p class="flow-q">${q}</p><p style="color:var(--ink-soft)">${sub}</p>
      ${answer ? `<div class="flow-answer" role="status">${answer}</div>` : ""}
      <div class="flow-btns">${answer ? `<button class="btn sage small" data-f="next">Done / next →</button>` : `<button class="btn sage small" data-f="yes">Yes</button><button class="btn terracotta small" data-f="no">No</button>`}
      ${fi > 0 ? `<button class="btn ghost small" data-f="back">← Back</button>` : ""}</div>`;
    $$("[data-f]", flowEl).forEach(b => b.addEventListener("click", () => {
      const f = b.dataset.f;
      if (f === "back") { fi--; renderFlow(); return; }
      if (f === "yes" || f === "next") { fi++; renderFlow(); return; }
      const ans = FLOW[fi][2];
      if (ans === "no-safe") {
        renderFlow(`<strong>Please reach out right now.</strong> You deserve support and you don't have to handle this alone. Call your local emergency number, or a crisis line — <a href="#help-now">find one here</a>. If you can, move away from anything you could hurt yourself with and go be near another person.`);
        return;
      }
      renderFlow(ans);
    }));
  }
  renderFlow();

  /* ---------- flip cards ---------- */
  $$(".flip").forEach(f => {
    f.setAttribute("aria-pressed", "false");
    f.addEventListener("click", () => { const on = f.classList.toggle("flipped"); f.setAttribute("aria-pressed", String(on)); });
  });

  /* ---------- stress bucket ---------- */
  const bucketRange = $("#bucketRange"), water = $("#bucketWater"), tap = $("#bucketTap"), bucketMsg = $("#bucketMsg");
  function paintBucket() {
    const stress = +bucketRange.value, coping = tap.checked;
    const level = Math.max(.08, Math.min(1.08, stress / 100 - (coping ? .35 : 0)));
    water.style.transform = `scaleY(${level})`;
    bucketMsg.textContent = level > 1 ? "Overflowing! This is when people 'suddenly' struggle — it's not sudden, the bucket just got full." :
      level > .75 ? "Getting very full. Small things might tip it over now." :
      level > .45 ? "Filling up. A good time to open the tap." : "Lots of room. Nice and steady.";
  }
  bucketRange.addEventListener("input", paintBucket); tap.addEventListener("change", paintBucket); paintBucket();

  /* ---------- safety plan / toolkit ---------- */
  const planFields = $$("#planForm textarea"), saved = $("#planSaved");
  const plan = store.get("plan", {});
  planFields.forEach(t => { if (plan[t.name]) t.value = plan[t.name]; });
  let saveT;
  $("#planForm").addEventListener("input", () => {
    clearTimeout(saveT);
    saveT = setTimeout(() => {
      const data = {}; planFields.forEach(t => (data[t.name] = t.value));
      saved.textContent = store.set("plan", data) ? "✓ saved privately on this device" : "Couldn't save in this browser — try printing it instead.";
    }, 500);
  });
  $("#planPrint").addEventListener("click", () => window.print());
  $("#planClear").addEventListener("click", () => {
    if (!confirm("Clear your whole plan from this device?")) return;
    planFields.forEach(t => (t.value = "")); store.del("plan"); saved.textContent = "Cleared.";
  });
  $("#planDownload").addEventListener("click", () => {
    const text = planFields.map(t => `## ${t.closest(".plan-field").querySelector("label").textContent}\n${t.value || "-"}\n`).join("\n");
    const blob = new Blob([`My Aceso toolkit & safety plan\n\n${text}\nCrisis lines: https://findahelpline.com\n`], { type: "text/plain" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "my-aceso-plan.txt"; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  });

  /* ---------- library ---------- */
  const CATS = window.ACESO_CATEGORIES, RES = window.ACESO_RESOURCES;
  const libGrid = $("#libGrid"), libCount = $("#libCount"), libSearch = $("#libSearch"), filterWrap = $("#libFilters");
  let activeCat = "all";
  filterWrap.innerHTML = `<button data-cat="all" aria-pressed="true">✨ Everything</button>` +
    Object.entries(CATS).map(([k, c]) => `<button data-cat="${k}" aria-pressed="false">${c.emoji} ${c.label}</button>`).join("");
  const esc = s => s.replace(/[&<>"]/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));
  function renderLib() {
    const q = libSearch.value.trim().toLowerCase();
    const list = RES.filter(([n, u, d, c, t]) => (activeCat === "all" || c === activeCat) && (!q || (n + " " + d + " " + t.join(" ") + " " + CATS[c].label).toLowerCase().includes(q)));
    libGrid.innerHTML = list.map(([n, u, d, c, t]) => `<a class="res" href="${esc(u)}" target="_blank" rel="noopener noreferrer" style="--c:${CATS[c].color}">
      <h4><span>${esc(n)}</span><span class="arrow" aria-hidden="true">↗</span></h4><p>${esc(d)}</p>
      <div class="tags"><span class="tag">${CATS[c].emoji} ${CATS[c].label}</span>${t.map(x => `<span class="tag ${x === "pick" ? "star" : ""}">${x === "pick" ? "★ cozy pick" : x}</span>`).join("")}</div></a>`).join("") ||
      `<p class="empty">Nothing here yet… try another word? 🐌</p>`;
    libCount.textContent = `${list.length} resource${list.length === 1 ? "" : "s"} ${activeCat === "all" ? "" : "in " + CATS[activeCat].label.toLowerCase()}`;
  }
  function setCat(cat) {
    activeCat = CATS[cat] ? cat : "all";
    $$("button", filterWrap).forEach(b => b.setAttribute("aria-pressed", String(b.dataset.cat === activeCat)));
    renderLib();
  }
  filterWrap.addEventListener("click", e => { const b = e.target.closest("button"); if (b) setCat(b.dataset.cat); });
  libSearch.addEventListener("input", renderLib);
  // chapter chips that jump to a filtered library
  document.addEventListener("click", e => {
    const a = e.target.closest("[data-lib]"); if (!a) return;
    libSearch.value = ""; setCat(a.dataset.lib);
  });
  renderLib();
  $("#resCount").textContent = RES.length;

  /* ---------- year ---------- */
  $("#year").textContent = new Date().getFullYear();
})();
