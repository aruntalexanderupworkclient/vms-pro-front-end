/**
 * Service Proxies – Barrel Export
 * ───────────────────────────────
 * Import all service proxies from this single entry point:
 *
 *   import { VisitorServiceProxy, TokenServiceProxy } from './core/service-proxies';
 *
 * Import all models (interfaces/classes) from:
 *
 *   import { Visitor, Token, User } from './core/models';
 *
 * All HTTP calls go through BaseApiService using the
 *   (EndpointPair, action, inputParams?) pattern.
 * EndpointPair is resolved from ApiEndpoints (centralized config).
 * Base URL is sourced from environment.apiUrl.
 */

// ── Config (re-exported for convenience) ─────────────────────────────
export { ApiEndpoints, EndpointPair } from '../config';

// ── Models (re-exported for backward compatibility) ──────────────────
export { ApiResponse, PagedResult, Visitor, Token, Employee, Host, Appointment, User, UserStatus, Role, Permission, Organization } from '../models';

// ── Service Proxies ──────────────────────────────────────────────────
export { BaseApiService } from './base-api.service';
export { VisitorServiceProxy } from './visitor-service-proxy';
export { TokenServiceProxy } from './token-service-proxy';
export { EmployeeServiceProxy } from './employee-service-proxy';
export { HostServiceProxy } from './host-service-proxy';
export { AppointmentServiceProxy } from './appointment-service-proxy';
export { UserServiceProxy } from './user-service-proxy';
export { RoleServiceProxy } from './role-service-proxy';
export { PermissionServiceProxy } from './permission-service-proxy';
export { OrganizationServiceProxy } from './organization-service-proxy';
