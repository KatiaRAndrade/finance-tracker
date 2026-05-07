import { CATEGORIES } from "./transaction.types";
import type { Transaction } from "./transaction.types";

interface TransactionListProps {
	items: Transaction[];
	onDelete: (id: string) => void;
}

export function TransactionList({ items, onDelete }: TransactionListProps) {
	if (items.length === 0) {
		return (
			<div className="py-16 text-center text-white/30 text-sm">
				Nenhuma transação ainda
			</div>
		);
	}

	return (
		<div>
			{items.map((transaction) => (
				<TransactionItem key={transaction.id} transaction={transaction} onDelete={onDelete} />
			))}
		</div>
	);
}

function TransactionItem({
	transaction,
	onDelete,
}: {
	transaction: Transaction;
	onDelete: (id: string) => void;
}) {
	const { label } = CATEGORIES[transaction.category];
	const isIncome = transaction.type === "income";

	const formattedAmount = new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
		minimumFractionDigits: 0,
	}).format(transaction.amount);

	return (
		<div className="group flex items-center gap-4 py-5 border-b border-b-white/6 last:border-b-0">
			<div
				className={`w-[38px] h-[38px] rounded-[10px] flex items-center justify-center shrink-0 ${
					isIncome ? "bg-income/10 text-income" : "bg-coral/10 text-coral-light"
				}`}
			>
				<CategoryIcon category={transaction.category} />
			</div>

			<div className="flex-1 min-w-0">
				<p className="text-base font-medium text-white truncate">
					{transaction.description}
				</p>
				<p className="text-xs mt-0.5 text-white/45">
					{label} · {transaction.date}
				</p>
			</div>

			<span className={`font-display text-lg ${isIncome ? "text-income" : "text-coral-light"}`}>
				{isIncome ? "+" : "−"}
				{formattedAmount.replace("R$", "R$ ")}
			</span>

			<button
				onClick={() => onDelete(transaction.id)}
				className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-white/5 text-white/30 hover:text-coral-light"
				aria-label={`Deletar transação: ${transaction.description}`}
			>
				<svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
					<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
				</svg>
			</button>
		</div>
	);
}

function CategoryIcon({ category }: { category: keyof typeof CATEGORIES }) {
	const p = { width: 16, height: 16, fill: "none", stroke: "currentColor", strokeWidth: 1.5, viewBox: "0 0 24 24" };
	switch (category) {
		case "food":
			return <svg {...p}><path d="M3 11h18M5 11v9h14v-9M9 7V4M15 7V4" /></svg>;
		case "transport":
			return <svg {...p}><path d="M5 17h14l-1.5-7h-11L5 17zM7 17v2M17 17v2" /></svg>;
		case "entertainment":
			return <svg {...p}><path d="M3 12l9-9 9 9M5 10v10h14V10" /></svg>;
		case "utilities":
			return <svg {...p}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3" /></svg>;
		case "health":
			return <svg {...p}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>;
		case "education":
			return <svg {...p}><path d="M22 9L12 4 2 9l10 5 10-5z" /><path d="M6 11.5v5c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5v-5" /></svg>;
		case "shopping":
			return <svg {...p}><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>;
		case "income":
			return <svg {...p}><circle cx="12" cy="12" r="9" /><path d="M8 12h8M12 8v8" /></svg>;
		case "other":
			return <svg {...p}><circle cx="12" cy="12" r="9" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></svg>;
	}
}
