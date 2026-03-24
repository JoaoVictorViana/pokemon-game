# pokemon-game

## 1. Visão geral do sistema

`pokemon-game` é uma aplicação frontend orientada a módulos que reproduz parte de uma experiência clássica de Pokémon com foco, no estado atual do código, em carregamento de dados, menu inicial e navegação por Pokédex local. O sistema usa a PokeAPI como fonte de dados de bootstrap, converte essas respostas para entidades próprias e persiste um snapshot em IndexedDB para consumo posterior pela interface.

O papel arquitetural do sistema hoje é o de um cliente standalone que:

- inicializa uma base local de dados derivada da PokeAPI;
- expõe uma camada de domínio própria para Pokémon, movimentos e tipos;
- desacopla parcialmente UI e origem remota por meio de casos de uso e repositórios;
- executa a maior parte da leitura funcional a partir do armazenamento local.

Observação: o contexto funcional informado para o projeto menciona batalhas, capturas, progressão de nível e habilidades. Esses fluxos não estão implementados neste código na branch analisada em `2026-03-23`. A documentação abaixo descreve o sistema real presente no repositório.

## 2. Objetivo do projeto

O objetivo técnico aparente do projeto é servir como base para um jogo inspirado na franquia Pokémon, priorizando:

- ingestão e persistência local de catálogo de Pokémon, movimentos e tipos;
- composição modular com separação entre domínio, aplicação, infraestrutura e UI;
- evolução incremental de features a partir de uma base local consistente.

Na implementação atual, o produto entregue é uma fundação arquitetural para um jogo, não o jogo completo descrito no contexto funcional. O foco está no pipeline de carga de dados e na exploração de Pokédex.

## 3. Arquitetura da solução

### Visão arquitetural

O projeto adota uma arquitetura modular em frontend, com elementos de Clean Architecture e DDD tático simplificado:

- `domain`: entidades, value objects e serviços de domínio;
- `application`: casos de uso e fábricas de composição;
- `infrastructure`: clientes HTTP, mappers, repositórios IndexedDB e composição de dependências;
- `ui`: páginas, componentes e hooks.

Cada módulo funcional encapsula sua própria superfície pública de rotas e dependências. O módulo `pokemon` concentra o núcleo de domínio e persistência. `boot` e `pokedex` funcionam como consumidores desse núcleo.

### Fronteiras principais

- Fonte remota: PokeAPI, acessada via `pokeApiClient`.
- Persistência local: IndexedDB, configurado em [`/src/configs/db.ts`](C:/Users/jvdua/OneDrive/Documentos/Projects/pokemon-game/src/configs/db.ts).
- Composição de aplicação: fábricas locais e `createPokemonModule`.
- Navegação: React Router centralizado em [`/src/App.tsx`](C:/Users/jvdua/OneDrive/Documentos/Projects/pokemon-game/src/App.tsx).
- Layout global: [`/src/shared/ui/GameLayout/index.tsx`](C:/Users/jvdua/OneDrive/Documentos/Projects/pokemon-game/src/shared/ui/GameLayout/index.tsx).

### Dependências entre camadas

O fluxo dominante é:

1. `ui` invoca casos de uso.
2. `application` delega para serviços ou repositórios.
3. `infrastructure` resolve acesso a IndexedDB ou PokeAPI.
4. `mappers` traduzem payloads externos para entidades de domínio.

Há, porém, alguns acoplamentos práticos que reduzem a pureza dessa separação:

- repositórios concretos são instanciados internamente por outros repositórios;
- `PokemonMapper` depende de utilitários de download binário e de repositórios para enriquecer entidades durante o mapeamento;
- loaders de boot conhecem detalhes de persistência e de estratégia de concorrência;
- `pokedex` depende diretamente da composição de `pokemon`, sem uma borda de contrato própria.

### Integrações

#### PokeAPI

A integração remota está encapsulada em clientes específicos por recurso:

- [`/src/modules/pokemon/infrastructure/http/pokemonClient.ts`](C:/Users/jvdua/OneDrive/Documentos/Projects/pokemon-game/src/modules/pokemon/infrastructure/http/pokemonClient.ts)
- [`/src/modules/pokemon/infrastructure/http/moveClient.ts`](C:/Users/jvdua/OneDrive/Documentos/Projects/pokemon-game/src/modules/pokemon/infrastructure/http/moveClient.ts)
- [`/src/modules/pokemon/infrastructure/http/typeClient.ts`](C:/Users/jvdua/OneDrive/Documentos/Projects/pokemon-game/src/modules/pokemon/infrastructure/http/typeClient.ts)

