import { Link, useLocation } from "react-router-dom";

const links = [
  { to: "/",      label: "Home" },
  { to: "/users", label: "Users" },
  { to: "/chat",  label: "AI Agent" },
];

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
            A
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 leading-none">AgentFlow</p>
            <p className="text-[10px] text-gray-400 leading-none mt-0.5">User Management</p>
          </div>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {links.map((link) => {
            const active = pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
