window.NH = window.NH || {};

NH.calcEstimate = function (input) {
  var city = NH.cityById(input.city);
  var pack = NH.PACKAGES.find(function (p) { return p.id === input.packageId; }) || NH.PACKAGES[1];
  var sqft = Math.max(200, Number(input.sqft) || 1000);
  var floors = Math.max(1, Number(input.floors) || 1);
  var built = sqft * floors;
  var base = pack.rate * city.multiplier * built;

  var addons = [];
  var addonTotal = 0;
  (input.addons || []).forEach(function (id) {
    var a = NH.ADDONS.find(function (x) { return x.id === id; });
    if (!a) return;
    var amt = a.type === "perSqft" ? a.amount * built : a.amount;
    addons.push({ name: a.name, amount: amt, hint: a.hint });
    addonTotal += amt;
  });

  var contingency = Math.round((base + addonTotal) * 0.07);
  var gst = Math.round((base + addonTotal + contingency) * 0.18);
  var total = Math.round(base + addonTotal + contingency + gst);
  var months = Math.max(4, Math.round(pack.monthsPer1000 * (built / 1000) * (0.85 + floors * 0.08)));
  var monthly = Math.round(total / months);

  return {
    city: city,
    pack: pack,
    sqft: sqft,
    floors: floors,
    built: built,
    base: Math.round(base),
    addons: addons,
    addonTotal: Math.round(addonTotal),
    contingency: contingency,
    gst: gst,
    total: total,
    months: months,
    monthly: monthly,
    effective: Math.round(total / built),
    design: input.design || pack.name,
    notes: input.notes || ""
  };
};

NH.renderCalculator = function () {
  var root = document.getElementById("calculator-app");
  if (!root) return;

  var saved = NH.store.get(NH.KEYS.estimates, [])[0] || {};
  var cityOpts = NH.CITIES.map(function (c) {
    var sel = (saved.city || NH.state.city) === c.id ? " selected" : "";
    return '<option value="' + c.id + '"' + sel + ">" + c.name + " (" + c.state + ")</option>";
  }).join("");

  var packs = NH.PACKAGES.map(function (p) {
    return (
      '<label class="pack-card' + (p.popular ? " popular" : "") + '">' +
        '<input type="radio" name="packageId" value="' + p.id + '"' + (p.id === (saved.packageId || "standard") ? " checked" : "") + ">" +
        "<strong>" + p.name + "</strong>" +
        "<span>" + p.tagline + "</span>" +
        '<em>' + NH.formatINR(p.rate) + NH.t("perSqft") + " base</em>" +
      "</label>"
    );
  }).join("");

  var addons = NH.ADDONS.map(function (a) {
    var checked = (saved.addons || []).indexOf(a.id) !== -1 ? " checked" : "";
    return (
      '<label class="addon">' +
        '<input type="checkbox" name="addons" value="' + a.id + '"' + checked + ">" +
        "<span><b>" + a.name + "</b><small>" + a.hint + " · " +
        (a.type === "perSqft" ? NH.formatINR(a.amount) + NH.t("perSqft") : NH.formatINR(a.amount)) +
        "</small></span></label>"
    );
  }).join("");

  root.innerHTML =
    '<form id="calc-form" class="calc-grid">' +
      '<section class="card calc-inputs">' +
        "<h2 data-i18n=\"calculator\">Cost calculator</h2>" +
        "<p class=\"muted\">City rates, design package, built-up area and add-ons. Figures are indicative — a builder’s BOQ will differ.</p>" +
        '<label>' + NH.t("searchCity") + '<select name="city">' + cityOpts + "</select></label>" +
        '<label>' + NH.t("design") +
          '<select name="design">' +
            '<option>Independent house / duplex</option>' +
            '<option>G+1 with rental floor</option>' +
            '<option>Villa with compound</option>' +
            '<option>Commercial G+2</option>' +
            '<option>Interior-only fit-out</option>' +
            '<option>Renovation of existing home</option>' +
          "</select></label>" +
        '<div class="two">' +
          '<label>' + NH.t("builtup") + '<input name="sqft" type="number" min="200" max="20000" step="50" value="' + (saved.sqft || 1200) + '"></label>' +
          '<label>' + NH.t("floors") + '<input name="floors" type="number" min="1" max="5" value="' + (saved.floors || 1) + '"></label>' +
        "</div>" +
        '<p class="label">' + NH.t("design") + " package</p>" +
        '<div class="pack-row">' + packs + "</div>" +
        '<p class="label">' + NH.t("addons") + "</p>" +
        '<div class="addon-grid">' + addons + "</div>" +
        '<label>Notes / inclusions you care about<textarea name="notes" rows="3" placeholder="Vastu, parking, rental floor, timeline…">' + (saved.notes || "") + "</textarea></label>" +
        '<div class="row-actions">' +
          '<button class="btn btn-primary" type="submit">Calculate</button>' +
          '<button class="btn btn-outline" type="button" id="save-est" data-i18n="saveEstimate">Save estimate</button>' +
          '<button class="btn btn-navy" type="button" id="print-est" data-i18n="print">Print / PDF</button>' +
        "</div>" +
      "</section>" +
      '<aside class="card calc-out" id="calc-out"></aside>' +
    "</form>";

  var form = document.getElementById("calc-form");
  var run = function () {
    var fd = new FormData(form);
    var addonsSel = [];
    form.querySelectorAll('input[name="addons"]:checked').forEach(function (c) { addonsSel.push(c.value); });
    var input = {
      city: fd.get("city"),
      packageId: fd.get("packageId"),
      sqft: fd.get("sqft"),
      floors: fd.get("floors"),
      design: fd.get("design"),
      notes: fd.get("notes"),
      addons: addonsSel
    };
    var est = NH.calcEstimate(input);
    est.input = input;
    NH._lastEstimate = est;
    NH.paintEstimate(est);
    return est;
  };

  form.addEventListener("submit", function (e) { e.preventDefault(); run(); });
  form.addEventListener("change", run);
  document.getElementById("save-est").onclick = function () {
    var est = run();
    var user = NH.currentUser();
    NH.store.push(NH.KEYS.estimates, {
      savedAt: new Date().toISOString(),
      user: user ? user.mobile : "guest",
      city: est.input.city,
      packageId: est.input.packageId,
      sqft: est.input.sqft,
      floors: est.input.floors,
      addons: est.input.addons,
      notes: est.input.notes,
      total: est.total
    });
    NH.toast(NH.t("saved"), "ok");
  };
  document.getElementById("print-est").onclick = function () {
    run();
    window.print();
  };
  run();
};

