# CV Double Profil — Marie N.

Un site web CV One-page ultra-moderne, réactif et accessible conçu pour présenter deux profils professionnels distincts (Informatique / Systèmes & Réseaux vs Logistique / Conduite & Polyvalence) avec un système de bascule élégant.

## 🚀 Fonctionnalités Clés
- **Transition Premium :** Changement de profil fluide à 60 fps géré par **GSAP (GreenSock)** avec effets d'apparition en cascade (*stagger*).
- **Design Sombre & Glassmorphism :** Esthétique élégante basée sur un fond abysse profond et des cartes translucides en verre dépoli (`backdrop-filter`).
- **Thémage Dynamique :** Transition de couleur d'accent par variables CSS (Bleu électrique pour l'informatique, Terracotta pour la logistique).
- **Accessibilité (A11Y) :** Navigation et activation du commutateur entièrement prises en charge au clavier (`tabindex`, touche `Espace` / `Entrée`), attributs `aria-checked` et `aria-hidden` synchronisés en temps réel, et respect de la préférence système `prefers-reduced-motion`.
- **Copie d'Email "Waouh" :** Bouton de copie rapide de l'adresse email dans le presse-papier avec confirmation visuelle animée et mécanisme de secours (*fallback*).

---

## 📁 Structure du Projet
```
cv-dual-profile/
├── index.html                  # Structure HTML5 sémantique et accessible
├── css/
│   └── style.css               # Charte graphique, Glassmorphism et adaptabilité mobile
├── js/
│   └── script.js               # Logique d'interactivité, accessibilité clavier et GSAP
├── tests/
│   └── test_interactivity.js   # Suite de tests d'interactivité automatisée sous JSDOM
└── package.json                # Fichier de configuration npm et dépendances de test
```

---

## 🛠️ Installation & Tests

### Prérequis
- [Node.js](https://nodejs.org/) (recommandé pour exécuter les tests d'interactivité locale)

### 1. Installation des dépendances de test
Dans le dossier racine, exécutez :
```bash
npm install
```

### 2. Exécution des tests automatisés
Pour valider l'interactivité, l'état initial, la gestion ARIA et le comportement du presse-papier :
```bash
npm test
```

---

## ⚠️ Notes importantes pour Marie N.
1. **Numéro de téléphone :** Dans `index.html` (ligne 448), remplacez le numéro fictif `+33 (0)6 00 00 00 00` et le lien d'appel `tel:+33000000000` par vos véritables coordonnées.
2. **Hébergement :** Le projet étant entièrement statique (HTML, CSS, JS), il peut être hébergé instantanément et gratuitement sur [GitHub Pages](https://pages.github.com/), [Vercel](https://vercel.com/), ou [Netlify]().
