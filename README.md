# AI Chat Companions

Crie uma aplicação web profissional e totalmente responsiva (Desktop e Mobile) para chat com Avatares de IA em Dark Mode. 

REQUISITOS DE ARQUITETURA E INTERFACE:

1. COMPATIBILIDADE DESKTOP E MOBILE:

   - Em dispositivos móveis: Layout estilo aplicativo nativo com menu lateral retrátil (Drawer) e navegação por abas.

   - Em Desktop: Layout expandido aproveitando a tela ampla, com barra lateral de navegação e visualização limpa de painel duplo.

2. CÉREBRO MODULAR DE IA (DESCOUPLING):

   - Crie uma estrutura desacoplada na qual a interface gráfica seja 100% independente do provedor de IA.

   - Inclua uma tela ou modal de 'Configurações de IA' que permita ao usuário selecionar o Provedor/Modelo de IA (ex: OpenRouter, OpenAI, Groq, Ollama, endpoints customizados) e inserir as respectivas chaves de API / URLs de conexão.

3. TELA DE CHAT (AVATAR CHAT):

   - Fundo com a foto/arte do avatar e efeito degradê/blur elegante.

   - Balões de mensagem com efeito de vidro semi-transparente (glassmorphism/backdrop-blur) e visual escuro.

   - Barra de digitação inferior fixa com botão de anexar/mais ('+').

   - Menu flutuante no '+' com opções: '✨ Pedir Mídia' (que abre pop-up de confirmação de mídia exclusiva) e '🎙️ Áudio'.

4. TELA DE PERFIL DO AVATAR (AVATAR PROFILE):

   - Card moderno com imagem, tags, avaliação (⭐ 4.9) e métricas.

   - Caixa dedicada para 'História & Personalidade' com altura máxima e barra de rolagem interna (scroll) funcional.

   - Rodapé com três botões: '💬 Iniciar Conversa', 'OK' e '🚫 Bloquear'.

5. MENU LATERAL (DRAWER):

   - Contendo apenas as 6 opções essenciais: Galeria, Minhas Conversas, Criar Avatar, Meu Perfil, Persona e Upgrades.

Garanta um código React limpo, modular, com tratamento de erros visual e sem telas brancas.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/d7bda39f-3d53-4340-aea3-f6901296d676).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
