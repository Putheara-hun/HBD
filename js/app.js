/* Main Application Controller */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. OPENING SCREEN: Powerful, Funny & Enjoyable Gateway Experience
  // =========================================================================
  const openingScreen = document.getElementById('opening-screen');
  const btnEnter = document.getElementById('btn-enter-story');
  const btnShuffleQuote = document.getElementById('btn-shuffle-intro-quote');
  const quoteTextEl = document.getElementById('intro-funny-text');
  const btnIntroConfetti = document.getElementById('btn-intro-confetti');
  const btnIntroCroc = document.getElementById('btn-intro-croc');
  const crocModal = document.getElementById('intro-croc-modal');
  const btnCloseCroc = document.getElementById('btn-close-croc-modal');
  const crocVid = document.getElementById('intro-croc-vid');

  // Funny & witty rotating quotes
  const funnyQuotes = [
    "If you can't defeat them, join them. 🤝",
    "If the enemy can predict your next move, don't move. 🧠",
    "Legend's Rule: No one can use you if you are useless... but today I'm priceless & unstoppable. 👑",
    "Level 24 Unlocked: Upgraded graphics, more wisdom, still zero patience for slow Wi-Fi. ⚡",
    "Dancing Croc State of Mind: 90% chill, 10% pure chaos when the birthday cake arrives. 🐊",
    "Officially aged like fine wine. 100% organic, 0% artificial, 1000% charismatic. 🍷",
    "They told me to stay humble, but look at this birthday website! Legend status: Confirmed. 🚀",
    "Birthdays are nature's way of telling us to eat more cake and cause harmless mischief. 🎂"
  ];

  let currentQuoteIdx = 0;
  let quoteTimer = null;

  function cycleQuote(manual = false) {
    if (!quoteTextEl) return;
    currentQuoteIdx = (currentQuoteIdx + 1) % funnyQuotes.length;

    quoteTextEl.style.opacity = '0';
    quoteTextEl.style.transform = 'translateY(6px)';
    setTimeout(() => {
      quoteTextEl.innerHTML = `&ldquo;${funnyQuotes[currentQuoteIdx]}&rdquo;`;
      quoteTextEl.style.opacity = '1';
      quoteTextEl.style.transform = 'translateY(0)';
    }, 200);

    if (manual) {
      if (window.ambientAudio) {
        window.ambientAudio.playDiceRoll();
      }
      clearInterval(quoteTimer);
      quoteTimer = setInterval(() => cycleQuote(false), 4500);
    }
  }

  // Start auto-cycling funny quotes
  if (quoteTextEl) {
    quoteTimer = setInterval(() => cycleQuote(false), 4500);
  }

  if (btnShuffleQuote) {
    btnShuffleQuote.addEventListener('click', () => cycleQuote(true));
  }

  // Interactive Confetti Pop Button on Intro
  if (btnIntroConfetti) {
    btnIntroConfetti.addEventListener('click', () => {
      if (window.ambientAudio) {
        window.ambientAudio.playConfettiPop();
      }
      if (typeof triggerCelebrationConfetti === 'function') {
        triggerCelebrationConfetti();
      }
    });
  }

  // Dancing Croc Easter Egg Video on Intro
  if (btnIntroCroc && crocModal) {
    btnIntroCroc.addEventListener('click', () => {
      if (window.ambientAudio) {
        window.ambientAudio.playFunnyBoing();
      }
      crocModal.classList.add('active');
      if (crocVid) {
        crocVid.currentTime = 0;
        crocVid.play().catch(() => {});
      }
    });
  }

  if (btnCloseCroc && crocModal) {
    btnCloseCroc.addEventListener('click', () => {
      crocModal.classList.remove('active');
      if (crocVid) crocVid.pause();
    });
  }

  if (crocModal) {
    crocModal.addEventListener('click', (e) => {
      if (e.target === crocModal) {
        crocModal.classList.remove('active');
        if (crocVid) crocVid.pause();
      }
    });
  }

  // Grand Hype Enter Blast
  function triggerHypeCannon() {
    if (window.confetti) {
      window.confetti({
        particleCount: 80,
        angle: 60,
        spread: 70,
        origin: { x: 0, y: 0.65 },
        colors: ['#e5b972', '#ffd591', '#f59e0b', '#ec4899', '#3b82f6', '#ffffff']
      });
      window.confetti({
        particleCount: 80,
        angle: 120,
        spread: 70,
        origin: { x: 1, y: 0.65 },
        colors: ['#e5b972', '#ffd591', '#f59e0b', '#ec4899', '#3b82f6', '#ffffff']
      });
      setTimeout(() => {
        window.confetti({
          particleCount: 110,
          spread: 110,
          origin: { x: 0.5, y: 0.45 },
          colors: ['#e5b972', '#ffd591', '#ffffff', '#fbbf24']
        });
      }, 200);
    } else if (typeof triggerCelebrationConfetti === 'function') {
      triggerCelebrationConfetti();
    }
  }

  let isStoryLaunched = false;

  function launchStory() {
    if (isStoryLaunched) return;
    isStoryLaunched = true;

    // 1. Play realistic fireworks blast & triumphant entry sound immediately!
    if (window.ambientAudio) {
      window.ambientAudio.playFirework();
      window.ambientAudio.playTriumphantEntry();
    }

    // 2. Launch full hype cannon confetti
    triggerHypeCannon();

    // 3. Fade & Iris out gate screen
    if (openingScreen) {
      openingScreen.classList.add('hidden');
    }

    // 4. Smoothly focus & scroll directly to the Story block
    const storyBlock = document.getElementById('hero');
    if (storyBlock) {
      storyBlock.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // 5. Start the atmospheric Happy Birthday soundtrack right after firework launch
    setTimeout(() => {
      if (window.ambientAudio) {
        window.ambientAudio.play();
      }
    }, 450);

    // Clean up opening screen display
    setTimeout(() => {
      if (openingScreen) openingScreen.style.display = 'none';
      if (quoteTimer) clearInterval(quoteTimer);
    }, 1200);
  }

  // User enters manually on their own terms
  if (btnEnter && openingScreen) {
    btnEnter.addEventListener('click', () => {
      launchStory();
    });
  }

  // =========================================================================
  // 2. DYNAMIC YEAR-TO-YEAR MILESTONES (13 NOVEMBER 2002 -> AUTOMATIC LOOP)
  // =========================================================================
  function updateDynamicBirthdayMilestones() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const birthDate = new Date(2002, 10, 13); // 13 Nov 2002

    // Target age being celebrated in current year:
    // Born Nov 2002 -> in 2026: 24, in 2027: 25, in 2028: 26, etc.
    const milestoneAge = currentYear - 2002;
    const milestoneChapter = milestoneAge;
    const milestoneYear = currentYear;

    // Calculate total days lived from 13 Nov 2002
    const diffTime = now.getTime() - birthDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const formattedDays = diffDays > 0 ? `${diffDays.toLocaleString()}+` : '8,766+';

    // Automatically update all dynamic placeholders across the entire site
    document.querySelectorAll('.dyn-age').forEach(el => {
      el.textContent = milestoneAge;
    });
    document.querySelectorAll('.dyn-chapter').forEach(el => {
      el.textContent = milestoneChapter;
    });
    document.querySelectorAll('.dyn-year').forEach(el => {
      el.textContent = milestoneYear;
    });
    document.querySelectorAll('.dyn-days').forEach(el => {
      el.textContent = formattedDays;
    });
  }

  updateDynamicBirthdayMilestones();

  // =========================================================================
  // 3. BIRTHDAY COUNTDOWN TO NEXT 13 NOVEMBER
  // =========================================================================
  function updateCountdown() {
    const daysEl = document.getElementById('count-days');
    const hoursEl = document.getElementById('count-hours');
    const minsEl = document.getElementById('count-mins');
    const secsEl = document.getElementById('count-secs');
    const gridEl = document.getElementById('countdown-grid');
    const bannerEl = document.getElementById('birthday-arrived-banner');

    if (!daysEl) return;

    const now = new Date();
    const currentYear = now.getFullYear();
    
    // Target: 13 November of current year
    let target = new Date(currentYear, 10, 13, 0, 0, 0); // Month 10 is November in JS

    // Check if today is 13 November
    const isTodayBirthday = (now.getMonth() === 10 && now.getDate() === 13);
    
    if (isTodayBirthday) {
      if (gridEl) gridEl.style.display = 'none';
      if (bannerEl) {
        bannerEl.style.display = 'block';
        bannerEl.innerHTML = 'Today is my day. ❤️';
      }
      return;
    }

    // If 13 November of this year has already passed, target next year
    if (now > target && !isTodayBirthday) {
      target = new Date(currentYear + 1, 10, 13, 0, 0, 0);
    }

    const diff = target - now;
    if (diff <= 0) {
      if (gridEl) gridEl.style.display = 'none';
      if (bannerEl) bannerEl.style.display = 'block';
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / 1000 / 60) % 60);
    const s = Math.floor((diff / 1000) % 60);

    daysEl.textContent = String(d).padStart(2, '0');
    hoursEl.textContent = String(h).padStart(2, '0');
    minsEl.textContent = String(m).padStart(2, '0');
    secsEl.textContent = String(s).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // =========================================================================
  // 4. YEARLY CHAPTER VAULT & TIME CAPSULE (100% LOCALSTORAGE - NO DATABASE)
  // =========================================================================
  class YearlyVaultManager {
    constructor() {
      this.storageKey = 'putheara_yearly_capsules';
      this.gridEl = document.getElementById('yearly-cards-grid');
      this.btnOpenModal = document.getElementById('btn-add-year-memory');
      this.modal = document.getElementById('vault-modal');
      this.btnCloseModal = document.getElementById('vault-modal-close');
      this.form = document.getElementById('vault-memory-form');
      this.selectYear = document.getElementById('vault-input-year');
      this.inputWish = document.getElementById('vault-input-wish');
      this.inputMemory = document.getElementById('vault-input-memory');
      this.btnExport = document.getElementById('btn-export-vault');
      this.btnImport = document.getElementById('btn-import-vault');
      this.fileInput = document.getElementById('vault-file-input');

      this.init();
    }

    init() {
      this.populateYearOptions();
      this.bindEvents();
      this.render();
    }

    getCapsules() {
      try {
        const data = localStorage.getItem(this.storageKey);
        if (data) {
          return JSON.parse(data);
        }
      } catch (e) {
        console.warn('Could not load capsules from localStorage:', e);
      }

      // Default seeded chapters if empty
      const defaultCapsules = [
        {
          year: 2026,
          age: 24,
          wish: "Level 24: Strive for greatness, cherish every second with family & friends, and master my craft.",
          memory: "Unveiled the grand 24-year birthday story website with maximum hype and legendary crocodile vibes! 🐊✨",
          date: "13 Nov 2026"
        },
        {
          year: 2027,
          age: 25,
          wish: "Chapter 25 Ahead: Wisdom, peace of mind, financial freedom, and continuous growth.",
          memory: "Future memory slot — waiting to be written when Chapter 25 arrives!",
          date: "13 Nov 2027"
        }
      ];

      this.saveCapsules(defaultCapsules);
      return defaultCapsules;
    }

    saveCapsules(capsules) {
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(capsules));
      } catch (e) {
        console.error('Failed to save capsules to localStorage:', e);
      }
    }

    populateYearOptions() {
      if (!this.selectYear) return;
      this.selectYear.innerHTML = '';
      const currentYear = new Date().getFullYear();

      // Populate from current year up to 2040
      for (let y = 2026; y <= 2040; y++) {
        const age = y - 2002;
        const opt = document.createElement('option');
        opt.value = y;
        opt.textContent = `${y} &bull; Chapter ${age} (Age ${age})`;
        opt.innerHTML = `${y} &bull; Chapter ${age} (Age ${age})`;
        if (y === currentYear) {
          opt.selected = true;
        }
        this.selectYear.appendChild(opt);
      }
    }

    bindEvents() {
      if (this.btnOpenModal && this.modal) {
        this.btnOpenModal.addEventListener('click', () => {
          this.modal.classList.add('active');
        });
      }

      if (this.btnCloseModal && this.modal) {
        this.btnCloseModal.addEventListener('click', () => {
          this.modal.classList.remove('active');
        });
      }

      if (this.modal) {
        this.modal.addEventListener('click', (e) => {
          if (e.target === this.modal) {
            this.modal.classList.remove('active');
          }
        });
      }

      if (this.form) {
        this.form.addEventListener('submit', (e) => {
          e.preventDefault();
          this.handleSave();
        });
      }

      if (this.btnExport) {
        this.btnExport.addEventListener('click', () => this.exportBackup());
      }

      if (this.btnImport && this.fileInput) {
        this.btnImport.addEventListener('click', () => this.fileInput.click());
        this.fileInput.addEventListener('change', (e) => this.handleImport(e));
      }
    }

    handleSave() {
      const year = parseInt(this.selectYear.value, 10);
      const age = year - 2002;
      const wish = this.inputWish.value.trim();
      const memory = this.inputMemory.value.trim() || 'A cherished chapter memory etched in the vault.';

      if (!wish) return;

      const capsules = this.getCapsules();
      const existingIdx = capsules.findIndex(c => c.year === year);

      const now = new Date();
      const dateStr = `${now.getDate()} ${now.toLocaleString('default', { month: 'short' })} ${now.getFullYear()}`;

      const newEntry = { year, age, wish, memory, date: dateStr };

      if (existingIdx >= 0) {
        capsules[existingIdx] = newEntry;
      } else {
        capsules.push(newEntry);
      }

      // Sort by year ascending
      capsules.sort((a, b) => a.year - b.year);
      this.saveCapsules(capsules);

      // Sound & confetti feedback
      if (window.ambientAudio) {
        window.ambientAudio.playConfettiPop();
      }
      if (typeof triggerCelebrationConfetti === 'function') {
        triggerCelebrationConfetti();
      }

      // Close modal and reset
      this.modal.classList.remove('active');
      this.inputWish.value = '';
      this.inputMemory.value = '';

      this.render();
    }

    exportBackup() {
      const capsules = this.getCapsules();
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(capsules, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `putheara_birthday_vault_${new Date().getFullYear()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    }

    handleImport(event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target.result);
          if (Array.isArray(imported)) {
            this.saveCapsules(imported);
            this.render();
            alert("Vault memories successfully restored from backup!");
          } else {
            alert("Invalid backup file format.");
          }
        } catch (err) {
          alert("Error reading file: " + err.message);
        }
      };
      reader.readAsText(file);
      event.target.value = '';
    }

    render() {
      if (!this.gridEl) return;
      const capsules = this.getCapsules();
      const currentYear = new Date().getFullYear();

      this.gridEl.innerHTML = '';

      capsules.forEach(cap => {
        const card = document.createElement('div');
        const isCurrent = (cap.year === currentYear);
        card.className = `yearly-card reveal-on-scroll ${isCurrent ? 'active-chapter' : ''}`;

        card.innerHTML = `
          <div class="yearly-card-header">
            <span class="yearly-card-badge">CHAPTER ${cap.age} &bull; ${cap.year}</span>
            <span class="yearly-card-year">${isCurrent ? '🌟 ACTIVE NOW' : (cap.year > currentYear ? '⏳ UPCOMING' : '📖 ARCHIVED')}</span>
          </div>
          <div class="yearly-card-wish">
            &ldquo;${this.escapeHtml(cap.wish)}&rdquo;
          </div>
          <div class="yearly-card-memory">
            <strong>Highlight:</strong> ${this.escapeHtml(cap.memory)}
          </div>
          <div class="yearly-card-footer">
            <span>Recorded: ${cap.date || (cap.year + '')}</span>
            <span>Age ${cap.age}</span>
          </div>
        `;

        this.gridEl.appendChild(card);
      });
    }

    escapeHtml(text) {
      if (!text) return '';
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
  }

  new YearlyVaultManager();

  // =========================================================================
  // 5. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
  // =========================================================================
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal-on-scroll').forEach(el => {
    observer.observe(el);
  });

  // Re-observe dynamic vault cards
  const vaultObserver = new MutationObserver(() => {
    document.querySelectorAll('#yearly-cards-grid .reveal-on-scroll:not(.revealed)').forEach(el => {
      observer.observe(el);
    });
  });
  const vaultGridEl = document.getElementById('yearly-cards-grid');
  if (vaultGridEl) {
    vaultObserver.observe(vaultGridEl, { childList: true });
  }

  // =========================================================================
  // 6. LIGHTBOX MODAL FUNCTIONALITY
  // =========================================================================
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxVideo = document.getElementById('lightbox-video');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  function openLightbox(src, captionText, isVideo = false) {
    if (!lightboxModal) return;
    
    if (isVideo) {
      if (lightboxImg) lightboxImg.style.display = 'none';
      if (lightboxVideo) {
        lightboxVideo.src = src;
        lightboxVideo.style.display = 'block';
        lightboxVideo.play().catch(() => {});
      }
    } else {
      if (lightboxVideo) {
        lightboxVideo.pause();
        lightboxVideo.style.display = 'none';
      }
      if (lightboxImg) {
        lightboxImg.src = src;
        lightboxImg.style.display = 'block';
      }
    }

    if (lightboxCaption) {
      lightboxCaption.textContent = captionText || '';
    }

    lightboxModal.classList.add('active');
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    if (lightboxVideo) {
      lightboxVideo.pause();
      lightboxVideo.src = '';
    }
    if (lightboxImg) {
      lightboxImg.src = '';
    }
  }

  // Attach click listeners to all items with data-lightbox-src
  document.querySelectorAll('[data-lightbox-src]').forEach(item => {
    item.addEventListener('click', () => {
      const src = item.getAttribute('data-lightbox-src');
      const caption = item.getAttribute('data-lightbox-caption');
      const isVideo = src.endsWith('.mp4') || src.endsWith('.webm');
      openLightbox(src, caption, isVideo);
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });
  }

  // =========================================================================
  // 7. EASTER EGG: INTERACTIVE CANDLE BLOW-OUT
  // =========================================================================
  const candleHolder = document.getElementById('candle-easter-egg');
  const candleFlame = document.getElementById('candle-flame');
  const candleSmoke = document.getElementById('candle-smoke');
  const candleWishText = document.getElementById('candle-wish-text');

  if (candleHolder) {
    candleHolder.addEventListener('click', () => {
      if (!candleFlame.classList.contains('extinguished')) {
        candleFlame.classList.add('extinguished');
        if (candleSmoke) candleSmoke.classList.add('active');

        if (window.ambientAudio) {
          window.ambientAudio.playConfettiPop();
        }

        if (candleWishText) {
          candleWishText.innerHTML = '&ldquo;A wish whispered to the stars &bull; May life give you all the happiness and peace you deserve, Putheara.&rdquo;';
          candleWishText.classList.add('revealed');
        }

        if (typeof triggerCelebrationConfetti === 'function') {
          triggerCelebrationConfetti();
        }
      }
    });
  }

  // =========================================================================
  // 8. SECRET EASTER EGG MODAL
  // =========================================================================
  const secretTrigger = document.querySelector('.wax-seal');
  const secretModal = document.getElementById('secret-modal');
  const secretModalClose = document.getElementById('secret-modal-close');

  if (secretTrigger && secretModal) {
    secretTrigger.addEventListener('click', () => {
      secretModal.classList.add('active');
      if (window.ambientAudio) {
        window.ambientAudio.playTriumphantEntry();
      }
    });
  }

  if (secretModalClose && secretModal) {
    secretModalClose.addEventListener('click', () => {
      secretModal.classList.remove('active');
    });
  }

  if (secretModal) {
    secretModal.addEventListener('click', (e) => {
      if (e.target === secretModal) {
        secretModal.classList.remove('active');
      }
    });
  }

  // =========================================================================
  // 9. REPLAY STORY BUTTON
  // =========================================================================
  const btnReplay = document.getElementById('btn-replay-story');
  if (btnReplay) {
    btnReplay.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (openingScreen) {
        openingScreen.style.display = 'flex';
        setTimeout(() => {
          openingScreen.classList.remove('hidden');
        }, 100);
      }
    });
  }

  // =========================================================================
  // 10. FRIENDS SECTION HORIZONTAL SLIDER
  // =========================================================================
  const friendsViewport = document.getElementById('friends-viewport');
  const friendsTrack = document.getElementById('friends-track');
  const friendsPrev = document.getElementById('friends-prev');
  const friendsNext = document.getElementById('friends-next');
  const friendsCounter = document.getElementById('friends-counter');
  const friendsDotsContainer = document.getElementById('friends-dots');

  if (friendsViewport && friendsTrack) {
    const cards = friendsTrack.querySelectorAll('.friend-card');
    const totalCards = cards.length;
    let isMouseDown = false;
    let startX = 0;
    let scrollLeftStart = 0;
    let autoPlayTimer = null;

    // Create pagination dots
    if (friendsDotsContainer) {
      friendsDotsContainer.innerHTML = '';
      cards.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.className = `slider-dot ${idx === 0 ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
        dot.addEventListener('click', () => {
          scrollToSlide(idx);
          resetAutoPlay();
        });
        friendsDotsContainer.appendChild(dot);
      });
    }

    function getCardStep() {
      if (cards.length === 0) return 340;
      const firstCard = cards[0];
      const gap = 28;
      return firstCard.offsetWidth + gap;
    }

    function scrollToSlide(idx) {
      const step = getCardStep();
      friendsViewport.scrollTo({
        left: idx * step,
        behavior: 'smooth'
      });
    }

    function updateSliderState() {
      const step = getCardStep();
      const currentScroll = friendsViewport.scrollLeft;
      const currentIndex = Math.round(currentScroll / step);
      const safeIndex = Math.min(Math.max(currentIndex, 0), totalCards - 1);

      if (friendsCounter) {
        friendsCounter.textContent = `${safeIndex + 1} / ${totalCards}`;
      }

      if (friendsDotsContainer) {
        const dots = friendsDotsContainer.querySelectorAll('.slider-dot');
        dots.forEach((dot, idx) => {
          dot.classList.toggle('active', idx === safeIndex);
        });
      }
    }

    if (friendsPrev) {
      friendsPrev.addEventListener('click', () => {
        const step = getCardStep();
        friendsViewport.scrollBy({ left: -step, behavior: 'smooth' });
        resetAutoPlay();
      });
    }

    if (friendsNext) {
      friendsNext.addEventListener('click', () => {
        const step = getCardStep();
        const maxScroll = friendsViewport.scrollWidth - friendsViewport.clientWidth;
        if (friendsViewport.scrollLeft >= maxScroll - 10) {
          friendsViewport.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          friendsViewport.scrollBy({ left: step, behavior: 'smooth' });
        }
        resetAutoPlay();
      });
    }

    friendsViewport.addEventListener('scroll', () => {
      updateSliderState();
    }, { passive: true });

    // Mouse Dragging Support
    friendsViewport.addEventListener('mousedown', (e) => {
      isMouseDown = true;
      friendsViewport.classList.add('is-dragging');
      startX = e.pageX - friendsViewport.offsetLeft;
      scrollLeftStart = friendsViewport.scrollLeft;
      stopAutoPlay();
    });

    window.addEventListener('mouseup', () => {
      if (isMouseDown) {
        isMouseDown = false;
        friendsViewport.classList.remove('is-dragging');
        startAutoPlay();
      }
    });

    friendsViewport.addEventListener('mousemove', (e) => {
      if (!isMouseDown) return;
      e.preventDefault();
      const x = e.pageX - friendsViewport.offsetLeft;
      const walk = (x - startX) * 1.5;
      friendsViewport.scrollLeft = scrollLeftStart - walk;
    });

    // Auto-advance slideshow every 4 seconds
    function startAutoPlay() {
      if (autoPlayTimer) clearInterval(autoPlayTimer);
      autoPlayTimer = setInterval(() => {
        const step = getCardStep();
        const maxScroll = friendsViewport.scrollWidth - friendsViewport.clientWidth;
        if (friendsViewport.scrollLeft >= maxScroll - 15) {
          friendsViewport.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          friendsViewport.scrollBy({ left: step, behavior: 'smooth' });
        }
      }, 4000);
    }

    function stopAutoPlay() {
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
      }
    }

    function resetAutoPlay() {
      stopAutoPlay();
      startAutoPlay();
    }

    friendsViewport.addEventListener('mouseenter', stopAutoPlay);
    friendsViewport.addEventListener('mouseleave', startAutoPlay);
    friendsViewport.addEventListener('touchstart', stopAutoPlay, { passive: true });
    friendsViewport.addEventListener('touchend', startAutoPlay, { passive: true });

    startAutoPlay();
    updateSliderState();
  }

});
