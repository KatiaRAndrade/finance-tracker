# Finance Tracker

App de controle financeiro pessoal construído como projeto de portfólio com foco em arquitetura front-end e design patterns em React.

---

## Stack

- React 18 + TypeScript
- Tailwind CSS
- Recharts
- Vite + Vitest + React Testing Library

---

## Decisões de arquitetura

### Estrutura feature-based

O projeto é organizado por domínio, não por tipo de arquivo.

```
src/
├── components/              
│   ├── AppShell.tsx         
│   └── PageHeader.tsx       
├── context/
│   └── TransactionContext.tsx
├── features/
│   ├── transactions/
│   │   ├── transaction.types.ts
│   │   ├── useTransactions.ts
│   │   ├── TransactionList.tsx
│   │   ├── TransactionContainer.tsx
│   │   ├── TransactionModal.tsx
│   │   └── FilteredTransactionContainer.tsx
│   ├── filters/
│   │   ├── filter.types.ts
│   │   ├── useFilters.ts
│   │   ├── FilterContext.ts
│   │   ├── FilterSubcomponents.tsx
│   │   └── Filter.tsx
│   └── dashboard/
│       ├── useChartData.ts
│       ├── ChartComponents.tsx
│       ├── SummaryCards.tsx
│       └── DashboardContainer.tsx
├── hooks/
│   └── useLocalStorage.ts
└── test/
    └── setup.ts             
```

**Por quê:** tipos, hooks e componentes de uma mesma feature vivem juntos. Se a feature de transações fosse extraída pra outro projeto, ela sairia inteira sem dependências espalhadas. Tipos globais ficam numa pasta `types/` na raiz — mas só quando existirem de verdade.

---

## Design patterns aplicados

### Custom Hook

Toda lógica de estado e efeitos extraída dos componentes. Três hooks de domínio: `useTransactions`, `useFilters` e `useChartData`. Um hook genérico: `useLocalStorage`.

**Benefício:** lógica testável isoladamente sem renderizar nenhum componente.

### Provider Pattern — `TransactionContext`

Estado global de transações distribuído via Context API. Hook de consumo com proteção contra uso fora do Provider:

```ts
export function useTransactionContext() {
  const context = useContext(TransactionContext)
  if (!context) {
    throw new Error('useTransactionContext deve ser usado dentro de <TransactionProvider>')
  }
  return context
}
```

**Por quê exportar um hook e não o contexto:** esconde o detalhe de implementação. Troca de Context por Zustand muda só esse arquivo.

### Compound Component — `Filter`

Sistema de filtros com estado implicitamente compartilhado entre subcomponentes via contexto interno:

```tsx
<Filter value={filterContextValue}>
  <Filter.Type />
  <Filter.Period />
  <Filter.Category />
  <Filter.Reset />
</Filter>
```

O contexto do `Filter` é privado — só subcomponentes dentro da pasta `filters/` o acessam. **Por quê:** quem usa decide quais filtros exibir e em que ordem, sem receber estado via props.

### Container / Presentational

Containers acessam contexto e preparam dados. Presentational recebem props e renderizam, sem saber de onde vieram os dados.

**Benefício:** componentes presentational são testados com props mock, sem precisar montar nenhum Provider.

### Render Props — Tooltips dos gráficos

O Recharts expõe `content=` nos componentes `<Tooltip>` e `<Legend>`. Passamos componentes que recebem os dados do ponto e controlam a renderização:

```tsx
<Tooltip content={<MonthlyTooltip />} />
<Legend content={<CategoryLegend />} />
```

---

## Padrões técnicos

### Functional Update

Atualizações de estado baseadas no valor anterior sempre usam a forma funcional:

```ts
// ❌ Risco: closure pode estar desatualizado em updates rápidos
setTransactions([...transactions, newItem])

// ✅ 'prev' é garantidamente o valor mais recente pelo React
setTransactions(prev => [...prev, newItem])
```

**O problema que resolve:** dois updates muito rápidos (ex: duplo clique) podem ler o mesmo estado desatualizado na forma direta. Com functional update, cada um recebe o estado real na ordem certa.

### Imutabilidade

Nenhum array de estado é mutado diretamente. O React compara referências para decidir re-renders — mutar o original não dispara re-render.

### Lazy Initializer

O estado inicial do `useLocalStorage` é uma função, executada apenas uma vez na montagem — não em cada re-render:

```ts
const [value] = useState<T>(() => {
  return JSON.parse(localStorage.getItem(key) ?? 'null') ?? initialValue
})
```

### Derivação de tipos

```ts
// Tipo derivado do retorno do hook — nunca fica desincronizado
type TransactionContextType = ReturnType<typeof useTransactions>

// Tipo derivado das chaves do objeto — adicionar categoria atualiza o tipo
type Category = keyof typeof CATEGORIES
```

### Width dinâmica com style inline

```tsx
// ❌ Tailwind elimina classes não encontradas em build time
<div className={`w-[${rate}%]`} />

// ✅ Style inline para valores em runtime
<div style={{ width: `${rate}%` }} />
```

---

## Testes

```bash
npm run test          
```

**Estratégia por camada:**

- **Hooks** — `renderHook` + `act`: testam lógica pura sem componentes
- **Componentes presentational** — `render` + `screen`: testam renderização com props mock, sem contexto
- **Containers não são testados diretamente** — só conectam contexto e props; a lógica já está coberta nos hooks

**Cobertura dos testes:**
- `useLocalStorage` — inicialização, leitura, escrita, functional update, JSON inválido
- `useTransactions` — add, remove, update, summary, ordenação
- `useFilters` — todos os filtros individuais, filtros combinados, reset
- `useChartData` — agrupamento mensal, distribuição por categoria, percentuais
- `TransactionList` — renderização, estado vazio, delete, badges de categoria

---

## Como rodar

```bash
npm install
npm run dev
npm run test
npm run build
```
