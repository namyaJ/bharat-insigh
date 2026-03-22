'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Sparkles, Send, Bot, User } from 'lucide-react';
import styles from './InsightPanel.module.css';

export function InsightPanel({ filterContext }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello! I'm GovData AI. Ask me anything about the current data grid." }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef(null);
  const streamBufferRef = useRef('');

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!input.trim() || isThinking) return;

    const userMsg = input.trim();
    setInput('');
    const userMessage = { role: 'user', content: userMsg };
    setMessages(prev => [...prev, userMessage]);
    setIsThinking(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: userMsg }],
          context: filterContext
        })
      });

      if (!response.ok) throw new Error('API Error');

      setIsThinking(false);
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      // Add empty assistant message
      streamBufferRef.current = '';
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        streamBufferRef.current += chunk;
        
        // Create a NEW string each time (immutable update to fix React Strict Mode double-render)
        const currentText = streamBufferRef.current;
        setMessages(prev => {
          const newMessages = prev.slice(0, -1);
          return [...newMessages, { role: 'assistant', content: currentText }];
        });
      }
    } catch (err) {
      setIsThinking(false);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    }
  }, [input, isThinking, filterContext]);

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <Sparkles size={18} color="var(--primary-color)" />
        <span className={styles.title}>Insight Panel</span>
      </div>
      
      <div className={styles.chatArea} ref={scrollRef}>
        {messages.map((msg, i) => (
          <div key={i} className={`${styles.message} ${msg.role === 'user' ? styles.userMsg : styles.modelMsg}`}>
            <div className={styles.avatar}>
              {msg.role === 'user' ? <User size={14} /> : <Bot size={14} color="var(--primary-color)"/>}
            </div>
            <div className={styles.bubble}>
              {msg.role === 'assistant' ? (
                <div className={styles.markdownContent} dangerouslySetInnerHTML={{ __html: formatMarkdown(msg.content) }} />
              ) : msg.content}
            </div>
          </div>
        ))}
        {isThinking && (
          <div className={`${styles.message} ${styles.modelMsg}`}>
            <div className={styles.avatar}>
              <Bot size={14} color="var(--primary-color)"/>
            </div>
            <div className={`${styles.bubble} ${styles.thinkingBubble}`}>
              <div className="flex flex-col gap-1.5 w-full animate-pulse">
                <div className="h-2.5 w-[90%] rounded bg-white/[0.08]" />
                <div className="h-2.5 w-[75%] rounded bg-white/[0.06]" />
                <div className="h-2.5 w-[60%] rounded bg-white/[0.04]" />
              </div>
            </div>
          </div>
        )}
      </div>

      <form className={styles.inputForm} onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Ask AI about this data..." 
          value={input}
          onChange={e => setInput(e.target.value)}
          className={styles.inputField}
        />
        <button type="submit" disabled={isThinking || !input.trim()} className={styles.sendBtn}>
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}

/**
 * Minimal markdown → HTML converter for AI responses
 * Supports: **bold**, ### headings, - bullet lists, \n newlines
 */
function formatMarkdown(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Headings
    .replace(/^### (.+)$/gm, '<h4 class="ai-heading">$1</h4>')
    .replace(/^## (.+)$/gm, '<h3 class="ai-heading">$1</h3>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Bullet lists
    .replace(/^- (.+)$/gm, '<div class="ai-bullet">• $1</div>')
    // Newlines
    .replace(/\n/g, '<br/>');
}