Todos usam [`/src/modules/pokemon/infrastructure/http/pokeApiClient.ts`](C:/Users/jvdua/OneDrive/Documentos/Projects/pokemon-game/src/modules/pokemon/infrastructure/http/pokeApiClient.ts), que opera com `fetch` direto e sem políticas adicionais de retry, timeout, cache HTTP ou circuit breaker.

#### IndexedDB

O armazenamento local organiza seis object stores:

- `app_metadata`: metadados operacionais, incluindo flags de loaders executados;
- `moves`: catálogo de movimentos;
- `pokemons`: catálogo principal;
- `pokemon_moves`: associação N:N achatada entre Pokémon e movimentos;
- `pokemon_types`: catálogo de tipos;
- `pokemon_type_effectiveness`: relações de efetividade entre tipos.

Apesar da store `pokemon_type_effectiveness` ser populada, ela ainda não é consumida por fluxos de UI ou casos de uso.

### Processamento assíncrono

O bootstrap de Pokémon usa Web Worker via [`/src/shared/utils/workers/bootWorker.ts`](C:/Users/jvdua/OneDrive/Documentos/Projects/pokemon-game/src/shared/utils/workers/bootWorker.ts) para deslocar a carga massiva de download e persistência do thread principal. Tipos e movimentos usam concorrência controlada no próprio thread com [`/src/shared/utils/promise.ts`](C:/Users/jvdua/OneDrive/Documentos/Projects/pokemon-game/src/shared/utils/promise.ts).

## 4. Organização do código

A estrutura do repositório é orientada por módulos de negócio dentro de `src/modules`, complementados por `configs` e `shared`.

### Estrutura macro

- `src/modules/boot`: pipeline de inicialização e carga de dados.
- `src/modules/pokemon`: núcleo de domínio, mapeamento, acesso remoto e persistência.
- `src/modules/pokedex`: fluxo de consulta e visualização da Pokédex.
- `src/modules/start-menu`: menu inicial e créditos.
- `src/shared`: layout, áudio, utilitários e worker.
- `src/configs`: configuração de API e banco local.

### Racional estrutural

O projeto evita uma divisão puramente técnica por pastas globais do tipo `components`, `services` e `repositories` para todo o código. Em vez disso, a maior parte das decisões fica encapsulada por módulo, o que reduz colisão de contexto e facilita evolução por feature.

O módulo `pokemon` funciona como módulo base compartilhado:

- concentra entidades canônicas do sistema;
- expõe casos de uso reutilizados por outros módulos;
- centraliza detalhes de integração com PokeAPI e IndexedDB.

Em contraste, `start-menu` é intencionalmente mais simples e ainda não replica a mesma segmentação interna de `application/domain/infrastructure`, o que indica coexistência de estilos arquiteturais em diferentes níveis de maturidade.

## 5. Principais módulos e responsabilidades

### `boot`

Responsável por inicialização funcional da aplicação:

- renderiza a tela de carregamento;
- compõe o caso de uso de bootstrap;
- executa loaders sequenciais com progressão agregada;
- marca loaders já processados para evitar recarga completa.

Arquivos centrais:

- [`/src/modules/boot/ui/pages/BootPage.tsx`](C:/Users/jvdua/OneDrive/Documentos/Projects/pokemon-game/src/modules/boot/ui/pages/BootPage.tsx)
- [`/src/modules/boot/application/use-cases/LoadGameResourcesUseCase.ts`](C:/Users/jvdua/OneDrive/Documentos/Projects/pokemon-game/src/modules/boot/application/use-cases/LoadGameResourcesUseCase.ts)
- [`/src/modules/boot/domain/services/BootLoaderService.ts`](C:/Users/jvdua/OneDrive/Documentos/Projects/pokemon-game/src/modules/boot/domain/services/BootLoaderService.ts)

### `pokemon`

É o núcleo do sistema atual. Responsabilidades:

- definir entidades de domínio (`Pokemon`, `PokemonMove`, `PokemonType`, `PokemonStats`, `PokemonSprites`);
- validar identificadores com value objects;
- encapsular leitura e escrita em IndexedDB;
- mapear payloads externos para o modelo interno;
- expor casos de uso de listagem e busca;
- fornecer composição reutilizável para módulos consumidores.

Subáreas relevantes:

- `domain/entities`: modelo central persistido e lido pela aplicação.
- `domain/value-objects`: validação mínima de IDs.
- `application/use-cases`: leitura de Pokémon por lista ou id.
- `infrastructure/http`: clientes PokeAPI.
- `infrastructure/mappers`: tradução API <-> domínio <-> banco.
- `infrastructure/repositories`: persistência local.
- `infrastructure/composition`: wiring manual de dependências.

