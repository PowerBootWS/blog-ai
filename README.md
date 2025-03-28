# Blog Planner AI

An AI-powered blog planning interface that helps users plan and organize their blog content through conversation.

## Features

- User authentication (login/register)
- Chat interface with AI
- Blog plan generation based on conversation
- Export options for generated plans
- New conversation button
- External API integration

## Docker Deployment

### Prerequisites

- Docker
- Docker Compose

### Running with Docker Compose

1. Clone the repository
2. Navigate to the project directory
3. Run the following command:

```bash
docker-compose up -d
```

This will build the Docker image and start the container. The application will be available at http://localhost:8080.

### Building and Running Manually

If you prefer to build and run the Docker image manually:

1. Build the Docker image:

```bash
docker build -t blog-planner-ai .
```

2. Run the container:

```bash
docker run -p 8080:80 blog-planner-ai
```

## Development

### Prerequisites

- Node.js (v16 or later)
- npm

### Setup

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.
