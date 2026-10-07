import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingBag, Minus, Plus, Trash2, Lock, Loader2 } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice } from "@/lib/shopify";

export const CartDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { items, isLoading, isSyncing, updateQuantity, removeItem, getCheckoutUrl, syncCart } = useCartStore();
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (isOpen) syncCart();
  }, [isOpen, syncCart]);

  const totalItems = mounted ? items.reduce((s, i) => s + i.quantity, 0) : 0;
  const totalPrice = items.reduce((s, i) => s + parseFloat(i.price.amount) * i.quantity, 0);
  const currency = items[0]?.price.currencyCode || "BRL";

  const handleCheckout = () => {
    const url = getCheckoutUrl();
    if (url) {
      window.open(url, "_blank");
      setIsOpen(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative rounded-full" aria-label="Abrir carrinho">
          <ShoppingBag className="h-5 w-5" />
          {totalItems > 0 && (
            <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-bold text-primary-foreground">
              {totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex h-full w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-display text-2xl uppercase">Seu carrinho</SheetTitle>
          <SheetDescription>
            {totalItems === 0 ? "Seu carrinho está vazio" : `${totalItems} ${totalItems === 1 ? "item" : "itens"}`}
          </SheetDescription>
        </SheetHeader>
        <div className="flex min-h-0 flex-1 flex-col px-4 pb-4">
          {items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center text-muted-foreground">
              <ShoppingBag className="mb-3 h-12 w-12" />
              Adicione produtos para começar.
            </div>
          ) : (
            <>
              <div className="min-h-0 flex-1 space-y-4 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.variantId} className="flex gap-3 rounded-lg border border-border p-2">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                      {item.product.node.images?.edges?.[0]?.node && (
                        <img src={item.product.node.images.edges[0].node.url} alt={item.product.node.title} className="h-full w-full object-cover" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate font-semibold">{item.product.node.title}</h4>
                      {item.variantTitle !== "Default Title" && (
                        <p className="text-sm text-muted-foreground">{item.selectedOptions.map((o) => o.value).join(" • ")}</p>
                      )}
                      <p className="font-bold">{formatPrice(item.price.amount, item.price.currencyCode)}</p>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeItem(item.variantId)} aria-label="Remover">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                      <div className="flex items-center gap-1">
                        <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.variantId, item.quantity - 1)} aria-label="Diminuir">
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-6 text-center text-sm">{item.quantity}</span>
                        <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.variantId, item.quantity + 1)} aria-label="Aumentar">
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-3 border-t border-border pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">Subtotal</span>
                  <span className="text-xl font-bold">{formatPrice(totalPrice, currency)}</span>
                </div>
                <Button onClick={handleCheckout} className="w-full" size="lg" disabled={isLoading || isSyncing}>
                  {isLoading || isSyncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Lock className="mr-2 h-4 w-4" />Finalizar compra segura</>}
                </Button>
                <p className="text-center text-xs text-muted-foreground">Pagamento criptografado • Pix, cartão e boleto</p>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
