import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const stepConfig = {
  tool_call:      { icon: "🔧", label: "Tool Call",   bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-700" },
  tool_result:    { icon: "✅", label: "Tool Result", bg: "bg-green-50",  border: "border-green-200",  text: "text-green-700"  },
  final_response: { icon: "🏁", label: "Done",        bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700" },
};

function AgentSteps({ steps }) {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="mt-2 space-y-1.5">
      {steps.map((step, i) => {
        const cfg = stepConfig[step.type];
        if (!cfg) return null;
        return (
          <div key={i} className={`rounded-lg border p-2.5 ${cfg.bg} ${cfg.border}`}>
            <div className={`flex items-center gap-1.5 text-xs font-medium mb-1 ${cfg.text}`}>
              <span>{cfg.icon}</span>
              <span>{cfg.label}</span>
              {step.tool && (
                <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-gray-200 text-gray-600">
                  {step.tool}
                </span>
              )}
            </div>
            <pre className="text-xs text-gray-600 whitespace-pre-wrap font-mono leading-relaxed">
              {JSON.stringify(step.args ?? step.result, null, 2)}
            </pre>
          </div>
        );
      })}
    </div>
  );
}

export default function ChatMessage({ message }) {
  const [showLog, setShowLog] = useState(false);
  const isUser = message.role === "user";
  const hasSteps = message.agentSteps?.length > 0;

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} animate-[fadeSlideIn_0.22s_ease]`}>
      <div className={`max-w-[80%] ${isUser ? "order-2" : ""}`}>
        {/* Avatar */}
        <div className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : ""}`}>
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
              isUser ? "bg-blue-600 text-white" : "bg-gray-800 text-white"
            }`}
          >
            {isUser ? "U" : "AI"}
          </div>

          {/* Bubble */}
          <div
            className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
              isUser
                ? "bg-blue-600 text-white rounded-br-sm"
                : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm"
            }`}
          >
            {isUser ? (
              message.content
            ) : (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  table: (props) => (
                    <div className="overflow-x-auto my-2">
                      <table className="border-collapse w-full text-xs" {...props} />
                    </div>
                  ),
                  th: ({ children }) => (
                    <th className="border border-gray-300 px-3 py-1.5 bg-gray-50 font-semibold text-left text-gray-700">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="border border-gray-300 px-3 py-1.5 text-gray-600">
                      {children}
                    </td>
                  ),
                  ul: (props) => <ul className="list-disc list-inside space-y-0.5 my-1" {...props} />,
                  ol: (props) => <ol className="list-decimal list-inside space-y-0.5 my-1" {...props} />,
                  li: (props) => <li className="text-gray-700" {...props} />,
                  p: (props) => <p className="mb-1.5 last:mb-0" {...props} />,
                  strong: (props) => <strong className="font-semibold text-gray-900" {...props} />,
                  code: ({ children }) => (
                    <code className="bg-gray-100 text-purple-700 px-1 py-0.5 rounded font-mono text-xs">
                      {children}
                    </code>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            )}
          </div>
        </div>

        {/* Agent log toggle — only on assistant messages that ran tools */}
        {!isUser && hasSteps && (
          <div className="ml-9 mt-1">
            <button
              onClick={() => setShowLog((v) => !v)}
              className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors"
            >
              <span>{showLog ? "▲" : "▼"}</span>
              {showLog ? "Hide" : "Show"} agent log ({message.agentSteps.length} steps)
            </button>
            {showLog && (
              <div className="mt-2">
                <AgentSteps steps={message.agentSteps} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
