# 🚀 Hasar İhbar Uygulaması - Vercel Deployment

AI destekli profesyonel hasar ihbar formu sistemi.

## ✨ Özellikler

- 📸 **AI Ruhsat Okuma:** Ruhsat fotoğrafını yükle, marka/plaka/şasi otomatik doldurulur
- 📋 **AI Parça Listesi Okuma:** El yazısı parça listesini bile okur, otomatik fiyatlandırır
- 💾 **Dosya Kaydetme:** Plaka ve ad ile kayıt, arama
- 📊 **Excel Çıktı:** Komple veya sadece parça listesi Excel
- 🖨️ **PDF/Yazdır:** A4 formatında profesyonel çıktı
- 💰 **KDV Hesaplama:** İsteğe bağlı %20 KDV hesaplama
- 🔧 **İşçilik:** KDV'siz işçilik bedeli ekleme

---

## 📦 Kurulum Adımları

### 1. Vercel Hesabı Oluştur

1. https://vercel.com adresine git
2. **"Sign Up with GitHub"** butonuna tıkla
3. GitHub hesabınla giriş yap
4. Yetkilendirmeyi onayla

### 2. GitHub'a Yükle

#### Yöntem A: Web Üzerinden (Kolay)

1. GitHub'da yeni repository oluştur:
   - Repository adı: `hasar-ihbar-app`
   - Public veya Private seç
   - "Create repository" tıkla

2. Dosyaları yükle:
   - "uploading an existing file" linkine tıkla
   - Tüm dosyaları sürükle-bırak
   - "Commit changes" tıkla

#### Yöntem B: Git ile (Pro)

```bash
# Repository'yi klonla
git clone https://github.com/kullanıcıadın/hasar-ihbar-app.git
cd hasar-ihbar-app

# Dosyaları kopyala
# (indirdiğin ZIP'teki dosyaları buraya kopyala)

# Git'e ekle
git add .
git commit -m "İlk commit"
git push origin main
```

### 3. Vercel'e Deploy Et

1. Vercel Dashboard'a git: https://vercel.com/dashboard
2. **"Add New Project"** tıkla
3. **"Import Git Repository"** → GitHub repo'nu seç
4. **"hasar-ihbar-app"** repository'sini seç
5. **"Deploy"** butonuna bas
6. Bekle... (30-60 saniye)
7. ✅ **Tamamlandı!**

### 4. API Anahtarını Ekle

**ÇOK ÖNEMLİ:** API key olmadan AI tarama çalışmaz!

1. Vercel Dashboard → Project Settings
2. **"Environment Variables"** sekmesine git
3. Yeni değişken ekle:
   - **Key:** `ANTHROPIC_API_KEY`
   - **Value:** `sk-ant-api03-...` (senin API key'in)
   - **Environment:** Production, Preview, Development (hepsini seç)
4. **"Save"** tıkla
5. **Redeploy gerekli:**
   - Deployments sekmesine git
   - En üstteki deployment'ın yanında **"..."** → **"Redeploy"**
   - Onayla

### 5. Domain (Link) Al

Vercel otomatik domain verir:
```
https://hasar-ihbar-app.vercel.app
```

Veya kendi domain'ini bağla:
1. Settings → Domains
2. Domain adını yaz (örn: hasarapp.com)
3. DNS ayarlarını yap
4. Hazır!

---

## 🎯 Kullanım

### Ruhsat Okuma

1. **Parça Listesi** sekmesine git
2. **🤖 AI İLE OTOMATIK TARAMA** bölümünde **"📸 Ruhsat Seç"**
3. Ruhsat fotoğrafını seç
4. AI otomatik okur (10-20 saniye)
5. Marka, plaka, şasi otomatik doldurulur!

### Parça Listesi Okuma

1. **Parça Listesi** sekmesinde **"📋 Parça Listesi Seç"**
2. El yazısı/fotoğraf/PDF seç
3. AI okur ve fiyatlandırır (20-30 saniye)
4. Önizleme gösterir
5. **"✅ ONAYLA VE EKLE"** bas
6. Parçalar tabloya eklenir!

### Dosya Kaydetme

1. Formu doldur (En az: Plaka + Araç Sahibi Adı)
2. **"💾 DOSYAYI KAYDET"** tıkla
3. Kaydedildi!

### Dosya Arama

1. **"🔍 DOSYA ARA"** tıkla
2. Plaka veya ad soyad yaz
3. Dosyayı bul
4. **"📂 Yükle"** veya **"🗑️ Sil"**

---

## 🔧 Güncellemelgeliştirme

Kod değişikliği yaptın mı?

1. GitHub'a push et:
   ```bash
   git add .
   git commit -m "Güncelleme açıklaması"
   git push
   ```

2. Vercel **OTOMATIK deploy eder!** (30 saniye)
3. Link aynı kalır, değişiklikler yayına girer!

---

## 🛠️ Sorun Giderme

### AI Tarama Çalışmıyor

**Sorun:** "API key tanımlanmamış" hatası

**Çözüm:**
1. Vercel → Settings → Environment Variables
2. `ANTHROPIC_API_KEY` var mı kontrol et
3. Yoksa ekle
4. Redeploy yap

---

### CORS Hatası

**Sorun:** "CORS policy" hatası

**Çözüm:** Vercel API fonksiyonları CORS ayarlarını zaten yapıyor. Eğer hata alıyorsan:
1. Tarayıcı önbelleğini temizle (CTRL+SHIFT+DEL)
2. Sayfayı yenile (CTRL+F5)

---

### Deployment Başarısız

**Sorun:** Build hatası

**Çözüm:**
1. Dosya yapısını kontrol et:
   ```
   /
   ├── index.html
   ├── api/
   │   ├── ruhsat-oku.js
   │   └── parca-oku.js
   ├── vercel.json
   └── .gitignore
   ```
2. Vercel logs'a bak (Deployments → Failed → View Logs)

---

## 📊 Limitler (Bedava Plan)

- ✅ **Bandwidth:** 100 GB/ay (bol bol yeter!)
- ✅ **Deployments:** Sınırsız
- ✅ **Serverless Functions:** 100 GB-hours
- ✅ **Build Time:** 6 saat/ay

**Senin kullanımına fazlasıyla yeter!** Günde 50-100 kişi kullansa bile limit dolmaz.

---

## 💡 İpuçları

1. **Net Fotoğraf:** Ruhsat/parça listesi net olmalı (bulanık okumaz)
2. **İyi Işık:** Iyi aydınlatılmış fotoğraf
3. **PDF Tercih:** Eğer PDF varsa fotoğraftan daha iyi okur
4. **Dosya Boyutu:** Max 5MB (büyük dosyalar yavaş yükler)

---

## 🔐 Güvenlik

- ✅ API key backend'de (kimse görmez)
- ✅ HTTPS otomatik (SSL sertifikası)
- ✅ CORS koruması
- ✅ Güvenli environment variables

**API key'i asla GitHub'a ATMA!** Environment Variables'da sakla.

---

## 📞 Destek

Sorun mu yaşıyorsun?

1. README'yi tekrar oku
2. Vercel docs: https://vercel.com/docs
3. Anthropic docs: https://docs.anthropic.com

---

## 🎉 Tebrikler!

Artık profesyonel bir bulut uygulamasın var! 🚀

**Link:** https://hasar-ihbar-app.vercel.app

Herkese paylaşabilirsin! 💪
