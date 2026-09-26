# Déploiement sur Hostinger

Le site comporte une partie serveur (API, formulaires, e-mails, administration) :
il nécessite **Node.js**. Deux options chez Hostinger.

## Option 1 — VPS Hostinger (recommandé, contrôle total)

Prérequis : un VPS (KVM 1 suffit) avec l'image **Ubuntu 24.04 + Docker** (choix
proposé à la création du VPS), et le domaine pointant vers l'IP du VPS
(enregistrement A `@` → IP, CNAME `www` → `expresssfinance.com`).

```bash
# 1. Connexion
ssh root@IP_DU_VPS

# 2. Récupérer le projet
apt update && apt install -y git
git clone https://github.com/shallare/expressfinance.git /opt/expressfinance
cd /opt/expressfinance

# 3. Variables d'environnement : copier le contenu de votre .env.local local
nano .env.local        # coller, Ctrl+O, Entrée, Ctrl+X

# 4. Construire et lancer (écoute sur 127.0.0.1:3000)
docker compose --env-file .env.local up -d --build

# 5. Reverse-proxy HTTPS avec Caddy (certificat automatique)
apt install -y caddy
cat > /etc/caddy/Caddyfile <<'CADDY'
expresssfinance.com, www.expresssfinance.com {
    reverse_proxy 127.0.0.1:3000
    encode gzip
}
CADDY
systemctl reload caddy
```

Le site est alors accessible sur https://expresssfinance.com.

Mise à jour après un `git push` :

```bash
cd /opt/expressfinance && git pull && docker compose --env-file .env.local up -d --build
```

## Option 2 — Hébergement Node.js dans hPanel (plans Business / Cloud récents)

Si votre plan affiche **Sites web → Créer → Node.js** (ou « Web apps ») :

1. Créez l'application en pointant sur le dépôt GitHub `shallare/expressfinance`, branche `main`.
2. Version Node : 20 ou 22. Commande de build : `npm run build`. Commande de démarrage : `npm start`.
3. Ajoutez toutes les variables de `.env.local` dans la section *Variables d'environnement*.
4. Rattachez le domaine `expresssfinance.com` à l'application.

Si cette option n'apparaît pas dans votre hPanel, votre plan est un hébergement
web classique (PHP) : il ne peut pas exécuter ce site — passez à l'option 1.

## Après la mise en ligne

- Supabase → Authentication → URL Configuration : Site URL `https://expresssfinance.com`, Redirect URL `https://expresssfinance.com/**`.
- Testez `/contact` (e-mail reçu sur Gmail), `/demande` avec un PDF, puis `/admin/connexion`.
