// Orijinal Hamming kodunu ve üzerinde işlem yapılmış halini saklamak için diziler
let originalHammingData = [];
let currentHammingData = [];

// Kullanıcının girdiği veriye göre Hamming kodunu oluşturur
function hammingcode(){
  const input = document.getElementById("dataInput").value.trim();

  // Sadece 8, 16 veya 32 bitlik ikili girişe izin verilir
  if(!/^[01]{8}$|^[01]{16}$|^[01]{32}$/.test(input)) {
    alert("Lütfen 8, 16 veya 32 bit uzunluğunda ikili veri girin!");
    return;
  }

  const reversedInput = input.split("").reverse().join(""); // Girişi ters çevir (sağdan sola)
  originalHammingData = generateHammingCode(reversedInput); // Hamming kodu oluştur
  currentHammingData = [...originalHammingData]; // Kopyasını al

  // Kullanıcıya oluşturulan Hamming kodunu göster
  document.getElementById("generatedCode").innerText = "Hamming Kodu: " + [...originalHammingData].reverse().join(""); // Görsel olarak tekrar düz sıraya çevir
  document.getElementById("errorCode").innerText = ""; // Hata alanını temizle
  document.getElementById("correctionResult").innerText = ""; // Sonuç alanını temizle
}

// Verilen veriden Hamming kodunu üretir
function generateHammingCode(data){
  const m = data.length;
  let r = 0;
  // Gerekli parite bitlerini (r) hesapla
  while(2 ** r - 1< m + r){
    r++;
  }

  const totalBits = m + r + 1; // SEC-DED için toplam bit (veri + parite + SEC)
  const hamming = Array(totalBits + 1).fill(0); // 1-indexli dizi

  let j = 0;
  // Veri bitlerini, parite bitlerinin olmadığı yerlere yerleştir
  for(let i =1; i<= totalBits; i++){
    if ((i & (i - 1)) !== 0 && i !== totalBits) {
      hamming[i] = parseInt(data[j]);
      j++;
    }
  }

  // Parite bitlerini hesapla ve yerleştir
  for(let i = 0; i < r; i++){
    const pos = 2 ** i;
    let parity = 0;
    for(let k=1; k<=totalBits; k++) {
      if ((k & pos) !== 0 && k !== totalBits) {
        parity ^= hamming[k];
      }
    }
    hamming[pos] = parity;
  }

  // Son parite (SEC biti) hesaplanır (tüm bitlerin XOR'u)
  let lastParity = 0;
  for(let i =1;i< totalBits; i++) {
    lastParity ^= hamming[i];
  }
  
  hamming[totalBits] = lastParity; // SEC biti son indexte

  return hamming.slice(1); // 1. indexten itibaren döndür
}

// Tek bitlik rastgele hata ekler
function addError(){
  if(originalHammingData.length === 0) 
    return;

  const errorData = [...originalHammingData];
  const errorIndex = Math.floor(Math.random() * errorData.length); // Rastgele hata yeri
  errorData[errorIndex] ^= 1; // Hata: biti tersine çevir

  currentHammingData = errorData;
  document.getElementById("errorCode").innerText =`Tek Hatalı Kod [bit ${errorIndex + 1}]: ${[...errorData].reverse().join("")}`;
  document.getElementById("correctionResult").innerText = "";
}

// Çift bitlik rastgele hata ekler
function addDoubleError(){
  if (originalHammingData.length === 0) 
    return;

  const errorData =[...originalHammingData];
  let idx1 = Math.floor(Math.random() * errorData.length);
  let idx2 = Math.floor(Math.random() * errorData.length);

  while (idx1 === idx2) { // Aynı bit olmamalı
    idx2 = Math.floor(Math.random() * errorData.length);
  }

  errorData[idx1] ^= 1;
  errorData[idx2] ^= 1;

  currentHammingData = errorData;
  document.getElementById("errorCode").innerText = `Çift Hatalı Kod [bit ${idx1 + 1} & ${idx2 + 1}]: ${[...errorData].reverse().join("")}`;
  document.getElementById("correctionResult").innerText = "";
}

// Hamming kodunu analiz edip hatayı bulup düzeltmeye çalışır
function correctError(){
  if (currentHammingData.length === 0) 
    return;

  const data = [0, ...currentHammingData]; // 1-indexli yapmak için başa 0 ekle
  const n = data.length - 1;
  let r = 0;// Parite bitlerinin sayısını hesapla
  while (2 ** r < n){
    r++;
  }
  let syndrome = 0;

  // Her parite biti için pariteyi hesapla
  for(let i = 0; i < r; i++){
    const pos = 2 ** i;
    let parity = 0;
    for (let k = 1; k < n; k++) {
      if ((k & pos) !== 0) parity ^= data[k];
    }
    if (parity !== 0) syndrome += pos; // Hatalı bitin pozisyonu
  }

  // SEC bitini kontrol et
  let lastParity = 0;
  for (let i = 1; i <= n; i++){
    lastParity ^= data[i];
  }

  // Hata yoksa
  if(syndrome === 0 && lastParity === 0){
    document.getElementById("correctionResult").innerText = "Kod zaten hatasız. Düzeltmeye gerek yok.";
  } 
  else if(syndrome !== 0 && lastParity === 1){// Tek hata varsa
    data[syndrome] ^= 1; // Hatalı biti düzelt
    document.getElementById("correctionResult").innerText = `Tek hata bulundu: bit ${syndrome}.\nDüzeltildikten sonra kod:\n${[...data.slice(1)].reverse().join("")}`;
  } 
  else if(syndrome === 0 && lastParity === 1){// Sadece SEC biti hatalıysa
    data[n] ^= 1; // SEC biti düzeltir
    document.getElementById("correctionResult").innerText = `SEC biti (bit ${n}) hatalı bulundu.\nDüzeltildikten sonra kod:\n${[...data.slice(1)].reverse().join("")}`;
  } 
  else{// Çift hata varsa
    document.getElementById("correctionResult").innerText = "Çift Hata Tespit Edildi. Düzeltilemez!";
  }
}