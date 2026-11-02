export default function Footer({ theme = 'light' }) {
  const styles =
    theme === 'dark'
      ? 'border-white/10 text-white/40 hover:text-white/70'
      : 'border-[#1A1A1A]/10 text-[#1A1A1A]/50 hover:text-[#1A1A1A]/80'

  return (
    <footer className={`border-t mt-16 py-6 text-center text-sm ${styles}`}>
      <a
        href="https://digitalheroesco.com"
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2"
      >
        Built for Digital Heroes Training Task
      </a>
    </footer>
  )
}
