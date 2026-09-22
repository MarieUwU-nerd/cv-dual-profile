# Plan d'implémentation : Site CV One-page "Double Profil" Marie N.

> **Pour les agents automatiques :** SOUS-COMPÉTENCE REQUIS : Utilisez `superpowers:subagent-driven-development` (recommandé) ou `superpowers:executing-plans` pour implémenter ce plan tâche par tâche. Les étapes utilisent la syntaxe des cases à cocher (`- [ ]`) pour le suivi.

**Objectif :** Concevoir et coder un site web CV "One-page" premium, fluide, adaptatif et accessible, mettant en valeur le double profil professionnel de Marie N. (Informatique vs Logistique) grâce à une transition chorégraphiée de haut niveau avec GSAP.

**Architecture :** Application monopage (SPA) statique optimisée. La structure HTML sémantique contient les deux profils dans le DOM, le style CSS gère le design "Abysse Glassmorphism" et l'adaptabilité mobile via des variables CSS thématiques, tandis que le JavaScript avec GSAP orchestre le basculement asymétrique et fluide à 60 fps.

**Stack Technique :** HTML5 sémantique, CSS3 moderne (Variables CSS, Flexbox/Grid, Backdrop-filters), JavaScript Vanilla (ES6+), GSAP (GreenSock Animation Platform) via CDN sécurisé, et un script de test Node.js + JSDOM.

**Spécification :** `/home/marie/Projects/cv-dual-profile/docs/superpowers/specs/2026-09-22-cv-dual-profile-design.md`

## Contraintes Globales

- **Zéro dépendance lourde :** Pas de frameworks JS complexes (React/Angular non requis pour ce besoin, sauf si demandé). Nous utilisons HTML/CSS/JS statiques pour une performance maximale.
- **GSAP via CDN sécurisé :** Chargement asynchrone et sécurisé de GSAP 3.x depuis cdnjs ou jsDelivr.
- **Sémantique et Accessibilité (A11Y) :** Navigation clavier fluide sur le commutateur, attributs ARIA dynamiques, et respect strict de `prefers-reduced-motion`.
- **Responsive design fluide :** Compatibilité totale du layout mobile (de 320px de large) jusqu'aux écrans de bureau ultra-larges.
- **Portabilité :** Les icônes SVG doivent être intégrées directement (inline) dans le HTML pour éliminer les requêtes HTTP secondaires et accélérer le rendu visuel.

## Focus de Revue (Review Focus)

1. **Fluidité à 60 fps sur Mobile :** S'assurer que les propriétés animées utilisent l'accélération matérielle via `will-change` et que les transitions s'appliquent uniquement sur des propriétés performantes (`transform`, `opacity`).
2. **Accessibilité du Commutateur (Toggle) :** Le commutateur doit être focalisable au clavier (`tabindex="0"`) et réagir aux touches `Espace` et `Entrée` de manière identique au clic de souris.
3. **Mise à jour ARIA lors de la bascule :** Vérifier que `aria-hidden` passe de `true` à `false` sur le profil entrant et inversement sur le profil sortant.
4. **Comportement de Copie d'Email fiable :** Tester que le bouton de copie rapide fonctionne, n'échoue pas silencieusement si l'API `navigator.clipboard` n'est pas disponible (fallback de sélection de texte).
5. **Sauvegarde des Performances de Rendu (Backdrop Filter Fallback) :** S'assurer que sur les navigateurs obsolètes ou mobiles d'entrée de gamme, le site reste élégant et lisible même sans support de `backdrop-filter: blur()`.

---

## Tâches d'Implémentation

### Task 1 : Structure HTML Sémantique (Scaffolding)

**Fichiers :**
- Créer : `/home/marie/Projects/cv-dual-profile/index.html`
- Créer : `/home/marie/Projects/cv-dual-profile/assets/icons/` (Dossier pour référence, icônes intégrées inline)

**Interfaces :**
- Consomme : Spécifications de contenu de la Spec Section 5.
- Produit : Le squelette HTML complet avec les conteneurs `#profile-it` et `#profile-logistics` présents dans le DOM.

- [ ] **Étape 1.1 : Créer la structure de base HTML5**
  Créer le fichier `index.html` avec les balises structurelles nécessaires (`<!DOCTYPE html>`, `<html>`, `<head>`, `<body>`, `<header>`, `<main>`, `<footer>`).

