/**
 * Suite de tests de validation d'interactivité et d'accessibilité (JSDOM)
 */

const { JSDOM, VirtualConsole } = require('jsdom');
const fs = require('fs');
const path = require('path');

// Lire les fichiers du projet
const htmlContent = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
const scriptContent = fs.readFileSync(path.join(__dirname, '../js/script.js'), 'utf8');

console.log('🧪 Démarrage des tests d\'interactivité et d\'accessibilité...');

// Utiliser un VirtualConsole pour relayer les logs et erreurs de JSDOM
const virtualConsole = new VirtualConsole();
virtualConsole.sendTo(console);

// Initialiser JSDOM
const dom = new JSDOM(htmlContent, {
  runScripts: 'outside-only',
  resources: 'usable',
  virtualConsole
});

const { window } = dom;
const { document } = window;

// Polyfills / Mocks des APIs de navigateur manquantes dans JSDOM
window.matchMedia = window.matchMedia || function() {
  return {
    matches: false, // pas de réduction d'animation par défaut dans les tests
    addListener: function() {},
    removeListener: function() {}
  };
};

// Mock permanent de navigator.clipboard avant le chargement du script
Object.defineProperty(window.navigator, 'clipboard', {
  value: {
    writeText: (text) => {
      assert(text === 'contact@marie-n.fr', 'Le texte copié doit être contact@marie-n.fr');
      return Promise.resolve();
    }
  },
  configurable: true,
  writable: true
});

// Helper pour appliquer des styles dans le mock GSAP
function applySet(target, vars) {
  if (!target) return;
  
  let elements = [];
  if (typeof target === 'string') {
    elements = Array.from(document.querySelectorAll(target));
  } else if (Array.isArray(target) || target instanceof window.NodeList) {
    elements = Array.from(target);
  } else {
    elements = [target];
  }

  elements.forEach(el => {
    if (!el) return;
    if (vars.className) el.className = vars.className;
    if (vars.display) el.style.display = vars.display;
    if (vars.opacity !== undefined) el.style.opacity = vars.opacity;
    if (vars.y !== undefined) el.style.transform = `translateY(${vars.y}px)`;
  });
}

// Mock de GSAP global pour simuler l'animation dans les tests
window.gsap = {
  to: (target, vars) => {
    if (vars.onStart) vars.onStart();
    applySet(target, vars);
    if (vars.onComplete) vars.onComplete();
  },
  set: (target, vars) => {
    applySet(target, vars);
  },
  timeline: (config) => {
    const tl = {
      to: function(target, vars, position) {
        if (vars && vars.onStart) vars.onStart();
        applySet(target, vars);
        if (vars && vars.onComplete) vars.onComplete();
        return tl;
      },
      set: function(target, vars) {
        applySet(target, vars);
        return tl;
      }
    };
    // Exécuter l'onComplete asynchroniquement à la fin de la chaîne pour mimer la timeline
    if (config && config.onComplete) {
      setTimeout(() => {
        config.onComplete();
      }, 10);
    }
    return tl;
  }
};

// Évaluer directement script.js dans le contexte global de JSDOM
window.eval(scriptContent);

// Simuler l'événement DOMContentLoaded pour déclencher l'initialisation de script.js
const event = new window.Event('DOMContentLoaded', {
  bubbles: true,
  cancelable: true
});
document.dispatchEvent(event);

// ================= TEST CASES =================

