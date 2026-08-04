🚀 Roadmap backend — Wabtechs Platform
🔴 Phase 1 — Fondations (critique, 2-3 semaines)
#	Tâche	État actuel
1.1	Migrations DB	db push only, prisma/migrations/ vide (.gitkeep)
1.2	Secrets & env	.env local, .env.example incomplet (manque DATABASE_URL production, postés)
1.3	Health check	Aucun endpoint /health
1.4	Gestion structurée des erreurs	Tous les routes swallows errors → 500 générique
1.5	Rate limiting	Documenté mais absent
🟠 Phase 2 — Fiabilité & Observabilité (2-3 semaines)
#	Tâche	État actuel
2.1	Monitoring persistant	/api/monitoring/error → console.error only
2.2	Logs d'audit	createAuditLog existe, mais pas d'interface admin pour consulter
2.3	Alertes email admin	Aucun
2.4	Tests unitaires backend	0 fichiers *.test.ts
2.5	Redis (cache)	Doc only
2.6	Nettoyage code mort	src/proxy.ts inutilisé
🟡 Phase 3 — Opérations & CI/CD (1-2 semaines)
#	Tâche	État actuel
3.1	CI/CD	Badge GitHub Actions dans README, mais .github/workflows/ absent
3.2	Dockerfile + docker-compose	Absent
3.3	Sauvegardes DB	Doc only
3.4	Typecheck propre	60+ erreurs TS pré-existantes (TS7006, modules manquants radix)
3.5	Seed reproductible	seed.ts ×4 scripts
🟢 Phase 4 — Sécurité & conformité (1-2 semaines)
#	Tâche	État actuel
4.1	RBAC	ADMIN check inline répété
4.2	Validation centralisée	validators.ts partiel (contact, newsletter)
4.3	CSRF	NextAuth JWT → faible risque, mais formulaires
4.4	Secrets scan	Aucun
🔵 Phase 5 — Performance & maintenabilité (ongoing)
#	Tâche	État actuel
5.1	Optimisation query statistiques	os/stats — 13 queries parallèles (potentiellement lent)
5.2	Pagination	findMany illimité sur routes admin
5.3	Tests E2E	Aucun (Playwright installé mais non utilisé)
📌 Priorité immédiate recommandée
Phase 1.1 (migrations) + 1.4 (gestion erreurs) + 3.4 (typecheck) — ce sont les plus gros risques opérationnels actuels : sans migrations, le schéma DB n'est pas reproductible en prod ; sans gestion centralisée d'erreurs, les bugs sont invisibles ; le typecheck cassé bloque l'intégration.