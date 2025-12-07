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
    SELECT role, email, display_name FROM user_roles WHERE user_id = ${userId}
  `;
  
  // If user doesn't exist, create them with default role
  if (!result || result.length === 0) {
    // Try to get user details from Stack Auth if available
    let email: string | null = null;
    let displayName: string | null = null;
    
    try {
      const currentUser = await stackServerApp.getUser();
      if (currentUser && currentUser.id === userId) {
        email = currentUser.primaryEmail || null;
        displayName = currentUser.displayName || null;
      }
    } catch (error) {
      // User might not be authenticated in this context, that's okay
    }
    
    await setUserRole(userId, defaultRole, email, displayName);
    return defaultRole;
  }
  
  // User exists - update email/display_name if they're missing and we have current user data
  const existingUser = result[0] as { role: UserRole; email: string | null; display_name: string | null };
  if ((!existingUser.email || !existingUser.display_name)) {
    try {
      const currentUser = await stackServerApp.getUser();
      if (currentUser && currentUser.id === userId) {
        const emailToUpdate = existingUser.email || currentUser.primaryEmail || null;
        const displayNameToUpdate = existingUser.display_name || currentUser.displayName || null;
        if (emailToUpdate || displayNameToUpdate) {
          await setUserRole(userId, existingUser.role, emailToUpdate, displayNameToUpdate);
        }
      }
    } catch (error) {
      // Silently fail - user details will be updated on next login
    }
  }
  
  // User exists, return their role
  return existingUser.role;
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

