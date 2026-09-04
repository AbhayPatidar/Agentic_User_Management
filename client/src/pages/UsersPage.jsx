import { Link } from "react-router-dom";

const features = [
  { icon: "➕", label: "Create users",    desc: "Tell the agent a name and email — it handles password generation, DB save, and welcome email." },
  { icon: "✏️", label: "Update users",    desc: "Ask to change a name or email. The agent finds the user first, then applies the change." },
  { icon: "🗑️", label: "Delete users",    desc: "Ask to remove someone. The agent locates them and soft-deletes the record." },
  { icon: "🔍", label: "Look up users",   desc: "Ask about a specific person by name or email." },
  { icon: "🔒", label: "Change status",   desc: "Activate, deactivate, or block a user. Blocking requires a reason — the agent enforces it." },
];

export default function UsersPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-100 text-purple-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
          <span>🤖</span> Agentic AI Demo
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          User Management via AI Agent
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          All CRUD operations are handled through natural language. No forms — just tell the
          AI agent what you want and it reasons, picks tools, and gets it done.
        </p>
        <div className="flex items-center justify-center gap-3 mt-6">
          <Link
            to="/chat"
            className="px-6 py-3 bg-purple-600 text-white text-sm font-semibold rounded-xl hover:bg-purple-700 transition-colors"
          >
            Open AI Agent →
          </Link>
          <Link
            to="/users"
            className="px-6 py-3 bg-white text-gray-700 text-sm font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            View Users
          </Link>
        </div>
      </div>

      {/* Feature grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
        {features.map((f) => (
          <div key={f.label} className="bg-white rounded-2xl border border-gray-200 p-5 flex gap-4">
            <span className="text-2xl flex-shrink-0">{f.icon}</span>
            <div>
              <p className="font-semibold text-gray-900 mb-1">{f.label}</p>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div className="bg-gray-900 rounded-2xl p-7 text-white">
        <h2 className="font-bold text-lg mb-1">What makes it "agentic"</h2>
        <p className="text-gray-400 text-sm mb-6">
          Traditional code runs a fixed sequence. An agent <em>reasons</em> about the goal and decides the sequence itself.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
          <div className="bg-white/5 rounded-xl p-4">
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-2">Traditional (hardcoded)</p>
            <pre className="text-green-400 text-xs leading-relaxed">{`if (!password) generatePassword()
saveToDatabase()
sendEmail()`}</pre>
            <p className="text-gray-500 text-xs mt-2">Order is fixed in code — no reasoning.</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-2">Agentic (model decides)</p>
            <pre className="text-purple-400 text-xs leading-relaxed">{`Goal → "delete john doe"
Model: find_user("john doe") → [userId]
Model: delete_user(userId)
Model: "Done, John was deleted."`}</pre>
            <p className="text-gray-500 text-xs mt-2">Model picks tools based on intent.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
