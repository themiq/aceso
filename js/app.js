/* Aceso. No tracking. Anything saved stays in this browser. */
(function () {
  "use strict";
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  var root = document.documentElement;
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem("aceso:" + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem("aceso:" + k, JSON.stringify(v)); return true; } catch (e) { return false; } },
    del: function (k) { try { localStorage.removeItem("aceso:" + k); } catch (e) {} }
  };

  /* ---------- theme ---------- */
  var themeBtn = $("#themeToggle");
  function currentTheme() {
    if (root.dataset.theme) return root.dataset.theme;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  function paintTheme() {
    if (!themeBtn) return;
    var dark = currentTheme() === "dark";
    $(".theme-label", themeBtn).textContent = dark ? "Light" : "Dark";
    themeBtn.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
  }
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      store.set("theme", next);
      paintTheme();
    });
    paintTheme();
  }

  /* ---------- quick exit ---------- */
  function quickExit() { window.location.replace("https://www.google.com/search?q=weather+today"); }
  $$("[data-quick-exit]").forEach(function (b) { b.addEventListener("click", quickExit); });
  var escCount = 0, escTimer;
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    escCount++;
    clearTimeout(escTimer);
    escTimer = setTimeout(function () { escCount = 0; }, 1000);
    if (escCount >= 3) quickExit();
  });

  var yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- table of contents ---------- */
  var sections = $$("[data-section]");
  var tocLists = $$("[data-toc]");
  if (sections.length && tocLists.length) {
    tocLists.forEach(function (ol) {
      ol.innerHTML = sections.map(function (s) {
        return '<li><a href="#' + s.id + '">' + $("h2", s).textContent + "</a></li>";
      }).join("");
    });
    var inlineToc = $(".toc-inline");
    if (inlineToc) inlineToc.addEventListener("click", function (e) { if (e.target.closest("a")) inlineToc.open = false; });

    var sideLinks = $$(".toc-side a");
    function setActive(id) {
      sideLinks.forEach(function (a) { a.classList.toggle("active", a.getAttribute("href") === "#" + id); });
    }
    var ticking = false;
    function onScroll() {
      ticking = false;
      var current = sections[0].id;
      for (var i = 0; i < sections.length; i++) {
        if (sections[i].getBoundingClientRect().top <= 120) current = sections[i].id; else break;
      }
      setActive(current);
    }
    window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
    onScroll();
  }

  /* ---------- crisis lines by region ---------- */
  var regionSel = $("#region");
  if (regionSel) {
    var showRegion = function (r) {
      $$(".lines tbody tr").forEach(function (tr) {
        var regions = tr.getAttribute("data-region").split(" ");
        tr.hidden = !(r === "all" || regions.indexOf(r) !== -1);
      });
    };
    var savedRegion = store.get("region", "all");
    if (!$('option[value="' + savedRegion + '"]', regionSel)) savedRegion = "all";
    regionSel.value = savedRegion;
    showRegion(savedRegion);
    regionSel.addEventListener("change", function () { showRegion(regionSel.value); store.set("region", regionSel.value); });
  }

  /* ---------- breathing ---------- */
  var circle = $("#breatheCircle");
  if (circle) {
    var PATTERNS = {
      calm: [["Breathe in", 4, 1.3], ["Breathe out", 6, 0.75]],
      box: [["Breathe in", 4, 1.3], ["Hold", 4, 1.3], ["Breathe out", 4, 0.75], ["Hold", 4, 0.75]],
      "478": [["Breathe in", 4, 1.3], ["Hold", 7, 1.3], ["Breathe out slowly", 8, 0.75]]
    };
    var label = $("#breatheLabel"), count = $("#breatheCount"), startBtn = $("#breatheStart");
    var pattern = "calm", running = false, stepTimer = null, countTimer = null, rounds = 0;
    var stop = function () {
      running = false;
      clearTimeout(stepTimer); clearInterval(countTimer);
      circle.style.transitionDuration = "1s";
      circle.style.transform = "scale(0.75)";
      count.textContent = "";
      label.textContent = rounds ? "Stopped after " + rounds + (rounds === 1 ? " round" : " rounds") : "Press start when you're ready";
      startBtn.textContent = "Start";
    };
    var start = function () {
      running = true; rounds = 0; startBtn.textContent = "Stop";
      var steps = PATTERNS[pattern], i = 0;
      var next = function () {
        if (!running) return;
        var step = steps[i], left = step[1];
        label.textContent = step[0];
        circle.style.transitionDuration = step[1] + "s";
        circle.style.transform = "scale(" + step[2] + ")";
        count.textContent = left;
        clearInterval(countTimer);
        countTimer = setInterval(function () { left--; count.textContent = left > 0 ? left : ""; }, 1000);
        i = (i + 1) % steps.length;
        if (i === 0) rounds++;
        stepTimer = setTimeout(next, step[1] * 1000);
      };
      next();
    };
    startBtn.addEventListener("click", function () { if (running) stop(); else start(); });
    $$("[data-pattern]").forEach(function (b) {
      b.addEventListener("click", function () {
        pattern = b.getAttribute("data-pattern");
        $$("[data-pattern]").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
        if (running) { stop(); start(); }
      });
    });
  }

  /* ---------- 5-4-3-2-1 ---------- */
  var groundBox = $("#groundBox");
  if (groundBox) {
    var G = [
      [5, "things you can see", "Look around slowly. A colour, a shadow, a mark on the wall."],
      [4, "things you can feel", "Your feet on the floor, the fabric of your clothes, the chair under you, the air on your skin."],
      [3, "things you can hear", "Sounds far away, sounds nearby, your own breathing."],
      [2, "things you can smell", "If nothing's around, think of two smells you like."],
      [1, "thing you can taste", "Or one kind thing you can say to yourself."]
    ];
    var gi = 0;
    var renderGround = function () {
      if (gi >= G.length) {
        groundBox.innerHTML = '<p class="what">Done.</p><p class="hint">Take a slow breath and notice how you feel compared with a few minutes ago. Repeat it as often as you need.</p>';
        return;
      }
      var g = G[gi], ticks = "";
      for (var k = 0; k < g[0]; k++) ticks += '<button type="button" class="tick" aria-pressed="false" aria-label="Noticed ' + (k + 1) + " of " + g[0] + '"></button>';
      groundBox.innerHTML = '<div class="n">' + g[0] + '</div><p class="what">' + g[1] + '</p><p class="hint">' + g[2] + '</p><div class="ticks">' + ticks + "</div>";
      $$(".tick", groundBox).forEach(function (t) {
        t.addEventListener("click", function () {
          t.setAttribute("aria-pressed", String(t.getAttribute("aria-pressed") !== "true"));
          if ($$('.tick[aria-pressed="true"]', groundBox).length === g[0]) setTimeout(function () { gi++; renderGround(); }, 400);
        });
      });
    };
    $("#groundNext").addEventListener("click", function () { gi = Math.min(G.length, gi + 1); renderGround(); });
    $("#groundReset").addEventListener("click", function () { gi = 0; renderGround(); });
    renderGround();
  }

  /* ---------- safety plan ---------- */
  var planForm = $("#planForm");
  if (planForm) {
    var fields = $$("textarea", planForm), savedMsg = $("#planSaved");
    var plan = store.get("plan", {}) || {};
    fields.forEach(function (t) { if (plan[t.name]) t.value = plan[t.name]; });
    var saveTimer;
    planForm.addEventListener("input", function () {
      clearTimeout(saveTimer);
      saveTimer = setTimeout(function () {
        var data = {};
        fields.forEach(function (t) { data[t.name] = t.value; });
        savedMsg.textContent = store.set("plan", data) ? "Saved in this browser." : "This browser won't let me save. Print or download it instead.";
      }, 400);
    });
    $("#planPrint").addEventListener("click", function () {
      document.body.classList.add("printing-plan");
      window.print();
      setTimeout(function () { document.body.classList.remove("printing-plan"); }, 500);
    });
    $("#planDownload").addEventListener("click", function () {
      var text = "My plan for bad days\n\n" + fields.map(function (t) {
        return $('label[for="' + t.id + '"]', planForm).textContent + "\n" + (t.value.trim() || "-") + "\n";
      }).join("\n") + "\nCrisis lines worldwide: https://findahelpline.com\n";
      var blob = new Blob([text], { type: "text/plain" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "my-plan-for-bad-days.txt";
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
    });
    $("#planClear").addEventListener("click", function () {
      if (!window.confirm("Clear everything in your plan from this browser?")) return;
      fields.forEach(function (t) { t.value = ""; });
      store.del("plan");
      savedMsg.textContent = "Cleared.";
    });
  }
})();
