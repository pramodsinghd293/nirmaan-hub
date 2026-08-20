window.NH = window.NH || {};

NH.KEYS = {
  city: "nh_city",
  lang: "nh_lang",
  user: "nh_user",
  users: "nh_users",
  leads: "nh_leads",
  companies: "nh_companies",
  agents: "nh_agents",
  estimates: "nh_estimates",
  banner: "nh_banner_closed",
  views: "nh_views",
  revealed: "nh_phones"
};

NH.state = {
  city: "bhopal",
  lang: "en",
  user: null,
  bannerIndex: 0
};

NH.store = {
  get: function (key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      if (raw === null || raw === undefined) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  },
  set: function (key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  push: function (key, item) {
    var list = NH.store.get(key, []);
    list.unshift(item);
    NH.store.set(key, list);
    return list;
  }
};

NH.qs = function (name) {
  return new URLSearchParams(window.location.search).get(name);
};

NH.toast = function (msg, type) {
  var el = document.getElementById("nh-toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "nh-toast";
    document.body.appendChild(el);
  }
  el.className = "nh-toast " + (type || "ok");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(NH._toastTimer);
  NH._toastTimer = setTimeout(function () { el.classList.remove("show"); }, 3200);
};

NH.escape = function (s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
};

NH.mailtoBody = function (subject, fields) {
  var lines = Object.keys(fields).map(function (k) {
    return k + ": " + fields[k];
  });
  return "mailto:" + NH.SUPPORT_EMAIL +
    "?subject=" + encodeURIComponent(subject) +
    "&body=" + encodeURIComponent(lines.join("\n"));
};

NH.sendToSupport = function (subject, payload) {
  var record = Object.assign({
    id: "nh_" + Date.now(),
    subject: subject,
    createdAt: new Date().toISOString(),
    city: NH.state.city,
    lang: NH.state.lang
  }, payload);
  NH.store.push(NH.KEYS.leads, record);

  var fields = {};
  Object.keys(record).forEach(function (k) {
    if (typeof record[k] !== "object") fields[k] = record[k];
    else fields[k] = JSON.stringify(record[k]);
  });

  return fetch("https://formsubmit.co/ajax/" + NH.SUPPORT_EMAIL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(Object.assign({ _subject: subject, _template: "table" }, fields))
  }).then(function (res) {
    if (!res.ok) throw new Error("mail");
    NH.toast(NH.t("sent"), "ok");
    return record;
  }).catch(function () {
    window.location.href = NH.mailtoBody(subject, fields);
    NH.toast(NH.t("saved") + " · " + NH.t("shareEmail"), "ok");
    return record;
  });
};

NH.applyI18n = function () {
  document.querySelectorAll("[data-i18n]").forEach(function (el) {
    el.textContent = NH.t(el.getAttribute("data-i18n"));
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
    el.setAttribute("placeholder", NH.t(el.getAttribute("data-i18n-placeholder")));
  });
  document.documentElement.lang = NH.state.lang === "en" ? "en" : NH.state.lang;
};

NH.setLang = function (id) {
  NH.state.lang = id;
  NH.store.set(NH.KEYS.lang, id);
  NH.applyI18n();
  NH.renderChrome();
  document.dispatchEvent(new CustomEvent("nh:lang"));
};

NH.setCity = function (id, opts) {
  var city = NH.cityById(id);
  var changed = NH.state.city !== city.id;
  NH.state.city = city.id;
  NH.store.set(NH.KEYS.city, city.id);
  NH.renderChrome();
  if (changed) document.dispatchEvent(new CustomEvent("nh:city", { detail: city }));
  if (!opts || !opts.silent) {
    NH.toast(NH.t("suggested") + ": " + city.name + ", " + city.state, "ok");
  }
};

