export const CATEGORIES = {
	food: { label: "Alimentação" },
	transport: { label: "Transporte" },
	entertainment: { label: "Entretenimento" },
	utilities: { label: "Contas" },
	health: { label: "Saúde" },
	education: { label: "Educação" },
	shopping: { label: "Compras" },
	income: { label: "Entradas" },
	other: { label: "Outros" },
} as const;

export type Category = keyof typeof CATEGORIES;

export interface Transaction {
	id: string;
	description: string;
	amount: number;
	date: string;
	category: Category;
	type: "income" | "expense";
}

export type NewTransaction = Omit<Transaction, "id">;
