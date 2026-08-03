// Type declarations for JS modules in stock-tracking
declare module './supabase-database' {
  import { SupabaseClient } from '@supabase/supabase-js';
  export const supabase: SupabaseClient;
}

declare module './homeApi' {
  export function getHomesWithProducts(): Promise<any[]>;
  export function addHome(name: string): Promise<any>;
  export function removeHome(id: number): Promise<void>;
  export function updateHomeName(id: number, name: string): Promise<void>;
  export function addProduct(homeId: number, data: any): Promise<any>;
  export function removeProduct(productId: number): Promise<void>;
  export function updateProduct(productId: number, fields: any): Promise<void>;
}
