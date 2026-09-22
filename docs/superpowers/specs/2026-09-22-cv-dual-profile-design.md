# Spécifications Techniques et Design : Site CV One-page "Double Profil" Marie N.

Date : Mardi 22 Septembre 2026  
Statut : Validé par l'utilisateur  
Auteur : Gemini CLI (Expert Web & UX/UI)

---

## 1. Objectifs du Projet
L'objectif est de concevoir et réaliser un site web CV "One-page" moderne, responsive, accessible et interactif pour Marie N. La particularité majeure réside dans la présentation de deux profils professionnels très distincts (Informatique vs Logistique & Transport) via un mécanisme de basculement ("toggle") fluide, élégant et performant (visant les 60 fps constants).

### Critères globaux (Socle Commun) :
- **Mobilité :** Actuellement dans les Côtes-d'Armor, recherche active sur Paris et l'Île-de-France.
- **Flexibilité :** Ouverte à différents types de contrats (CDI non obligatoire), emplois alimentaires, et travail de nuit (uniquement à temps partiel ou complémentaire).

---

## 2. Charte Graphique et Identité Visuelle

### Ambiance Globale : "Abysse Premium & Glassmorphism"
Le site adopte un thème sombre, épuré, digne d'un site primé (Awwwards), mettant l'accent sur la lisibilité, le raffinement et des animations sophistiquées.

- **Arrière-plan :** Fond bleu nuit extrêmement profond (Abysse) avec des dégradés radiaux doux.
- **Cartes (Glassmorphism) :** 
  - Fond translucide sombre : `rgba(17, 24, 39, 0.55)`
  - Flou d'arrière-plan : `backdrop-filter: blur(12px)`
  - Bordure ultra-fine : `1px solid rgba(255, 255, 255, 0.08)` (simule le reflet de lumière sur la tranche du verre)
  - Ombre douce : `0 8px 32px 0 rgba(0, 0, 0, 0.37)`
- **Typographie :** Combinaison de polices modernes de type sans-serif (ex. Inter, Plus Jakarta Sans) pour une lisibilité maximale.

### Changement d'Univers par Touches d'Accentuation
Le fond et le squelette du site restent identiques. Seules les couleurs d'accentuation et les lueurs (*glow*) basculent pour marquer le changement d'univers :
1. **Profil Informatique (IT) :** 
   - Couleur d'accentuation : Bleu électrique / Violet léger (`#3B82F6` ou `#6366F1`)
   - Style : Formes géométriques nettes et épurées, icônes technologiques de type "outline".
2. **Profil Logistique, Transport & Polyvalence :** 
   - Couleur d'accentuation : Terracotta chaleureux / Ambre (`#E07A5F` ou `#F4A261`)
   - Style : Icônes d'action claires, agencement s'adaptant en douceur avec des tonalités rassurantes et humaines.

---

## 3. Architecture Technique et Structure HTML

Le site sera développé comme un site statique ultra-performant.

### Structure des fichiers
```
cv-dual-profile/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
└── assets/
    └── icons/  (Icônes SVG intégrées)
```

### Sémantique HTML5
- `<header>` : Nom de la candidate, critères généraux (Mobilité, Contrats) et Bouton de contact.
- `<nav>` (ou Hero Header) : Le Commutateur central (Toggle) en verre dépoli permettant de basculer de profil.
- `<main>` : Conteneur principal englobant les deux profils présents simultanément dans le DOM.
  - `<section id="profile-it">` (Actif par défaut)
  - `<section id="profile-logistics" class="hidden">`
- `<footer>` : Section d'appel à l'action (CTA) et formulaire/coordonnées de contact unifiés.

### Accessibilité (A11Y)
- Utilisation de `aria-hidden="true"` sur le profil masqué et `aria-hidden="false"` sur le profil visible.
- Commutateur entièrement utilisable au clavier (`tabindex="0"`, rôles `role="checkbox"` ou `role="radiogroup"` avec gestion du clavier via JavaScript).
- Contrastes respectant le niveau AA de la norme WCAG (vitesse de lecture et lisibilité optimisées).

---

## 4. Chorégraphie des Animations (GSAP)

Pour assurer une fluidité à 60 fps, la transition entre les profils est orchestrée par la bibliothèque d'animation **GSAP** (GreenSock) :

1. **Sortie (0.25s) :** 
   - Effet de cascade (*stagger*) de `0.04s` sur les cartes du profil actif.
   - Atténuation de l'opacité (`opacity: 0`) et translation verticale descendante (`y: 15px`).
2. **Bascule d'Accentuation (0.4s) :**
   - Glissement du curseur physique du commutateur de gauche à droite (ou inversement) avec un amorti de type `power3.out`.
   - Changement de classe CSS sur le `<body>` pour transiter en douceur les variables de couleur d'accentuation `--accent-color` et de lueur.
