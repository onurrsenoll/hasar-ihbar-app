// Vercel Serverless Function - Parça Listesi Okuma
// API: /api/parca-oku

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // OPTIONS request için
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Sadece POST kabul et
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageData, mediaType } = req.body;

    if (!imageData) {
      return res.status(400).json({ error: 'Görsel verisi eksik!' });
    }

    // Anthropic API key environment variable'dan al
    const apiKey = process.env.ANTHROPIC_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: 'API key tanımlanmamış!' });
    }

    // Anthropic API'ye istek gönder
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType || 'image/jpeg',
                data: imageData
              }
            },
            {
              type: 'text',
              text: `Bu parça listesini analiz et. El yazısı, fotoğraf veya PDF olabilir.

Her parça için şunları çıkar:
- Parça adı
- OEM/Parça kodu (varsa)
- ORİJİNAL fiyat (TL cinsinden, yetkili servis fiyatı)
- Miktar (belirtilmemişse 1 yaz)

ÖNEMLİ: 
- Sadece ORİJİNAL parça fiyatları (muadil/eşdeğer istemiyoruz)
- Yetkili servis/ana bayi fiyatları
- Stok durumu önemli değil, sadece DOĞRU FİYAT önemli

SADECE JSON formatında döndür:
{
  "parcalar": [
    {
      "name": "parça adı",
      "oem": "kod veya boş",
      "original": 5200,
      "quantity": 1
    }
  ]
}

Başka açıklama ekleme, sadece JSON.`
            }
          ]
        }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Anthropic API hatası:', data);
      return res.status(response.status).json({ 
        error: 'AI okuma hatası', 
        details: data 
      });
    }

    // Yanıtı parse et
    const textContent = data.content?.find(c => c.type === 'text')?.text || '';
    const jsonMatch = textContent.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      const parcaData = JSON.parse(jsonMatch[0]);
      
      if (parcaData.parcalar && parcaData.parcalar.length > 0) {
        return res.status(200).json({
          success: true,
          data: parcaData
        });
      } else {
        return res.status(400).json({ 
          error: 'Parça bulunamadı',
          rawResponse: textContent
        });
      }
    } else {
      return res.status(400).json({ 
        error: 'Parça listesi okunamadı',
        rawResponse: textContent
      });
    }

  } catch (error) {
    console.error('Sunucu hatası:', error);
    return res.status(500).json({ 
      error: 'Sunucu hatası', 
      message: error.message 
    });
  }
}
