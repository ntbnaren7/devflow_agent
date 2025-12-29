import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Code2, ArrowLeft } from 'lucide-react';
import { ChatMessage, Blueprint, ProjectIntake, Pipeline } from '../types';
import ReactMarkdown from 'react-markdown';

interface ChatInterfaceProps {
  initialContext: {
    intake: ProjectIntake;
    pipeline: Pipeline;
    blueprint: Blueprint;
  };
  onSendMessage: (history: ChatMessage[], message: string, context: string) => Promise<string>;
  onBack: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ initialContext, onSendMessage, onBack }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: 'model', 
      content: "I'm ready to help you implement. Ask me to generate boilerplate code, config files, or explain specific parts of the blueprint." 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = input;
    setInput('');
    const newHistory: ChatMessage[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(newHistory);
    setIsTyping(true);

    try {
        const contextString = JSON.stringify(initialContext);
        const response = await onSendMessage(newHistory, userMessage, contextString);
        setMessages(prev => [...prev, { role: 'model', content: response }]);
    } catch (error) {
        setMessages(prev => [...prev, { role: 'model', content: "Sorry, I encountered an error processing your request." }]);
    } finally {
        setIsTyping(false);
    }
  };

  return (
    <div className="h-[calc(100vh-200px)] flex flex-col bg-dark-surface border border-dark-border rounded-2xl overflow-hidden animate-fade-in max-w-5xl mx-auto shadow-2xl">
      <div className="bg-dark-bg/50 border-b border-dark-border p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
             <button 
                onClick={onBack}
                className="p-2 hover:bg-dark-bg rounded-lg text-dark-muted hover:text-dark-text transition-all duration-200 hover:scale-105 active:scale-95"
                title="Back to Blueprint"
            >
                <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="p-2 bg-brand-500/20 rounded-lg">
                <Code2 className="w-5 h-5 text-brand-500" />
            </div>
            <div>
                <h3 className="text-dark-text font-medium">Implementation Assistant</h3>
                <p className="text-xs text-dark-muted">Context-aware coding help</p>
            </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-scale-in`}>
            {msg.role === 'model' && (
              <div className="w-8 h-8 rounded-full bg-brand-900/50 flex items-center justify-center shrink-0 border border-brand-500/30">
                <Bot className="w-4 h-4 text-brand-400" />
              </div>
            )}
            
            <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
              msg.role === 'user' 
                ? 'bg-brand-600 text-white' 
                : 'bg-dark-bg border border-dark-border text-dark-text'
            }`}>
              <ReactMarkdown
                 components={{
                    p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                    code: ({node, ...props}) => <code className="bg-black/20 px-1 rounded text-sm font-mono" {...props} />,
                    pre: ({node, ...props}) => <pre className="bg-black/40 p-3 rounded-lg overflow-x-auto text-xs my-2 font-mono border border-white/10" {...props} />,
                }}
              >
                {msg.content}
              </ReactMarkdown>
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-dark-border flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-dark-muted" />
              </div>
            )}
          </div>
        ))}
        {isTyping && (
           <div className="flex gap-3 justify-start animate-fade-in">
             <div className="w-8 h-8 rounded-full bg-brand-900/50 flex items-center justify-center shrink-0 border border-brand-500/30">
                <Bot className="w-4 h-4 text-brand-400" />
              </div>
              <div className="bg-dark-bg border border-dark-border rounded-2xl p-4 flex items-center gap-1">
                 <span className="w-1.5 h-1.5 bg-dark-muted rounded-full animate-bounce"></span>
                 <span className="w-1.5 h-1.5 bg-dark-muted rounded-full animate-bounce delay-75"></span>
                 <span className="w-1.5 h-1.5 bg-dark-muted rounded-full animate-bounce delay-150"></span>
              </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-4 bg-dark-bg border-t border-dark-border">
        <div className="relative">
            <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask for component code, API configs, or database schemas..."
            className="w-full bg-dark-surface border border-dark-border rounded-xl pl-4 pr-12 py-3 text-dark-text placeholder-dark-muted focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all"
            disabled={isTyping}
            />
            <button 
                type="submit"
                disabled={!input.trim() || isTyping}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-brand-600 rounded-lg text-white hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
            >
                <Send className="w-4 h-4" />
            </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;