### `pokedex`

Responsável pelo fluxo de consulta do catálogo local:

- instancia dependências via `createPokedexDependencies`;
- carrega lista resumida de Pokémon;
- seleciona um Pokémon atual;
- renderiza detalhes, sprites, tipos e movimentos.

Arquivos centrais:

- [`/src/modules/pokedex/ui/hooks/usePokedex.ts`](C:/Users/jvdua/OneDrive/Documentos/Projects/pokemon-game/src/modules/pokedex/ui/hooks/usePokedex.ts)
- [`/src/modules/pokedex/ui/pages/PokedexPage.tsx`](C:/Users/jvdua/OneDrive/Documentos/Projects/pokemon-game/src/modules/pokedex/ui/pages/PokedexPage.tsx)

### `start-menu`

Responsável pela entrada pós-bootstrap:

- renderiza menu principal;
- toca BGM e efeitos sonoros de UI;
- expõe rotas para áreas presentes e futuras.

O módulo hoje mistura navegação, apresentação e acionamento de áudio diretamente no componente de página. Não há casos de uso nem fronteiras adicionais.

### `shared`

Infraestrutura transversal:

- `GameLayout`: moldura visual fixa da aplicação;
- `AudioEngine`: controle simples de canais de áudio;
- utilitários para download binário;
- execução com concorrência limitada;
- worker de bootstrap.

## 6. Fluxos principais

### Fluxo de inicialização

1. [`/src/main.tsx`](C:/Users/jvdua/OneDrive/Documentos/Projects/pokemon-game/src/main.tsx) monta `BrowserRouter`, `GameLayout` e `App`.
2. A rota `/` renderiza `BootPage`.
3. `BootPage` cria `LoadGameResourcesUseCase`.
4. O caso de uso delega para `BootLoaderService`.
5. `BootLoaderService` executa loaders em sequência:
   - `PokemonTypeLoader`
   - `MoveLoader`
   - `PokemonDataLoader`
6. Cada loader verifica em `app_metadata` se já foi executado.
7. Se não houver marcação:
   - tipos e movimentos são baixados da PokeAPI e persistidos;
   - Pokémon são baixados e persistidos via worker.
8. Ao atingir `progress >= 100`, a UI navega para `/menu`.

Implicação importante: a ordem dos loaders é estrutural. Pokémon dependem de tipos e movimentos já salvos para que `PokemonMapper.fromApi` consiga enriquecer a entidade com dados locais.

### Fluxo de carga de tipos

1. `PokemonTypeLoader` consulta `type?limit=1000`.
2. Para cada tipo, busca o recurso individual.
3. `PokemonTypeMapper.fromApi` expande relações de efetividade buscando cada tipo relacionado.
4. `PokemonTypeDBRepository.save` persiste:
   - dados básicos do tipo;
   - relações de efetividade em tabela separada.

Trade-off: o mapeamento de tipos faz múltiplas chamadas em cascata por relação de dano, o que amplia bastante o custo de bootstrap.

### Fluxo de carga de movimentos

1. `MoveLoader` consulta `move?limit=10000`.
2. Cada movimento é buscado individualmente.
3. `PokemonMoveMapper.fromApi` converte o payload.
4. `MoveDBRepository.save` resolve o `type_id` via `PokemonTypeDBRepository`.
5. O movimento é salvo em `moves`.

### Fluxo de carga de Pokémon

1. `PokemonDataLoader` consulta `pokemon?limit=10000`.
2. A lista é enviada ao Web Worker.
3. O worker processa lotes com concorrência limitada.
4. Para cada Pokémon:
   - busca o recurso completo na PokeAPI;
   - converte áudio e sprites para `ArrayBuffer`;
   - resolve tipos e movimentos já persistidos;
   - salva dados básicos em `pokemons`;
   - salva associações em `pokemon_moves`.

Esse é o fluxo mais caro do sistema em rede, CPU e armazenamento local.

### Fluxo da Pokédex

1. A rota `/pokedex` renderiza `PokedexPage`.
2. `usePokedex` instancia a composição de `pokemon`.
3. `listPokemons.execute()` lê todos os Pokémon do IndexedDB.
4. O primeiro item da lista é usado como seleção inicial.
5. `fetchPokemon.execute(id)` recompõe a entidade completa:
   - lê Pokémon base;
   - resolve movimentos associados;
   - resolve tipos associados.
6. `PokemonDetails` renderiza dados textuais e movimentos.
7. `PokemonSprites` cria object URLs para sprites, toca o cry e anima a sprite exibida.

