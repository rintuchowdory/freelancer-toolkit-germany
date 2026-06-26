/* =============================================================
 DashboardLayout.tsx
 Design: Neue Sachlichkeit
 - Deep charcoal sidebar (#1C1F26) with amber-gold active indicator
 - Fixed 240px sidebar, collapsible on mobile
 - IBM Plex Sans throughout
 ============================================================= */
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  LayoutDashboard,
  FileText,
  CheckCircle,
  Bell,
  HelpCircle,
  Receipt,
  Users,
  Settings,
  Menu,
  Sun,
  Moon,
  ChevronRight,
  Github,
  Briefcase,
  Clock,
  Folder,
  Calculator,
  FileSignature,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  labelDe: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeVariant?: "default" | "destructive" | "secondary";
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    labelDe: "Übersicht",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Invoices",
    labelDe: "Rechnungen",
    href: "/invoices",
    icon: FileText,
    badge: "3",
    badgeVariant: "default",
  },
  {
    label: "Kleinunternehmer",
    labelDe: "§19 UStG Prüfer",
    href: "/kleinunternehmer",
    icon: CheckCircle,
  },
  {
    label: "VAT Reminders",
    labelDe: "USt-Erinnerungen",
    href: "/vat-reminders",
    icon: Bell,
    badge: "!",
    badgeVariant: "destructive",
  },
  {
    label: "ELSTER Helper",
    labelDe: "ELSTER KI-Hilfe",
    href: "/elster",
    icon: HelpCircle,
  },
  { label: "Expenses", labelDe: "Ausgaben", href: "/expenses", icon: Receipt },
  {
    label: "CRM Contacts",
    labelDe: "Kontakte",
    href: "/contacts",
    icon: Users,
  },
  {
    label: "Zeiterfassung",
    labelDe: "Stunden erfassen",
    href: "/zeiterfassung",
    icon: Clock,
  },
  {
    label: "Angebote",
    labelDe: "Angebotsverwaltung",
    href: "/angebote",
    icon: FileText,
  },
  {
    label: "Projekte",
    labelDe: "Projektübersicht",
    href: "/projekte",
    icon: Folder,
  },
  {
    label: "Steuerrechner",
    labelDe: "Steuer berechnen",
    href: "/steuerrechner",
    icon: Calculator,
  },
  {
    label: "Verträge",
    labelDe: "Vertragsverwaltung",
    href: "/vertraege",
    icon: FileSignature,
  },
];