NH.paintEstimate = function (est) {
  var el = document.getElementById("calc-out");
  if (!el) return;
  var addonRows = est.addons.map(function (a) {
    return "<li><span>" + NH.escape(a.name) + "</span><strong>" + NH.formatINR(a.amount) + "</strong></li>";
  }).join("") || "<li class=\"muted\">No add-ons selected</li>";

  var inc = est.pack.includes.map(function (x) { return "<li>" + NH.escape(x) + "</li>"; }).join("");
  var exc = est.pack.excludes.map(function (x) { return "<li>" + NH.escape(x) + "</li>"; }).join("");

  el.innerHTML =
    '<p class="eyebrow" data-i18n="estimate">Your estimate</p>' +
    "<h2>" + NH.formatINR(est.total) + "</h2>" +
    '<p class="muted">' + est.city.name + " · " + est.pack.name + " · " + est.design + "</p>" +
    '<div class="stat-row">' +
      "<div><b>" + NH.formatINR(est.effective) + "</b><span>Effective" + NH.t("perSqft") + "</span></div>" +
      "<div><b>" + est.months + " mo</b><span>" + NH.t("duration") + "</span></div>" +
      "<div><b>" + NH.formatINR(est.monthly) + "</b><span>" + NH.t("monthly") + "</span></div>" +
    "</div>" +
    '<ul class="breakdown">' +
      "<li><span>Civil + finish (" + est.built.toLocaleString("en-IN") + " sq ft × city factor " + est.city.multiplier + ")</span><strong>" + NH.formatINR(est.base) + "</strong></li>" +
      addonRows +
      "<li><span>Contingency 7%</span><strong>" + NH.formatINR(est.contingency) + "</strong></li>" +
      "<li><span>GST 18% (typical works contract)</span><strong>" + NH.formatINR(est.gst) + "</strong></li>" +
      "<li class=\"total\"><span>Total payable (indicative)</span><strong>" + NH.formatINR(est.total) + "</strong></li>" +
    "</ul>" +
    "<h4 data-i18n=\"included\">What’s included</h4><ul class=\"plain\">" + inc + "</ul>" +
    "<h4 data-i18n=\"excluded\">Not included</h4><ul class=\"plain\">" + exc + "</ul>" +
    '<p class="tiny">' + NH.t("cityRates") + ": " + est.city.name + " × " + est.city.multiplier + ". Shared with " + NH.SUPPORT_EMAIL + " if you send it.</p>" +
    '<button class="btn btn-teal full" type="button" id="share-est" data-i18n="shareEmail">Share to support email</button>' +
    '<a class="btn btn-outline full" href="listings.html?city=' + est.city.id + '">See builders in ' + est.city.name + "</a>";

  var share = document.getElementById("share-est");
  if (share) {
    share.onclick = function () {
      var user = NH.requireUser();
      if (!user) return;
      NH.sendToSupport("Construction estimate — " + est.city.name, {
        type: "estimate",
        name: user.name,
        mobile: user.mobile,
        city: est.city.name,
        package: est.pack.name,
        design: est.design,
        builtUp: est.built,
        floors: est.floors,
        total: est.total,
        months: est.months,
        notes: est.notes
      });
    };
  }
};

document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("calculator-app")) NH.renderCalculator();
});
