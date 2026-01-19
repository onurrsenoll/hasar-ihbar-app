// Vercel Serverless Function - Değer Kaybı AI Rapor
// API: /api/deger-kaybi-rapor

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
    const degerKaybiVerileri = req.body;

    if (!degerKaybiVerileri || !degerKaybiVerileri.degerKaybi) {
      return res.status(400).json({ error: 'Değer kaybı verileri eksik!' });
    }

    // Anthropic API key environment variable'dan al
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'API key tanımlanmamış!' });
    }

    const {
      plaka,
      marka,
      modelYili,
      aracYasi,
      kilometre,
      rayicDeger,
      onarimBedeli,
      hasarTuru,
      hasarliBolgeler,
      oncekiHasar,
      degerKaybi,
      degerKaybiYuzdesi,
      yasFaktoru,
      hasarFaktoru,
      amortismanOrani,
      tarih
    } = degerKaybiVerileri;

    const hasarliAlanlar = hasarliBolgeler?.map(b => b.ad).join(', ') || 'Belirtilmedi';

    const prompt = `Sen bir sigorta ve hukuk uzmanısın. Aşağıdaki verilere göre Sigorta Tahkim Komisyonu ve Yargıtay içtihatlarına uygun, profesyonel bir ARAÇ DEĞER KAYBI TESPİT RAPORU hazırla.

ARAÇ BİLGİLERİ:
- Plaka: ${plaka || 'Belirtilmedi'}
- Marka/Model: ${marka || 'Belirtilmedi'}
- Model Yılı: ${modelYili}
- Araç Yaşı: ${aracYasi} yıl
- Kilometre: ${kilometre || 'Belirtilmedi'}
- Güncel Rayiç Değeri: ${rayicDeger?.toLocaleString('tr-TR')} TL

HASAR BİLGİLERİ:
- Hasar Türü: ${hasarTuru}
- Hasarlı Bölgeler: ${hasarliAlanlar}
- Toplam Onarım Bedeli: ${onarimBedeli?.toLocaleString('tr-TR')} TL
- Önceki Hasar Sayısı: ${oncekiHasar}

HESAPLAMA SONUÇLARI:
- Amortisman Oranı: %${(amortismanOrani * 100).toFixed(0)}
- Yaş Faktörü: ${yasFaktoru?.toFixed(4)}
- Hasar Ağırlık Faktörü: ${hasarFaktoru?.toFixed(4)}
- Hesaplanan Değer Kaybı: ${degerKaybi?.toLocaleString('tr-TR')} TL
- Değer Kaybı Yüzdesi: %${degerKaybiYuzdesi}

RAPOR FORMATI:
1. Profesyonel başlık ve rapor numarası
2. Araç ve hasar bilgileri özeti
3. Değer kaybı hesaplama metodolojisi açıklaması (Yargıtay azalan bakiyeler yöntemi)
4. İlgili Yargıtay kararları ve emsal içtihatlar (gerçek karar numaraları kullan: 17. Hukuk Dairesi kararları)
5. Sigorta Tahkim Komisyonu ilkeleri
6. Sonuç ve değerlendirme
7. Yasal uyarılar

Raporu Türkçe ve resmi dilde yaz. Rapor metni düz metin olsun (markdown kullanma).`;

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
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Anthropic API hatası:', data);
      return res.status(response.status).json({
        error: 'AI rapor oluşturma hatası',
        details: data
      });
    }

    // Yanıtı al
    const raporContent = data.content?.find(c => c.type === 'text')?.text || '';

    if (raporContent) {
      return res.status(200).json({
        success: true,
        rapor: raporContent
      });
    } else {
      return res.status(400).json({
        error: 'Rapor oluşturulamadı',
        rawResponse: data
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