### Fluxo de áudio no menu

1. `StartMenuPage` dispara `audioEngine.playBGM('/sounds/start-menu.wav')` no `mount`.
2. Hover de itens do menu toca `menu-hover.mp3`.
3. Clique toca `menu-click.wav` e navega para a rota alvo.

Observação: algumas rotas de destino do menu não existem no roteamento atual.

## 7. Padrões de design e arquitetura adotados

### Modularização por feature

O projeto organiza código por domínio funcional, não apenas por tipo técnico. Isso fica explícito em `boot`, `pokemon`, `pokedex` e `start-menu`.

### Separação em camadas

Os módulos mais maduros adotam a convenção:

- `domain`
- `application`
- `infrastructure`
- `ui`

Esse padrão está presente de forma consistente em `boot` e `pokemon`, e parcialmente em `pokedex`.

### Repository Pattern

Repositórios abstraem a persistência local:

- `IPokemonRepository`
- `IMoveRepository`
- `IPokemonTypeRepository`

Apesar disso, a implementação concreta ainda vaza para a composição e para dependências internas entre repositórios.

### Use Case Pattern

Os casos de uso encapsulam operações de aplicação:

- `LoadGameResourcesUseCase`
- `ListPokemonsUseCase`
- `FetchPokemonUseCase`

São casos de uso finos, com pouca lógica própria, mas já definem um ponto de entrada estável para a UI.

### Data Mapper

Os mappers isolam a tradução entre:

- payload remoto;
- entidade de domínio;
- modelo persistido em IndexedDB.

Esse é um padrão estrutural relevante no projeto, especialmente porque a aplicação armazena binários (`ArrayBuffer`) e relações derivadas.

### Manual Dependency Injection / Composition Root local

Não há container IoC. A composição é manual por módulo, por exemplo em [`/src/modules/pokemon/infrastructure/composition/createPokemonModule.ts`](C:/Users/jvdua/OneDrive/Documentos/Projects/pokemon-game/src/modules/pokemon/infrastructure/composition/createPokemonModule.ts).

### Worker Offloading

O uso de Web Worker para carga massiva de Pokémon é uma decisão arquitetural explícita para reduzir bloqueio de UI durante bootstrap.

## 8. Decisões técnicas relevantes

### Persistir snapshot local em vez de consultar a API em tempo real

Decisão central do sistema. Impactos:

- melhora previsibilidade de leitura posterior;
- permite operar a Pokédex a partir de armazenamento local;
- desloca complexidade para o bootstrap inicial;
- aumenta custo de armazenamento, tempo de primeira execução e sensibilidade a falhas de carga.

### Armazenar sprites e cries como `ArrayBuffer`

Impactos:

- reduz dependência de disponibilidade futura das URLs remotas após o bootstrap;
- simplifica reuso offline parcial do catálogo já carregado;
- aumenta significativamente volume persistido no browser;
- exige criação e revogação de object URLs na UI.

### Bootstrap idempotente baseado em flags por loader

`BootLoaderService` grava `loader.<nome>` em `app_metadata`. Impactos:

- evita recarga completa em execuções subsequentes;
- simplifica controle operacional;
- não trata versionamento fino do conteúdo carregado;
- qualquer mudança estrutural nos dados depende de estratégia explícita de invalidação ou migração.

### Dependência da ordem de inicialização

Tipos e movimentos são pré-requisitos para persistência de Pokémon. Impactos:

- simplifica enriquecimento local em `PokemonMapper`;
- cria acoplamento temporal entre loaders;
- torna a ordem de execução uma regra de negócio implícita.

### Uso de IndexedDB com esquema próprio

A persistência local está normalizada apenas parcialmente:

- Pokémon ficam em uma store principal;
- movimentos do Pokémon ficam em tabela associativa;
- efetividade de tipos é salva separadamente;
- leitura de entidades completas recompõe relações sob demanda.

Trade-off: modelo simples para escrita, mas com potencial de muitas leituras cruzadas para reidratação.

### Composição manual de dependências

Impactos:

- baixa complexidade operacional;
- fácil leitura inicial;
- menor flexibilidade para testes de integração e substituição de implementações;
- favorece instanciamento repetido de dependências concretas.

## 9. Pontos de atenção para manutenção e evolução

### Divergência entre visão de produto e código entregue

O contexto funcional menciona batalha, captura, progressão e habilidades. O código atual não implementa esses fluxos. Qualquer evolução deve começar separando:

- backlog funcional pretendido;
- capacidades efetivamente disponíveis;
- contratos de domínio já estabilizados versus estruturas provisórias.

### Reidratação custosa de entidades

