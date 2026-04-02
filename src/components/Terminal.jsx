import { useState, useEffect, useRef, useCallback } from 'react'
import './Terminal.css'
import descriptions from '../data/texts'
import { About, Skill, Project, Contact } from "./topics/Index"

// ─── Boot Messages ────────────────────────────────────────────────
const BOOT_MESSAGES = [
  '[    0.000000] Initializing PortfoliOS v1.0...',
  '[    0.012345] Loading kernel modules                 [  OK  ]',
  '[    0.089234] Starting udev daemon                   [  OK  ]',
  '[    0.134567] Mounting virtual filesystem            [  OK  ]',
  '[    0.234567] Loading developer profile              [  OK  ]',
  '[    0.312890] Starting network services              [  OK  ]',
  '[    0.456789] Initializing terminal emulator         [  OK  ]',
  '[    0.534567] System ready. Welcome, stranger.',
]

// ─── Available Commands ───────────────────────────────────────────
const COMMANDS = [
  'ls', 'cd', 'cat', 'clear', 'help', 'neofetch', 'fastfetch', 'history',
  'whoami', 'uname', 'sudo', 'vim', 'git', 'cowsay',
  'scanlines', 'show', 'matrix',
]

// ─── Quick Buttons ────────────────────────────────────────────────
const buttons = {
  en: [
    { label: 'Projects', cmds: [
        'cat /projects/titiltei.txt',
        'cat /projects/innovajus.txt',
        'cat /projects/clicksign-ruby.txt',
        'cat /projects/spotify-card.txt',
      ] },
    { label: 'Contact', cmds: ['cat contact.txt'] },
    { label: 'Clear', cmds: ['clear'] },
  ],
  pt: [
    { label: 'Projetos', cmds: [
        'cat /projetos/titiltei.txt',
        'cat /projetos/innovajus.txt',
        'cat /projetos/clicksign-ruby.txt',
        'cat /projetos/spotify-card.txt',
      ] },
    { label: 'Contato', cmds: ['cat contato.txt'] },
    { label: 'Limpar', cmds: ['clear'] },
  ],
}

// ─── Virtual Filesystem ───────────────────────────────────────────
const fs = {
  en: {
    '/': ['projects', 'contact.txt'],
    '/projects': ['titiltei.txt', 'innovajus.txt', 'clicksign-ruby.txt', 'spotify-card.txt'],
    'contact.txt': <Contact lang="en" />,
    '/projects/titiltei.txt': <Project lang="en" id="titiltei" />,
    '/projects/innovajus.txt': <Project lang="en" id="innovajus" />,
    '/projects/clicksign-ruby.txt': <Project lang="en" id="clicksign" />,
    '/projects/spotify-card.txt': <Project lang="en" id="spotify" />,
  },
  pt: {
    '/': ['projetos', 'contato.txt'],
    '/projetos': ['titiltei.txt', 'innovajus.txt', 'clicksign-ruby.txt', 'spotify-card.txt'],
    'contato.txt': <Contact lang="pt" />,
    '/projetos/titiltei.txt': <Project lang="pt" id="titiltei" />,
    '/projetos/innovajus.txt': <Project lang="pt" id="innovajus" />,
    '/projetos/clicksign-ruby.txt': <Project lang="pt" id="clicksign" />,
    '/projetos/spotify-card.txt': <Project lang="pt" id="spotify" />,
  },
}

// ─── Typewriter Line ──────────────────────────────────────────────
function TypewriterLine({ content }) {
  const shouldAnimate =
    typeof content === 'string' &&
    !content.startsWith('$ ') &&
    content.length < 180 &&
    (content.match(/\n/g) || []).length < 3

  const [displayed, setDisplayed] = useState(shouldAnimate ? '' : null)

  useEffect(() => {
    if (!shouldAnimate) return
    let i = 0
    const timer = setInterval(() => {
      i++
      setDisplayed(content.slice(0, i))
      if (i >= content.length) clearInterval(timer)
    }, 10)
    return () => clearInterval(timer)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (displayed === null) return <div>{content}</div>
  return <div>{displayed}<span className="tw-cursor">▋</span></div>
}

// ─── Boot Sequence ────────────────────────────────────────────────
function BootSequence({ onComplete }) {
  const [lines, setLines] = useState([])
  const [fading, setFading] = useState(false)

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      setLines(prev => [...prev, BOOT_MESSAGES[i]])
      i++
      if (i >= BOOT_MESSAGES.length) {
        clearInterval(interval)
        setTimeout(() => setFading(true), 500)
        setTimeout(onComplete, 1100)
      }
    }, 180)
    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <div className={`boot-sequence${fading ? ' fade-out' : ''}`}>
      {lines.map((line, i) => (
        <div key={i} className="boot-line">{line}</div>
      ))}
      {!fading && <span className="boot-cursor">▋</span>}
    </div>
  )
}

