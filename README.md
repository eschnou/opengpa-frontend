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
docker build --build-arg -t opengpa-frontend:latest .
docker run -p 8000:8000 opengpa-frontend
```

### For development purposes

```
npm init
npm run dev
```

## Configuration

The following environment variables can be configured. See app.config.ts for details.

- VITE_SIGNUP_ENABLED default to "true" - is the signup form available
- VITE_REQUIRE_INVITE_CODE default to "true" - ask for invites code (should be enforce on backend)
- VITE_API_URL defaults to "http://localhost:3000" - the backend API URL