`PokemonDBRepository.getById` e `listAll` recompõem tipos e, no caso de `getById`, também movimentos. Isso cria:

- múltiplas leituras IndexedDB por entidade;
- potencial gargalo ao escalar a quantidade de consultas;
- forte dependência de consistência entre stores relacionadas.

### Repositórios concretos instanciando outros repositórios concretos

Exemplo: `PokemonDBRepository` instancia `MoveDBRepository` e `PokemonTypeDBRepository` internamente. Isso:

- aumenta acoplamento entre implementações;
- dificulta mock e isolamento fino em testes;
- espalha regras de composição fora do composition root.

### Persistência de efetividade de tipos sem consumo funcional

O sistema escreve `pokemon_type_effectiveness`, mas não há leitura correspondente. Esse dado hoje representa custo de bootstrap e armazenamento sem retorno funcional imediato.

### Menu com rotas inexistentes

`StartMenuPage` navega para `/find`, `/my-pokemons` e `/shop`, mas essas rotas não estão declaradas. Isso introduz:

- navegação para fallback de página não encontrada;
- inconsistência entre menu principal e estado real do produto.

### Estratégia de atualização de dados

Não existe versionamento de schema nem de dataset além de `DB_VERSION = 1` e flags por loader. Mudanças futuras no modelo exigirão:

- migração de IndexedDB;
- invalidação seletiva ou total do cache local;
- revisão das flags de loaders executados.

### Custos do bootstrap

O projeto consulta listas amplas (`limit=10000`) e depois faz fetch individual de recursos. Isso é funcionalmente simples, mas operacionalmente pesado para primeira carga.

## 10. Débitos técnicos, limitações ou riscos

### Escopo funcional incompleto

O sistema atual ainda não implementa os fluxos centrais esperados de um jogo de batalha/captura. O README anterior também não refletia o estado real do projeto.

### Ausência de tratamento robusto de falhas de rede

Não há retry, backoff, timeout explícito, cancelamento nem retomada parcial. Uma falha durante bootstrap pode interromper a carga sem mecanismo claro de recuperação incremental.

### Flags de loader podem mascarar dados incompletos

Se um loader marcar conclusão sem garantir integridade total dos dados persistidos, execuções futuras pularão o processo. A estratégia depende da confiabilidade completa de cada loader.

### Bootstrap potencialmente muito pesado para o navegador

Baixar milhares de movimentos e Pokémon, além de sprites e cries binários, pode causar:

- alto consumo de banda;
- uso intensivo de armazenamento local;
- longa primeira execução;
- sensibilidade a limites do browser/dispositivo.

### Cobertura de testes restrita

Existem testes unitários pontuais, mas não há evidência de cobertura significativa para:

- repositórios IndexedDB;
- fluxo end-to-end de boot;
- navegação;
- worker;
- comportamento da Pokédex em cenários reais de dados.

### Inconsistência arquitetural entre módulos

Nem todos os módulos seguem o mesmo grau de separação em camadas. `start-menu` é mais acoplado à UI, enquanto `pokemon` e `boot` são mais estruturados. Isso tende a produzir estilos divergentes conforme o projeto cresce.

### Campos de domínio mais ricos que sua reidratação atual

`PokemonType` possui coleções de relações, movimentos e pokémons, mas o repositório retorna instâncias com essas listas vazias. O domínio modela mais do que a aplicação realmente reidrata ou usa.

### Serviços não integrados

`PokemonService` existe, mas os casos de uso usam o repositório diretamente. Isso sugere uma camada de domínio parcialmente abandonada ou ainda em transição.

## 11. Conclusão técnica

O projeto já possui uma base arquitetural acima do trivial para um frontend pessoal, especialmente pela separação modular, uso de casos de uso, mappers, repositórios e persistência local com bootstrap assíncrono. O núcleo técnico real, no estado atual, é um catálogo local de Pokémon abastecido por PokeAPI e exposto por uma Pokédex navegável.

Os principais ganhos estruturais estão em:

- modularização por feature;
- desacoplamento parcial entre UI e fonte remota;
- modelagem explícita de domínio;
- preparação para evolução incremental.

Os principais riscos estão em:

- bootstrap excessivamente pesado;
- acoplamento entre loaders, mappers e repositórios concretos;
- descompasso entre visão de produto e funcionalidades implementadas;
- ausência de estratégia madura de migração e atualização do dataset local.

Suposição explícita: esta documentação foi produzida exclusivamente a partir do código disponível no repositório local e do contexto textual fornecido. Onde o contexto funcional divergou da implementação observada, prevaleceu a descrição do comportamento efetivamente implementado.
