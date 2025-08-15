
# Call Center AI Chat UI

Bu proje, çağrı merkezi uygulamaları için yapay zeka destekli bir sohbet arayüzü sunar. React ve Vite ile geliştirilmiştir. Kullanıcılar metin, resim ve sesli mesaj göndererek AI ile etkileşime geçebilir.

## Özellikler
- Gerçek zamanlı AI sohbeti
- Metin, resim ve sesli mesaj desteği
- Mesaj geçmişi ve yerel depolama
- Modern ve kullanıcı dostu arayüz

## Kurulum
1. Depoyu klonlayın:
	```sh
	git clone https://github.com/Cevrimicii/CallCenterFrontEnd.git
	```
2. Gerekli bağımlılıkları yükleyin:
	```sh
	cd ai-chat-ui
	npm install
	```
3. Geliştirme sunucusunu başlatın:
	```sh
	npm run dev
	```

## Kullanım
- Arayüzde mesajınızı yazın ve gönderin.
- Resim eklemek için dosya seçin.
- Sesli mesaj göndermek için mikrofon simgesini kullanın.
- AI yanıtlarını anlık olarak görüntüleyin.

## API
Arka uç API varsayılan olarak `http://localhost:8080/api/v1/chat` adresine istek gönderir. Sesli mesajlar için `http://localhost:8080/transcribe` endpointi kullanılır.

## Yapılandırma
- Vite ve React SWC plugin ile hızlı geliştirme ortamı.
- ESLint ile kod kalitesi kontrolü.


## Lisans
MIT
