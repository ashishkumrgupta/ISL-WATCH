# Android setup checklist

## 1. Install Node.js (if needed)

Open **Terminal** on your Mac:

```bash
node -v   # should be v18 or newer
npm -v    # should print a version
```

If `npm` is not found, install Node LTS from https://nodejs.org and restart Terminal.

## 2. Install dependencies

```bash
cd ~/projects/isl-watch/mobile
npm install
```

## 3. Install Expo Go on your Android phone

Play Store → search **Expo Go** → install.

## 4. Run the dev server

```bash
cd ~/projects/isl-watch/mobile
npx expo start
```

- Tap **Expo Go** on the phone and scan the QR code, **or**
- Run `npx expo start --android` if you use Android Studio emulator.

## 5. Enable USB debugging (optional)

For `expo run:android` / native builds later:

1. Phone → **Settings → About phone** → tap **Build number** 7 times  
2. **Developer options** → enable **USB debugging**  
3. Connect USB → allow debugging on the phone  

## 6. Push to GitHub

```bash
cd ~/projects/isl-watch
git add .
git commit -m "Initial Android scaffold for ISL Watch"
git remote add origin git@github.com:YOUR_USER/isl-watch.git
git push -u origin main
```

Create the empty repo on GitHub first (name: `isl-watch`).

## 7. Android SDK path (add to `~/.zshrc`)

After installing Android Studio:

```bash
export ANDROID_HOME="$HOME/Library/Android/sdk"
export ANDROID_SDK_ROOT="$ANDROID_HOME"
export PATH="$PATH:$ANDROID_HOME/platform-tools"
```

Then: `source ~/.zshrc` and verify with `adb devices`.

## 8. Share from YouTube (dev build)

Expo Go cannot receive Android share intents. After USB debugging is set up:

```bash
cd ~/projects/isl-watch/mobile
npm install
npx expo prebuild --clean -p android --no-install
npx expo run:android
```

Use **`-p android`** so prebuild skips iOS/CocoaPods (not needed for this project yet).

On the phone: open a video in **YouTube** → **Share** → choose **ISL Watch**. Drag the signer panel (top bar) or resize from the ↘ corner.

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `npx: command not found` | Install Node.js; reopen Terminal |
| Phone can’t connect | Same Wi‑Fi; try `npx expo start --tunnel` |
| YouTube won’t play | Check internet; try another video ID |
| Red screen in Expo Go | Run `npm install` again; restart `expo start` |
| ISL Watch missing from Share sheet | Use `npx expo run:android` (not Expo Go) after `npm install` |
| `expo-asset` cannot be found | `npx expo install expo-asset expo-constants expo-font` |
| `spawn adb ENOENT` | Set `ANDROID_HOME` and add `platform-tools` to `PATH` (see §7) |
| `prebuild` fails on CocoaPods | Use `npx expo prebuild --clean -p android --no-install` (Android only) |
| `No Android connected device` | Connect phone (USB debugging) or start an emulator in Android Studio |
