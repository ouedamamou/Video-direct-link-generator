# Video Link Extractor API

API REST pour extraire les liens directs de vidéos à partir de multiples plateformes (Sibnet, Vidmoly, VK, YouTube, etc.) en utilisant yt-dlp.

## 🚀 Déploiement sur Render

### Étape 1 : Préparer le projet

1. Créer un nouveau dépôt GitHub
2. Cloner ce projet dans le dépôt
3. Pousser le code :
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/VOTRE_USERNAME/video-extractor-api.git
git push -u origin main
```

### Étape 2 : Déployer sur Render

1. Aller sur [render.com](https://render.com)
2. Créer un compte ou se connecter
3. Cliquer sur "New +" → "Web Service"
4. Connecter votre dépôt GitHub
5. Configurer :
   - **Name** : `video-extractor-api`
   - **Environment** : `Node`
   - **Build Command** : `npm install`
   - **Start Command** : `npm start`
   - **Plan** : Free (ou payant selon vos besoins)
6. Cliquer sur "Create Web Service"

### Étape 3 : Installer yt-dlp sur Render

Ajouter dans les paramètres de Render :

**Environment Variables** :
- Aucune variable nécessaire pour le moment

**Build Command** (optionnel pour installer yt-dlp système) :
```bash
npm install && curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp && chmod a+rx /usr/local/bin/yt-dlp
```

## 📖 Utilisation

### Endpoint principal : `/api/extract`

**GET Request** :
```bash
curl "https://votre-app.onrender.com/api/extract?url=https://sibnet.ru/video/..."
```

**POST Request** :
```bash
curl -X POST https://votre-app.onrender.com/api/extract \
  -H "Content-Type: application/json" \
  -d '{"url": "https://vidmoly.to/..."}'
```

**Réponse** :
```json
{
  "success": true,
  "data": {
    "title": "Titre de la vidéo",
    "directUrl": "https://lien-direct.mp4",
    "thumbnail": "https://...",
    "duration": 1234,
    "formats": [
      {
        "format_id": "best",
        "url": "https://direct-link.mp4",
        "ext": "mp4",
        "quality": "720p",
        "resolution": "1280x720"
      }
    ]
  }
}
```

### Endpoint simplifié : `/api/direct`

Retourne uniquement le lien direct :
```bash
curl "https://votre-app.onrender.com/api/direct?url=https://vk.com/video..."
```

**Réponse** :
```json
{
  "success": true,
  "directUrl": "https://lien-direct.mp4"
}
```

## 🌐 Sites supportés

- ✅ Sibnet
- ✅ Vidmoly
- ✅ VK
- ✅ YouTube
- ✅ Dailymotion
- ✅ Plus de 1000+ sites supportés par yt-dlp

## 🧪 Test en local
```bash
# Installer les dépendances
npm install

# Démarrer le serveur
npm start

# Ou en mode développement
npm run dev
```

Tester l'API :
```bash
curl "http://localhost:3000/api/extract?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ"
```

## 📝 Notes

- Le plan gratuit de Render peut avoir des temps de démarrage lents (cold start)
- Pour de meilleures performances, considérez un plan payant
- L'API inclut CORS pour permettre les requêtes depuis n'importe quel domaine
