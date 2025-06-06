# Hamming SEC-DED Code Simulator

Hamming Single Error Correction - Double Error Detection (SEC-DED) kodlama algoritmasını simüle eden interaktif web uygulaması.

## 📋 İçindekiler

- [Genel Bakış](#genel-bakış)
- [Özellikler](#özellikler)
- [Kurulum](#kurulum)
- [Kullanım](#kullanım)
- [Algoritma Detayları](#algoritma-detayları)
- [Fonksiyon Referansı](#fonksiyon-referansı)
- [Örnekler](#örnekler)
- [Teknik Detaylar](#teknik-detaylar)

## 🎯 Genel Bakış

Bu proje, veri iletiminde ve depolamada hata tespiti ve düzeltmesi için kullanılan **Hamming SEC-DED** kodlama sistemini görselleştirir. Kullanıcılar 8, 16 veya 32 bitlik veri girişi yaparak:

- Hamming kodu oluşturabilir
- Tek veya çift hata ekleyebilir  
- Hata tespit ve düzeltme işlemlerini gözlemleyebilir

## ✨ Özellikler

- **🔢 Esnek Veri Boyutu**: 8, 16, 32 bit veri desteği
- **🛡️ Hata Düzeltme**: Tek bit hatalarını otomatik düzeltme
- **🔍 Hata Tespiti**: Çift bit hatalarını tespit etme
- **🎲 Rastgele Hata**: Tek ve çift hata simülasyonu
- **📊 Görsel Geri Bildirim**: Adım adım sonuç gösterimi
- **🌐 Web Tabanlı**: Tarayıcıda çalışan basit arayüz

## 🚀 Kurulum

### Gereksinimler
- Modern web tarayıcısı (Chrome, Firefox, Safari, Edge)
  
### Kurulum Adımları

1. **Projeyi İndirin**
   ```bash
   git clone https://github.com/ahmetymtkn/hammingSec-DedCode.git
   cd hamming-sec-ded-simulator
   ```

2. **Dosyaları Kontrol Edin**
   ```
   hamming-sec-ded-simulator/
   ├── index.html
   ├── script.js
   └── README.md
   ```

3. **Uygulamayı Çalıştırın**
   
   **Seçenek A**: Doğrudan tarayıcıda açın
   ```bash
   # index.html dosyasını tarayıcıya sürükleyin
   ```
   

## 📖 Kullanım

### Temel Kullanım Adımları

1. **Veri Girişi**
   - Text kutusuna 8, 16 veya 32 bitlik binary veri girin
   - Örnek: `10101010`, `1100110011001100`, `11110000111100001111000011110000`

2. **Hamming Kodu Oluşturma**
   - "Hamming Kodu Oluştur" butonuna tıklayın
   - Oluşturulan kod ekranda görüntülenir

3. **Hata Simülasyonu**
   - **Tek Hata**: "Rastgele Tek Hata Ekle" butonu
   - **Çift Hata**: "Rastgele Çift Hata Ekle" butonu

4. **Hata Düzeltme**
   - "Hatayı Tespit Et & Düzelt" butonuna tıklayın
   - Sistem hatayı analiz eder ve sonucu gösterir


## 🔬 Algoritma Detayları

### Hamming SEC-DED Teorisi

**SEC-DED** = Single Error Correction + Double Error Detection

- **Tek Hata**: Tespit edilir ve otomatik düzeltilir
- **Çift Hata**: Tespit edilir ancak düzeltilemez
- **Parite Bitleri**: 2^i pozisyonlarında (1, 2, 4, 8, 16...)
- **SEC Biti**: Tüm bitlerin XOR'u (çift hata tespiti için)

### Hata Karar Matrisi

| Syndrome | Overall Parity | Durum |
|----------|----------------|-------|
| 0 | 0 | ✅ Hata Yok |
| ≠0 | 1 | 🔧 Tek Hata (Düzeltilebilir) |
| 0 | 1 | ⚠️ SEC Biti Hatası |
| ≠0 | 0 | ❌ Çift Hata (Düzeltilemez) |

### Parite Bit Sayısı Hesaplama

```
2^r >= m + r + 1
```
- `m`: Veri bit sayısı
- `r`: Parite bit sayısı
- `+1`: SEC biti için

## 🔧 Fonksiyon Referansı

### `hammingcode()`
Kullanıcı girdisinden Hamming kodu oluşturur.

**Çalışma Mantığı:**
```javascript
1. Giriş doğrulama (8/16/32 bit kontrolü)
2. Veriyi ters çevirme (LSB-MSB düzeni için)
3. Hamming kodu üretme
4. Sonucu görüntüleme
```

### `generateHammingCode(data)`
Binary veri için Hamming SEC-DED kodu üretir.

**Parametreler:**
- `data`: Binary string (reversed)

**Algoritmik Adımlar:**
1. Parite bit sayısını hesapla
2. Veri bitlerini yerleştir (2^i pozisyonları hariç)
3. Parite bitlerini hesapla
4. SEC bitini ekle (tüm bitlerin XOR'u)

### `addError()` / `addDoubleError()`
Rastgele hata simülasyonu yapar.

**Tek Hata:**
```javascript
errorData[randomIndex] ^= 1;  // XOR ile bit flipping
```

**Çift Hata:**
```javascript
errorData[index1] ^= 1;
errorData[index2] ^= 1;  // İki farklı pozisyon
```

### `correctError()`
Hata analizi ve düzeltme işlemi yapar.

**Syndrome Hesaplama:**
```javascript
for(let i = 0; i < r; i++) {
    const pos = 2 ** i;
    let parity = calculateParityForPosition(pos);
    if (parity !== 0) syndrome += pos;
}
```

## 💡 Örnekler

### 8-bit Veri Örneği

**Giriş Verisi:** `10101010`

**1. Adım - Hamming Kodu Oluşturma:**
```
Pozisyonlar: 1  2  3  4  5  6  7  8  9 10 11 12 13
Tip:        P1 P2 D1 P4 D2 D3 D4 P8 D5 D6 D7 D8 SEC
Değerler:    0  0  0  1  1  0  1  0  0  1  0  1  1
```

**2. Adım - Parite Hesaplama:**
- P1 (pos 1): kontrol eder → 3,5,7,9,11 → 1⊕1⊕1⊕1⊕1 = 1
- P2 (pos 2): kontrol eder → 3,6,7,10,11 → 1⊕0⊕1⊕0⊕1 = 1  
- P4 (pos 4): kontrol eder → 5,6,7,12 → 1⊕0⊕1⊕0 = 0
- P8 (pos 8): kontrol eder → 9,10,11,12 → 1⊕0⊕1⊕0 = 0

**3. Adım - SEC Biti:**
```
SEC = 1⊕1⊕1⊕0⊕1⊕0⊕1⊕0⊕1⊕0⊕1⊕0 = 1
```

**Final Hamming Kodu:** `1110101010101`

### Hata Düzeltme Örneği

**Hatalı Kod:** Pozisyon 5'te hata (`1110001010101`)

**Syndrome Hesaplama:**
- P1 kontrol: hata var → syndrome += 1
- P2 kontrol: hata yok → syndrome += 0  
- P4 kontrol: hata var → syndrome += 4
- P8 kontrol: hata yok → syndrome += 0

**Syndrome = 1 + 4 = 5** → Hata pozisyon 5'te!

**Düzeltme:** Pozisyon 5'teki biti flip et → `1110101010101`

## ⚙️ Teknik Detaylar

### Desteklenen Veri Boyutları

| Veri Boyutu | Parite Bitleri | SEC Biti | Toplam Bit |
|-------------|----------------|----------|------------|
| 8 bit | 4 | 1 | 13 bit |
| 16 bit | 5 | 1 | 22 bit |
| 32 bit | 6 | 1 | 39 bit |

### Performans Analizi

**Zaman Karmaşıklığı:**
- Kod üretimi: O(n log n)
- Hata tespiti: O(log n)
- Hata düzeltme: O(1)

**Alan Karmaşıklığı:**
- O(n) where n = veri + parite + SEC bitleri

### Dosya Yapısı

```
index.html          # Ana HTML sayfa ve CSS stilleri
script.js           # JavaScript algoritma implementasyonu
README.md          # Bu dokümantasyon
```

⭐ Bu proje faydalı olduysa yıldız vermeyi unutmayın!
