# AI Usage Documentation

## 1. Outils d'IA utilises

- **Claude Code (Anthropic, Claude Opus 4.6)** : Assistant IA principal utilise via le CLI Claude Code pour la generation du code, le debugging, et la documentation.
- **Playwright** : Outil d'automatisation de navigateur (non-IA) pour interagir avec le site cible.

## 2. Prompts tels que rediges

### Prompt 1 : Plan initial
> "Implement the following plan: Build a web app that wraps Playwright browser automation to perform Search -> Cart -> Checkout on practicesoftwaretesting.com. The app is a homework assignment graded on: automation quality (35%), flow correctness (25%), architecture (20%), tests (10%), and documentation (10%). [suivi du plan detaille avec la structure, le tech stack, et les etapes d'implementation]"

### Prompt 2 : Correction des images
> "Quand je fais une recherche, les produits correspondant s'affichent, mais pas leur image. Le site practicesoftwaretesting ne permet pas l'affichage ou il y a un bug ?"

### Prompt 3 : Correction du flux d'ajout au panier
> "Il bloque encore quand je clique sur Buy. OK, mais apres avoir clique sur buy, je veux que le produit se rajoute a la cart, ce n'est pas le cas pour le moment."

### Prompt 4 : Produit en rupture de stock + persistance du panier
> "Ca fonctionne pour plusieurs produits mais par exemple pour le Long Nose Pliers le add to cart charge infiniment. De plus il n'y a pas de persistance, si je retourne dans la recherche pour rajouter un produit, le contenu de la cart a disparu."

### Prompt 5 : Checkout qui tourne en boucle
> "Quand je clique sur complete purchase, le running checkout tourne infiniment."

## 3. Recommandations IA incorrectes et corrections appliquees

### Erreur 1 : Selecteurs CSS instables (`.card a` au lieu de `a.card`)
- **Probleme** : L'IA a genere le selecteur `.card a` avec `hasText` pour cliquer sur les produits. Sur practicesoftwaretesting.com, l'element `<a>` EST le `.card` lui-meme (pas un enfant), donc le selecteur ne trouvait jamais de correspondance, causant un timeout de 30s.
- **Correction** : Analyse du DOM reel avec un script de debug (`page.$$eval`). Remplacement par `a.card` et extraction du `href` et `data-test` directement depuis l'ancre.

### Erreur 2 : Selecteurs checkout incorrects (`address` au lieu de `street`)
- **Probleme** : L'IA a suppose que les champs du formulaire de checkout utilisaient `[data-test="address"]` et `[data-test="postcode"]`. En realite, le site utilise `[data-test="street"]` et `[data-test="postal_code"]`.
- **Impact** : Le checkout echouait systematiquement avec un timeout sur le champ d'adresse.
- **Correction** : Script de debug pour lister tous les `[data-test]` du formulaire. Correction des selecteurs et de la sequence des etapes (proceed-2 = skip sign-in, proceed-3 = apres adresse, finish = apres paiement).

### Erreur 3 : Attente sur `.card` correspondant aux cartes squelette
- **Probleme** : `waitForSelector('.card')` se declenchait immediatement car le site affiche des cartes squelette (skeleton loading) avec la meme classe `.card` avant le chargement des vrais produits.
- **Correction** : Remplacement par `waitForSelector('[data-test="product-name"]')` qui n'apparait que lorsque les donnees reelles sont chargees.

### Erreur 4 : Pas de gestion des produits en rupture de stock
- **Probleme** : L'IA n'a pas anticipe que certains produits ont le bouton `#btn-add-to-cart` desactive (disabled). Playwright attendait indefiniment que le bouton devienne cliquable.
- **Correction** : Ajout d'une verification `isAddToCartEnabled()` avec un timeout de 5s. Si le bouton est desactive, une erreur claire "Product is out of stock" est renvoyee au lieu d'un timeout de 30s.

### Erreur 5 : URLs de produits `unknown-N`
- **Probleme** : L'extracteur utilisait `card.querySelector('a')` pour obtenir le lien produit, mais sur ce site la carte EST l'element `<a>`. Le selecteur retournait `null`, generant des URLs invalides comme `/product/unknown-1`.
- **Correction** : Cast de l'element card en `HTMLAnchorElement` et utilisation directe de `anchor.href` et `anchor.dataset.test` pour extraire l'ID et l'URL.

### Erreur 6 : Images non affichees (`getAttribute('src')` vs `imgEl.src`)
- **Probleme** : `getAttribute('src')` retourne le chemin relatif tel qu'ecrit dans le HTML (ex: `/assets/img/product.avif`). Ce chemin est inutilisable par le frontend qui tourne sur un autre domaine.
- **Correction** : Utilisation de `imgEl.src` (propriete DOM) qui retourne l'URL absolue resolue par le navigateur.

### Erreur 7 : Expiration de session non geree
- **Probleme** : Le checkout reutilisait le navigateur de la recherche. Apres un delai (ex: 30 min), la session sur practicesoftwaretesting.com expirait. Le bouton `proceed-2` n'apparaissait pas car le site demandait une reconnexion.
- **Correction** : Ajout d'un `loginFlow(page)` automatique avant chaque checkout pour garantir une session fraiche.

## 4. Prevention des fuites de secrets

### Mesures implementees :

1. **Variables d'environnement** : Les identifiants du site (`TEST_EMAIL`, `TEST_PASSWORD`) sont configures via `.env` et jamais codes en dur dans le code source. Les valeurs par defaut sont celles du compte de test public de practicesoftwaretesting.com.

2. **`.gitignore`** : Le fichier `.env` et tous les fichiers `.env.*` sont exclus du controle de version :
   ```
   .env
   .env.*
   !.env.example
   ```

3. **`.env.example`** : Un fichier modele est fourni avec des placeholders, sans valeurs sensibles :
   ```
   TEST_EMAIL=customer@practicesoftwaretesting.com
   TEST_PASSWORD=welcome01
   HEADLESS=true
   ```
   Note : ces identifiants sont publics (fournis par le site de test).

4. **Validation des entrees** : Toutes les entrees utilisateur sont validees par des schemas Zod avant traitement, empechant l'injection de donnees malveillantes.

5. **Pas de tokens/API keys** : L'application n'utilise aucune cle API externe. L'authentification se fait uniquement via le formulaire de login du site cible dans le navigateur Playwright.
