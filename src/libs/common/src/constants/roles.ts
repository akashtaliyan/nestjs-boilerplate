// Roles COnstants
// customer, crew, office, partner & owner
export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  CUSTOMER: 'CUSTOMER',
  CREW: 'CREW',
  OFFICE: 'OFFICE',
  PARTNER: 'PARTNER',
  OWNER: 'OWNER',
};

export interface ITokenPayload {
  username: string;
  sub: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
}