- [ ] **Étape 1.2 : Rédiger le Socle Commun (Header & Hero)**
  Ajouter le titre, la présentation globale de Marie N., et l'affichage visible des critères de Mobilité (Côtes-d'Armor vers Paris / Île-de-France) et de Flexibilité.

- [ ] **Étape 1.3 : Intégrer le composant Commutateur (Toggle)**
  Ajouter le squelette HTML du commutateur avec les attributs d'accessibilité nécessaires :
  ```html
  <div class="toggle-container" role="radiogroup" aria-label="Choisir le profil professionnel">
    <button id="toggle-it" class="toggle-btn active" role="radio" aria-checked="true" tabindex="0">Informatique</button>
    <button id="toggle-logistics" class="toggle-btn" role="radio" aria-checked="false" tabindex="0">Logistique</button>
    <span class="toggle-slider" aria-hidden="true"></span>
  </div>
  ```

- [ ] **Étape 1.4 : Ajouter les deux sections de profils dans le DOM**
  - Section `#profile-it` contenant : Résumé, Grille de compétences (Support N1/N2, Proxmox, Docker, etc.), Expériences (Amour Breton, VoltR, S.F.2.I.), Formation (AFPA).
  - Section `#profile-logistics` (avec la classe `hidden` et `aria-hidden="true"`) contenant : Résumé, Atouts (Permis, manutention), Expériences (Belambra, Ouest-Pack, Ouvrière de nettoyage, Service Civique).
  *Utiliser des icônes SVG inline épurées pour chaque compétence/expérience.*

