/**
 * AI Prompt Library Cloudflare Worker API
 * Provides REST endpoints for managing categories and prompts with KV storage
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle preflight requests
    if (method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Route handling
      if (path.startsWith('/api/categories')) {
        return await handleCategories(request, env, path, method, corsHeaders);
      } else if (path.startsWith('/api/prompts')) {
        return await handlePrompts(request, env, path, method, corsHeaders);
      } else if (path === '/api/health') {
        return new Response(JSON.stringify({ status: 'healthy', timestamp: new Date().toISOString() }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } else if (path === '/') {
        return new Response(JSON.stringify({ 
          name: 'AI Prompt Library API',
          version: '1.0.0',
          endpoints: {
            health: '/api/health',
            categories: '/api/categories',
            prompts: '/api/prompts'
          },
          documentation: 'https://github.com/czhengjuarez/prompt-library'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } else {
        return new Response('Not Found', { status: 404, headers: corsHeaders });
      }
    } catch (error) {
      console.error('Worker error:', error);
      return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  },
};

/**
 * Handle category-related requests
 */
async function handleCategories(request, env, path, method, corsHeaders) {
  const segments = path.split('/');
  const categoryId = segments[3]; // /api/categories/{id}

  switch (method) {
    case 'GET':
      if (categoryId) {
        return await getCategory(env, categoryId, corsHeaders);
      } else {
        return await getAllCategories(env, corsHeaders);
      }
    
    case 'POST':
      return await createCategory(request, env, corsHeaders);
    
    case 'PUT':
      if (categoryId) {
        return await updateCategory(request, env, categoryId, corsHeaders);
      }
      break;
    
    case 'DELETE':
      if (categoryId) {
        return await deleteCategory(env, categoryId, corsHeaders);
      }
      break;
  }

  return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
}

/**
 * Handle prompt-related requests
 */
async function handlePrompts(request, env, path, method, corsHeaders) {
  const segments = path.split('/');
  const promptId = segments[3]; // /api/prompts/{id}

  switch (method) {
    case 'GET':
      if (promptId) {
        return await getPrompt(env, promptId, corsHeaders);
      } else {
        return await getAllPrompts(env, corsHeaders);
      }
    
    case 'POST':
      return await createPrompt(request, env, corsHeaders);
    
    case 'PUT':
      if (promptId) {
        return await updatePrompt(request, env, promptId, corsHeaders);
      }
      break;
    
    case 'DELETE':
      if (promptId) {
        return await deletePrompt(env, promptId, corsHeaders);
      }
      break;
  }

  return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
}

// Category CRUD operations
async function getAllCategories(env, corsHeaders) {
  try {
    const categoriesData = await env.PROMPT_LIBRARY_KV.get('categories');
    const categories = categoriesData ? JSON.parse(categoriesData) : [];
    
    return new Response(JSON.stringify(categories), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch categories' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

async function getCategory(env, categoryId, corsHeaders) {
  try {
    const categoriesData = await env.PROMPT_LIBRARY_KV.get('categories');
    const categories = categoriesData ? JSON.parse(categoriesData) : [];
    const category = categories.find(cat => cat.id === categoryId);
    
    if (!category) {
      return new Response(JSON.stringify({ error: 'Category not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify(category), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch category' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

async function createCategory(request, env, corsHeaders) {
  try {
    const categoryData = await request.json();
    const newCategory = {
      id: crypto.randomUUID(),
      ...categoryData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const categoriesData = await env.PROMPT_LIBRARY_KV.get('categories');
    const categories = categoriesData ? JSON.parse(categoriesData) : [];
    categories.push(newCategory);
    
    await env.PROMPT_LIBRARY_KV.put('categories', JSON.stringify(categories));
    
    return new Response(JSON.stringify(newCategory), {
      status: 201,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create category' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

async function updateCategory(request, env, categoryId, corsHeaders) {
  try {
    const updateData = await request.json();
    const categoriesData = await env.PROMPT_LIBRARY_KV.get('categories');
    const categories = categoriesData ? JSON.parse(categoriesData) : [];
    
    const categoryIndex = categories.findIndex(cat => cat.id === categoryId);
    if (categoryIndex === -1) {
      return new Response(JSON.stringify({ error: 'Category not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    categories[categoryIndex] = {
      ...categories[categoryIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    await env.PROMPT_LIBRARY_KV.put('categories', JSON.stringify(categories));
    
    return new Response(JSON.stringify(categories[categoryIndex]), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to update category' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

async function deleteCategory(env, categoryId, corsHeaders) {
  try {
    const categoriesData = await env.PROMPT_LIBRARY_KV.get('categories');
    const categories = categoriesData ? JSON.parse(categoriesData) : [];
    
    const filteredCategories = categories.filter(cat => cat.id !== categoryId);
    if (filteredCategories.length === categories.length) {
      return new Response(JSON.stringify({ error: 'Category not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    await env.PROMPT_LIBRARY_KV.put('categories', JSON.stringify(filteredCategories));
    
    return new Response(JSON.stringify({ message: 'Category deleted successfully' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to delete category' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

// Prompt CRUD operations
async function getAllPrompts(env, corsHeaders) {
  try {
    const promptsData = await env.PROMPT_LIBRARY_KV.get('prompts');
    const prompts = promptsData ? JSON.parse(promptsData) : [];
    
    return new Response(JSON.stringify(prompts), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch prompts' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

async function getPrompt(env, promptId, corsHeaders) {
  try {
    const promptsData = await env.PROMPT_LIBRARY_KV.get('prompts');
    const prompts = promptsData ? JSON.parse(promptsData) : [];
    const prompt = prompts.find(p => p.id === promptId);
    
    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Prompt not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify(prompt), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch prompt' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

async function createPrompt(request, env, corsHeaders) {
  try {
    const promptData = await request.json();
    const newPrompt = {
      id: crypto.randomUUID(),
      ...promptData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const promptsData = await env.PROMPT_LIBRARY_KV.get('prompts');
    const prompts = promptsData ? JSON.parse(promptsData) : [];
    prompts.push(newPrompt);
    
    await env.PROMPT_LIBRARY_KV.put('prompts', JSON.stringify(prompts));
    
    return new Response(JSON.stringify(newPrompt), {
      status: 201,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create prompt' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

async function updatePrompt(request, env, promptId, corsHeaders) {
  try {
    const updateData = await request.json();
    const promptsData = await env.PROMPT_LIBRARY_KV.get('prompts');
    const prompts = promptsData ? JSON.parse(promptsData) : [];
    
    const promptIndex = prompts.findIndex(p => p.id === promptId);
    if (promptIndex === -1) {
      return new Response(JSON.stringify({ error: 'Prompt not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    prompts[promptIndex] = {
      ...prompts[promptIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    await env.PROMPT_LIBRARY_KV.put('prompts', JSON.stringify(prompts));
    
    return new Response(JSON.stringify(prompts[promptIndex]), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to update prompt' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

async function deletePrompt(env, promptId, corsHeaders) {
  try {
    const promptsData = await env.PROMPT_LIBRARY_KV.get('prompts');
    const prompts = promptsData ? JSON.parse(promptsData) : [];
    
    const filteredPrompts = prompts.filter(p => p.id !== promptId);
    if (filteredPrompts.length === prompts.length) {
      return new Response(JSON.stringify({ error: 'Prompt not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    await env.PROMPT_LIBRARY_KV.put('prompts', JSON.stringify(filteredPrompts));
    
    return new Response(JSON.stringify({ message: 'Prompt deleted successfully' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to delete prompt' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}
