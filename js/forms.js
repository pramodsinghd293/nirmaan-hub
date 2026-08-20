window.NH = window.NH || {};

NH.fillAccountPage = function () {
  var root = document.getElementById("account-app");
  if (!root) return;
  var user = NH.currentUser();
  var leads = NH.store.get(NH.KEYS.leads, []);
  var mine = user ? leads.filter(function (l) { return l.mobile === user.mobile; }) : leads.slice(0, 8);

  root.innerHTML =
    '<div class="two-col">' +
      '<section class="card">' +
        "<h1 data-i18n=\"registerTitle\">Create your NirmaanHub account</h1>" +
        "<p class=\"muted\">OTP login stores your profile in this browser. We also email " + NH.SUPPORT_EMAIL + ".</p>" +
        (user
          ? "<p>Signed in as <b>" + NH.escape(user.name) + "</b> · +91 " + NH.escape(user.mobile) + "</p>" +
            '<button class="btn btn-navy" type="button" id="acc-logout">' + NH.t("logout") + "</button>"
          : '<form class="page-form" id="reg-form">' +
            '<label>' + NH.t("name") + '<input name="name" required maxlength="80"></label>' +
            "<label>Email<input name=\"email\" type=\"email\" required placeholder=\"you@email.com\"></label>" +
            '<label>' + NH.t("mobile") + '<div class="mobile-row"><span>+91</span><input name="mobile" required pattern="[6-9][0-9]{9}" maxlength="10"></div></label>' +
            '<label>' + NH.t("searchCity") + '<select name="city">' +
              NH.CITIES.map(function (c) {
                return '<option value="' + c.id + '"' + (c.id === NH.state.city ? " selected" : "") + ">" + c.name + "</option>";
              }).join("") +
            "</select></label>" +
            '<button class="btn btn-primary" type="submit">Create account & send OTP</button>' +
            '<p class="tiny">Already listed? <button type="button" class="btn btn-outline" id="open-login">Login with OTP</button></p>' +
          "</form>") +
      "</section>" +
      '<aside class="card"><h3 data-i18n="leads">My Leads</h3>' +
        (mine.length
          ? "<ul class=\"plain\">" + mine.map(function (l) {
              return "<li><b>" + NH.escape(l.subject || l.type) + "</b><br><span class=\"tiny\">" + NH.escape(l.createdAt || "") + "</span></li>";
            }).join("") + "</ul>"
          : "<p class=\"muted\">No enquiries on this device yet.</p>") +
      "</aside>" +
    "</div>";

  var open = document.getElementById("open-login");
  if (open) open.onclick = function () { NH.openModal("login"); };
  var accOut = document.getElementById("acc-logout");
  if (accOut) {
    accOut.onclick = function () {
      NH.store.set(NH.KEYS.user, null);
      location.reload();
    };
  }
  var form = document.getElementById("reg-form");
  if (form) {
    form.onsubmit = function (e) {
      e.preventDefault();
      var fd = new FormData(form);
      var userObj = {
        id: "u_" + Date.now(),
        name: String(fd.get("name")).trim(),
        email: String(fd.get("email")).trim(),
        mobile: String(fd.get("mobile")),
        city: String(fd.get("city")),
        createdAt: new Date().toISOString()
      };
      var users = NH.store.get(NH.KEYS.users, []);
      users.push(userObj);
      NH.store.set(NH.KEYS.users, users);
      NH.store.set(NH.KEYS.user, userObj);
      NH.sendToSupport("User account created — NirmaanHub", Object.assign({ type: "user_register" }, userObj));
      NH.toast("Account saved. You are signed in.", "ok");
      location.reload();
    };
  }
};

