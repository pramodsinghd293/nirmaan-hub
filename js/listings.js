window.NH = window.NH || {};

NH.renderHome = function () {
  var cats = document.getElementById("home-cats");
  if (cats) {
    cats.innerHTML = NH.CATEGORIES.map(function (c) {
      return (
        '<a class="cat-tile" href="listings.html?city=' + NH.state.city + "&category=" + c.id + '">' +
          '<img src="' + c.image + '" alt="' + NH.escape(c.name) + '">' +
          "<div><h3>" + c.name + "</h3><p>" + c.blurb + "</p>" +
          '<span>' + NH.t("approxCost") + " " + NH.formatINR(c.costMin) + "–" + NH.formatINR(c.costMax) + NH.t("perSqft") +
          " · " + NH.t("duration") + " " + c.duration + "</span></div></a>"
      );
    }).join("");
  }

  var feat = document.getElementById("home-featured");
  if (feat) {
    var list = NH.buildersInCity(NH.state.city);
    if (list.length < 3) list = NH.BUILDERS.slice(0, 4);
    feat.innerHTML = list.slice(0, 4).map(function (b) { return NH.builderCard(b); }).join("");
  }

  var suggest = document.getElementById("home-suggest");
  if (suggest) {
    var city = NH.cityById(NH.state.city);
    var n = NH.buildersInCity(city.id).length;
    suggest.innerHTML =
      "<strong>" + NH.t("suggested") + " — " + city.name + "</strong>" +
      "<p>We found <b>" + n + "</b> listed builders. Most searches here are for house construction, renovation and turnkey villas. Approximate " +
      city.name + " build cost starts around " + NH.formatINR(1450 * city.multiplier) + NH.t("perSqft") + ".</p>";
  }

  var lead = document.getElementById("home-lead");
  if (lead) {
    lead.innerHTML = NH.leadFormHTML({ source: "home_sidebar", title: NH.t("getList") });
    NH.bindLeadForms();
  }
};

NH.renderListings = function () {
  var root = document.getElementById("listings-app");
  if (!root) return;

  var cityId = NH.qs("city") || NH.state.city;
  var categoryId = NH.qs("category") || "";
  var q = (NH.qs("q") || "").toLowerCase();
  if (NH.state.city !== cityId) NH.setCity(cityId, { silent: true });
  var catObj = categoryId ? NH.categoryById(categoryId) : null;

  var city = NH.cityById(cityId);
  var pills = NH.CATEGORIES.map(function (c) {
    return '<a class="pill' + (c.id === categoryId ? " on" : "") + '" href="listings.html?city=' + cityId + "&category=" + c.id + '">' + c.name + "</a>";
  }).join("") + NH.nearbyCities(cityId).map(function (c) {
    return '<a class="pill city" href="listings.html?city=' + c.id + '">' + c.name + "</a>";
  }).join("");

  var sideCats = NH.CATEGORIES.map(function (c) {
    return '<a class="side-cat' + (c.id === categoryId ? " on" : "") + '" href="listings.html?city=' + cityId + "&category=" + c.id + '">' +
      '<img src="' + c.image + '" alt=""><span>' + c.name + "</span></a>";
  }).join("");

  root.innerHTML =
    '<div class="crumbs">NirmaanHub › Construction Service › ' + (catObj ? catObj.name : "All") + " › " + city.name + "</div>" +
    '<div class="filter-bar">' +
      '<button class="chip on" type="button" data-sort="rating" data-i18n="topRated">Top rated</button>' +
      '<button class="chip" type="button" data-sort="years">Most experienced</button>' +
      '<button class="chip" type="button" data-filter="verified" data-i18n="verified">Verified</button>' +
      '<button class="chip" type="button" data-filter="topSearch" data-i18n="topSearch">Top Search</button>' +
      '<button class="chip" type="button" data-filter="gst">GST</button>' +
      '<span class="grow"></span>' +
      '<div class="view-toggle"><button type="button" data-view="list" class="on">' + NH.t("viewList") + '</button><button type="button" data-view="grid">' + NH.t("viewGrid") + "</button></div>" +
    "</div>" +
    '<div class="pill-row">' + pills + "</div>" +
    '<div class="listings-layout">' +
      '<aside class="side">' +
        "<h3 data-i18n=\"related\">Related category</h3>" +
        '<div class="side-cats">' + sideCats + "</div>" +
      "</aside>" +
      '<div>' +
        "<h1>" + NH.t("popularIn") + " " + city.name + "</h1>" +
        '<div id="listing-results"></div>' +
      "</div>" +
      '<aside class="side sticky-lead" id="listing-lead"></aside>' +
    "</div>";

  document.getElementById("listing-lead").innerHTML = NH.leadFormHTML({
    source: "listings_sidebar",
    extra: '<textarea name="requirement" rows="3" placeholder="' + NH.t("requirement") + '"></textarea>'
  });
  NH.bindLeadForms();
  NH.applyI18n();

  var state = { sort: "rating", verified: false, topSearch: false, gst: false, view: "list" };

  function draw() {
    var list = NH.buildersInCity(cityId, categoryId).filter(function (b) {
      if (q && (b.name + " " + b.services.join(" ") + " " + b.areas.join(" ")).toLowerCase().indexOf(q) === -1) return false;
      if (state.verified && !b.verified) return false;
      if (state.topSearch && !b.topSearch) return false;
      if (state.gst && !b.gst) return false;
      return true;
    });
    list.sort(function (a, b) {
      if (state.sort === "years") return b.years - a.years;
      if (state.sort === "rate") return a.rate - b.rate;
      return b.rating - a.rating;
    });
    var box = document.getElementById("listing-results");
    if (!list.length) {
      box.innerHTML = '<p class="empty">' + NH.t("noResults") + "</p>";
      return;
    }
    box.innerHTML = list.map(function (b) { return NH.builderCard(b, state.view); }).join("");
  }

  root.querySelector(".filter-bar").addEventListener("click", function (e) {
    var btn = e.target.closest("button");
    if (!btn) return;
    if (btn.dataset.sort) {
      state.sort = btn.dataset.sort;
      root.querySelectorAll("[data-sort]").forEach(function (x) { x.classList.toggle("on", x === btn); });
    }
    if (btn.dataset.filter) {
      state[btn.dataset.filter] = !state[btn.dataset.filter];
      btn.classList.toggle("on", state[btn.dataset.filter]);
    }
    if (btn.dataset.view) {
      state.view = btn.dataset.view;
      root.querySelectorAll("[data-view]").forEach(function (x) { x.classList.toggle("on", x === btn); });
    }
    draw();
  });

  draw();
};

