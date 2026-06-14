/* =========================================================
   Givter — script.js
   Quiz flow + Personalised Gift Finder (Smart Matching Engine)
   ========================================================= */

(function () {
  "use strict";

  /* -------------------------------------------------------
     1. SERVICE CONFIG — the "Gift Matcher" engine endpoint.
     Replace these two placeholders with your live service
     to switch from the built-in local matcher to the
     hosted matching service. The site works out of the box
     either way (it falls back to the local matcher).
     ------------------------------------------------------- */
  var GIFT_MATCHER_URL = "https://api.example.com/v1/gift-matches"; // TODO: your endpoint
  var GIFT_MATCHER_KEY = "YOUR_API_KEY_HERE"; // TODO: your key

  /* -------------------------------------------------------
     2. QUIZ DEFINITION
     ------------------------------------------------------- */
  var QUESTIONS = [
    {
      id: "recipient",
      kicker: "Step 01",
      title: "Who is the gift for?",
      type: "single",
      options: [
        { value: "partner", label: "Partner", icon: "💝" },
        { value: "friend", label: "Friend", icon: "🤝" },
        { value: "parent", label: "Parent", icon: "🏡" },
        { value: "sibling", label: "Sibling", icon: "🧩" },
        { value: "coworker", label: "Coworker", icon: "💼" },
        { value: "son", label: "Son", icon: "👦" },
        { value: "daughter", label: "Daughter", icon: "👧" }
      ]
    },
    {
      id: "gender",
      kicker: "Step 02",
      title: "How do they identify?",
      subtitle: "This helps fine-tune suggestions — skip if you'd rather not say.",
      type: "single",
      options: [
        { value: "woman", label: "Woman", icon: "👩" },
        { value: "man", label: "Man", icon: "👨" },
        { value: "nonbinary", label: "Non-binary", icon: "🌈" },
        { value: "unspecified", label: "Prefer not to say", icon: "🤍" }
      ]
    },
    {
      id: "age",
      kicker: "Step 03",
      title: "What's their age range?",
      type: "single",
      options: [
        { value: "child", label: "Child", icon: "🧸" },
        { value: "teen", label: "Teen", icon: "🎧" },
        { value: "adult", label: "Adult", icon: "🧭" },
        { value: "senior", label: "Senior", icon: "🌿" }
      ]
    },
    {
      id: "closeness",
      kicker: "Step 04",
      title: "How close are you?",
      subtitle: "This helps judge how personal or bold a gift can be.",
      type: "single",
      options: [
        { value: "acquaintance", label: "Still getting to know them", icon: "🌱" },
        { value: "friendly", label: "Good friends", icon: "🙂" },
        { value: "close", label: "Close / family", icon: "💞" },
        { value: "inseparable", label: "Inseparable", icon: "🔥" }
      ]
    },
    {
      id: "occasion",
      kicker: "Step 05",
      title: "What's the occasion?",
      type: "single",
      options: [
        { value: "birthday", label: "Birthday", icon: "🎂" },
        { value: "christmas", label: "Christmas", icon: "🎄" },
        { value: "anniversary", label: "Anniversary", icon: "💍" },
        { value: "graduation", label: "Graduation", icon: "🎓" },
        { value: "just-because", label: "Just Because", icon: "✨" }
      ]
    },
    {
      id: "budget",
      kicker: "Step 06",
      title: "What's your budget?",
      type: "single",
      options: [
        { value: "10-20", label: "£10 – £20", icon: "🪙" },
        { value: "20-50", label: "£20 – £50", icon: "💷" },
        { value: "50-100", label: "£50 – £100", icon: "💳" },
        { value: "100-plus", label: "£100+", icon: "💎" }
      ]
    },
    {
      id: "personality",
      kicker: "Step 07",
      title: "Which of these sound like them?",
      subtitle: "Pick as many as fit — most people are a mix.",
      type: "multi",
      options: [
        { value: "outdoorsy", label: "Outdoorsy", icon: "🏞️" },
        { value: "techy", label: "Techy", icon: "📱" },
        { value: "creative", label: "Creative", icon: "🎨" },
        { value: "introvert", label: "Homebody", icon: "🌙" },
        { value: "funny", label: "Funny", icon: "😄" },
        { value: "sentimental", label: "Sentimental", icon: "💗" },
        { value: "adventurous", label: "Adventurous", icon: "🧗" },
        { value: "minimalist", label: "Minimalist", icon: "🤍" },
        { value: "foodie", label: "Foodie", icon: "🍕" },
        { value: "bookish", label: "Bookish", icon: "📖" }
      ]
    },
    {
      id: "hobby",
      kicker: "Step 08",
      title: "What do they love doing?",
      subtitle: "Pick as many as you like, or add your own.",
      type: "multi",
      allowCustom: true,
      options: [
        { value: "gym", label: "Gym & Fitness", icon: "🏋️" },
        { value: "gaming", label: "Gaming", icon: "🎮" },
        { value: "cooking", label: "Cooking", icon: "🍳" },
        { value: "travel", label: "Travel", icon: "✈️" },
        { value: "reading", label: "Reading", icon: "📚" },
        { value: "music", label: "Music", icon: "🎵" },
        { value: "movies", label: "Movies & TV", icon: "🎬" },
        { value: "art", label: "Art & Crafts", icon: "🖌️" },
        { value: "fashion", label: "Fashion & Style", icon: "👗" },
        { value: "gardening", label: "Gardening", icon: "🌱" },
        { value: "pets", label: "Pets & Animals", icon: "🐾" },
        { value: "sports", label: "Sports", icon: "⚽" },
        { value: "photography", label: "Photography", icon: "📷" },
        { value: "diy", label: "DIY & Tools", icon: "🔧" }
      ]
    },
    {
      id: "aesthetic",
      kicker: "Step 09",
      title: "What's their style?",
      subtitle: "How would you describe their taste in things?",
      type: "single",
      options: [
        { value: "minimalist", label: "Clean & minimalist", icon: "◻️" },
        { value: "cosy", label: "Cosy & warm", icon: "🕯️" },
        { value: "bold", label: "Bold & colourful", icon: "🌈" },
        { value: "vintage", label: "Vintage & classic", icon: "🕰️" },
        { value: "eco", label: "Natural & eco-conscious", icon: "🍃" }
      ]
    },
    {
      id: "style",
      kicker: "Step 10",
      title: "What kind of gift, ideally?",
      type: "single",
      options: [
        { value: "practical", label: "Practical", icon: "🛠️" },
        { value: "fun", label: "Fun", icon: "🎉" },
        { value: "sentimental", label: "Sentimental", icon: "💌" },
        { value: "surprise", label: "Surprise Me", icon: "🎁" }
      ]
    },
    {
      id: "living",
      kicker: "Step 11",
      title: "Where do they live?",
      subtitle: "Helps match gifts to their space and lifestyle.",
      type: "single",
      optional: true,
      options: [
        { value: "city-flat", label: "City flat / apartment", icon: "🏙️" },
        { value: "house", label: "House with garden", icon: "🏡" },
        { value: "student", label: "Student / shared house", icon: "🎓" },
        { value: "countryside", label: "Rural / countryside", icon: "🌾" }
      ]
    },
    {
      id: "techcomfort",
      kicker: "Step 12",
      title: "How comfortable are they with technology?",
      subtitle: "Skip if you're not sure.",
      type: "single",
      optional: true,
      options: [
        { value: "loves-tech", label: "Total tech enthusiast", icon: "💻" },
        { value: "comfortable", label: "Comfortable with tech", icon: "📱" },
        { value: "basic", label: "Keeps it simple", icon: "📟" },
        { value: "avoids", label: "Prefers non-tech gifts", icon: "📖" }
      ]
    },
    {
      id: "gifthistory",
      kicker: "Step 13",
      title: "What kinds of gifts have gone down well before?",
      subtitle: "Optional — skip if you're not sure.",
      type: "multi",
      optional: true,
      options: [
        { value: "experiences", label: "Experiences & days out", icon: "🎟️" },
        { value: "homewares", label: "Home & kitchen", icon: "🏠" },
        { value: "clothing", label: "Clothing & accessories", icon: "👕" },
        { value: "food-drink", label: "Food & drink", icon: "🍷" },
        { value: "books-media", label: "Books, films & music", icon: "🎵" },
        { value: "gadgets", label: "Gadgets & tech", icon: "🔌" },
        { value: "spa-wellness", label: "Spa & wellness", icon: "🧖" },
        { value: "games-fun", label: "Games & fun stuff", icon: "🎲" }
      ]
    },
    {
      id: "avoid",
      kicker: "Step 14",
      title: "Anything to steer clear of?",
      subtitle: "Optional — allergies, things they already have plenty of, no-gos.",
      type: "text",
      placeholder: "e.g. scented candles, novelty mugs, anything leather…"
    }
  ];

  /* Friendly labels for building prompts & summaries */
  var LABELS = {};
  QUESTIONS.forEach(function (q) {
    LABELS[q.id] = {};
    (q.options || []).forEach(function (o) {
      LABELS[q.id][o.value] = o.label;
    });
  });

  /* Pronoun helpers, derived from the gender answer */
  var PRONOUNS = {
    woman: { subject: "she", object: "her", possessive: "her" },
    man: { subject: "he", object: "him", possessive: "his" },
    nonbinary: { subject: "they", object: "them", possessive: "their" },
    unspecified: { subject: "they", object: "them", possessive: "their" }
  };

  function pronounsFor(genderValue) {
    return PRONOUNS[genderValue] || PRONOUNS.unspecified;
  }

  /* Return a human label for a single value (predefined or custom text) */
  function labelFor(qid, value) {
    if (value == null) return "";
    if (LABELS[qid] && LABELS[qid][value]) return LABELS[qid][value];
    return value; // custom / free-text values pass through as-is
  }

  /* Return a comma-joined label list for an array answer (e.g. hobbies) */
  function labelsFor(qid, values) {
    if (!Array.isArray(values) || !values.length) return "";
    return values.map(function (v) { return labelFor(qid, v); }).join(", ");
  }

  /* -------------------------------------------------------
     3. STATE
     ------------------------------------------------------- */
  var answers = {}; // stores quiz answers
  var current = 0; // current question index
  var loaderTimer = null;
  var shownTitles = []; // titles already shown, for "Show More Ideas"

  /* -------------------------------------------------------
     4. DOM HELPERS
     ------------------------------------------------------- */
  function $(sel, root) {
    return (root || document).querySelector(sel);
  }
  function $all(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }
  function el(tag, attrs, html) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === "class") node.className = attrs[k];
        else node.setAttribute(k, attrs[k]);
      });
    }
    if (html != null) node.innerHTML = html;
    return node;
  }
  function escapeHtml(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function slugify(str) {
    return String(str)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  function pad2(n) {
    return n < 10 ? "0" + n : "" + n;
  }

  var screens = {
    home: $("#screen-home"),
    quiz: $("#screen-quiz"),
    loading: $("#screen-loading"),
    results: $("#screen-results")
  };

  function showScreen(name) {
    Object.keys(screens).forEach(function (key) {
      screens[key].classList.toggle("is-active", key === name);
    });
    document.body.classList.toggle("is-quizzing", name !== "home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* -------------------------------------------------------
     5. QUIZ RENDERING
     ------------------------------------------------------- */
  var qHost = $("#quiz-host");
  var progressFill = $("#progress-fill");
  var progressStep = $("#progress-step");
  var progressLabel = $("#progress-label");

  function startQuiz() {
    answers = {};
    current = 0;
    showScreen("quiz");
    renderQuestion();
  }

  function updateProgress() {
    var pct = Math.round((current / QUESTIONS.length) * 100);
    progressFill.style.width = pct + "%";
    progressStep.innerHTML =
      "Step <b>" + pad2(current + 1) + "</b> of " + QUESTIONS.length;
    progressLabel.textContent = pct + "% complete";
  }

  function renderQuestion() {
    updateProgress();
    window.scrollTo({ top: 0, behavior: "smooth" });
    var q = QUESTIONS[current];

    var card = el("div", { class: "q-card q-anim" });

    // Add skip button for optional questions
    var skipHtml = q.optional
      ? '<button class="q-skip-btn" type="button" id="q-skip">Skip this question →</button>'
      : "";

    card.appendChild(el("p", { class: "q-kicker" }, escapeHtml(q.kicker)));
    card.appendChild(el("h2", { class: "q-title" }, escapeHtml(q.title)));
    if (q.subtitle) {
      card.appendChild(el("p", { class: "q-subtitle" }, escapeHtml(q.subtitle)));
    }

    if (q.type === "multi") {
      renderMultiQuestion(card, q);
    } else if (q.type === "text") {
      renderTextQuestion(card, q);
    } else {
      renderSingleQuestion(card, q);
    }

    qHost.innerHTML = "";
    qHost.appendChild(card);

    // Wire skip button if this question is optional
    if (q.optional) {
      var skipBtn = el("button", { class: "q-skip-btn", type: "button" }, "Skip this question →");
      skipBtn.addEventListener("click", function () {
        // Set a null/empty sentinel so validAnswers still works
        if (q.type === "multi") {
          answers[q.id] = answers[q.id] || [];
        } else if (q.type === "text") {
          answers[q.id] = answers[q.id] || "";
        } else {
          answers[q.id] = answers[q.id] || "";
        }
        goNext();
      });
      card.appendChild(skipBtn);
    }
  }

  /* ---- Single-select question: tap to auto-advance ---- */
  function renderSingleQuestion(card, q) {
    var grid = el("div", { class: "options" });
    q.options.forEach(function (opt) {
      var selected = answers[q.id] === opt.value;
      var btn = el(
        "button",
        {
          class: "option" + (selected ? " is-selected" : ""),
          type: "button",
          "data-value": opt.value
        },
        optionInnerHtml(opt)
      );
      btn.addEventListener("click", function () {
        answers[q.id] = opt.value;
        Array.prototype.forEach.call(grid.children, function (c) {
          c.classList.remove("is-selected");
        });
        btn.classList.add("is-selected");

        var currentCard = qHost.firstChild;
        setTimeout(function () {
          if (currentCard) {
            currentCard.classList.add("q-leave");
            setTimeout(goNext, 240);
          } else {
            goNext();
          }
        }, 260);
      });
      grid.appendChild(btn);
    });
    card.appendChild(grid);

    var nav = el("div", { class: "q-nav" });
    nav.appendChild(buildBackButton());
    nav.appendChild(el("span", { class: "q-hint" }, "Tap an option to continue"));
    card.appendChild(nav);
  }

  /* ---- Multi-select question: toggle chips + optional custom entries ---- */
  function renderMultiQuestion(card, q) {
    if (!Array.isArray(answers[q.id])) answers[q.id] = [];

    var predefinedValues = q.options.map(function (o) { return o.value; });

    var grid = el("div", { class: "options" });
    var continueBtn; // forward reference, wired up after creation

    q.options.forEach(function (opt) {
      var selected = answers[q.id].indexOf(opt.value) !== -1;
      var btn = el(
        "button",
        {
          class: "option" + (selected ? " is-selected" : ""),
          type: "button",
          "data-value": opt.value,
          "aria-pressed": selected ? "true" : "false"
        },
        optionInnerHtml(opt)
      );
      btn.addEventListener("click", function () {
        var idx = answers[q.id].indexOf(opt.value);
        if (idx === -1) {
          answers[q.id].push(opt.value);
          btn.classList.add("is-selected");
          btn.setAttribute("aria-pressed", "true");
        } else {
          answers[q.id].splice(idx, 1);
          btn.classList.remove("is-selected");
          btn.setAttribute("aria-pressed", "false");
        }
        refreshContinueState();
      });
      grid.appendChild(btn);
    });
    card.appendChild(grid);

    var chipList = el("div", { class: "chip-list" });
    card.appendChild(chipList);

    function renderChips() {
      chipList.innerHTML = "";
      answers[q.id]
        .filter(function (v) { return predefinedValues.indexOf(v) === -1; })
        .forEach(function (custom) {
          var chip = el(
            "span",
            { class: "chip" },
            escapeHtml(custom) +
              '<button type="button" aria-label="Remove ' +
              escapeHtml(custom) +
              '">×</button>'
          );
          chip.querySelector("button").addEventListener("click", function () {
            var idx = answers[q.id].indexOf(custom);
            if (idx !== -1) answers[q.id].splice(idx, 1);
            renderChips();
            refreshContinueState();
          });
          chipList.appendChild(chip);
        });
    }
    renderChips();

    if (q.allowCustom) {
      var customRow = el("div", { class: "custom-row" });
      var input = el("input", {
        class: "custom-input",
        type: "text",
        placeholder: "Add your own interest, e.g. Astronomy",
        maxlength: "40"
      });
      var addBtn = el(
        "button",
        { class: "btn btn--ghost-paper custom-add-btn", type: "button" },
        "Add"
      );

      function addCustom() {
        var value = input.value.trim();
        if (!value) return;
        var exists = answers[q.id].some(function (v) {
          return v.toLowerCase() === value.toLowerCase();
        });
        if (!exists) {
          answers[q.id].push(value);
          renderChips();
          refreshContinueState();
        }
        input.value = "";
        input.focus();
      }

      addBtn.addEventListener("click", addCustom);
      input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          e.preventDefault();
          addCustom();
        }
      });

      customRow.appendChild(input);
      customRow.appendChild(addBtn);
      card.appendChild(customRow);
    }

    var nav = el("div", { class: "q-nav" });
    nav.appendChild(buildBackButton());

    var isLast = current === QUESTIONS.length - 1;
    continueBtn = el(
      "button",
      { class: "btn btn--primary q-continue", type: "button" },
      (isLast ? "See my gift ideas" : "Continue") + ' <span class="btn__arrow">→</span>'
    );
    continueBtn.addEventListener("click", function () {
      var currentCard = qHost.firstChild;
      if (currentCard) {
        currentCard.classList.add("q-leave");
        setTimeout(goNext, 240);
      } else {
        goNext();
      }
    });
    nav.appendChild(continueBtn);
    card.appendChild(nav);

    function refreshContinueState() {
      var hasAny = answers[q.id].length > 0;
      continueBtn.disabled = !hasAny;
    }
    refreshContinueState();
  }

  /* ---- Open-text question: optional free-form input ---- */
  function renderTextQuestion(card, q) {
    var textarea = el("textarea", {
      class: "q-textarea",
      placeholder: q.placeholder || "",
      maxlength: "200"
    });
    textarea.value = typeof answers[q.id] === "string" ? answers[q.id] : "";
    card.appendChild(textarea);
    card.appendChild(
      el("p", { class: "q-skip-note" }, "You can leave this blank and continue.")
    );

    var nav = el("div", { class: "q-nav" });
    nav.appendChild(buildBackButton());

    var isLast = current === QUESTIONS.length - 1;
    var continueBtn = el(
      "button",
      { class: "btn btn--primary q-continue", type: "button" },
      (isLast ? "See my gift ideas" : "Continue") + ' <span class="btn__arrow">→</span>'
    );
    continueBtn.addEventListener("click", function () {
      answers[q.id] = textarea.value.trim();
      var currentCard = qHost.firstChild;
      if (currentCard) {
        currentCard.classList.add("q-leave");
        setTimeout(goNext, 240);
      } else {
        goNext();
      }
    });
    nav.appendChild(continueBtn);
    card.appendChild(nav);
  }

  function optionInnerHtml(opt) {
    return (
      '<span class="option__icon" aria-hidden="true">' +
      opt.icon +
      "</span>" +
      "<span>" +
      escapeHtml(opt.label) +
      "</span>" +
      '<span class="option__check" aria-hidden="true">✓</span>'
    );
  }

  function buildBackButton() {
    var back = el(
      "button",
      { class: "q-back", type: "button" },
      "<span>←</span> Back"
    );
    if (current === 0) back.hidden = true;
    back.addEventListener("click", goBack);
    return back;
  }

  function goNext() {
    if (current < QUESTIONS.length - 1) {
      current++;
      renderQuestion();
    } else {
      finishQuiz();
    }
  }

  function goBack() {
    if (current === 0) return;
    /* persist text-question value before navigating away */
    var q = QUESTIONS[current];
    if (q.type === "text") {
      var ta = $(".q-textarea", qHost);
      if (ta) answers[q.id] = ta.value.trim();
    }
    var card = qHost.firstChild;
    if (card) card.classList.add("q-leave");
    setTimeout(function () {
      current--;
      renderQuestion();
    }, 200);
  }

  /* -------------------------------------------------------
     6. FINISH QUIZ → run the Gift Matcher
     ------------------------------------------------------- */
  function finishQuiz() {
    if (typeof answers.avoid !== "string") answers.avoid = "";
    runMatcher(answers);
    pushShareState(answers);
  }

  var LOADER_LINES = [
    "Reading their personality…",
    "Cross-referencing their interests…",
    "Weighing up the occasion…",
    "Filtering by your budget…",
    "Matching their style…",
    "Sealing your shortlist…"
  ];

  function runMatcher(ans) {
    showScreen("loading");
    var msg = $("#loading-msg");
    var i = 0;
    msg.textContent = LOADER_LINES[0];
    clearInterval(loaderTimer);
    loaderTimer = setInterval(function () {
      i = (i + 1) % LOADER_LINES.length;
      msg.style.opacity = 0;
      setTimeout(function () {
        msg.textContent = LOADER_LINES[i];
        msg.style.opacity = 1;
      }, 220);
    }, 1400);

    var started = Date.now();

    generateGiftIdeas(ans, [])
      .then(function (ideas) {
        /* keep the loader on screen for a minimum moment so it
           doesn't flash by */
        var wait = Math.max(0, 1700 - (Date.now() - started));
        setTimeout(function () {
          clearInterval(loaderTimer);
          shownTitles = ideas.map(function (g) { return g.title; });
          renderResults(ideas, ans);
        }, wait);
      })
      .catch(function (err) {
        clearInterval(loaderTimer);
        console.error(err);
        renderError();
      });
  }

  /* =======================================================
     7. PERSONALISED GIFT FINDER
     Sends the recipient profile to the Gift Matcher service
     and returns a list of gift ideas. If the hosted service
     is unavailable, a local matcher generates ideas so the
     experience always works.
     ======================================================= */
  function buildRecipientPrompt(ans, excludeTitles) {
    var recipient = labelFor("recipient", ans.recipient);
    var gender = labelFor("gender", ans.gender);
    var age = labelFor("age", ans.age);
    var closeness = labelFor("closeness", ans.closeness);
    var occasion = labelFor("occasion", ans.occasion);
    var budget = labelFor("budget", ans.budget);
    var personality = labelsFor("personality", ans.personality) || "Not specified";
    var interests = labelsFor("hobby", ans.hobby) || "Not specified";
    var aesthetic = labelFor("aesthetic", ans.aesthetic);
    var style = labelFor("style", ans.style);
    var living = labelFor("living", ans.living) || "";
    var techcomfort = labelFor("techcomfort", ans.techcomfort) || "";
    var gifthistory = labelsFor("gifthistory", ans.gifthistory) || "";
    var avoid = (ans.avoid || "").trim();

    var lines = [
      "Suggest thoughtful gift ideas for the following person.",
      "- Relationship: " + recipient,
      "- Gender identity: " + gender,
      "- Age range: " + age,
      "- How close the gift-giver is to them: " + closeness,
      "- Occasion: " + occasion,
      "- Budget: " + budget,
      "- Personality traits: " + personality,
      "- Interests / hobbies: " + interests,
      "- Style / aesthetic: " + aesthetic,
      "- Gift preference: " + style
    ];
    if (living) lines.push("- Living situation: " + living);
    if (techcomfort) lines.push("- Tech comfort level: " + techcomfort);
    if (gifthistory) lines.push("- Gift types that have worked before: " + gifthistory);
    if (avoid) {
      lines.push("- Avoid: " + avoid);
    }
    if (Array.isArray(excludeTitles) && excludeTitles.length) {
      lines.push("- Already suggested, do not repeat: " + excludeTitles.join(", "));
    }
    lines.push("");
    lines.push(
      "Use the gender identity to inform tone and suggestions where " +
      "relevant, but avoid stereotyping — prioritise the stated " +
      "interests, personality and style. Respect anything listed under " +
      "Avoid and do not suggest it. " +
      "Return a JSON array of between 6 and 12 gift ideas. " +
      "Each item must be an object with exactly these keys: " +
      '"title", "description", "why_it_matches", "price_range", ' +
      '"image_url", "affiliate_link". ' +
      "Use stock placeholder images for image_url and \"#\" for " +
      "affiliate_link. Respond with the JSON array only, no extra text."
    );

    return lines.join("\n");
  }

  var SYSTEM_INSTRUCTIONS =
    "You are a gift recommendation engine. You only ever respond with " +
    "a valid JSON array of gift idea objects and no surrounding prose.";

  async function generateGiftIdeas(answers, excludeTitles) {
    var prompt = buildRecipientPrompt(answers, excludeTitles);

    var payload = {
      model: "gift-matcher-1",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_INSTRUCTIONS },
        { role: "user", content: prompt }
      ]
    };

    try {
      var response = await fetch(GIFT_MATCHER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + GIFT_MATCHER_KEY
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Gift Matcher responded with " + response.status);
      }

      var data = await response.json();
      var ideas = extractIdeas(data);

      if (!ideas || !ideas.length) {
        throw new Error("Gift Matcher returned no ideas");
      }
      return normaliseIdeas(ideas, answers);
    } catch (err) {
      /* Graceful fallback so the experience always delivers results. */
      console.warn(
        "Live Gift Matcher unavailable — using the built-in matcher.",
        err
      );
      return localGiftMatcher(answers, excludeTitles);
    }
  }

  /* Tolerant parser: accepts a raw array, {gifts:[...]}, {data:[...]},
     or an OpenAI/Anthropic-style {choices:[{message:{content:"<json>"}}]} */
  function extractIdeas(data) {
    if (!data) return null;
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.gifts)) return data.gifts;
    if (Array.isArray(data.ideas)) return data.ideas;
    if (Array.isArray(data.data)) return data.data;

    var content = null;
    if (data.choices && data.choices[0]) {
      var c = data.choices[0];
      content = (c.message && c.message.content) || c.text;
    } else if (Array.isArray(data.content) && data.content[0]) {
      content = data.content[0].text;
    } else if (typeof data.content === "string") {
      content = data.content;
    } else if (typeof data.output_text === "string") {
      content = data.output_text;
    }

    if (typeof content === "string") {
      return parseJsonLoose(content);
    }
    return null;
  }

  function parseJsonLoose(str) {
    try {
      return JSON.parse(str);
    } catch (e) {
      /* pull the first [...] block out of any wrapper text */
      var match = str.match(/\[[\s\S]*\]/);
      if (match) {
        try {
          return JSON.parse(match[0]);
        } catch (e2) {
          return null;
        }
      }
      return null;
    }
  }

  /* Ensure every idea has all required fields filled in */
  function normaliseIdeas(ideas, ans) {
    var budgetLabel = labelFor("budget", ans.budget);
    return ideas
      .filter(function (g) {
        return g && (g.title || g.name);
      })
      .map(function (g, idx) {
        var title = g.title || g.name || "Gift idea";
        return {
          title: title,
          description:
            g.description || "A thoughtful pick chosen for this person.",
          why_it_matches:
            g.why_it_matches ||
            g.why ||
            "Matched to their interests and the occasion.",
          price_range: g.price_range || g.price || budgetLabel,
          image_url: g.image_url || g.image || placeholderImage(title, idx),
          affiliate_link: g.affiliate_link || g.link || "#"
        };
      });
  }

  function placeholderImage(seedText, idx) {
    /* Real, relevant stock photography via LoremFlickr, keyed to the
       gift title so the same idea gets a consistent image. */
    var tags = slugify(seedText) || "gift" + idx;
    return "https://loremflickr.com/480/360/" + encodeURIComponent(tags) + "?lock=" + hashStr(seedText || "gift" + idx);
  }

  /* =======================================================
     8. LOCAL MATCHER (built-in fallback)
     A curated pool scored against the recipient profile.
     Each entry may declare:
       hobby      — array of hobby values it suits
       persona    — array of personality values it suits
       aesthetic  — array of style/aesthetic values it suits
       style      — primary gift-type tag: practical | fun | surprise
       sentimental — true if this is a heartfelt / personalised pick
     ======================================================= */
  /* Real-product search links — point straight to live Amazon/Etsy search
     results for the exact product name, so links never go dead even if a
     specific listing changes. Swap in your Associates tag / specific
     listing URLs as needed. */
  var AMAZON_ASSOCIATES_TAG = "givter-21";

  function amazonSearch(title) {
    return "https://www.amazon.co.uk/s?k=" + encodeURIComponent(title) + "&tag=" + AMAZON_ASSOCIATES_TAG;
  }
  function etsySearch(title) {
    return "https://www.etsy.com/search?q=" + encodeURIComponent(title);
  }

  var BUDGET_BUCKETS = ["10-20", "20-50", "50-100", "100-plus"];
  function priceBucketIndex(price) {
    if (price <= 20) return 0;
    if (price <= 50) return 1;
    if (price <= 100) return 2;
    return 3;
  }
  var BUDGET_FIT_SCORES = [3, 1.2, -0.5, -2];

  var PRODUCT_POOL = [
    // ===================== AMAZON — GYM & FITNESS =====================
    { title: "Adjustable Resistance Bands Set", retailer: "amazon", price: 21.99, icon: "🏋️",
      hobby: ["gym"], persona: ["outdoorsy"], aesthetic: ["minimalist", "eco"], style: "practical", sentimental: false,
      ages: ["teen", "adult"], recipients: ["partner", "friend", "sibling"],
      desc: "A stackable set of resistance bands for strength training, mobility and travel workouts." },
    { title: "Premium Non-Slip Yoga Mat", retailer: "amazon", price: 27.99, icon: "🧘",
      hobby: ["gym"], persona: ["introvert", "outdoorsy"], aesthetic: ["minimalist", "eco"], style: "practical", sentimental: false,
      ages: ["teen", "adult", "senior"], recipients: ["partner", "friend", "parent", "sibling"],
      desc: "An extra-thick, grippy mat that makes home yoga and floor work far more comfortable." },
    { title: "Smart Insulated Water Bottle", retailer: "amazon", price: 32.99, icon: "🚰",
      hobby: ["gym", "travel"], persona: ["techy", "outdoorsy"], aesthetic: ["minimalist"], style: "practical", sentimental: false,
      ages: ["teen", "adult"], recipients: ["partner", "friend", "sibling", "coworker"],
      desc: "Keeps drinks cold for 24 hours and glows to remind them to hit their hydration goal." },
    { title: "Mini Percussion Massage Gun", retailer: "amazon", price: 44.99, icon: "💪",
      hobby: ["gym"], persona: ["outdoorsy"], aesthetic: ["minimalist"], style: "practical", sentimental: false,
      ages: ["adult", "senior"], recipients: ["partner", "parent", "sibling"],
      desc: "A compact deep-tissue massager for easing sore muscles after training." },
    { title: "Foam Roller", retailer: "amazon", price: 19.99, icon: "🧘",
      hobby: ["gym"], persona: ["outdoorsy"], aesthetic: ["minimalist"], style: "practical", sentimental: false,
      ages: ["adult", "senior"], recipients: ["partner", "friend", "parent"],
      desc: "A firm foam roller for easing tight muscles after training." },
    { title: "Skipping Rope with Counter", retailer: "amazon", price: 12.99, icon: "🪢",
      hobby: ["gym"], persona: ["outdoorsy"], aesthetic: ["minimalist", "bold"], style: "fun", sentimental: false,
      ages: ["child", "teen", "adult"], recipients: ["friend", "sibling", "son", "daughter"],
      desc: "A speed rope with a built-in counter for quick, effective cardio anywhere." },
    { title: "Padded Gym Gloves", retailer: "amazon", price: 14.99, icon: "🧤",
      hobby: ["gym"], persona: ["outdoorsy"], aesthetic: ["minimalist"], style: "practical", sentimental: false,
      ages: ["teen", "adult"], recipients: ["partner", "friend", "sibling"],
      desc: "Breathable, padded gloves that protect hands during lifting sessions." },
    { title: "Protein Shaker Bottle Set", retailer: "amazon", price: 13.99, icon: "🥤",
      hobby: ["gym"], persona: ["outdoorsy", "foodie"], aesthetic: ["minimalist"], style: "practical", sentimental: false,
      ages: ["teen", "adult"], recipients: ["partner", "friend", "sibling"],
      desc: "Leak-proof shakers with a mixing ball, perfect for the gym bag." },

    // ===================== AMAZON — GAMING =====================
    { title: "Mechanical RGB Gaming Keyboard", retailer: "amazon", price: 59.99, icon: "⌨️",
      hobby: ["gaming"], persona: ["techy"], aesthetic: ["bold"], style: "practical", sentimental: false,
      ages: ["teen", "adult"], recipients: ["partner", "friend", "sibling", "son", "daughter"],
      desc: "Tactile switches and customisable backlighting for faster, more satisfying play." },
    { title: "Wireless Gaming Headset", retailer: "amazon", price: 54.99, icon: "🎧",
      hobby: ["gaming", "music"], persona: ["techy"], aesthetic: ["bold", "minimalist"], style: "practical", sentimental: false,
      ages: ["teen", "adult"], recipients: ["partner", "friend", "sibling", "son", "daughter"],
      desc: "Clear chat audio and immersive sound for long gaming sessions, wire-free." },
    { title: "Retro Mini Arcade Console", retailer: "amazon", price: 64.99, icon: "🕹️",
      hobby: ["gaming"], persona: ["funny"], aesthetic: ["vintage", "bold"], style: "fun", sentimental: false,
      ages: ["child", "teen", "adult"], recipients: ["partner", "friend", "sibling", "son", "daughter"],
      desc: "A pocket-sized arcade pre-loaded with hundreds of classic games and a real joystick." },
    { title: "Ambient RGB Light Bar", retailer: "amazon", price: 24.99, icon: "💡",
      hobby: ["gaming", "music"], persona: ["creative", "techy"], aesthetic: ["bold"], style: "fun", sentimental: false,
      ages: ["teen", "adult"], recipients: ["partner", "friend", "sibling", "son", "daughter"],
      desc: "Reactive desk lighting that syncs to music or screens and sets the mood." },
    { title: "Controller Charging Dock", retailer: "amazon", price: 18.99, icon: "🔌",
      hobby: ["gaming"], persona: ["techy"], aesthetic: ["minimalist", "bold"], style: "practical", sentimental: false,
      ages: ["teen", "adult"], recipients: ["partner", "friend", "sibling", "son", "daughter"],
      desc: "Keeps two controllers charged and ready, with LED status lights." },
    { title: "Memory Foam Gaming Chair Cushion", retailer: "amazon", price: 27.99, icon: "🪑",
      hobby: ["gaming"], persona: ["techy", "introvert"], aesthetic: ["cosy"], style: "practical", sentimental: false,
      ages: ["teen", "adult"], recipients: ["partner", "friend", "sibling"],
      desc: "A supportive cushion set that makes long sessions far more comfortable." },
    { title: "Extra-Large Desk Mouse Mat", retailer: "amazon", price: 16.99, icon: "🖱️",
      hobby: ["gaming"], persona: ["techy", "creative"], aesthetic: ["bold", "minimalist"], style: "practical", sentimental: false,
      ages: ["teen", "adult"], recipients: ["partner", "friend", "sibling", "son"],
      desc: "A full-desk mat that protects surfaces and gives mouse and keyboard room to roam." },
    { title: "Digital Game Store Gift Card", retailer: "amazon", price: 25.0, icon: "🎮",
      hobby: ["gaming"], persona: ["techy", "funny"], aesthetic: ["bold"], style: "surprise", sentimental: false,
      ages: ["teen", "adult"], recipients: ["partner", "friend", "sibling", "son", "daughter"],
      desc: "Credit to spend on whatever they're currently excited to play." },

    // ===================== AMAZON — COOKING =====================
    { title: "Professional Chef's Knife", retailer: "amazon", price: 34.99, icon: "🔪",
      hobby: ["cooking"], persona: ["foodie"], aesthetic: ["minimalist", "vintage"], style: "practical", sentimental: false,
      ages: ["adult", "senior"], recipients: ["partner", "parent", "sibling"],
      desc: "A balanced, razor-sharp blade that makes everyday prep feel effortless." },
    { title: "Fresh Pasta Maker Machine", retailer: "amazon", price: 39.99, icon: "🍝",
      hobby: ["cooking"], persona: ["creative", "foodie"], aesthetic: ["cosy", "vintage"], style: "fun", sentimental: false,
      ages: ["adult", "senior"], recipients: ["partner", "parent", "sibling"],
      desc: "Roll, cut and shape restaurant-style pasta at home in minutes." },
    { title: "Mini Air Fryer", retailer: "amazon", price: 49.99, icon: "🍟",
      hobby: ["cooking"], persona: ["foodie"], aesthetic: ["minimalist"], style: "practical", sentimental: false,
      ages: ["adult", "senior"], recipients: ["partner", "parent", "sibling", "friend"],
      desc: "A compact countertop air fryer for crisp, low-oil cooking in small kitchens." },
    { title: "Electric Burr Coffee Grinder", retailer: "amazon", price: 27.99, icon: "☕",
      hobby: ["cooking"], persona: ["foodie"], aesthetic: ["minimalist"], style: "practical", sentimental: false,
      ages: ["adult", "senior"], recipients: ["partner", "parent", "coworker", "friend"],
      desc: "Freshly ground beans every morning, with adjustable settings for any brew method." },
    { title: "Sourdough Baking Kit", retailer: "amazon", price: 29.99, icon: "🍞",
      hobby: ["cooking"], persona: ["foodie", "creative"], aesthetic: ["cosy"], style: "fun", sentimental: false,
      ages: ["adult", "senior"], recipients: ["partner", "parent", "friend"],
      desc: "Everything needed to start a sourdough starter and bake the first loaf." },
    { title: "Cocktail Making Set", retailer: "amazon", price: 34.99, icon: "🍸",
      hobby: ["cooking"], persona: ["foodie", "funny"], aesthetic: ["bold", "vintage"], style: "fun", sentimental: false,
      ages: ["adult"], recipients: ["partner", "friend", "sibling"],
      desc: "A bartender's kit with shaker, jigger, strainer and recipe booklet." },
    { title: "Tea Sampler Gift Box", retailer: "amazon", price: 18.99, icon: "🍵",
      hobby: ["cooking"], persona: ["foodie", "introvert"], aesthetic: ["cosy"], style: "surprise", sentimental: false,
      ages: ["adult", "senior"], recipients: ["parent", "coworker", "friend"],
      desc: "A selection of loose-leaf teas from around the world, beautifully boxed." },
    { title: "Professional Knife Sharpener", retailer: "amazon", price: 22.99, icon: "🔪",
      hobby: ["cooking"], persona: ["foodie"], aesthetic: ["minimalist"], style: "practical", sentimental: false,
      ages: ["adult", "senior"], recipients: ["parent", "partner", "friend"],
      desc: "A simple pull-through sharpener that keeps kitchen knives razor-ready." },
    { title: "Ceramic Bakeware Set", retailer: "amazon", price: 44.99, icon: "🍰",
      hobby: ["cooking"], persona: ["foodie"], aesthetic: ["cosy", "minimalist"], style: "practical", sentimental: false,
      ages: ["adult", "senior"], recipients: ["partner", "parent", "sibling"],
      desc: "A set of oven-to-table dishes for bakes, roasts and casseroles." },
    { title: "Luxury Chocolate Gift Box", retailer: "amazon", price: 21.99, icon: "🍫",
      hobby: ["cooking"], persona: ["foodie"], aesthetic: ["cosy", "bold"], style: "surprise", sentimental: false,
      ages: ["child", "teen", "adult", "senior"], recipients: ["partner", "parent", "coworker", "friend"],
      desc: "A curated selection of premium chocolates from small-batch makers." },

    // ===================== AMAZON — TRAVEL =====================
    { title: "Packing Cubes Travel Set", retailer: "amazon", price: 22.99, icon: "🧳",
      hobby: ["travel"], persona: ["minimalist"], aesthetic: ["minimalist"], style: "practical", sentimental: false,
      ages: ["teen", "adult"], recipients: ["partner", "friend", "sibling", "coworker"],
      desc: "Colour-coded cubes that turn any suitcase into a tidy, organised carry-on." },
    { title: "Memory Foam Travel Pillow", retailer: "amazon", price: 17.99, icon: "😴",
      hobby: ["travel"], persona: [], aesthetic: ["minimalist", "cosy"], style: "practical", sentimental: false,
      ages: ["adult", "senior"], recipients: ["partner", "parent", "friend"],
      desc: "Proper neck support for flights, trains and long car journeys." },
    { title: "Anti-Theft Travel Backpack", retailer: "amazon", price: 44.99, icon: "🎒",
      hobby: ["travel"], persona: ["adventurous", "techy"], aesthetic: ["minimalist"], style: "practical", sentimental: false,
      ages: ["teen", "adult"], recipients: ["partner", "friend", "sibling"],
      desc: "Hidden zips and a USB charging port make this a smart everyday travel companion." },
    { title: "Universal Travel Adapter", retailer: "amazon", price: 15.99, icon: "🔌",
      hobby: ["travel"], persona: ["techy"], aesthetic: ["minimalist"], style: "practical", sentimental: false,
      ages: ["teen", "adult"], recipients: ["partner", "friend", "sibling", "coworker"],
      desc: "One compact adapter that works in over 150 countries, with built-in USB ports." },
    { title: "Travel Document Organiser", retailer: "amazon", price: 16.99, icon: "🗂️",
      hobby: ["travel"], persona: ["minimalist"], aesthetic: ["minimalist"], style: "practical", sentimental: false,
      ages: ["adult", "senior"], recipients: ["partner", "parent", "friend"],
      desc: "Keeps passports, tickets and cards together and easy to find at the gate." },
    { title: "Packable Rain Jacket", retailer: "amazon", price: 34.99, icon: "🧥",
      hobby: ["travel"], persona: ["outdoorsy", "adventurous"], aesthetic: ["minimalist", "eco"], style: "practical", sentimental: false,
      ages: ["teen", "adult"], recipients: ["partner", "friend", "sibling"],
      desc: "A lightweight jacket that folds into its own pocket for unpredictable weather." },
    { title: "Portable Power Bank Charger", retailer: "amazon", price: 24.99, icon: "🔋",
      hobby: ["travel"], persona: ["techy"], aesthetic: ["minimalist"], style: "practical", sentimental: false,
      ages: ["teen", "adult"], recipients: ["partner", "friend", "sibling", "coworker"],
      desc: "A pocket-sized battery that keeps phones and earbuds going all day." },
    { title: "Leather Travel Journal", retailer: "amazon", price: 22.99, icon: "📓",
      hobby: ["travel"], persona: ["sentimental", "bookish"], aesthetic: ["vintage", "cosy"], style: "sentimental", sentimental: true,
      ages: ["teen", "adult", "senior"], recipients: ["partner", "friend", "parent"],
      desc: "A refillable leather journal for trip notes, sketches and tickets." },

    // ===================== AMAZON — READING =====================
    { title: "LED Rechargeable Book Light", retailer: "amazon", price: 11.99, icon: "🔆",
      hobby: ["reading"], persona: ["introvert", "bookish"], aesthetic: ["minimalist"], style: "practical", sentimental: false,
      ages: ["child", "teen", "adult", "senior"], recipients: ["parent", "friend", "sibling", "son", "daughter"],
      desc: "A warm, clip-on glow for late chapters without disturbing anyone else." },
    { title: "Kindle Paperwhite E-reader", retailer: "amazon", price: 139.99, icon: "📱",
      hobby: ["reading"], persona: ["bookish", "minimalist"], aesthetic: ["minimalist"], style: "practical", sentimental: false,
      ages: ["adult", "senior"], recipients: ["partner", "parent", "friend"],
      desc: "A glare-free, waterproof e-reader that holds thousands of books in your pocket." },
    { title: "Cosy Reading Pillow with Arms", retailer: "amazon", price: 24.99, icon: "📚",
      hobby: ["reading"], persona: ["introvert", "bookish"], aesthetic: ["cosy"], style: "fun", sentimental: false,
      ages: ["adult", "senior"], recipients: ["partner", "parent", "friend"],
      desc: "A backrest pillow built for long, comfortable reading sessions in bed." },
    { title: "Audiobook Membership Gift Card", retailer: "amazon", price: 44.99, icon: "🎧",
      hobby: ["reading", "travel"], persona: ["bookish"], aesthetic: ["minimalist"], style: "practical", sentimental: false,
      ages: ["adult", "senior"], recipients: ["partner", "parent", "friend", "coworker"],
      desc: "Months of audiobooks to enjoy on commutes, walks and road trips." },
    { title: "Set of Magnetic Bookmarks", retailer: "amazon", price: 9.99, icon: "🔖",
      hobby: ["reading"], persona: ["bookish", "creative"], aesthetic: ["bold", "minimalist"], style: "fun", sentimental: false,
      ages: ["child", "teen", "adult", "senior"], recipients: ["friend", "sibling", "coworker", "son", "daughter"],
      desc: "A set of slim magnetic bookmarks in playful designs that never fall out." },
    { title: "Monthly Book Subscription Box", retailer: "amazon", price: 29.99, icon: "📦",
      hobby: ["reading"], persona: ["bookish"], aesthetic: ["cosy"], style: "surprise", sentimental: false,
      ages: ["teen", "adult"], recipients: ["partner", "friend", "sibling"],
      desc: "A surprise novel and bookish treats delivered every month." },

    // ===================== AMAZON — MUSIC =====================
    { title: "True Wireless Earbuds", retailer: "amazon", price: 39.99, icon: "🎵",
      hobby: ["music", "gym", "travel"], persona: ["techy"], aesthetic: ["minimalist"], style: "practical", sentimental: false,
      ages: ["teen", "adult"], recipients: ["partner", "friend", "sibling", "son", "daughter", "coworker"],
      desc: "Compact, sweat-resistant earbuds with rich sound and all-day battery life." },
    { title: "Portable Bluetooth Speaker", retailer: "amazon", price: 29.99, icon: "🔊",
      hobby: ["music"], persona: ["funny", "creative"], aesthetic: ["bold"], style: "fun", sentimental: false,
      ages: ["teen", "adult"], recipients: ["partner", "friend", "sibling", "son", "daughter"],
      desc: "A rugged, splash-proof speaker that's the life of any garden or kitchen gathering." },
    { title: "Vinyl Record Player with Speakers", retailer: "amazon", price: 79.99, icon: "🎶",
      hobby: ["music"], persona: ["creative"], aesthetic: ["vintage"], style: "fun", sentimental: false,
      ages: ["adult", "senior"], recipients: ["partner", "parent", "friend"],
      desc: "A retro-styled turntable with built-in speakers, ready to play straight out of the box." },
    { title: "Clip-On Guitar Tuner", retailer: "amazon", price: 12.99, icon: "🎸",
      hobby: ["music"], persona: ["creative", "techy"], aesthetic: ["minimalist"], style: "practical", sentimental: false,
      ages: ["teen", "adult"], recipients: ["partner", "friend", "sibling", "son", "daughter"],
      desc: "A simple clip-on tuner that keeps any stringed instrument in tune." },
    { title: "Harmonica", retailer: "amazon", price: 16.99, icon: "🎶",
      hobby: ["music"], persona: ["creative", "funny"], aesthetic: ["vintage", "bold"], style: "fun", sentimental: false,
      ages: ["teen", "adult", "senior"], recipients: ["partner", "friend", "parent"],
      desc: "A classic blues harmonica, easy to pick up and surprisingly addictive." },
    { title: "Bluetooth Karaoke Microphone", retailer: "amazon", price: 32.99, icon: "🎤",
      hobby: ["music"], persona: ["funny", "creative"], aesthetic: ["bold"], style: "fun", sentimental: false,
      ages: ["child", "teen", "adult"], recipients: ["friend", "sibling", "son", "daughter"],
      desc: "A portable mic with built-in speaker for instant living-room karaoke." },

    // ===================== AMAZON — MOVIES & TV =====================
    { title: "Mini Smart Projector", retailer: "amazon", price: 69.99, icon: "🎬",
      hobby: ["movies", "gaming"], persona: ["techy"], aesthetic: ["minimalist"], style: "fun", sentimental: false,
      ages: ["teen", "adult"], recipients: ["partner", "friend", "sibling"],
      desc: "Turns any wall into a big screen for movie nights, gaming or sports." },
    { title: "Stovetop Popcorn Maker", retailer: "amazon", price: 19.99, icon: "🍿",
      hobby: ["movies", "cooking"], persona: ["funny", "foodie"], aesthetic: ["vintage", "cosy"], style: "fun", sentimental: false,
      ages: ["adult", "senior"], recipients: ["partner", "parent", "friend"],
      desc: "Classic stovetop popcorn for an instant movie-night upgrade." },
    { title: "Streaming Media Stick", retailer: "amazon", price: 39.99, icon: "📺",
      hobby: ["movies"], persona: ["techy"], aesthetic: ["minimalist"], style: "practical", sentimental: false,
      ages: ["adult", "senior"], recipients: ["partner", "parent", "friend"],
      desc: "Plugs into any TV to bring every streaming app to the screen in seconds." },
    { title: "Sleeved Hoodie Blanket", retailer: "amazon", price: 24.99, icon: "🛋️",
      hobby: ["movies"], persona: ["introvert"], aesthetic: ["cosy"], style: "fun", sentimental: false,
      ages: ["teen", "adult", "senior"], recipients: ["partner", "parent", "friend", "sibling"],
      desc: "A giant, wearable blanket with sleeves and a pocket — built for movie marathons." },
    { title: "Film Reel Desk Lamp", retailer: "amazon", price: 27.99, icon: "💡",
      hobby: ["movies"], persona: ["creative", "sentimental"], aesthetic: ["vintage"], style: "sentimental", sentimental: true,
      ages: ["teen", "adult"], recipients: ["partner", "friend", "sibling"],
      desc: "A retro film-reel shaped lamp that throws a warm, nostalgic glow." },

    // ===================== AMAZON — ART & CRAFTS =====================
    { title: "Watercolour Paint Set", retailer: "amazon", price: 24.99, icon: "🎨",
      hobby: ["art"], persona: ["creative"], aesthetic: ["cosy", "bold"], style: "fun", sentimental: false,
      ages: ["child", "teen", "adult", "senior"], recipients: ["partner", "friend", "sibling", "son", "daughter", "parent"],
      desc: "Artist-grade paints, brushes and paper for picking up a relaxing new hobby." },
    { title: "Graphics Drawing Tablet", retailer: "amazon", price: 59.99, icon: "🖥️",
      hobby: ["art", "photography"], persona: ["creative", "techy"], aesthetic: ["minimalist"], style: "practical", sentimental: false,
      ages: ["teen", "adult"], recipients: ["partner", "friend", "sibling", "son", "daughter"],
      desc: "A pressure-sensitive pen tablet for digital art, design and photo editing." },
    { title: "Calligraphy Pen Set", retailer: "amazon", price: 19.99, icon: "🖋️",
      hobby: ["art"], persona: ["creative", "minimalist"], aesthetic: ["minimalist", "vintage"], style: "fun", sentimental: false,
      ages: ["teen", "adult", "senior"], recipients: ["partner", "friend", "parent"],
      desc: "Brush pens, guides and practice pads for beautiful modern lettering." },
    { title: "Premium Sketchbook Set", retailer: "amazon", price: 17.99, icon: "📓",
      hobby: ["art"], persona: ["creative"], aesthetic: ["minimalist", "cosy"], style: "fun", sentimental: false,
      ages: ["child", "teen", "adult"], recipients: ["friend", "sibling", "son", "daughter"],
      desc: "Heavyweight paper sketchbooks in a few sizes, ready for any medium." },
    { title: "Acrylic Paint Set", retailer: "amazon", price: 21.99, icon: "🎨",
      hobby: ["art"], persona: ["creative"], aesthetic: ["bold"], style: "fun", sentimental: false,
      ages: ["child", "teen", "adult"], recipients: ["friend", "sibling", "son", "daughter"],
      desc: "A vibrant set of acrylics with brushes, ready for canvas or crafts." },
    { title: "Embroidery Starter Kit", retailer: "amazon", price: 18.99, icon: "🧵",
      hobby: ["art"], persona: ["creative"], aesthetic: ["cosy", "vintage"], style: "fun", sentimental: false,
      ages: ["teen", "adult", "senior"], recipients: ["partner", "friend", "parent", "sibling"],
      desc: "Hoops, threads and patterns for a relaxing, screen-free hobby." },
    { title: "Polymer Clay Modelling Kit", retailer: "amazon", price: 19.99, icon: "🏺",
      hobby: ["art"], persona: ["creative"], aesthetic: ["bold", "eco"], style: "fun", sentimental: false,
      ages: ["child", "teen", "adult"], recipients: ["friend", "sibling", "son", "daughter"],
      desc: "A colourful clay set for sculpting charms, dishes and small sculptures." },

    // ===================== AMAZON — FASHION & STYLE =====================
    { title: "Genuine Leather Wallet", retailer: "amazon", price: 29.99, icon: "👛",
      hobby: ["fashion"], persona: ["minimalist"], aesthetic: ["vintage", "minimalist"], style: "practical", sentimental: false,
      ages: ["adult"], recipients: ["partner", "parent", "sibling", "coworker"],
      desc: "A slim, full-grain leather wallet that ages beautifully with everyday use." },
    { title: "Silk Scarf", retailer: "amazon", price: 24.99, icon: "🧣", genders: ["women"],
      hobby: ["fashion"], persona: ["creative"], aesthetic: ["bold", "vintage"], style: "fun", sentimental: false,
      ages: ["adult", "senior"], recipients: ["partner", "parent", "sibling", "friend"],
      desc: "A luxuriously soft printed scarf that dresses up any outfit." },
    { title: "Jewellery Organiser Box", retailer: "amazon", price: 19.99, icon: "💍", genders: ["women"],
      hobby: ["fashion"], persona: ["minimalist"], aesthetic: ["minimalist", "cosy"], style: "practical", sentimental: false,
      ages: ["teen", "adult", "senior"], recipients: ["partner", "parent", "sibling", "daughter"],
      desc: "A velvet-lined case that keeps rings, necklaces and earrings tangle-free." },
    { title: "Ribbed Knit Beanie Hat", retailer: "amazon", price: 14.99, icon: "🧢",
      hobby: ["fashion"], persona: ["minimalist"], aesthetic: ["cosy", "minimalist"], style: "practical", sentimental: false,
      ages: ["child", "teen", "adult"], recipients: ["friend", "sibling", "son", "daughter"],
      desc: "A soft, ribbed beanie that pairs with everything from autumn to spring." },
    { title: "Classic Aviator Sunglasses", retailer: "amazon", price: 24.99, icon: "🕶️",
      hobby: ["fashion"], persona: ["creative"], aesthetic: ["vintage", "bold"], style: "fun", sentimental: false,
      ages: ["teen", "adult"], recipients: ["partner", "friend", "sibling"],
      desc: "Timeless aviators with UV protection and a comfortable fit." },
    { title: "Minimalist Analog Watch", retailer: "amazon", price: 49.99, icon: "⌚",
      hobby: ["fashion"], persona: ["minimalist", "sentimental"], aesthetic: ["minimalist", "vintage"], style: "sentimental", sentimental: false,
      ages: ["adult", "senior"], recipients: ["partner", "parent", "sibling"],
      desc: "A clean-faced watch with a leather strap that suits any outfit." },

    // ===================== AMAZON — GARDENING =====================
    { title: "Self-Watering Herb Garden Kit", retailer: "amazon", price: 38.99, icon: "🌿",
      hobby: ["gardening", "cooking"], persona: ["outdoorsy", "foodie"], aesthetic: ["eco", "cosy"], style: "practical", sentimental: false,
      ages: ["adult", "senior"], recipients: ["partner", "parent", "friend"],
      desc: "A countertop kit that grows fresh herbs on a sunny windowsill year-round." },
    { title: "Ergonomic Gardening Tool Set", retailer: "amazon", price: 24.99, icon: "🌱",
      hobby: ["gardening"], persona: ["outdoorsy"], aesthetic: ["eco"], style: "practical", sentimental: false,
      ages: ["adult", "senior"], recipients: ["parent", "partner", "friend"],
      desc: "Comfort-grip tools that make borders, pots and beds a pleasure to tend." },
    { title: "Digital Plant Moisture Meter", retailer: "amazon", price: 10.99, icon: "🪴",
      hobby: ["gardening"], persona: ["techy", "outdoorsy"], aesthetic: ["eco", "minimalist"], style: "practical", sentimental: false,
      ages: ["adult", "senior"], recipients: ["parent", "partner", "friend"],
      desc: "A simple probe that tells them exactly when each plant needs water." },
    { title: "Bonsai Tree Starter Kit", retailer: "amazon", price: 24.99, icon: "🌳",
      hobby: ["gardening"], persona: ["outdoorsy", "creative"], aesthetic: ["eco", "minimalist"], style: "fun", sentimental: false,
      ages: ["adult", "senior"], recipients: ["parent", "partner", "friend"],
      desc: "Everything needed to grow and shape a bonsai tree from seed." },
    { title: "Succulent Collection Set", retailer: "amazon", price: 22.99, icon: "🪴",
      hobby: ["gardening"], persona: ["outdoorsy"], aesthetic: ["eco", "minimalist"], style: "surprise", sentimental: false,
      ages: ["teen", "adult", "senior"], recipients: ["partner", "parent", "friend", "coworker"],
      desc: "A set of easy-care succulents in matching pots, ready to display." },
    { title: "Wild Bird Feeder", retailer: "amazon", price: 19.99, icon: "🐦",
      hobby: ["gardening"], persona: ["outdoorsy"], aesthetic: ["eco"], style: "practical", sentimental: false,
      ages: ["adult", "senior"], recipients: ["parent", "partner", "friend"],
      desc: "A weatherproof feeder that brings garden birds up close all year." },

    // ===================== AMAZON — PETS =====================
    { title: "Wi-Fi Pet Camera with Treat Dispenser", retailer: "amazon", price: 54.99, icon: "🐶",
      hobby: ["pets"], persona: ["techy", "sentimental"], aesthetic: ["minimalist"], style: "practical", sentimental: false,
      ages: ["adult"], recipients: ["partner", "parent", "friend", "sibling"],
      desc: "Check in on (and treat!) their pet from anywhere via a phone app." },
    { title: "Interactive Dog Puzzle Toy", retailer: "amazon", price: 14.99, icon: "🦴",
      hobby: ["pets"], persona: ["outdoorsy"], aesthetic: ["cosy"], style: "fun", sentimental: false,
      ages: ["adult"], recipients: ["partner", "parent", "friend"],
      desc: "A treat-hiding puzzle that keeps an energetic dog entertained for hours." },
    { title: "Cat Play Tunnel", retailer: "amazon", price: 18.99, icon: "🐱",
      hobby: ["pets"], persona: ["funny"], aesthetic: ["bold", "cosy"], style: "fun", sentimental: false,
      ages: ["adult"], recipients: ["partner", "parent", "friend", "sibling"],
      desc: "A crinkly, collapsible tunnel that's an instant hit with curious cats." },
    { title: "Personalised Pet Food Bowl", retailer: "amazon", price: 16.99, icon: "🐕",
      hobby: ["pets"], persona: ["sentimental"], aesthetic: ["minimalist", "cosy"], style: "sentimental", sentimental: true,
      ages: ["adult"], recipients: ["partner", "parent", "friend"],
      desc: "A ceramic bowl printed with their pet's name and a paw motif." },
    { title: "Dog Grooming Kit", retailer: "amazon", price: 27.99, icon: "🐩",
      hobby: ["pets"], persona: ["outdoorsy"], aesthetic: ["minimalist"], style: "practical", sentimental: false,
      ages: ["adult"], recipients: ["partner", "parent", "friend"],
      desc: "Clippers, brushes and nail trimmers for at-home grooming sessions." },
    { title: "Cat Scratching Post", retailer: "amazon", price: 34.99, icon: "🐈",
      hobby: ["pets"], persona: ["funny"], aesthetic: ["cosy", "bold"], style: "fun", sentimental: false,
      ages: ["adult"], recipients: ["partner", "parent", "friend", "sibling"],
      desc: "A sisal-wrapped post and perch that saves furniture from curious claws." },

    // ===================== AMAZON — SPORTS =====================
    { title: "Official Size Match Football", retailer: "amazon", price: 19.99, icon: "⚽",
      hobby: ["sports"], persona: ["outdoorsy", "adventurous"], aesthetic: ["bold"], style: "fun", sentimental: false,
      ages: ["child", "teen", "adult"], recipients: ["friend", "sibling", "son", "daughter"],
      desc: "A durable, all-weather football for the park, garden or five-a-side." },
    { title: "Fitness Tracker Watch", retailer: "amazon", price: 39.99, icon: "⌚",
      hobby: ["sports", "gym"], persona: ["techy", "outdoorsy"], aesthetic: ["minimalist"], style: "practical", sentimental: false,
      ages: ["teen", "adult", "senior"], recipients: ["partner", "parent", "friend", "sibling"],
      desc: "Tracks steps, heart rate, sleep and workouts, with smartphone notifications." },
    { title: "Insulated Sports Water Bottle", retailer: "amazon", price: 21.99, icon: "🥤",
      hobby: ["sports", "gym"], persona: ["outdoorsy"], aesthetic: ["bold", "minimalist"], style: "practical", sentimental: false,
      ages: ["teen", "adult"], recipients: ["partner", "friend", "sibling", "son", "daughter"],
      desc: "A leak-proof bottle that keeps drinks cold through a full match or session." },
    { title: "Set of Yoga Blocks", retailer: "amazon", price: 16.99, icon: "🧘",
      hobby: ["sports", "gym"], persona: ["introvert", "outdoorsy"], aesthetic: ["minimalist", "eco"], style: "practical", sentimental: false,
      ages: ["adult", "senior"], recipients: ["partner", "parent", "friend"],
      desc: "Lightweight foam blocks that make yoga more accessible and comfortable." },
    { title: "Tennis Ball Set", retailer: "amazon", price: 9.99, icon: "🎾",
      hobby: ["sports"], persona: ["outdoorsy", "adventurous"], aesthetic: ["bold"], style: "fun", sentimental: false,
      ages: ["child", "teen", "adult"], recipients: ["friend", "sibling", "son", "daughter"],
      desc: "A tube of high-quality balls ready for the court or a game of catch." },
    { title: "Padded Cycling Gloves", retailer: "amazon", price: 17.99, icon: "🚴",
      hobby: ["sports"], persona: ["outdoorsy", "adventurous"], aesthetic: ["minimalist"], style: "practical", sentimental: false,
      ages: ["teen", "adult"], recipients: ["partner", "friend", "sibling"],
      desc: "Shock-absorbing gloves that make longer rides more comfortable." },
    { title: "Anti-Fog Swim Goggles", retailer: "amazon", price: 12.99, icon: "🏊",
      hobby: ["sports"], persona: ["outdoorsy"], aesthetic: ["minimalist"], style: "practical", sentimental: false,
      ages: ["child", "teen", "adult"], recipients: ["friend", "sibling", "son", "daughter"],
      desc: "Comfortable, anti-fog goggles for pool laps or open water." },
    { title: "Basketball", retailer: "amazon", price: 22.99, icon: "🏀",
      hobby: ["sports"], persona: ["outdoorsy", "adventurous"], aesthetic: ["bold"], style: "fun", sentimental: false,
      ages: ["child", "teen", "adult"], recipients: ["friend", "sibling", "son", "daughter"],
      desc: "An official-feel rubber basketball ideal for outdoor courts or driveways." },
    { title: "Table Tennis Set", retailer: "amazon", price: 19.99, icon: "🏓",
      hobby: ["sports", "gaming"], persona: ["funny", "adventurous"], aesthetic: ["bold"], style: "fun", sentimental: false,
      ages: ["child", "teen", "adult", "senior"], recipients: ["friend", "sibling", "parent", "son", "daughter"],
      desc: "Portable clamp-on net, bats and balls for instant kitchen table ping-pong." },

    // ===================== AMAZON — PHOTOGRAPHY =====================
    { title: "Instant Print Camera", retailer: "amazon", price: 79.99, icon: "📸",
      hobby: ["photography", "travel"], persona: ["creative", "adventurous"], aesthetic: ["vintage", "bold"], style: "fun", sentimental: false,
      ages: ["teen", "adult"], recipients: ["partner", "friend", "sibling", "daughter"],
      desc: "Snap and print keepsake photos on the spot, retro-style." },
    { title: "Lightweight Travel Tripod", retailer: "amazon", price: 24.99, icon: "📷",
      hobby: ["photography"], persona: ["techy", "adventurous"], aesthetic: ["minimalist"], style: "practical", sentimental: false,
      ages: ["teen", "adult"], recipients: ["partner", "friend", "sibling"],
      desc: "A compact tripod that folds down small but holds steady for sharp shots." },
    { title: "Camera Lens Cleaning Kit", retailer: "amazon", price: 13.99, icon: "🧹",
      hobby: ["photography"], persona: ["techy"], aesthetic: ["minimalist"], style: "practical", sentimental: false,
      ages: ["teen", "adult"], recipients: ["partner", "friend", "sibling"],
      desc: "Everything needed to keep lenses spotless and scratch-free." },
    { title: "Mini Photo Printer", retailer: "amazon", price: 69.99, icon: "🖼️",
      hobby: ["photography"], persona: ["creative", "techy"], aesthetic: ["minimalist", "bold"], style: "fun", sentimental: false,
      ages: ["teen", "adult"], recipients: ["partner", "friend", "sibling"],
      desc: "Prints phone photos instantly on credit-card sized sticky paper." },
    { title: "Padded Camera Strap", retailer: "amazon", price: 16.99, icon: "📷",
      hobby: ["photography"], persona: ["creative", "adventurous"], aesthetic: ["vintage", "minimalist"], style: "practical", sentimental: false,
      ages: ["teen", "adult"], recipients: ["partner", "friend", "sibling"],
      desc: "A comfortable strap that takes the strain out of long shoot days." },

    // ===================== AMAZON — DIY & TOOLS =====================
    { title: "Cordless Screwdriver Set", retailer: "amazon", price: 34.99, icon: "🔩",
      hobby: ["diy"], persona: ["techy", "minimalist"], aesthetic: ["minimalist"], style: "practical", sentimental: false,
      ages: ["adult", "senior"], recipients: ["partner", "parent", "sibling"],
      desc: "A precision screwdriver with interchangeable bits and USB-C charging." },
    { title: "Multi-Tool Pocket Gadget", retailer: "amazon", price: 29.99, icon: "🛠️",
      hobby: ["diy", "travel"], persona: ["outdoorsy", "minimalist"], aesthetic: ["minimalist", "eco"], style: "practical", sentimental: false,
      ages: ["adult"], recipients: ["partner", "parent", "sibling", "son"],
      desc: "A compact, sturdy multi-tool that's handy for fixes on the go." },
    { title: "Wall-Mounted Tool Organiser", retailer: "amazon", price: 24.99, icon: "🧰",
      hobby: ["diy"], persona: ["minimalist"], aesthetic: ["minimalist", "eco"], style: "practical", sentimental: false,
      ages: ["adult", "senior"], recipients: ["partner", "parent"],
      desc: "A pegboard-style organiser that keeps a workshop or shed tidy." },
    { title: "Soldering Iron Kit", retailer: "amazon", price: 27.99, icon: "🔧",
      hobby: ["diy"], persona: ["techy"], aesthetic: ["minimalist"], style: "practical", sentimental: false,
      ages: ["adult"], recipients: ["partner", "friend", "sibling", "son"],
      desc: "A temperature-controlled iron with accessories for electronics and hobby projects." },
    { title: "Hot Glue Gun Kit", retailer: "amazon", price: 14.99, icon: "🔥",
      hobby: ["diy"], persona: ["creative"], aesthetic: ["bold", "eco"], style: "fun", sentimental: false,
      ages: ["teen", "adult"], recipients: ["friend", "sibling", "son", "daughter"],
      desc: "A glue gun with a rainbow of glue sticks for crafts and quick fixes." },
    { title: "Label Maker", retailer: "amazon", price: 24.99, icon: "🏷️",
      hobby: ["diy"], persona: ["minimalist", "techy"], aesthetic: ["minimalist"], style: "practical", sentimental: false,
      ages: ["adult", "senior"], recipients: ["partner", "parent", "coworker"],
      desc: "A compact label printer that makes organising anything satisfying." },

    // ===================== AMAZON — WELLBEING & HOME =====================
    { title: "Scented Candle Gift Set", retailer: "amazon", price: 22.99, icon: "🕯️",
      hobby: [], persona: ["introvert"], aesthetic: ["cosy", "minimalist"], style: "surprise", sentimental: false,
      ages: ["teen", "adult", "senior"], recipients: ["partner", "parent", "friend", "coworker", "sibling"],
      desc: "Three hand-poured candles in seasonal scents with a long, clean burn." },
    { title: "Aromatherapy Essential Oil Diffuser", retailer: "amazon", price: 29.99, icon: "🌬️",
      hobby: [], persona: ["introvert"], aesthetic: ["cosy", "eco"], style: "practical", sentimental: false,
      ages: ["adult", "senior"], recipients: ["partner", "parent", "friend"],
      desc: "A calming mist of essential oils to turn any room into a retreat." },
    { title: "Large Format Jigsaw Puzzle", retailer: "amazon", price: 18.99, icon: "🧩",
      hobby: [], persona: ["introvert", "creative"], aesthetic: ["cosy", "vintage"], style: "fun", sentimental: false,
      ages: ["adult", "senior"], recipients: ["parent", "partner", "friend"],
      desc: "A 1000-piece puzzle featuring a beautiful print — a proper Sunday afternoon project." },
    { title: "Weighted Eye Mask", retailer: "amazon", price: 19.99, icon: "😴",
      hobby: [], persona: ["introvert"], aesthetic: ["minimalist", "cosy"], style: "practical", sentimental: false,
      ages: ["teen", "adult", "senior"], recipients: ["partner", "parent", "friend"],
      desc: "A gentle, lavender-scented weighted mask for deeper, more restful sleep." },
    { title: "Electric Foot Spa", retailer: "amazon", price: 44.99, icon: "🦶",
      hobby: [], persona: ["introvert"], aesthetic: ["cosy"], style: "fun", sentimental: false,
      ages: ["adult", "senior"], recipients: ["parent", "partner", "friend"],
      desc: "Heated water jets and a pumice stone for a salon-quality foot soak at home." },
    { title: "Posture Corrector Brace", retailer: "amazon", price: 22.99, icon: "🏥",
      hobby: [], persona: [], aesthetic: ["minimalist"], style: "practical", sentimental: false,
      ages: ["adult", "senior"], recipients: ["parent", "partner", "coworker"],
      desc: "A discreet, breathable brace that gently trains better posture throughout the day." },
    { title: "Himalayan Salt Lamp", retailer: "amazon", price: 24.99, icon: "🌟",
      hobby: [], persona: ["introvert"], aesthetic: ["cosy", "eco"], style: "fun", sentimental: false,
      ages: ["adult", "senior"], recipients: ["partner", "parent", "friend"],
      desc: "A warm amber glow from a hand-carved salt crystal that doubles as mood lighting." },
    { title: "Smart LED Colour-Changing Bulbs", retailer: "amazon", price: 29.99, icon: "💡",
      hobby: [], persona: ["techy", "creative"], aesthetic: ["bold", "minimalist"], style: "fun", sentimental: false,
      ages: ["teen", "adult"], recipients: ["partner", "friend", "sibling", "son", "daughter"],
      desc: "App-controlled bulbs that set the scene for work, movies or relaxing." },

    // ===================== AMAZON — KIDS & YOUNG =====================
    { title: "LEGO Classic Brick Box", retailer: "amazon", price: 34.99, icon: "🧱",
      hobby: ["art", "diy"], persona: ["creative"], aesthetic: ["bold"], style: "fun", sentimental: false,
      ages: ["child"], recipients: ["son", "daughter", "sibling", "friend"],
      desc: "A classic tub of bricks in every colour for open-ended building adventures." },
    { title: "Science Experiment Kit for Kids", retailer: "amazon", price: 24.99, icon: "🧪",
      hobby: ["diy"], persona: ["techy", "creative"], aesthetic: ["bold"], style: "fun", sentimental: false,
      ages: ["child"], recipients: ["son", "daughter", "sibling", "friend"],
      desc: "Over 30 safe, exciting experiments that make chemistry feel like magic." },
    { title: "Remote Control Monster Truck", retailer: "amazon", price: 29.99, icon: "🚗",
      hobby: ["gaming"], persona: ["adventurous", "funny"], aesthetic: ["bold"], style: "fun", sentimental: false,
      ages: ["child"], recipients: ["son", "daughter", "sibling", "friend"],
      desc: "A rugged RC truck that handles rough terrain, grass and ramps at speed." },
    { title: "Illustrated Children's Book Bundle", retailer: "amazon", price: 19.99, icon: "📚",
      hobby: ["reading"], persona: ["bookish"], aesthetic: ["cosy", "bold"], style: "fun", sentimental: false,
      ages: ["child"], recipients: ["son", "daughter", "sibling", "friend"],
      desc: "A set of beautifully illustrated picture books that spark imagination." },
    { title: "Art & Craft Activity Set", retailer: "amazon", price: 22.99, icon: "✂️",
      hobby: ["art"], persona: ["creative"], aesthetic: ["bold"], style: "fun", sentimental: false,
      ages: ["child"], recipients: ["son", "daughter", "sibling", "friend"],
      desc: "Stickers, stamps, paints and craft supplies for hours of creative play." },
    { title: "Kids Coding Robot", retailer: "amazon", price: 39.99, icon: "🤖",
      hobby: ["gaming", "diy"], persona: ["techy", "creative"], aesthetic: ["bold"], style: "fun", sentimental: false,
      ages: ["child", "teen"], recipients: ["son", "daughter", "sibling", "friend"],
      desc: "A programmable robot that teaches logic and coding through play — no screens needed." },
    { title: "Magnetic Tiles Building Set", retailer: "amazon", price: 32.99, icon: "🔷",
      hobby: ["art", "diy"], persona: ["creative"], aesthetic: ["bold"], style: "fun", sentimental: false,
      ages: ["child"], recipients: ["son", "daughter", "sibling", "friend"],
      desc: "Colourful magnetic tiles that snap together to build everything from towers to cars." },
    { title: "Indoor Kids Trampoline", retailer: "amazon", price: 49.99, icon: "🤸",
      hobby: ["sports"], persona: ["adventurous", "funny"], aesthetic: ["bold"], style: "fun", sentimental: false,
      ages: ["child"], recipients: ["son", "daughter", "sibling"],
      desc: "A compact, spring-free mini trampoline with a safety handle for indoor bouncing." },
    { title: "Kids Walkie-Talkies Set", retailer: "amazon", price: 22.99, icon: "📻",
      hobby: [], persona: ["adventurous", "funny"], aesthetic: ["bold"], style: "fun", sentimental: false,
      ages: ["child"], recipients: ["son", "daughter", "sibling", "friend"],
      desc: "Durable, long-range walkie-talkies for adventures around the house and garden." },
    { title: "Glow-in-the-Dark Star Ceiling Kit", retailer: "amazon", price: 14.99, icon: "⭐",
      hobby: [], persona: ["creative"], aesthetic: ["bold", "cosy"], style: "fun", sentimental: false,
      ages: ["child", "teen"], recipients: ["son", "daughter", "sibling"],
      desc: "Hundreds of phosphorescent stars and moon shapes that light up the bedroom ceiling." },
    { title: "Kids Waterproof Camera", retailer: "amazon", price: 39.99, icon: "📷",
      hobby: ["photography"], persona: ["creative", "adventurous"], aesthetic: ["bold"], style: "fun", sentimental: false,
      ages: ["child"], recipients: ["son", "daughter", "sibling", "friend"],
      desc: "A tough, drop-proof, waterproof camera designed specifically for little adventurers." },
    { title: "Beginner Guitar", retailer: "amazon", price: 79.99, icon: "🎸",
      hobby: ["music"], persona: ["creative"], aesthetic: ["vintage"], style: "fun", sentimental: false,
      ages: ["child", "teen"], recipients: ["son", "daughter", "sibling", "friend"],
      desc: "A properly set-up, full starter guitar that makes learning actually fun." },

    // ===================== AMAZON — TEENS =====================
    { title: "Spotify Premium Gift Card", retailer: "amazon", price: 30.0, icon: "🎵",
      hobby: ["music"], persona: ["techy", "creative"], aesthetic: ["minimalist", "bold"], style: "surprise", sentimental: false,
      ages: ["teen", "adult"], recipients: ["son", "daughter", "sibling", "friend"],
      desc: "Months of ad-free music, podcasts and audiobooks on any device." },
    { title: "Portable LED Ring Light", retailer: "amazon", price: 24.99, icon: "💡",
      hobby: ["photography", "art"], persona: ["creative"], aesthetic: ["bold", "minimalist"], style: "fun", sentimental: false,
      ages: ["teen"], recipients: ["son", "daughter", "sibling", "friend"],
      desc: "A tripod ring light perfect for video calls, selfies and content creation." },
    { title: "Popcorn Machine", retailer: "amazon", price: 32.99, icon: "🍿",
      hobby: ["movies"], persona: ["funny", "foodie"], aesthetic: ["vintage"], style: "fun", sentimental: false,
      ages: ["teen", "adult"], recipients: ["son", "daughter", "sibling", "friend"],
      desc: "A retro countertop popcorn maker that serves up cinema-style popcorn in minutes." },
    { title: "Mini Fridge for Bedroom", retailer: "amazon", price: 59.99, icon: "❄️",
      hobby: [], persona: ["introvert"], aesthetic: ["minimalist", "bold"], style: "fun", sentimental: false,
      ages: ["teen"], recipients: ["son", "daughter", "sibling"],
      desc: "A compact, quiet 4L fridge that keeps drinks and snacks cold at their desk." },
    { title: "Gel Nail Starter Kit", retailer: "amazon", price: 39.99, icon: "💅", genders: ["women"],
      hobby: ["fashion", "art"], persona: ["creative"], aesthetic: ["bold"], style: "fun", sentimental: false,
      ages: ["teen", "adult"], recipients: ["daughter", "sibling", "friend"],
      desc: "A UV lamp, gel polishes and tools for salon-quality nails at home." },
    { title: "Skincare Starter Set", retailer: "amazon", price: 34.99, icon: "🧴",
      hobby: ["fashion"], persona: ["introvert", "creative"], aesthetic: ["minimalist", "eco"], style: "surprise", sentimental: false,
      ages: ["teen", "adult"], recipients: ["daughter", "sibling", "friend"],
      desc: "A beginner-friendly routine set: cleanser, toner, moisturiser and SPF." },

    // ===================== AMAZON — SENIORS =====================
    { title: "Large-Button Digital Photo Frame", retailer: "amazon", price: 44.99, icon: "🖼️",
      hobby: [], persona: ["sentimental"], aesthetic: ["cosy", "minimalist"], style: "sentimental", sentimental: true,
      ages: ["senior"], recipients: ["parent", "partner"],
      desc: "A Wi-Fi frame that family can send photos to directly from their phones." },
    { title: "Talking Audiobook Player", retailer: "amazon", price: 54.99, icon: "📻",
      hobby: ["reading"], persona: ["bookish", "introvert"], aesthetic: ["minimalist"], style: "practical", sentimental: false,
      ages: ["senior"], recipients: ["parent", "partner"],
      desc: "A simple, large-button player preloaded with audiobooks — no phone required." },
    { title: "Magnifying Reading Glasses Set", retailer: "amazon", price: 16.99, icon: "👓",
      hobby: ["reading"], persona: [], aesthetic: ["minimalist"], style: "practical", sentimental: false,
      ages: ["senior"], recipients: ["parent", "partner"],
      desc: "A set of readers in different strengths, stashed around the house and handbag." },
    { title: "Cosy Fleece Blanket", retailer: "amazon", price: 22.99, icon: "🧣",
      hobby: [], persona: ["introvert"], aesthetic: ["cosy"], style: "surprise", sentimental: false,
      ages: ["senior", "adult"], recipients: ["parent", "partner"],
      desc: "An incredibly soft, generous-sized fleece blanket in a beautiful neutral tone." },
    { title: "Digital Blood Pressure Monitor", retailer: "amazon", price: 29.99, icon: "💉",
      hobby: [], persona: [], aesthetic: ["minimalist"], style: "practical", sentimental: false,
      ages: ["senior"], recipients: ["parent", "partner"],
      desc: "A clinically accurate arm-cuff monitor with a large display and memory storage." },
    { title: "Pill Organiser with Alarm", retailer: "amazon", price: 18.99, icon: "💊",
      hobby: [], persona: [], aesthetic: ["minimalist"], style: "practical", sentimental: false,
      ages: ["senior"], recipients: ["parent", "partner"],
      desc: "A weekly organiser with a built-in alarm to never miss a dose." },
    { title: "Easy Grip Walking Stick", retailer: "amazon", price: 24.99, icon: "🦯",
      hobby: [], persona: [], aesthetic: ["minimalist"], style: "practical", sentimental: false,
      ages: ["senior"], recipients: ["parent", "partner"],
      desc: "A lightweight, height-adjustable folding stick with a comfortable foam handle." },
    { title: "Knitting Starter Kit", retailer: "amazon", price: 28.99, icon: "🧶",
      hobby: ["art"], persona: ["creative", "introvert"], aesthetic: ["cosy", "vintage"], style: "fun", sentimental: false,
      ages: ["adult", "senior"], recipients: ["parent", "partner", "friend"],
      desc: "Needles, colourful yarns and a beginner pattern book for a cosy new hobby." },
    { title: "Crossword Puzzle Book Collection", retailer: "amazon", price: 12.99, icon: "📰",
      hobby: ["reading"], persona: ["bookish"], aesthetic: ["vintage"], style: "fun", sentimental: false,
      ages: ["senior", "adult"], recipients: ["parent", "partner", "friend"],
      desc: "A bumper collection of crosswords, sudoku and word puzzles to fill spare hours." },
    { title: "Garden Kneeling Pad", retailer: "amazon", price: 14.99, icon: "🌱",
      hobby: ["gardening"], persona: ["outdoorsy"], aesthetic: ["eco"], style: "practical", sentimental: false,
      ages: ["senior", "adult"], recipients: ["parent", "partner"],
      desc: "A thick, waterproof foam pad that cushions knees during gardening sessions." },
    { title: "Thermal Flask Gift Set", retailer: "amazon", price: 28.99, icon: "☕",
      hobby: [], persona: ["introvert", "outdoorsy"], aesthetic: ["cosy", "minimalist"], style: "surprise", sentimental: false,
      ages: ["adult", "senior"], recipients: ["parent", "partner", "friend", "coworker"],
      desc: "A matching flask and travel mug set that keeps hot drinks hot for 12 hours." },
    { title: "Book of World Records Annual", retailer: "amazon", price: 14.99, icon: "📖",
      hobby: ["reading"], persona: ["funny", "bookish"], aesthetic: ["bold"], style: "fun", sentimental: false,
      ages: ["child", "teen", "adult", "senior"], recipients: ["son", "daughter", "parent", "sibling", "friend"],
      desc: "The latest annual edition, packed with astonishing facts and incredible photos." },

    // ===================== AMAZON — COWORKER / NEUTRAL =====================
    { title: "Premium Desk Organiser", retailer: "amazon", price: 27.99, icon: "🗂️",
      hobby: [], persona: ["minimalist"], aesthetic: ["minimalist"], style: "practical", sentimental: false,
      ages: ["adult"], recipients: ["coworker", "friend"],
      desc: "A sleek bamboo tray that keeps pens, cables and sticky notes in check." },
    { title: "Personalised Mug", retailer: "amazon", price: 12.99, icon: "☕",
      hobby: [], persona: ["funny", "sentimental"], aesthetic: ["cosy", "bold"], style: "fun", sentimental: false,
      ages: ["teen", "adult", "senior"], recipients: ["coworker", "friend", "parent"],
      desc: "A quality ceramic mug with a custom message or design that they'll use every morning." },
    { title: "Premium Notebook and Pen Set", retailer: "amazon", price: 22.99, icon: "📓",
      hobby: ["reading", "art"], persona: ["minimalist", "bookish"], aesthetic: ["minimalist", "vintage"], style: "practical", sentimental: false,
      ages: ["teen", "adult"], recipients: ["coworker", "friend", "sibling"],
      desc: "A hardback dotted notebook and a smooth rollerball pen — the professional's essential." },
    { title: "Wireless Charging Pad", retailer: "amazon", price: 19.99, icon: "📲",
      hobby: [], persona: ["techy", "minimalist"], aesthetic: ["minimalist"], style: "practical", sentimental: false,
      ages: ["teen", "adult"], recipients: ["partner", "friend", "sibling", "coworker"],
      desc: "A slim, fast-charging pad that tidies up the desk and keeps devices topped up." },
    { title: "Stress Relief Fidget Cube", retailer: "amazon", price: 11.99, icon: "🎲",
      hobby: [], persona: ["introvert", "techy"], aesthetic: ["minimalist"], style: "fun", sentimental: false,
      ages: ["teen", "adult"], recipients: ["friend", "coworker", "sibling"],
      desc: "Six sides of satisfying fidgets — buttons, dials, switches — for anxious hands." },

    // ===================== ETSY (PERSONALISED PICKS) =====================
    { title: "Personalised Name Necklace", retailer: "etsy", price: 22.0, icon: "💛", genders: ["women"],
      hobby: ["fashion"], persona: ["sentimental"], aesthetic: ["minimalist", "bold"], style: "sentimental", sentimental: true,
      ages: ["teen", "adult"], recipients: ["partner", "daughter", "sibling", "friend"],
      desc: "A dainty, handmade necklace featuring their name in delicate lettering." },
    { title: "Custom Star Map Print", retailer: "etsy", price: 28.0, icon: "🌌",
      hobby: ["art"], persona: ["creative", "sentimental"], aesthetic: ["vintage", "minimalist"], style: "sentimental", sentimental: true,
      ages: ["teen", "adult", "senior"], recipients: ["partner", "parent", "friend"],
      desc: "The night sky from a date that matters, printed as framed wall art." },
    { title: "Personalised Engraved Leather Wallet", retailer: "etsy", price: 35.0, icon: "👝",
      hobby: ["fashion"], persona: ["sentimental", "minimalist"], aesthetic: ["vintage"], style: "sentimental", sentimental: true,
      ages: ["adult"], recipients: ["partner", "parent", "sibling", "son"],
      desc: "A handcrafted leather wallet engraved with their initials or a short message." },
    { title: "Custom Illustrated Pet Portrait", retailer: "etsy", price: 32.0, icon: "🐾",
      hobby: ["pets", "art"], persona: ["sentimental", "creative"], aesthetic: ["bold", "vintage"], style: "sentimental", sentimental: true,
      ages: ["adult"], recipients: ["partner", "parent", "friend"],
      desc: "A hand-illustrated portrait of their pet, made from a favourite photo." },
    { title: "Personalised Photo Memory Book", retailer: "etsy", price: 30.0, icon: "📔",
      hobby: ["photography", "travel"], persona: ["sentimental"], aesthetic: ["cosy", "vintage"], style: "sentimental", sentimental: true,
      ages: ["teen", "adult", "senior"], recipients: ["partner", "parent", "friend", "sibling"],
      desc: "A beautifully printed photo book telling the story of shared memories." },
    { title: "Engraved Wooden Cutting Board", retailer: "etsy", price: 28.0, icon: "🪵",
      hobby: ["cooking"], persona: ["sentimental", "foodie"], aesthetic: ["cosy", "vintage"], style: "sentimental", sentimental: true,
      ages: ["adult", "senior"], recipients: ["partner", "parent", "sibling"],
      desc: "A handsome oak board engraved with their name, a date, or a family recipe." },
    { title: "Personalised Cufflinks", retailer: "etsy", price: 24.0, icon: "🎩", genders: ["men"],
      hobby: ["fashion"], persona: ["sentimental", "minimalist"], aesthetic: ["vintage"], style: "sentimental", sentimental: true,
      ages: ["adult"], recipients: ["partner", "parent", "sibling", "coworker"],
      desc: "Engraved cufflinks with initials, coordinates, or a hidden handwritten note." },
    { title: "Custom Family Tree Print", retailer: "etsy", price: 26.0, icon: "🌳",
      hobby: ["art"], persona: ["sentimental"], aesthetic: ["vintage", "cosy"], style: "sentimental", sentimental: true,
      ages: ["adult", "senior"], recipients: ["parent", "partner"],
      desc: "A hand-drawn family tree print personalised with names and dates." },
    { title: "Birth Flower Necklace", retailer: "etsy", price: 20.0, icon: "🌷", genders: ["women"],
      hobby: ["fashion"], persona: ["sentimental"], aesthetic: ["minimalist", "bold"], style: "sentimental", sentimental: true,
      ages: ["teen", "adult"], recipients: ["partner", "daughter", "sibling", "friend"],
      desc: "A delicate pendant featuring the flower associated with their birth month." },
    { title: "Personalised Recipe Blanket", retailer: "etsy", price: 45.0, icon: "🧶",
      hobby: ["cooking"], persona: ["sentimental", "foodie"], aesthetic: ["cosy"], style: "sentimental", sentimental: true,
      ages: ["adult", "senior"], recipients: ["partner", "parent"],
      desc: "A soft woven blanket printed with a treasured family recipe, in their handwriting if you like." },
    { title: "Custom Song Lyrics Print", retailer: "etsy", price: 24.0, icon: "🎼",
      hobby: ["music", "art"], persona: ["sentimental", "creative"], aesthetic: ["minimalist", "vintage"], style: "sentimental", sentimental: true,
      ages: ["teen", "adult"], recipients: ["partner", "sibling", "friend"],
      desc: "A meaningful lyric or sound-wave print from a song that matters to them." },
    { title: "Personalised Leather Journal", retailer: "etsy", price: 26.0, icon: "📓",
      hobby: ["reading", "art"], persona: ["sentimental", "bookish"], aesthetic: ["vintage", "cosy"], style: "sentimental", sentimental: true,
      ages: ["teen", "adult", "senior"], recipients: ["partner", "parent", "friend"],
      desc: "A hand-bound leather journal embossed with their name or initials." },
    { title: "Engraved Whisky Glasses Set", retailer: "etsy", price: 32.0, icon: "🥃",
      hobby: [], persona: ["sentimental", "foodie"], aesthetic: ["vintage"], style: "sentimental", sentimental: true,
      ages: ["adult"], recipients: ["partner", "parent", "sibling", "friend"],
      desc: "A pair of glasses etched with initials, coordinates, or a special date." },
    { title: "Custom Embroidered Hoodie", retailer: "etsy", price: 38.0, icon: "🧥",
      hobby: ["fashion"], persona: ["sentimental"], aesthetic: ["cosy", "bold"], style: "sentimental", sentimental: true,
      ages: ["teen", "adult"], recipients: ["partner", "sibling", "friend", "son", "daughter"],
      desc: "A cosy hoodie embroidered with a name, date, or in-joke." },
    { title: "Personalised Phone Case", retailer: "etsy", price: 18.0, icon: "📱",
      hobby: ["fashion", "photography"], persona: ["sentimental", "creative"], aesthetic: ["bold", "minimalist"], style: "sentimental", sentimental: true,
      ages: ["teen", "adult"], recipients: ["partner", "sibling", "friend", "son", "daughter"],
      desc: "A custom-printed phone case featuring a photo, name or design of their choice." },
    { title: "Custom Illustrated Couple Portrait", retailer: "etsy", price: 40.0, icon: "💑",
      hobby: ["art"], persona: ["sentimental", "creative"], aesthetic: ["bold", "vintage"], style: "sentimental", sentimental: true,
      ages: ["adult"], recipients: ["partner"],
      desc: "A hand-drawn portrait capturing the two of you in a chosen scene or style." },
    { title: "Memory Jar Kit with Prompt Cards", retailer: "etsy", price: 22.0, icon: "🫙",
      hobby: [], persona: ["sentimental", "introvert"], aesthetic: ["cosy", "vintage"], style: "sentimental", sentimental: true,
      ages: ["teen", "adult", "senior"], recipients: ["partner", "parent", "friend"],
      desc: "A keepsake jar with prompt cards for notes, tickets and memories to open later." },
    { title: "Personalised Engraved Keyring", retailer: "etsy", price: 14.0, icon: "🔑",
      hobby: [], persona: ["sentimental", "minimalist"], aesthetic: ["minimalist"], style: "sentimental", sentimental: true,
      ages: ["teen", "adult", "senior"], recipients: ["partner", "parent", "friend", "sibling", "coworker"],
      desc: "A small everyday keepsake engraved with a name, date or short message." },
    { title: "Custom Enamel Pin", retailer: "etsy", price: 10.0, icon: "📌",
      hobby: ["art", "fashion"], persona: ["creative", "funny"], aesthetic: ["bold"], style: "fun", sentimental: false,
      ages: ["teen", "adult"], recipients: ["friend", "sibling", "son", "daughter"],
      desc: "A playful custom-designed enamel pin for a jacket, bag or pinboard." },
    { title: "Birthstone Bracelet", retailer: "etsy", price: 28.0, icon: "💎", genders: ["women"],
      hobby: ["fashion"], persona: ["sentimental"], aesthetic: ["minimalist", "bold"], style: "sentimental", sentimental: true,
      ages: ["teen", "adult"], recipients: ["partner", "daughter", "sibling", "friend"],
      desc: "A delicate bracelet featuring their birthstone, handmade to order." },
    { title: "Personalised Children's Storybook", retailer: "etsy", price: 22.0, icon: "📖",
      hobby: ["reading"], persona: ["sentimental"], aesthetic: ["cosy", "bold"], style: "sentimental", sentimental: true,
      ages: ["child"], recipients: ["son", "daughter", "sibling", "friend"],
      desc: "A professionally printed book starring them as the hero — with their name and likeness on every page." },
    { title: "Custom Name Puzzle", retailer: "etsy", price: 18.0, icon: "🧩",
      hobby: ["art"], persona: ["creative"], aesthetic: ["bold", "cosy"], style: "fun", sentimental: true,
      ages: ["child"], recipients: ["son", "daughter", "sibling", "friend"],
      desc: "A wooden jigsaw with their name cut into the pieces — great for learning and keepsaking." },
    { title: "Embroidered Birth Stats Hoop", retailer: "etsy", price: 24.0, icon: "🌟",
      hobby: ["art"], persona: ["sentimental"], aesthetic: ["vintage", "cosy"], style: "sentimental", sentimental: true,
      ages: ["child"], recipients: ["son", "daughter"],
      desc: "A handmade embroidery hoop recording their birth date, weight and time in delicate thread." },
    { title: "Personalised Grandparent Book", retailer: "etsy", price: 20.0, icon: "📘",
      hobby: ["reading"], persona: ["sentimental", "bookish"], aesthetic: ["cosy", "vintage"], style: "sentimental", sentimental: true,
      ages: ["senior"], recipients: ["parent"],
      desc: "A fill-in-the-blank memoir book for grandparents to record their stories for future generations." },
    { title: "Custom Map Print of a Special Place", retailer: "etsy", price: 26.0, icon: "🗺️",
      hobby: ["travel", "art"], persona: ["sentimental", "creative"], aesthetic: ["vintage", "minimalist"], style: "sentimental", sentimental: true,
      ages: ["adult", "senior"], recipients: ["partner", "parent", "friend"],
      desc: "A beautifully styled map print of a city, town or location that means something to them." },
    { title: "Handmade Soy Wax Candle", retailer: "etsy", price: 16.0, icon: "🕯️",
      hobby: [], persona: ["introvert"], aesthetic: ["cosy", "eco"], style: "surprise", sentimental: false,
      ages: ["teen", "adult", "senior"], recipients: ["partner", "parent", "friend", "sibling", "coworker"],
      desc: "A hand-poured, small-batch soy candle in a seasonal or custom scent." },
    { title: "Personalised Book Embosser Stamp", retailer: "etsy", price: 28.0, icon: "📚",
      hobby: ["reading"], persona: ["bookish", "creative"], aesthetic: ["vintage", "minimalist"], style: "sentimental", sentimental: true,
      ages: ["adult", "senior"], recipients: ["partner", "parent", "friend"],
      desc: "A beautiful brass embosser that stamps an 'ex libris' plate into every book they own." },
    { title: "Custom Pet Name Collar", retailer: "etsy", price: 14.0, icon: "🐕",
      hobby: ["pets"], persona: ["sentimental"], aesthetic: ["bold", "eco"], style: "sentimental", sentimental: true,
      ages: ["adult"], recipients: ["partner", "parent", "friend"],
      desc: "A hand-engraved or embroidered collar featuring their pet's name and a design they'll love." },
    { title: "Personalised Gin or Whisky Label Kit", retailer: "etsy", price: 18.0, icon: "🥃",
      hobby: ["cooking"], persona: ["funny", "creative"], aesthetic: ["vintage", "bold"], style: "fun", sentimental: false,
      ages: ["adult"], recipients: ["partner", "friend", "sibling", "parent"],
      desc: "Custom-printed bottle labels to transform any supermarket spirit into a thoughtful gift." },

    // ===================== EXPERIENCES & SUBSCRIPTIONS =====================
    { title: "Movie Night Gift Hamper", retailer: "amazon", price: 34.99, icon: "🎬",
      hobby: ["movies"], persona: ["introvert", "funny"], aesthetic: ["cosy"], style: "surprise", sentimental: false,
      ages: ["teen", "adult", "senior"], recipients: ["partner", "parent", "friend", "sibling"],
      desc: "Popcorn, hot chocolate, cosy socks and a streaming gift card — the ultimate movie kit." },
    { title: "Cocktail Recipe Book", retailer: "amazon", price: 16.99, icon: "📖",
      hobby: ["cooking"], persona: ["foodie", "creative"], aesthetic: ["bold", "vintage"], style: "fun", sentimental: false,
      ages: ["adult"], recipients: ["partner", "friend", "sibling", "parent"],
      desc: "A beautifully styled guide to over 200 classic and modern cocktails." },
    { title: "Coffee Subscription (3 Months)", retailer: "amazon", price: 49.99, icon: "☕",
      hobby: ["cooking"], persona: ["foodie"], aesthetic: ["minimalist"], style: "surprise", sentimental: false,
      ages: ["adult", "senior"], recipients: ["partner", "parent", "coworker", "friend"],
      desc: "Freshly roasted single-origin beans from around the world delivered monthly." },
    { title: "Grow-Your-Own Chilli Kit", retailer: "amazon", price: 19.99, icon: "🌶️",
      hobby: ["gardening", "cooking"], persona: ["foodie", "creative"], aesthetic: ["eco", "bold"], style: "fun", sentimental: false,
      ages: ["adult", "senior"], recipients: ["partner", "parent", "friend"],
      desc: "Seeds, compost and a terracotta pot to grow seriously hot chillies from scratch." },
    { title: "Giant Garden Jenga", retailer: "amazon", price: 29.99, icon: "🪵",
      hobby: ["sports"], persona: ["funny", "adventurous"], aesthetic: ["eco"], style: "fun", sentimental: false,
      ages: ["child", "teen", "adult", "senior"], recipients: ["partner", "parent", "sibling", "friend"],
      desc: "A huge outdoor stacking game that gets more chaotic — and more fun — as it grows." },
    { title: "Watercolour Painting by Number Kit", retailer: "amazon", price: 22.99, icon: "🖼️",
      hobby: ["art"], persona: ["creative", "introvert"], aesthetic: ["cosy", "vintage"], style: "fun", sentimental: false,
      ages: ["adult", "senior"], recipients: ["partner", "parent", "friend"],
      desc: "A satisfying painting kit that guides them through a beautiful watercolour without art skills." },
    { title: "Travel Scratch-Off World Map", retailer: "amazon", price: 17.99, icon: "🗺️",
      hobby: ["travel"], persona: ["adventurous", "creative"], aesthetic: ["vintage", "bold"], style: "fun", sentimental: false,
      ages: ["teen", "adult"], recipients: ["partner", "friend", "sibling"],
      desc: "A gold-foil scratch-off map to reveal the countries they've visited — and dream of next." },
    { title: "Self-Care Hamper", retailer: "amazon", price: 44.99, icon: "🛁",
      hobby: [], persona: ["introvert"], aesthetic: ["cosy", "eco"], style: "surprise", sentimental: false,
      ages: ["teen", "adult", "senior"], recipients: ["partner", "parent", "friend", "sibling"],
      desc: "Bath salts, a face mask, a candle and a soft cloth — the full pamper package." },
  ];
  var CATEGORY_IMAGES = {
    "gym": "data:image/png;base64,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",
    "gaming": "data:image/png;base64,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",
    "cooking": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUAAAADVCAMAAAARktncAAAAkFBMVEX//v7+/f3//Pv+/Pz+/Pv//Pn8/Pv++/r9+/v9+/r9+/n8+/v++vn9+vn8+vn++ff++Pb9+fj9+Pb+9/T99/X8+ff89/X/9vP+9vT+9vP/9vL/9fL+9fP+9fL+9fH99vT99fL+9PH89vP89PH88/D78/Dw6ObkoI7pVSvoVSzoVSvoVSrcVS92PzUfKTcUIjHIy8suAAAP4UlEQVR42u3diXbiuBIAUBMIkAnENCaBmE3GGySd5P//brzjRZJLUnmhQ73zzkzTDIHbJUsqFW5N48SgHA+FmKTxGMbsGvo1FrkwKrGmhMkN2n+xrrxu/qfm3ox+fYvRW37MPkHxg1U+t1YXg5oYBjFKY1KK2azWrvT5Nu/lMPfiYZZfZLMBMRbeb/nDZJ8y/Mg1KpKAE2XATQXQvEnAAdRvOEQF3FQATTlA0ywDFgmVAcGCrQJuKoBmbwGHKIDDWwLc4AIOEQCHLQDupeIOqDAFx9E84FAZcCgEqMsA7tsF1IUAhwBAkN8QsgzUAUvobgBZgmqAA2RA/UYAdTTAAfQCeN2HjGB+hTffB0DgIB5VBYeNAs46Bdx1DjgQnIJ5gDC/CuBupwC44wECCRmA0Il4oAQo7ocMuFMHnLUAOGIAzpQBAwI1wB1nLwebiJmCzQCKXwENXi1GHbAkKFwZ5AxiNECI3wzoVyoG4gIGhLza6oIBWDOIlQEhA/jfAZz0HLC0hFHyq0wjFEEQID8FFQArfiOmH/QgpALIBzocDmqABghwxgAcIQCOYAkIOw2plPN3bLhygBbT79BpBCsFxQAnoBHMO05iAFphedQkpMhnWeGjB6skGD85+AcdcCMxDzcEOIQD6qARzNjGWWvDcoMwDJIHJOt1+KhlmFYOkOyN6OG1sSeMDbEioNA0IgQ4UQTcVADNSGThpbFeWylgkH3Zw0aUhREfMdz0UdeIUtbkboiZa2kO4KQhQIlCYKWMUFpGhyaG4+VikQIa+UcdIwYMcjX/sBF5CwBKlhRaBVwIAEbXMK8Y7jvZH4jplh7eh4Dk3a0+uQbQkACcNAKomoDUKyAxvHIEWRWM38rDhlX1YwmKb4ilz4dRAIHbYMoVkBDbqwoSip9nE5q2F847JnwehgqiAEIrqfA6TKUjxlonDlb43CS/XDMdwMFUG0zQyVNMK/Vzgycv3KugKbAUlLsKygMqVaKNWsB1KrK3SDDBvse/PBwSMtMK4pDCpqzB1EFINp24u1pAoxtAmQTk7+JYgO46XtGRXYxixyP4fR+v/6xYziUx4CJZLJJFchWstBnBU1BXFtTAlSxlQEpT0X6/3gYXwWxbFl7kXHN9OESDeG1l27gQ1TyYWzOZNqInh1PKu7HeUwA3fQEUraTyd3H0jgTDyO1s14Z5ICGZGfzLNQwj+Zfg93O9HYEeqW5GKBOxAQDk7kYkAUF1BGnANO1IDpBkWWeRHKCVPkysfCHBIrTjzSYAh8KAyKXoKh+rEHPgBrQkI1VSkBHUlOsIsotogUJWPeD+XXIxDQIcIQAqVqIpCbiXAgSm4Dt4Q6da1NJUS/ntJiBTcLeTBNQVi1qaYgLi+h1A0eAgnglfBTXEKVi4kCoJeADOI4hn7CNBQJkEXIiVEeT5WIImQlEGE3CkAlizBjQVAQ8ygIbyVZAPWG2lHCn2opZL+JQjzGSVLB10zR20Qq0DW6c5/TKaXC8luJkXAGhZioLygIsmAEdoFax6QGU/CUC16mCl9VfjJCAK4HuzgFYdIDwF1QBpfuIFGH4C0gawpRy0HMwvqzcIV0FO26WGmoDiU4iFItgjwBFaBbA+AfcofqEgd1m94V4G5YpbrQHWJKDVHOAOOI/o0t37BUCUrzPwe6EbS8BAUAFQ9esP/y7gDritEz0iGdEAhxjfB+FdAXecEbxe5yzM9Tb6p7Ndm7mH0+c46e9HsV1vHdYgzgtupCrU9YLDFHCIAWhIAQZOnncl2YdnnNvwYdfz9tfHPc/cbkPe4Pezh/fhyV34cNeAQ+k1jMC3QRh+8YlvllXRubDr7JNumDTT4mdZcRuI4STZmDy59atgQZAF2PgaMAZMemACwcghaVSwrLTNKHRK/IJfpv8Mn+ykT44ykpqCqmtBAOAwAMz9Cg0QsolLkisVDG+gk7a7ZK2Vbvho6rfNemPs8GE769qy6gWlGlcnkBQsACq1AnK/D8eegd1qw5Vp0bqz3PhaWA7YYlrqkGkyqV/KDDXIFXCimoCcPVy1Y22by8xCf2A2xIvdhGxC1bogJAVVAMG90DxAyyln2j6dYQvhpLN0qXHV6g+gcDe5dAIWl9BGwcrY0lLTTWfkdWFwm2v+hk7itjywaeQqqA07BwzWzNcr2jb38DU3zWTBHBFeu/TXdVvinSLgTARwNGpoDgaUUc04Cwt7EsuZaDGhrplO7vFt3LNqGVtAYVDxcKR+GtHkE1AHHqND6tDONvzyUeERS/N8/xyG73uaU/it6MmOpQZoiJ8uAQEnzSdgbRnBmXmxXhQXfyB5QvfedAriAIpcAQ8QQEd3LoFb6hdkoeZIAe5QpxHKRKx1k4CHuvxzLudi+BoI8CCyI1a5NRQqIGcRuJMCNLyyXyA4Qwc06k+IwYAjhW2cSCH12rPLS8CRf64KXqszPECOILgmMxMoKWiSc/ACmoAygAeryld/GaT3zXDrgkqAIxCg1CJ6U+vHBXQG/pkW3sSBAB7gKYiwG2kX8AAD1OiANSl4qE1BqaUgIqDwIpqdgFKA3gAGeGDe3Uh9GqnckUISENTMu0MGhGagZAouVABH8oDMKYTYrmQ8MzLwRfL1HELkpxEO4EgaEHIFtB8fyzec592MPn8re02nz8KPxWfB40G3bwgw8Rt43pdsfH9R1oEKr+Z5j47snX47AnQ1/0chvst+l/NfpdfzJq7srZJFASeKgJnft0KUBUM/tddLclAVcNIOoK3olwjmqjF/lV/Pe7BrSjIKgKI7YQZgOoLtV1W/8BP/zSXgX4TX81Y1KShc0RIE1EGA4ZtcuN8I8fP1FRv+/fr+wXg5zaWkoMrZXAaocpxEGcFE975RBH++v6L//eD8ebzZR+4YltrMaeDjJDigq32hfOTIMJxCkV7Lj1Kwx4AbfEDMqAWU+iK2Ng5iGsfTNeb5+JOL5TVW1zjmg/QYkOTfaO4DrK4fK/9pCwzznE8iFthpVD8VQHLjgGzBJ5qgIOASBDjx++j37b2CAJcCgNMQcFoDKOZ3DG/htO4jYLCMCd7bkUEISEEG4HQKvwQCAU9uD8fwjz9rFlBwBLP8QkD7NOqdYHQF5ACu6sdwe4DEIn2bR1I/bMCpLOCKC0hcO8jB/hD+ZH4qgPMWAYll6L5SRRAzvv3M72YAiW1rWtYg6XcT2c/XMr/bAQyGsfvw8PD4mLX5tR9B4mmPDw8D3c38lADn7QKGhK7tepfPz8vnRwfx+fnpe2/BW7Bz76n3gKQQzswP+C4f3cQl+LPzJ07xLbUBCNgJwwAdze+OLyH0Bk4DgE+tADp6MH679AsEP/2RdbOAR6drv4/g8utrzg0BFv6wV87l47NbwA9UwHm7gNEV8OOjc8HiVVClIkhJwd8AWEzBO+AdsD+Axx4C5vvyBj0BHOTek91zQDfc/iahBxl4Pn+cO/U7nz89Tc/ek6bbvR7C9qMXthJc46trv7+Fd/PtezO3x4B2uSsw6hHq0i8sjJc6BTUbYx3YCCCtK6tTwfMX5f14S9LXhTS1K+vnqzPA8wfjeLOnWzlWR0JnKXimv59gVm4YULIeyADsLgXpgOEB0x2wa8DpHfAOeAe8OcCnO+AdsEvA/zABl1RAv2/rQGqnjCe5DnxqCjATXNj/xE6kuwbLG9kLr06oDZYiLb51KdjLakz5e5sDm+8nDDjGG8NJPTD/Vd0e1APz78d3Zy52k7lkOYHeo2rnvqb+2JuKdO5N6TbG1xymha85oH7RxrZ7fSZiE+wv2vDGboGOZ7eidWb19FSOc7QpWtUPHXEAj/8E4FIWME84n88lZ+AbBVwhA3IEfyvgHAvwzy8C/CMIOAVdBQWb2/oLiDWH3AHVvvLKAHy6A94B+YBITb53wA4Bl/AvOfwSwOkdUHg/HO+IJQFvuEMVsIhpCvDPHbBaE6wDZAn+mibztgGPd0BgQQYwj/QS8Kg0gqtFVa1az//1gBy/aneMNhVJQbF5uPeAK5VSTBlw+jsABW/9JAf4NMdZCv57gLTWDjFAoatgDwFFpxARQPwU7Dmg0hpGGvDPTQOKDuD6zoRcd5Z4Cv77gPUJCAMUO5vLBG8ecN4EoEAK3iQgaBHNAMQ6X08Fewd4xAKc5gEhgnLzcN8AIWsY0RFcaG/DAzz2HhBpCmEDClf2Kbcg6xngUQmQ4VfoDwSuZCCbkTgFl14v/PSqn/gcTB/ACaDYIF6CBVfd3/qJkYCASyDMLwEc418FQ0Fr5l0uXd987OIdZfwAgOMcoGyfdE0Kdn4VDG9/h3EFnLP8eICKgvFSJrz/Xbc3YDxaUmsYWUDh803+WtAaeX54C9BuIvjBvr5CriMU/eCAsovpo+aHn6STuPgObROyQilklQDFphHWWpAiaDkzravbIA+0lYNdyp9KA87lAEPCpdZNOI5FWgOkCM7V6qrXwxHL6Sakb34MnkKEAJUajRJJ6t+GqxLUV6z8XEW/OfMKGAAOK4BThSN23j2lWwMkXEDxKTgHOK0CPtPipRSv1Yh/6lsuTpXIPoBdiQYGbPWHZD+/+tbybzz+KNWPWFZ4oVHBAEGCJ7Zgx4AnLiDL7xXixwDETkERQIsfEoAnuQREBXxhAcJS0GYJVlQs1+OHW6Fm+tlKAxg2glEB2YKUD2dHHz75Fq8nF8l/Hf2N9+gJ+KIECB/DwoM4+YUsGhMz99rifrJTCBwQ6SpITEc+4UApmf0s0sYVkA0IycEq4BvnKhj+vzm6fMQ/C7aEeVP0aw3waLjt6KUD2ugdIEvwDTKNHNvUSwyPmFPIc3OAgBTsgC8MgB8C4PgZSig5jZy68osEG55C2gG0va7iKLuIfoX6ReWs5+dG93OnDgEbT0BVwFcIYGdD2D5BAF8VAMc4gHWL6Y4E7SPSAMYChO3n6AuZ9vncEyF9A2SXFPg52MlC+kibg0G7YLhfi4BhWZ20ZGi75MjYhVT95Osw9YAQweUSOoijHTEx3eaLCSKF/GYBn+VSkF/bz/7WV3Q7185+Ai7gcw2gUgrCKtPVumD2F+iqF1RNygtT9yCgS+CLkF9yLtwBYPZpo3JydodJx4WhRc9NjjDBJ0mYlegi4BgM+CJ3PMcCFD5TsmpPk9oDzHcmwAFfJDfEUEDl80xFwBc5wLEC4KtAXbVbwEohC7IGZAGWe2O6AbTxD9S7AhwrAsoesaM3JCCX8lmA474A2tgNHQT5OJ0OOMYHhGznOD0KzTfEyJ0GtwEocsTeGiDaNk4JELaUhgm2C3jCKsTUXAKbA2QIdgb4Jgv4DAUcK29GIIPYRhW0GS1ZkIZA6AhuFXD5qwEVBNUApQltNUCFffAYGfC1E0C7M8AxHXDccFGL3WyJnIAwQIU6AgtwfPuAKl3lCIBj1cp+q9s5W7KrF3EAAwGfbwWQ4AI+iwOO2wDEKmqJfLHmhNfSVgT7H3ifuUM6xzcuAAAAAElFTkSuQmCC",
    "travel": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUAAAADVCAMAAAARktncAAAAkFBMVEX+/v7+/f3//Pv+/Pz+/Pv+/Pr8/Pv++/r9+/v9+/r9+/n8+/v++vn9+vn8+vn++ff++Pb9+fj9+Pb+9/X99/X8+ff89/X1+Pn/9vP+9vP+9vL/9fL+9fP+9fL+9fH99vT99fP89vP99PH88/H88+/78/Hw6OX1kHH/aj7/aj3/ajz2akD4YjboVSvoUylDMTX29DR6AAANBUlEQVR42u3daXeqSBMAYLwaNK8Y12TGjCuyaUzu//93L6iJbN1UdRXQROrLnDleNDyneqtu1DAk0UnHn0T0E2HdY3yPSSzmmfiXJzLvG//U2B8zvv+Jyb+9n7yxzH0b8OjkRjeM3nekPjsuJ7JL3d8yE+9rfLxn3wbEmPh70zfzc5fRLedjKPglAPtkwBy/JgF2lPKPETDPTwnwvYCQDIgXrAIw109TQKRgR+bXEMAlL2CXAbBbAeBaKVpAwhB8jfIBMYJyPxjgWAVwXS3gGAWIEJT7dSHTwDFgCl0PoEhQL8BxQwDH1QFm+DKAgPzTAhDYiHtZwW6pgFatgCudAEFDsAwQ5pcBXK0IgCv5am6C7gZjN9qrAhDvxwy4ogNaFQD2BIAWGTAkoAGuwPUEIaBIEDeMdICA+B5wXi7gSgY4RwPmCIIAO5A6gszPAvpVDCjKQcuCN2JIRaEjA4Q04N8D2IcCdgB+JQBmhhCCX+4wogIoT8FOsSDYryf0g26EIMfgzWZDA5yDAC0BYE8K2CnKv47MDwZY4LdcieHSAZ1Mz/GFfdUU7GAB+6AWjNlOWkH5hIIrtZ2RcRWAXTjgGNSCocs4DOB6CV+NwADhwwgWsE8EBNdSUYCInZEJDLBfEqBCIbCgjIDoASWjCQJQsaRQKSBHHYYTcK4A2C8FkJqApQGuEcOIWmW6bEDgMhi+m4QEfEcAAgUxgGotmKGQhRtCMMPIfE5txIjFCHQW+MRch1EB3KgBzusB7AIBx2O1VZwAcCMN4EQGmoLCRvwEFpT7cQIuKwRc6gKIraQyHApUACzYnUsRjiGN+AlaUDCU1sEWC+BaY8A+dD1skBPQUpwDipYhKoAF+5sspX0kILyOoDqJxi3jiKsR2IpYusFJBCRWopfUVYhCCi5pgsCilkEt5VebgOKq4Ip9RQwrahnEBOT124CixEZsoXtBg3EILquQChNcMZQU5I0YAaiSgPRV8AYcSusR8jEPJGCPAlgwB3wnAm7ICzq2uaAhOUrZI55FBWxhXjTsWzjw+L4kX3Ol8PCD9Oi05LyMoXaWUukwrwDwm28CfyTt6T8nJqgOOCkDsEc6S4kDvPs5c8Pz/0LDcw1HFZBWHcwc/TUkCVghoNNH8EXhj+8piByQywHM88MXYCa4Qwj3/LO8v8jwjYM4B1fMvaDk2KXBmoD4IeRicHhD+4WC1kGYgzUC9tgqgIC1x08Cmj4e8K+3/GnFa/VuUK24VQNgbgLeBP6z/6rEfSABrI1pgH1hJ2gwPs4gP0gpScCOrwTo9b8FCYDUxx8qBExOlN0YoKHkF44jMcDkRHtdcHIVu0UiHocN/BCiNoKs7EnyULGz/plCKwJ6xs902j4kZ9oHhOBEWbD7DdjlACw4iOo+eX48wrvnA7Q3T4k395+yjbhEwK7yHAbegO3MTO8uSAd0DT/dul27tF4wISgCZJ4DHmae+P7JgI7h58yzyXNBAGA3BIz9HxtgZg64dfMAnh0WwNxRPMxBagr2ISmYACQdBZQCzj3JKEoGNPJniSviJlO/XzyV6RqQHrBPTcB1LqBXMiC5LghJQQogsAeMpmibXMCn26ztjyKg9Po/Ud21UkD0aXJIAoYz3Mv875/cDDIvk7ahcgbKrr+8uLET23Vsw8hd0OiWCbheWpZxnf/l9YHfM0NPcSUivf7yYs+wLLvMmkwMsNdjH4Pt5dzz/I9zFDm3+HX+DjXAT+n1lxdCXK9nc6VgHwqIfx4ktwu0+4Z/Pp1PQRgfeQDBd3woAf5cHghfPZ9PJ89YbjA1GQtVUjDK20tywsZ7ju7iGEYu4PEnlBJQfvnlhfDTT4HvPNmlpSAPoMDvfA5+7vFTBpDzanHELj9KXg3T8MPp29yAvTQgdwLaod8pkBjF/VQEE5cfZa9Ggk8buSD6q6FYAXN6QLuf8ksbJf3wgqnLj7JXQ0Fvvgb3gkqAPcIyLqcOs16F40eQuscgHmmAY4Ag/PzIXB/I3j04h8tG+ILYQpQUDMUxuGAV8j7P+tUZwcmz1hzfcZmZCxpd+hdz5PSAk+XpdNQJMD8FGVYj5QCuLU+n/Isy0Pcma6WpICMgfAhxDL1acJSCXlEviAbsEQDlXeB64vkn3QD9yTt4GMED9tQB8+Yw4RxQL7/j8XRyJkpflSwB7CkDAibR2gEGLSAX4LIFrBLQwgL2W0DMKPLogHMeQOxKWAC4bAjgklJPUAccPxDgGAdI2U6aNxxwTlzMGeDtpBawdMBlwwGVHsQ2zDAG13i+xyge01jM7rG4xzYeu52mgIvdbhf/Q2M3sLjfVvxuEwyjmM9NLLQzcv0ogLuGA4oFn/MEkYCzBwCcIQAHEeCgABDnpzlgQnCLS0EB4GAA7wJbQAkgsgWL/JoKuChuw9UBOo8DOFAFXDwg4KgFbAFbwEYDjlrABgDuNAfcVQEIWAk/OuBzC9gC/k7A3a8GHLWAtIpgTgqWB6hZNA7weNIrzg0D/Pr80iw+cwC3OgNqFo8JeMud0gAXvxzw69P3PO+DhfARAb/OnhMCOj6HoCLgqMGAXx/eNRz/Uz/AspdyHIC+cxPc+F96AD43CfAnAaP4/GoUIEM98IsxAVvAXwhYekmftwkz9oHbhwGMpaDz0QKSBH3GeWBTtjV5ViK+5zgOi98FcPNogGE/6Pv+F9OykAz4P07AWSWAn2y1BI4m/FwW4KI8QP5y1lb9lHR1ByybCKh+wBJzxBeSgg0CLD4jDQI0eduw3iX9Mg6ZK5YT5M+J3L/aTpf44HzMYZB4zKGcB200i2NZD9rI2m6CTma3iFVTdd9Yh3WEIMbIkQdw+ysAZ6qAccLRaKQ+AjcRcMEMKBF8VMARF+D0gQCnSMABqBcE7snpD8g1hrSAtEdeBYDPLWALKAdk2pdrAWsElNWyHhNw0AKi18PXFbEiYIMPmVMqgkTAaQuYrQkWAYoEpYD2L3rMoWrAbQsILMj84m/tAK6EBwnAQQsI8cuejjEGmBQEjsNNAVxQSjFpwMFjACJ35dQAn0fEqeCvBcw72oEDhPWC+gJihxAMIGMKNgOQNIdRBoStRuyphr/m0LHRDbj4ZELsdBY+BcWAev4chs3WA979YID4E24zL9DtF22mNu1kDBcgLAUXTqDVD4pcfhKI+JhXMSDX/no0jIy84KiPYPSLQAviCf3cMTgChAjip4J69YKXHwQCzWGwLThxvI0PMFqOeB/aCIYNeGHvyhhCxIDoyn76qLk9cDQRDKIOcAtrwKjDgZnzgcCZzAx2Vt8eRYJBUDvfKfSzk1MYhTE4vwHfAHGNeAYVHHh+EP26cL3Zd/a9aaaOBegCYX43QJO/F4wEt9HPg59rbMin6DeunXAGjfcDAJoxQNVz0gVfh+xML4RBXd+2E/ieaSwc6AM2uDqMWQRIFLxuLzkLY+bVF4ZhOzb062JYANH7m0XHPMIbuPzzaeIf5ietYuS98Wx6+UzH2cGPI8DqCEk/OOBIETAyFIXDFcJPKDpWTihkpQBxw4hoLigQLHAsI9IfzlbKHygDjlpAKWCO4IhWV61TUOZHKkWn/TCAhF6wbkCi30jYA4aA3QzggLDFrkkKUhuwEHCQBRzmxUsqXrNx/dS3WOzFcQAFYtiFvaHkL4r/4ddbyd5iWuEljwoGCBIkAx6Y/YCAIr9XiJ8AkDsFDwjBgtaJ8DvQEpAV8EUEOKMB3lTugrZTsDiL+dnpq8GASn7lA76hAONrEcWV7u3qjUCRuQdEAcLbMLoRh4Ni9B+XuWzgxt4b76c6hMABmXrB3ftBPeFAKfljuK+iBxQDQnIwCyhrxNGNuVWUsJzrZ8H83oh+lQFu565bYR3QPcx3ugGKBCGAu61TeS3V3XIOIcPyAAGCW7eWcvR+B0xAEqA5hBIqDyM1+YWCpQ8h1QC6tW2JbFX9XqF+l3LWcFjueq6BgC9VAb5CAGtrwi6oBb8SAE0ewEJBpxa/w5apAXMBwtZzudOYffV8jvoIUhqguKRQPBIv3SrT0HGXW+VVMNyvQsCQcLuvaDFycHdbaB2VUIcpBoQIzmaouuDu3S2/mIAqw5QKOFRLQXltP7xD13UP3Ipu9KbXUgw74LAAkJSCqMp0rC64uX45AEdB9X0XrwPu97RC4AvK77YvXANgsqR/3y5yYGjx3RPwThJnJToJaIIBX2jbc8XbS0VbvpStOGbA+MkEOOBLFTvEqX1O1DVEwBc1QJMA+IqoqyIBVWKPKEVD5oAiwPTZmBaQCGgSAWf6AyqV8kWA5oMDzoiAJj8gjLBGQLXd4CoAXxsBqLqMIwHCptIYQa0AGbrA8gDfNAN8UwUcQgFN8mIEkoI6AM5QLbhSwNlDAxIEmwlIWAebzICvDwZo5gOalRS16h+EZ+Q6ggjQbD4g5VQ5A6BJrezXvZzb8wIW8gEBh00B3PMCDvGAZhWApRHueQEhfub/AYMCIuy7aOELAAAAAElFTkSuQmCC",
    "reading": "data:image/png;base64,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",
    "music": "data:image/png;base64,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",
    "movies": "data:image/png;base64,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",
    "art": "data:image/png;base64,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",
    "fashion": "data:image/png;base64,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",
    "gardening": "data:image/png;base64,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",
    "pets": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUAAAADVCAMAAAARktncAAAAkFBMVEX+/v7+/f3//Pv+/Pz+/Pv+/Pr8/Pv++/r9+/v9+/r9+/n8+/v++vn9+vn8+vn++ff++Pb9+fj9+Pb8+ff+9/X99/X89/X/9vP+9vP/9vL/9fL+9fP+9fL+9fH99vT99fL+9PH99PH99PD89vP89PH88/Dz6+jq5OLR1dvP3OTsoIv/aj7/aj3/ajzpakbqViuBQV0WAAARf0lEQVR42u3di3LiuBIAUBEYTG4gEAIDhGBjB9nEBPP/f3f9AvyS3C21DWSnq3ZrZ2cSwqnWq9VmGJNEpxhPuTByMbzG+BqTTMxKsaiIlTSqvmJR+r7ZV838MOPrj5j/2Y38Gyu9bwaPTmV0w+ido/DaWTmRXeH9LUux+sTHqvxtQIy5n7f4Zi7vMnrL1RgKfjlAQxuwwu+RADtK+UcIWOWnBLiqIdQGxAu2AVjpd6eASMGOzO9BAJe0gF0CwG4LgJ9K8Q9QYwlOonlAjKDcDwY4VgH8bBdwjAJECMr9upBt4Biwhb4NoEjwvgDHDwI4bg+wxFcCBOTfXQACB3GvLNhtFHB4U8D1PQGClmAZIMyvBLheawCu5ae5CXoazLzRXhuAeD9iwLU+4LAFwJ4AcKgNGBLoAa7B9QQhoEgQt4x0gID4GXDWLOBaBjhDA1YIggA7kDqCzG8I9GsZUJSDwyF8EEMqCh0ZIGQA/x5AAwrYAfg1AFhaQjT8KpcRFUB5CnbqBcF+PaEf9CIEuQZvNhs9wBkIcCgA7EkBO3X515H5wQBr/JZrMVwxoJvpGb6wr5qCHSygARrBmOukNZRPKLhWuxkZtwHYhQOOQSMYeozDAH4u4acRGCB8GcECGpqA4FoqChBxMzKBARoNASoUAmvKCIgZULKaIAAVSwqtAlLUYSgBZwqARiOAugnYGOAnYhlRq0w3DQg8BsNvk5CAKwQgUBADqDaCCQpZuCUEs4zMZrqDGHEYge4C/xDXYVQAN2qAs9sAdoGA47HaKU4AuJEGcCMDTUHhIP4DFpT7UQIuWwRc3gsgtpJK0BSoAFhzO1cgHEMG8R9oQYEpnYOHJICfdwxoQM/DTDsBh4p7QNExRAWw5n6TpLSPBITXEVQ30bhjnOZpBHYill5wagJqVqKXuqcQhRRc6gkCi1pMt5TfbgKKq4Jr8hMxrKjFNBOQ1m8DigYH8RA9CzLCJbipQipMcE1QUpAPYgSgSgLqn4I34FA6j2i3eSABezqANXvAlSbgRvtAR7YXZJJWyp5mLyrgCjPW2KpHteZa4eEHaeu0pF+GqfVSKjXzCgC3W01BdcBJE4A9rV5KHKC2nwKgXnWw1PrLJAn4CIBbEOCyecAqP3wBZoJrQtDnE+TgmngWlLRdMtIExC8hWxLBOwLskVUAAWcPEr9I8FN9GlQrbt0AsDIBt80BrkkBDeEkyAgfZ5A3UjaWgKGgBqDu4w+/F3ANPNaBrkjE6zDDLyFqK0hzI7h6EMMFJ8qC3TNglwJw9t8F7CrvYRBPgzTp1/IsmBMUATa+ByQG3HzS7wUBgN0QMPMrMkDIIa6s4DgOTyL8rwolOw1VQb0xLEjBHKBWKyD2FFck4Hw5Hqdt78PJhPP8724/Ps6fXvTxseUqm2lshd8w6rcyXQaZAQ3dBKw/wzn8iXHXC5LwXZexDKG9XXxw7u2/w9h7nH8stjYkBzUHMSQFdQAnyqe4IiB3Jszzg1MmfN94WvI0+xbc8/aZ8Dy++LDvDRDdTU42gDkbejm9OAJ/y3g4F25WPKeXGvLFpnYQN7aMXAVZ9+aAzjbMvlNVBP5s7FTypYQ2MgXpazIZwF6voTW4pozKZ9tqvnggh0vyXhi8vjBImoIGFBD/PMhMGZAP3eAkCW8vCW+hATjD3y4BAY3mE3Bz9eNSP/97Lxe05Td0y6ZTkAYQMwNusoDO0tXxCwVXcsDGxnCvCNhuAl4ADT2/bA5WXrmvgYLoj4YiBUTVAbOA/MmT+Z329YB7fj7b4QFn9TfEYMCexjEOU0g992Ykfh19v/1+lcvAOkHNDwktjWGmuAZPoAkoA3QMX+YXgPz27srOAm4QdUEtwB4IUG8TLfRLAGcUCbj/tvKAG3gKEpxG2gW8vMe4LMUZRQKGKZhUwRxYCs60lhEtQPQSIkpAaxN9fHZ4gpMnIDS+02cmueNU7GXWCoIwwJ4GIGgKXFcBOnFJz4vC9fUBowKXn4THnozhliun4EQHsKcOiEtAexHX9ZI3Lx/BEL793g8uO8mojjhjfEswC8IAe8qAyjPgauVm3v9JbxMd5l5pGx7m4Xiz/TWA+Tdiryw3J6AJuK88xQTeZOWAdzKPBBiO3gKADuC3eALw2dCBpuAEuYoAAI2GAK1ZqTKlAVgxerOFWMYbAjRaBcy+iW3ZTwNQvv6EK3hBEFtQwAJiT8ICQFkCVvipA9b5RcOYo1MQXdFCAo41ALfLqsqyKmC9X/jlhqMBOMYB6lwnwUbwgqMdJPvA76AeMGDbLXIjo3SYY+DrJB3AJVdIJK0EDFPw6eEAhSPYrhzAyoD7Eyi8CXYrrXK5yfphDJJ4vsYoG2+ZmF5jfg0zG1Yx7O1OZSiKqjGQAZyuI6Ufxcr+oJk3ML++rey7zTGMMj6pWGjHKv10AMs/NF94SrlUXQ/8BiZgmIIVgvWAYsHnKkEk4FQF0OZqq4FgHQ6ggP6EOwqAUwTgIAIc1ADi/MqAu4UrrqYopOAJHO7clqagiUtBAeBgAJ8CVQBtLgZU2snAAbnVJiByBIv8TPASojaIYXuY9Ms73IYCzuvH8M0AubSsgjyOfAdwwIA1DjhQBZxDAe0awG+kIAYw3MjYNh3g6C4BaxeSf4A1gKGgpD/Q5e4/QF57uSGojga+bfBCh+otAUc3ALQhgFESVvVIuyy6MN9+ZAmxi8jDAZYSMAwPcr/rF7v0LWOePnez/XAvXfqobYxRBrTaAASchBGAso10jjA6pqXPiXgeYzwT2wV30zz8hgPOo5dvBvD5/gBjQ8+YpsUkXoy0iW3hIo5ypm1Lx/BjANrcAre5uLw2uj7mIPJwgFVTIF9BU9Db1gNOXOAyErjjGNCmAxzdBtC2P6EJ+FEPWNMUV9jE6ALWpmArgNBZ0IP42ZwDazHnx2MfGPD8FuydBwHkDofEBHapNOa/CHBrQwbwgsOCBcBNdB2g+TCA3KofxB6Hhu3VCgae9asAbbt2GvQ+sgN4lHu1+LUzv/tUtxIHbufi9wsWEchCkt3BMGZHDcCHa0QdwR32fPkTNU8oBq5x9fslgJGgJxu/Sf6Zo+mb5fv+sRxRF/T8bRStwzbveZKVxPcy+dfQPrB9wFBQfD/MV2nuuV6YeMfT8VCO+P/6HmfxXsZiog7BwGdm1u+xNtJSQb6ofPrcc1dp9tn+Icq1UOunHOH/jBPR60zj3eDQqiIMfNPgEr9HPAtfY1f1+Qeuk+yfGY/4DtV6Z8MwEY+BZ7LzVwQ5wyDwowTNv+gNAKnrgdks3GxW1+JeuDTEnxgTLbt2wvdTF1EehrOhHefsmHmXOmIQTZLjeYHvJuWsBgGjTydarVbcjSP8z2TuMxmQL8nD8I+67PyV4byZPLfDWFSBtVsBbLOkXwR0dpyfnxc+71s8H8yXEh58e5R+tRl33sX16/C71wCaDw4YC14/JCsOy/EOJwRfTHg8+e40f0BJvvMvA7QAgAM/3KD8ICMaxz4r8TUK+HwPgHYR0H72jwe0X7KaZAUFfr8V0Mnk31GFL0nCjGDzgP+jBEQ0F0kB4/z7UYxcDsJG8N00F4H3MTWAcw2/JAdHmCUEBHhvDZaySZD5Jw2/WNAbkACqN1hiWnwhKWghBAfu4agF+BOloCX2s6Fd5lMNwD7tGLYs2CCOdsCerl8siJgBG2kyVywnIJ4TqRSMB7C2Xyh48rrgAUz1mMMg95hDv23AVLDvEfj9/BwPJngAN/CgjWzs5uhkdnPpKc66sOUOXvzNJwEMB3Enrmfb1/W4hpLoXilypAEEH4OzgnOaBAwBA7t4JlYCnKoCZglHo5H6CgyY+nItGjSAoaBXPNLBAefEgBJBYsABUQLGsyC3mgMcUQG+UQBeBVmDgLYu4BsScACaBZF7QHkdxuKHI5FftIx05QloN7KGNAwoPwUTAzLpiRiUgOhHXgWAz00DOukaTAqIqmk9OiDdKeR6GolT0HFAgET3cr8K8Oh1ZIDWvQHCjnG2ULAZQOeGgIN2AZ07B4QvwqqA+oOYHhA4A+pUBDUB3/4BlmuCdYAiwblyPaF9QK2KYNuAUMEGtjF6CdgYIGQWNBU202/ekTABD66J30QrjOByUZWV6/ntANoW9VFOr7UD5lfujmEDTAri12FhScFySQE70Hs5rR7zqh7pASYFFQCFd3IDn7CcFY5gTuWnD/g8ItwKCsuChPXAn7geiO7smGtsYq6tHThAld4EUWV6GlCV9E9xOVCntWiKXYMrABtLQUsA+Ex2qRSPYA651yTbwygDvtEB8umB6lqTwS7j0AO4vjMh052FT0Gd7pjoHXeoLtbjK2GiBJziEhAGSN3hdr4hJpkFwxlwkCSgTQ04agKQYgyfBUfekaC5SDwDkj7iAACkul+HCSZXm4efg7bfmyD/KLtTBWtwBAgRpF6Hr4KaDZZRbxbjQEDIHgY7gnPtbXSAJgQwEnQ0OyzDFdgSrcDEp5BKPzEgurKPe9zmkoJvXEcw2sE4Kn54QIFfrj8QuJOZ4nv17UrB+CZ3qiF4uVCv9JPVsfBrcPUATgFxg3iqIFhJyPUEM4+JAPzEgIIpEOaXAvbpZ0ETChgJng4qj3qdrg0dGgk4VU7AfgZQtU9aKwXPbTJvro9OwsMhejadKyYgSR2mXweoKQgH5DaLGmWwj7u614Yim34PowqIvt/UPo4kw5hFn9NxAC8ex2P6zDpX2URr1RHyfnDAZjbTTqZjOhrHkEf+Dz+ng8/n0pZosJ96IasAiFtGRHtBfApeBc34sfW6J1/jx/3D0WujOlIJS/kDZcBRM4CZrun+W5iFp+NB+LEn4e8co+zrWnU95TcArBAc6dVV8YJxFgbHw7H06SfJ552Ev+OH2WcVnlOnLyOAlxAUYEOzYP4zA98Yd10/SsRjDBnHT/LRT4HPXTPHBwXU9BsJZ8AQsFsCHGhcsWNTsPjwTbSnmZsD5kZ/YfDl85/CWS+MEXs258VPwnNaWIIzgIMy4EtVvBbivRzJq/7NxFcprn+pTSlqPiHQYh32171GP/oLrGui/CKX1y//aNkfPHkr5bdYVHitooIBggS/xIJowDgy3wjyx8WAX1JAkd87xE8ASJ2CGEBHHgqAX2oJSAr4KgKEpeBOJJgvK8TPcLryyM6WuS/eIQCV/JoHFAtWvLld9s2nn36FjATT5Zv4O1En4KsWIHwMowdx+osk0zyKiL9T9nvj/VSXEDgg0SxordQTDpaSl9ey2pgBxYCQHCwD/pXMgtE/nCrppOmYvBZsC/NX0681QHPWXOJVpeJudneAIsG/kGXEdNvTSxORm5RLyEtzgIAUNHnLfIkhwI8AsP8CJVRcRr5CP+8m4Ta/hLQDuPNuFK6puol+h/rF5ayXl0bPc183BGw8AXUB3yGANxvCuy8I4LsGYJ8GsG4zfRtBd2cSDWAqQNh5rnojc4NtzJdl3RuguKQgz8FoJ7NseSO9NKvWYNApGO7XImBUVrd4S0c5bpmCU0jZT70OUw8IEZxOoYM4PhFbqyYNXe7yzE0IqAzTKOCLWgrKa/vhv6PyJ3U5K66pXl6BFvClBlArBWGV6XJdMPnluc6sDhf9jQYV37jyDAKaAl9Rfum98A0AM2VpO/fxf/CS/rmmD75JoqxE5wH7YMBXtes5EWDFnVL5Aypyl+e1t0ntAWY7E+CAr4oHYiigQpACvqoB9jUA3xF11dsClgpZkD2gCLDYG3MbwB25380A+5qAqlfs1H7UdyEiwP69AO6I/XYW8XV6NWCfHhBynJP0KFD5iQHVboPbAMRcsbcGSHaM0wKEbaVhgu0CflEVYmqmwOYABYI3A/yrCvgCBexrH0Ygg3hHKrgTtGRBGgKhI7hVwOl/GlBDUA9QmXCnB6hxDu4TA77fBHB3M8B+NWC/4aKWuNmSOAFhgBp1BBFg//EBdbrKCQD7upX9Vo9zO8WuXsIBDAR8eRRAixbwBQ/YbwOQqqiFebDmi66lLQ/2f8zoIfBgaHNAAAAAAElFTkSuQmCC",
    "sports": "data:image/png;base64,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",
    "photography": "data:image/png;base64,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",
    "diy": "data:image/png;base64,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",
    "gift": "data:image/png;base64,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",
  };

  function categoryImage(hobby) {
    var key = (hobby && hobby.length) ? hobby[0] : "gift";
    return CATEGORY_IMAGES[key] || CATEGORY_IMAGES.gift;
  }

  function categoryFor(g) {
    if (g.hobby && g.hobby.length) return labelFor("hobby", g.hobby[0]);
    if (g.persona && g.persona.length) return labelFor("personality", g.persona[0]);
    return "Curated Pick";
  }

  function localGiftMatcher(ans, excludeTitles) {
    var exclude = Array.isArray(excludeTitles) ? excludeTitles : [];
    var pool = PRODUCT_POOL.filter(function (g) {
      return exclude.indexOf(g.title) === -1;
    });

    var hobbies = Array.isArray(ans.hobby) ? ans.hobby : [];
    var predefinedHobbies = hobbies.filter(function (h) {
      return !!(LABELS.hobby && LABELS.hobby[h]);
    });
    var customHobbies = hobbies.filter(function (h) {
      return !(LABELS.hobby && LABELS.hobby[h]);
    });

    var personas = Array.isArray(ans.personality) ? ans.personality : [];
    var aesthetic = ans.aesthetic;
    var style = ans.style; // practical | fun | sentimental | surprise
    var closeness = ans.closeness;
    var budgetIdx = BUDGET_BUCKETS.indexOf(ans.budget);

    var avoidWords = (ans.avoid || "")
      .toLowerCase()
      .split(/[,.\n]+/)
      .map(function (w) { return w.trim(); })
      .filter(function (w) { return w.length > 2; });

    var scored = pool.map(function (g) {
      var matchedHobbies = g.hobby.filter(function (h) {
        return predefinedHobbies.indexOf(h) !== -1;
      });
      var matchedPersonas = g.persona.filter(function (p) {
        return personas.indexOf(p) !== -1;
      });
      var matchedAesthetic = g.aesthetic.indexOf(aesthetic) !== -1;

      var score = matchedHobbies.length * 4 + matchedPersonas.length * 2.5;
      if (matchedAesthetic) score += 2;

      // Age relevance scoring
      if (Array.isArray(g.ages) && g.ages.length && ans.age) {
        if (g.ages.indexOf(ans.age) !== -1) {
          score += 3; // strong boost for age-appropriate gifts
        } else {
          score -= 2; // penalise age mismatches
        }
      }

      // Recipient relevance scoring
      if (Array.isArray(g.recipients) && g.recipients.length && ans.recipient) {
        if (g.recipients.indexOf(ans.recipient) !== -1) {
          score += 2.5; // boost for recipient-specific gifts
        } else {
          score -= 1;
        }
      }

      if (style === "surprise") {
        score += 1; // anything goes
      } else if (style === "sentimental") {
        score += g.sentimental ? 4 : 0;
      } else if (g.style === style) {
        score += 2;
      }

      if (g.sentimental && (closeness === "close" || closeness === "inseparable")) {
        score += 1; // personal gifts suit closer relationships
      }
      if (closeness === "acquaintance" && (g.style === "surprise" || g.style === "practical")) {
        score += 0.5; // safer, lower-pressure picks for newer relationships
      }
      if (!matchedHobbies.length && customHobbies.length && (g.style === "surprise" || g.sentimental)) {
        score += 0.75; // flexible/personal picks lean in when interests are bespoke
      }

      if (budgetIdx !== -1) {
        var diff = Math.min(Math.abs(priceBucketIndex(g.price) - budgetIdx), 3);
        score += BUDGET_FIT_SCORES[diff];
      }

      var text = (g.title + " " + g.desc).toLowerCase();
      var avoidedByWord = avoidWords.some(function (w) {
        return text.indexOf(w) !== -1;
      });

      var genderMismatch = false;
      if (g.genders) {
        if (ans.gender === "woman" && g.genders.indexOf("women") === -1) genderMismatch = true;
        if (ans.gender === "man" && g.genders.indexOf("men") === -1) genderMismatch = true;
      }

      var avoided = avoidedByWord || genderMismatch;
      if (avoided) score -= 50;

      score += Math.random() * 0.6; // gentle variety between runs

      return {
        gift: g,
        score: score,
        matchedHobbies: matchedHobbies,
        matchedPersonas: matchedPersonas,
        matchedAesthetic: matchedAesthetic,
        avoided: avoided
      };
    });

    var usable = scored.filter(function (s) { return !s.avoided; });
    if (usable.length < 6) usable = scored; // don't over-filter if it leaves too few

    usable.sort(function (a, b) {
      return b.score - a.score;
    });

    var count = Math.min(8, usable.length);
    var picks = usable.slice(0, count);

    return picks.map(function (p) {
      var g = p.gift;
      return {
        title: g.title,
        description: g.desc,
        why_it_matches: buildWhy(g, ans, p, customHobbies),
        price_range: "£" + g.price.toFixed(2),
        retailer: g.retailer,
        icon: g.icon,
        category: categoryFor(g),
        image_url: categoryImage(g.hobby),
        affiliate_link: g.retailer === "etsy" ? etsySearch(g.title) : amazonSearch(g.title)
      };
    });
  }

  function articleFor(word) {
    return /^[aeiou]/i.test(word) ? "an" : "a";
  }

  function buildWhy(g, ans, p, customHobbies) {
    var recipient = labelFor("recipient", ans.recipient).toLowerCase();
    var occasion = labelFor("occasion", ans.occasion);
    var pronoun = pronounsFor(ans.gender);
    var aestheticLabel = labelFor("aesthetic", ans.aesthetic).toLowerCase();

    if (p.matchedHobbies.length) {
      var interestNames = p.matchedHobbies
        .map(function (h) { return labelFor("hobby", h).toLowerCase(); })
        .join(" and ");
      if (p.matchedPersonas.length) {
        var traitName = labelFor("personality", p.matchedPersonas[0]).toLowerCase();
        return (
          "Built for " + articleFor(traitName) + " " + traitName + " " + recipient + " who loves " +
          interestNames + " — a natural fit for " + occasion + "."
        );
      }
      return (
        "A spot-on pick for " + pronoun.possessive + " love of " +
        interestNames + ", and easy to enjoy for " + occasion + "."
      );
    }

    if (g.sentimental && ans.style === "sentimental") {
      return (
        "A heartfelt, personalised touch that feels just right for " +
        occasion + ", especially given how close you are."
      );
    }

    if (p.matchedPersonas.length) {
      var traits = p.matchedPersonas
        .map(function (v) { return labelFor("personality", v).toLowerCase(); })
        .join(" and ");
      return (
        "Suits " + pronoun.possessive + " " + traits + " side perfectly and feels personal for " +
        occasion + "."
      );
    }

    if (p.matchedAesthetic) {
      return (
        "Matches " + pronoun.possessive + " " + aestheticLabel +
        " taste, and makes a thoughtful gift for " + occasion + "."
      );
    }

    if (customHobbies.length) {
      return (
        "A flexible pick that pairs nicely with " + pronoun.possessive +
        " interest in " + customHobbies[0] + " — great for " + occasion + "."
      );
    }

    if (ans.style === "surprise") {
      return (
        "A crowd-pleasing surprise that lands well for almost anyone — ideal for " +
        occasion + "."
      );
    }

    return (
      "A " + (ans.style === "fun" ? "fun, memorable" : "genuinely useful") +
      " choice " + pronoun.subject + "'ll appreciate for " + occasion + "."
    );
  }

  /* =======================================================
     9. RESULTS RENDERING
     ======================================================= */
  var grid = $("#results-grid");
  var allIdeas = []; // master list of all ideas loaded so far
  var activeFilter = "all"; // "all" | "amazon" | "etsy" | "sentimental" | "practical" | "fun"
  var activeSort = "match"; // "match" | "price-asc" | "price-desc"

  function parsePrice(priceStr) {
    if (!priceStr) return 0;
    var match = String(priceStr).match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
  }

  function getFilteredSorted() {
    var filtered = allIdeas.filter(function (g) {
      if (activeFilter === "all") return true;
      if (activeFilter === "amazon") return g.retailer === "amazon";
      if (activeFilter === "etsy") return g.retailer === "etsy";
      if (activeFilter === "sentimental") return g.why_it_matches && g.why_it_matches.toLowerCase().indexOf("heartfelt") !== -1 || (g.retailer === "etsy");
      if (activeFilter === "practical") return g.why_it_matches && (g.why_it_matches.toLowerCase().indexOf("practical") !== -1 || g.why_it_matches.toLowerCase().indexOf("useful") !== -1);
      if (activeFilter === "under20") return parsePrice(g.price_range) < 20;
      if (activeFilter === "under50") return parsePrice(g.price_range) < 50;
      return true;
    });

    if (activeSort === "price-asc") {
      filtered = filtered.slice().sort(function (a, b) {
        return parsePrice(a.price_range) - parsePrice(b.price_range);
      });
    } else if (activeSort === "price-desc") {
      filtered = filtered.slice().sort(function (a, b) {
        return parsePrice(b.price_range) - parsePrice(a.price_range);
      });
    }
    // "match" keeps original order

    return filtered;
  }

  function renderFilterSort() {
    var bar = $("#results-filter-bar");
    if (!bar) return;

    var filters = [
      { value: "all", label: "All" },
      { value: "amazon", label: "🛒 Amazon" },
      { value: "etsy", label: "🎨 Etsy" },
      { value: "under20", label: "Under £20" },
      { value: "under50", label: "Under £50" }
    ];

    var sorts = [
      { value: "match", label: "Best Match" },
      { value: "price-asc", label: "Price: Low–High" },
      { value: "price-desc", label: "Price: High–Low" }
    ];

    var filterHtml = filters.map(function (f) {
      return '<button class="filter-chip' + (activeFilter === f.value ? " is-active" : "") + '" data-filter="' + f.value + '">' + f.label + '</button>';
    }).join("");

    var sortHtml = '<select class="sort-select" id="sort-select">' +
      sorts.map(function (s) {
        return '<option value="' + s.value + '"' + (activeSort === s.value ? " selected" : "") + '>' + s.label + '</option>';
      }).join("") +
      '</select>';

    bar.innerHTML =
      '<div class="filter-bar__filters">' + filterHtml + '</div>' +
      '<div class="filter-bar__sort"><span class="filter-bar__sort-label">Sort:</span>' + sortHtml + '</div>';

    // Wire filter chips
    $all(".filter-chip", bar).forEach(function (btn) {
      btn.addEventListener("click", function () {
        activeFilter = btn.getAttribute("data-filter");
        renderFilterSort();
        refreshGrid();
      });
    });

    // Wire sort select
    var sortSel = $("#sort-select");
    if (sortSel) {
      sortSel.addEventListener("change", function () {
        activeSort = sortSel.value;
        refreshGrid();
      });
    }
  }

  function refreshGrid() {
    var visible = getFilteredSorted();
    grid.innerHTML = "";
    if (!visible.length) {
      grid.innerHTML = '<div class="notice" style="grid-column:1/-1"><p>No gifts match this filter — try a different one.</p></div>';
    } else {
      visible.forEach(function (gift, i) {
        grid.appendChild(buildCard(gift, i));
      });
    }
    $("#results-count").textContent = visible.length;
  }

  function renderResults(ideas, ans) {
    /* Reset filter/sort state on fresh results */
    allIdeas = ideas.slice();
    activeFilter = "all";
    activeSort = "match";

    /* summary chips */
    var summaryTags = $("#summary-tags");
    var parts = [];

    parts.push({ icon: "🎁", text: labelFor("recipient", ans.recipient) });
    if (ans.gender && ans.gender !== "unspecified") {
      parts.push({ icon: "🪪", text: labelFor("gender", ans.gender) });
    }
    parts.push({ icon: "📅", text: labelFor("occasion", ans.occasion) });
    parts.push({ icon: "💷", text: labelFor("budget", ans.budget) });
    if (Array.isArray(ans.personality) && ans.personality.length) {
      parts.push({ icon: "✨", text: labelsFor("personality", ans.personality) });
    }
    if (Array.isArray(ans.hobby) && ans.hobby.length) {
      parts.push({ icon: "❤️", text: labelsFor("hobby", ans.hobby) });
    }
    if (ans.aesthetic) {
      parts.push({ icon: "🎀", text: labelFor("aesthetic", ans.aesthetic) });
    }

    summaryTags.innerHTML = parts
      .map(function (p) {
        return (
          '<span class="tag"><i>' + p.icon + "</i>" + escapeHtml(p.text) + "</span>"
        );
      })
      .join("");

    $("#results-count").textContent = ideas.length;

    // Render filter/sort bar
    renderFilterSort();

    grid.innerHTML = "";
    ideas.forEach(function (gift, i) {
      grid.appendChild(buildCard(gift, i));
    });

    var moreBtn = $("#load-more");
    var moreNote = $("#load-more-note");
    moreBtn.hidden = false;
    moreBtn.disabled = false;
    moreBtn.textContent = "Show More Ideas";
    moreNote.hidden = true;

    showScreen("results");
  }

  function buildCard(gift, index) {
    var card = el("article", { class: "gift-card" });
    card.style.animationDelay = index * 0.07 + "s";

    var safeTitle = escapeHtml(gift.title);
    var retailerBadge = gift.retailer
      ? '<span class="gift-card__retailer gift-card__retailer--' +
        escapeHtml(gift.retailer) +
        '">' +
        (gift.retailer === "etsy" ? "Etsy" : "Amazon") +
        "</span>"
      : "";

    var hasPhoto = !!gift.image_url;
    var isIllustration = hasPhoto && gift.image_url.indexOf("data:") === 0;
    var mediaClass = "gift-card__media" + (hasPhoto && !isIllustration ? " gift-card__media--photo" : " gift-card__media--studio");
    var media;
    if (hasPhoto) {
      var fallbackJs =
        "this.onerror=null;this.style.display='none';" +
        "this.nextElementSibling.style.display='grid';";
      media =
        '<img src="' + escapeHtml(gift.image_url) + '" alt="' + safeTitle +
        '" loading="lazy" onerror="' + fallbackJs + '">' +
        '<span class="gift-card__medallion" style="display:none" aria-hidden="true">' +
        '<span class="gift-card__icon">' + (gift.icon || "🎁") + "</span>" +
        "</span>";
    } else {
      media =
        '<span class="gift-card__medallion" aria-hidden="true">' +
        '<span class="gift-card__icon">' + (gift.icon || "🎁") + "</span>" +
        "</span>";
    }

    var categoryKicker = gift.category
      ? '<p class="gift-card__category">' + escapeHtml(gift.category) + "</p>"
      : "";

    card.innerHTML =
      '<div class="' + mediaClass + '">' +
      media +
      retailerBadge +
      '<span class="gift-card__price">' +
      escapeHtml(gift.price_range) +
      "</span>" +
      "</div>" +
      '<div class="gift-card__body">' +
      categoryKicker +
      '<h3 class="gift-card__title">' +
      safeTitle +
      "</h3>" +
      '<p class="gift-card__desc">' +
      escapeHtml(gift.description) +
      "</p>" +
      '<div class="gift-card__why">' +
      '<span class="gift-card__why-label">✨ Why it matches</span>' +
      "<p>" +
      escapeHtml(gift.why_it_matches) +
      "</p>" +
      "</div>" +
      '<a class="btn btn--coral gift-card__cta" href="' +
      escapeHtml(gift.affiliate_link || "#") +
      '" target="_blank" rel="noopener noreferrer">View on ' +
      (gift.retailer === "etsy" ? "Etsy" : gift.retailer === "amazon" ? "Amazon" : "Gift") +
      ' <span class="btn__arrow">→</span></a>' +
      "</div>";

    return card;
  }

  function renderError() {
    grid.innerHTML =
      '<div class="notice" style="grid-column:1/-1">' +
      "<h3>We couldn't wrap that up</h3>" +
      "<p>Something interrupted the Gift Matcher. Give it another go — " +
      "your answers are still saved.</p>" +
      '<button class="btn btn--primary" id="retry-btn">Try again</button>' +
      "</div>";
    $("#summary-tags").innerHTML = "";
    $("#results-count").textContent = "0";
    showScreen("results");
    var retry = $("#retry-btn");
    if (retry) retry.addEventListener("click", function () {
      runMatcher(answers);
    });
  }

  /* =======================================================
     10. SHARE LINK (encode answers in the URL)
     ======================================================= */
  function encodeAnswers(ans) {
    try {
      return btoa(unescape(encodeURIComponent(JSON.stringify(ans))));
    } catch (e) {
      return "";
    }
  }
  function decodeAnswers(code) {
    try {
      return JSON.parse(decodeURIComponent(escape(atob(code))));
    } catch (e) {
      return null;
    }
  }

  function shareUrl(ans) {
    var base = location.origin + location.pathname;
    return base + "?gifts=" + encodeAnswers(ans);
  }

  function pushShareState(ans) {
    try {
      history.replaceState(null, "", "?gifts=" + encodeAnswers(ans));
    } catch (e) {
      /* ignore (e.g. file:// without history support) */
    }
  }

  function copyResultsLink() {
    var url = shareUrl(answers);
    var done = function () {
      showToast("Results link copied ✓");
    };
    var fail = function () {
      /* fallback for insecure / file contexts */
      var tmp = el("input");
      tmp.value = url;
      document.body.appendChild(tmp);
      tmp.select();
      try {
        document.execCommand("copy");
        done();
      } catch (e) {
        showToast("Copy this link: " + url);
      }
      document.body.removeChild(tmp);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(done).catch(fail);
    } else {
      fail();
    }
  }

  var toastTimer = null;
  function showToast(text) {
    var t = $("#toast");
    t.textContent = text;
    t.classList.add("is-show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      t.classList.remove("is-show");
    }, 2600);
  }

  /* =======================================================
     10b. SHOW MORE IDEAS
     ======================================================= */
  function loadMore() {
    var btn = $("#load-more");
    var note = $("#load-more-note");
    btn.disabled = true;
    btn.textContent = "Finding more…";

    generateGiftIdeas(answers, shownTitles)
      .then(function (ideas) {
        if (!ideas.length) {
          btn.hidden = true;
          note.hidden = false;
          return;
        }
        var startIndex = grid.children.length;
        allIdeas = allIdeas.concat(ideas);
        ideas.forEach(function (gift, i) {
          grid.appendChild(buildCard(gift, startIndex + i));
        });
        shownTitles = shownTitles.concat(ideas.map(function (g) { return g.title; }));
        $("#results-count").textContent = getFilteredSorted().length;
        renderFilterSort();
        btn.disabled = false;
        btn.textContent = "Show More Ideas";
      })
      .catch(function (err) {
        console.error(err);
        btn.disabled = false;
        btn.textContent = "Show More Ideas";
      });
  }

  /* =======================================================
     11. START OVER
     ======================================================= */
  function startOver() {
    answers = {};
    current = 0;
    try {
      history.replaceState(null, "", location.pathname);
    } catch (e) {}
    showScreen("home");
  }

  /* =======================================================
     12. HOMEPAGE: FAQ ACCORDION + SCROLL REVEAL
     ======================================================= */
  function initFaq() {
    $all(".faq-q").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var item = btn.closest(".faq-item");
        var answer = item.querySelector(".faq-a");
        var isOpen = item.classList.contains("is-open");

        if (isOpen) {
          item.classList.remove("is-open");
          btn.setAttribute("aria-expanded", "false");
          answer.style.maxHeight = "0px";
        } else {
          item.classList.add("is-open");
          btn.setAttribute("aria-expanded", "true");
          answer.style.maxHeight = answer.scrollHeight + "px";
        }
      });
    });
  }

  function initScrollReveal() {
    var targets = $all(".reveal");
    if (!targets.length) return;

    if (!("IntersectionObserver" in window)) {
      targets.forEach(function (t) { t.classList.add("is-visible"); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    targets.forEach(function (t) { observer.observe(t); });
  }

  /* =======================================================
     13. INIT + WIRING
     ======================================================= */
  function validAnswers(ans) {
    if (!ans || typeof ans !== "object") return false;
    return QUESTIONS.every(function (q) {
      // Optional questions can be skipped
      if (q.optional) return true;
      if (q.type === "multi") {
        return Array.isArray(ans[q.id]) && ans[q.id].length > 0;
      }
      if (q.type === "text") {
        return typeof ans[q.id] === "string";
      }
      return typeof ans[q.id] === "string" && (LABELS[q.id][ans[q.id]] || ans[q.id]);
    });
  }

  function init() {
    $("#start-quiz").addEventListener("click", startQuiz);
    $("#start-quiz-nav").addEventListener("click", startQuiz);
    $("#hero-search").addEventListener("submit", function (e) {
      e.preventDefault();
      startQuiz();
    });
    $("#start-over").addEventListener("click", startOver);
    $("#copy-link").addEventListener("click", copyResultsLink);
    $("#load-more").addEventListener("click", loadMore);
    $("#brand-home").addEventListener("click", function (e) {
      e.preventDefault();
      startOver();
    });

    initFaq();
    initScrollReveal();

    /* Deep link: ?gifts=<encoded answers> → jump straight to results */
    var params = new URLSearchParams(location.search);
    var code = params.get("gifts");
    if (code) {
      var decoded = decodeAnswers(code);
      if (validAnswers(decoded)) {
        answers = decoded;
        runMatcher(answers);
        return;
      }
    }
    showScreen("home");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  /* Expose for console/testing */
  window.Givter = {
    generateGiftIdeas: generateGiftIdeas,
    localGiftMatcher: localGiftMatcher
  };
})();
