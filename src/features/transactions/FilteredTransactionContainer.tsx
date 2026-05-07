import { useTransactionContext } from "../../context/TransactionContext";
import { useFilters } from "../filters/useFilters";
import { Filter } from "../filters/Filter";
import { TransactionList } from "../transactions/TransactionList";
import { SummaryCards } from "../dashboard/SummaryCards";

export function FilteredTransactionContainer() {
	const { transactions, remove, summary } = useTransactionContext();
	const { filters, setFilter, reset, filtered, hasActiveFilters } =
		useFilters(transactions);

	const filterContextValue = { filters, setFilter, reset };

	return (
		<div className="space-y-8">
			<SummaryCards summary={summary} />
			<div
				className="rounded-2xl bg-card"
				style={{ border: "0.5px solid rgba(255,255,255,0.06)" }}
			>
				<div
					className="flex items-center justify-between px-6 py-4"
					style={{ borderBottom: "0.5px solid rgba(255,255,255,0.06)" }}
				>
					<Filter value={filterContextValue}>
						<Filter.Type />
						<Filter.Period />
						<Filter.Category />
						<Filter.Reset />
					</Filter>

					{hasActiveFilters && (
						<span className="text-xs text-white/30 tracking-[0.04em]">
							{filtered.length} de {transactions.length}
						</span>
					)}
				</div>

				<div className="px-6">
					<TransactionList items={filtered} onDelete={remove} />
				</div>
			</div>
		</div>
	);
}
