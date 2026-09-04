import ChatInterface from "../components/ChatInterface";

const capabilities = [
  {
    icon: "➕",
    action: "Create",
    desc: 'e.g. "Add John Doe, john@example.com"',
  },
  {
    icon: "✏️",
    action: "Update",
    desc: 'e.g. "Change John\'s email to new@email.com"',
  },
  {
    icon: "🗑️",
    action: "Delete",
    desc: 'e.g. "Remove the user john@example.com"',
  },
  {
    icon: "🔍",
    action: "Look up",
    desc: 'e.g. "Find user named Sarah"',
  },
];

const agentSteps = [
  { icon: "💬", title: "You type naturally",      desc: "No forms — just describe what you want" },
  { icon: "🧠", title: "Agent reads intent",      desc: "Model extracts names, emails, actions from free text" },
  { icon: "🔀", title: "Agent decides tools",     desc: "Model CHOOSES which tools to call — no hardcoded logic" },
  { icon: "🔁", title: "Loop until done",         desc: "Agent observes each tool result and reasons about the next step" },
];

export default function CreateChatPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col h-[calc(100vh-64px)]">
      {/* Page title */}
      <div className="flex items-center gap-2 mb-5">
        <span className="text-2xl">🤖</span>
        <h1 className="text-2xl font-bold text-gray-900">AI Agent</h1>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 ml-1">
          Agentic AI
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 flex-1 min-h-0">
        {/* Left panel */}
        <div className="space-y-4 overflow-y-auto">
          {/* What it can do */}
          <div className="bg-purple-50 border border-purple-100 rounded-2xl p-5">
            <h3 className="font-bold text-purple-900 mb-3">What the agent can do</h3>
            <ul className="space-y-3">
              {capabilities.map((c) => (
                <li key={c.action} className="flex gap-2.5">
                  <span className="text-base leading-none mt-0.5">{c.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-purple-900">{c.action}</p>
                    <p className="text-xs text-purple-600 italic mt-0.5">{c.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* How it works */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <h3 className="font-bold text-gray-900 mb-3">How Agentic AI works</h3>
            <ol className="space-y-4">
              {agentSteps.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-base leading-none mt-0.5">{step.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{step.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{step.desc}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-xs text-gray-700 font-semibold mb-1">Key insight</p>
              <p className="text-xs text-gray-500">
                For a delete, the model calls <code className="bg-gray-200 px-1 rounded">find_user</code> first,
                then <code className="bg-gray-200 px-1 rounded">delete_user</code> — it reasons about
                the sequence, you don't hardcode it.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Chat */}
        <div className="min-h-0">
          <ChatInterface />
        </div>
      </div>
    </div>
  );
}