NH.distanceKm = function (a, b) {
  var R = 6371;
  var dLat = (b.lat - a.lat) * Math.PI / 180;
  var dLng = (b.lng - a.lng) * Math.PI / 180;
  var x = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(a.lat * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return 2 * R * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
};

NH.nearestCity = function (lat, lng) {
  var best = NH.CITIES[0];
  var bestD = Infinity;
  NH.CITIES.forEach(function (c) {
    var d = NH.distanceKm({ lat: lat, lng: lng }, c);
    if (d < bestD) { bestD = d; best = c; }
  });
  return best;
};

NH.detectCity = function () {
  NH.toast(NH.t("detect") + "…", "ok");
  var finish = function (city, source) {
    NH.setCity(city.id);
    var n = NH.buildersInCity(city.id).length;
    var cats = {};
    NH.buildersInCity(city.id).forEach(function (b) {
      b.categories.forEach(function (c) { cats[c] = true; });
    });
    var suggestion = Object.keys(cats)[0] || "residential";
    var cat = NH.categoryById(suggestion);
    NH.toast(
      city.name + " · " + n + " builders · " + (cat ? cat.name : "House Construction"),
      "ok"
    );
    return { city: city, source: source, suggestCategory: suggestion };
  };

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (pos) {
      finish(NH.nearestCity(pos.coords.latitude, pos.coords.longitude), "gps");
    }, function () {
      NH.detectCityByIp();
    }, { enableHighAccuracy: false, timeout: 6000, maximumAge: 300000 });
  } else {
    NH.detectCityByIp();
  }
};

NH.detectCityByIp = function () {
  fetch("https://ipapi.co/json/")
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var match = NH.CITIES.find(function (c) {
        return data.city && c.name.toLowerCase() === String(data.city).toLowerCase();
      });
      if (!match && data.latitude && data.longitude) {
        match = NH.nearestCity(data.latitude, data.longitude);
      }
      NH.setCity((match || NH.cityById("bhopal")).id);
    })
    .catch(function () {
      NH.setCity("bhopal");
    });
};

NH.currentUser = function () {
  return NH.store.get(NH.KEYS.user, null);
};

NH.requireUser = function () {
  var u = NH.currentUser();
  if (u) return u;
  NH.openModal("login");
  NH.toast(NH.t("needLogin"), "warn");
  return null;
};

NH.headerHTML = function () {
  var city = NH.cityById(NH.state.city);
  var user = NH.currentUser();
  var langs = NH.LANGS.map(function (l) {
    return '<option value="' + l.id + '"' + (l.id === NH.state.lang ? " selected" : "") + ">" + l.native + "</option>";
  }).join("");
  var cities = NH.CITIES.map(function (c) {
    return '<option value="' + c.id + '"' + (c.id === city.id ? " selected" : "") + ">" + c.name + "</option>";
  }).join("");

  return (
    '<div class="announce" id="announce-bar">' +
      '<div class="announce-track" id="announce-text"></div>' +
      '<a class="announce-cta" href="list-business.html" data-i18n="announcementCta">List now</a>' +
      '<button class="announce-close" type="button" aria-label="Close banner">×</button>' +
    "</div>" +
    '<header class="site-header">' +
      '<div class="header-inner">' +
        '<a class="logo" href="index.html">' +
          '<img src="images/logo-icon.png" alt="" width="40" height="40">' +
          "<div><strong>NirmaanHub</strong><span data-i18n=\"brandTag\">Find trusted local builders</span></div>" +
        "</a>" +
        '<form class="mega-search" id="mega-search">' +
          '<label class="sr-only" for="search-city">' + NH.t("searchCity") + "</label>" +
          '<div class="search-city">' +
            '<button type="button" class="ghost-pin" id="detect-btn" title="' + NH.t("detect") + '">📍</button>' +
            '<select id="search-city" name="city">' + cities + "</select>" +
          "</div>" +
          '<input id="search-q" name="q" type="search" data-i18n-placeholder="searchService" placeholder="Search builders, services…">' +
          '<button class="btn btn-primary search-go" type="submit" data-i18n="searchBtn">Search</button>' +
        "</form>" +
        '<nav class="header-actions">' +
          '<label class="lang-wrap"><span class="sr-only">Language</span>' +
            '<select id="lang-select">' + langs + "</select>" +
          "</label>" +
          '<a class="text-link hide-sm" href="become-agent.html" data-i18n="becomeAgent">Become an agent</a>' +
          '<a class="btn btn-outline hide-sm" href="list-business.html" data-i18n="freeListing">List your business</a>' +
          (user
            ? '<button class="btn btn-navy" type="button" id="logout-btn">' + (user.name || user.mobile) + " · " + NH.t("logout") + "</button>"
            : '<button class="btn btn-navy" type="button" id="login-btn" data-i18n="login">Login / Sign up</button>') +
          '<button class="menu-toggle" type="button" id="menu-toggle" aria-label="Menu">☰</button>' +
        "</nav>" +
      "</div>" +
      '<div class="subnav">' +
        '<a href="index.html" data-i18n="home">Home</a>' +
        '<a href="listings.html" data-i18n="listings">Find builders</a>' +
        '<a href="calculator.html" data-i18n="calculator">Cost calculator</a>' +
        '<a href="about.html" data-i18n="about">About us</a>' +
        '<a href="contact.html" data-i18n="contact">Contact</a>' +
        '<a href="register.html" data-i18n="login">Login / Sign up</a>' +
      "</div>" +
    "</header>"
  );
};

