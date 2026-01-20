const express = require('express');
const cors = require('cors');
const youtubedl = require('youtube-dl-exec');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route principale
app.get('/', (req, res) => {
  res.json({
    message: 'Video Link Extractor API',
    version: '1.0.0',
    endpoints: {
      extract: '/api/extract?url=VIDEO_URL ou POST /api/extract avec {"url": "VIDEO_URL"}',
      health: '/health'
    }
  });
});

// Route de santé
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Route d'extraction (GET et POST)
app.all('/api/extract', async (req, res) => {
  try {
    // Récupérer l'URL de la vidéo
    const videoUrl = req.method === 'POST' 
      ? req.body.url 
      : req.query.url;

    if (!videoUrl) {
      return res.status(400).json({ 
        success: false,
        error: 'URL manquante',
        usage: 'GET /api/extract?url=VIDEO_URL ou POST avec {"url": "VIDEO_URL"}'
      });
    }

    console.log(`Extraction demandée pour: ${videoUrl}`);

    // Options pour yt-dlp
    const options = {
      dumpSingleJson: true,
      noCheckCertificates: true,
      noWarnings: true,
      preferFreeFormats: true,
      addHeader: [
        'referer:youtube.com',
        'user-agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      ],
      // Ignorer les erreurs de géo-restriction
      geoBypass: true,
    };

    // Extraire les informations avec yt-dlp
    const output = await youtubedl(videoUrl, options);

    // Trouver la meilleure qualité
    let bestFormat = output.formats && output.formats.length > 0 
      ? output.formats[output.formats.length - 1] 
      : null;

    // Préparer la réponse
    const response = {
      success: true,
      data: {
        title: output.title || 'Sans titre',
        directUrl: output.url || (bestFormat ? bestFormat.url : null),
        thumbnail: output.thumbnail,
        duration: output.duration,
        formats: output.formats ? output.formats.map(f => ({
          format_id: f.format_id,
          url: f.url,
          ext: f.ext,
          quality: f.quality || f.format_note,
          resolution: f.resolution,
          filesize: f.filesize,
          vcodec: f.vcodec,
          acodec: f.acodec
        })).filter(f => f.url) : []
      }
    };

    console.log(`Extraction réussie: ${response.data.title}`);
    return res.status(200).json(response);

  } catch (error) {
    console.error('Erreur lors de l\'extraction:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Impossible d\'extraire la vidéo',
      details: error.message,
      url: req.body.url || req.query.url
    });
  }
});

// Route pour extraire uniquement le lien direct (simplifié)
app.all('/api/direct', async (req, res) => {
  try {
    const videoUrl = req.method === 'POST' 
      ? req.body.url 
      : req.query.url;

    if (!videoUrl) {
      return res.status(400).json({ 
        success: false,
        error: 'URL manquante'
      });
    }

    const output = await youtubedl(videoUrl, {
      format: 'best',
      getUrl: true,
      noCheckCertificates: true,
      noWarnings: true
    });

    return res.status(200).json({
      success: true,
      directUrl: output
    });

  } catch (error) {
    console.error('Erreur:', error);
    return res.status(500).json({ 
      success: false,
      error: error.message
    });
  }
});

// Gestionnaire d'erreurs 404
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    error: 'Route non trouvée',
    path: req.path
  });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📡 Environnement: ${process.env.NODE_ENV || 'development'}`);
});


//https://manus.im/share/D8ANzUj6JqWWiTMiAJvmPz
