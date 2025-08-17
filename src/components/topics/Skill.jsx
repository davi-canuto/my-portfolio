export default function Skill({ lang, type }) {
  const skills = {
    en: {
      soft: ['Communication', 'Teamwork', 'Problem Solving', 'Leadership'],
      hard: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'SQL', 'Git'],
    },
    pt: {
      soft: ['Comunicação', 'Trabalho em equipe', 'Resolução de problemas', 'Liderança'],
      hard: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'SQL', 'Git'],
    },
  }

  return (
    <div>
      <h2>🛠️ {lang === 'en' ? 'Skills' : 'Habilidades'} ({type})</h2>
      <ul>
        {skills[lang][type].map((skill, idx) => (
          <li key={idx}>{skill}</li>
        ))}
      </ul>
    </div>
  )
}