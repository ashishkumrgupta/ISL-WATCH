# ISL Watch

Android-first app: paste a YouTube link, watch the video with an ISL signer overlay (PiP-style). Built for Deaf users in India who use **Indian Sign Language (ISL)**.

## Status

- **Phase 1 (done):** YouTube embed, draggable/resizable ISL signer placeholder, paste URL, Android Share + deep links
- **Phase 2:** Caption/timing pipeline (backend)
- **Phase 3:** AI ISL avatar (SignVani-style integration)

## What you need (Android)

| Requirement | Notes |
|-------------|--------|
| **Node.js 18+** and **npm** | Install from [nodejs.org](https://nodejs.org) if `npm` is missing in Terminal |
| **Android phone** | Physical device recommended |
| **Expo Go** | [Play Store — Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent) |
| **Same Wi‑Fi** | Phone and Mac on the same network for dev |
| **GitHub** | Already linked — push this repo when ready |

Optional later (not for day‑1 dev):

- **Android Studio** — only if you build a standalone APK/AAB or use the emulator
- **Google Play Console** — when publishing ($25 one-time)

## Quick start

```bash
cd mobile
npm install
npx expo start --android
```

Scan the QR code with **Expo Go** on your Android phone, or press `a` if an emulator is running.

### YouTube Share (Android)

Share from the YouTube app only works in a **development build** (not Expo Go):

```bash
cd mobile
npm install
npx expo prebuild --clean -p android --no-install
npx expo run:android
```

Then: YouTube → **Share** → **ISL Watch**. The shared link loads automatically. You can also open `youtube.com/watch` links in the app.

## Project layout

```
isl-watch/
  mobile/          # Expo React Native (Android focus)
  backend/         # Python API (coming later)
  docs/            # Notes and architecture
```

## Android package name

`in.islwatch.app` (change in `mobile/app.json` before Play Store release)

## License

Private / TBD
