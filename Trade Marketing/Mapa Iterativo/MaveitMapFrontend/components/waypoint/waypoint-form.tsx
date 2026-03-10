'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import type { ProductSale } from '@/lib/models/waypoint.model';
import type { CatalogProductApi } from '@/lib/models/catalog-product.model';
import { X, Plus, Trash2, Save, MapPin } from 'lucide-react';
import { toBogotaLocalInputValue } from '@/lib/utils/time-utils';

interface WaypointFormProps {
  lng: number;
  lat: number;
  waypointId?: number;
  title?: string;
  initialData?: {
    name?: string;
    label?: string;
    dateTime?: string;
    products?: ProductSale[];
  };
  entryId?: string | number;
  onSave: (data: {
    id?: string;
    name: string;
    label: string;
    lng: number;
    lat: number;
    totalSales: number;
    dateTime: string;
    products: ProductSale[];
    entryId?: string;
  }) => void;
  onCancel: () => void;
  mode?: 'new' | 'group' | 'point';
  pricePresets?: Record<string, number[]>;
  catalogProducts?: CatalogProductApi[];
  contextSignature?: string;
}

const defaultProducts = (): ProductSale[] => [
  {
    id: crypto.randomUUID(),
    productId: undefined,
    product: null,
    productName: '',
    quantity: 0,
    unitPrice: 0,
    priceSource: 'custom',
  },
];

