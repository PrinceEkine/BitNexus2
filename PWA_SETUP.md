# PWA Setup Guide for BitNexus

Follow these steps to enable app download and offline support for the BitNexus platform.

## 1. Vite PWA Plugin Configuration
The `vite-plugin-pwa` is already installed and configured in `vite.config.ts`. It includes:
- **registerType: 'autoUpdate'**: Automatically updates the service worker when changes are detected.
- **manifest**: Defines the app's name, description, theme colors, and icons.
- **includeAssets**: Specifies static assets to be cached for offline use.

## 2. Generate and Add Icons
For the PWA to be installable, you **MUST** provide the icons specified in `vite.config.ts` in your `public/` directory:
1. `pwa-192x192.png` (192x192 pixels)
2. `pwa-512x512.png` (512x512 pixels)
3. `pwa-maskable-192x192.png` (192x192 pixels, with safe area for maskable icons)
4. `pwa-maskable-512x512.png` (512x512 pixels, with safe area for maskable icons)
5. `favicon.ico`
6. `apple-touch-icon.png` (180x180 pixels)
7. `masked-icon.svg`

You can use online tools like [PWA Asset Generator](https://www.pwabuilder.com/image-generator) to create these from a single high-resolution logo.

## 3. Handling the Installation Prompt
To provide a custom "Install App" button, you can listen for the `beforeinstallprompt` event in your application.

### Example Implementation:
```tsx
import { useState, useEffect } from 'react';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

  if (!deferredPrompt) return null;

  return (
    <button onClick={handleInstall} className="btn-primary">
      Install BitNexus App
    </button>
  );
};
```

## 4. Testing the PWA
1. Run `npm run build` to build the application.
2. Run `npm run preview` to serve the production build.
3. Open the app in a browser (Chrome/Edge recommended).
4. You should see an "Install" icon in the address bar, or your custom install button if implemented.
5. Use Chrome DevTools > **Application** > **Service Workers** to verify the service worker is active.
6. Use Chrome DevTools > **Application** > **Manifest** to verify the manifest is correctly loaded.