NH.renderBuilder = function () {
  var root = document.getElementById("builder-app");
  if (!root) return;
  var b = NH.builderById(NH.qs("id"));
  if (!b) {
    root.innerHTML = "<p class=\"empty\">Builder not found. <a href=\"listings.html\">Back to listings</a></p>";
    return;
  }
  var views = NH.store.get(NH.KEYS.views, {});
  views[b.id] = (views[b.id] || 80 + (b.reviews % 40)) + 1;
  NH.store.set(NH.KEYS.views, views);
  var city = NH.cityById(b.city);
  var catNotes = b.categories.map(function (id) {
    var c = NH.categoryById(id);
    return c ? "<li><b>" + c.name + "</b> — " + NH.formatINR(c.costMin) + "–" + NH.formatINR(c.costMax) + NH.t("perSqft") + ", " + c.duration + "</li>" : "";
  }).join("");

  root.innerHTML =
    '<div class="crumbs"><a href="index.html">Home</a> › <a href="listings.html?city=' + b.city + '">' + city.name + "</a> › " + NH.escape(b.name) + "</div>" +
    '<article class="card builder-hero">' +
      '<img src="' + b.image + '" alt="">' +
      "<div>" +
        "<h1>" + NH.escape(b.name) + "</h1>" +
        NH.stars(b.rating) + " <span class=\"muted\">" + b.reviews + " ratings</span>" +
        "<p>📍 " + city.name + " — " + b.areas.join(", ") + "</p>" +
        '<p class="tags">' + b.services.map(function (s) { return "<span>" + NH.escape(s) + "</span>"; }).join("") + "</p>" +
        '<p class="price">' + NH.formatINR(b.rate) + "<small>" + NH.t("perSqft") + " starting</small></p>" +
        "<p>" + NH.escape(b.about) + "</p>" +
        '<p class="muted">' + b.years + " " + NH.t("years") + " · " + b.completed + " projects · " + b.durationNote + "</p>" +
        '<p class="muted">' + NH.t("profileViews") + ": " + views[b.id] + "</p>" +
        '<div class="card-actions">' +
          '<a class="btn btn-call" href="tel:' + b.phone + '">☎ ' + NH.t("showNumber") + " · " + b.phone + "</a>" +
          '<a class="btn btn-wa" target="_blank" rel="noopener" href="https://wa.me/' + b.whatsapp + '">' + NH.t("whatsapp") + "</a>" +
          '<a class="btn btn-primary" href="calculator.html">Open calculator</a>' +
        "</div>" +
      "</div>" +
    "</article>" +
    '<div class="two-col">' +
      "<section class=\"card\"><h2>Typical cost & duration</h2><ul class=\"plain\">" + catNotes + "</ul>" +
      "<div class=\"gallery\">" + b.gallery.map(function (g) { return '<img src="' + g + '" alt="">'; }).join("") + "</div></section>" +
      '<aside class="card">' + NH.leadFormHTML({
        source: "builder_profile",
        title: "Send enquiry to " + b.name,
        extra: '<input type="hidden" name="builderId" value="' + b.id + '"><textarea name="requirement" rows="4" placeholder="' + NH.t("requirement") + '"></textarea>'
      }) + "</aside>" +
    "</div>";
  NH.bindLeadForms();
};

document.addEventListener("DOMContentLoaded", function () {
  NH.renderHome();
  NH.renderListings();
  NH.renderBuilder();
});

document.addEventListener("nh:city", function () {
  NH.renderHome();
  if (document.getElementById("listings-app")) {
    var url = new URL(window.location.href);
    url.searchParams.set("city", NH.state.city);
    history.replaceState({}, "", url);
    NH.renderListings();
  }
});
document.addEventListener("nh:lang", function () {
  NH.renderHome();
  if (document.getElementById("listings-app")) NH.renderListings();
});
