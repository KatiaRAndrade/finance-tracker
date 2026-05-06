import type { ReactNode } from "react";

// AppShell — a "casca" da aplicação.
// Contém sidebar fixa, área de conteúdo principal e fontes carregadas.
// Componente puramente estrutural — não tem lógica nem estado.

interface AppShellProps {
	children: ReactNode;
	// Permite escolher qual item do menu está ativo via prop.
	// Mais fácil que detectar por rota nessa fase do projeto.
	activeNav?: "overview" | "transactions" | "goals";
}

export function AppShell({ children, activeNav = "overview" }: AppShellProps) {
	return (
		<div
			className="min-h-screen bg-[#0a0a0a] text-white"
			style={{ fontFamily: "Inter, sans-serif" }}
		>
			{/* Carrega Playfair Display (serif) e Inter (sans) — fontes do design.
          Em produção, prefira instalar via @fontsource pra evitar requests externos.
          Aqui usamos Google Fonts pela simplicidade. */}
			<link
				rel="stylesheet"
				href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap"
			/>

			<div className="flex">
				<Sidebar activeNav={activeNav} />
				<main className="flex-1 px-12 py-10 overflow-y-auto">{children}</main>
			</div>
		</div>
	);
}

function Sidebar({
	activeNav,
}: {
	activeNav: "overview" | "transactions" | "goals";
}) {
	return (
		<aside
			className="w-60 shrink-0 flex flex-col py-6 px-4"
			style={{ borderRight: "0.5px solid rgba(255,255,255,0.06)" }}
		>
			{/* Logo */}
			<div className="px-2 mb-8">
				<h1
					className="text-2xl"
					style={{
						fontFamily: "'Playfair Display', serif",
						fontStyle: "italic",
						fontWeight: 600,
						color: "#f5a3a3",
					}}
				>
					fintrack
				</h1>
				<p
					className="text-[11px] uppercase mt-1 text-white/45"
					style={{ letterSpacing: "0.16em" }}
				>
					Maio 2026
				</p>
			</div>

			{/* Nav items */}
			<nav className="flex flex-col gap-1.5 flex-1">
				<NavItem
					active={activeNav === "overview"}
					icon={
						<svg
							width="14"
							height="14"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.5"
							viewBox="0 0 24 24"
						>
							<circle cx="12" cy="12" r="9" />
							<circle cx="12" cy="12" r="3" fill="currentColor" />
						</svg>
					}
					label="Visão Geral"
				/>
				<NavItem
					active={activeNav === "transactions"}
					icon={
						<svg
							width="14"
							height="14"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.5"
							viewBox="0 0 24 24"
						>
							<path d="M7 7l3-3 3 3M7 17l3 3 3-3M7 7v13M17 4v13" />
						</svg>
					}
					label="Transações"
				/>
				<NavItem
					active={activeNav === "goals"}
					icon={
						<svg
							width="14"
							height="14"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.5"
							viewBox="0 0 24 24"
						>
							<circle cx="12" cy="12" r="9" />
							<circle cx="12" cy="12" r="5" />
							<circle cx="12" cy="12" r="1.5" fill="currentColor" />
						</svg>
					}
					label="Metas"
				/>
			</nav>

			{/* User card no rodapé */}
			<div className="flex items-center gap-3 px-2 mt-auto pt-4">
				<div
					className="w-9 h-9 rounded-full flex items-center justify-center text-white"
					style={{
						background: "linear-gradient(135deg, #e8919c, #f0a989)",
						fontFamily: "'Playfair Display', serif",
						fontStyle: "italic",
						fontWeight: 500,
					}}
				>
					A
				</div>
				<div>
					<p className="text-sm">Ana Lima</p>
					<p className="text-xs text-white/30">ana@email.com</p>
				</div>
			</div>
		</aside>
	);
}

interface NavItemProps {
	active: boolean;
	icon: ReactNode;
	label: string;
}

function NavItem({ active, icon, label }: NavItemProps) {
	// Estilos diferentes pra item ativo/inativo.
	// O ativo tem gradiente sutil + borda coral muito leve.
	const baseClass =
		"flex items-center gap-3.5 px-4 py-2.5 rounded-[10px] text-sm cursor-pointer transition-all";

	const activeStyle = active
		? {
				background:
					"linear-gradient(90deg, rgba(232,145,156,0.12), rgba(232,145,156,0.04))",
				border: "0.5px solid rgba(232,145,156,0.18)",
				color: "white",
			}
		: {
				color: "rgba(255,255,255,0.45)",
			};

	return (
		<a className={baseClass} style={activeStyle}>
			{icon}
			{label}
		</a>
	);
}
