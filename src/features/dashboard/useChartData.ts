import { useMemo } from "react";
import { CATEGORIES } from "../transactions/transaction.types";
import type { Transaction } from "../transactions/transaction.types";

// ─── Tipos de saída ───────────────────────────────────────────────────────────
// Cada tipo representa exatamente o formato que o Recharts espera.
// Definir esses tipos explicitamente serve como documentação:
// quem olhar o hook sabe o que vai receber sem precisar ler a implementação.

export interface MonthlyDataPoint {
	month: string; // ex: "Jan", "Fev" — label do eixo X
	income: number; // total de receitas do mês
	expenses: number; // total de despesas do mês
	balance: number; // saldo do mês (income - expenses)
}

export interface CategoryDataPoint {
	name: string; // label da categoria (ex: "Alimentação")
	value: number; // total gasto
	color: string; // cor HEX pra usar no gráfico de pizza
	percentage: number; // percentual sobre o total de despesas
}

// Mapa de cores HEX por categoria.
// Separado do CATEGORIES pra não misturar lógica de negócio com estilo de gráfico.
// O Recharts precisa de cores HEX — as classes Tailwind não funcionam aqui.
const CATEGORY_COLORS: Record<string, string> = {
	food: "#fbbf24",
	housing: "#22d3ee",
	transport: "#86efac",
	health: "#f87171",
	leisure: "#a78bfa",
	income: "#34d399",
};

export function useChartData(transactions: Transaction[]) {
	// ─── Dados mensais (gráfico de barras) ──────────────────────────────────────
	const monthlyData = useMemo((): MonthlyDataPoint[] => {
		// Estratégia: criar um Map indexado por 'ano-mês' pra agrupar transações.
		// Map é preferível a objeto aqui porque a ordem de inserção é garantida —
		// importante pra manter os meses em ordem cronológica.
		const monthMap = new Map<string, MonthlyDataPoint>();

		transactions.forEach((t) => {
			const date = new Date(t.date);
			const key = `${date.getFullYear()}-${String(date.getMonth()).padStart(2, "0")}`;
			// padStart garante que janeiro vira '01', não '1' —
			// isso faz a ordenação alfabética ser igual à cronológica.

			const label = new Intl.DateTimeFormat("pt-BR", { month: "short" })
				.format(date)
				.replace(".", "") // remove o ponto que o Intl adiciona em alguns meses
				.replace(/^\w/, (c) => c.toUpperCase()); // capitaliza a primeira letra

			// Se o mês ainda não existe no Map, cria a entrada zerada.
			if (!monthMap.has(key)) {
				monthMap.set(key, { month: label, income: 0, expenses: 0, balance: 0 });
			}

			const entry = monthMap.get(key)!;
			// O '!' é o non-null assertion operator: diz pro TypeScript
			// que sabemos que o valor existe (acabamos de garantir acima).
			// Use com cuidado — só quando você tem certeza lógica.

			if (t.type === "income") {
				entry.income += t.amount;
			} else {
				entry.expenses += t.amount;
			}

			// balance é sempre recalculado após cada transação do mês
			entry.balance = entry.income - entry.expenses;
		});

		// Convertemos o Map em array e ordenamos cronologicamente pela chave.
		// Como a chave é 'YYYY-MM', a ordenação string é igual à cronológica.
		return Array.from(monthMap.entries())
			.sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
			.map(([, data]) => data);
		// [, data] desestrutura o par [key, value] ignorando a chave —
		// só queremos o valor nesse ponto.
	}, [transactions]);

	// ─── Dados por categoria (gráfico de pizza) ──────────────────────────────────
	const categoryData = useMemo((): CategoryDataPoint[] => {
		// Só despesas fazem sentido no gráfico de distribuição por categoria.
		// Receitas geralmente vêm de uma única fonte e distorceriam o gráfico.
		const expenses = transactions.filter((t) => t.type === "expense");

		const totalExpenses = expenses.reduce((acc, t) => acc + t.amount, 0);

		// Agrupa por categoria usando reduce.
		// O acumulador é um Record (objeto) de categoria -> total.
		const grouped = expenses.reduce<Record<string, number>>((acc, t) => {
			acc[t.category] = (acc[t.category] ?? 0) + t.amount;
			// ?? 0: se a categoria ainda não existe no acumulador, começa em 0
			return acc;
		}, {});

		return (
			Object.entries(grouped)
				.map(([category, value]) => ({
					name: CATEGORIES[category as keyof typeof CATEGORIES].label,
					value,
					color: CATEGORY_COLORS[category] ?? "#888",
					// percentual arredondado pra uma casa decimal
					percentage:
						totalExpenses > 0
							? Math.round((value / totalExpenses) * 1000) / 10
							: 0,
					// Dividimos por 1000 e não por 100 por causa do arredondamento:
					// queremos 1 casa decimal. Math.round(x * 10) / 10 faria isso,
					// mas multiplicar por 1000 antes e dividir depois evita
					// erros de ponto flutuante em alguns casos.
				}))
				// Ordena do maior pro menor valor — deixa o gráfico mais legível
				.sort((a, b) => b.value - a.value)
		);
	}, [transactions]);

	// ─── Resumo dos últimos 30 dias ───────────────────────────────────────────
	const recentSummary = useMemo(() => {
		const thirtyDaysAgo = new Date();
		thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

		const recent = transactions.filter(
			(t) => new Date(t.date) >= thirtyDaysAgo,
		);

		const income = recent
			.filter((t) => t.type === "income")
			.reduce((acc, t) => acc + t.amount, 0);

		const expenses = recent
			.filter((t) => t.type === "expense")
			.reduce((acc, t) => acc + t.amount, 0);

		// Taxa de poupança: quanto % da receita foi poupado.
		// Se não houver receita, evitamos divisão por zero.
		const savingsRate =
			income > 0 ? Math.round(((income - expenses) / income) * 100) : 0;

		return { income, expenses, balance: income - expenses, savingsRate };
	}, [transactions]);

	return { monthlyData, categoryData, recentSummary };
}
