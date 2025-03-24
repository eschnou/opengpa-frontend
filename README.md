# OpenGPA - (Open) Agentic is all you need 😁

[![Twitter Follow](https://img.shields.io/twitter/follow/opengpa?style=social)](https://twitter.com/opengpa) &ensp;
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**OpenGPA** is an Open-source General Purpose Agent. A self-hosted solution supporting smart AI agent developments
with chain of thought, tool use and memory access through RAG.

## Documentation

Check the main [OpenGPA](https://github.com/eschnou/opengpa) for complete documentation on running this project.

## Launching the UI

### With docker

```
docker build --build-arg VITE_API_URL=http://localhost:3000 -t opengpa-frontend:latest .
docker run -p 8000:8000 opengpa-frontend
```

If you are running OpenGPA backend on an other server, update the VITE_API_URL to point to your instance.

### For development purposes

```
npm install
npm run dev
```

## Configuration

The following environment variables can be configured. See app.config.ts for details.

- VITE_SIGNUP_ENABLED default to "true" - is the signup form available
- VITE_REQUIRE_INVITE_CODE default to "false" - ask for invites code (should also be enforced on backend)
- VITE_API_URL defaults to "http://localhost:3000" - the backend API URL

# License

MIT License

Copyright (c) 2024-2025 Laurent Eschenauer

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.