NH.footerHTML = function () {
  var year = new Date().getFullYear();
  return (
    '<footer class="site-footer">' +
      '<div class="footer-grid">' +
        "<div><a class=\"logo light\" href=\"index.html\"><img src=\"images/logo-icon.png\" alt=\"\" width=\"36\" height=\"36\"><strong>NirmaanHub</strong></a>" +
        '<p data-i18n="footerAbout">NirmaanHub connects homeowners with verified local construction companies.</p></div>' +
        "<div><h4>Explore</h4><a href=\"listings.html\" data-i18n=\"listings\">Find builders</a><a href=\"calculator.html\" data-i18n=\"calculator\">Cost calculator</a><a href=\"list-business.html\" data-i18n=\"companyReg\">Register company</a><a href=\"become-agent.html\" data-i18n=\"becomeAgent\">Become an agent</a></div>" +
        "<div><h4 data-i18n=\"about\">About us</h4><a href=\"about.html\" data-i18n=\"about\">About us</a><a href=\"contact.html\" data-i18n=\"contact\">Contact</a><a href=\"register.html\" data-i18n=\"registerTitle\">Create account</a></div>" +
        "<div><h4 data-i18n=\"allQueries\">All queries</h4>" +
        '<a href="mailto:' + NH.SUPPORT_EMAIL + '">' + NH.SUPPORT_EMAIL + "</a>" +
        '<a href="tel:' + NH.SUPPORT_PHONE.replace(/\s/g, "") + '">' + NH.SUPPORT_PHONE + "</a>" +
        '<p class="tiny">Every form on this site is stored on your device and emailed to this desk.</p></div>' +
      "</div>" +
      '<div class="footer-bottom"><span>© ' + year + " NirmaanHub. " + NH.t("rights") + "</span><span>" + NH.SUPPORT_EMAIL + "</span></div>" +
    "</footer>" +
    '<aside class="rail">' +
      '<a class="rail-ad" href="list-business.html">Advertise</a>' +
      '<a class="rail-list" href="list-business.html">+ Add your business</a>' +
    "</aside>"
  );
};

NH.modalsHTML = function () {
  return (
    '<div class="overlay" id="overlay" hidden></div>' +
    '<div class="modal" id="modal-login" hidden role="dialog" aria-labelledby="login-title">' +
      '<button class="modal-x" type="button" data-close>×</button>' +
      '<h2 id="login-title" data-i18n="otpTitle">Login to get an instant callback</h2>' +
      '<p class="muted" data-i18n="otpHint">We’ll save your account in this browser.</p>' +
      '<form id="otp-form">' +
        '<label>' + NH.t("name") + '<input name="name" required maxlength="80" placeholder="Your name"></label>' +
        '<div class="mobile-row"><span>+91</span><input name="mobile" required inputmode="numeric" pattern="[6-9][0-9]{9}" maxlength="10" placeholder="Enter your Mobile"></div>' +
        '<button class="btn btn-teal full" type="submit" data-i18n="getOtp">Get OTP</button>' +
      "</form>" +
      '<form id="otp-verify" hidden>' +
        '<p class="demo-otp" id="demo-otp"></p>' +
        '<input name="otp" required inputmode="numeric" maxlength="6" placeholder="6-digit OTP">' +
        '<button class="btn btn-teal full" type="submit" data-i18n="verify">Verify & continue</button>' +
      "</form>" +
      '<p class="muted italic" data-i18n="almost">Almost done — verify your mobile.</p>' +
    "</div>" +
    '<div class="modal" id="modal-city" hidden role="dialog">' +
      '<button class="modal-x" type="button" data-close>×</button>' +
      '<h2 data-i18n="changeCity">Change city</h2>' +
      '<button class="btn btn-outline full" type="button" id="modal-detect" data-i18n="detect">Detect my city</button>' +
      '<div class="city-grid" id="city-grid"></div>' +
    "</div>"
  );
};

