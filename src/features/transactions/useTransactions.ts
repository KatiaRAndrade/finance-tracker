import { useMemo } from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import type { Transaction, NewTransaction } from "./transaction.types";

// Hook que centraliza toda a lógica de negócio de transações.
// Componentes consomem essa API — não acessam diretamente o storage
// nem fazem cálculos. Single source of truth do domínio.

export function useTransactions() {
	const [transactions, setTransactions] = useLocalStorage<Transaction[]>(
		"ft:transactions", // prefixo evita colisão com outras apps no mesmo domínio
		[],
	);

	// ─── Ações ────────────────────────────────────────────────────────────────

	const add = (data: NewTransaction) => {
		// crypto.randomUUID() gera um UUID v4 único — sem dependência externa.
		// Suportado em todos os browsers modernos.
		const newTransaction: Transaction = {
			...data,
			id: crypto.randomUUID(),
		};
		// Functional update: 'prev' é sempre o valor mais recente,
		// mesmo se houver dois adds em sequência rápida.
		setTransactions((prev) => [...prev, newTransaction]);
	};

	const remove = (id: string) => {
		setTransactions((prev) => prev.filter((t) => t.id !== id));
	};

	const update = (id: string, data: Partial<NewTransaction>) => {
		setTransactions((prev) =>
			prev.map((t) => (t.id === id ? { ...t, ...data } : t)),
		);
	};

	// ─── Valores derivados (memoizados) ──────────────────────────────────────

	// useMemo recalcula só quando 'transactions' mudar.
	// Sem ele, esse cálculo rodaria em todo re-render — desperdício.
	const summary = useMemo(() => {
		const totalIncome = transactions
			.filter((t) => t.type === "income")
			.reduce((acc, t) => acc + t.amount, 0);

		const totalExpenses = transactions
			.filter((t) => t.type === "expense")
			.reduce((acc, t) => acc + t.amount, 0);

		return {
			totalIncome,
			totalExpenses,
			balance: totalIncome - totalExpenses,
			count: transactions.length,
		};
	}, [transactions]);

	// Ordenadas da mais recente pra mais antiga.
	// [...transactions] cria uma cópia — sort() é in-place e mutaria o estado.
	const sorted = useMemo(
		() =>
			[...transactions].sort(
				(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
			),
		[transactions],
	);

	return {
		transactions: sorted,
		summary,
		add,
		remove,
		update,
	};
}
