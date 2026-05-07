import { useTransactionContext } from "../../context/TransactionContext";
import { useChartData } from "./useChartData";
import { MonthlyChart, CategoryChart } from "./ChartComponents";
import { SummaryCards } from "./SummaryCards";
import { TransactionList } from "../transactions/TransactionList";

export function DashboardContainer() {
	const { transactions, summary, remove } = useTransactionContext();
	const { monthlyData, categoryData } = useChartData(transactions);

	const recentTransactions = transactions.slice(0, 5);

	return (
		<div className="space-y-6">
			<SummaryCards summary={summary} />

			<div className="grid grid-cols-5 gap-5">
				<ChartCard className="col-span-3" title="Evolução Mensal" headerExtra={<MonthlyLegend />}>
					<MonthlyChart data={monthlyData} />
				</ChartCard>

				<ChartCard className="col-span-2" title="Por Categoria">
					<CategoryChart data={categoryData} />
				</ChartCard>
			</div>

			<ChartCard title="Últimas Transações">
				<TransactionList items={recentTransactions} onDelete={remove} />
			</ChartCard>
		</div>
	);
}

interface ChartCardProps {
	title: string;
	children: React.ReactNode;
	headerExtra?: React.ReactNode;
	className?: string;
}

function ChartCard({ title, children, headerExtra, className = "" }: ChartCardProps) {
	return (
		<div
			className={`rounded-2xl p-6 bg-card ${className}`}
			style={{ border: "0.5px solid rgba(255,255,255,0.06)" }}
		>
			<div className="flex items-center justify-between mb-6">
				<p className="text-[11px] uppercase text-white/45 tracking-editorial">
					{title}
				</p>
				{headerExtra}
			</div>
			{children}
		</div>
	);
}

function MonthlyLegend() {
	return (
		<div className="flex gap-5">
			<span className="flex items-center gap-2">
				<span className="w-3 h-0.5 bg-income" />
				<span className="text-[11px] uppercase text-income tracking-editorial">
					Receitas
				</span>
			</span>
			<span className="flex items-center gap-2">
				<span className="w-3 h-0.5 bg-coral-light" />
				<span className="text-[11px] uppercase text-coral-light tracking-editorial">
					Despesas
				</span>
			</span>
		</div>
	);
}