NH.fillCompanyPage = function () {
  var root = document.getElementById("company-app");
  if (!root) return;
  var plans = NH.PLANS.map(function (p) {
    return (
      '<article class="card plan' + (p.popular ? " popular" : "") + '">' +
        (p.badge ? '<span class="badge gold">' + p.badge + "</span>" : "") +
        (p.popular ? '<span class="badge ok">Most chosen</span>' : "") +
        "<h3>" + p.name + "</h3>" +
        '<p class="amt">' + NH.formatINR(p.price) + "<small> / " + p.period + "</small></p>" +
        "<ul class=\"plain\">" + p.features.map(function (f) { return "<li>" + f + "</li>"; }).join("") + "</ul>" +
        '<button class="btn btn-primary full" type="button" data-plan="' + p.id + '">Register · ' + NH.formatINR(p.price) + "</button>" +
      "</article>"
    );
  }).join("");

  root.innerHTML =
    "<h1 data-i18n=\"companyReg\">Register your construction company</h1>" +
    '<p class="muted" data-i18n="feeNote">' + NH.t("feeNote") + "</p>" +
    '<div class="plans">' + plans + "</div>" +
    '<div class="modal" id="modal-company" hidden role="dialog">' +
      '<button class="modal-x" type="button" data-close>×</button>' +
      "<h2>Company listing form</h2>" +
      '<p class="muted" id="plan-label"></p>' +
      '<form class="page-form" id="company-form">' +
        '<input type="hidden" name="planId" id="plan-id">' +
        '<input type="hidden" name="planFee" id="plan-fee">' +
        '<label>Company name<input name="company" required maxlength="120"></label>' +
        '<label>Owner / authorised person<input name="owner" required></label>' +
        '<label>GSTIN (optional)<input name="gstin" maxlength="15" placeholder="22AAAAA0000A1Z5"></label>' +
        '<label>Email<input name="email" type="email" required></label>' +
        '<label>Mobile<div class="mobile-row"><span>+91</span><input name="mobile" required pattern="[6-9][0-9]{9}" maxlength="10"></div></label>' +
        '<label>City<select name="city">' + NH.CITIES.map(function (c) {
          return '<option value="' + c.id + '">' + c.name + "</option>";
        }).join("") + "</select></label>" +
        "<label>Categories served" +
          NH.CATEGORIES.map(function (c) {
            return '<label class="radio"><input type="checkbox" name="categories" value="' + c.id + '"> ' + c.name + "</label>";
          }).join("") +
        "</label>" +
        '<label>Starting rate (₹ / sq ft)<input name="rate" type="number" min="400" value="1600"></label>' +
        '<label>Years in business<input name="years" type="number" min="0" value="5"></label>' +
        '<label>About / areas served<textarea name="about" rows="3" required></textarea></label>' +
        "<label>UPI / payment reference (after you pay the fee)<input name=\"paymentRef\" placeholder=\"UPI ref / UTR\"></label>" +
        '<p class="tiny">Pay the selected yearly fee to the account our team shares on email. Submit this form — we publish after verification. All details go to ' + NH.SUPPORT_EMAIL + ".</p>" +
        '<button class="btn btn-teal full" type="submit">Submit listing for review</button>' +
      "</form>" +
    "</div>";

  if (!document.getElementById("overlay")) {
    /* overlay comes from app chrome */
  }

  root.querySelectorAll("[data-plan]").forEach(function (btn) {
    btn.onclick = function () {
      var plan = NH.PLANS.find(function (p) { return p.id === btn.getAttribute("data-plan"); });
      document.getElementById("plan-id").value = plan.id;
      document.getElementById("plan-fee").value = plan.price;
      document.getElementById("plan-label").textContent = plan.name + " — " + NH.formatINR(plan.price) + " / year";
      document.getElementById("overlay").hidden = false;
      document.getElementById("modal-company").hidden = false;
      document.body.classList.add("lock");
    };
  });

  var form = document.getElementById("company-form");
  form.onsubmit = function (e) {
    e.preventDefault();
    var fd = new FormData(form);
    var cats = [];
    form.querySelectorAll('input[name="categories"]:checked').forEach(function (c) { cats.push(c.value); });
    var rec = {
      type: "company_listing",
      planId: fd.get("planId"),
      planFee: fd.get("planFee"),
      company: fd.get("company"),
      owner: fd.get("owner"),
      gstin: fd.get("gstin"),
      email: fd.get("email"),
      mobile: fd.get("mobile"),
      city: fd.get("city"),
      categories: cats,
      rate: fd.get("rate"),
      years: fd.get("years"),
      about: fd.get("about"),
      paymentRef: fd.get("paymentRef"),
      status: "pending_review"
    };
    NH.store.push(NH.KEYS.companies, rec);
    NH.sendToSupport("Company listing (" + rec.planId + " · ₹" + rec.planFee + ")", rec).then(function () {
      NH.closeModals();
      form.reset();
      NH.toast("Listing submitted for review.", "ok");
    });
  };
};

NH.fillAgentPage = function () {
  var root = document.getElementById("agent-app");
  if (!root) return;
  root.innerHTML =
    '<div class="two-col">' +
      '<section class="card">' +
        "<h1 data-i18n=\"agentReg\">Become a NirmaanHub agent</h1>" +
        '<p class="muted" data-i18n="agentNote">' + NH.t("agentNote") + "</p>" +
        '<form class="page-form" id="agent-form">' +
          '<label>' + NH.t("name") + '<input name="name" required></label>' +
          "<label>Email<input name=\"email\" type=\"email\" required></label>" +
          '<label>' + NH.t("mobile") + '<div class="mobile-row"><span>+91</span><input name="mobile" required pattern="[6-9][0-9]{9}" maxlength="10"></div></label>' +
          '<label>Primary city<select name="city">' + NH.CITIES.map(function (c) {
            return '<option value="' + c.id + '">' + c.name + "</option>";
          }).join("") + "</select></label>" +
          '<label>Experience (years)<input name="experience" type="number" min="0" value="2"></label>' +
          '<label>How will you source builders / homeowners?<textarea name="pitch" rows="4" required></textarea></label>' +
          '<button class="btn btn-primary" type="submit">Apply as agent</button>' +
        "</form>" +
      "</section>" +
      '<aside class="card">' +
        "<h3>What agents do</h3>" +
        "<ul class=\"plain\"><li>Onboard construction companies in your city</li><li>Help homeowners run the calculator</li><li>Earn a referral on paid listings (discussed over email)</li><li>All paperwork goes to " + NH.SUPPORT_EMAIL + "</li></ul>" +
      "</aside>" +
    "</div>";

  document.getElementById("agent-form").onsubmit = function (e) {
    e.preventDefault();
    var fd = new FormData(e.target);
    var rec = {
      type: "agent_application",
      name: fd.get("name"),
      email: fd.get("email"),
      mobile: fd.get("mobile"),
      city: fd.get("city"),
      experience: fd.get("experience"),
      pitch: fd.get("pitch")
    };
    NH.store.push(NH.KEYS.agents, rec);
    NH.sendToSupport("Agent application — NirmaanHub", rec).then(function () {
      e.target.reset();
      NH.toast("Application sent.", "ok");
    });
  };
};

document.addEventListener("DOMContentLoaded", function () {
  NH.fillAccountPage();
  NH.fillCompanyPage();
  NH.fillAgentPage();
  NH.applyI18n();
});
