# Mobile App Builder — Documentation complète

## Architecture globale

Le Mobile App Builder transforme une application web Next.js/TypeScript en applications natives Android (APK/AAB) et iOS (IPA) via **Capacitor**.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        WABTECHS PLATFORM                                │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────┐ │
│  │   Admin UI      │  │   API Routes    │  │   Database (PostgreSQL) │ │
│  │  /admin/mobile  │──▶│  /api/admin/    │──▶│  6 modèles + 4 enums   │ │
│  └─────────────────┘  │  mobile/*       │  └─────────────────────────┘ │
│         │             └────────┬────────┘             ▲                │
│         │                      │                      │                │
│         ▼                      ▼                      │                │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │                    MOBILE BUILDER MODULE                        │  │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────┐ ┌───────────┐   │  │
│  │  │ capacitor.ts │ │android-build │ │ios-build │ │ github.ts │   │  │
│  │  │  (init/sync) │ │  (APK/AAB)   │ │  (IPA)   │ │  (webhook)│   │  │
│  │  └──────────────┘ └──────────────┘ └──────────┘ └───────────┘   │  │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────────────────┐  │  │
│  │  │  store.ts    │ │  workflows/  │ │   database/repository.ts │  │  │
│  │  │(Play/AppStore)│ │android/ios   │ │  (Prisma CRUD + Audit)   │  │  │
│  │  └──────────────┘ └──────────────┘ └──────────────────────────┘  │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│         │                              │                      │        │
│         ▼                              ▼                      ▼        │
│  ┌──────────────┐              ┌──────────────┐         ┌─────────┐  │
│  │  Capacitor   │              │ GitHub Actions│         │ Stores  │  │
│  │  (Android/iOS)│              │  (.yml)       │         │(Play/AS)│  │
│  └──────────────┘              └──────────────┘         └─────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

### Flux de build typique

1. **Création app** → Admin remplit formulaire (nom, packageName, bundleId, repo GitHub, framework)
2. **Déclenchement build** → Admin choisit plateforme (Android/iOS/Both) + version
3. **CI/CD GitHub Actions** → Workflow `mobile-build.yml` se déclenche
   - Checkout repo → Setup Node/Java/Android SDK/Xcode
   - `capacitor.service.init()` → `cap add android/ios` → `cap sync`
   - `android-build.service.generateAAB()` ou `ios-build.service.generateIPA()`
   - Signature (keystore / provisioning profile)
   - Upload artefacts (APK/AAB/IPA)
4. **Stockage artefacts** → URL artefact stockée en DB (`MobileBuild.artifactUrl`)
5. **Release** → Admin crée release depuis build, génère changelog
6. **Publication Store** → `store.service.publishToGooglePlay()` / `publishToAppStore()`

---

## Modèles de données (Prisma)

### Enums

```prisma
enum MobileFramework { NEXT_JS, REACT_NATIVE, EXPO, VUE, SVELTEKIT, CUSTOM }
enum PlatformTarget { ANDROID, IOS, BOTH }
enum BuildStatus { PENDING, BUILDING, SUCCESS, FAILED, CANCELLED }
enum ReleaseStatus { DRAFT, INTERNAL_TESTING, BETA, PRODUCTION, ARCHIVED }
```

### Modèles

| Modèle              | Description                             | Relations clés                                                               |
| ------------------- | --------------------------------------- | ---------------------------------------------------------------------------- |
| `MobileApp`         | Application mobile configurée           | `user` (créateur), `builds[]`, `releases[]`, `certificates[]`, `auditLogs[]` |
| `MobileBuild`       | Build individuel (APK/AAB/IPA)          | `app`, `platform`, `version`, `status`, `artifactUrl`, `logs`, `release?`    |
| `MobileCertificate` | Certificats signature (keystore, Apple) | `app`, `provider` (GOOGLE_PLAY/APP_STORE), `encryptedSecret`                 |
| `MobileRelease`     | Release candidate pour store            | `app`, `build?`, `version`, `status`, `changelog`, `publishedAt`             |
| `StoreIntegration`  | Credentials store (chiffrés)            | `app`, `store` (GOOGLE_PLAY/APP_STORE), `credentials` (JSON chiffré)         |
| `MobileAuditLog`    | Traçabilité actions admin               | `app`, `user?`, `action`, `details` (JSON), `ipAddress`                      |

---

## Installation & Configuration

### Prérequis système

```bash
# Android
- JDK 17+ (Temurin recommandé)
- Android SDK (API 34, Build Tools 34.0.0)
- ANDROID_HOME=/path/to/android-sdk
- Gradle 8.5+ (via wrapper)

# iOS (macOS uniquement)
- Xcode 15+
- Xcode Command Line Tools
- CocoaPods (`gem install cocoapods`)
- Certificats Apple Developer (Distribution)
- Provisioning Profiles

# Commun
- Node.js 20+
- pnpm 9+
- GitHub CLI (`gh`) pour webhooks
```

### Variables d'environnement

```env
# Base de données
DATABASE_URL="postgresql://..."

# GitHub (pour webhooks API)
GITHUB_TOKEN="ghp_xxx"
GITHUB_WEBHOOK_SECRET="secret-partagé"

# Chiffrement certificats/secrets
ENCRYPTION_KEY="base64-encoded-32-bytes"

# Google Play (optionnel - peut être configuré via UI)
GOOGLE_PLAY_SERVICE_ACCOUNT_JSON="..."

# App Store Connect (optionnel)
APP_STORE_CONNECT_API_KEY="..."
APP_STORE_CONNECT_ISSUER_ID="..."
APP_STORE_CONNECT_PRIVATE_KEY="..."
```

### Initialisation

```bash
# 1. Installer dépendances
pnpm install

# 2. Générer Prisma Client
pnpm prisma generate

# 3. Appliquer migrations
pnpm prisma migrate deploy

# 4. Build production
pnpm build

# 5. Démarrer
pnpm start
```

---

## Utilisation — Guide Admin

### 1. Créer une application mobile

**Route** : `/admin/mobile/apps/new`

Champs requis :

- **Nom** : Affiché dans les stores
- **Package Name** (Android) : `com.votreentreprise.votreapp` (unique sur Play Store)
- **Bundle ID** (iOS) : `com.votreentreprise.votreapp` (identique à Apple Developer)
- **Repository URL** : GitHub HTTPS (`https://github.com/org/repo.git`)
- **Framework** : NEXT_JS | REACT_NATIVE | EXPO | VUE | SVELTEKIT | CUSTOM
- **Version initiale** : Ex: `1.0.0`
- **Description** (optionnel) : Pour référencement store

> ⚠️ Le repo doit contenir un `package.json` avec `next` ou framework détectable.

### 2. Lancer un build

**Route** : `/admin/mobile/apps/[id]/builds/new`

Options :

- **Plateforme** : Android seul / iOS seul / Les deux
- **Version** : Incrémentée automatiquement ou manuelle
- **Debug APK** : Génère APK installable directement (sans signature release)

Le build se lance via GitHub Actions. Suivi temps réel dans `/admin/mobile/builds`.

### 3. Gérer les certificats

**Route** : `/admin/mobile/certificates`

| Type                   | Fichiers requis                                                            | Usage                 |
| ---------------------- | -------------------------------------------------------------------------- | --------------------- |
| **Android Keystore**   | `.jks` / `.keystore` + mot de passe + alias                                | Signature AAB release |
| **Apple Distribution** | `.p12` (certificat + clé privée) + provisioning profile `.mobileprovision` | Signature IPA         |

Les secrets sont **chiffrés** (AES-256-GCM) avant stockage via `ENCRYPTION_KEY`.

### 4. Créer une release

**Route** : `/admin/mobile/releases`

1. Sélectionner un build réussi
2. Version (auto depuis build)
3. Statut : `DRAFT` → `INTERNAL_TESTING` → `BETA` → `PRODUCTION`
4. Changelog (Markdown supporté)
5. Sauvegarder → Publié dans l'historique

### 5. Publier sur les stores

**Route** : `/admin/mobile/releases` → bouton "Publier"

#### Google Play

- Track : `internal` / `alpha` / `beta` / `production`
- Version code (auto-incrémenté ou manuel)
- Nécessite `StoreIntegration` configurée avec Service Account JSON

#### App Store Connect

- Nécessite API Key (Issuer ID, Key ID, Private Key .p8)
- Upload via `altool` / App Store Connect API

---

## Configuration avancée

### Capacitor Config généré

Le fichier `capacitor.config.ts` est généré dynamiquement :

```typescript
{
  appId: "com.votreentreprise.votreapp",
  appName: "Votre App",
  webDir: "web-build",
  server: { url: "https://votre-domaine.com" }, // ou localhost pour dev
  android: {
    buildOptions: { keystorePath: "app/wabtechs-release.keystore" }
  },
  ios: {
    scheme: "VotreApp",
    contentInset: "automatic"
  }
}
```

### Personnalisation native

Ajoutez des fichiers dans le repo source :

```
/android/app/src/main/
  ├── AndroidManifest.xml (permissions, features)
  ├── res/values/styles.xml (thème, splash)
  └── jniLibs/ (bibliothèques .so)

/ios/App/
  ├── App/Info.plist (permissions, URL schemes)
  ├── App/Entitlements.plist (capabilities)
  └── Podfile (dépendances CocoaPods)
```

Ces fichiers sont conservés lors du `cap sync`.

### Variables de build

| Variable                          | Description         | Défaut   |
| --------------------------------- | ------------------- | -------- |
| `CAPACITOR_ANDROID_COMPILE_SDK`   | Compile SDK Android | 34       |
| `CAPACITOR_IOS_DEPLOYMENT_TARGET` | iOS minimum         | 15.0     |
| `GRADLE_JVM_ARGS`                 | Mémoire Gradle      | `-Xmx4g` |

---

## CI/CD — GitHub Actions

### Workflow : `.github/workflows/mobile-build.yml`

```yaml
# Déclencheurs
on:
  workflow_dispatch:
    inputs:
      appId: { required: true, type: string }
      platform: { required: true, type: choice, options: [android, ios, both] }
      version: { required: true, type: string }
      debug: { required: false, type: boolean }

# Jobs
jobs:
  android:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - uses: actions/setup-java@v4 (Temurin 17)
      - uses: android-actions/setup-android@v3
      - run: pnpm install && pnpm cap add android && pnpm cap sync
      - run: ./gradlew bundleRelease (ou assembleDebug)
      - uses: actions/upload-artifact@v4 (AAB/APK)

  ios:
    runs-on: macos-latest
    if: platform != 'android'
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - uses: maxim-lobanov/setup-xcode@v1
      - run: pnpm install && pnpm cap add ios && pnpm cap sync
      - run: xcodebuild -workspace ... -scheme ... -archivePath ...
      - run: xcodebuild -exportArchive -exportOptionsPlist ...
      - uses: actions/upload-artifact@v4 (IPA)
```

### Secrets GitHub requis

| Secret                              | Description                     |
| ----------------------------------- | ------------------------------- |
| `ANDROID_KEYSTORE_BASE64`           | Keystore encodé base64          |
| `ANDROID_KEYSTORE_PASSWORD`         | Mot de passe keystore           |
| `ANDROID_KEY_ALIAS`                 | Alias clé                       |
| `ANDROID_KEY_PASSWORD`              | Mot de passe clé                |
| `APPLE_CERTIFICATE_P12_BASE64`      | Certificat .p12 base64          |
| `APPLE_CERTIFICATE_PASSWORD`        | Mot de passe .p12               |
| `APPLE_PROVISIONING_PROFILE_BASE64` | Profile .mobileprovision base64 |
| `APP_STORE_CONNECT_API_KEY`         | Clé API base64                  |
| `APP_STORE_CONNECT_ISSUER_ID`       | Issuer ID                       |
| `APP_STORE_CONNECT_KEY_ID`          | Key ID                          |

---

## Diagnostic environnement

**Route** : `/admin/mobile/settings/environment`

Vérifie automatiquement :

- ✅ Node.js / pnpm versions
- ✅ Java / JDK (Android)
- ✅ Android SDK (platforms, build-tools, emulator)
- ✅ Gradle wrapper
- ✅ Xcode / xcodebuild (iOS, macOS only)
- ✅ CocoaPods
- ✅ Variables d'environnement critiques
- ✅ Espace disque disponible

Résultats affichés avec badges : **OK** (vert) / **WARN** (orange) / **ERROR** (rouge).

---

## Dépannage (Troubleshooting)

### Build Android échoue

| Erreur                                               | Cause probable                      | Solution                                                  |
| ---------------------------------------------------- | ----------------------------------- | --------------------------------------------------------- |
| `SDK location not found`                             | `ANDROID_HOME` non défini           | Configurer variable d'env ou `local.properties`           |
| `Keystore not found`                                 | Secret GitHub manquant              | Ajouter `ANDROID_KEYSTORE_BASE64` dans repo secrets       |
| `Execution failed for task ':app:signReleaseBundle'` | Mauvais mot de passe/alias          | Vérifier `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS` |
| `Manifest merger failed`                             | Conflit permissions/AndroidManifest | Vérifier `/android/app/src/main/AndroidManifest.xml`      |
| `OutOfMemoryError`                                   | Heap Gradle insuffisant             | `GRADLE_JVM_ARGS=-Xmx4g -XX:MaxMetaspaceSize=1g`          |

### Build iOS échoue

| Erreur                                         | Cause probable                | Solution                                                             |
| ---------------------------------------------- | ----------------------------- | -------------------------------------------------------------------- |
| `No signing certificate`                       | Certificat absent / expiré    | Renouveler sur Apple Developer, uploader .p12                        |
| `Provisioning profile doesn't match`           | Bundle ID / Team ID incorrect | Vérifier `APPLE_PROVISIONING_PROFILE_BASE64` correspond au Bundle ID |
| `CocoaPods could not find compatible versions` | Conflit dépendances Podfile   | `pod deintegrate && pod install`                                     |
| `xcodebuild: command not found`                | Xcode CLI tools absents       | `xcode-select --install`                                             |

### Publication Store échoue

| Store           | Erreur                        | Solution                                                                    |
| --------------- | ----------------------------- | --------------------------------------------------------------------------- |
| **Google Play** | `401 Unauthorized`            | Service Account JSON invalide / permissions manquantes (Release Manager)    |
| **Google Play** | `Version code already exists` | Incrémenter `versionCode` dans config build                                 |
| **App Store**   | `Invalid API Key`             | Clé .p8 expirée / Issuer ID / Key ID incorrects                             |
| **App Store**   | `Missing compliance`          | Déclarer chiffrement dans App Store Connect (ITSAppUsesNonExemptEncryption) |

### Problèmes Capacitor

| Problème                            | Solution                                                                       |
| ----------------------------------- | ------------------------------------------------------------------------------ |
| `cap sync` n'ajoute pas les plugins | Vérifier `package.json` → `dependencies` contient `@capacitor/xxx`             |
| Web assets non copiés               | `webDir` incorrect dans config → doit pointer vers build Next.js (`web-build`) |
| Plugins natifs non disponibles iOS  | `pod install` dans `/ios/App` après `cap sync`                                 |

---

## Sécurité

- **Chiffrement** : AES-256-GCM via `EncryptionService` (clé 32 bytes base64)
- **Secrets** : Jamais en clair en DB, jamais dans logs
- **Audit** : Toute action admin tracée (`MobileAuditLog`) avec IP, user, détails JSON
- **Webhooks** : Signature HMAC (`GITHUB_WEBHOOK_SECRET`) vérifiée à la réception
- **Accès** : Routes admin protégées par `requireAdmin()` (middleware auth)

---

## Tests

```bash
# Tests unitaires (Vitest)
pnpm test

# Tests E2E (Playwright) - si configuré
pnpm test:e2e

# Typecheck seul
pnpm tsc --noEmit

# Lint seul
pnpm lint
```

### Structure tests recommandée

```
/tests
  ├── unit/
  │   ├── services/capacitor.service.test.ts
  │   ├── services/android-build.service.test.ts
  │   ├── services/store.service.test.ts
  │   └── utils/env-detection.test.ts
  ├── api/
  │   ├── apps.route.test.ts
  │   ├── builds.route.test.ts
  │   └── releases.route.test.ts
  └── components/
      ├── ApplicationCard.test.tsx
      └── ReleaseManager.test.tsx
```

---

## Maintenance

### Mise à jour Capacitor

```bash
# Vérifier versions
pnpm outdated @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios

# Mettre à jour
pnpm up @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios
pnpm cap sync
```

### Rotation clés chiffrement

1. Générer nouvelle clé : `openssl rand -base64 32`
2. Mettre à jour `ENCRYPTION_KEY` dans env
3. Ré-chiffrer secrets existants (script migration)
4. Redéployer

### Nettoyage artefacts

Les artefacts GitHub Actions expirent après 90 jours par défaut. Pour conservation long terme, configurer stockage externe (S3, Azure Blob) dans `store.service.uploadArtifact()`.

---

## Référence API

### Routes Admin (toutes protégées `requireAdmin`)

| Méthode | Route                                    | Description                                     |
| ------- | ---------------------------------------- | ----------------------------------------------- |
| GET     | `/api/admin/mobile/apps`                 | Liste apps                                      |
| POST    | `/api/admin/mobile/apps`                 | Créer app                                       |
| GET     | `/api/admin/mobile/apps/:id`             | Détail app                                      |
| DELETE  | `/api/admin/mobile/apps/:id`             | Supprimer app                                   |
| GET     | `/api/admin/mobile/builds`               | Liste builds (filtres: appId, platform, status) |
| POST    | `/api/admin/mobile/builds`               | Déclencher build                                |
| GET     | `/api/admin/mobile/builds/:id`           | Détail build + logs                             |
| GET     | `/api/admin/mobile/releases`             | Liste releases                                  |
| POST    | `/api/admin/mobile/releases`             | Créer release                                   |
| PUT     | `/api/admin/mobile/releases/:id`         | MAJ release (statut, changelog)                 |
| POST    | `/api/admin/mobile/releases/:id/publish` | Publier sur store                               |
| GET     | `/api/admin/mobile/certificates`         | Liste certificats                               |
| POST    | `/api/admin/mobile/certificates`         | Ajouter certificat                              |
| DELETE  | `/api/admin/mobile/certificates/:id`     | Supprimer certificat                            |
| GET     | `/api/admin/mobile/audit-logs`           | Logs audit (filtres: appId, action, date)       |
| GET     | `/api/admin/mobile/settings/environment` | Diagnostic env                                  |
| GET/PUT | `/api/admin/mobile/settings`             | Config globale                                  |

### Webhook GitHub

**Endpoint** : `POST /api/webhooks/github`

Événements gérés : `push`, `pull_request`, `workflow_run`

Payload exemple :

```json
{
  "action": "completed",
  "workflow_run": {
    "name": "Mobile Build",
    "conclusion": "success",
    "artifacts_url": "https://api.github.com/...",
    "head_sha": "abc123"
  }
}
```

---

## Support & Ressources

- **Documentation Capacitor** : https://capacitorjs.com/docs
- **Android App Bundle** : https://developer.android.com/guide/app-bundle
- **App Store Connect API** : https://developer.apple.com/app-store-connect/api/
- **GitHub Actions** : https://docs.github.com/en/actions
- **Prisma** : https://www.prisma.io/docs

---

_Dernière mise à jour : 2026-08-04 — Version 1.0_
