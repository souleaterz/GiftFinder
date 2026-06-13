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
      kicker: "Tag 01",
      title: "Who is the gift for?",
      type: "single",
      options: [
        { value: "partner", label: "Partner", icon: "💝" },
        { value: "friend", label: "Friend", icon: "🤝" },
        { value: "parent", label: "Parent", icon: "🏡" },
        { value: "sibling", label: "Sibling", icon: "🧩" },
        { value: "coworker", label: "Coworker", icon: "💼" }
      ]
    },
    {
      id: "gender",
      kicker: "Tag 02",
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
      kicker: "Tag 03",
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
      kicker: "Tag 04",
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
      kicker: "Tag 05",
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
      kicker: "Tag 06",
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
      kicker: "Tag 07",
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
      kicker: "Tag 08",
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
      kicker: "Tag 09",
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
      kicker: "Tag 10",
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
      id: "avoid",
      kicker: "Tag 11",
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
      "Tag <b>" + pad2(current + 1) + "</b> of " + QUESTIONS.length;
    progressLabel.textContent = pct + "% complete";
  }

  function renderQuestion() {
    updateProgress();
    var q = QUESTIONS[current];

    var card = el("div", { class: "q-card q-anim" });

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
    // ===================== AMAZON (50) =====================
    { title: "Adjustable Resistance Bands Set", retailer: "amazon", price: 21.99, icon: "🏋️",
      hobby: ["gym"], persona: ["outdoorsy"], aesthetic: ["minimalist", "eco"], style: "practical", sentimental: false,
      desc: "A stackable set of resistance bands for strength training, mobility and travel workouts." },
    { title: "Premium Non-Slip Yoga Mat", retailer: "amazon", price: 27.99, icon: "🧘",
      hobby: ["gym"], persona: ["introvert", "outdoorsy"], aesthetic: ["minimalist", "eco"], style: "practical", sentimental: false,
      desc: "An extra-thick, grippy mat that makes home yoga and floor work far more comfortable." },
    { title: "Smart Insulated Water Bottle", retailer: "amazon", price: 32.99, icon: "🚰",
      hobby: ["gym", "travel"], persona: ["techy", "outdoorsy"], aesthetic: ["minimalist"], style: "practical", sentimental: false,
      desc: "Keeps drinks cold for 24 hours and glows to remind them to hit their hydration goal." },
    { title: "Mini Percussion Massage Gun", retailer: "amazon", price: 44.99, icon: "💪",
      hobby: ["gym"], persona: ["outdoorsy"], aesthetic: ["minimalist"], style: "practical", sentimental: false,
      desc: "A compact deep-tissue massager for easing sore muscles after training." },
    { title: "Mechanical RGB Gaming Keyboard", retailer: "amazon", price: 59.99, icon: "⌨️",
      hobby: ["gaming"], persona: ["techy"], aesthetic: ["bold"], style: "practical", sentimental: false,
      desc: "Tactile switches and customisable backlighting for faster, more satisfying play." },
    { title: "Wireless Gaming Headset", retailer: "amazon", price: 54.99, icon: "🎧",
      hobby: ["gaming", "music"], persona: ["techy"], aesthetic: ["bold", "minimalist"], style: "practical", sentimental: false,
      desc: "Clear chat audio and immersive sound for long gaming sessions, wire-free." },
    { title: "Retro Mini Arcade Console", retailer: "amazon", price: 64.99, icon: "🕹️",
      hobby: ["gaming"], persona: ["funny"], aesthetic: ["vintage", "bold"], style: "fun", sentimental: false,
      desc: "A pocket-sized arcade pre-loaded with hundreds of classic games and a real joystick." },
    { title: "Ambient RGB Light Bar", retailer: "amazon", price: 24.99, icon: "💡",
      hobby: ["gaming", "music"], persona: ["creative", "techy"], aesthetic: ["bold"], style: "fun", sentimental: false,
      desc: "Reactive desk lighting that syncs to music or screens and sets the mood." },
    { title: "Professional Chef's Knife", retailer: "amazon", price: 34.99, icon: "🔪",
      hobby: ["cooking"], persona: ["foodie"], aesthetic: ["minimalist", "vintage"], style: "practical", sentimental: false,
      desc: "A balanced, razor-sharp blade that makes everyday prep feel effortless." },
    { title: "Fresh Pasta Maker Machine", retailer: "amazon", price: 39.99, icon: "🍝",
      hobby: ["cooking"], persona: ["creative", "foodie"], aesthetic: ["cosy", "vintage"], style: "fun", sentimental: false,
      desc: "Roll, cut and shape restaurant-style pasta at home in minutes." },
    { title: "Mini Air Fryer", retailer: "amazon", price: 49.99, icon: "🍟",
      hobby: ["cooking"], persona: ["foodie"], aesthetic: ["minimalist"], style: "practical", sentimental: false,
      desc: "A compact countertop air fryer for crisp, low-oil cooking in small kitchens." },
    { title: "Electric Burr Coffee Grinder", retailer: "amazon", price: 27.99, icon: "☕",
      hobby: ["cooking"], persona: ["foodie"], aesthetic: ["minimalist"], style: "practical", sentimental: false,
      desc: "Freshly ground beans every morning, with adjustable settings for any brew method." },
    { title: "Packing Cubes Travel Set", retailer: "amazon", price: 22.99, icon: "🧳",
      hobby: ["travel"], persona: ["minimalist"], aesthetic: ["minimalist"], style: "practical", sentimental: false,
      desc: "Colour-coded cubes that turn any suitcase into a tidy, organised carry-on." },
    { title: "Memory Foam Travel Pillow", retailer: "amazon", price: 17.99, icon: "😴",
      hobby: ["travel"], persona: [], aesthetic: ["minimalist", "cosy"], style: "practical", sentimental: false,
      desc: "Proper neck support for flights, trains and long car journeys." },
    { title: "Anti-Theft Travel Backpack", retailer: "amazon", price: 44.99, icon: "🎒",
      hobby: ["travel"], persona: ["adventurous", "techy"], aesthetic: ["minimalist"], style: "practical", sentimental: false,
      desc: "Hidden zips and a USB charging port make this a smart everyday travel companion." },
    { title: "Universal Travel Adapter", retailer: "amazon", price: 15.99, icon: "🔌",
      hobby: ["travel"], persona: ["techy"], aesthetic: ["minimalist"], style: "practical", sentimental: false,
      desc: "One compact adapter that works in over 150 countries, with built-in USB ports." },
    { title: "LED Rechargeable Book Light", retailer: "amazon", price: 11.99, icon: "🔆",
      hobby: ["reading"], persona: ["introvert", "bookish"], aesthetic: ["minimalist"], style: "practical", sentimental: false,
      desc: "A warm, clip-on glow for late chapters without disturbing anyone else." },
    { title: "Kindle Paperwhite E-reader", retailer: "amazon", price: 139.99, icon: "📱",
      hobby: ["reading"], persona: ["bookish", "minimalist"], aesthetic: ["minimalist"], style: "practical", sentimental: false,
      desc: "A glare-free, waterproof e-reader that holds thousands of books in your pocket." },
    { title: "Cosy Reading Pillow with Arms", retailer: "amazon", price: 24.99, icon: "📚",
      hobby: ["reading"], persona: ["introvert", "bookish"], aesthetic: ["cosy"], style: "fun", sentimental: false,
      desc: "A backrest pillow built for long, comfortable reading sessions in bed." },
    { title: "Audiobook Membership Gift Card", retailer: "amazon", price: 44.99, icon: "🎧",
      hobby: ["reading", "travel"], persona: ["bookish"], aesthetic: ["minimalist"], style: "practical", sentimental: false,
      desc: "Months of audiobooks to enjoy on commutes, walks and road trips." },
    { title: "True Wireless Earbuds", retailer: "amazon", price: 39.99, icon: "🎵",
      hobby: ["music", "gym", "travel"], persona: ["techy"], aesthetic: ["minimalist"], style: "practical", sentimental: false,
      desc: "Compact, sweat-resistant earbuds with rich sound and all-day battery life." },
    { title: "Portable Bluetooth Speaker", retailer: "amazon", price: 29.99, icon: "🔊",
      hobby: ["music"], persona: ["funny", "creative"], aesthetic: ["bold"], style: "fun", sentimental: false,
      desc: "A rugged, splash-proof speaker that's the life of any garden or kitchen gathering." },
    { title: "Vinyl Record Player with Speakers", retailer: "amazon", price: 79.99, icon: "🎶",
      hobby: ["music"], persona: ["creative"], aesthetic: ["vintage"], style: "fun", sentimental: false,
      desc: "A retro-styled turntable with built-in speakers, ready to play straight out of the box." },
    { title: "Mini Smart Projector", retailer: "amazon", price: 69.99, icon: "🎬",
      hobby: ["movies", "gaming"], persona: ["techy"], aesthetic: ["minimalist"], style: "fun", sentimental: false,
      desc: "Turns any wall into a big screen for movie nights, gaming or sports." },
    { title: "Stovetop Popcorn Maker", retailer: "amazon", price: 19.99, icon: "🍿",
      hobby: ["movies", "cooking"], persona: ["funny", "foodie"], aesthetic: ["vintage", "cosy"], style: "fun", sentimental: false,
      desc: "Classic stovetop popcorn for an instant movie-night upgrade." },
    { title: "Streaming Media Stick", retailer: "amazon", price: 39.99, icon: "📺",
      hobby: ["movies"], persona: ["techy"], aesthetic: ["minimalist"], style: "practical", sentimental: false,
      desc: "Plugs into any TV to bring every streaming app to the screen in seconds." },
    { title: "Watercolour Paint Set", retailer: "amazon", price: 24.99, icon: "🎨",
      hobby: ["art"], persona: ["creative"], aesthetic: ["cosy", "bold"], style: "fun", sentimental: false,
      desc: "Artist-grade paints, brushes and paper for picking up a relaxing new hobby." },
    { title: "Graphics Drawing Tablet", retailer: "amazon", price: 59.99, icon: "🖥️",
      hobby: ["art", "photography"], persona: ["creative", "techy"], aesthetic: ["minimalist"], style: "practical", sentimental: false,
      desc: "A pressure-sensitive pen tablet for digital art, design and photo editing." },
    { title: "Calligraphy Pen Set", retailer: "amazon", price: 19.99, icon: "🖋️",
      hobby: ["art"], persona: ["creative", "minimalist"], aesthetic: ["minimalist", "vintage"], style: "fun", sentimental: false,
      desc: "Brush pens, guides and practice pads for beautiful modern lettering." },
    { title: "Genuine Leather Wallet", retailer: "amazon", price: 29.99, icon: "👛",
      hobby: ["fashion"], persona: ["minimalist"], aesthetic: ["vintage", "minimalist"], style: "practical", sentimental: false,
      desc: "A slim, full-grain leather wallet that ages beautifully with everyday use." },
    { title: "Silk Scarf", retailer: "amazon", price: 24.99, icon: "🧣", genders: ["women"],
      hobby: ["fashion"], persona: ["creative"], aesthetic: ["bold", "vintage"], style: "fun", sentimental: false,
      desc: "A luxuriously soft printed scarf that dresses up any outfit." },
    { title: "Jewellery Organiser Box", retailer: "amazon", price: 19.99, icon: "💍", genders: ["women"],
      hobby: ["fashion"], persona: ["minimalist"], aesthetic: ["minimalist", "cosy"], style: "practical", sentimental: false,
      desc: "A velvet-lined case that keeps rings, necklaces and earrings tangle-free." },
    { title: "Self-Watering Herb Garden Kit", retailer: "amazon", price: 38.99, icon: "🌿",
      hobby: ["gardening", "cooking"], persona: ["outdoorsy", "foodie"], aesthetic: ["eco", "cosy"], style: "practical", sentimental: false,
      desc: "A countertop kit that grows fresh herbs on a sunny windowsill year-round." },
    { title: "Ergonomic Gardening Tool Set", retailer: "amazon", price: 24.99, icon: "🌱",
      hobby: ["gardening"], persona: ["outdoorsy"], aesthetic: ["eco"], style: "practical", sentimental: false,
      desc: "Comfort-grip tools that make borders, pots and beds a pleasure to tend." },
    { title: "Digital Plant Moisture Meter", retailer: "amazon", price: 10.99, icon: "🪴",
      hobby: ["gardening"], persona: ["techy", "outdoorsy"], aesthetic: ["eco", "minimalist"], style: "practical", sentimental: false,
      desc: "A simple probe that tells them exactly when each plant needs water." },
    { title: "Wi-Fi Pet Camera with Treat Dispenser", retailer: "amazon", price: 54.99, icon: "🐶",
      hobby: ["pets"], persona: ["techy", "sentimental"], aesthetic: ["minimalist"], style: "practical", sentimental: false,
      desc: "Check in on (and treat!) their pet from anywhere via a phone app." },
    { title: "Interactive Dog Puzzle Toy", retailer: "amazon", price: 14.99, icon: "🦴",
      hobby: ["pets"], persona: ["outdoorsy"], aesthetic: ["cosy"], style: "fun", sentimental: false,
      desc: "A treat-hiding puzzle that keeps an energetic dog entertained for hours." },
    { title: "Cat Play Tunnel", retailer: "amazon", price: 18.99, icon: "🐱",
      hobby: ["pets"], persona: ["funny"], aesthetic: ["bold", "cosy"], style: "fun", sentimental: false,
      desc: "A crinkly, collapsible tunnel that's an instant hit with curious cats." },
    { title: "Official Size Match Football", retailer: "amazon", price: 19.99, icon: "⚽",
      hobby: ["sports"], persona: ["outdoorsy", "adventurous"], aesthetic: ["bold"], style: "fun", sentimental: false,
      desc: "A durable, all-weather football for the park, garden or five-a-side." },
    { title: "Fitness Tracker Watch", retailer: "amazon", price: 39.99, icon: "⌚",
      hobby: ["sports", "gym"], persona: ["techy", "outdoorsy"], aesthetic: ["minimalist"], style: "practical", sentimental: false,
      desc: "Tracks steps, heart rate, sleep and workouts, with smartphone notifications." },
    { title: "Insulated Sports Water Bottle", retailer: "amazon", price: 21.99, icon: "🥤",
      hobby: ["sports", "gym"], persona: ["outdoorsy"], aesthetic: ["bold", "minimalist"], style: "practical", sentimental: false,
      desc: "A leak-proof bottle that keeps drinks cold through a full match or session." },
    { title: "Instant Print Camera", retailer: "amazon", price: 79.99, icon: "📸",
      hobby: ["photography", "travel"], persona: ["creative", "adventurous"], aesthetic: ["vintage", "bold"], style: "fun", sentimental: false,
      desc: "Snap and print keepsake photos on the spot, retro-style." },
    { title: "Lightweight Travel Tripod", retailer: "amazon", price: 24.99, icon: "📷",
      hobby: ["photography"], persona: ["techy", "adventurous"], aesthetic: ["minimalist"], style: "practical", sentimental: false,
      desc: "A compact tripod that folds down small but holds steady for sharp shots." },
    { title: "Camera Lens Cleaning Kit", retailer: "amazon", price: 13.99, icon: "🧹",
      hobby: ["photography"], persona: ["techy"], aesthetic: ["minimalist"], style: "practical", sentimental: false,
      desc: "Everything needed to keep lenses spotless and scratch-free." },
    { title: "Cordless Screwdriver Set", retailer: "amazon", price: 34.99, icon: "🔩",
      hobby: ["diy"], persona: ["techy", "minimalist"], aesthetic: ["minimalist"], style: "practical", sentimental: false,
      desc: "A precision screwdriver with interchangeable bits and USB-C charging." },
    { title: "Multi-Tool Pocket Gadget", retailer: "amazon", price: 29.99, icon: "🛠️",
      hobby: ["diy", "travel"], persona: ["outdoorsy", "minimalist"], aesthetic: ["minimalist", "eco"], style: "practical", sentimental: false,
      desc: "A compact, sturdy multi-tool that's handy for fixes on the go." },
    { title: "Wall-Mounted Tool Organiser", retailer: "amazon", price: 24.99, icon: "🧰",
      hobby: ["diy"], persona: ["minimalist"], aesthetic: ["minimalist", "eco"], style: "practical", sentimental: false,
      desc: "A pegboard-style organiser that keeps a workshop or shed tidy." },
    { title: "Luxury Chocolate Gift Box", retailer: "amazon", price: 21.99, icon: "🍫",
      hobby: ["cooking"], persona: ["foodie"], aesthetic: ["cosy", "bold"], style: "surprise", sentimental: false,
      desc: "A curated selection of premium chocolates from small-batch makers." },
    { title: "Scented Candle Gift Set", retailer: "amazon", price: 22.99, icon: "🕯️",
      hobby: [], persona: ["introvert"], aesthetic: ["cosy", "minimalist"], style: "surprise", sentimental: false,
      desc: "Three hand-poured candles in seasonal scents with a long, clean burn." },
    { title: "Aromatherapy Essential Oil Diffuser", retailer: "amazon", price: 29.99, icon: "🌬️",
      hobby: [], persona: ["introvert"], aesthetic: ["cosy", "eco"], style: "practical", sentimental: false,
      desc: "A calming mist of essential oils to turn any room into a retreat." },

    // ===================== ETSY (20) =====================
    { title: "Personalised Name Necklace", retailer: "etsy", price: 22.0, icon: "💛", genders: ["women"],
      hobby: ["fashion"], persona: ["sentimental"], aesthetic: ["minimalist", "bold"], style: "sentimental", sentimental: true,
      desc: "A dainty, handmade necklace featuring their name in delicate lettering." },
    { title: "Custom Star Map Print", retailer: "etsy", price: 28.0, icon: "🌌",
      hobby: ["art"], persona: ["creative", "sentimental"], aesthetic: ["vintage", "minimalist"], style: "sentimental", sentimental: true,
      desc: "The night sky from a date that matters, printed as framed wall art." },
    { title: "Personalised Engraved Leather Wallet", retailer: "etsy", price: 35.0, icon: "👝",
      hobby: ["fashion"], persona: ["sentimental", "minimalist"], aesthetic: ["vintage"], style: "sentimental", sentimental: true,
      desc: "A handcrafted leather wallet engraved with their initials or a short message." },
    { title: "Custom Illustrated Pet Portrait", retailer: "etsy", price: 32.0, icon: "🐾",
      hobby: ["pets", "art"], persona: ["sentimental", "creative"], aesthetic: ["bold", "vintage"], style: "sentimental", sentimental: true,
      desc: "A hand-illustrated portrait of their pet, made from a favourite photo." },
    { title: "Personalised Photo Memory Book", retailer: "etsy", price: 30.0, icon: "📔",
      hobby: ["photography", "travel"], persona: ["sentimental"], aesthetic: ["cosy", "vintage"], style: "sentimental", sentimental: true,
      desc: "A beautifully printed photo book telling the story of shared memories." },
    { title: "Engraved Wooden Cutting Board", retailer: "etsy", price: 28.0, icon: "🪵",
      hobby: ["cooking"], persona: ["sentimental", "foodie"], aesthetic: ["cosy", "vintage"], style: "sentimental", sentimental: true,
      desc: "A handsome oak board engraved with their name, a date, or a family recipe." },
    { title: "Personalised Cufflinks", retailer: "etsy", price: 24.0, icon: "🎩", genders: ["men"],
      hobby: ["fashion"], persona: ["sentimental", "minimalist"], aesthetic: ["vintage"], style: "sentimental", sentimental: true,
      desc: "Engraved cufflinks with initials, coordinates, or a hidden handwritten note." },
    { title: "Custom Family Tree Print", retailer: "etsy", price: 26.0, icon: "🌳",
      hobby: ["art"], persona: ["sentimental"], aesthetic: ["vintage", "cosy"], style: "sentimental", sentimental: true,
      desc: "A hand-drawn family tree print personalised with names and dates." },
    { title: "Birth Flower Necklace", retailer: "etsy", price: 20.0, icon: "🌷", genders: ["women"],
      hobby: ["fashion"], persona: ["sentimental"], aesthetic: ["minimalist", "bold"], style: "sentimental", sentimental: true,
      desc: "A delicate pendant featuring the flower associated with their birth month." },
    { title: "Personalised Recipe Blanket", retailer: "etsy", price: 45.0, icon: "🧶",
      hobby: ["cooking"], persona: ["sentimental", "foodie"], aesthetic: ["cosy"], style: "sentimental", sentimental: true,
      desc: "A soft woven blanket printed with a treasured family recipe, in their handwriting if you like." },
    { title: "Custom Song Lyrics Print", retailer: "etsy", price: 24.0, icon: "🎼",
      hobby: ["music", "art"], persona: ["sentimental", "creative"], aesthetic: ["minimalist", "vintage"], style: "sentimental", sentimental: true,
      desc: "A meaningful lyric or sound-wave print from a song that matters to them." },
    { title: "Personalised Leather Journal", retailer: "etsy", price: 26.0, icon: "📓",
      hobby: ["reading", "art"], persona: ["sentimental", "bookish"], aesthetic: ["vintage", "cosy"], style: "sentimental", sentimental: true,
      desc: "A hand-bound leather journal embossed with their name or initials." },
    { title: "Engraved Whisky Glasses Set", retailer: "etsy", price: 32.0, icon: "🥃",
      hobby: [], persona: ["sentimental", "foodie"], aesthetic: ["vintage"], style: "sentimental", sentimental: true,
      desc: "A pair of glasses etched with initials, coordinates, or a special date." },
    { title: "Custom Embroidered Hoodie", retailer: "etsy", price: 38.0, icon: "🧥",
      hobby: ["fashion"], persona: ["sentimental"], aesthetic: ["cosy", "bold"], style: "sentimental", sentimental: true,
      desc: "A cosy hoodie embroidered with a name, date, or in-joke." },
    { title: "Personalised Phone Case", retailer: "etsy", price: 18.0, icon: "📱",
      hobby: ["fashion", "photography"], persona: ["sentimental", "creative"], aesthetic: ["bold", "minimalist"], style: "sentimental", sentimental: true,
      desc: "A custom-printed phone case featuring a photo, name or design of their choice." },
    { title: "Custom Illustrated Couple Portrait", retailer: "etsy", price: 40.0, icon: "💑",
      hobby: ["art"], persona: ["sentimental", "creative"], aesthetic: ["bold", "vintage"], style: "sentimental", sentimental: true,
      desc: "A hand-drawn portrait capturing the two of you in a chosen scene or style." },
    { title: "Memory Jar Kit with Prompt Cards", retailer: "etsy", price: 22.0, icon: "🫙",
      hobby: [], persona: ["sentimental", "introvert"], aesthetic: ["cosy", "vintage"], style: "sentimental", sentimental: true,
      desc: "A keepsake jar with prompt cards for notes, tickets and memories to open later." },
    { title: "Personalised Engraved Keyring", retailer: "etsy", price: 14.0, icon: "🔑",
      hobby: [], persona: ["sentimental", "minimalist"], aesthetic: ["minimalist"], style: "sentimental", sentimental: true,
      desc: "A small everyday keepsake engraved with a name, date or short message." },
    { title: "Custom Enamel Pin", retailer: "etsy", price: 10.0, icon: "📌",
      hobby: ["art", "fashion"], persona: ["creative", "funny"], aesthetic: ["bold"], style: "fun", sentimental: false,
      desc: "A playful custom-designed enamel pin for a jacket, bag or pinboard." },
    { title: "Birthstone Bracelet", retailer: "etsy", price: 28.0, icon: "💎", genders: ["women"],
      hobby: ["fashion"], persona: ["sentimental"], aesthetic: ["minimalist", "bold"], style: "sentimental", sentimental: true,
      desc: "A delicate bracelet featuring their birthstone, handmade to order." },
    { title: "Foam Roller", retailer: "amazon", price: 19.99, icon: "🧘",
      hobby: ["gym"], persona: ["outdoorsy"], aesthetic: ["minimalist"], style: "practical", sentimental: false,
      desc: "A firm foam roller for easing tight muscles after training." },
    { title: "Skipping Rope with Counter", retailer: "amazon", price: 12.99, icon: "🪢",
      hobby: ["gym"], persona: ["outdoorsy"], aesthetic: ["minimalist", "bold"], style: "fun", sentimental: false,
      desc: "A speed rope with a built-in counter for quick, effective cardio anywhere." },
    { title: "Padded Gym Gloves", retailer: "amazon", price: 14.99, icon: "🧤",
      hobby: ["gym"], persona: ["outdoorsy"], aesthetic: ["minimalist"], style: "practical", sentimental: false,
      desc: "Breathable, padded gloves that protect hands during lifting sessions." },
    { title: "Protein Shaker Bottle Set", retailer: "amazon", price: 13.99, icon: "🥤",
      hobby: ["gym"], persona: ["outdoorsy", "foodie"], aesthetic: ["minimalist"], style: "practical", sentimental: false,
      desc: "Leak-proof shakers with a mixing ball, perfect for the gym bag." },
    { title: "Controller Charging Dock", retailer: "amazon", price: 18.99, icon: "🔌",
      hobby: ["gaming"], persona: ["techy"], aesthetic: ["minimalist", "bold"], style: "practical", sentimental: false,
      desc: "Keeps two controllers charged and ready, with LED status lights." },
    { title: "Memory Foam Gaming Chair Cushion", retailer: "amazon", price: 27.99, icon: "🪑",
      hobby: ["gaming"], persona: ["techy", "introvert"], aesthetic: ["cosy"], style: "practical", sentimental: false,
      desc: "A supportive cushion set that makes long sessions far more comfortable." },
    { title: "Extra-Large Desk Mouse Mat", retailer: "amazon", price: 16.99, icon: "🖱️",
      hobby: ["gaming"], persona: ["techy", "creative"], aesthetic: ["bold", "minimalist"], style: "practical", sentimental: false,
      desc: "A full-desk mat that protects surfaces and gives mouse and keyboard room to roam." },
    { title: "Digital Game Store Gift Card", retailer: "amazon", price: 25.0, icon: "🎮",
      hobby: ["gaming"], persona: ["techy", "funny"], aesthetic: ["bold"], style: "surprise", sentimental: false,
      desc: "Credit to spend on whatever they're currently excited to play." },
    { title: "Sourdough Baking Kit", retailer: "amazon", price: 29.99, icon: "🍞",
      hobby: ["cooking"], persona: ["foodie", "creative"], aesthetic: ["cosy"], style: "fun", sentimental: false,
      desc: "Everything needed to start a sourdough starter and bake the first loaf." },
    { title: "Cocktail Making Set", retailer: "amazon", price: 34.99, icon: "🍸",
      hobby: ["cooking"], persona: ["foodie", "funny"], aesthetic: ["bold", "vintage"], style: "fun", sentimental: false,
      desc: "A bartender's kit with shaker, jigger, strainer and recipe booklet." },
    { title: "Tea Sampler Gift Box", retailer: "amazon", price: 18.99, icon: "🍵",
      hobby: ["cooking"], persona: ["foodie", "introvert"], aesthetic: ["cosy"], style: "surprise", sentimental: false,
      desc: "A selection of loose-leaf teas from around the world, beautifully boxed." },
    { title: "Professional Knife Sharpener", retailer: "amazon", price: 22.99, icon: "🔪",
      hobby: ["cooking"], persona: ["foodie"], aesthetic: ["minimalist"], style: "practical", sentimental: false,
      desc: "A simple pull-through sharpener that keeps kitchen knives razor-ready." },
    { title: "Ceramic Bakeware Set", retailer: "amazon", price: 44.99, icon: "🍰",
      hobby: ["cooking"], persona: ["foodie"], aesthetic: ["cosy", "minimalist"], style: "practical", sentimental: false,
      desc: "A set of oven-to-table dishes for bakes, roasts and casseroles." },
    { title: "Travel Document Organiser", retailer: "amazon", price: 16.99, icon: "🗂️",
      hobby: ["travel"], persona: ["minimalist"], aesthetic: ["minimalist"], style: "practical", sentimental: false,
      desc: "Keeps passports, tickets and cards together and easy to find at the gate." },
    { title: "Packable Rain Jacket", retailer: "amazon", price: 34.99, icon: "🧥",
      hobby: ["travel"], persona: ["outdoorsy", "adventurous"], aesthetic: ["minimalist", "eco"], style: "practical", sentimental: false,
      desc: "A lightweight jacket that folds into its own pocket for unpredictable weather." },
    { title: "Portable Power Bank Charger", retailer: "amazon", price: 24.99, icon: "🔋",
      hobby: ["travel"], persona: ["techy"], aesthetic: ["minimalist"], style: "practical", sentimental: false,
      desc: "A pocket-sized battery that keeps phones and earbuds going all day." },
    { title: "Leather Travel Journal", retailer: "amazon", price: 22.99, icon: "📓",
      hobby: ["travel"], persona: ["sentimental", "bookish"], aesthetic: ["vintage", "cosy"], style: "sentimental", sentimental: true,
      desc: "A refillable leather journal for trip notes, sketches and tickets." },
    { title: "Set of Magnetic Bookmarks", retailer: "amazon", price: 9.99, icon: "🔖",
      hobby: ["reading"], persona: ["bookish", "creative"], aesthetic: ["bold", "minimalist"], style: "fun", sentimental: false,
      desc: "A set of slim magnetic bookmarks in playful designs that never fall out." },
    { title: "Canvas Library Tote Bag", retailer: "amazon", price: 14.99, icon: "👜", genders: ["women"],
      hobby: ["reading"], persona: ["bookish", "minimalist"], aesthetic: ["minimalist", "eco"], style: "practical", sentimental: false,
      desc: "A sturdy canvas tote with room for a stack of books and a flask." },
    { title: "Monthly Book Subscription Box", retailer: "amazon", price: 29.99, icon: "📦",
      hobby: ["reading"], persona: ["bookish"], aesthetic: ["cosy"], style: "surprise", sentimental: false,
      desc: "A surprise novel and bookish treats delivered every month." },
    { title: "Clip-On Guitar Tuner", retailer: "amazon", price: 12.99, icon: "🎸",
      hobby: ["music"], persona: ["creative", "techy"], aesthetic: ["minimalist"], style: "practical", sentimental: false,
      desc: "A simple clip-on tuner that keeps any stringed instrument in tune." },
    { title: "Harmonica", retailer: "amazon", price: 16.99, icon: "🎶",
      hobby: ["music"], persona: ["creative", "funny"], aesthetic: ["vintage", "bold"], style: "fun", sentimental: false,
      desc: "A classic blues harmonica, easy to pick up and surprisingly addictive." },
    { title: "Bluetooth Karaoke Microphone", retailer: "amazon", price: 32.99, icon: "🎤",
      hobby: ["music"], persona: ["funny", "creative"], aesthetic: ["bold"], style: "fun", sentimental: false,
      desc: "A portable mic with built-in speaker for instant living-room karaoke." },
    { title: "Sleeved Hoodie Blanket", retailer: "amazon", price: 24.99, icon: "🛋️",
      hobby: ["movies"], persona: ["introvert"], aesthetic: ["cosy"], style: "fun", sentimental: false,
      desc: "A giant, wearable blanket with sleeves and a pocket — built for movie marathons." },
    { title: "Film Reel Desk Lamp", retailer: "amazon", price: 27.99, icon: "💡",
      hobby: ["movies"], persona: ["creative", "sentimental"], aesthetic: ["vintage"], style: "sentimental", sentimental: true,
      desc: "A retro film-reel shaped lamp that throws a warm, nostalgic glow." },
    { title: "Vintage Cinema Poster Print", retailer: "amazon", price: 19.99, icon: "🎞️",
      hobby: ["movies"], persona: ["creative"], aesthetic: ["vintage"], style: "sentimental", sentimental: false,
      desc: "A retro-style cinema print that adds character to any wall." },
    { title: "Premium Sketchbook Set", retailer: "amazon", price: 17.99, icon: "📓",
      hobby: ["art"], persona: ["creative"], aesthetic: ["minimalist", "cosy"], style: "fun", sentimental: false,
      desc: "Heavyweight paper sketchbooks in a few sizes, ready for any medium." },
    { title: "Acrylic Paint Set", retailer: "amazon", price: 21.99, icon: "🎨",
      hobby: ["art"], persona: ["creative"], aesthetic: ["bold"], style: "fun", sentimental: false,
      desc: "A vibrant set of acrylics with brushes, ready for canvas or crafts." },
    { title: "Embroidery Starter Kit", retailer: "amazon", price: 18.99, icon: "🧵",
      hobby: ["art"], persona: ["creative"], aesthetic: ["cosy", "vintage"], style: "fun", sentimental: false,
      desc: "Hoops, threads and patterns for a relaxing, screen-free hobby." },
    { title: "Polymer Clay Modelling Kit", retailer: "amazon", price: 19.99, icon: "🏺",
      hobby: ["art"], persona: ["creative"], aesthetic: ["bold", "eco"], style: "fun", sentimental: false,
      desc: "A colourful clay set for sculpting charms, dishes and small sculptures." },
    { title: "Ribbed Knit Beanie Hat", retailer: "amazon", price: 14.99, icon: "🧢",
      hobby: ["fashion"], persona: ["minimalist"], aesthetic: ["cosy", "minimalist"], style: "practical", sentimental: false,
      desc: "A soft, ribbed beanie that pairs with everything from autumn to spring." },
    { title: "Classic Aviator Sunglasses", retailer: "amazon", price: 24.99, icon: "🕶️",
      hobby: ["fashion"], persona: ["creative"], aesthetic: ["vintage", "bold"], style: "fun", sentimental: false,
      desc: "Timeless aviators with UV protection and a comfortable fit." },
    { title: "Canvas Tote Bag", retailer: "amazon", price: 14.99, icon: "👜", genders: ["women"],
      hobby: ["fashion"], persona: ["minimalist"], aesthetic: ["minimalist", "eco"], style: "practical", sentimental: false,
      desc: "A durable everyday tote made from heavyweight organic cotton canvas." },
    { title: "Minimalist Analog Watch", retailer: "amazon", price: 49.99, icon: "⌚",
      hobby: ["fashion"], persona: ["minimalist", "sentimental"], aesthetic: ["minimalist", "vintage"], style: "sentimental", sentimental: false,
      desc: "A clean-faced watch with a leather strap that suits any outfit." },
    { title: "Bonsai Tree Starter Kit", retailer: "amazon", price: 24.99, icon: "🌳",
      hobby: ["gardening"], persona: ["outdoorsy", "creative"], aesthetic: ["eco", "minimalist"], style: "fun", sentimental: false,
      desc: "Everything needed to grow and shape a bonsai tree from seed." },
    { title: "Succulent Collection Set", retailer: "amazon", price: 22.99, icon: "🪴",
      hobby: ["gardening"], persona: ["outdoorsy"], aesthetic: ["eco", "minimalist"], style: "surprise", sentimental: false,
      desc: "A set of easy-care succulents in matching pots, ready to display." },
    { title: "Wild Bird Feeder", retailer: "amazon", price: 19.99, icon: "🐦",
      hobby: ["gardening"], persona: ["outdoorsy"], aesthetic: ["eco"], style: "practical", sentimental: false,
      desc: "A weatherproof feeder that brings garden birds up close all year." },
    { title: "Personalised Pet Food Bowl", retailer: "amazon", price: 16.99, icon: "🐕",
      hobby: ["pets"], persona: ["sentimental"], aesthetic: ["minimalist", "cosy"], style: "sentimental", sentimental: true,
      desc: "A ceramic bowl printed with their pet's name and a paw motif." },
    { title: "Dog Grooming Kit", retailer: "amazon", price: 27.99, icon: "🐩",
      hobby: ["pets"], persona: ["outdoorsy"], aesthetic: ["minimalist"], style: "practical", sentimental: false,
      desc: "Clippers, brushes and nail trimmers for at-home grooming sessions." },
    { title: "Cat Scratching Post", retailer: "amazon", price: 34.99, icon: "🐈",
      hobby: ["pets"], persona: ["funny"], aesthetic: ["cosy", "bold"], style: "fun", sentimental: false,
      desc: "A sisal-wrapped post and perch that saves furniture from curious claws." },
    { title: "Set of Yoga Blocks", retailer: "amazon", price: 16.99, icon: "🧘",
      hobby: ["sports", "gym"], persona: ["introvert", "outdoorsy"], aesthetic: ["minimalist", "eco"], style: "practical", sentimental: false,
      desc: "Lightweight foam blocks that make yoga more accessible and comfortable." },
    { title: "Tennis Ball Set", retailer: "amazon", price: 9.99, icon: "🎾",
      hobby: ["sports"], persona: ["outdoorsy", "adventurous"], aesthetic: ["bold"], style: "fun", sentimental: false,
      desc: "A tube of high-quality balls ready for the court or a game of catch." },
    { title: "Padded Cycling Gloves", retailer: "amazon", price: 17.99, icon: "🚴",
      hobby: ["sports"], persona: ["outdoorsy", "adventurous"], aesthetic: ["minimalist"], style: "practical", sentimental: false,
      desc: "Shock-absorbing gloves that make longer rides more comfortable." },
    { title: "Anti-Fog Swim Goggles", retailer: "amazon", price: 12.99, icon: "🏊",
      hobby: ["sports"], persona: ["outdoorsy"], aesthetic: ["minimalist"], style: "practical", sentimental: false,
      desc: "Comfortable, anti-fog goggles for pool laps or open water." },
    { title: "Mini Photo Printer", retailer: "amazon", price: 69.99, icon: "🖼️",
      hobby: ["photography"], persona: ["creative", "techy"], aesthetic: ["minimalist", "bold"], style: "fun", sentimental: false,
      desc: "Prints phone photos instantly on credit-card sized sticky paper." },
    { title: "Padded Camera Strap", retailer: "amazon", price: 16.99, icon: "📷",
      hobby: ["photography"], persona: ["creative", "adventurous"], aesthetic: ["vintage", "minimalist"], style: "practical", sentimental: false,
      desc: "A comfortable strap that takes the strain out of long shoot days." },
    { title: "Lens Filter Kit", retailer: "amazon", price: 24.99, icon: "🔍",
      hobby: ["photography"], persona: ["techy"], aesthetic: ["minimalist"], style: "practical", sentimental: false,
      desc: "A set of UV, polarising and ND filters for sharper, more creative shots." },
    { title: "Label Maker", retailer: "amazon", price: 24.99, icon: "🏷️",
      hobby: ["diy"], persona: ["minimalist", "techy"], aesthetic: ["minimalist"], style: "practical", sentimental: false,
      desc: "A compact label printer that makes organising anything satisfying." },
    { title: "Hot Glue Gun Kit", retailer: "amazon", price: 14.99, icon: "🔥",
      hobby: ["diy"], persona: ["creative"], aesthetic: ["bold", "eco"], style: "fun", sentimental: false,
      desc: "A glue gun with a rainbow of glue sticks for crafts and quick fixes." },
    { title: "Soldering Iron Kit", retailer: "amazon", price: 27.99, icon: "🔧",
      hobby: ["diy"], persona: ["techy"], aesthetic: ["minimalist"], style: "practical", sentimental: false,
      desc: "A temperature-controlled iron with tips and solder for electronics projects." },
    { title: "1000-Piece Jigsaw Puzzle", retailer: "amazon", price: 13.99, icon: "🧩",
      hobby: [], persona: ["introvert", "bookish"], aesthetic: ["cosy", "vintage"], style: "fun", sentimental: false,
      desc: "A beautifully illustrated puzzle for slow, screen-free evenings." },
    { title: "Strategy Board Game", retailer: "amazon", price: 29.99, icon: "🎲",
      hobby: [], persona: ["funny", "creative"], aesthetic: ["bold"], style: "fun", sentimental: false,
      desc: "An award-winning board game that's easy to learn and hard to put down." },
    { title: "Speciality Tea & Coffee Gift Set", retailer: "amazon", price: 24.99, icon: "☕",
      hobby: ["cooking"], persona: ["foodie", "introvert"], aesthetic: ["cosy"], style: "surprise", sentimental: false,
      desc: "A curated mix of single-origin coffee and loose-leaf tea." },
    { title: "Fizzing Bath Bomb Gift Set", retailer: "amazon", price: 18.99, icon: "🛁",
      hobby: [], persona: ["introvert", "sentimental"], aesthetic: ["cosy", "minimalist"], style: "surprise", sentimental: false,
      desc: "A set of fragrant bath bombs for slowing down after a long day." },
    { title: "Weighted Silk Eye Mask", retailer: "amazon", price: 14.99, icon: "😴",
      hobby: [], persona: ["introvert"], aesthetic: ["cosy", "minimalist"], style: "practical", sentimental: false,
      desc: "A gently weighted mask that blocks light for deeper, calmer sleep." },
    { title: "Self-Watering Desk Plant", retailer: "amazon", price: 17.99, icon: "🌿",
      hobby: ["gardening"], persona: ["outdoorsy", "minimalist"], aesthetic: ["eco", "minimalist"], style: "surprise", sentimental: false,
      desc: "A low-maintenance plant in a self-watering pot, perfect for any desk." },
    { title: "Guided Meditation Journal", retailer: "amazon", price: 16.99, icon: "📖",
      hobby: [], persona: ["introvert", "sentimental"], aesthetic: ["cosy", "minimalist"], style: "sentimental", sentimental: true,
      desc: "Daily prompts and gratitude pages for a calmer, more reflective routine." },
    { title: "Insulated Lunch Bag", retailer: "amazon", price: 17.99, icon: "🍱",
      hobby: [], persona: ["minimalist", "foodie"], aesthetic: ["minimalist", "eco"], style: "practical", sentimental: false,
      desc: "A smart, leak-proof lunch bag that keeps food fresh on the go." },
    { title: "Personalised Embroidered Tote Bag", retailer: "etsy", price: 26.0, icon: "👜", genders: ["women"],
      hobby: ["fashion"], persona: ["sentimental"], aesthetic: ["cosy", "bold"], style: "sentimental", sentimental: true,
      desc: "A canvas tote embroidered with a name, initials or a small motif." },
    { title: "Monogrammed Towel Set", retailer: "etsy", price: 32.0, icon: "🛁",
      hobby: [], persona: ["sentimental"], aesthetic: ["cosy"], style: "sentimental", sentimental: true,
      desc: "Soft cotton towels embroidered with initials — a small everyday luxury." },
    { title: "Custom Pet ID Tag", retailer: "etsy", price: 12.0, icon: "🐾",
      hobby: ["pets"], persona: ["sentimental"], aesthetic: ["minimalist", "bold"], style: "sentimental", sentimental: true,
      desc: "A durable engraved tag with their pet's name and your contact details." },
    { title: "Personalised Family Name Sign", retailer: "etsy", price: 30.0, icon: "🏠",
      hobby: [], persona: ["sentimental"], aesthetic: ["cosy", "vintage"], style: "sentimental", sentimental: true,
      desc: "A hand-painted wooden sign with a family name and established date." },
    { title: "Custom Wax Seal Stamp", retailer: "etsy", price: 24.0, icon: "🕯️",
      hobby: ["art"], persona: ["creative", "sentimental"], aesthetic: ["vintage"], style: "sentimental", sentimental: true,
      desc: "A brass stamp engraved with initials or a monogram for letters and gifts." },
    { title: "Personalised Address Stamp", retailer: "etsy", price: 22.0, icon: "📮",
      hobby: ["diy"], persona: ["sentimental", "minimalist"], aesthetic: ["minimalist", "vintage"], style: "sentimental", sentimental: true,
      desc: "A custom self-inking stamp with their address, ideal for cards and parcels." },
    { title: "Custom Birth Chart Print", retailer: "etsy", price: 26.0, icon: "✨",
      hobby: ["art"], persona: ["sentimental", "creative"], aesthetic: ["vintage", "minimalist"], style: "sentimental", sentimental: true,
      desc: "A star-chart print showing the sky at the exact moment of their birth." },
    { title: "Engraved Pocket Compass", retailer: "etsy", price: 24.0, icon: "🧭",
      hobby: ["travel"], persona: ["sentimental", "adventurous"], aesthetic: ["vintage"], style: "sentimental", sentimental: true,
      desc: "A working brass compass engraved with a name, date or coordinates." },
    { title: "Personalised Apron", retailer: "etsy", price: 24.0, icon: "🍳",
      hobby: ["cooking"], persona: ["sentimental", "foodie"], aesthetic: ["cosy", "vintage"], style: "sentimental", sentimental: true,
      desc: "A sturdy apron printed or embroidered with a name or favourite title." },
    { title: "Custom Luggage Tag Set", retailer: "etsy", price: 18.0, icon: "🏷️",
      hobby: ["travel"], persona: ["sentimental"], aesthetic: ["bold", "vintage"], style: "sentimental", sentimental: true,
      desc: "Bright, hand-lettered tags that make luggage easy to spot and personal to carry." },
    { title: "Wooden Name Puzzle", retailer: "etsy", price: 20.0, icon: "🧩",
      hobby: [], persona: ["sentimental", "creative"], aesthetic: ["eco", "cosy"], style: "sentimental", sentimental: true,
      desc: "A laser-cut wooden puzzle spelling out a name, made from sustainable timber." },
    { title: "Engraved Guitar Pick Set", retailer: "etsy", price: 14.0, icon: "🎸",
      hobby: ["music"], persona: ["sentimental", "creative"], aesthetic: ["vintage"], style: "sentimental", sentimental: true,
      desc: "A set of metal guitar picks engraved with initials or a short message." },
    { title: "Custom Coordinates Print", retailer: "etsy", price: 24.0, icon: "📍",
      hobby: ["art"], persona: ["sentimental", "creative"], aesthetic: ["minimalist", "vintage"], style: "sentimental", sentimental: true,
      desc: "A map print centred on coordinates that mean something — home, a first date, a proposal spot." },
    { title: "Personalised Notebook Set", retailer: "etsy", price: 22.0, icon: "📓",
      hobby: ["reading"], persona: ["sentimental", "bookish"], aesthetic: ["minimalist", "cosy"], style: "sentimental", sentimental: true,
      desc: "A set of notebooks with a name or monogram foiled onto the cover." },
    { title: "Custom Illustrated House Portrait", retailer: "etsy", price: 38.0, icon: "🏡",
      hobby: ["art"], persona: ["sentimental", "creative"], aesthetic: ["bold", "vintage"], style: "sentimental", sentimental: true,
      desc: "A hand-drawn illustration of their home, made from a photo." },
    { title: "Engraved Bottle Opener", retailer: "etsy", price: 16.0, icon: "🍾",
      hobby: [], persona: ["sentimental", "funny"], aesthetic: ["vintage"], style: "sentimental", sentimental: true,
      desc: "A solid metal bottle opener engraved with a name, date or in-joke." },
    { title: "Personalised Candle with Label", retailer: "etsy", price: 18.0, icon: "🕯️",
      hobby: [], persona: ["sentimental", "introvert"], aesthetic: ["cosy"], style: "sentimental", sentimental: true,
      desc: "A hand-poured candle with a custom label and message, in a scent of choice." },
    { title: "Custom Pet Bandana", retailer: "etsy", price: 12.0, icon: "🐶",
      hobby: ["pets"], persona: ["funny", "sentimental"], aesthetic: ["bold", "cosy"], style: "fun", sentimental: false,
      desc: "A reversible bandana with their pet's name, for walks and photos alike." },
    { title: "Personalised Kids Name Necklace", retailer: "etsy", price: 18.0, icon: "💛", genders: ["women"],
      hobby: ["fashion"], persona: ["sentimental"], aesthetic: ["minimalist", "bold"], style: "sentimental", sentimental: true,
      desc: "A delicate name necklace, gentle on skin and sized for younger wearers." },
    { title: "Engraved Golf Ball Set", retailer: "etsy", price: 26.0, icon: "⛳",
      hobby: ["sports"], persona: ["sentimental", "outdoorsy"], aesthetic: ["vintage", "minimalist"], style: "sentimental", sentimental: true,
      desc: "A set of golf balls engraved with initials or a short message." },
    { title: "Monogram Wax Seal Kit", retailer: "etsy", price: 20.0, icon: "🕯️",
      hobby: ["art"], persona: ["creative"], aesthetic: ["vintage"], style: "fun", sentimental: false,
      desc: "A full wax-sealing kit with stamp, wax sticks and melting spoon." },
    { title: "Personalised Recipe Card Box", retailer: "etsy", price: 28.0, icon: "🗃️",
      hobby: ["cooking"], persona: ["sentimental", "foodie"], aesthetic: ["cosy", "vintage"], style: "sentimental", sentimental: true,
      desc: "A wooden box with custom recipe cards, ready to fill with family favourites." },
    { title: "Engraved Money Clip", retailer: "etsy", price: 22.0, icon: "💵", genders: ["men"],
      hobby: ["fashion"], persona: ["sentimental", "minimalist"], aesthetic: ["minimalist", "vintage"], style: "sentimental", sentimental: true,
      desc: "A slim metal money clip engraved with initials, a date or coordinates." },
    { title: "Personalised Yoga Mat", retailer: "etsy", price: 34.0, icon: "🧘",
      hobby: ["gym", "sports"], persona: ["sentimental", "outdoorsy"], aesthetic: ["minimalist", "bold"], style: "sentimental", sentimental: true,
      desc: "A high-grip yoga mat printed with a name or meaningful design." },
    { title: "Custom Embroidered Baby Blanket", retailer: "etsy", price: 30.0, icon: "👶",
      hobby: [], persona: ["sentimental"], aesthetic: ["cosy"], style: "sentimental", sentimental: true,
      desc: "A soft blanket embroidered with a name and birth date — a keepsake from day one." }
  ];

  function hashStr(str) {
    var h = 0;
    for (var i = 0; i < str.length; i++) {
      h = (h * 31 + str.charCodeAt(i)) >>> 0;
    }
    return h % 1000;
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

  function renderResults(ideas, ans) {
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
    var mediaClass = "gift-card__media" + (hasPhoto ? " gift-card__media--photo" : " gift-card__media--studio");
    var media;
    if (hasPhoto) {
      var fallbackJs =
        "this.onerror=null;this.style.display='none';" +
        "this.parentNode.classList.add('gift-card__media--studio');" +
        "this.parentNode.classList.remove('gift-card__media--photo');" +
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
        ideas.forEach(function (gift, i) {
          grid.appendChild(buildCard(gift, startIndex + i));
        });
        shownTitles = shownTitles.concat(ideas.map(function (g) { return g.title; }));
        $("#results-count").textContent = grid.children.length;
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