- [ ] **Étape 1.5 : Rédiger la section Contact unifiée (Footer)**
  Ajouter les coordonnées de contact (`contact@marie-n.fr`, bouton d'appel interactif) et le bouton de copie d'email.

- [ ] **Étape 1.6 : Valider la structure HTML**
  Ouvrir le fichier dans un navigateur ou utiliser un validateur HTML en ligne de commande (si disponible) pour s'assurer que toutes les balises sont correctement fermées et s'affichent textuellement.

- [ ] **Étape 1.7 : Effectuer le premier Commit**
  ```bash
  cd /home/marie/Projects/cv-dual-profile
  git init
  git add index.html
  git commit -m "feat: structure HTML5 sémantique du double CV"
  ```

---

### Task 2 : Styles CSS de Base & Flex/Grid Layouts

**Fichiers :**
- Créer : `/home/marie/Projects/cv-dual-profile/css/style.css`
- Modifier : `/home/marie/Projects/cv-dual-profile/index.html` (Lien vers la feuille de style)

**Interfaces :**
- Consomme : `index.html` (les classes et IDs définis à la Tâche 1).
- Produit : Un site web au layout moderne, responsive et lisible, sans effets de verre dépoli complexes (gérés à la Tâche 3).

- [ ] **Étape 2.1 : Définir le Reset CSS et les Polices**
  Créer `css/style.css`. Déclarer l'importation de la police "Plus Jakarta Sans" ou "Inter" via Google Fonts `@import`, et configurer le reset de base (box-sizing, margins, body font-family).

- [ ] **Étape 2.2 : Structurer la grille globale et le responsive layout**
  Rédiger les styles pour les conteneurs principaux : `.hero`, `.grid-layout`, `.skills-grid`, `.timeline-experience`. Utiliser CSS Grid (`grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))`) et Flexbox pour assurer une réadaptation automatique sur mobile.

- [ ] **Étape 2.3 : Styliser les cartes de base et la typographie**
  Donner du style aux textes (titres, paragraphes, sous-titres) et aux cartes d'expériences (bordures simples, padding, alignement des éléments, positionnement des icônes SVG).

- [ ] **Étape 2.4 : Lier et vérifier le style**
  S'assurer que le fichier CSS est correctement lié dans l'en-tête de `index.html` (`<link rel="stylesheet" href="css/style.css">`) et que la mise en page s'adapte parfaitement lors du redimensionnement de l'écran.

- [ ] **Étape 2.5 : Commit**
  ```bash
  git add css/style.css index.html
  git commit -m "feat: layout CSS moderne et responsive"
  ```

---

### Task 3 : CSS Glassmorphism & Thèmes d'Univers

**Fichiers :**
- Modifier : `/home/marie/Projects/cv-dual-profile/css/style.css`

**Interfaces :**
- Consomme : `css/style.css` (Tâche 2).
- Produit : Un design sombre haut de gamme avec des cartes en verre dépoli et des variables thématiques de couleurs d'accentuation changeant au clic.

- [ ] **Étape 3.1 : Déclarer les Variables CSS `:root` et le thème de base**
  Ajouter à la racine du fichier CSS les variables pour le fond sombre (`--bg-main`), le dégradé radial, le texte, et les variables dynamiques de couleur d'accentuation (Bleu électrique pour le profil informatique par défaut).

- [ ] **Étape 3.2 : Implémenter le style Glassmorphism sur les cartes**
  Appliquer les propriétés avancées sur les cartes `.profile-card` ou `.skill-card` :
  ```css
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow);
  ```

- [ ] **Étape 3.3 : Configurer la surcharge thématique du profil Logistique**
  Déclarer les variables surchargées sous le sélecteur `body.profile-logistics` (couleur Terracotta `#E07A5F`, ombre de lueur terracotta). S'assurer que toutes les cartes et éléments interactifs utilisent `var(--accent-color)` pour leurs contours, textes d'accent ou halos.

- [ ] **Étape 3.4 : Créer le style du Commutateur (Toggle Switch)**
  Concevoir le commutateur en verre dépoli avec sa capsule centrale, son fond translucide, ses boutons interactifs et son indicateur coulissant (`.toggle-slider`) en position absolue.

- [ ] **Étape 3.5 : Gérer le Fallback de performance**
  Ajouter une règle `@supports NOT (backdrop-filter: blur(1px))` pour fournir un fond de carte plus opaque (`rgba(17, 24, 39, 0.95)`) si le flou d'arrière-plan n'est pas supporté.

- [ ] **Étape 3.6 : Commit**
  ```bash
  git add css/style.css
  git commit -m "feat: design Glassmorphism et variables thématiques de couleur d'accentuation"
  ```

---

### Task 4 : Interactivité JavaScript et Accessibilité

**Fichiers :**
- Créer : `/home/marie/Projects/cv-dual-profile/js/script.js`
- Modifier : `/home/marie/Projects/cv-dual-profile/index.html` (Lien vers `script.js` avant `</body>`)

**Interfaces :**
- Consomme : Structure DOM de `index.html` (Tâche 1) et styles de `css/style.css` (Tâches 2 et 3).
- Produit : Une interactivité native fluide (changement de profils, gestion ARIA, copie d'email) avant l'intégration GSAP.

- [ ] **Étape 4.1 : Créer le fichier `js/script.js` et lier au DOM**
  Lier le script à la fin de `index.html` : `<script src="js/script.js"></script>`.

- [ ] **Étape 4.2 : Écrire la fonction de bascule de profil de base (sans GSAP)**
  Ajouter les écouteurs d'événements de clic sur les boutons du commutateur. Au clic, permuter la classe `profile-logistics` sur le `<body>`, ajouter/retirer la classe `hidden` sur les sections de profils correspondantes.

- [ ] **Étape 4.3 : Implémenter l'accessibilité clavier sur le Commutateur**
  Permettre d'activer les boutons du commutateur à l'aide des touches `Entrée` et `Espace` en écoutant l'événement `keydown` :
  ```javascript
  function handleKeyboardToggle(event) {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      toggleProfile(event.target.id);
    }
  }
  ```

- [ ] **Étape 4.4 : Synchroniser l'état ARIA**
  Écrire la fonction `updateAriaStates(activeProfile)` qui met à jour dynamiquement `aria-checked` (sur les boutons) et `aria-hidden` (sur les conteneurs de profils `#profile-it` et `#profile-logistics`).

- [ ] **Étape 4.5 : Implémenter le bouton interactif de copie d'email**
  Écrire la fonction de copie d'email avec gestion du presse-papier (`navigator.clipboard.writeText`) et un message de confirmation dynamique temporaire ("Copié !") :
  ```javascript
  const copyBtn = document.getElementById('copy-email-btn');
  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText('contact@marie-n.fr').then(() => {
      copyBtn.textContent = 'Adresse copiée !';
      setTimeout(() => { copyBtn.textContent = 'Copier l\'adresse email'; }, 2000);
    });
  });
  ```

- [ ] **Étape 4.6 : Commit**
  ```bash
  git add js/script.js index.html
  git commit -m "feat: interactivité JS, accessibilité clavier et copie d'email"
  ```

---

### Task 5 : Animations Premium avec GSAP

**Fichiers :**
- Modifier : `/home/marie/Projects/cv-dual-profile/index.html` (Liaison de GSAP via CDN)
- Modifier : `/home/marie/Projects/cv-dual-profile/js/script.js`

**Interfaces :**
- Consomme : `js/script.js` (Tâche 4) et `css/style.css` (Tâche 3).
- Produit : Une transition fluide (60 fps) en 4 phases avec effets de cascade et respect de `prefers-reduced-motion`.

- [ ] **Étape 5.1 : Importer GSAP dans index.html**
  Ajouter le script CDN de GSAP juste avant le script local dans `index.html` :
  ```html
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  ```

- [ ] **Étape 5.2 : Configurer le déplacement physique du curseur du commutateur**
  Rédiger l'animation du curseur `.toggle-slider` avec GSAP pour qu'il glisse élégamment vers la gauche ou vers la droite selon le bouton actif :
  ```javascript
  gsap.to('.toggle-slider', { x: targetPosition, duration: 0.4, ease: 'power3.out' });
  ```

- [ ] **Étape 5.3 : Implémenter la chorégraphie globale de transition (Timeline)**
  Remplacer la bascule brute de la Tâche 4 par une `gsap.timeline()` chorégraphiée en 4 phases :
  - Phase 1 : Disparition en cascade des cartes actives (opacity: 0, y: 15, stagger: 0.04).
  - Phase 2 : Transition de la classe de couleur sur le `body` et glissement du commutateur.
  - Phase 3 : Masquage instantané de l'ancien profil et affichage du nouveau à opacity: 0.
  - Phase 4 : Apparition en cascade du nouveau profil (opacity: 1, y: 0 depuis y: -15, stagger: 0.06).

- [ ] **Étape 5.4 : Prendre en compte `prefers-reduced-motion`**
  Vérifier les préférences système de l'utilisateur. Si `window.matchMedia('(prefers-reduced-motion: reduce)').matches` est vrai, utiliser des animations simplifiées de fondu enchaîné de `0.15s` sans déplacements horizontaux ou verticaux.

- [ ] **Étape 5.5 : Optimiser l'accélération matérielle**
  Ajouter `will-change: transform, opacity;` dans `css/style.css` pour les classes de cartes animées afin d'assurer les 60 fps constants sur mobile.

- [ ] **Étape 5.6 : Commit**
  ```bash
  git add index.html js/script.js css/style.css
  git commit -m "feat: transition chorégraphiée premium avec GSAP à 60 fps"
  ```

---

### Task 6 : Tests et Validation Globale

**Fichiers :**
- Créer : `/home/marie/Projects/cv-dual-profile/tests/test_interactivity.js`
- Créer : `/home/marie/Projects/cv-dual-profile/package.json`

**Interfaces :**
- Consomme : `index.html`, `js/script.js` et `css/style.css` finalisés.
- Produit : Une suite de validation automatisée exécutable via Node.js pour garantir le fonctionnement du toggle et de la copie d'email.

- [ ] **Étape 6.1 : Initialiser package.json et installer JSDOM**
  Créer `/home/marie/Projects/cv-dual-profile/package.json` et installer `jsdom` pour permettre de simuler l'environnement du navigateur sous Node.js :
  ```bash
  cd /home/marie/Projects/cv-dual-profile
  npm init -y
  npm install jsdom --save-dev
  ```

- [ ] **Étape 6.2 : Écrire le script de test unitaire automatisé**
  Créer `tests/test_interactivity.js` pour charger `index.html` et `js/script.js`, puis simuler un clic sur le bouton de profil Logistique et vérifier que :
  1. La classe thématique s'applique sur le `body`.
  2. L'attribut `aria-checked="true"` se déplace sur le bon bouton.
  3. L'attribut `aria-hidden="false"` est correctement appliqué sur la section correspondante.

- [ ] **Étape 6.3 : Exécuter le test localement**
  Lancer le test avec Node.js :
  ```bash
  node tests/test_interactivity.js
  ```
  S'assurer que tous les tests passent avec succès.

- [ ] **Étape 6.4 : Audit de conformité Accessibilité et Mobile**
  Effectuer des tests manuels ou utiliser un linter de code pour vérifier les contrastes des couleurs, l'absence d'erreurs de syntaxe, et l'adaptabilité de la mise en page sur mobile.

- [ ] **Étape 6.5 : Sauvegarder la version finale et fêter le succès !**
  Faire le dernier commit pour enregistrer la configuration de test.
  ```bash
  git add package.json tests/test_interactivity.js
  git commit -m "test: ajout de la suite de validation de l'interactivité avec JSDOM"
  ```
