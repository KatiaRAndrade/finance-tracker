import { useTransactionContext } from "../../context/TransactionContext";
import { useChartData } from "./useChartData";
import { MonthlyChart, CategoryChart } from "./ChartComponents";
import { SummaryCards } from "./SummaryCards";
import { TransactionList } from "../transactions/TransactionList";

// Container do Dashboard — orquestra os dados e distribui pros componentes.
// Arquitetura idêntica à versão anterior, só mudou o LAYOUT (espaçamentos,
// proporções e qual conteúdo vai onde).

export function DashboardContainer() {
	const { transactions, summary, remove } = useTransactionContext();
	const { monthlyData, categoryData } = useChartData(transactions);

	// Mostra só as 5 transações mais recentes na visão geral.
	// Lista completa fica na página de Transações (rota separada).
	const recentTransactions = transactions.slice(0, 5);

	return (
		<div className="space-y-6">
			{/* Linha 1: cards de resumo (saldo herói + receitas + despesas) */}
			<SummaryCards summary={summary} />

			{/* Linha 2: gráfico de área 60% + donut 40%
          Grid 5 colunas: chart usa 3, donut usa 2. */}
			<div className="grid grid-cols-5 gap-5">
				<ChartCard
					className="col-span-3"
					title="Evolução Mensal"
					headerExtra={<MonthlyLegend />}
				>
					<MonthlyChart data={monthlyData} />
				</ChartCard>

				<ChartCard className="col-span-2" title="Por Categoria">
					<CategoryChart data={categoryData} />
				</ChartCard>
			</div>

			{/* Linha 3: últimas transações em card único */}
			<ChartCard title="Últimas Transações">
				<TransactionList items={recentTransactions} onDelete={remove} />
			</ChartCard>
		</div>
	);
}

// ChartCard — wrapper visual padrão dos cards do dashboard.
// Componente pequeno e reutilizável que encapsula o estilo comum:
// border sutil, radius 16px, padding 24px, label em uppercase.
//
// Por que extrair em um componente?
// Porque repetimos o mesmo container 3x no layout — DRY.
// Se o estilo dos cards mudar, muda em um lugar só.

interface ChartCardProps {
	title: string;
	children: React.ReactNode;
	headerExtra?: React.ReactNode; // conteúdo opcional do lado direito do header (ex: legenda)
	className?: string; // permite passar classes do grid
}

function ChartCard({
	title,
	children,
	headerExtra,
	className = "",
}: ChartCardProps) {
	return (
		<div
			className={`rounded-2xl p-6 ${className}`}
			style={{
				background: "#141414",
				border: "0.5px solid rgba(255,255,255,0.06)",
			}}
		>
			<div className="flex items-center justify-between mb-6">
				<p
					className="text-[11px] uppercase text-white/45"
					style={{ letterSpacing: "0.16em" }}
				>
					{title}
				</p>
				{headerExtra}
			</div>
			{children}
		</div>
	);
}

// Legenda customizada do gráfico mensal — usa o mesmo estilo dos labels.
// Extraída como componente pra deixar o JSX do DashboardContainer mais limpo.
function MonthlyLegend() {
	return (
		<div className="flex gap-5">
			<span className="flex items-center gap-2">
				<span className="w-3 h-0.5" style={{ background: "#86efac" }} />
				<span
					className="text-[11px] uppercase text-emerald-300"
					style={{ letterSpacing: "0.16em" }}
				>
					Receitas
				</span>
			</span>
			<span className="flex items-center gap-2">
				<span className="w-3 h-0.5" style={{ background: "#f5a3a3" }} />
				<span
					className="text-[11px] uppercase text-[#f5a3a3]"
					style={{ letterSpacing: "0.16em" }}
				>
					Despesas
				</span>
			</span>
		</div>
	);
}
