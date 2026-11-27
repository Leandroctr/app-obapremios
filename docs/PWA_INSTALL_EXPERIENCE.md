# PWA_INSTALL_EXPERIENCE.md

## White Label V2.0 no Oba Prêmios

A Central `/instalar` usa nome curto, ícones e cores do tenant. O Android oferece o prompt nativo por ação do usuário quando disponível. No iPhone, o Safari oferece o fluxo manual de adicionar à Tela de Início. A Central identifica instalação pelos eventos e pelo modo standalone. A Central oferece navegação de documento de volta ao launcher.

A raiz usa Splash React/CSS, abertura da plataforma com uma única navegação, CTA, suporte e temporizador de contingência. O Clube VIP segue a configuração do tenant. O launcher deixa inertes as referências a HTML legado, que permanecem preservadas no cadastro histórico.

### Correção do Clube VIP em 27/11/2026

O HTML pré-renderizado do deploy `3daeda3299ec711def4fe14ebb1ea56dd061802b` entregava `notificationsEnabled=false` ao banner. A linha do tenant e a API dinâmica `/api/settings` já retornavam `true`. O banner passou a usar a mesma resposta de configuração que alimenta o Splash e é oferecido na raiz quando o SDK está pronto, a permissão está disponível e ainda falta uma inscrição ativa.

O temporizador configurado dá tempo para a oferta aparecer. A ativação explícita pausa a contagem enquanto a solicitação de permissão está em andamento. Permissão previamente concedida sem inscrição ativa permite tentar a inscrição pelo mesmo botão. Uma sincronização confirmada pode antecipar a abertura da plataforma. O CTA “Abrir agora” permanece disponível, e “Agora não” mantém a ocultação de 24 horas.

O SDK publicado em modo Typical Site tentava registrar o worker do OneSignal com o escopo `/`, também usado pelo worker v3 do PWA. O inicializador agora aplica `serviceWorkerOverrideForTypical` com escopo `/onesignal/` e conserva a URL `/OneSignalSDKWorker.js` para as inscrições existentes. Os dois scripts permanecem hospedados nos endereços anteriores. O prompt de permissão usa a interface nativa do navegador, com a CSP vigente.

Para repetir a homologação, use o ícone do PWA em um aparelho de teste autorizado. Verifique a inscrição pelo banner e a persistência em nova abertura. Depois, valide o recebimento e a abertura com um envio restrito à inscrição desse aparelho. A recuperação operacional pode usar o deployment anterior do Oba enquanto se prepara uma reversão por PR.

O worker avança de `app-big-v2` para `app-big-v3` com navegação network-first. Atualiza `/pwa-offline` por requisição de mesma origem sem credenciais nem redirects, valida resposta e mantém o último fallback válido. Requisições autorizadas e rotas admin/API ficam fora do fallback. A raiz usa `private, no-store`. A rota offline usa a CSP geral.

