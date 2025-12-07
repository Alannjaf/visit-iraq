import { stackServerApp } from '@/stack';
import { getUserRole, setUserRole, isUserSuspended, sql, type UserRole } from './db';

// Check if the current request is from an admin using env credentials
export function isEnvAdmin(email: string, password: string): boolean {
  return (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  );
}

// Get the current user from Stack Auth
export async function getCurrentUser() {
  try {
    const user = await stackServerApp.getUser();
    return user;
  } catch {
    return null;
  }
}

// Get the current user with role information
export async function getCurrentUserWithRole() {
  const user = await getCurrentUser();
  if (!user) return null;

  const role = await getUserRole(user.id);
  const suspended = await isUserSuspended(user.id);

  return {
    ...user,
    role,
    isSuspended: suspended,
  };
}

// Ensure a user has a role in the database (called on first login)
export async function ensureUserRole(userId: string, defaultRole: UserRole = 'user') {
  // Check if user actually exists in database
  const result = await sql`
    SELECT role FROM user_roles WHERE user_id = ${userId}
  `;
  
  // If user doesn't exist, create them with default role
  if (!result || result.length === 0) {
    await setUserRole(userId, defaultRole);
    return defaultRole;
  }
  
  // User exists, return their role
  return (result[0]?.role as UserRole) || defaultRole;
}

// Check if current user is an admin
export async function isCurrentUserAdmin(): Promise<boolean> {
  const user = await getCurrentUserWithRole();
  return user?.role === 'admin';
}

// Check if current user is a host
export async function isCurrentUserHost(): Promise<boolean> {
  const user = await getCurrentUserWithRole();
  return user?.role === 'host' || user?.role === 'admin';
}

// Check if user can access protected content
export async function canAccessProtectedContent(): Promise<boolean> {
  const user = await getCurrentUser();
  return !!user;
}

// Role-based access control helper
export function hasPermission(userRole: UserRole, requiredRole: UserRole): boolean {
  const roleHierarchy: Record<UserRole, number> = {
    user: 1,
    host: 2,
    admin: 3,
  };
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

// Types for auth context
export interface AuthUser {
  id: string;
  email: string;
  displayName: string | null;
  role: UserRole;
  isSuspended: boolean;
}

