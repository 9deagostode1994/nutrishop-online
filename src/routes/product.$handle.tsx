import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft, Loader2, ShieldCheck, Truck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { fetchProduct, formatPrice } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";

export const Route = createFileRoute("/product/$handle")({
  head: ({ params }) => {
    const name = params.handle.replace(/-/g, " ");
    return {
      meta: [
        { title: `${name} | Vigor Suplementos` },
        { name: "description", content: `Compre ${name} na Vigor Suplementos com pagamento seguro e entrega para todo o Brasil.` },
        { property: "og:title", content: `${name} | Vigor Suplementos` },
        { property: "og:description", content: `Compre ${name} com compra 100% segura.` },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { handle } = Route.useParams();
  const { data: product, isLoading } = useQuery({ queryKey: ["product", handle], queryFn: () => fetchProduct(handle) });
  const [variantIdx, setVariantIdx] = useState(0);
  const [imgIdx, setImgIdx] = useState(0);
  const addItem = useCartStore((s) => s.addItem);
  const cartLoading = useCartStore((s) => s.isLoading);

  if (isLoading) return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  if (!product)
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center">
        <p className="text-xl font-bold">Produto não encontrado</p>
        <Link to="/" className="mt-4 inline-block underline">Voltar à loja</Link>
      </div>
    );

  const p = product.node;
  const variants = p.variants.edges.map((e) => e.node);
  const variant = variants[variantIdx];
  const images = p.images.edges.map((e) => e.node);
  const hasOptions = variants.length > 1;

  const add = async () => {
    if (!variant) return;
    await addItem({ product, variantId: variant.id, variantTitle: variant.title, price: variant.price, quantity: 1, selectedOptions: variant.selectedOptions });
    toast.success("Adicionado ao carrinho", { description: p.title, position: "top-center" });
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>
      <div className="grid gap-12 md:grid-cols-2">
        <div>
          <div className="aspect-square overflow-hidden rounded-2xl bg-muted">
            {images[imgIdx] && <img src={images[imgIdx].url} alt={images[imgIdx].altText ?? p.title} className="h-full w-full object-cover" />}
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-2">
              {images.map((im, i) => (
                <button key={im.url} onClick={() => setImgIdx(i)} className={`h-16 w-16 overflow-hidden rounded-lg border-2 ${i === imgIdx ? "border-primary" : "border-transparent"}`}>
                  <img src={im.url} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div>
          {p.productType && <span className="text-xs font-semibold uppercase tracking-widest text-primary-strong">{p.productType}</span>}
          <h1 className="mt-2 font-display text-4xl uppercase leading-tight">{p.title}</h1>
          <p className="mt-4 text-3xl font-extrabold">{variant && formatPrice(variant.price.amount, variant.price.currencyCode)}</p>
          <p className="mt-6 leading-relaxed text-muted-foreground">{p.description}</p>

          {hasOptions && (
            <div className="mt-8">
              <p className="mb-3 text-sm font-semibold">{p.options[0]?.name}</p>
              <div className="flex flex-wrap gap-2">
                {variants.map((v, i) => (
                  <Button key={v.id} variant={i === variantIdx ? "default" : "outline"} className="rounded-full" onClick={() => setVariantIdx(i)} disabled={!v.availableForSale}>
                    {v.title}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <Button size="lg" className="mt-8 w-full rounded-full" onClick={add} disabled={cartLoading || !variant?.availableForSale}>
            {cartLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : variant?.availableForSale ? "Adicionar ao carrinho" : "Esgotado"}
          </Button>

          <div className="mt-8 space-y-3 rounded-2xl border border-border p-5 text-sm">
            <p className="flex items-center gap-3"><ShieldCheck className="h-5 w-5" /> Pagamento 100% seguro e criptografado</p>
            <p className="flex items-center gap-3"><Truck className="h-5 w-5" /> Entrega para todo o Brasil</p>
          </div>

          <div className="mt-10">
            <h2 className="text-lg font-bold">Avaliações</h2>
            <p className="mt-2 text-sm text-muted-foreground">Ainda não há avaliações para este produto.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