Validar em aparelhos reais a atualização sobre instalação v2, abertura offline, reconexão, Android, iPhone e retomada no launcher. O [checklist oficial](https://github.com/Leandroctr/pwa-install-landings/tree/6096042c9c2782fc34bd50288b6eeef2d9ab70f7/docs/WHITE_LABEL_ACCEPTANCE_CHECKLIST.md) orienta a homologação.

Em 27/11/2026, o responsável declarou 9/9 critérios físicos aprovados, incluindo a atualização de instalação anterior, abertura offline, recuperação de conexão, inscrição VIP e recebimento. O [PR #4](https://github.com/Leandroctr/app-obapremios/pull/4) corrigiu o banner e separou os escopos dos workers. A raiz continua sob `/sw.js` e o OneSignal opera no escopo `/onesignal/`.

Os PNGs oficiais de 32, 192 e 512 px publicados pelo painel atendem aos limites de 100, 300 e 500 KiB. O PWA usa esses PNGs como contingência estática e continua lendo os ícones configurados do tenant. O PNG de 512 px preserva o lettering completo no uso `any`. O recorte maskable corta parte do texto e requer uma variante própria.

As seções seguintes registram a proposta histórica de modal de instalação.

# PWA Install Experience

**Projeto:** app-big-pwa  
**Objetivo:** criar uma experiência white label para incentivar instalação do PWA.

---

## 1. Conceito

O recurso não deve ser tratado apenas como um modal.

Ele deve ser tratado como:

> **Experiência de Instalação do Aplicativo**

A ideia é aumentar a taxa de instalação do PWA com uma abordagem visual, personalizada e integrada à marca do cliente.

---

## 2. Plataformas Suportadas

- Android Chrome
- Android Edge
- Windows Chrome
- Windows Edge
- iPhone Safari
- iPad Safari

---

## 3. Comportamento Android / Windows

Fluxo:

1. usuário acessa o site;
2. sistema aguarda alguns segundos;
3. se `beforeinstallprompt` estiver disponível, exibe o modal;
4. usuário clica em instalar;
5. sistema chama o prompt nativo;
6. se instalado, salva estado local;
7. modal não aparece mais.

---

## 4. Comportamento iOS

No iOS não existe instalação automática via botão.

Fluxo:

1. usuário acessa pelo Safari;
2. sistema aguarda alguns segundos;
3. exibe modal com instruções;
4. orienta:
   - tocar em compartilhar;
   - tocar em “Adicionar à Tela de Início”;
   - abrir pelo ícone instalado;
   - ativar notificações quando disponível.

---

## 5. Regras de Exibição

O modal não deve aparecer se:

- app já está em modo standalone;
- usuário já instalou;
- usuário fechou há menos de 24h;
- navegador não suporta a experiência;
- configuração do admin estiver desativada.

Regras sugeridas:

- delay inicial: 10 segundos;
- repetição: 24 horas;
- fechamento manual: salvar timestamp;
- instalação concluída: salvar permanentemente.

---

## 6. Persistência Local

Chaves sugeridas no `localStorage`:

- `pwa_install_dismissed_at`
- `pwa_install_completed`
- `pwa_install_last_shown_at`
- `pwa_install_platform`

---

## 7. Campos Futuros no Admin

Adicionar no painel:

- ativar/desativar modal;
- delay para aparecer;
- intervalo para reaparecer;
- título Android/Windows;
- mensagem Android/Windows;
- CTA Android/Windows;
- título iOS;
- mensagem iOS;
- lista de benefícios;
- usar cores do tema;
- preview.

Campos futuros no banco:

```sql
install_modal_enabled boolean default false,
install_modal_delay_ms integer default 10000,
install_modal_repeat_hours integer default 24,
install_modal_title text,
install_modal_message text,
install_modal_cta_text text,
install_modal_ios_title text,
install_modal_ios_message text,
install_modal_benefits jsonb,
install_modal_use_theme_colors boolean default true
```

---

## 8. Design White Label

O modal deve usar:

- logo atual;
- nome do app;
- cor primária;
- cor secundária;
- cor de fundo;
- cor de contraste;
- ícone do app.

Evitar cores fixas.

A lógica visual deve adaptar contraste automaticamente para evitar texto ilegível.

---

## 9. Conteúdo Padrão

### Android / Windows

Título:

> Instale nosso aplicativo

Mensagem:

> Tenha acesso mais rápido, receba notificações importantes e aproveite uma experiência melhor.

Benefícios:

- Acesso com um toque
- Mais velocidade
- Notificações importantes
- Experiência de aplicativo

CTA:

> Instalar aplicativo

---

### iOS

Título:

> Instale no seu iPhone

Mensagem:

> Toque em compartilhar no Safari e selecione “Adicionar à Tela de Início”.

Benefícios:

- Acesso direto pela tela inicial
- Experiência mais rápida
- Notificações quando disponíveis
- Visual de aplicativo

CTA:

> Entendi

---

## 10. Eventos de Analytics

Registrar futuramente:

- `modal_shown`
- `modal_dismissed`
- `install_clicked`
- `install_completed`
- `ios_instructions_shown`
- `standalone_opened`
- `prompt_unavailable`

---

## 11. Riscos

- iOS não permite botão de instalação automática;
- prompt Android depende de critérios do navegador;
- Service Worker pode interferir;
- manifest precisa estar correto;
- ícones precisam ter boa qualidade;
- cache pode manter manifest antigo.

---

## 12. Ordem de Implementação Recomendada

1. Documentar o comportamento.
2. Adicionar campos no admin em ambiente seguro.
3. Criar componente visual sem ativar.
4. Criar detecção de plataforma.
5. Criar controle de localStorage.
6. Testar Android.
7. Testar Windows.
8. Testar iOS.
9. Ativar para um cliente teste.
10. Só depois ativar em produção.