export default function WaypointForm({
  lng,
  lat,
  waypointId,
  title,
  initialData,
  entryId,
  onSave,
  onCancel,
  mode: formMode = 'new',
  pricePresets,
  catalogProducts = [],
  contextSignature,
}: WaypointFormProps) {
  const isGroupMode = formMode === 'group';
  const isPointMode = formMode === 'point';
  const isNewPointMode = formMode === 'new';
  const priceMap = useMemo(() => pricePresets ?? {}, [pricePresets]);
  const catalogProductMap = useMemo(
    () => new Map(catalogProducts.map((product) => [String(product.id), product])),
    [catalogProducts]
  );
  const headerTitle = title ?? 'Nuevo Punto de Venta';
  const [name, setName] = useState(initialData?.name ?? '');
  const [label, setLabel] = useState(initialData?.label ?? '');
  const [dateTime, setDateTime] = useState(() => toBogotaLocalInputValue(initialData?.dateTime));
  const resolveBasePrice = useCallback(
    (product?: ProductSale) => {
      if (!product) return 0;
      if (product.product?.basePrice) return product.product.basePrice;
      if (product.productId) {
        const catalogProduct = catalogProductMap.get(String(product.productId));
        if (catalogProduct) return catalogProduct.basePrice;
      }
      if (product.productName) {
        return priceMap[product.productName]?.[0] ?? 0;
      }
      return 0;
    },
    [catalogProductMap, priceMap]
  );
  const toProductState = useCallback(
    (product: ProductSale): ProductSale => {
      const priceSource = product.priceSource ?? 'custom';
      const basePrice = resolveBasePrice(product);
      if (priceSource === 'base') {
        return { ...product, priceSource, unitPrice: basePrice };
      }
      return {
        ...product,
        priceSource,
        unitPrice: product.unitPrice > 0 ? product.unitPrice : basePrice,
      };
    },
    [resolveBasePrice]
  );
  const [products, setProducts] = useState<ProductSale[]>(
    initialData?.products && initialData.products.length > 0
      ? initialData.products.map((product) => toProductState(product))
      : defaultProducts()
  );
  const [removedProductIds, setRemovedProductIds] = useState<number[]>([]);

  const addProduct = useCallback(() => {
    setProducts((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        productId: undefined,
        product: null,
        productName: '',
        quantity: 0,
        unitPrice: 0,
        priceSource: 'custom',
      },
    ]);
  }, []);

  const removeProduct = useCallback((id: string) => {
    setProducts((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target?.productId) {
        setRemovedProductIds((list) => [...list, target.productId!]);
      }
      return prev.filter((p) => p.id !== id);
    });
  }, []);

  const updateProduct = useCallback(
    (id: string, field: keyof ProductSale, value: string | number) => {
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id !== id) return p;
          if (field === 'productId') {
            const selectedId =
              value === '' || value === undefined ? undefined : Number(value);
            const selectedProduct =
              selectedId !== undefined && !Number.isNaN(selectedId)
                ? catalogProductMap.get(String(selectedId)) ?? null
                : null;
            const basePrice = selectedProduct?.basePrice ?? 0;
            const unitPrice =
              p.priceSource === 'base' ? basePrice : p.unitPrice || basePrice;
            return {
              ...p,
              productId: selectedProduct?.id,
              product: selectedProduct,
              productName: selectedProduct?.name ?? '',
              unitPrice: selectedProduct ? unitPrice : 0,
            };
          }
          return { ...p, [field]: value };
        })
      );
    },
    [catalogProductMap]
  );

  const updateProductPriceSource = useCallback(
    (id: string, source: 'base' | 'custom') => {
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id !== id) return p;
          const basePrice = resolveBasePrice(p);
          const unitPrice = source === 'base' ? basePrice : p.unitPrice || basePrice;
          return { ...p, priceSource: source, unitPrice };
        })
      );
    },
    [resolveBasePrice]
  );

  const shouldShowProducts = !isPointMode;
  const initialProductsSignature = initialData?.products
    ? initialData.products
        .map((product) => `${product.productName}-${product.quantity}-${product.unitPrice}`)
        .join('|')
    : '';

  useEffect(() => {
    if (!shouldShowProducts) return;
    if (initialData?.products && initialData.products.length > 0) {
      setProducts(initialData.products.map((product) => toProductState(product)));
      return;
    }
    if (isGroupMode || isNewPointMode) {
      setProducts(defaultProducts());
    }
  }, [initialProductsSignature, shouldShowProducts, isGroupMode, isNewPointMode, toProductState]);

  useEffect(() => {
    if (initialData?.dateTime) {
    setDateTime(toBogotaLocalInputValue(initialData.dateTime));
      return;
    }
    setDateTime(toBogotaLocalInputValue());
  }, [contextSignature, initialData?.dateTime]);
  const filteredProducts = shouldShowProducts
    ? products.filter((p) => p.productName && p.quantity > 0)
    : [];
  const totalSales = filteredProducts.reduce((sum, p) => sum + p.quantity * p.unitPrice, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const resolvedName = isGroupMode ? (initialData?.name ?? name).trim() : name.trim();
    const resolvedLabel = isGroupMode
      ? (initialData?.label ?? label).trim() || resolvedName
      : (label.trim() || resolvedName);

    const removedPayloads = removedProductIds.map((productId) => ({
      productId,
      product: catalogProductMap.get(String(productId)) ?? null,
      productName: catalogProductMap.get(String(productId))?.name ?? '',
      quantity: 0,
      unitPrice: 0,
      priceSource: 'custom' as const,
      active: false,
    }));
    onSave({
      name: resolvedName,
      label: resolvedLabel,
      id: waypointId,
      lng,
      lat,
      totalSales,
      dateTime,
      products: [...filteredProducts, ...removedPayloads],
      entryId,
    });
  };

  return (
    <div className="absolute top-0 right-0 z-20 h-full w-full max-w-md">
      <div className="flex h-full flex-col border-l border-border bg-card/95 shadow-2xl backdrop-blur-md">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15">
              <MapPin className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">{headerTitle}</h3>
              <p className="text-xs text-muted-foreground">
                {lat.toFixed(4)}, {lng.toFixed(4)}
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Cerrar formulario"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 space-y-4 overflow-y-auto p-5">
            {/* Name */}
            <div>
              <label htmlFor="wp-name" className="mb-1.5 block text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Nombre del punto
              </label>
              <input
                id="wp-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Sucursal Centro"
                className={`w-full rounded-lg border border-border bg-input px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary ${isGroupMode ? 'cursor-not-allowed opacity-70' : ''}`}
                required
                disabled={isGroupMode}
              />
            </div>

            {/* Label */}
            <div>
              <label htmlFor="wp-label" className="mb-1.5 block text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Etiqueta
              </label>
              <input
                id="wp-label"
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Ej: Centro"
                className={`w-full rounded-lg border border-border bg-input px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary ${isGroupMode ? 'cursor-not-allowed opacity-70' : ''}`}
                disabled={isGroupMode}
              />
            </div>

            {/* Date */}
            <div>
            <label htmlFor="wp-datetime" className="mb-1.5 block text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Fecha y hora
            </label>
            <input
              id="wp-datetime"
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              className={`w-full rounded-lg border border-border bg-input px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary ${!(isPointMode || isGroupMode || isNewPointMode) ? 'cursor-not-allowed opacity-70' : ''}`}
              disabled={!(isPointMode || isGroupMode || isNewPointMode)}
              aria-disabled={!(isPointMode || isGroupMode || isNewPointMode)}
            />
            </div>

            {/* Products */}
            {shouldShowProducts && (
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Productos vendidos
                  </label>
                  <button
                    type="button"
                    onClick={addProduct}
                    className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
                  >
                    <Plus className="h-3 w-3" />
                    Agregar
                  </button>
                </div>

                <div className="space-y-3">
                  {products.map((product, idx) => {
                    const hasSelection = Boolean(product.productId);
                    const quantityValue = hasSelection ? product.quantity : 0;
                    const basePrice = resolveBasePrice(product);
                    const priceInputValue = hasSelection ? product.unitPrice : 0;
                    const subtotalValue = quantityValue * priceInputValue;
                    const isCustomPrice = hasSelection && product.priceSource === 'custom';

                    return (
                      <div
                        key={product.id}
                        className="rounded-lg border border-border bg-secondary/30 p-3"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-xs font-medium text-muted-foreground">
                            Producto {idx + 1}
                          </span>
                          {products.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeProduct(product.id)}
                              className="rounded p-1 text-destructive/70 transition-colors hover:bg-destructive/10 hover:text-destructive"
                              aria-label="Eliminar producto"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                        <select
                          value={product.productId?.toString() ?? ''}
                          onChange={(e) => {
                            const selectedValue = e.target.value;
                            updateProduct(product.id, 'productId', selectedValue);
                          }}
                          disabled={!catalogProducts.length}
                          className="mb-2 w-full rounded-md border border-border bg-input px-2.5 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <option value="">
                            {catalogProducts.length === 0
                              ? 'Cargando productos...'
                              : 'Seleccionar producto...'}
                          </option>
                          {catalogProducts.map((catalogProduct) => (
                            <option key={catalogProduct.id} value={catalogProduct.id}>
                              {catalogProduct.name}
                            </option>
                          ))}
                        </select>

                        <div className="flex gap-2">
                          <div className="flex-1">
                            <label className="mb-1 block text-xs text-muted-foreground">Cantidad</label>
                            <input
                              type="number"
                              min={0}
                              value={quantityValue}
                              onChange={(e) =>
                                updateProduct(product.id, 'quantity', parseInt(e.target.value) || 0)
                              }
                              disabled={!hasSelection}
                              className="w-full rounded-md border border-border bg-input/60 px-2.5 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                              placeholder="0"
                            />
                            <span className="mt-2 block text-xs font-medium text-muted-foreground">Subtotal</span>
                            <div className="mt-1 w-full rounded-md border border-dashed border-border/70 bg-secondary/40 px-3 py-2 text-right text-sm font-medium text-foreground">
                              ${subtotalValue.toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </div>
                          </div>
                          <div className="flex-1 space-y-1">
                            <label className="mb-1 block text-xs text-muted-foreground">
                              Tipo de precio
                            </label>
                            <select
                              value={product.priceSource}
                              onChange={(e) => {
                                const nextValue = e.target.value as 'base' | 'custom';
                                updateProductPriceSource(product.id, nextValue);
                              }}
                              disabled={!hasSelection}
                              className={`mb-2 h-9 w-full rounded-md border border-border px-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary ${
                                !hasSelection ? 'bg-input/60 text-muted-foreground/80' : 'bg-input text-primary'
                              }`}
                            >
                              <option value="base">
                                Precio base ${basePrice.toLocaleString('en-US', {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </option>
                              <option value="custom">Personalizado</option>
                            </select>
                            <span className="mb-1 block text-xs font-medium text-muted-foreground">
                              Precio personalizado
                            </span>
                            <input
                              type="number"
                              min={0}
                              step={0.01}
                              value={priceInputValue}
                              onChange={(e) => {
                                updateProduct(
                                  product.id,
                                  'unitPrice',
                                  parseFloat(e.target.value) || 0
                                );
                              }}
                              className="w-full rounded-md border border-border bg-input px-2.5 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                              placeholder="$0.00"
                              disabled={!hasSelection || !isCustomPrice}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Footer with total & save */}
          <div className="border-t border-border px-5 py-4">
            {!isPointMode && (
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Total Ventas</span>
                <span className="text-xl font-bold text-accent">
                  ${totalSales.toLocaleString()}
                </span>
              </div>
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!name.trim()}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                Guardar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
