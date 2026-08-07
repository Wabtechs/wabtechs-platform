# Navigation modulaire de l'admin

La sidebar de l'admin (`/admin`) est configurée en **mode déclaratif** : toute la
structure de navigation vit dans une seule source de vérité, `src/config/navigation.ts`,
et les composants (sidebar, breadcrumb, menu) la consomment.

## Architecture

| Fichier                                    | Rôle                                                               |
| ------------------------------------------ | ------------------------------------------------------------------ |
| `src/types/navigation.ts`                  | Types partagés (`NavigationItem`, `NavGroup`, `PlatformModule`, …) |
| `src/config/navigation.ts`                 | Données : modules, menus, permissions, URL actives                 |
| `src/hooks/use-active-module.ts`           | Hook côté client : module actif selon l'URL                        |
| `src/components/admin/module-switcher.tsx` | Sélecteur de module dans le header                                 |
| `src/components/admin/nav-main.tsx`        | Menu principal (groupes + items)                                   |
| `src/components/admin/nav-secondary.tsx`   | Menu secondaire (bas de sidebar)                                   |
| `src/components/admin/nav-user.tsx`        | Carte utilisateur + actions                                        |
| `src/app/admin/layout.tsx`                 | Assemblage sidebar + header                                        |

## Ajouter un module

Un module regroupe un ensemble de pages de l'admin (ex. `overview`, `projects`, `clients`, `system`).

1. Dans `src/config/navigation.ts`, ajouter une entrée au tableau `MODULES` :
   ```ts
   {
     id: "my-module",
     label: "Mon module",
     description: "Description courte",
     href: "/admin/my-module",
     icon: Blocks,                     // icône lucide
     default: false,                   // true pour le module affiché par défaut
     roles: ["admin"],                 // optionnel : restreint par rôle
     navigation: [
       {
         title: "Pilotage",
         items: [
           { title: "Vue d'ensemble", href: "/admin/my-module" },
           { title: "Rapports", href: "/admin/my-module/rapports" },
         ],
       },
     ],
   }
   ```
2. Le module apparaît automatiquement dans le sélecteur et la sidebar.

## Modifier un menu

- Les groupes et items se décrivent dans la propriété `navigation` du module.
- Chaque item accepte : `title`, `href`, `icon`, `badge` (ex. `"Nouveau"`), `active` (booléen forcé).
- Les URLs de niveau supérieur sont détectées automatiquement comme actives
  (`/admin/my-module/rapports` active `/admin/my-module`).

## Restreindre par rôle

- Sur un module : `roles: ["admin"]` → le module est masqué pour les autres rôles.
- Sur un item : `roles` au niveau de l'item dans le groupe.

## Changer le module par défaut

- Modifier `DEFAULT_MODULE_ID` dans `src/config/navigation.ts`, ou mettre
  `default: true` sur l'entrée souhaitée du tableau `MODULES`.
- Redirection après connexion : `getDefaultModule()` renvoie ce module.

## Sous-menus (collapsibles)

Pour un groupe dépliable dans la sidebar, marquer l'item avec `collapsible: true`.
Le composant `SidebarMenuSub` (voir `nav-main.tsx`) gère le sous-menu enfant.

## Module actif

`useActiveModule()` (utilisé dans `app-sidebar.tsx`) retourne le module courant en
comparant le `pathname` aux `href` des modules, avec repli sur `getDefaultModule()`.
