import './App.css'
import Header from './componants/Header'

const studentData = {
  name: '24AIML016',
  title: 'AI & ML Student',
  navLinks: [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' },
  ],
}

function App() {
  return (
    <>
      <Header
        name={studentData.name}
        title={studentData.title}
        navLinks={studentData.navLinks}
      />

      <main id="home">
        <p>Portfolio content goes here…</p>
      </main>
    </>
  )
}

export default App
