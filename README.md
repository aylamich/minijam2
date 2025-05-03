# Projeto de Aquário Animado - HTML e Canvas

Este projeto contém dois componentes animados de aquário desenvolvidos para a matéria de HTML e Canvas. Ambos os componentes demonstram diferentes abordagens para criar animações.

## Componentes Disponíveis

1. **AquarioCanvas**: Renderiza peixes e elementos do aquário usando apenas Canvas API (desenhos vetoriais)
2. **AquarioFoto**: Utiliza imagens de peixes para criar a animação

## Como Testar Cada Componente

Para alternar entre os componentes, você precisa modificar o arquivo `App.js`:

```js
// Para usar o Aquario com desenhos (Canvas API)
import AquarioCanvas from './components/AquarioCanvas'

function App() {
  return <AquarioCanvas />
}

export default App

// Para usar o Aquario com fotos de peixes
import AquarioFoto from './components/AquarioFoto'

function App() {
  return <AquarioFoto />
}

export default App"# minijam2" 