let failedTests = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS : ${message}`);
  } else {
    console.error(`  ❌ FAIL : ${message}`);
    failedTests++;
  }
}

try {
  // Récupérer les éléments
  const toggleItBtn = document.getElementById('toggle-it');
  const toggleLogisticsBtn = document.getElementById('toggle-logistics');
  const profileItSection = document.getElementById('profile-it');
  const profileLogisticsSection = document.getElementById('profile-logistics');
  const copyEmailBtn = document.getElementById('copy-email-btn');

  // 1. Vérification de l'état initial
  console.log('\n1. Vérification de l\'état initial de l\'application...');
  assert(document.body.classList.contains('profile-it') || document.body.className === 'profile-it', 'Le body doit avoir la classe profile-it par défaut.');
  assert(toggleItBtn.classList.contains('active'), 'Le bouton Informatique doit être actif par défaut.');
  assert(!toggleLogisticsBtn.classList.contains('active'), 'Le bouton Logistique ne doit pas être actif par défaut.');
  assert(toggleItBtn.getAttribute('aria-checked') === 'true', 'aria-checked de l\'IT doit être "true".');
  assert(toggleLogisticsBtn.getAttribute('aria-checked') === 'false', 'aria-checked de la Logistique doit être "false".');
  assert(profileItSection.getAttribute('aria-hidden') === 'false', 'Le profil IT doit être visible pour les lecteurs d\'écran (aria-hidden="false").');
  assert(profileLogisticsSection.getAttribute('aria-hidden') === 'true', 'Le profil Logistique doit être masqué pour les lecteurs d\'écran (aria-hidden="true").');

  // 2. Simuler le clic sur le profil Logistique
  console.log('\n2. Simulation du clic pour passer au profil Logistique...');
  toggleLogisticsBtn.click();

  // Attendre 20ms pour que la timeline asynchrone s'exécute
  setTimeout(() => {
    assert(document.body.className === 'profile-logistics', 'Le body doit maintenant avoir la classe profile-logistics.');
    assert(toggleLogisticsBtn.classList.contains('active'), 'Le bouton Logistique doit maintenant être actif.');
    assert(!toggleItBtn.classList.contains('active'), 'Le bouton Informatique ne doit plus être actif.');
    assert(toggleLogisticsBtn.getAttribute('aria-checked') === 'true', 'aria-checked de la Logistique doit passer à "true".');
    assert(toggleItBtn.getAttribute('aria-checked') === 'false', 'aria-checked de l\'IT doit passer à "false".');
    assert(profileItSection.getAttribute('aria-hidden') === 'true', 'Le profil IT doit être masqué (aria-hidden="true").');
    assert(profileLogisticsSection.getAttribute('aria-hidden') === 'false', 'Le profil Logistique doit être visible (aria-hidden="false").');

    // 3. Simuler le clic pour revenir au profil Informatique
    console.log('\n3. Simulation du clic pour revenir au profil Informatique...');
    toggleItBtn.click();

    setTimeout(() => {
      assert(document.body.className === 'profile-it', 'Le body doit être revenu à la classe profile-it.');
      assert(toggleItBtn.classList.contains('active'), 'Le bouton Informatique doit être à nouveau actif.');
      assert(!toggleLogisticsBtn.classList.contains('active'), 'Le bouton Logistique ne doit plus être actif.');
      assert(toggleItBtn.getAttribute('aria-checked') === 'true', 'aria-checked de l\'IT doit être "true".');
      assert(toggleLogisticsBtn.getAttribute('aria-checked') === 'false', 'aria-checked de la Logistique doit être "false".');

      // 4. Test du bouton de copie d'email
      console.log('\n4. Test du bouton interactif de copie d\'email...');
      copyEmailBtn.click();
      
      setTimeout(() => {
        const spanText = copyEmailBtn.querySelector('span').textContent;
        assert(spanText === 'Adresse copiée !', `Le texte du bouton doit de venir "Adresse copiée !" lors du clic. Texte actuel : "${spanText}"`);
        
        // Bilan
        console.log('\n=======================================');
        if (failedTests === 0) {
          console.log('🏆 TOUS LES TESTS SONT AU VERT ! LE CV EST PRÊT ! 🚀');
          process.exit(0);
        } else {
          console.error(`💥 ${failedTests} TEST(S) EN ÉCHEC. Veuillez corriger les bugs.`);
          process.exit(1);
        }
      }, 20);

    }, 20);

  }, 20);

} catch (error) {
  console.error('Une erreur critique est survenue pendant les tests :', error);
  process.exit(1);
}
