export default function About({ lang }) {
  return (
    <div>
      <h2>👋 About Me</h2>
      {lang === 'en' ? (
        <p>I’m a full-stack dev who loves React and backend APIs.</p>
      ) : (
        <p>Sou um desenvolvedor full-stack que adora React e APIs backend.</p>
      )}
    </div>
  )
}