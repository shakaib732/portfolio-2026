import { useEffect, useState } from 'react';

type Stage = 'world' | 'glitch-in' | 'simulation' | 'glitch-out' | 'restored' | 'home';
const timeline: Array<[Stage, number]> = [['glitch-in', 1100], ['simulation', 1570], ['glitch-out', 2850], ['restored', 3360], ['home', 4650]];

export default function App() {
  const [stage, setStage] = useState<Stage>('world');
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) { setStage('home'); return; }
    const timers = timeline.map(([next, delay]) => window.setTimeout(() => setStage(next), delay));
    return () => timers.forEach(window.clearTimeout);
  }, []);
  const isHome = stage === 'home';
  const simulation = stage === 'simulation' || stage === 'glitch-in' || stage === 'glitch-out';
  const word = simulation ? 'Simulation!' : 'World!';
  return (
    <main>
      {!isHome ? (
        <section className={`splash ${stage.startsWith('glitch') ? 'is-glitching' : ''} ${stage === 'restored' ? 'is-restored' : ''}`} aria-label="Introduction" aria-live="off">
          <div className="ambient ambient-one"/><div className="ambient ambient-two"/>
          <div className="topline"><span>SK / 2026</span><span>INITIALIZING EXPERIENCE <i className="status-dot"/></span></div>
          <div className="intro-center">
            <p className="eyebrow">&lt; A NEW CHAPTER /&gt;</p>
            <h1 className="headline"><span>Hello </span><span className="glitch-word" data-text={word}>{word}</span></h1>
            <p className="subline">{simulation ? 'REALITY.EXE // SIGNAL INTERRUPTED' : stage === 'restored' ? 'SYSTEM RESTORED // WELCOME BACK' : 'WELCOME TO MY CORNER OF THE INTERNET'}</p>
          </div>
          <div className="bottomline"><span>CREATING SOMETHING DIFFERENT</span><span className="loader"><span/></span><span>PLEASE STAND BY</span></div>
          <button className="skip" onClick={() => setStage('home')}>Skip intro <span aria-hidden="true">↗</span></button>
        </section>
      ) : (
        <section className="home" aria-label="Homepage"><div className="ambient ambient-one"/><nav className="home-nav"><a href="#home" className="brand">SK<span>.</span></a><span>PORTFOLIO — 2026</span></nav><div id="home" className="home-center"><p className="eyebrow">&lt; HELLO, I'M /&gt;</p><h1>I am <span>Shakaib Khan.</span></h1><div className="home-rule"/><p className="home-caption">Senior Software Engineer <span aria-hidden="true">/</span> Building for the web and beyond.</p></div><footer className="home-footer"><span>WELCOME TO MY WORLD</span><span>MORE COMING SOON ↗</span></footer></section>
      )}
    </main>
  );
}