// ─── Matrix Rain ──────────────────────────────────────────────────
function MatrixRain({ onExit }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const fontSize = 14
    const cols = Math.floor(canvas.width / fontSize)
    const drops = Array(cols).fill(1)
    const chars =
      'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ' +
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz' +
      '0123456789@#$%^&*(){}[]<>/\\'

    const draw = () => {
      ctx.fillStyle = 'rgba(0,0,0,0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.font = `${fontSize}px monospace`
      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)]
        const bright = Math.random() > 0.95
        ctx.fillStyle = bright ? '#fff' : '#0f0'
        ctx.fillText(char, i * fontSize, drops[i] * fontSize)
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0
        drops[i]++
      }
    }

    const id = setInterval(draw, 33)
    const handleKey = () => onExit()
    window.addEventListener('keydown', handleKey)
    canvas.addEventListener('click', handleKey)
    return () => {
      clearInterval(id)
      window.removeEventListener('keydown', handleKey)
      canvas.removeEventListener('click', handleKey)
    }
  }, [onExit])

  return (
    <div className="matrix-overlay">
      <canvas ref={canvasRef} />
      <div className="matrix-hint">Press any key or click to exit</div>
    </div>
  )
}

// ─── Neofetch Output ──────────────────────────────────────────────
function NeofetchOutput({ lang }) {
  const artLines = [
    '  ██████╗  ██████╗ ',
    '  ██╔══██╗██╔════╝ ',
    '  ██║  ██║██║       ',
    '  ██║  ██║██║       ',
    '  ██████╔╝╚██████╗ ',
    '  ╚═════╝  ╚═════╝ ',
    '                    ',
  ]

  const en = [
    <><span className="nf-user">davi</span>@<span className="nf-user">portfolio</span></>,
    <span className="nf-sep">{'─'.repeat(17)}</span>,
    <><span className="nf-key">OS</span>: PortfoliOS 1.0</>,
    <><span className="nf-key">Host</span>: davi-canuto</>,
    <><span className="nf-key">Shell</span>: bash 5.2.0</>,
    <><span className="nf-key">Languages</span>: Ruby, JS, SQL</>,
    <><span className="nf-key">Projects</span>: 3 &nbsp;<span className="nf-key">Uptime</span>: 2+ yrs</>,
  ]

  const pt = [
    <><span className="nf-user">davi</span>@<span className="nf-user">portfolio</span></>,
    <span className="nf-sep">{'─'.repeat(17)}</span>,
    <><span className="nf-key">OS</span>: PortfoliOS 1.0</>,
    <><span className="nf-key">Host</span>: davi-canuto</>,
    <><span className="nf-key">Shell</span>: bash 5.2.0</>,
    <><span className="nf-key">Linguagens</span>: Ruby, JS, SQL</>,
    <><span className="nf-key">Projetos</span>: 3 &nbsp;<span className="nf-key">Uptime</span>: 2+ anos</>,
  ]

  const info = lang === 'en' ? en : pt

  return (
    <div className="neofetch">
      {artLines.map((art, i) => (
        <div key={i} className="nf-row">
          <span className="nf-art">{art}</span>
          {info[i] !== undefined && <span className="nf-info">{info[i]}</span>}
        </div>
      ))}
    </div>
  )
}