const bottomNavItems: NavItem[] = [
  {
    label: "Settings",
    labelDe: "Einstellungen",
    href: "/settings",
    icon: Settings,
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  const NavLink = ({ item }: { item: NavItem }) => {
    const active = isActive(item.href);
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={item.href}>
            <div
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-sm transition-all duration-150 group relative",
                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                active
                  ? "bg-sidebar-accent text-white font-medium"
                  : "text-sidebar-foreground/70"
              )}
            >
              {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-amber-gold rounded-r-full" />
              )}
              <item.icon
                className={cn("shrink-0", collapsed ? "w-5 h-5" : "w-4 h-4")}
              />
              {!collapsed && (
                <>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold leading-tight">
                      {item.label}
                    </div>
                    <div className="text-[10px] text-sidebar-foreground/40 leading-tight">
                      {item.labelDe}
                    </div>
                  </div>
                  {item.badge && (
                    <Badge
                      variant={item.badgeVariant || "default"}
                      className="text-[10px] h-4 min-w-4 px-1 shrink-0"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </div>
          </Link>
        </TooltipTrigger>
        {collapsed && (
          <TooltipContent side="right" className="text-xs">
            <div className="font-semibold">{item.label}</div>
            <div className="text-muted-foreground text-[10px]">
              {item.labelDe}
            </div>
          </TooltipContent>
        )}
      </Tooltip>
    );
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
      {/* Logo / Brand */}
      <div
        className={cn(
          "flex items-center gap-3 px-4 py-4 border-b border-sidebar-border",
          collapsed && "justify-center px-2"
        )}
      >
        <div className="w-8 h-8 rounded bg-amber-gold/20 border border-amber-gold/40 flex items-center justify-center shrink-0">
          <Briefcase className="w-4 h-4 text-amber-gold" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <div className="text-sm font-bold text-white leading-tight truncate">
              Freelancer
            </div>
            <div className="text-[10px] text-sidebar-foreground/50 leading-tight">
              Toolkit Germany
            </div>
          </div>
        )}
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="ml-auto text-sidebar-foreground/40 hover:text-sidebar-foreground transition-colors p-1"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="text-sidebar-foreground/40 hover:text-sidebar-foreground transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5 rotate-180" />
          </button>
        )}
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {!collapsed && (
          <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/30">
            Werkzeuge
          </div>
        )}
        {navItems.map(item => (
          <NavLink key={item.href} item={item} />
        ))}
      </nav>

      {/* Bottom Navigation */}
      <div className="px-2 py-3 border-t border-sidebar-border space-y-0.5">
        {bottomNavItems.map(item => (
          <NavLink key={item.href} item={item} />
        ))}

        {/* Theme Toggle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={toggleTheme}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-sm transition-all duration-150",
                "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                collapsed && "justify-center"
              )}
            >
              {theme === "dark" ? (
                <Sun
                  className={cn("shrink-0", collapsed ? "w-5 h-5" : "w-4 h-4")}
                />
              ) : (
                <Moon
                  className={cn("shrink-0", collapsed ? "w-5 h-5" : "w-4 h-4")}
                />
              )}
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold leading-tight">
                    {theme === "dark" ? "Light Mode" : "Dark Mode"}
                  </div>
                  <div className="text-[10px] text-sidebar-foreground/40 leading-tight">
                    {theme === "dark" ? "Hell" : "Dunkel"}
                  </div>
                </div>
              )}
            </button>
          </TooltipTrigger>
          {collapsed && (
            <TooltipContent side="right" className="text-xs">
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </TooltipContent>
          )}
        </Tooltip>

        {/* GitHub Link */}
        {!collapsed && (
          <a
            href="https://github.com/rintuchowdory/freelancer-toolkit-germany"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-sm transition-all duration-150 text-sidebar-foreground/40 hover:text-sidebar-foreground/70"
          >
            <Github className="w-4 h-4 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold leading-tight">GitHub</div>
              <div className="text-[10px] text-sidebar-foreground/30 leading-tight">
                Quellcode
              </div>
            </div>
          </a>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col shrink-0 transition-all duration-200",
          collapsed ? "w-16" : "w-60"
        )}
        style={{ transition: "width 200ms cubic-bezier(0.23, 1, 0.32, 1)" }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative z-10 w-60 flex flex-col">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="shrink-0 h-14 flex items-center gap-4 px-4 lg:px-6 border-b border-border bg-card">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>

          <div className="flex-1 flex items-center gap-2 min-w-0">
            <PageTitle location={location} />
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://github.com/rintuchowdory/freelancer-toolkit-germany"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded border border-border hover:border-foreground/20"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
            <div className="w-8 h-8 rounded bg-amber-gold/15 border border-amber-gold/30 flex items-center justify-center">
              <span className="text-xs font-bold text-amber-gold">FR</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="animate-fade-in-up">{children}</div>
        </main>
      </div>
    </div>
  );
}

function PageTitle({ location }: { location: string }) {
  const routes: Record<string, { title: string; subtitle: string }> = {
    "/": { title: "Dashboard", subtitle: "Übersicht & Kennzahlen" },
    "/invoices": { title: "Invoice Generator", subtitle: "Rechnungsgenerator" },
    "/kleinunternehmer": {
      title: "Kleinunternehmer Checker",
      subtitle: "§19 UStG Prüfung",
    },
    "/vat-reminders": {
      title: "VAT Reminders",
      subtitle: "Umsatzsteuer-Erinnerungen",
    },
    "/elster": {
      title: "ELSTER AI Helper",
      subtitle: "KI-gestützte Steuerhilfe",
    },
    "/expenses": {
      title: "Expense Categorization",
      subtitle: "Ausgabenkategorisierung",
    },
    "/contacts": { title: "CRM Contacts", subtitle: "Kundenverwaltung" },
    "/zeiterfassung": {
      title: "Zeiterfassung",
      subtitle: "Stunden erfassen & verwalten",
    },
    "/angebote": { title: "Angebote", subtitle: "Angebotsverwaltung" },
    "/projekte": { title: "Projektübersicht", subtitle: "Projekte verwalten" },
    "/steuerrechner": { title: "Steuerrechner", subtitle: "Steuer berechnen" },
    "/vertraege": { title: "Verträge", subtitle: "Vertragsverwaltung" },
    "/settings": { title: "Settings", subtitle: "Einstellungen" },
  };

  const current = routes[location] || {
    title: "Freelancer Toolkit",
    subtitle: "Deutschland",
  };

  return (
    <div>
      <h1 className="text-sm font-bold leading-tight">{current.title}</h1>
      <p className="text-[11px] text-muted-foreground leading-tight">
        {current.subtitle}
      </p>
    </div>
  );
}
