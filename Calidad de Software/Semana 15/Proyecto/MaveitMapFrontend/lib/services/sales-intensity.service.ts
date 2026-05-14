'use client';

import type { SalesIntensitySettings } from '@/lib/models/waypoint.model';
import { apiFetch } from './api.client';

const INTENSITY_SETTINGS_ENDPOINT = '/api/settings/intensity';

export async function getSalesIntensitySettings(): Promise<SalesIntensitySettings> {
  return apiFetch<SalesIntensitySettings>(INTENSITY_SETTINGS_ENDPOINT);
}

export async function updateSalesIntensitySettings(
  payload: SalesIntensitySettings
): Promise<SalesIntensitySettings> {
  return apiFetch<SalesIntensitySettings>(INTENSITY_SETTINGS_ENDPOINT, {
    method: 'PUT',
    body: payload,
  });
}
