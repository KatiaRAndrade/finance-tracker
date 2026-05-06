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
				<TransactionItem
					key={transaction.id}
					transaction={transaction}
					onDelete={onDelete}
				/>
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
		<div className="group flex items-center gap-4 py-4 border-b border-white/[0.06] last:border-b-0">
			<div
				className={`
          w-[38px] h-[38px] rounded-[10px] flex items-center justify-center shrink-0
          ${
						isIncome
							? "bg-emerald-300/10 text-emerald-300"
							: "bg-[#e8919c]/10 text-[#f5a3a3]"
					}
        `}
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

			<span
				className={`font-serif text-lg ${isIncome ? "text-emerald-300" : "text-[#f5a3a3]"}`}
			>
				{isIncome ? "+" : "−"}
				{formattedAmount.replace("R$", "R$ ")}
			</span>

			<button
				onClick={() => onDelete(transaction.id)}
				className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-white/5 text-white/30 hover:text-[#f5a3a3]"
				aria-label={`Deletar transação: ${transaction.description}`}
			>
				<svg
					width="14"
					height="14"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.5"
					viewBox="0 0 24 24"
				>
					<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
				</svg>
			</button>
		</div>
	);
}

function CategoryIcon({ category }: { category: keyof typeof CATEGORIES }) {
	const props = {
		width: 16,
		height: 16,
		fill: "none",
		stroke: "currentColor",
		strokeWidth: 1.5,
		viewBox: "0 0 24 24",
	};
	switch (category) {
		case "food":
			return (
				<svg {...props}>
					<path d="M3 11h18M5 11v9h14v-9M9 7V4M15 7V4" />
				</svg>
			);
		case "transport":
			return (
				<svg {...props}>
					<path d="M5 17h14l-1.5-7h-11L5 17zM7 17v2M17 17v2" />
				</svg>
			);
		case "entertainment":
			return (
				<svg {...props}>
					<path d="M3 12l9-9 9 9M5 10v10h14V10" />
				</svg>
			);
		case "utilities":
			return (
				<svg {...props}>
					<circle cx="12" cy="12" r="9" />
					<circle cx="12" cy="12" r="3" />
				</svg>
			);
		case "health":
			return (
				<svg {...props}>
					<circle cx="12" cy="12" r="9" />
					<path d="M9 12l2 2 4-4" />
				</svg>
			);
		case "education":
			return (
				<svg {...props}>
					<circle cx="12" cy="12" r="9" />
					<path d="M9 12l2 2 4-4" />
				</svg>
			);
		case "shopping":
			return (
				<svg {...props}>
					<circle cx="12" cy="12" r="9" />
					<path d="M9 12l2 2 4-4" />
				</svg>
			);
		case "income":
			return (
				<svg {...props}>
					<circle cx="12" cy="12" r="9" />
					<path d="M8 12h8M12 8v8" />
				</svg>
			);
		default:
			return (
				<svg {...props}>
					<circle cx="12" cy="12" r="9" />
				</svg>
			);
	}
}
