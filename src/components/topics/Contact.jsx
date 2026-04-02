import './Contact.css'

const links = {
  en: [
    { label: 'Email',    value: 'davicanutogregorio@gmail.com', url: 'mailto:davicanutogregorio@gmail.com' },
    { label: 'GitHub',   value: 'github.com/davi-canuto',       url: 'https://github.com/davi-canuto' },
    { label: 'LinkedIn', value: 'in/davi-canuto',               url: 'https://www.linkedin.com/in/davi-canuto-b10ab11b7/' },
    { label: 'Twitter',  value: '@davicanut0',                  url: 'https://x.com/davicanut0' },
  ],
  pt: [
    { label: 'Email',    value: 'davicanutogregorio@gmail.com', url: 'mailto:davicanutogregorio@gmail.com' },
    { label: 'GitHub',   value: 'github.com/davi-canuto',       url: 'https://github.com/davi-canuto' },
    { label: 'LinkedIn', value: 'in/davi-canuto',               url: 'https://www.linkedin.com/in/davi-canuto-b10ab11b7/' },
    { label: 'Twitter',  value: '@davicanut0',                  url: 'https://x.com/davicanut0' },
  ],
}

export default function Contact({ lang = 'en' }) {
  const items = links[lang]

  return (
    <div className="contact-card">
      {items.map(({ label, value, url }) => (
        <div key={label} className="contact-row">
          <span className="contact-label">{label}</span>
          <span className="contact-sep"> → </span>
          <a href={url} target="_blank" rel="noopener noreferrer" className="contact-link">
            {value}
          </a>
        </div>
      ))}
    </div>
  )
}
