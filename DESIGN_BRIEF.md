# Kuldjuktau QR sahifasi: dizayn mezonlari

Asosiy auditoriya: konferensiyada poster yonida QR skanerlaydigan telefon foydalanuvchilari. Mobil ko‘rinish ustuvor; desktop yordamchi ko‘rinish.

- Asosiy kengliklar: 320, 360, 390 va 430 CSS px.
- Birinchi vazifa: QR ochgan bo‘limni o‘qish. Ikkinchi vazifa: tilni yoki bo‘limni almashtirish.
- O‘zbekcha, inglizcha va koreyscha to‘liq matnlar hamda ilmiy sonlar saqlanadi.
- Til almashtirish ekranda o‘qilayotgan bo‘limni saqlaydi.
- Asosiy boshqaruvlar kamida 44 px balandlikda; matn kamida 17 px va qulay satr oralig‘ida.
- Mundarija mobil ekranda yopiq boshlanadi; bo‘limdan to‘g‘ridan-to‘g‘ri chaqiriladi.
- QR fragmentlari #bolim-01 … #bolim-12 barqaror qoladi.
- UI ranglari: oq #ffffff, grafit #252520, tosh-kulrang #f3f4ef, sokin matn #6f716a. Faqat bo‘lim aksentlari uchun geologik zaytun #53654c, mineral binafsha #69577b va ruda-oxra #806d36 ishlatiladi.
- Shrift: qurilmaning o‘qilishi qulay sans-serif oilasi; koreyscha uchun Malgun Gothic/Noto Sans KR fallback.
- Tuzilma: posterning asl bosh qismi, mahkamlangan til/bo‘lim paneli, yig‘iladigan mundarija, bo‘lim tasviri va o‘qish ustuni, oldingi/keyingi bo‘lim, manbadan qaytish.
- Murakkab animatsiyalar va qo‘shimcha tarmoq kutubxonalari kerak emas.

Bu mezonlar 26.10.2026 kungi foydalanuvchi ko‘rsatmasi asosida belgilandi.

## Posterning web ko‘rinishi bo‘yicha tasdiqlangan yo‘nalish

- Sarlavha qismi haqiqiy poster nomi, mualliflari va KIGAM/UST logolaridan tuziladi.
- Vizual manba: `recovery/Poster_A0_last.pdf` (26.10.2026). 12 bo‘limning har biri shu PDFdan kesib olinadi; rasmlar mazmuni o‘zgartirilmaydi.
- Har bo‘limda asl inglizcha poster tasviri va tanlangan tildagi batafsil ilmiy izoh mavjud.
- Tasvirni kattalashtirish, yaqinlashtirish va asl faylni ochish mumkin.
- Nutqning salomlashuv/yakun matnlari va taxminiy nutq vaqti web sahifa interfeysidan olib tashlanadi. 1–12-bo‘limlarning ilmiy paragraflari aynan saqlanadi.
- Asl poster tasvirlari o‘z rangida qoladi. Web UI katta navy/teal rang bloklaridan foydalanmaydi.
- UI uchun Lucide ikonalar, til tanlash uchun flag-icons aktivlari mahalliy saqlanadi. Kutubxona litsenziyalari assets ichida.

## 26.10.2026: foydalanuvchi rad etgan shablon belgilari

- Katta to‘q ko‘k hero bloki, navy/teal fonli tugmalar va ko‘p yumaloq kartalar foydalanuvchi tomonidan standart AI uslubi deb baholandi.
- Oq fon, grafit sarlavha, texnik sans-serif tipografiya va faqat mayda geologik aksentlardan foydalaniladi.
- Til tanlashda rangli pill o‘rniga faol pastki chiziq; manbalarda kartochka o‘rniga ixcham ro‘yxat ishlatiladi.
- Desktopda sarlavha va muallif ma’lumotlari ikki ustun, mobil holatda qulay ketma-ketlikda. Asl poster rasmlari vizual e’tibor markazida qoladi.

## 26.10.2026: StoryMaps uslubi

- Foydalanuvchi ArcGIS StoryMaps uslubini so‘radi. Bu mahalliy web sahifa dizayniga tegishli; ArcGIS Online nashri yoki haqiqiy interaktiv web map yaratish hali so‘ralmagan.
- Katta xarita-muqova, oq sarlavha paneli, mualliflar va KIGAM/UST logolari.
- Muqova xaritasi posterdagi `Coyan Fig3 geology` asl rasmidan olinadi. CC BY 4.0 va maqola krediti ko‘rsatiladi.
- Desktopda docked sidecar: izoh chapda, ekran bo‘ylab o‘qishda ko‘rinib turadigan poster tasviri o‘ngda. Mobil holatda tasvir tepada, hikoya matni pastda.
- Uch mavzu bo‘yicha mahkamlangan story navigatsiyasi, faol mavzu va 01–12 o‘qish joyi ko‘rsatkichi, umumiy o‘qish progressi.
- Oq/graphite yo‘nalish davom etadi. StoryMaps Summit’ga yaqin sans-serif sarlavha va serif o‘qish matni; koreyscha matn uchun qurilma sans-serif fallback.
- Manba yo‘riqnomalari: https://doc.esri.com/en/arcgis-storymaps/latest/author-and-share/add-sidecars.html va https://doc.esri.com/en/arcgis-storymaps/latest/reference/theme-reference.html
