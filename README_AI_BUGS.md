# AI-Generated Bugs & Issues

Ce document liste les bugs trouves dans le code genere par l'IA et les corrections appliquees.

## Bugs trouves et corriges

### Bug 1 : Selecteur `.card a` ne correspond a rien
- **Fichier** : `packages/automation/src/pages/home.page.ts`
- **Severite** : Critique
- **Symptome** : Le clic sur un produit timeout apres 30s ("waiting for locator('.card a').filter({ hasText: '...' })")
- **Cause** : Sur practicesoftwaretesting.com, `<a class="card">` est l'element racine. Le selecteur `.card a` cherche un `<a>` enfant d'un `.card`, qui n'existe pas.
- **Fix** : Selecteur change en `a.card`, navigation directe par URL produit au lieu du clic par titre.

### Bug 2 : `waitForSelector('.card')` declenche trop tot
- **Fichier** : `packages/automation/src/pages/home.page.ts`
- **Severite** : Haute
- **Symptome** : L'extraction de produits retourne des donnees vides car les cartes squelette (skeleton) sont detectees avant le chargement des vraies donnees.
- **Cause** : `.card` matche les cartes de chargement du framework Angular.
- **Fix** : Attente sur `[data-test="product-name"]` qui n'apparait qu'avec les vraies donnees.

### Bug 3 : Images des produits non affichees
- **Fichier** : `packages/automation/src/extractors/product-extractor.ts`
- **Severite** : Moyenne
- **Symptome** : Les cartes produit s'affichent sans image.
- **Cause** : `getAttribute('src')` retourne le chemin relatif (`/assets/img/...`), inutilisable depuis le frontend.
- **Fix** : Utilisation de `imgEl.src` (URL absolue resolue par le navigateur).

### Bug 4 : URLs produit invalides (`unknown-N`)
- **Fichier** : `packages/automation/src/extractors/product-extractor.ts`
- **Severite** : Critique
- **Symptome** : Navigation vers `/product/unknown-1` => page 404 => timeout.
- **Cause** : `card.querySelector('a')` retourne `null` car la carte est elle-meme un `<a>`. Le href etait vide, l'ID fallback `unknown-N`.
- **Fix** : Cast en `HTMLAnchorElement`, lecture directe de `anchor.href` et `anchor.dataset.test`.

### Bug 5 : Produits en rupture de stock bloquent l'ajout au panier
- **Fichier** : `packages/automation/src/pages/product-detail.page.ts`
- **Severite** : Haute
- **Symptome** : L'ajout au panier de "Long Nose Pliers" charge indefiniment (timeout 30s x 3 retries).
- **Cause** : Le bouton `#btn-add-to-cart` est `disabled` pour les produits hors stock. `page.click()` attend que l'element soit "enabled", ce qui n'arrive jamais.
- **Fix** : Verification `isAddToCartEnabled()` avec timeout 5s. Erreur claire "Product is out of stock" si desactive.

### Bug 6 : Selecteurs checkout incorrects
- **Fichier** : `packages/automation/src/pages/checkout.page.ts`
- **Severite** : Critique
- **Symptome** : Le checkout timeout sur "waiting for [data-test='address'] to be visible".
- **Cause** : Le site utilise `[data-test="street"]` et `[data-test="postal_code"]`, pas `address` et `postcode`. La sequence des boutons proceed etait aussi incorrecte.
- **Fix** : Debug du DOM reel, correction de tous les selecteurs et de la sequence (proceed-2 = skip sign-in, proceed-3 = apres adresse, finish = apres paiement).

### Bug 7 : Session expiree lors du checkout
- **Fichier** : `packages/server/src/services/purchase.service.ts`
- **Severite** : Haute
- **Symptome** : Le checkout echoue si l'utilisateur attend entre l'ajout au panier et le checkout. `proceed-2` n'est jamais visible.
- **Cause** : La session sur practicesoftwaretesting.com expire. Le navigateur est reutilise mais l'authentification n'est plus valide.
- **Fix** : Ajout d'un `loginFlow(page)` automatique avant chaque checkout.

### Bug 8 : Pas de persistance du panier
- **Fichiers** : `packages/server/src/stores/cart-store.ts` (nouveau), `packages/client/src/pages/CartPage.tsx`
- **Severite** : Haute
- **Symptome** : Les produits ajoutes au panier disparaissent si on retourne a la recherche.
- **Cause** : Le panier etait stocke uniquement dans le state React (`location.state`), perdu a chaque navigation.
- **Fix** : Creation d'un `cartStore` cote serveur avec endpoint `GET /api/cart`. Le CartPage charge les items depuis le serveur.

### Bug 9 : Screenshot sauvegarde au mauvais endroit
- **Fichier** : `packages/automation/src/helpers/screenshot.ts`
- **Severite** : Basse
- **Symptome** : Le dossier `screenshots/` a la racine du projet reste vide apres un checkout reussi.
- **Cause** : Le chemin relatif `./screenshots` est resolu par rapport au CWD du serveur (`packages/server/`), pas la racine du projet.
- **Fix** : Resolution du chemin absolu via `import.meta.url` vers la racine du monorepo.

## Problemes connus restants

### 1. Store en memoire
Le `runStore` et `cartStore` sont en memoire. Un redemarrage du serveur perd toutes les donnees. Acceptable pour un projet de demonstration.

### 2. Un navigateur par recherche
Chaque recherche lance un nouveau navigateur Playwright. Des recherches concurrentes consomment beaucoup de memoire.

### 3. Dependance au texte du toast
`addToCart()` attend le texte exact "Product added to shopping cart." — si le site change ce message, le flow echouera (avec retry et capture d'erreur).