NH.renderChrome = function () {
  var mountH = document.getElementById("site-header");
  var mountF = document.getElementById("site-footer");
  if (mountH) mountH.innerHTML = NH.headerHTML();
  if (mountF) mountF.innerHTML = NH.footerHTML();
  if (!document.getElementById("modal-login")) {
    var wrap = document.createElement("div");
    wrap.innerHTML = NH.modalsHTML();
    document.body.appendChild(wrap);
  }
  NH.bindChrome();
  NH.applyI18n();
  NH.rotateBanner();
  if (NH.store.get(NH.KEYS.banner, false)) {
    var bar = document.getElementById("announce-bar");
    if (bar) bar.hidden = true;
  }
};

NH.rotateBanner = function () {
  var el = document.getElementById("announce-text");
  if (!el) return;
  var i = NH.state.bannerIndex % NH.ANNOUNCEMENTS.length;
  el.textContent = NH.ANNOUNCEMENTS[i];
};

NH.openModal = function (name) {
  document.getElementById("overlay").hidden = false;
  document.querySelectorAll(".modal").forEach(function (m) { m.hidden = true; });
  var m = document.getElementById("modal-" + name);
  if (m) m.hidden = false;
  document.body.classList.add("lock");
};

NH.closeModals = function () {
  document.getElementById("overlay").hidden = true;
  document.querySelectorAll(".modal").forEach(function (m) { m.hidden = true; });
  document.body.classList.remove("lock");
};

NH.bindChrome = function () {
  var citySel = document.getElementById("search-city");
  if (citySel) citySel.value = NH.state.city;
  var langSel = document.getElementById("lang-select");
  if (langSel) langSel.value = NH.state.lang;

  var search = document.getElementById("mega-search");
  if (search) {
    search.onsubmit = function (e) {
      e.preventDefault();
      var city = document.getElementById("search-city").value;
      var q = document.getElementById("search-q").value.trim();
      NH.setCity(city, { silent: true });
      var url = "listings.html?city=" + encodeURIComponent(city);
      if (q) url += "&q=" + encodeURIComponent(q);
      window.location.href = url;
    };
  }

  var detect = document.getElementById("detect-btn");
  if (detect) detect.onclick = function () { NH.detectCity(); };

  if (citySel) {
    citySel.onchange = function () { NH.setCity(citySel.value); };
  }
  if (langSel) {
    langSel.onchange = function () { NH.setLang(langSel.value); };
  }

  var loginBtn = document.getElementById("login-btn");
  if (loginBtn) loginBtn.onclick = function () { NH.openModal("login"); };
  var logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.onclick = function () {
      NH.store.set(NH.KEYS.user, null);
      NH.state.user = null;
      NH.renderChrome();
      NH.toast(NH.t("logout"), "ok");
    };
  }

  var overlay = document.getElementById("overlay");
  if (overlay) overlay.onclick = NH.closeModals;
  document.querySelectorAll("[data-close]").forEach(function (btn) {
    btn.onclick = NH.closeModals;
  });

  var otpForm = document.getElementById("otp-form");
  if (otpForm) {
    otpForm.onsubmit = function (e) {
      e.preventDefault();
      var fd = new FormData(otpForm);
      var mobile = String(fd.get("mobile"));
      var name = String(fd.get("name")).trim();
      var otp = String(Math.floor(100000 + Math.random() * 900000));
      sessionStorage.setItem("nh_pending_otp", JSON.stringify({ mobile: mobile, name: name, otp: otp }));
      document.getElementById("otp-verify").hidden = false;
      document.getElementById("demo-otp").textContent = NH.t("demoOtp") + ": " + otp;
    };
  }
  var otpVerify = document.getElementById("otp-verify");
  if (otpVerify) {
    otpVerify.onsubmit = function (e) {
      e.preventDefault();
      var pending = JSON.parse(sessionStorage.getItem("nh_pending_otp") || "null");
      var entered = new FormData(otpVerify).get("otp");
      if (!pending || entered !== pending.otp) {
        NH.toast("Incorrect OTP", "warn");
        return;
      }
      var users = NH.store.get(NH.KEYS.users, []);
      var existing = users.find(function (u) { return u.mobile === pending.mobile; });
      var user = existing || {
        id: "u_" + Date.now(),
        name: pending.name,
        mobile: pending.mobile,
        city: NH.state.city,
        createdAt: new Date().toISOString()
      };
      user.name = pending.name || user.name;
      if (!existing) users.push(user);
      NH.store.set(NH.KEYS.users, users);
      NH.store.set(NH.KEYS.user, user);
      NH.state.user = user;
      sessionStorage.removeItem("nh_pending_otp");
      NH.closeModals();
      NH.renderChrome();
      NH.sendToSupport("New user registration — NirmaanHub", {
        type: "user_register",
        name: user.name,
        mobile: user.mobile,
        city: user.city
      });
      NH.toast("Welcome, " + user.name, "ok");
    };
  }

  var closeBanner = document.querySelector(".announce-close");
  if (closeBanner) {
    closeBanner.onclick = function () {
      NH.store.set(NH.KEYS.banner, true);
      document.getElementById("announce-bar").hidden = true;
    };
  }

  var menu = document.getElementById("menu-toggle");
  if (menu) {
    menu.onclick = function () {
      document.querySelector(".site-header").classList.toggle("open");
    };
  }

  var cityGrid = document.getElementById("city-grid");
  if (cityGrid) {
    cityGrid.innerHTML = NH.CITIES.map(function (c) {
      return '<button type="button" class="city-chip" data-city="' + c.id + '">' + c.name + "<small>" + c.state + "</small></button>";
    }).join("");
    cityGrid.onclick = function (e) {
      var btn = e.target.closest("[data-city]");
      if (!btn) return;
      NH.setCity(btn.getAttribute("data-city"));
      NH.closeModals();
    };
  }
  var modalDetect = document.getElementById("modal-detect");
  if (modalDetect) modalDetect.onclick = function () { NH.detectCity(); NH.closeModals(); };
};

