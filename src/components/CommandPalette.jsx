import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  FiHome,
  FiUser,
  FiGrid,
  FiMail,
  FiPhone,
  FiGithub,
  FiLinkedin,
  FiInstagram,
  FiMoon,
  FiSun,
  FiMousePointer,
} from 'react-icons/fi'
import { useTheme } from '../helpers/ThemeContext'
import { useCursor } from '../helpers/CursorContext'

const EMAIL = 'burtynoleksandr@gmail.com'
const PHONE = '+43 660 7890132'

const isMac = typeof navigator !== 'undefined' && /mac/i.test(navigator.platform)

// Best-effort clipboard copy with a legacy fallback for non-secure contexts.
const copy = async (text) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return
    }
  } catch (e) { /* fall through */ }
  const ta = document.createElement('textarea')
  ta.value = text
  ta.style.position = 'fixed'
  ta.style.opacity = '0'
  document.body.appendChild(ta)
  ta.select()
  try { document.execCommand('copy') } catch (e) { /* ignore */ }
  document.body.removeChild(ta)
}

const CommandPalette = () => {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const [toast, setToast] = useState(null)
  const inputRef = useRef(null)
  const listRef = useRef(null)
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const { cursorEnabled, toggleCursor } = useCursor()

  const showToast = useCallback((msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 1600)
  }, [])

  const openExternal = (url) => window.open(url, '_blank', 'noopener,noreferrer')

  // Full command set, grouped by section. `keep` = don't close after running.
  const commands = useMemo(() => [
    { id: 'home', section: 'Navigate', label: 'Home', hint: '/', icon: <FiHome />, run: () => navigate('/') },
    { id: 'me', section: 'Navigate', label: 'About & Contact', hint: '/me', icon: <FiUser />, run: () => navigate('/me') },
    { id: 'projects', section: 'Navigate', label: 'Projects', hint: '/projects', icon: <FiGrid />, run: () => navigate('/projects') },
    {
      id: 'theme',
      section: 'Actions',
      label: theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode',
      icon: theme === 'dark' ? <FiSun /> : <FiMoon />,
      run: toggleTheme,
      keep: true,
    },
    {
      id: 'cursor',
      section: 'Actions',
      label: cursorEnabled ? 'Disable custom cursor' : 'Enable custom cursor',
      icon: <FiMousePointer />,
      run: toggleCursor,
      keep: true,
    },
    { id: 'email', section: 'Actions', label: 'Copy email', hint: EMAIL, icon: <FiMail />, run: () => { copy(EMAIL); showToast('Copied email') }, keep: true },
    { id: 'phone', section: 'Actions', label: 'Copy phone number', hint: PHONE, icon: <FiPhone />, run: () => { copy(PHONE); showToast('Copied phone number') }, keep: true },
    { id: 'github', section: 'Socials', label: 'GitHub', icon: <FiGithub />, run: () => openExternal('https://github.com/Hisokaqq') },
    { id: 'linkedin', section: 'Socials', label: 'LinkedIn', icon: <FiLinkedin />, run: () => openExternal('https://www.linkedin.com/in/alexandr-burtyn-397534266/') },
    { id: 'instagram', section: 'Socials', label: 'Instagram', icon: <FiInstagram />, run: () => openExternal('https://www.instagram.com/hisokaxix/') },
  ], [theme, navigate, toggleTheme, showToast, cursorEnabled, toggleCursor])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return commands
    return commands.filter((c) =>
      c.label.toLowerCase().includes(q) || (c.hint && c.hint.toLowerCase().includes(q))
    )
  }, [query, commands])

  const runCommand = useCallback((cmd) => {
    if (!cmd) return
    if (!cmd.keep) setOpen(false)
    cmd.run()
  }, [])

  // Global ⌘K / Ctrl+K toggle.
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Navigation keys, handled at the window level while open so they work
  // regardless of what (if anything) currently holds focus.
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); setOpen(false); return }
      if (!filtered.length) return
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => (a + 1) % filtered.length) }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => (a - 1 + filtered.length) % filtered.length) }
      else if (e.key === 'Enter') { e.preventDefault(); runCommand(filtered[active]) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, filtered, active, runCommand])

  // Reset + focus when opening; toggle the body flag that hides the custom
  // cursor and restores the native pointer inside the palette.
  useEffect(() => {
    document.body.classList.toggle('cmdk-open', open)
    if (open) {
      setQuery('')
      setActive(0)
      const t = setTimeout(() => inputRef.current?.focus(), 20)
      return () => clearTimeout(t)
    }
  }, [open])

  useEffect(() => () => document.body.classList.remove('cmdk-open'), [])

  // Keep the active index in range as the filtered list changes.
  useEffect(() => { setActive((a) => Math.min(a, Math.max(0, filtered.length - 1))) }, [filtered.length])

  // Keep the active row scrolled into view.
  useEffect(() => {
    const el = listRef.current?.querySelector('[data-active="true"]')
    el?.scrollIntoView({ block: 'nearest' })
  }, [active, filtered])

  // Track the running flat index so grouped rendering keeps a single selection.
  let flatIndex = -1
  let lastSection = null

  return createPortal(
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            type="button"
            className="cmdk-trigger"
            data-cursor
            aria-label="Open command palette"
            onClick={() => setOpen(true)}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25 }}
          >
            <kbd>{isMac ? '⌘' : 'Ctrl'}</kbd>
            <kbd>K</kbd>
            <span className="cmdk-trigger-label">menu</span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            className="cmdk-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onMouseDown={(e) => { if (e.target === e.currentTarget) setOpen(false) }}
          >
            <motion.div
              className="cmdk-panel"
              role="dialog"
              aria-modal="true"
              aria-label="Command palette"
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
            >
              <input
                ref={inputRef}
                className="cmdk-input"
                placeholder="Type a command or search…"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setActive(0) }}
                aria-label="Search commands"
              />
              <div className="cmdk-list" ref={listRef}>
                {filtered.length === 0 && <div className="cmdk-empty">No results</div>}
                {filtered.map((cmd) => {
                  flatIndex += 1
                  const idx = flatIndex
                  const isActive = idx === active
                  const showSection = cmd.section !== lastSection
                  lastSection = cmd.section
                  return (
                    <div key={cmd.id}>
                      {showSection && <div className="cmdk-section">{cmd.section}</div>}
                      <button
                        type="button"
                        data-active={isActive}
                        className={`cmdk-item${isActive ? ' cmdk-item-active' : ''}`}
                        onMouseMove={() => setActive(idx)}
                        onClick={() => runCommand(cmd)}
                      >
                        <span className="cmdk-icon">{cmd.icon}</span>
                        <span>{cmd.label}</span>
                        {cmd.hint && <span className="cmdk-hint">{cmd.hint}</span>}
                      </button>
                    </div>
                  )
                })}
              </div>
              <div className="cmdk-footer">
                <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
                <span><kbd>↵</kbd> select</span>
                <span><kbd>esc</kbd> close</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            className="cmdk-toast"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.2 }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </>,
    document.body
  )
}

export default CommandPalette
