/* =============================================================
   NotFound.tsx — 404 Page
   Design: Neue Sachlichkeit
   ============================================================= */
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md px-6">
        <div className="text-8xl font-bold financial-value text-amber-gold/20 mb-4">
          404
        </div>
        <h1 className="text-2xl font-bold mb-2">Seite nicht gefunden</h1>
        <p className="text-sm text-muted-foreground mb-8">
          Die angeforderte Seite existiert nicht oder wurde verschoben.
        </p>
        <div className="flex items-center gap-3 justify-center">
          <Link href="/">
            <Button className="bg-amber-gold hover:bg-amber-gold/90 text-white">
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Zum Dashboard
            </Button>
          </Link>
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zurück
          </Button>
        </div>
      </div>
    </div>
  );
}
