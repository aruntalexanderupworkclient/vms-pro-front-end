/**
 * Enum Models
 * ──────────
 * DTOs for enum options fetched from the API.
 * These are used for populating dropdowns and select lists.
 */

/**
 * Represents a single enum option with id, value, and display label
 */
export interface EnumOptionDto {
  id: number;
  value: string;
  label: string;
}

/**
 * Represents a group of enum options with a descriptive name
 */
export interface EnumGroupDto {
  name: string;
  options: EnumOptionDto[];
}

/**
 * Represents all enum types grouped by their names
 * Used for the GET /api/Enums/All endpoint response
 */
export type AllEnumsDto = Record<string, EnumOptionDto[]>;
