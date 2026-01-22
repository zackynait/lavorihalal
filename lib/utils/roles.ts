export const USER_ROLES = {
  ADMIN: "admin",
  ESPLORATORE: "esploratore",
  INTERVENTORE: "interventore",
  CONDOMINO: "condomino",
} as const

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES]

export const roleDisplayNames: Record<UserRole, string> = {
  admin: "Amministratore",
  esploratore: "Esploratore",
  interventore: "Interventore",
  condomino: "Condòmino",
}
