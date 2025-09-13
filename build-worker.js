#!/usr/bin/env node

/**
 * Build script to create a Cloudflare Worker with embedded static assets
 */

import fs from 'fs';
import path from 'path';

// Read the built files
const htmlContent = fs.readFileSync('./dist/index.html', 'utf8');
const cssContent = fs.readFileSync('./dist/assets/index-B7hv4zRb.css', 'utf8');
const jsContent = fs.readFileSync('./dist/assets/index-C6NFAEaz.js', 'utf8');
const favicoContent = fs.readFileSync('./dist/favico.svg', 'utf8');

// Escape content for JavaScript strings
function escapeForJS(content) {
  return content
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$/g, '\\$');
}

// Create the worker content
const workerContent = `/**
 * AI Prompt Library Frontend Worker
 * Serves the React application as static files
 */

// HTML content
const HTML_CONTENT = \`${escapeForJS(htmlContent)}\`;

// Favicon SVG content
const FAVICON_SVG = \`${escapeForJS(favicoContent)}\`;

// CSS content
const CSS_CONTENT = \`${escapeForJS(cssContent)}\`;

// JS content  
const JS_CONTENT = \`${escapeForJS(jsContent)}\`;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Handle different routes
    if (path === '/' || path === '/index.html') {
      return new Response(HTML_CONTENT, {
        headers: {
          'Content-Type': 'text/html',
          'Cache-Control': 'public, max-age=86400'
        }
      });
    }

    // Handle favicon
    if (path === '/favico.svg') {
      return new Response(FAVICON_SVG, {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=31536000'
        }
      });
    }

    // Handle CSS
    if (path === '/assets/index-B7hv4zRb.css') {
      return new Response(CSS_CONTENT, {
        headers: {
          'Content-Type': 'text/css',
          'Cache-Control': 'public, max-age=31536000'
        }
      });
    }

    // Serve JS file
    if (path === '/assets/index-C6NFAEaz.js') {
      return new Response(JS_CONTENT, {
        headers: {
          'Content-Type': 'application/javascript',
          'Cache-Control': 'public, max-age=31536000'
        }
      });
    }

    // For any other route, serve the main HTML (SPA routing)
    return new Response(HTML_CONTENT, {
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'public, max-age=86400'
      }
    });
  },
};`;

// Write the worker file
fs.writeFileSync('./frontend-worker/src/index.js', workerContent);

console.log('✅ Worker built successfully with embedded assets!');
console.log('📁 Output: ./frontend-worker/src/index.js');
