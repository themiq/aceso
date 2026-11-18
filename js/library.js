/* Resources page: grouped list with search, topic and free-only filters. */
(function () {
  "use strict";
  var CATS = window.ACESO_CATEGORIES, RES = window.ACESO_RESOURCES;
  var list = document.getElementById("libList");
  var search = document.getElementById("libSearch");
  var catSel = document.getElementById("libCat");
  var freeOnly = document.getElementById("libFree");
  var countEl = document.getElementById("libCount");
  if (!list || !CATS || !RES) return;

  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; });
  };
  var TAG_LABELS = { free: "free", app: "app", call: "phone", text: "text", chat: "chat", community: "community", "open-source": "open source", paid: "paid" };

  Object.keys(CATS).forEach(function (k) {
    var o = document.createElement("option");
    o.value = k; o.textContent = CATS[k].label;
    catSel.appendChild(o);
  });

  function render() {
    var q = search.value.trim().toLowerCase();
    var cat = catSel.value;
    var total = 0;
    var html = Object.keys(CATS).map(function (k) {
      if (cat !== "all" && cat !== k) return "";
      var items = RES.filter(function (r) {
        if (r[3] !== k) return false;
        if (freeOnly.checked && r[4].indexOf("free") === -1) return false;
        if (!q) return true;
        return (r[0] + " " + r[2] + " " + r[4].join(" ") + " " + CATS[k].label).toLowerCase().indexOf(q) !== -1;
      });
      if (!items.length) return "";
      total += items.length;
      return '<section class="lib-group" id="' + k + '"><h2>' + esc(CATS[k].label) + "</h2><p>" + esc(CATS[k].intro) + '</p><ul class="res-list">' +
        items.map(function (r) {
          var tags = r[4].map(function (t) { return '<span class="tag">' + esc(TAG_LABELS[t] || t) + "</span>"; }).join("");
          return '<li><a class="name" href="' + esc(r[1]) + '" target="_blank" rel="noopener noreferrer">' + esc(r[0]) + "</a><p>" + esc(r[2]) + "</p>" + (tags ? '<div class="res-meta">' + tags + "</div>" : "") + "</li>";
        }).join("") + "</ul></section>";
    }).join("");
    list.innerHTML = html || '<p class="empty">Nothing matches that. Try a different word, or clear the filters.</p>';
    countEl.textContent = total + (total === 1 ? " resource" : " resources");
  }

  function fromHash() {
    var h = decodeURIComponent(location.hash.replace("#", ""));
    if (CATS[h]) {
      catSel.value = h;
      render();
      var el = document.getElementById(h);
      if (el) el.scrollIntoView();
      return true;
    }
    return false;
  }

  search.addEventListener("input", render);
  freeOnly.addEventListener("change", render);
  catSel.addEventListener("change", function () {
    render();
    if (history.replaceState) history.replaceState(null, "", catSel.value === "all" ? location.pathname : "#" + catSel.value);
  });
  window.addEventListener("hashchange", fromHash);
  if (!fromHash()) render();
})();
