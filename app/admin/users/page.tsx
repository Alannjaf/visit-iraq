"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button, Badge, Select } from "@/components/ui";
import { formatDate } from "@/lib/utils";
import type { UserRole } from "@/lib/db";

interface User {
  user_id: string;
  role: UserRole;
  is_suspended: boolean;
  created_at: Date;
  email?: string;
  displayName?: string | null;
}

export default function AdminUsersPage() {
  const searchParams = useSearchParams();
  const roleFilter = searchParams.get("role") as UserRole | null;

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const fetchUsers = async () => {
    try {
      const url = roleFilter
        ? `/api/admin/users?role=${roleFilter}`
        : "/api/admin/users";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setUsers(data.users);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    setActionLoading(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) throw new Error("Failed to update");
      await fetchUsers();
    } catch (error) {
      console.error(error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleSuspend = async (userId: string, suspend: boolean) => {
    setActionLoading(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_suspended: suspend }),
      });
      if (!res.ok) throw new Error("Failed to update");
      await fetchUsers();
    } catch (error) {
      console.error(error);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--foreground)]">Users</h1>
        <p className="text-[var(--foreground-muted)] mt-2">
          Manage user roles and access
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-[var(--border)] p-4 mb-6">
        <div className="flex gap-2">
          <Link
            href="/admin/users"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              !roleFilter
                ? "bg-[var(--primary)] text-white"
                : "bg-[var(--background-alt)] text-[var(--foreground-muted)] hover:bg-[var(--border)]"
            }`}
          >
            All Users
          </Link>
          <Link
            href="/admin/users?role=host"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              roleFilter === "host"
                ? "bg-[var(--primary)] text-white"
                : "bg-[var(--background-alt)] text-[var(--foreground-muted)] hover:bg-[var(--border)]"
            }`}
          >
            Hosts
          </Link>
          <Link
            href="/admin/users?role=user"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              roleFilter === "user"
                ? "bg-[var(--primary)] text-white"
                : "bg-[var(--background-alt)] text-[var(--foreground-muted)] hover:bg-[var(--border)]"
            }`}
          >
            Users
          </Link>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-[var(--border)] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-[var(--background-alt)] flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[var(--foreground-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-[var(--foreground-muted)]">No users found</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-[var(--background-alt)]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {users.map((user) => (
                <tr key={user.user_id} className="hover:bg-[var(--background-alt)] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center text-white font-bold">
                        {(user.displayName?.[0] || user.email?.[0]?.toUpperCase() || user.user_id.slice(0, 2).toUpperCase())}
                      </div>
                      <div>
                        <p className="font-medium text-[var(--foreground)]">
                          {user.displayName || (user.email && user.email !== "No email" && user.email !== "Unknown" ? user.email : "User")}
                        </p>
                        <p className="text-sm text-[var(--foreground-muted)]">
                          {user.email && user.email !== "No email" && user.email !== "Unknown" ? (
                            user.email
                          ) : (
                            <span className="font-mono">{user.user_id.slice(0, 8)}...</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.user_id, e.target.value as UserRole)}
                      options={[
                        { value: "user", label: "User" },
                        { value: "host", label: "Host" },
                        { value: "admin", label: "Admin" },
                      ]}
                      className="w-32"
                      disabled={actionLoading === user.user_id}
                    />
                  </td>
                  <td className="px-6 py-4">
                    {user.is_suspended ? (
                      <Badge variant="rejected">Suspended</Badge>
                    ) : (
                      <Badge variant="approved">Active</Badge>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-[var(--foreground-muted)]">
                      {formatDate(user.created_at)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {user.is_suspended ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSuspend(user.user_id, false)}
                        isLoading={actionLoading === user.user_id}
                      >
                        Unsuspend
                      </Button>
                    ) : (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleSuspend(user.user_id, true)}
                        isLoading={actionLoading === user.user_id}
                      >
                        Suspend
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

