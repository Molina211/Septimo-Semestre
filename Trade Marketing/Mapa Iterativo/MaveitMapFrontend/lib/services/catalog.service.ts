import type { CatalogProductApi } from '../models/catalog-product.model';
import { apiFetch } from './api.client';

const CATALOG_ENDPOINT = '/api/catalog/products';

export async function listCatalogProducts(): Promise<CatalogProductApi[]> {
  return apiFetch<CatalogProductApi[]>(CATALOG_ENDPOINT);
}

export async function createCatalogProduct(payload: {
  name: string;
  basePrice: number;
}): Promise<CatalogProductApi> {
  return apiFetch<CatalogProductApi>(CATALOG_ENDPOINT, {
    method: 'POST',
    body: payload,
  });
}

export async function updateCatalogProduct(
  id: number,
  payload: { name: string; basePrice: number }
): Promise<CatalogProductApi> {
  return apiFetch<CatalogProductApi>(`${CATALOG_ENDPOINT}/${id}`, {
    method: 'PUT',
    body: payload,
  });
}

export async function deleteCatalogProduct(id: number): Promise<void> {
  await apiFetch<void>(`${CATALOG_ENDPOINT}/${id}?force=true`, {
    method: 'DELETE',
  });
}
