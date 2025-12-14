export class UserModel {
  userId!: number;
  email!: string;
  fullName!: string;
  avatarUrl!: string;
  isActive!: boolean;
  createdAt!: string;
  updatedAt!: string;
  roles?: RoleModel[];

  constructor(init?: Partial<UserModel>) {
    Object.assign(this, init);
  }
}

export interface FeedbackModel {
  id: number;
  content: string;
  // ... other feedback properties
}

export interface WishlistItemModel {
  id: number;
  // ... wishlist item properties
}

export interface RoleModel {
  roleId: number;
  roleName: string;
  // ... other role properties
}

export interface OrderModel {
  id: number;
  // ... order properties
}

export interface Student {
  id: number;
  name: string;
  avatarUrl: string;
}