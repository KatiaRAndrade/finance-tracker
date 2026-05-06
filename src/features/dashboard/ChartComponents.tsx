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

// Cores do design fintrack — extraídas como constantes pra fácil reuso e manutenção.
// Centralizar cores num único lugar evita inconsistências e facilita
// trocar a paleta no futuro (ex: criar tema claro/escuro).
const COLORS = {
	green: "#86efac", // receitas
	greenSoft: "#6ee7b7",
	coral: "#f5a3a3", // despesas
	coralDark: "#e8919c",
	warm: "#f0a989", // alternativa quente
	purple: "#a78bfa", // categorias secundárias
	bg: "#141414", // background dos cards
	border: "rgba(255,255,255,0.06)",
	textMute: "rgba(255,255,255,0.45)",
	textFaint: "rgba(255,255,255,0.30)",
};

// Formatador de moeda compartilhado entre tooltips e gráficos.
// Função pura fora dos componentes — não tem motivo pra recriar a cada render.
const formatCurrency = (value: number) =>
	new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
		minimumFractionDigits: 0,
	}).format(value);

// ─── Tooltip customizado (Render Props) ───────────────────────────────────────
// Recebe os dados do ponto via props injetadas pelo Recharts.
// Diferença pro design anterior: usamos serif Playfair nos valores
// pra manter consistência visual com o resto do app.

interface TooltipProps {
	active?: boolean;
	payload?: Array<{
		name: string;
		value: number;
		color: string;
		dataKey?: string;
	}>;
	label?: string;
}

function MonthlyTooltip({ active, payload, label }: TooltipProps) {
	if (!active || !payload?.length) return null;

	return (
		<div
			className="rounded-xl px-4 py-3 backdrop-blur-sm"
			style={{
				background: "rgba(20, 20, 20, 0.95)",
				border: "0.5px solid rgba(255,255,255,0.10)",
				boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
			}}
		>
			{/* Label do mês em uppercase tracking spaced — visual editorial */}
			<p
				className="text-[10px] uppercase mb-2 text-white/45"
				style={{ letterSpacing: "0.16em" }}
			>
				{label}
			</p>

			{/* Cada linha: nome da série + valor em serif */}
			<div className="space-y-1.5">
				{payload.map((entry) => (
					<div key={entry.name} className="flex items-center gap-3 text-sm">
						<span
							className="w-2 h-2 rounded-full shrink-0"
							style={{ background: entry.color }}
						/>
						<span className="text-white/70 capitalize">{entry.name}</span>
						<span
							className="ml-auto text-white"
							style={{ fontFamily: "'Playfair Display', serif" }}
						>
							{formatCurrency(entry.value)}
						</span>
					</div>
				))}
			</div>
		</div>
	);
}

// ─── Gráfico de evolução mensal (área com gradiente) ──────────────────────────
// Mudança principal vs design anterior: BarChart → AreaChart.
// Áreas com gradiente vertical dão sensação de fluxo/continuidade,
// que é mais adequado pra "evolução ao longo do tempo".
// Barras seriam melhores pra comparações discretas (ex: meses isolados).

interface MonthlyChartProps {
	data: MonthlyDataPoint[];
}

export function MonthlyChart({ data }: MonthlyChartProps) {
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
				{/* Gradientes definidos uma vez no <defs>, aplicados nas Areas via id.
            Esse é um padrão SVG — o gradiente fica disponível pra qualquer
            elemento referenciar. */}
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

				{/* Grid horizontal apenas — vertical poluiria visualmente.
            stroke muito sutil pra não competir com os dados. */}
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
					// Formato compacto: 4400 → "4.4k" (economiza espaço lateral)
					tickFormatter={(value) => `${(value / 1000).toFixed(1)}k`}
					tick={{ fontSize: 10, fill: COLORS.textFaint }}
					axisLine={false}
					tickLine={false}
					width={36}
				/>

				{/* Render Props: Recharts chama MonthlyTooltip com os dados do ponto.
            cursor: linha vertical sutil que aparece no hover. */}
				<Tooltip
					content={<MonthlyTooltip />}
					cursor={{ stroke: "rgba(255,255,255,0.08)", strokeWidth: 1 }}
				/>

				{/* Área de Receitas — pintada por baixo, vem primeiro no JSX
            pra ficar atrás visualmente.
            type="monotone" cria curvas suaves entre os pontos —
            é o que dá a sensação orgânica do design. */}
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

// ─── Gráfico de pizza por categoria (donut com total no centro) ───────────────
// Mudanças vs versão anterior:
// - Donut com inner radius bem maior — visual mais limpo e moderno
// - Label "TOTAL" + número no centro do donut
// - Stroke linecap rounded nas fatias — ar mais polido
// - Legenda integrada do lado em vez de embaixo

// Cores por categoria — fintrack não usa cores semânticas vibrantes,
// usa variações da paleta coral/quente + verde + um roxo de contraste.
const PIE_COLORS = [
	COLORS.coralDark, // primeiro lugar (maior fatia) — coral mais saturado
	COLORS.warm, // segundo — laranja quente
	COLORS.green, // terceiro — verde menta
	COLORS.purple, // quarto — roxo (contraste pra última)
	COLORS.greenSoft, // quinto — verde mais suave
];

interface CategoryChartProps {
	data: CategoryDataPoint[];
}

export function CategoryChart({ data }: CategoryChartProps) {
	if (data.length === 0) {
		return (
			<div className="h-48 flex items-center justify-center text-sm text-white/30">
				Nenhuma despesa registrada
			</div>
		);
	}

	// Pegamos só as 5 categorias mais relevantes pra não poluir o donut.
	// 5 fatias é o limite confortável pra visualização de pizza —
	// mais que isso vira sopa de cores difícil de ler.
	const topData = data.slice(0, 5);

	return (
		<div className="flex items-center gap-6">
			{/* Donut + texto central.
          Wrapper com position relative pra posicionar o texto absolutamente. */}
			<div className="relative shrink-0" style={{ width: 140, height: 140 }}>
				<ResponsiveContainer width={140} height={140}>
					<PieChart>
						<Pie
							data={topData}
							cx="50%"
							cy="50%"
							// innerRadius alto = donut fino e moderno.
							// Espaço maior no centro = texto cabe sem disputar com as fatias.
							innerRadius={48}
							outerRadius={68}
							dataKey="value"
							paddingAngle={2} // espaço entre fatias melhora legibilidade
							startAngle={90} // começa no topo (12h) — mais natural visualmente
							endAngle={-270} // -270 = sentido horário (padrão do design)
							stroke="none" // sem borda preta entre fatias
						>
							{topData.map((_, index) => (
								<Cell
									key={index}
									// Cores ciclam — se houver mais de 5 categorias,
									// a 6ª voltaria a usar a primeira cor.
									// Como limitamos a 5 acima, isso nunca acontece.
									fill={PIE_COLORS[index % PIE_COLORS.length]}
								/>
							))}
						</Pie>
					</PieChart>
				</ResponsiveContainer>

				{/* Label central — posicionado absolutamente sobre o donut.
            "TOTAL" em label small + número grande em serif. */}
				<div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
					<p
						className="text-[9px] uppercase text-white/45 mb-0.5"
						style={{ letterSpacing: "0.16em" }}
					>
						Total
					</p>
					<p
						className="text-xl text-white"
						style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500 }}
					>
						{topData.length}
					</p>
				</div>
			</div>

			{/* Legenda à direita — uma linha por categoria.
          Layout: bullet colorido + nome + porcentagem alinhada à direita.
          Nada de tooltip aqui — informação principal já está visível. */}
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
