# AI Prompt Library Cloudflare Worker

A serverless API built with Cloudflare Workers to provide backend functionality for the AI Prompt Library application.

## Features

- **RESTful API** for categories and prompts management
- **Cloudflare KV Storage** for persistent data storage
- **CORS Support** for frontend integration
- **UUID Generation** for unique identifiers
- **Error Handling** with proper HTTP status codes
- **Health Check** endpoint for monitoring

## API Endpoints

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/{id}` - Get specific category
- `POST /api/categories` - Create new category
- `PUT /api/categories/{id}` - Update category
- `DELETE /api/categories/{id}` - Delete category

### Prompts
- `GET /api/prompts` - Get all prompts
- `GET /api/prompts/{id}` - Get specific prompt
- `POST /api/prompts` - Create new prompt
- `PUT /api/prompts/{id}` - Update prompt
- `DELETE /api/prompts/{id}` - Delete prompt

### Health
- `GET /api/health` - Health check endpoint

## Setup

### Prerequisites
- Cloudflare account
- Wrangler CLI installed globally: `npm install -g wrangler`

### Installation

1. Navigate to the worker directory:
```bash
cd worker
```

2. Install dependencies:
```bash
npm install
```

3. Login to Cloudflare:
```bash
wrangler login
```

4. Create a KV namespace:
```bash
wrangler kv:namespace create "PROMPT_LIBRARY_KV"
wrangler kv:namespace create "PROMPT_LIBRARY_KV" --preview
```

5. Update `wrangler.toml` with your KV namespace IDs from step 4

6. Deploy the worker:
```bash
npm run deploy
```

## Development

Run the worker locally:
```bash
npm run dev
```

View logs:
```bash
npm run tail
```

## Configuration

Update `wrangler.toml` with your specific settings:
- Replace KV namespace IDs with your actual namespace IDs
- Modify environment variables as needed
- Update the worker name if desired

## Data Structure

### Category Object
```json
{
  "id": "uuid",
  "name": "string",
  "purpose": "string",
  "createdAt": "ISO string",
  "updatedAt": "ISO string"
}
```

### Prompt Object
```json
{
  "id": "uuid",
  "title": "string",
  "purpose": "string",
  "categoryId": "uuid",
  "aiPersona": "string",
  "prompt": "string",
  "outputFormat": "string",
  "example": "string",
  "reference": "string",
  "customFields": "object",
  "createdAt": "ISO string",
  "updatedAt": "ISO string"
}
```

## Security

- CORS headers configured for cross-origin requests
- Input validation and error handling
- No authentication required (adjust as needed for production)

## Monitoring

Use the health check endpoint to monitor worker status:
```bash
curl https://your-worker.your-subdomain.workers.dev/api/health
```
