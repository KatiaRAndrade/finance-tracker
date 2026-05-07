import type { ReactNode } from "react";

type NavKey = "overview" | "transactions";

interface AppShellProps {
	children: ReactNode;
	activeNav?: NavKey;
	onNavChange?: (nav: NavKey) => void;
}

export function AppShell({
	children,
	activeNav = "overview",
	onNavChange,
}: AppShellProps) {
	return (
		<div className="min-h-screen bg-bg text-white">
			<div className="flex">
				<Sidebar activeNav={activeNav} onNavChange={onNavChange} />
				<main className="flex-1 px-12 py-10 overflow-y-auto">{children}</main>
			</div>
		</div>
	);
}

function Sidebar({
	activeNav,
	onNavChange,
}: {
	activeNav: NavKey;
	onNavChange?: (nav: NavKey) => void;
}) {
	return (
		<aside
			className="w-60 shrink-0 flex flex-col py-6 px-4"
			style={{ borderRight: "0.5px solid rgba(255,255,255,0.06)" }}
		>
			<div className="px-2 mb-8">
				<h1 className="text-2xl font-display italic font-semibold text-coral flex justify-center">
					fintrack
				</h1>
				<p className="text-[11px] uppercase mt-1 text-white/45 tracking-editorial flex justify-center">
					Maio 2026
				</p>
			</div>

			<nav className="flex flex-col gap-1.5 flex-1">
				<NavItem
					active={activeNav === "overview"}
					onClick={() => onNavChange?.("overview")}
					icon={
						<svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
							<circle cx="12" cy="12" r="9" />
							<circle cx="12" cy="12" r="3" fill="currentColor" />
						</svg>
					}
					label="Visão Geral"
				/>
				<NavItem
					active={activeNav === "transactions"}
					onClick={() => onNavChange?.("transactions")}
					icon={
						<svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
							<path d="M7 7l3-3 3 3M7 17l3 3 3-3M7 7v13M17 4v13" />
						</svg>
					}
					label="Transações"
				/>
			</nav>
		</aside>
	);
}

interface NavItemProps {
	active: boolean;
	icon: ReactNode;
	label: string;
	onClick?: () => void;
}

function NavItem({ active, icon, label, onClick }: NavItemProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="flex items-center gap-3.5 px-4 py-2.5 rounded-[10px] text-sm cursor-pointer transition-all"
			style={
				active
					? {
							background: "linear-gradient(90deg, rgba(232,145,156,0.12), rgba(232,145,156,0.04))",
							border: "0.5px solid rgba(232,145,156,0.18)",
							color: "white",
						}
					: {
							border: "0.5px solid transparent",
							color: "rgba(255,255,255,0.45)",
						}
			}
		>
			{icon}
			{label}
		</button>
	);
}
