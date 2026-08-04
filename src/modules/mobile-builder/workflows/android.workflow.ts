export const androidWorkflowYaml = `name: Mobile Build (Android)

on:
  push:
    branches: [master]
  workflow_dispatch:
    inputs:
      version:
        description: 'Version name (e.g. 1.0.0)'
        required: true
      flavor:
        description: 'Build flavor (apk/aab)'
        required: false
        default: 'aab'

jobs:
  android-build:
    name: Build Android
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Setup Android SDK
        uses: android-actions/setup-android@v3

      - name: Accept SDK licenses
        run: yes | \\$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager --licenses

      - name: Install Capacitor
        run: npm install @capacitor/android @capacitor/cli

      - name: Sync Capacitor
        run: npx cap sync android

      - name: Build AAB
        if: inputs.flavor == 'aab'
        run: cd android && ./gradlew bundleRelease

      - name: Build APK
        if: inputs.flavor == 'apk'
        run: cd android && ./gradlew assembleRelease

      - uses: actions/upload-artifact@v4
        with:
          name: android-aab
          path: android/app/build/outputs/bundle/release/*.aab
          if-no-files-found: error`;
