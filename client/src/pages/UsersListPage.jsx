import { useState } from "react";
import { Link } from "react-router-dom";
import { useUsers } from "../hooks/useUsers";

const STATUS_FILTERS = [
  { label: "All",      value: "" },
  { label: "Active",   value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
  { label: "Blocked",  value: "BLOCKED" },
];

const STATUS_STYLE = {
  ACTIVE:   { dot: "bg-green-500", badge: "bg-green-50 text-green-700 border-green-200",   label: "Active" },
  INACTIVE: { dot: "bg-gray-400",  badge: "bg-gray-50 text-gray-600 border-gray-200",      label: "Inactive" },
  BLOCKED:  { dot: "bg-red-500",   badge: "bg-red-50 text-red-700 border-red-200",         label: "Blocked" },
};

function StatusBadge({ status, blockReason }) {
  const s = STATUS_STYLE[status] ?? STATUS_STYLE.ACTIVE;
  return (
    <div>
      <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium border ${s.badge}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
        {s.label}
      </span>
      {status === "BLOCKED" && blockReason && (
        <p className="text-xs text-red-400 mt-0.5 max-w-[160px] truncate" title={blockReason}>
          {blockReason}
        </p>
      )}
    </div>
  );
}

function getPageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = [1];
  if (current > 3) pages.push("...");
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    pages.push(i);
  }
  if (current < total - 2) pages.push("...");
  pages.push(total);
  return pages;
}

export default function UsersListPage() {
  const [statusFilter, setStatusFilter] = useState("");
  const { users, total, totalPages, page, setPage, loading, error, refetch } = useUsers({
    limit: 10,
    status: statusFilter,
  });

  const from = total === 0 ? 0 : (page - 1) * 10 + 1;
  const to   = Math.min(page * 10, total);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Users</h1>
          {!loading && (
            <p className="text-sm text-gray-400 mt-0.5">
              {total} user{total !== 1 ? "s" : ""}{statusFilter ? ` · ${statusFilter.toLowerCase()}` : ""}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={refetch}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1.5"
          >
            ↻ Refresh
          </button>
          <Link
            to="/chat"
            className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
          >
            🤖 Manage via AI
          </Link>
        </div>
      </div>

      {/* Status filter tabs */}
      <div className="flex items-center gap-1 mb-4 bg-white border border-gray-200 rounded-xl p-1 w-fit">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value)}
            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              statusFilter === f.value
                ? "bg-gray-900 text-white"
                : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3 w-10">#</th>
              <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">Full Name</th>
              <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">Email</th>
              <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">Status</th>
              <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">Password</th>
              <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">Created At</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              [...Array(10)].map((_, i) => (
                <tr key={i} className="border-b border-gray-50">
                  <td className="px-5 py-3.5"><div className="h-3 bg-gray-100 rounded w-4 animate-pulse" /></td>
                  <td className="px-4 py-3.5"><div className="h-3 bg-gray-100 rounded w-32 animate-pulse" /></td>
                  <td className="px-4 py-3.5"><div className="h-3 bg-gray-100 rounded w-44 animate-pulse" /></td>
                  <td className="px-4 py-3.5"><div className="h-5 bg-gray-100 rounded-full w-20 animate-pulse" /></td>
                  <td className="px-4 py-3.5"><div className="h-5 bg-gray-100 rounded-full w-24 animate-pulse" /></td>
                  <td className="px-4 py-3.5"><div className="h-3 bg-gray-100 rounded w-20 animate-pulse" /></td>
                </tr>
              ))
            )}

            {!loading && !error && users.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-16 text-gray-400">
                  <p className="text-3xl mb-2">👤</p>
                  <p className="font-medium text-gray-500">
                    {statusFilter ? `No ${statusFilter.toLowerCase()} users` : "No users yet"}
                  </p>
                  {!statusFilter && (
                    <p className="text-xs mt-1">
                      <Link to="/chat" className="text-purple-500 hover:underline">
                        Ask the AI agent to create one
                      </Link>
                    </p>
                  )}
                </td>
              </tr>
            )}

            {!loading && users.map((user, index) => {
              const date = new Date(user.createdAt).toLocaleDateString("en-US", {
                month: "short", day: "numeric", year: "numeric",
              });
              const initials = user.fullName
                .split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

              return (
                <tr key={user._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5 text-gray-300 text-xs font-mono">
                    {(page - 1) * 10 + index + 1}
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                        {initials}
                      </div>
                      <span className="font-medium text-gray-800">{user.fullName}</span>
                    </div>
                  </td>

                  <td className="px-4 py-3.5 text-gray-500">{user.email}</td>

                  <td className="px-4 py-3.5">
                    <StatusBadge status={user.status ?? "ACTIVE"} blockReason={user.blockReason} />
                  </td>

                  <td className="px-4 py-3.5">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      user.isAutoPassword
                        ? "bg-purple-100 text-purple-700"
                        : "bg-blue-100 text-blue-700"
                    }`}>
                      {user.isAutoPassword ? "AI Generated" : "Manual"}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 text-gray-400">{date}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {error && (
          <p className="text-sm text-red-500 px-5 py-4">{error}</p>
        )}

        {/* Pagination footer */}
        {!loading && totalPages > 0 && (
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100 bg-gray-50">
            <p className="text-xs text-gray-400">
              {total === 0 ? "No results" : `Showing ${from}–${to} of ${total} users`}
            </p>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 1}
                className="px-2.5 py-1.5 text-xs rounded-md border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                ← Prev
              </button>

              {getPageNumbers(page, totalPages).map((p, i) =>
                p === "..." ? (
                  <span key={`ellipsis-${i}`} className="px-2 text-xs text-gray-400">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-7 text-xs rounded-md border transition-colors ${
                      p === page
                        ? "bg-blue-600 text-white border-blue-600 font-semibold"
                        : "border-gray-200 text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}

              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page === totalPages}
                className="px-2.5 py-1.5 text-xs rounded-md border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
