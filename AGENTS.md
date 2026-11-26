# Instruções permanentes do projeto

Este arquivo define regras obrigatórias para qualquer agente de IA que trabalhe neste repositório.

---

## Leitura obrigatória antes de qualquer alteração

Sempre ler, nesta ordem:

1. `docs/AUDIT_REPORT.md`
2. `docs/TENANT_DOMAIN_AUDIT.md`
3. `docs/PRODUCTION_SAFETY_PLAN.md`
4. `docs/FIRST_DELIVERY_PLAN.md`
5. `docs/LOGGING_PLAN.md`
6. `docs/PWA_INSTALL_EXPERIENCE.md`
7. `docs/ONBOARDING_CLIENTE.md`
8. `docs/ROADMAP.md` (quando existir)

Se algum documento local estiver ausente, continuar normalmente. Para alterações White Label, ler também os cinco documentos oficiais da [documentação White Label V2.0](https://github.com/Leandroctr/pwa-install-landings/tree/6096042c9c2782fc34bd50288b6eeef2d9ab70f7/docs).

---

## Regras do projeto

O Oba Prêmios tem implantação individual. O GitHub é a fonte oficial para branches, builds e versões. O baseline consumidor é MegaBingo7 @ 652f72a4d886c6e87eafd3812df710c235d6b969.

Preservar a paridade funcional e de segurança, os controles CETEC e R-1 e a identidade configurada do tenant. A gestão global pertence à administração central. O Oba mantém o painel do consumidor e o acesso administrativo por tenant com MFA TOTP/AAL2.

Preservar o domínio, os dados, as inscrições push e o histórico do tenant. Alterações em autenticação, Service Worker, OneSignal, variáveis ou banco exigem autorização no escopo da etapa. Deploy de produção exige autorização explícita. Em banco compartilhado, preservar as migrations como histórico e jamais reaplicá-las como parte do port.

Quando autorizados, implementação, testes, commit, push, PR e CI podem ocorrer no mesmo fluxo. Integrar a main por merge commit com PR, branch atualizada e check verify aprovado. Aplicar o checklist White Label por cliente antes de encerrar a implantação.

---

## Fluxo obrigatório

1. Confirmar repositório, pasta, remote, branch, HEAD, upstream e working tree. Preservar alterações locais.
2. Conferir o escopo e registrar arquivos, riscos e impacto antes de implementar.
3. Revisar o diff, atualizar a documentação correspondente e executar as verificações do projeto.
4. Publicar apenas a branch autorizada do Oba. Registrar commit, PR, CI, evidências e rollback. Respeitar o escopo autorizado para merge e deploy.

---

## Documentação

Toda alteração técnica relevante deve atualizar a documentação correspondente.

| Área alterada     | Documento a atualizar          |
|-------------------|--------------------------------|
| Logs              | `docs/LOGGING_PLAN.md`         |
| Modal PWA         | `docs/PWA_INSTALL_EXPERIENCE.md` |
| Arquitetura       | `docs/AUDIT_REPORT.md`         |
| Planejamento      | `docs/FIRST_DELIVERY_PLAN.md`  |
| Roadmap           | `docs/ROADMAP.md`              |
| Onboarding White Label | `docs/ONBOARDING_CLIENTE.md` |

Atualizar a documentação do Oba e registrar as diferenças legítimas de identidade e responsabilidade administrativa em relação aos baselines.

---

## Arquitetura atual

O projeto opera em **multi-tenant por domínio** — settings identificados por `tenant_domain`, em um banco Supabase **compartilhado pelos 6 PWAs ativos** (PWA-WL).

> **Antes:** White label por deploy individual — settings identificados por `singleton_key` (coluna legada, mantida no banco sem uso no código).

> **Agora:** confirmado em 2026-07-02, por leitura direta do banco compartilhado, que a migration `supabase/migrations/002_add_tenant_domain_to_app_settings.sql` já foi executada: a coluna `tenant_domain` existe e as 4 linhas de `app_settings` (Big Pix, MegaBingo7, Oba Prêmios, Prêmios ao Vivo) já têm valores distintos e corretos. O índice único em `tenant_domain` foi confirmado formalmente via SQL Editor em 2026-07-02 — nome real `app_settings_tenant_domain_idx` (diferente do `app_settings_tenant_domain_key` previsto no arquivo da migration, mas funcionalmente equivalente: `UNIQUE INDEX ... USING btree (tenant_domain)`), necessário para o `upsert` do painel admin funcionar — ver `docs/TENANT_DOMAIN_AUDIT.md`.
>
> **Baseline versionado (2026-09-01):** `supabase/schema.sql` foi alinhado como baseline completo e tenant-neutral — inclui `tenant_domain`, tabelas administrativas, isolamento por tenant, `push_campaigns`, rate limiter/RPCs, RLS, grants/revokes e o bucket `app-assets`, sem seed tenant-specific. Não há mais drift do arquivo a corrigir. Aplicar esse baseline em um projeto Supabase novo e descartável continua sendo validação futura — ver `docs/AUDIT_REPORT.md`, seções 16 e 18.

Antes de qualquer desenvolvimento, ler: `docs/TENANT_DOMAIN_AUDIT.md`.

O endpoint administrativo de diagnóstico de versão permanece planejado para uma etapa própria.

### Estado da remediação CETEC (2026-09-03)

O fechamento de 03/09/2026 é histórico. A revalidação formal de M-2, B-5 e C-2 permanece pendente conforme a Matriz CETEC do White Label V2.0.

Não reabrir nem repetir essas correções. O detalhamento está em `docs/AUDIT_REPORT.md`, seção 18.

Permanecem fora do código, como validações futuras/externas — não são pendências CETEC:

- **DEFERRED:** aplicar `supabase/schema.sql` em um projeto Supabase novo e descartável (staging);
- **DEFERRED:** validação operacional em navegador/staging;
- **EXTERNAL:** autorização externa para o retorno dos PWAs.

Itens já classificados fora deste lote — M-7/`admin_audit_log`, melhorias P3/P4, modal de instalação, Service Worker legado e a futura unificação do App ID — também não são pendências CETEC.

---

## Filosofia

Priorizar:

1. Segurança.
2. Clareza.
3. Simplicidade.
4. Baixo risco.
5. Pequenas implementações.
6. Rollback fácil.
7. Código organizado.

Evitar grandes refatorações.

Preferir evoluções incrementais.

Cada implementação deve ser pequena, revisável e facilmente reversível.
