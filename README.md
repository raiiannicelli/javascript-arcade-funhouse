# JavaScript Arcade Funhouse

Bem-vindo ao **JavaScript Arcade Funhouse**, uma coletânea de jogos clássicos (Pong, Snake, Flappy Bird, e mais!) construídos com HTML, CSS e JavaScript puros.

---

###
## 📋 Pré-requisitos

- **Git** instalado  
- **Node.js** (v14 ou superior) e **npm**  
- Navegador moderno (Chrome, Firefox, Edge, Safari, etc.)

---

###
## 🔽 1. Clonar o repositório

No seu terminal, digite:

```bash
git clone https://github.com/raiiannicelli/javascript-arcade-house.git
cd javascript-arcade-funhouse

⚙️ 2. Instalar dependências e gerar build
Instale as dependências do projeto:

npm install
Execute o build para gerar a pasta dist/:

npm run build
Os arquivos finais ficarão em dist/, prontos para publicação.

###
**▶️ 3. Executar localmente**
Opção A: Abrir diretamente
Navegue até a pasta do jogo desejado (por exemplo, pong/ ou snake/) e abra o index.html no navegador.

Opção B: Servidor HTTP simples
Alguns recursos (como áudio) funcionam melhor via HTTP. Na raiz do projeto, rode:

# Python 3
python -m http.server 8000

# se preferir usar o npm:
npm install --global serve
serve -s dist -l 8000

Depois, abra no navegador:
http://localhost:8000/pong/
http://localhost:8000/snake/

###
**🌐 4. Publicar no GitHub Pages**
4.1. Criar branch gh-pages
git checkout --orphan gh-pages
git rm -rf .
cp -r dist/* .
git add .
git commit -m "Deploy para GitHub Pages"
git push origin gh-pages --force

4.2. Configurar no GitHub
Acesse Settings > Pages no repositório.

Em Source, escolha:
Branch: gh-pages
Folder: / (root)
Clique em salvar

Após alguns minutos, seu site estará disponível em:
https://<seu-nome>.github.io/arcade-house/

###
**📝 Estrutura do Repositório**
javascript-arcade-funhouse/
├── dist/          # Build gerado (usado no deploy)
├── pong/          # Código-fonte do Pong
│   ├── index.html
│   └── script.js
├── snake/         # Código-fonte do Snake
│   ├── index.html
│   └── script.js
├── flappybird/    # Código-fonte do Flappy Bird
│   ├── index.html
│   └── script.js
├── package.json
└── README.md      # Este arquivo

###
**🤝 Contribuições**
Fork este repositório

Crie uma branch: git checkout -b feature/nome-da-feature

Faça suas alterações e commite: git commit -m "Descrição da feature"

Push para sua branch: git push origin feature/nome-da-feature

Abra um Pull Request
