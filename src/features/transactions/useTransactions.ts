import { useMemo } from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import type { Transaction, NewTransaction } from "./transaction.types";

export function useTransactions() {
	const [transactions, setTransactions] = useLocalStorage<Transaction[]>(
		"ft:transactions",
		[],
	);

	const add = (data: NewTransaction) => {
		const newTransaction: Transaction = {
			...data,
			id: crypto.randomUUID(),
		};
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
