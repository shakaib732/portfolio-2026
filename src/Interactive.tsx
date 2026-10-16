import { useEffect, useRef, useState } from 'react';

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$%&';
export function DecodeText({ text }: { text: string }) {
  const [shown, setShown] = useState(text);
  const node = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = node.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let timer: number | undefined;
    let played = false;
    const observer = new IntersectionObserver(entries => {
      if (!entries[0]?.isIntersecting || played) return;
      played = true;
      let frame = 0;
      timer = window.setInterval(() => {
        frame++;
        setShown(text.split('').map((char, i) => char === ' ' || i < frame / 2 ? char : alphabet[(i * 7 + frame * 11) % alphabet.length]).join(''));
        if (frame >= text.length * 2) window.clearInterval(timer);
      }, 35);
      observer.disconnect();
    }, { threshold: .5 });
    observer.observe(el);
    return () => { observer.disconnect(); if (timer !== undefined) window.clearInterval(timer); };
  }, [text]);
  return <span ref={node} aria-label={text}><span aria-hidden="true">{shown}</span></span>;
}

const commandList = ['help', 'whoami', 'skills', 'experience', 'projects', 'contact', 'clear', 'there is no spoon'];
const sectionCommands: Record<string,string> = { skills: 'skills', experience: 'experience', projects: 'projects', contact: 'contact' };
export function Terminal({ onClose, onEasterEgg }: { onClose: () => void; onEasterEgg: () => void }) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>(['SK_OS v2026 // CONNECTION SECURE', 'Type help to see available commands.']);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  useEffect(() => { inputRef.current?.focus(); }, []);
  useEffect(() => { outputRef.current?.scrollTo({ top: outputRef.current.scrollHeight }); }, [history]);
  useEffect(() => {
    const close = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [onClose]);
  const run = (value: string) => {
    const cmd = value.trim().toLowerCase().replace(/\s+/g, ' ');
    setInput('');
    if (!cmd) return;
    if (cmd === 'clear') { setHistory([]); return; }
    if (cmd === 'there is no spoon') { setHistory(h => [...h, '> '+value, 'ACCESSING THE SOURCE...']); onEasterEgg(); return; }
    const replies: Record<string,string> = {
      help: 'AVAILABLE: '+commandList.join(' | '),
      whoami: 'Shakaib Khan // Senior Software Engineer // 6+ years // React, Node, Lit.js, AEM and enterprise platforms.',
      skills: 'Opening technical stack...',
      experience: 'Opening career log...',
      projects: 'Opening selected work...',
      contact: 'Opening contact channel...',
    };
    setHistory(h => [...h, '> '+value, replies[cmd] || 'COMMAND NOT FOUND. Type help.']);
    if (sectionCommands[cmd]) {
      document.getElementById(sectionCommands[cmd])?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    }
  };
  return <div className="terminal-panel" role="dialog" aria-modal="false" aria-label="Interactive portfolio terminal">
    <div className="terminal-bar"><strong>SK_OS / TERMINAL</strong><button type="button" onClick={onClose} aria-label="Close terminal">✕</button></div>
    <div className="terminal-output" ref={outputRef} aria-live="polite">{history.map((line,i)=><div key={i}>{line}</div>)}</div>
    <form onSubmit={e=>{e.preventDefault();run(input);}} className="terminal-input"><label htmlFor="terminal-command">&gt;</label><input id="terminal-command" ref={inputRef} autoComplete="off" spellCheck={false} value={input} onChange={e=>setInput(e.target.value)} placeholder="enter command..." /><button type="submit">↵</button></form>
  </div>;
}
