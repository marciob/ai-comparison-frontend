# AI Model Comparison Tool

An open-source web application for comparing responses from different AI models in real-time.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

## Features

- Compare responses from multiple AI models side by side
- Support for OpenAI, DeepSeek, and Claude models
- Adjustable temperature settings for each model
- Secure API key management
- Real-time response streaming

## Prerequisites

- Node.js 18+
- pnpm 8+

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/ai-compare.git
   cd ai-compare
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Start the development server:

   ```bash
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Keys

The application requires API keys for the AI providers you want to use:

1. OpenAI: [Get API key](https://platform.openai.com/api-keys)
2. DeepSeek: [Get API key](https://platform.deepseek.com/)
3. Claude: [Get API key](https://console.anthropic.com/settings/keys)

API keys are:

- Encrypted and stored locally in your browser
- Tied to your specific browser/device
- Not transferable between devices

⚠️ **Security Warning**: Do not use this application on public or shared computers.

## Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Development

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier

## Tech Stack

- Next.js 14
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- pnpm

## License

This project is licensed under the MIT License.
