export const iosWorkflowYaml = `name: Mobile Build (iOS)

on:
  push:
    branches: [master]
  workflow_dispatch:
    inputs:
      version:
        description: 'Version name (e.g. 1.0.0)'
        required: true
      buildNumber:
        description: 'Build number'
        required: true

jobs:
  ios-build:
    name: Build iOS
    runs-on: macos-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: Install Capacitor
        run: npm install @capacitor/ios @capacitor/cli

      - name: Add iOS platform
        run: npx cap add ios

      - name: Sync iOS
        run: npx cap sync ios

      - name: Setup Xcode
        uses: maxim-lobanov/setup-xcode@v2
        with:
          xcode-version: latest-stable

      - name: Build IPA
        run: |
          cd ios
          xcodebuild -workspace App.xcworkspace -scheme App -configuration Release -archivePath App.xcarchive archive
          xcodebuild -exportArchive -archivePath App.xcarchive -exportPath . -exportOptionsPlist ExportOptions.plist

      - uses: actions/upload-artifact@v4
        with:
          name: ios-ipa
          path: ios/App.ipa`;
