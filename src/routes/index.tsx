import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ShieldCheck, Truck, Award, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { fetchProducts } from "@/lib/shopify";
import hero from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vigor Suplementos | Whey, Creatina e Pré-Treino" },
      { name: "description", content: "Loja online de suplementos: whey protein, creatina, pré-treino e vitaminas com compra segura e entrega para todo o Brasil." },
      { property: "og:title", content: "Vigor Suplementos | Performance de verdade" },
      { property: "og:description", content: "Whey, creatina, pré-treino e vitaminas com compra 100% segura." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const perks = [
  { icon: ShieldCheck, title: "Compra segura", text: "SSL e checkout certificado" },
  { icon: Truck, title: "Entrega rápida", text: "Para todo o Brasil" },
  { icon: CreditCard, title: "Pix e cartão", text: "Parcele suas compras" },
  { icon: Award, title: "Procedência", text: "Produtos originais" },
];

function Index() {
  const { data: products, isLoading } = useQuery({ queryKey: ["products"], queryFn: () => fetchProducts(50) });

  return (
    <main>
      <section className="relative overflow-hidden bg-secondary">
        <img src={hero} alt="Atleta levantando barra no treino" width={1920} height={1088} className="absolute inset-0 h-full w-full object-cover object-right" />
        <div className="relative mx-auto flex min-h-[560px] max-w-7xl flex-col justify-center px-4 py-20 text-hero-foreground">
          <span className="mb-4 w-fit rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary-foreground">Nova coleção</span>
          <h1 className="max-w-xl font-display text-5xl uppercase leading-[0.95] md:text-7xl">
            Performance <span className="text-primary">sem limites</span>
          </h1>
          <p className="mt-6 max-w-md text-lg opacity-80">Suplementos de alta pureza para treinar mais forte e se recuperar melhor.</p>
          <Button size="lg" className="mt-8 w-fit rounded-full px-8" asChild>
            <a href="#produtos">Ver produtos</a>
          </Button>
        </div>
      </section>

      <section className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 md:grid-cols-4">
          {perks.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent"><Icon className="h-5 w-5" /></div>
              <div>
                <p className="font-bold">{title}</p>
                <p className="text-sm text-muted-foreground">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="produtos" className="mx-auto max-w-7xl scroll-mt-28 px-4 pt-20">
        <h2 className="font-display text-4xl uppercase md:text-5xl">Mais vendidos</h2>
        <p className="mt-2 text-muted-foreground">Escolha o suplemento ideal para o seu objetivo.</p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading &&
            Array.from({ length: 4 }).map((_, i) => <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-muted" />)}
          {!isLoading && products?.length === 0 && <p className="col-span-full text-muted-foreground">Nenhum produto encontrado.</p>}
          {products?.map((p) => <ProductCard key={p.node.id} product={p} />)}
        </div>
      </section>
    </main>
  );
}
