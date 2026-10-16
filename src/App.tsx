import { useEffect, useState } from 'react';

type Stage = 'world' | 'glitch-in' | 'simulation' | 'glitch-out' | 'restored' | 'home';
const timeline: Array<[Stage, number]> = [['glitch-in', 1100], ['simulation', 1570], ['glitch-out', 2850], ['restored', 3360], ['home', 4650]];
const streams = Array.from({ length: 26 }, (_, i) => ({
  id: i,
  left: `${(i * 37.7) % 100}%`,
  delay: `${-((i * 1.71) % 13)}s`,
  duration: `${8 + ((i * 7) % 9)}s`,
  glyphs: Array.from({ length: 22 }, (_, j) => '01アイウエオカキクケコサシスセソタチツテト'[ (i * 11 + j * 7) % 26 ]).join('\n'),
}));
function MatrixRain() {
  return <div className="matrix-rain" aria-hidden="true">{streams.map(s => <span key={s.id} className="rain-column" style={{ left: s.left, animationDelay: s.delay, animationDuration: s.duration }}>{s.glyphs}</span>)}</div>;
}
export default function App() {
  const [stage, setStage] = useState<Stage>('world');
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setStage('home'); return; }
    const timers = timeline.map(([next, delay]) => window.setTimeout(() => setStage(next), delay));
    return () => timers.forEach(window.clearTimeout);
  }, []);
  const isHome = stage === 'home';
  const simulation = stage === 'simulation' || stage === 'glitch-in' || stage === 'glitch-out';
  const word = simulation ? 'Simulation!' : 'World!';
  return <main>{!isHome ? <section className={`splash ${stage.startsWith('glitch') ? 'is-glitching' : ''} ${stage === 'restored' ? 'is-restored' : ''}`} aria-label="Introduction">
    <MatrixRain /><div className="screen-noise" aria-hidden="true" />
    <div className="topline"><span>[ SK_2026 ]</span><span>CONNECTION ESTABLISHED <i className="status-dot" /></span></div>
    <div className="intro-center"><p className="eyebrow">&gt; WAKE UP_</p><h1 className="headline"><span>Hello </span><span className="glitch-word" data-text={word}>{word}</span></h1><p className="subline">{simulation ? 'WARNING: REALITY.EXE HAS STOPPED RESPONDING' : stage === 'restored' ? 'SYSTEM RESTORED // FOLLOW THE WHITE RABBIT' : 'THERE IS NO SPOON_'}<span className="cursor">▌</span></p></div>
    <div className="bottomline"><span>SYS.STATUS: ONLINE</span><span className="loader"><span /></span><span>ENTERING THE MATRIX</span></div><button className="skip" onClick={() => setStage('home')}>[ SKIP INTRO ↗ ]</button>
  </section> : <section className="home" aria-label="Homepage"><MatrixRain /><div className="screen-noise" aria-hidden="true" /><nav className="home-nav"><a href="#home" className="brand">SK<span>_</span></a><span>[ PORTFOLIO_2026 ]</span></nav><div id="home" className="home-center"><p className="eyebrow">&gt; IDENTITY CONFIRMED_</p><h1>I am <span>Shakaib Khan.</span></h1><div className="home-rule" /><p className="home-caption">Senior Software Engineer <span aria-hidden="true">//</span> Building for the web and beyond<span className="cursor">_</span></p></div><footer className="home-footer"><span>WELCOME TO THE REAL WORLD</span><span>MORE COMING SOON ↗</span></footer></section>}</main>;
}
