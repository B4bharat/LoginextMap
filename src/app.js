import Table from './components/Table'
import Search from './components/Search'

async function App() {
  const template = document.createElement('template')
  template.innerHTML = `
    <div class="container">
      ${Search()}
      ${Table()}
    </div>
  `
  
  // Return a new node from template
  return template.content.cloneNode(true)
}

export default App;