// ─── Fastfetch Output ─────────────────────────────────────────────
function FastfetchOutput({ lang }) {
  // Among Us impostor ASCII art (original)
  const logoLines = [
    '                            :=#%@@%#+=:',
    '                     :#%@@@@@@@@@@@@@@@%#+:',
    '                   -#@@@%##*******###%%@@@@@*:',
    '                  .#@@@#******************#%@@@%-',
    '                 -@@@%***********************#@@@%:',
    '                =@@@#**************************#@@@+',
    '               +@@@************************###***@@@*',
    '              -@@@***********#%%%@@@@@@@@@@@@@@@@@@@@=',
    '             .@@@#********#@@@@@%%##*****+++++***#%@@@@*:',
    '             %@@%#*******%@@@#=:::::::::........::::=#@@@*',
    '            -@@@##******%@@%**+::::::::             .::*@@@',
    '            %@@##*******@@@#***-::::::::.            :::*@@+',
    '       .:-=*@@@##*******@@@****+::::::::::::........::::-@@@',
    ' :=*#%@@@@@@@@%##*******@@@*****+-::::::::::::::::::::::-%@@-',
    '  *@@@@@%%###@@@###*******@@@#******+--:::::::::::::---=+**%@@=',
    '  +@@@*******#@@%###*******#@@@*****************************@@@:',
    '  .@@@********%@@%###********%@@@#**************************%@@*',
    '  #@@%**######@@@####*********#@@@@%#*********************#@@@#',
    ' .@@@#########@@@#####**********#%@@@@@@@%%%%########%%%@@@@@+',
    ' -@@%#########@@@#####**************#%@@@@@@@@@@@@@@@@@@@@@@@',
    ' +@@%#########@@@#####************************************@@%',
    ' *@@##########@@@#####************************************@@%',
    ' #@@##########@@@######**********************************#@@#',
    ' %@@##########@@@######**********************************#@@*',
    ' %@@##########@@@#######*********************************%@@=',
    ' #@@##########@@@########********************************%@@-',
    ' *@@##########@@@#########******************************#@@@:',
    ' +@@%#########@@@##########****************************##@@%.',
    ' -@@%#########@@@############*************************###@@#',
    ' :@@@#########@@@###############********************####%@@*',
    '  @@@#########@@@######################*******##########@@@=',
    '  *@@%########@@@#######################################@@@:',
    '  :@@@########%@@%######################################@@@',
    '   *@@@%%%%%%%@@@@##################%%%################%@@#',
    '    -#@@@@@@@@@@@@###############@@@@@@@@@@@@@@%#######%@@-',
    '          ....  %@@###############@@@****%@@############@@@',
    '                *@@%##############@@#    =@@%###########@@%',
    '                -@@%##############@@*    -@@@##########%@@+',
    '                .@@@#############%@@+    :@@@##########@@@',
    '                 %@@#############@@@=     %@@##########@@%',
    '                 =@@@############@@@-     *@@%######%%@@@',
    '                 .%@@@@@@@@@@@@@@@@@-     =@@@@@@@@@@@@@*',
  ]

  const en = {
    software: [
      { key: 'OS',       val: 'Arch Linux / Omarchy' },
      { key: 'WM',       val: 'Hyprland (Wayland)' },
      { key: 'Shell',    val: 'zsh' },
      { key: 'Terminal', val: 'Alacritty' },
      { key: 'Editor',   val: 'VSCode + Neovim' },
      { key: 'Font',     val: 'CaskaydiaMono Nerd Font' },
    ],
    me: [
      { key: 'Name',     val: 'Davi Canuto' },
      { key: 'Role',     val: 'Software Developer' },
      { key: 'Stack',    val: 'Ruby · Rails · JS · SQL' },
      { key: 'Location', val: 'Natal-RN, Brazil 🇧🇷' },
      { key: 'Contact',  val: 'davicanutogregorio@gmail.com' },
    ],
  }

  const pt = {
    software: en.software,
    me: [
      { key: 'Nome',       val: 'Davi Canuto' },
      { key: 'Cargo',      val: 'Desenvolvedor de Software' },
      { key: 'Stack',      val: 'Ruby · Rails · JS · SQL' },
      { key: 'Localidade', val: 'Natal-RN, Brasil 🇧🇷' },
      { key: 'Contato',    val: 'davicanutogregorio@gmail.com' },
    ],
  }

  const data = lang === 'en' ? en : pt
  const sw = 'Software'
  const me = lang === 'en' ? 'About Me' : 'Sobre Mim'

  const infoBlocks = [
    { title: me, rows: data.me },
    { title: sw, rows: data.software },
  ]

  const infoLines = []
  for (const block of infoBlocks) {
    infoLines.push({ type: 'title', label: block.title })
    for (const row of block.rows) {
      infoLines.push({ type: 'row', key: row.key, val: row.val })
    }
    infoLines.push({ type: 'blank' })
  }

  return (
    <div className="fastfetch">
      <div className="ff-user-line">
        <span className="nf-user">davi</span>
        <span className="ff-at">@</span>
        <span className="nf-user">portfolio</span>
      </div>
      <div className="ff-sep">{'─'.repeat(40)}</div>
      <div className="ff-grid">
        <div className="ff-logo-col">
          {logoLines.map((l, i) => <div key={i} className="ff-logo-line">{l}</div>)}
        </div>
        <div className="ff-info-col">
          {infoLines.map((item, i) => {
            if (item.type === 'blank') return <div key={i} className="ff-blank" />
            if (item.type === 'title') return (
              <div key={i} className="ff-section-title">
                ┌── <span className="ff-title-text">{item.label}</span> {'─'.repeat(Math.max(0, 22 - item.label.length))}┐
              </div>
            )
            return (
              <div key={i} className="ff-row">
                <span className="ff-pipe">│ </span>
                <span className="nf-key">{item.key}</span>
                <span className="ff-colon">: </span>
                <span className="ff-val">{item.val}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Rick Roll Overlay ────────────────────────────────────────────
function RickRollOverlay({ onExit }) {
  return (
    <div className="rickroll-overlay" onClick={onExit}>
      <div className="rickroll-art">{`
 ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣤⣤⣤⣤⣤⣶⣦⣤⣄⡀⠀⠀⠀⠀⠀⠀⠀
 ⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⡿⠛⠉⠙⠛⠛⠛⠛⠻⢿⣿⣷⣤⡀⠀⠀⠀⠀⠀
 ⠀⠀⠀⠀⠀⠀⠀⠀⣼⣿⠋⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⠈⢻⣿⣿⡄⠀⠀⠀⠀
 ⠀⠀⠀⠀⠀⠀⠀⣸⣿⡏⠀⠀⠀⣠⣶⣾⣿⣿⣿⠿⠿⠿⢿⣿⣿⣿⣄⠀⠀⠀
 ⠀⠀⠀⠀⠀⠀⠀⣿⣿⠁⠀⠀⢰⣿⣿⣯⠁⠀⠀⠀⠀⠀⠀⠀⠈⠙⢿⣷⡄⠀
 ⠀⠀⣀⣤⣴⣶⣶⣿⡟⠀⠀⠀⢸⣿⣿⣿⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣷⠀
 ⠀⢰⣿⡟⠋⠉⣹⣿⡇⠀⠀⠀⠘⣿⣿⣿⣿⣷⣦⣤⣤⣤⣶⣶⣶⣶⣿⣿⣿⠀
 ⠀⢸⣿⡇⠀⠀⣿⣿⡇⠀⠀⠀⠀⠹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠃⠀
 ⠀⣸⣿⡇⠀⠀⣿⣿⡇⠀⠀⠀⠀⠀⠉⠻⠿⣿⣿⣿⣿⡿⠿⠿⠛⢻⣿⡇⠀⠀
 ⠀⣿⣿⠁⠀⠀⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣧⠀⠀
 ⠀⣿⣿⠀⠀⠀⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⠀⠀
 ⠀⣿⣿⠀⠀⠀⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⠀⠀
 ⠀⢿⣿⡆⠀⠀⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⡇⠀⠀
 ⠀⠸⣿⣧⡀⠀⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⠃⠀⠀
 ⠀⠀⠛⢿⣿⣿⣿⣿⣇⠀⠀⠀⠀⠀⣰⣿⣿⣷⣶⣶⣶⣶⠶⠀⢠⣿⣿⠀⠀⠀
 ⠀⠀⠀⠀⠀⠀⠀⣿⣿⠀⠀⠀⠀⠀⣿⣿⡇⠀⣽⣿⡏⠁⠀⠀⢸⣿⡇⠀⠀⠀
 ⠀⠀⠀⠀⠀⠀⠀⣿⣿⠀⠀⠀⠀⠀⣿⣿⡇⠀⢹⣿⡆⠀⠀⠀⣸⣿⠇⠀⠀⠀
 ⠀⠀⠀⠀⠀⠀⠀⢿⣿⣦⣄⣀⣠⣴⣿⣿⠁⠀⠈⠻⣿⣿⣿⣿⡿⠏⠀⠀⠀⠀
 ⠀⠀⠀⠀⠀⠀⠀⠈⠛⠻⠿⠿⠿⠿⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀`}
      </div>
      <div className="rickroll-text">Never gonna give you up 🎵</div>
      <div className="rickroll-text">Never gonna let you down 🎵</div>
      <div className="rickroll-hint">click anywhere to escape (if you can)</div>
    </div>
  )
}

// ─── Coffee Output ────────────────────────────────────────────────
function CoffeeOutput() {
  return (
    <div className="coffee-output">
      <div className="coffee-art">{`
        ( (
         ) )
      ........
      |      |]
      \\      /
       \`----'`}
      </div>
      <div className="coffee-msg">☕ Here's your coffee. You deserve it.</div>
    </div>
  )
}

// ─── Npm Install ──────────────────────────────────────────────────
function NpmInstall({ pkg }) {
  const [dots, setDots] = useState(0)
  const [step, setStep]   = useState(0)

  const steps = [
    `npm warn deprecated ${pkg || 'left-pad'}@1.3.0: use String.prototype.padStart`,
    'npm warn deprecated node-gyp@3.8.0: please upgrade',
    'npm warn deprecated core-js@2.6.12: obsolete, use core-js@3',
    `added 847 packages in`,
  ]

  useEffect(() => {
    const t = setInterval(() => setDots(d => (d + 1) % 4), 400)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    let i = 0
    const t = setInterval(() => {
      i++
      setStep(i)
      if (i >= steps.length) clearInterval(t)
    }, 900)
    return () => clearInterval(t)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="npm-output">
      {steps.slice(0, step).map((s, i) => <div key={i} className="npm-line">{s}{i === steps.length - 1 ? ' 4.2s' : ''}</div>)}
      {step < steps.length && (
        <div className="npm-line npm-loading">⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏'[{'█'.repeat(dots * 7)}{'░'.repeat(28 - dots * 7)}{']'} | idealTree:packages: timing idealTree Completed in {dots * 412 + 100}ms</div>
      )}
    </div>
  )
}

// ─── Hack Sequence ────────────────────────────────────────────────
const HACK_LINES = [
  'Initializing exploit framework v4.2.0...',
  'Scanning target: portfolio.davi-canuto.dev',
  'PORT     STATE  SERVICE',
  '22/tcp   open   ssh',
  '80/tcp   open   http',
  '443/tcp  open   https',
  '3000/tcp open   node',
  'Vulnerabilities found: 0',
  'Trying CVE-2024-3094... FAILED',
  'Trying CVE-2023-44487... FAILED',
  'Trying CVE-2021-44228 (Log4Shell)... FAILED',
  'Brute forcing SSH credentials...',
  '[####################] 100000/100000',
  'Password not found.',
  'Attempting SQL injection on /api/contact...',
  "' OR 1=1 --  →  sanitized.",
  '<script>alert(1)</script>  →  escaped.',
  'Trying social engineering...',
  'Sending phishing email to davi@portfolio...',
  'Auto-reply: nice try.',
  '> Escalating privileges...',
  '> sudo make me a sandwich',
  'What? Make it yourself.',
  '...',
  'ACCESS DENIED.',
  ' ',
  'This terminal is protected by sheer good taste.',
  'But since you tried... here, have a cookie 🍪',
]

function HackSequence({ onComplete, lang }) {
  const [lines, setLines] = useState([])
  const [done, setDone] = useState(false)

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      setLines(prev => [...prev, HACK_LINES[i]])
      i++
      if (i >= HACK_LINES.length) {
        clearInterval(interval)
        setDone(true)
        setTimeout(onComplete, 1800)
      }
    }, 120)
    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <div className="hack-overlay">
      <div className="hack-header">
        {lang === 'en' ? '[ INTRUSION DETECTED ]' : '[ INTRUSÃO DETECTADA ]'}
      </div>
      <div className="hack-lines">
        {lines.map((l, i) => (
          <div key={i} className={`hack-line${l.startsWith('>') ? ' hack-cmd' : ''}${l === 'ACCESS DENIED.' ? ' hack-denied' : ''}${l === 'This terminal is protected by sheer good taste.' || l.includes('cookie') ? ' hack-final' : ''}`}>
            {l}
          </div>
        ))}
        {!done && <span className="boot-cursor">▋</span>}
      </div>
    </div>
  )
}

// ─── Main Terminal ────────────────────────────────────────────────
let outputIdCounter = 0

export default function Terminal() {
  const [booting, setBooting] = useState(true)
  const [lang, setLang] = useState('en')
  const [cwd, setCwd] = useState('/')
  const [output, setOutput] = useState([])
  const [hackActive, setHackActive]       = useState(false)
  const [rickrollActive, setRickrollActive] = useState(false)
  const [command, setCommand] = useState('')
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [crtEnabled, setCrtEnabled] = useState(false)
  const [matrixActive, setMatrixActive] = useState(false)
  const [clock, setClock] = useState('')
  const outputRef = useRef(null)
  const inputRef = useRef(null)
  const idleTimerRef = useRef(null)
  const crtRef = useRef(false)

  // Clock
  useEffect(() => {
    const update = () => {
      const now = new Date()
      setClock(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    }
    update()
    const t = setInterval(update, 1000)
    return () => clearInterval(t)
  }, [])

  // Auto-scroll
  useEffect(() => {
    if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight
  }, [output])

  // Idle Matrix timer
  const resetIdleTimer = useCallback(() => {
    clearTimeout(idleTimerRef.current)
    idleTimerRef.current = setTimeout(() => setMatrixActive(true), 30000)
  }, [])

  useEffect(() => {
    resetIdleTimer()
    window.addEventListener('keydown', resetIdleTimer)
    window.addEventListener('mousemove', resetIdleTimer)
    return () => {
      clearTimeout(idleTimerRef.current)
      window.removeEventListener('keydown', resetIdleTimer)
      window.removeEventListener('mousemove', resetIdleTimer)
    }
  }, [resetIdleTimer])

  const print = (content = '') =>
    setOutput(o => [...o, { id: ++outputIdCounter, content }])

  const clear = () => setOutput([])

  const handleCommand = (cmd) => {
    const parts = cmd.trim().split(/\s+/)
    const base = parts[0]
    const args = parts.slice(1)
    const currentFS = fs[lang]

    switch (base) {
      case 'ls':
        print((currentFS[cwd] || []).join('  '))
        break

      case 'cd':
        if (args.length === 0) {
          setCwd('/')
        } else if (args[0] === '..') {
          if (cwd !== '/') {
            const p = cwd.split('/')
            p.pop()
            setCwd(p.length === 1 ? '/' : p.join('/'))
          }
        } else if (args[0] !== '.') {
          const target = cwd === '/' ? `/${args[0]}` : `${cwd}/${args[0]}`
          if (currentFS[target]) {
            setCwd(target)
          } else {
            print(lang === 'en' ? `cd: ${args[0]}: No such directory` : `cd: ${args[0]}: Diretório não encontrado`)
          }
        }
        break

      case 'cat': {
        const target = args[0]
        if (!target) { print(lang === 'en' ? 'cat: missing file name' : 'cat: nome do arquivo ausente'); break }
        const path = cwd === '/' ? target : `${cwd}/${target}`
        const content = currentFS[path]
        if (content !== undefined) print(content)
        else print(lang === 'en' ? `cat: ${target}: No such file` : `cat: ${target}: Arquivo não encontrado`)
        break
      }

      case 'clear':
        clear()
        break

      case 'help':
        print(lang === 'en'
          ? 'Available commands:\n  ls              list directory contents\n  cd <dir>        change directory\n  cat <file>      read a file\n  clear           clear terminal\n  fastfetch       about me (system style)\n  neofetch        system info\n  history         command history\n  whoami          who are you?\n  uname -a        system information\n  git log         career timeline\n  cowsay <msg>    a wise cow speaks\n  scanlines       toggle CRT effect\n  matrix          start matrix screensaver\n  hack            try to hack this terminal\n  ssh <host>      connect to a remote host\n  curl <url>      transfer data from a url\n  docker ps       list running containers\n  npm install     install dependencies\n  rm -rf /        definitely safe command\n  python          open python repl\n  irb             open ruby repl\n  coffee          you deserve a break\n  rickroll        ???\n  help            this help'
          : 'Comandos disponíveis:\n  ls              listar diretório\n  cd <dir>        mudar diretório\n  cat <arquivo>   ler arquivo\n  clear           limpar terminal\n  fastfetch       sobre mim (estilo sistema)\n  neofetch        info do sistema\n  history         histórico de comandos\n  whoami          quem é você?\n  uname -a        informações do sistema\n  git log         linha do tempo da carreira\n  cowsay <msg>    uma vaca sábia fala\n  scanlines       toggle efeito CRT\n  matrix          iniciar protetor Matrix\n  hack            tente hackear este terminal\n  ssh <host>      conectar a um host remoto\n  curl <url>      transferir dados de uma url\n  docker ps       listar containers rodando\n  npm install     instalar dependências\n  rm -rf /        comando definitivamente seguro\n  python          abrir repl python\n  irb             abrir repl ruby\n  coffee          você merece uma pausa\n  rickroll        ???\n  help            esta ajuda'
        )
        break

      case 'neofetch':
        print(<NeofetchOutput lang={lang} />)
        break

      case 'fastfetch':
        print(<FastfetchOutput lang={lang} />)
        break

      case 'history':
        if (history.length === 0) {
          print(lang === 'en' ? 'No commands in history.' : 'Nenhum comando no histórico.')
        } else {
          print(history.map((h, i) => `  ${String(i + 1).padStart(3)}  ${h}`).join('\n'))
        }
        break

      case 'whoami':
        print(lang === 'en'
          ? 'davi — backend developer, guardian of logic and order.\n"There is no try. Only do."'
          : 'davi — desenvolvedor backend, guardião da lógica e da ordem.\n"Não existe tentar. Apenas fazer."')
        break

      case 'uname':
        print('PortfoliOS 1.0.0 davi-canuto #1 SMP PREEMPT x86_64 GNU/Linux')
        break

      case 'sudo':
        if (args.join(' ') === 'rm -rf /') {
          print(lang === 'en'
            ? 'Nice try, buddy. Permission denied.\nThis system is protected by sheer good taste.'
            : 'Boa tentativa. Permissão negada.\nEste sistema é protegido pelo bom gosto.')
        } else {
          print(lang === 'en'
            ? 'We trust you have received the usual lecture from the local System\nAdministrator. It usually boils down to these three things:\n\n  #1) Respect the privacy of others.\n  #2) Think before you type.\n  #3) With great power comes great responsibility.\n\n[sudo] password for davi: ****\nSorry, try again.'
            : 'Esperamos que você tenha recebido a palestra habitual do Administrador\ndo Sistema. Geralmente se resume a três coisas:\n\n  #1) Respeite a privacidade dos outros.\n  #2) Pense antes de digitar.\n  #3) Com grande poder vem grande responsabilidade.\n\n[sudo] senha para davi: ****\nDesculpe, tente novamente.')
        }
        break

      case 'vim':
        print(lang === 'en'
          ? 'Opening vim...\n\n  ~\n  ~\n  ~\n  ~\n  ~\n  -- INSERT --\n\nStuck? Type  :q!  then press Enter. You\'re welcome.'
          : 'Abrindo vim...\n\n  ~\n  ~\n  ~\n  ~\n  ~\n  -- INSERIR --\n\nPreso? Digite  :q!  e pressione Enter. De nada.')
        break

      case ':q!':
        print(lang === 'en'
          ? 'E: Not in vim — but respect for knowing the command.'
          : 'E: Você não está no vim — mas respeito por saber o comando.')
        break

      case 'git':
        if (args[0] === 'log') {
          print(
            'commit a3f1c2d (HEAD -> main, origin/main)\n' +
            'Author: Davi Canuto <davicanutogregorio@gmail.com>\n' +
            'Date:   2024 – present\n\n' +
            '    feat: backend developer at Tootz Soluções\n\n' +
            'commit 7b2e9f1\n' +
            'Author: Davi Canuto <davicanutogregorio@gmail.com>\n' +
            'Date:   2023\n\n' +
            '    feat: published clicksign-ruby gem (1400+ downloads)\n\n' +
            'commit 5d8a3c4\n' +
            'Author: Davi Canuto <davicanutogregorio@gmail.com>\n' +
            'Date:   2022\n\n' +
            '    feat: built spotify-card with Next.js\n\n' +
            'commit 2c1b9e7\n' +
            'Author: Davi Canuto <davicanutogregorio@gmail.com>\n' +
            'Date:   2022\n\n' +
            '    init: started professional dev journey\n\n' +
            '(END)'
          )
        } else {
          print(lang === 'en' ? 'usage: git <command>\n  Try: git log' : 'uso: git <comando>\n  Tente: git log')
        }
        break

      case 'cowsay': {
        const msg = args.join(' ') || (lang === 'en' ? 'Hello, World!' : 'Olá, Mundo!')
        const border = '-'.repeat(msg.length + 2)
        print(
          ` ${border}\n` +
          `< ${msg} >\n` +
          ` ${border}\n` +
          '        \\   ^__^\n' +
          '         \\  (oo)\\_______\n' +
          '            (__)\\       )\\/\\\n' +
          '                ||----w |\n' +
          '                ||     ||'
        )
        break
      }

      case 'scanlines': {
        const next = !crtRef.current
        crtRef.current = next
        setCrtEnabled(next)
        print(next
          ? (lang === 'en' ? 'CRT effect enabled. Enjoy the retro vibes!' : 'Efeito CRT ativado. Aproveite o clima retrô!')
          : (lang === 'en' ? 'CRT effect disabled.' : 'Efeito CRT desativado.'))
        break
      }

      case 'matrix':
        setMatrixActive(true)
        break

      case 'hack':
        setHackActive(true)
        break

      case 'rickroll':
      case 'rick':
        setRickrollActive(true)
        break

      case 'coffee':
      case 'café':
      case 'cafe':
        print(<CoffeeOutput />)
        break

      case 'rm':
        if (args[0] === '-rf' && args[1] === '/') {
          print(lang === 'en'
            ? 'rm: it is dangerous to operate recursively on \'/\'\nrm: use --no-preserve-root to override this failsafe\n\n...just kidding. Nothing was deleted. This is a portfolio, not a death wish.'
            : 'rm: é perigoso operar recursivamente em \'/\'\nrm: use --no-preserve-root para ignorar essa proteção\n\n...brincadeira. Nada foi deletado. Isso é um portfólio, não um desejo de morte.')
        } else {
          print(lang === 'en' ? `rm: cannot remove '${args.join(' ')}': No such file` : `rm: não é possível remover '${args.join(' ')}': Arquivo não encontrado`)
        }
        break

      case 'curl': {
        const target = args[0] || ''
        if (target.includes('wttr.in')) {
          print(
            'Weather report: Natal, RN\n\n' +
            '      \\   /     Sunny\n' +
            '       .-.      +32(34) °C\n' +
            '    ― (   ) ―   ↗ 18 km/h\n' +
            '       `-\'      10 km\n' +
            '      /   \\     0.0 mm\n\n' +
            '  Mon  Tue  Wed\n' +
            '  🌣    🌣    ⛅\n' +
            ' +33° +32° +30°\n\n' +
            'Forecast: hot. Always hot. This is Natal.'
          )
        } else {
          print(lang === 'en' ? `curl: (6) Could not resolve host: ${target}` : `curl: (6) Não foi possível resolver: ${target}`)
        }
        break
      }

      case 'ssh': {
        const host = args[0] || ''
        if (host.includes('localhost') || host.includes('davi')) {
          print(lang === 'en'
            ? 'ssh: connect to host localhost port 22: Connection refused\n\nHint: I\'m right here. You don\'t need SSH.'
            : 'ssh: conectar ao host localhost porta 22: Conexão recusada\n\nDica: Estou bem aqui. Você não precisa de SSH.')
        } else {
          print(`ssh: connect to host ${host} port 22: Connection refused`)
        }
        break
      }

      case 'docker': {
        if (args[0] === 'ps') {
          print(
            'CONTAINER ID   IMAGE                  COMMAND                  CREATED        STATUS         PORTS                    NAMES\n' +
            'a1b2c3d4e5f6   portfolio:latest       "rails s -b 0.0.0.0"     2 years ago    Up 2 years     0.0.0.0:3000->3000/tcp   portfolio\n' +
            'b2c3d4e5f6a1   postgres:15            "docker-entrypoint.s…"   2 years ago    Up 2 years     5432/tcp                 db\n' +
            'c3d4e5f6a1b2   redis:7                "docker-entrypoint.s…"   2 years ago    Up 2 years     6379/tcp                 cache\n' +
            'd4e5f6a1b2c3   nginx:alpine           "/docker-entrypoint.…"   2 years ago    Up 2 years     0.0.0.0:443->443/tcp     proxy\n' +
            'e5f6a1b2c3d4   imposter:sus           "/bin/sh -c \'sleep ∞\'"   ??             Up always      —                        not-a-virus'
          )
        } else {
          print(lang === 'en' ? 'usage: docker <command>\n  Try: docker ps' : 'uso: docker <comando>\n  Tente: docker ps')
        }
        break
      }

      case 'npm': {
        if (args[0] === 'install' || args[0] === 'i') {
          print(<NpmInstall pkg={args[1]} />)
        } else {
          print(lang === 'en' ? 'usage: npm <command>\n  Try: npm install' : 'uso: npm <comando>\n  Tente: npm install')
        }
        break
      }

      case 'python':
      case 'python3': {
        print(
          'Python 3.12.0 (main, Oct  2 2023, 00:00:00)\n' +
          'Type "help", "copyright", "credits" or "license" for more information.\n' +
          '>>> print("hello, davi")\n' +
          'hello, davi\n' +
          '>>> import ruby\n' +
          'ModuleNotFoundError: No module named \'ruby\'. Have you tried just... using Ruby?\n' +
          '>>> exit()\n' +
          '(back to reality)'
        )
        break
      }

      case 'irb': {
        print(
          'irb(main):001> puts "hello, world"\n' +
          'hello, world\n' +
          '=> nil\n' +
          'irb(main):002> 2 + 2\n' +
          '=> 4\n' +
          'irb(main):003> "Ruby".chars.sort.join\n' +
          '=> "Rbuy"\n' +
          'irb(main):004> exit\n' +
          '(back to the terminal)'
        )
        break
      }

      case 'show': {
        const fullPaths = fs[lang]['/']
        for (const item of fullPaths) {
          const subdir = `/${item.replace('.txt', '')}`
          if (Array.isArray(fs[lang][subdir])) {
            print(`\n📁 ${item}`)
            for (const subfile of fs[lang][subdir]) {
              print(`\n📄 ${subfile}`)
              print(fs[lang][`${subdir}/${subfile}`])
            }
          } else {
            print(`\n📄 ${item}`)
            print(fs[lang][cwd === '/' ? item : `${cwd}/${item}`])
          }
        }
        break
      }

      default:
        print(lang === 'en'
          ? `Command not found: ${base}. Type 'help' for available commands.`
          : `Comando não encontrado: ${base}. Digite 'help' para ver os comandos.`)
    }
  }

  const runCommand = (cmd) => {
    print(`$ ${cmd}`)
    handleCommand(cmd)
    setHistory(h => {
      const newH = [...h, cmd]
      setHistoryIndex(newH.length)
      return newH
    })
  }

  // ─── Tab autocomplete ───────────────────────────────────────────
  const handleTab = (e) => {
    e.preventDefault()
    const parts = command.trimStart().split(/\s+/)
    const currentFS = fs[lang]

    if (parts.length === 1) {
      const partial = parts[0].toLowerCase()
      if (!partial) return
      const matches = COMMANDS.filter(c => c.startsWith(partial))
      if (matches.length === 1) {
        setCommand(matches[0] + ' ')
      } else if (matches.length > 1) {
        print(`$ ${command}`)
        print(matches.join('  '))
      }
    } else if (parts[0] === 'cat' || parts[0] === 'cd') {
      const partial = parts[1] || ''
      const listing = currentFS[cwd] || []
      const matches = listing.filter(f => f.startsWith(partial))
      const filtered = parts[0] === 'cd' ? matches.filter(f => !f.includes('.')) : matches

      if (filtered.length === 1) {
        setCommand(`${parts[0]} ${filtered[0]}`)
      } else if (filtered.length > 1) {
        print(`$ ${command}`)
        print(filtered.join('  '))
      }
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      handleTab(e)
    } else if (e.key === 'Enter') {
      const cmd = command.trim()
      setCommand('')
      if (cmd) runCommand(cmd)
    } else if (e.key === 'ArrowUp') {
      if (historyIndex > 0) {
        const i = historyIndex - 1
        setHistoryIndex(i)
        setCommand(history[i])
      }
      e.preventDefault()
    } else if (e.key === 'ArrowDown') {
      if (historyIndex < history.length - 1) {
        const i = historyIndex + 1
        setHistoryIndex(i)
        setCommand(history[i])
      } else {
        setHistoryIndex(history.length)
        setCommand('')
      }
      e.preventDefault()
    }
  }

  const displayCwd = cwd === '/' ? '~' : cwd

  const handleBootComplete = useCallback(() => {
    setBooting(false)
    setOutput([{ id: ++outputIdCounter, content: <FastfetchOutput lang={lang} /> }])
  }, [lang])

  if (booting) return <BootSequence onComplete={handleBootComplete} />

  return (
    <div
      className={`terminal${crtEnabled ? ' crt' : ''}`}
      onClick={() => inputRef.current?.focus()}
    >
      {matrixActive && (
        <MatrixRain onExit={() => {
          setMatrixActive(false)
          resetIdleTimer()
          setTimeout(() => inputRef.current?.focus(), 50)
        }} />
      )}

      {hackActive && (
        <HackSequence lang={lang} onComplete={() => {
          setHackActive(false)
          print(lang === 'en' ? 'ACCESS DENIED. Nice try.' : 'ACESSO NEGADO. Boa tentativa.')
          setTimeout(() => inputRef.current?.focus(), 50)
        }} />
      )}

      {rickrollActive && (
        <RickRollOverlay onExit={() => {
          setRickrollActive(false)
          print('🎵 Never gonna give you up... but you escaped.')
          setTimeout(() => inputRef.current?.focus(), 50)
        }} />
      )}

      <div className="top-bar">
        <label htmlFor="lang"><span className="prompt">🌐</span></label>
        <select
          id="lang"
          value={lang}
          onChange={(e) => { setLang(e.target.value); setCwd('/'); clear() }}
        >
          <option value="en">🇺🇸 English</option>
          <option value="pt">🇧🇷 Português</option>
        </select>
        <div className="button-panel">
          {buttons[lang].map((b) => (
            <button
              key={b.label}
              className="terminal-button"
              onClick={(e) => { e.stopPropagation(); b.cmds.forEach(runCommand) }}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      <div id="output" className="output" ref={outputRef}>
        {output.map(({ id, content }) => (
          typeof content === 'string'
            ? <TypewriterLine key={id} content={content} />
            : <div key={id}>{content}</div>
        ))}
      </div>

      <div className="input-line">
        <span className="prompt">davi@portfolio:<span className="cwd">{displayCwd}</span>$</span>
        <input
          ref={inputRef}
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
        />
      </div>

      <div className="status-bar">
        <span>davi@portfolio:<span className="cwd">{displayCwd}</span></span>
        <span>{lang === 'en' ? '🇺🇸 EN' : '🇧🇷 PT'} &nbsp;|&nbsp; {clock}</span>
      </div>
    </div>
  )
}