NH.stars = function (n) {
  var full = Math.round(n);
  var s = "";
  for (var i = 0; i < 5; i++) s += i < full ? "★" : "☆";
  return '<span class="stars">' + s + " " + n.toFixed(1) + "</span>";
};

NH.leadFormHTML = function (opts) {
  opts = opts || {};
  return (
    '<form class="lead-form" data-lead="' + NH.escape(opts.source || "sidebar") + '">' +
      (opts.title ? "<h3>" + NH.escape(opts.title) + "</h3>" : "<h3 data-i18n=\"getList\">" + NH.t("getList") + "</h3>") +
      '<label class="radio"><input type="radio" name="projectType" value="new" checked> <span data-i18n="newProject">' + NH.t("newProject") + "</span></label>" +
      '<label class="radio"><input type="radio" name="projectType" value="renovation"> <span data-i18n="renoProject">' + NH.t("renoProject") + "</span></label>" +
      '<input name="name" required maxlength="80" data-i18n-placeholder="name" placeholder="' + NH.t("name") + '">' +
      '<div class="mobile-row"><span>+91</span><input name="mobile" required inputmode="numeric" pattern="[6-9][0-9]{9}" maxlength="10" data-i18n-placeholder="mobile" placeholder="' + NH.t("mobile") + '"></div>' +
      (opts.extra || "") +
      '<button class="btn btn-primary full" type="submit" data-i18n="submitLead">' + NH.t("submitLead") + "</button>" +
      '<p class="tiny">Routed to ' + NH.SUPPORT_EMAIL + "</p>" +
    "</form>"
  );
};

NH.bindLeadForms = function () {
  document.querySelectorAll("form.lead-form, form.page-form").forEach(function (form) {
    if (form.getAttribute("data-bound")) return;
    form.setAttribute("data-bound", "1");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var fd = new FormData(form);
      var data = {};
      fd.forEach(function (v, k) { data[k] = v; });
      data.type = form.getAttribute("data-lead") || form.getAttribute("data-form") || "enquiry";
      data.builder = form.getAttribute("data-builder") || "";
      NH.sendToSupport("NirmaanHub enquiry — " + data.type, data).then(function () {
        form.reset();
      });
    });
  });
};

