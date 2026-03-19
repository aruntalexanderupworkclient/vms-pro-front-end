/**
 * API Endpoints Configuration
 * ───────────────────────────
 * Single source of truth for all resource endpoint names.
 *
 * Each endpoint is an EndpointPair containing BOTH names:
 *   • `inMemory` — collection name in InMemoryDataService.createDb()
 *   • `api`      — real Web API controller route (PascalCase by C# convention)
 *
 * BaseApiService auto-switches based on environment.useInMemoryApi.
 *
 * Usage in service proxies:
 *   import { ApiEndpoints } from '../config';
 *   const EP = ApiEndpoints.Visitors;         // { inMemory: 'visitors', api: 'Visitors' }
 *   this.Get<T>(EP, 'GetAll', { page: 1 });   // BaseApiService picks the right name
 */

/**
 * Holds both the in-memory collection name and the real API controller name.
 * BaseApiService uses this to resolve the correct URL based on environment.
 */
export interface EndpointPair {
  readonly inMemory: string;
  readonly api: string;
}

// ── Endpoint definitions (single source of truth) ────────────────────

export const ApiEndpoints = {
  Visitors:      { inMemory: 'visitors',      api: 'Visitors' }      as EndpointPair,
  Tokens:        { inMemory: 'tokens',        api: 'Tokens' }        as EndpointPair,
  Employees:     { inMemory: 'employees',     api: 'Employees' }     as EndpointPair,
  Hosts:         { inMemory: 'hosts',         api: 'Hosts' }         as EndpointPair,
  Appointments:  { inMemory: 'appointments',  api: 'Appointments' }  as EndpointPair,
  Users:         { inMemory: 'users',         api: 'Users' }         as EndpointPair,
  Roles:         { inMemory: 'roles',         api: 'Roles' }         as EndpointPair,
  Permissions:   { inMemory: 'permissions',   api: 'Permissions' }   as EndpointPair,
  Organizations: { inMemory: 'organizations', api: 'Organizations' } as EndpointPair,
};
