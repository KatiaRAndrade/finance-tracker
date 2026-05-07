import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
} from "recharts";
import type { MonthlyDataPoint, CategoryDataPoint } from "./useChartData";

const COLORS = {
	green: "#86efac",
	greenSoft: "#6ee7b7",
	coral: "#f5a3a3",
	coralDark: "#e8919c",
	warm: "#f0a989",
	purple: "#a78bfa",
	textFaint: "rgba(255,255,255,0.30)",
};

const PIE_COLORS = [
	COLORS.coralDark,
	COLORS.warm,
	COLORS.green,
	COLORS.purple,
	COLORS.greenSoft,
];

const formatCurrency = (value: number) =>
	new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
		minimumFractionDigits: 0,
	}).format(value);

interface TooltipProps {
	active?: boolean;
	payload?: Array<{ name: string; value: number; color: string }>;
	label?: string;
}

function MonthlyTooltip({ active, payload, label }: TooltipProps) {
	if (!active || !payload?.length) return null;

	return (
		<div
			className="rounded-xl px-4 py-3 backdrop-blur-sm bg-card/95"
			style={{
				border: "0.5px solid rgba(255,255,255,0.10)",
				boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
			}}
		>
			<p className="text-[10px] uppercase mb-2 text-white/45 tracking-editorial">
				{label}
			</p>
			<div className="space-y-1.5">
				{payload.map((entry) => (
					<div key={entry.name} className="flex items-center gap-3 text-sm">
						<span
							className="w-2 h-2 rounded-full shrink-0"
							style={{ background: entry.color }}
						/>
						<span className="text-white/70 capitalize">{entry.name}</span>
						<span className="ml-auto text-white font-display">
							{formatCurrency(entry.value)}
						</span>
					</div>
				))}
			</div>
		</div>
	);
}

export function MonthlyChart({ data }: { data: MonthlyDataPoint[] }) {
	if (data.length === 0) {
		return (
			<div className="h-48 flex items-center justify-center text-sm text-white/30">
				Sem dados suficientes para o gráfico
			</div>
		);
	}

	return (
		<ResponsiveContainer width="100%" height={220}>
			<AreaChart
				data={data}
				margin={{ top: 10, right: 10, bottom: 0, left: 0 }}
			>
				<defs>
					<linearGradient id="grad-income" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" stopColor={COLORS.green} stopOpacity={0.3} />
						<stop offset="100%" stopColor={COLORS.green} stopOpacity={0} />
					</linearGradient>
					<linearGradient id="grad-expenses" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" stopColor={COLORS.coral} stopOpacity={0.25} />
						<stop offset="100%" stopColor={COLORS.coral} stopOpacity={0} />
					</linearGradient>
				</defs>

				<CartesianGrid
					strokeDasharray="0"
					stroke="rgba(255,255,255,0.04)"
					vertical={false}
				/>

				<XAxis
					dataKey="month"
					tick={{ fontSize: 10, fill: COLORS.textFaint }}
					axisLine={false}
					tickLine={false}
				/>
				<YAxis
					tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`}
					tick={{ fontSize: 10, fill: COLORS.textFaint }}
					axisLine={false}
					tickLine={false}
					width={36}
				/>

				<Tooltip
					content={<MonthlyTooltip />}
					cursor={{ stroke: "rgba(255,255,255,0.08)", strokeWidth: 1 }}
				/>

				<Area
					type="monotone"
					dataKey="income"
					name="Receitas"
					stroke={COLORS.green}
					strokeWidth={2}
					fill="url(#grad-income)"
				/>
				<Area
					type="monotone"
					dataKey="expenses"
					name="Despesas"
					stroke={COLORS.coral}
					strokeWidth={2}
					fill="url(#grad-expenses)"
				/>
			</AreaChart>
		</ResponsiveContainer>
	);
}

export function CategoryChart({ data }: { data: CategoryDataPoint[] }) {
	if (data.length === 0) {
		return (
			<div className="h-48 flex items-center justify-center text-sm text-white/30">
				Nenhuma despesa registrada
			</div>
		);
	}

	const topData = data.slice(0, 5);

	return (
		<div className="flex items-center gap-6">
			<div className="relative w-[140px] h-[140px] shrink-0">
				<ResponsiveContainer width={140} height={140}>
					<PieChart>
						<Pie
							data={topData}
							cx="50%"
							cy="50%"
							innerRadius={48}
							outerRadius={68}
							dataKey="value"
							paddingAngle={2}
							startAngle={90}
							endAngle={-270}
							stroke="none"
						>
							{topData.map((_, index) => (
								<Cell
									key={index}
									fill={PIE_COLORS[index % PIE_COLORS.length]}
								/>
							))}
						</Pie>
					</PieChart>
				</ResponsiveContainer>

				<div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
					<p className="text-[9px] uppercase text-white/45 mb-0.5 tracking-editorial">
						Total
					</p>
					<p className="text-xl text-white font-display font-medium">
						{topData.length}
					</p>
				</div>
			</div>

			<div className="flex-1 space-y-2.5 min-w-0">
				{topData.map((cat, index) => (
					<div
						key={cat.name}
						className="flex items-center justify-between text-sm"
					>
						<span className="flex items-center gap-2.5 min-w-0">
							<span
								className="w-1.5 h-1.5 rounded-full shrink-0"
								style={{ background: PIE_COLORS[index % PIE_COLORS.length] }}
							/>
							<span className="text-white truncate">{cat.name}</span>
						</span>
						<span className="text-white/45 shrink-0 ml-2">
							{cat.percentage}%
						</span>
					</div>
				))}
			</div>
		</div>
	);
}