NH.builderCard = function (b, view) {
  var city = NH.cityById(b.city);
  var cat = NH.categoryById(b.categories[0]);
  var badges = "";
  if (b.verified) badges += '<span class="badge ok">' + NH.t("verified") + "</span>";
  if (b.topSearch) badges += '<span class="badge gold">' + NH.t("topSearch") + "</span>";
  if (b.gst) badges += '<span class="badge">GST</span>';
  var actions =
    '<a class="btn btn-call" href="tel:' + b.phone + '">☎ ' + NH.t("callNow") + "</a>" +
    '<a class="btn btn-wa" target="_blank" rel="noopener" href="https://wa.me/' + b.whatsapp + '?text=' + encodeURIComponent("Hi, I found " + b.name + " on NirmaanHub") + '">' + NH.t("whatsapp") + "</a>" +
    '<button class="btn btn-primary" type="button" data-enquire="' + b.id + '">' + NH.t("bestPrice") + "</button>";

  if (view === "grid") {
    return (
      '<article class="card builder-card grid">' +
        '<a href="builder.html?id=' + b.id + '"><img src="' + b.image + '" alt="' + NH.escape(b.name) + '"></a>' +
        "<div><h3><a href=\"builder.html?id=" + b.id + "\">" + NH.escape(b.name) + "</a></h3>" +
        NH.stars(b.rating) + " <span class=\"muted\">(" + b.reviews + ")</span>" +
        "<div class=\"meta\">" + badges + "</div>" +
        "<p class=\"muted\">" + city.name + " · " + b.years + " " + NH.t("years") + "</p>" +
        "<p class=\"price\">" + NH.formatINR(b.rate) + NH.t("perSqft") + "</p>" +
        "<div class=\"card-actions stacked\">" + actions + "</div></div></article>"
    );
  }

  return (
    '<article class="card builder-card">' +
      '<a class="thumb" href="builder.html?id=' + b.id + '"><img src="' + b.image + '" alt="' + NH.escape(b.name) + '"></a>' +
      '<div class="card-body">' +
        '<p class="eyebrow">' + (cat ? cat.name : "Construction") + "</p>" +
        "<h3><a href=\"builder.html?id=" + b.id + "\">" + NH.escape(b.name) + "</a></h3>" +
        '<div class="meta">' + NH.stars(b.rating) + " <span class=\"muted\">" + b.reviews + " ratings</span> " + badges + "</div>" +
        "<p class=\"muted\">📍 " + city.name + " · " + b.areas.slice(0, 2).join(", ") + " · " + b.years + " " + NH.t("years") + "</p>" +
        '<p class="tags">' + b.services.map(function (s) { return "<span>" + NH.escape(s) + "</span>"; }).join("") + "</p>" +
        '<p class="quote">' + NH.escape(b.response) + "</p>" +
        "<p class=\"price\">" + NH.formatINR(b.rate) + "<small>" + NH.t("perSqft") + "</small></p>" +
      "</div>" +
      '<div class="card-actions">' + actions + "</div>" +
    "</article>"
  );
};

NH.init = function () {
  NH.state.lang = NH.store.get(NH.KEYS.lang, "en") || "en";
  NH.state.city = NH.qs("city") || NH.store.get(NH.KEYS.city, null) || "bhopal";
  NH.state.user = NH.currentUser();
  NH.renderChrome();

  setInterval(function () {
    NH.state.bannerIndex += 1;
    NH.rotateBanner();
  }, 7000);

  if (!NH.store.get(NH.KEYS.city, null) && !NH.qs("city")) {
    setTimeout(function () { NH.detectCityByIp(); }, 400);
  }

  document.addEventListener("click", function (e) {
    if (e.target.closest("[data-close]")) {
      NH.closeModals();
      return;
    }
    var btn = e.target.closest("[data-enquire]");
    if (!btn) return;
    if (!NH.requireUser()) return;
    var id = btn.getAttribute("data-enquire");
    var b = NH.builderById(id);
    var name = NH.currentUser().name;
    var mobile = NH.currentUser().mobile;
    NH.sendToSupport("Get best price — " + (b ? b.name : id), {
      type: "best_price",
      builder: b ? b.name : id,
      builderId: id,
      name: name,
      mobile: mobile
    });
  });

  NH.bindLeadForms();
};

document.addEventListener("DOMContentLoaded", NH.init);
