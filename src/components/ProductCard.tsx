import { Link } from "@tanstack/react-router";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { type ShopifyProduct, formatPrice } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";

export function ProductCard({ product }: { product: ShopifyProduct }) {
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);
  const p = product.node;
  const variant = p.variants.edges[0]?.node;
  const img = p.images.edges[0]?.node;

  const add = async () => {
    if (!variant) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
    toast.success("Adicionado ao carrinho", { description: p.title, position: "top-center" });
  };

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-[var(--shadow-card)]">
      <Link to="/product/$handle" params={{ handle: p.handle }} className="block aspect-square overflow-hidden bg-muted">
        {img && (
          <img src={img.url} alt={img.altText ?? p.title} loading="lazy" width={1024} height={1024} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        {p.productType && <span className="text-xs font-semibold uppercase tracking-widest text-primary-strong">{p.productType}</span>}
        <Link to="/product/$handle" params={{ handle: p.handle }}>
          <h3 className="mt-1 text-lg font-bold leading-tight hover:underline">{p.title}</h3>
        </Link>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{p.description}</p>
        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="text-xl font-extrabold">{formatPrice(p.priceRange.minVariantPrice.amount, p.priceRange.minVariantPrice.currencyCode)}</span>
          <Button onClick={add} disabled={isLoading || !variant?.availableForSale} size="sm" className="rounded-full">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Plus className="h-4 w-4" />Adicionar</>}
          </Button>
        </div>
      </div>
    </article>
  );
}
