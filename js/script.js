/**
 * Marie N. — Double Profil CV — Interactivité JavaScript & Accessibilité
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements du DOM
  const toggleItBtn = document.getElementById('toggle-it');
  const toggleLogisticsBtn = document.getElementById('toggle-logistics');
  const profileItSection = document.getElementById('profile-it');
  const profileLogisticsSection = document.getElementById('profile-logistics');
  const copyEmailBtn = document.getElementById('copy-email-btn');

  // État initial de l'application
  let activeProfile = 'it'; // 'it' ou 'logistics'

  /**
   * Fonction de basculement de profil
   * @param {string} profileId - 'toggle-it' ou 'toggle-logistics'
   */
  function toggleProfile(profileId) {
    if (profileId === 'toggle-it' && activeProfile === 'it') return;
    if (profileId === 'toggle-logistics' && activeProfile === 'logistics') return;

    if (profileId === 'toggle-it') {
      activeProfile = 'it';
      
      // Mise à jour des classes sur le body et les boutons
      document.body.className = 'profile-it';
      toggleItBtn.classList.add('active');
      toggleLogisticsBtn.classList.remove('active');

      // Mise à jour de l'affichage dans le DOM
      profileItSection.classList.remove('hidden');
      profileItSection.classList.add('active-profile');
      profileLogisticsSection.classList.add('hidden');
      profileLogisticsSection.classList.remove('active-profile');

    } else if (profileId === 'toggle-logistics') {
      activeProfile = 'logistics';

      // Mise à jour des classes sur le body et les boutons
      document.body.className = 'profile-logistics';
      toggleLogisticsBtn.classList.add('active');
      toggleItBtn.classList.remove('active');

      // Mise à jour de l'affichage dans le DOM
      profileLogisticsSection.classList.remove('hidden');
      profileLogisticsSection.classList.add('active-profile');
      profileItSection.classList.add('hidden');
      profileItSection.classList.remove('active-profile');
    }

    // Synchronisation ARIA
    updateAriaStates();

    // Placement du slider (fallback sans GSAP)
    updateSliderFallback();
  }

  /**
   * Mise à jour des attributs d'accessibilité ARIA
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
   * Positionne le curseur du commutateur de façon native (fallback sans GSAP)
   */
  function updateSliderFallback() {
    const slider = document.querySelector('.toggle-slider');
    if (!slider) return;

    if (activeProfile === 'it') {
      slider.style.left = '0.35rem';
    } else {
      // Calcule dynamiquement la moitié de la largeur du conteneur
      const container = document.querySelector('.toggle-container');
      if (container) {
        const halfWidth = container.clientWidth / 2;
        slider.style.left = `calc(${halfWidth}px - 0.175rem)`;
      }
    }
  }

  /**
   * Gestion de l'accessibilité clavier sur le Commutateur
   * @param {KeyboardEvent} event 
   */
  function handleKeyboardToggle(event) {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      toggleProfile(event.target.id);
    }
  }

  // Écouteurs d'événements pour le commutateur (clic)
  if (toggleItBtn && toggleLogisticsBtn) {
    toggleItBtn.addEventListener('click', () => toggleProfile('toggle-it'));
    toggleLogisticsBtn.addEventListener('click', () => toggleProfile('toggle-logistics'));

    // Clavier
    toggleItBtn.addEventListener('keydown', handleKeyboardToggle);
    toggleLogisticsBtn.addEventListener('keydown', handleKeyboardToggle);
  }

  // Copie d'email interactive
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const emailText = 'contact@marie-n.fr';
      
      // Utilisation de l'API Clipboard ou fallback
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(emailText)
          .then(() => showCopySuccess())
          .catch(() => fallbackCopyText(emailText));
      } else {
        fallbackCopyText(emailText);
      }
    });
  }

  /**
   * Notification visuelle du succès de la copie
   */
  function showCopySuccess() {
    const originalText = copyEmailBtn.querySelector('span') ? copyEmailBtn.querySelector('span').textContent : 'contact@marie-n.fr';
    const span = copyEmailBtn.querySelector('span');

    if (span) {
      span.textContent = 'Adresse copiée !';
      copyEmailBtn.classList.add('copy-success');
      
      setTimeout(() => {
        span.textContent = originalText;
        copyEmailBtn.classList.remove('copy-success');
      }, 2000);
    }
  }

  /**
   * Fallback de copie de texte si navigator.clipboard n'est pas supporté (comme JSDOM)
   */
  function fallbackCopyText(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed'; // Évite de faire scroller la page
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

  // Initialisation du positionnement du slider lors du chargement initial ou redimensionnement
  updateSliderFallback();
  window.addEventListener('resize', updateSliderFallback);
});
