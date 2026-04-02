import './Project.css'

const projects = {
  titiltei: {
    en: {
      name: 'Titiltei',
      url: 'https://titiltei.com',
      role: 'Developer',
      stack: ['Next.js'],
      desc: 'Landing page built to promote the work of streamer Titiltei.',
      status: 'active',
    },
    pt: {
      name: 'Titiltei',
      url: 'https://titiltei.com',
      role: 'Desenvolvedor',
      stack: ['Next.js'],
      desc: 'Landing page criada para promover o trabalho do streamer Titiltei.',
      status: 'ativo',
    },
  },
  innovajus: {
    en: {
      name: 'InnovaJus Precatórios',
      url: 'https://www.innovajusprecatorios.com.br/',
      role: 'CTO',
      stack: ['Next.js', 'Ruby on Rails', 'PostgreSQL', 'Redis'],
      desc: 'Legal-tech platform for precatório management. As CTO, I lead the technical vision, architecture decisions, and development of the entire product.',
      status: 'active',
    },
    pt: {
      name: 'InnovaJus Precatórios',
      url: 'https://www.innovajusprecatorios.com.br/',
      role: 'CTO',
      stack: ['Next.js', 'Ruby on Rails', 'PostgreSQL', 'Redis'],
      desc: 'Plataforma legal-tech para gestão de precatórios. Como CTO, lidero a visão técnica, decisões de arquitetura e o desenvolvimento de todo o produto.',
      status: 'ativo',
    },
  },
  clicksign: {
    en: {
      name: 'clicksign_ruby',
      url: 'https://rubygems.org/gems/clicksign_ruby',
      role: 'Author',
      stack: ['Ruby', 'RubyGems'],
      desc: 'Fork of the deprecated official Clicksign gem, published on RubyGems. Actively maintained with 1400+ downloads.',
      status: 'open source',
    },
    pt: {
      name: 'clicksign_ruby',
      url: 'https://rubygems.org/gems/clicksign_ruby',
      role: 'Autor',
      stack: ['Ruby', 'RubyGems'],
      desc: 'Fork da gem oficial do Clicksign descontinuada, publicada no RubyGems. Mantida ativamente com mais de 1400 downloads.',
      status: 'open source',
    },
  },
  spotify: {
    en: {
      name: 'spotify-card',
      url: 'https://github.com/davi-canuto',
      role: 'Author',
      stack: ['Next.js', 'Spotify API'],
      desc: 'A widget that displays your currently playing Spotify track in real time.',
      status: 'open source',
    },
    pt: {
      name: 'spotify-card',
      url: 'https://github.com/davi-canuto',
      role: 'Autor',
      stack: ['Next.js', 'Spotify API'],
      desc: 'Widget que exibe em tempo real a música que você está ouvindo no Spotify.',
      status: 'open source',
    },
  },
  notebook: {
    en: {
      name: 'notebook-api',
      url: 'https://github.com/davi-canuto/notebook-api',
      role: 'Author',
      stack: ['Ruby on Rails', 'PostgreSQL'],
      desc: 'REST API for a contact book with phone numbers and addresses.',
      status: 'open source',
    },
    pt: {
      name: 'notebook-api',
      url: 'https://github.com/davi-canuto/notebook-api',
      role: 'Autor',
      stack: ['Ruby on Rails', 'PostgreSQL'],
      desc: 'API REST para agenda de contatos com telefones e endereços.',
      status: 'open source',
    },
  },
}

const statusColor = {
  active:       '#0f0',
  ativo:        '#0f0',
  'open source': '#4af',
}

export default function Project({ lang = 'en', id }) {
  const data = projects[id]?.[lang]
  if (!data) return null

  const color = statusColor[data.status] ?? '#888'

  return (
    <div className="project-card">
      <div className="project-header">
        <span className="project-name">{data.name}</span>
        <span className="project-status" style={{ color }}>● {data.status}</span>
      </div>
      <div className="project-meta">
        <span className="project-role-label">{lang === 'en' ? 'role' : 'cargo'}</span>
        <span className="project-role">{data.role}</span>
        <span className="project-sep">·</span>
        <span className="project-stack">{data.stack.join(' · ')}</span>
      </div>
      <div className="project-desc">{data.desc}</div>
      <div className="project-url">
        <span className="project-url-label">url </span>
        <a href={data.url} target="_blank" rel="noopener noreferrer" className="project-link">{data.url}</a>
      </div>
    </div>
  )
}
