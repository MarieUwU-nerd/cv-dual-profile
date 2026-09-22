/**
 * Marie N. — Double Profil CV — Animations Chorégraphiées GSAP & Accessibilité
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements du DOM
  const toggleItBtn = document.getElementById('toggle-it');
  const toggleLogisticsBtn = document.getElementById('toggle-logistics');
  const profileItSection = document.getElementById('profile-it');
  const profileLogisticsSection = document.getElementById('profile-logistics');
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const slider = document.querySelector('.toggle-slider');

  // État de l'application
  let activeProfile = 'it'; // 'it' ou 'logistics'
  let isAnimating = false;  // Évite les clics compulsifs pendant l'animation

  // Détecte la préférence d'accessibilité pour les mouvements réduits
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /**
   * Positionne initialement le slider GSAP en fonction du profil actif
   */
  function initSliderPosition() {
    if (!slider || !toggleItBtn || !toggleLogisticsBtn) return;
    
    // Si GSAP est présent, on l'utilise pour positionner
    if (typeof gsap !== 'undefined') {
      if (activeProfile === 'it') {
        gsap.set(slider, { x: 0 });
      } else {
        const targetX = toggleLogisticsBtn.offsetLeft - toggleItBtn.offsetLeft;
        gsap.set(slider, { x: targetX });
      }
    } else {
      // Fallback natif
      if (activeProfile === 'it') {
        slider.style.left = '0.35rem';
      } else {
        const container = document.querySelector('.toggle-container');
        if (container) {
          const halfWidth = container.clientWidth / 2;
          slider.style.left = `calc(${halfWidth}px - 0.175rem)`;
        }
      }
    }
  }

  /**
   * Fonction principale de transition entre les profils (Chorégraphie GSAP)
   * @param {string} targetProfile - 'it' ou 'logistics'
   */
  function switchProfile(targetProfile) {
    if (targetProfile === activeProfile || isAnimating) return;
    isAnimating = true;
    activeProfile = targetProfile;

    const isIt = targetProfile === 'it';
    const activeSection = isIt ? profileLogisticsSection : profileItSection;
    const incomingSection = isIt ? profileItSection : profileLogisticsSection;
    const activeBtn = isIt ? toggleItBtn : toggleLogisticsBtn;
    const inactiveBtn = isIt ? toggleLogisticsBtn : toggleItBtn;

    // Calcul de la position du slider
    const targetX = isIt ? 0 : toggleLogisticsBtn.offsetLeft - toggleItBtn.offsetLeft;

    // Mettre à jour l'état visuel actif immédiatement sur les boutons
    activeBtn.classList.add('active');
    inactiveBtn.classList.remove('active');

    // 1. SCÉNARIO AVEC MOUVEMENTS RÉDUITS (A11Y)
    if (prefersReducedMotion.matches || typeof gsap === 'undefined') {
      // Changement de classe immédiat pour la couleur d'accentuation
      document.body.className = `profile-${targetProfile}`;

      // Animation simplifiée en fondu de 0.15s
      activeSection.style.display = 'none';
      activeSection.classList.remove('active-profile');
      
      incomingSection.style.display = 'block';
      incomingSection.classList.add('active-profile');
      incomingSection.style.opacity = '1';
      
      updateAriaStates();
      initSliderPosition();
      isAnimating = false;
      return;
    }

    // 2. SCÉNARIO PREMIUM CHORÉGRAPHIÉ (GSAP)
    const tl = gsap.timeline({
      onComplete: () => {
        updateAriaStates();
        isAnimating = false;
      }
    });

    // Phase 1 : Disparition en cascade des cartes du profil actif (sortie)
    const activeCards = activeSection.querySelectorAll('.profile-card');
    
    tl.to(activeCards, {
      opacity: 0,
      y: 20,
      stagger: 0.03,
      duration: 0.22,
      ease: 'power2.in'
    });

    // Phase 2 : Glissement du commutateur et transition du thème sur le body
    tl.to(slider, {
      x: targetX,
      duration: 0.45,
      ease: 'power3.out',
      onStart: () => {
        // Applique la classe d'accentuation sur le body (déclenche les transitions CSS fluides)
        document.body.className = `profile-${targetProfile}`;
      }
    }, '-=0.15'); // Léger chevauchement temporel

    // Phase 3 : Alternance sémantique dans le DOM (masquer l'ancien, préparer le nouveau)
    tl.set(activeSection, { display: 'none', className: 'profile-section' });
    tl.set(incomingSection, { display: 'block', className: 'profile-section active-profile' });
    
    // Préparer les nouvelles cartes (invisibles et légèrement décalées vers le haut)
    const incomingCards = incomingSection.querySelectorAll('.profile-card');
    tl.set(incomingCards, { opacity: 0, y: -20 });

    // Phase 4 : Apparition fluide en cascade du nouveau profil (entrée)
    tl.to(incomingCards, {
      opacity: 1,
      y: 0,
      stagger: 0.05,
      duration: 0.45,
      ease: 'power2.out'
    });
  }

  /**
   * Synchronisation des attributs ARIA pour l'accessibilité
   */
  function updateAriaStates() {
    if (activeProfile === 'it') {
      toggleItBtn.setAttribute('aria-checked', 'true');
      toggleLogisticsBtn.setAttribute('aria-checked', 'false');
      
      profileItSection.setAttribute('aria-hidden', 'false');
      profileLogisticsSection.setAttribute('aria-hidden', 'true');
    } else {
      toggleItBtn.setAttribute('aria-checked', 'false');
      toggleLogisticsBtn.setAttribute('aria-checked', 'true');

      profileItSection.setAttribute('aria-hidden', 'true');
      profileLogisticsSection.setAttribute('aria-hidden', 'false');
    }
  }

  /**
   * Gestion du clavier pour le commutateur
   */
  function handleKeyboardToggle(event) {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      const targetId = event.target.id;
      const targetProfile = targetId === 'toggle-it' ? 'it' : 'logistics';
      switchProfile(targetProfile);
    }
  }

  // Enregistrement des événements sur le commutateur
  if (toggleItBtn && toggleLogisticsBtn) {
    toggleItBtn.addEventListener('click', () => switchProfile('it'));
    toggleLogisticsBtn.addEventListener('click', () => switchProfile('logistics'));

    toggleItBtn.addEventListener('keydown', handleKeyboardToggle);
    toggleLogisticsBtn.addEventListener('keydown', handleKeyboardToggle);
  }

  // Gestion de la copie d'email unifiée
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const emailText = 'contact@marie-n.fr';
      
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(emailText)
          .then(() => showCopySuccess())
          .catch(() => fallbackCopyText(emailText));
      } else {
        fallbackCopyText(emailText);
      }
    });
  }

  function showCopySuccess() {
    const span = copyEmailBtn.querySelector('span');
    if (span) {
      const originalText = span.textContent;
      span.textContent = 'Adresse copiée !';
      copyEmailBtn.classList.add('copy-success');
      
      // Petit effet d'échelle via GSAP pour la confirmation "Waouh"
      if (typeof gsap !== 'undefined') {
        gsap.fromTo(copyEmailBtn, { scale: 0.95 }, { scale: 1, duration: 0.3, ease: 'back.out(2)' });
      }

      setTimeout(() => {
        span.textContent = originalText;
        copyEmailBtn.classList.remove('copy-success');
      }, 2000);
    }
  }

  function fallbackCopyText(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
      showCopySuccess();
    } catch (err) {
      console.error('Impossible de copier l\'adresse email', err);
    }

    document.body.removeChild(textArea);
  }

  // Initialisation et adaptation responsive du slider
  initSliderPosition();
  window.addEventListener('resize', () => {
    // Évite d'animer lors du redimensionnement, on ajuste juste la position instantanément
    if (typeof gsap !== 'undefined' && slider) {
      gsap.killTweensOf(slider);
      initSliderPosition();
    }
  });
});