3. **Alternance dans le DOM :**
   - Masquage du profil sortant (`display: none`).
   - Révélation du profil entrant (`display: block` ou `grid`, initialement à `opacity: 0`).
4. **Entrée (0.45s) :**
   - Apparition en cascade (*stagger* de `0.06s`) des cartes du nouveau profil.
   - Transition de l'opacité (`opacity: 1`) et translation verticale depuis le haut (`y: -15px` ➔ `y: 0`).

### Mode Performance & Mouvement Réduit
- Utilisation de `will-change` en CSS sur les propriétés animées pour forcer l'accélération matérielle.
- Respect de `prefers-reduced-motion` : si activé, les translations de coordonnées sont désactivées et la transition se réduit à un fondu enchaîné d'opacité de 0.15s.

---

## 5. Contenus des Profils

### Profil Global / Entête de Page
- **Nom :** Marie N.
- **Mobilité :** Actuellement dans les Côtes-d'Armor, recherche active sur Paris et l'Île-de-France.
- **Flexibilité :** CDI non obligatoire, ouverte à d'autres types de contrats (CDD, intérim, etc.), aux emplois "alimentaires" et au travail de nuit (uniquement à temps partiel / complémentaire).

### Profil 1 : Informatique (Technicienne Systèmes & Réseaux / Support N2)
- **Présentation :** Recherche d'un poste stable dans une infrastructure après une expérience enrichissante en TPE. Passionnée par l'administration, le support et la sécurité, j'ai le sens du service client (Helpdesk, diagnostic).
- **Compétences clés :** 
  - Support N1/N2, diagnostic et helpdesk
  - Virtualisation & Conteneurs : Proxmox, Docker
  - Suites collaboratives : Google Workspace, Microsoft 365
  - Réseaux : Cisco L3 (notions CCNA 1), pfSense (pare-feu)
  - Systèmes : Linux (Debian, Ubuntu, Arch), Windows Server
- **Expériences :**
  - **Accompagnement IT & Support Freelance** (Amour Breton, 11 mois) : Gestion de l'infrastructure, support utilisateur, maintenance préventive.
  - **Stage Administratrice d'infrastructures sécurisées** (VoltR, 4 mois) : Déploiement réseau, mise en sécurité de serveurs, documentation technique.
  - **Stage Immersion ESN** (S.F.2.I., 1 mois) : Support client de proximité, résolution d'incidents matériels et logiciels.
- **Formation :**
  - **Titre Professionnel RNCP37680 - Administrateur d'infrastructures sécurisées** (AFPA Brest, 2025).

### Profil 2 : Logistique, Transport et Polyvalence (Chauffeuse-Livreuse, Factrice, etc.)
- **Présentation :** Passionnée par la conduite et le contact humain. Autonome, rigoureuse et habituée à mener des tournées rythmées à bord de véhicules utilitaires pour garantir un service fiable, ponctuel et sécurisé.
- **Compétences clés :** 
  - Sécurité routière, éco-conduite et respect strict du Code de la route
  - Gestion de tournée autonome et optimisation de parcours
  - Ponctualité, rigueur et gestion du temps
  - Manutention, port de charges et chargement sécurisé
  - Relationnel client de qualité, image de marque de l'entreprise
- **Atouts & Permis :** Permis B, véhicule personnel, excellente posture ergonomique et application stricte des consignes de sécurité.
- **Expériences :**
  - **Veilleuse de nuit** (Belambra, 9 mois) : Gestion des arrivées tardives, rondes de sécurité physique, gestion des imprévus (notamment gestion des infrastructures lors du passage de la tempête Ciaran).
  - **Assistante préparatrice ligne d'impression** (Ouest-Pack, 4 mois) : Manutention, réglage de premier niveau des machines, alimentation des lignes, contrôle qualité.
  - **Ouvrière de nettoyage** (2 mois) : Entretien des locaux administratifs et industriels avec application rigoureuse des consignes d'hygiène.
  - **Service Civique en EHPAD** (8 mois) : Accompagnement des résidents, animation d'ateliers, écoute active et transport PMR de proximité.

---

## 6. Contact et CTA unifiés

- **Email :** `contact@marie-n.fr`
- **Numéro de téléphone :** (Prévu sous forme d'un bouton d'appel interactif direct)
- **Fonctionnalités "Waouh" de la section de contact :**
  - Bouton interactif de copie rapide de l'adresse email dans le presse-papier avec confirmation visuelle animée.
  - Formulaire de contact minimaliste ou boutons d'accès rapide aux messageries principales.
