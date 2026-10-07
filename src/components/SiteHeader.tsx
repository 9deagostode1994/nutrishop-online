import { Link } from "@tanstack/react-router";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartDrawer } from "@/components/CartDrawer";
import { SHOPIFY_STORE_PERMANENT_DOMAIN } from "@/lib/shopify";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="bg-primary py-1.5 text-center text-xs font-semibold uppercase tracking-widest text-primary-foreground">
        Frete grátis acima de R$ 299 • Compra 100% segura
      </div>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="font-display text-2xl uppercase tracking-tight">
          Vigor<span className="text-primary">.</span>
        </Link>
        <nav className="hidden gap-8 text-sm font-medium md:flex">
          <Link to="/" className="hover:text-primary">Início</Link>
          <a href="/#produtos" className="hover:text-primary">Produtos</a>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full" asChild>
            <a href={`https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/account`} target="_blank" rel="noopener noreferrer" aria-label="Minha conta e pedidos">
              <User className="h-5 w-5" />
            </a>
          </Button>
          <CartDrawer />
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary text-secondary-foreground">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl uppercase">Vigor<span className="text-primary">.</span></p>
          <p className="mt-2 text-sm opacity-70">Suplementos de alta performance com procedência garantida.</p>
        </div>
        <div className="text-sm opacity-80">
          <p className="font-semibold">Segurança</p>
          <p className="mt-2">Site protegido por SSL. Pagamentos processados em ambiente certificado PCI-DSS.</p>
        </div>
        <div className="text-sm opacity-80">
          <p className="font-semibold">Aviso</p>
          <p className="mt-2">Suplementos não substituem uma alimentação equilibrada. Consulte um profissional de saúde.</p>
        </div>
      </div>
    </footer>
  );
}
