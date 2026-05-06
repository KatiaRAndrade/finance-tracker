import { useTransactionContext } from "../../context/TransactionContext";
import { useFilters } from "../filters/useFilters";
import { Filter } from "../filters/Filter";
import { TransactionList } from "../transactions/TransactionList";
import { SummaryCards } from "../dashboard/SummaryCards";

// Esse container orquestra a Fase 2 inteira:
// pega as transações do contexto global, passa pro useFilters,
// e distribui os resultados pros componentes apresentacionais.
export function FilteredTransactionContainer() {
	const { transactions, remove, summary } = useTransactionContext();

	// useFilters recebe o array bruto e devolve:
	// - filters: estado atual dos filtros
	// - setFilter, reset: ações
	// - filtered: transações já filtradas
	// - hasActiveFilters: booleano
	const { filters, setFilter, reset, filtered, hasActiveFilters } =
		useFilters(transactions);

	// O 'value' que passamos pro Filter é o objeto que os subcomponentes
	// vão consumir via contexto interno. Montamos ele aqui.
	const filterContextValue = { filters, setFilter, reset };

	return (
		<div className="space-y-6">
			{/* SummaryCards sempre mostra o resumo total — sem filtro.
          Uma decisão de produto: o saldo real não muda com filtros,
          só a lista de transações muda. */}
			<SummaryCards summary={summary} />

			{/* O Compound Component em uso real.
          Quem usa decide quais filhos e em que ordem. */}
			<div className="flex items-center justify-between">
				<Filter value={filterContextValue}>
					<Filter.Type />
					<Filter.Period />
					<Filter.Category />
					<Filter.Reset />
				</Filter>

				{/* Feedback visual: quantas transações o filtro encontrou */}
				{hasActiveFilters && (
					<span className="text-xs text-white/30">
						{filtered.length} de {transactions.length} transações
					</span>
				)}
			</div>

			{/* TransactionList recebe 'filtered' — não 'transactions'.
          O componente presentational não sabe que existe filtragem.
          Pra ele, é só um array de itens pra renderizar. */}
			<TransactionList items={filtered} onDelete={remove} />
		</div>
	);
}
