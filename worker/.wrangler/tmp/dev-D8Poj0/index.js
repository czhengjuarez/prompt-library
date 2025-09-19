var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/bundle-8SbTwF/checked-fetch.js
var urls = /* @__PURE__ */ new Set();
function checkURL(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls.has(url.toString())) {
      urls.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
__name(checkURL, "checkURL");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    const [request, init] = argArray;
    checkURL(request, init);
    return Reflect.apply(target, thisArg, argArray);
  }
});

// .wrangler/tmp/bundle-8SbTwF/strip-cf-connecting-ip-header.js
function stripCfConnectingIPHeader(input, init) {
  const request = new Request(input, init);
  request.headers.delete("CF-Connecting-IP");
  return request;
}
__name(stripCfConnectingIPHeader, "stripCfConnectingIPHeader");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    return Reflect.apply(target, thisArg, [
      stripCfConnectingIPHeader.apply(null, argArray)
    ]);
  }
});

// src/index.js
var src_default = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    };
    if (method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }
    try {
      if (path.startsWith("/api/categories")) {
        return await handleCategories(request, env, path, method, corsHeaders);
      } else if (path.startsWith("/api/prompts")) {
        return await handlePrompts(request, env, path, method, corsHeaders);
      } else if (path === "/api/health") {
        return new Response(JSON.stringify({ status: "healthy", timestamp: (/* @__PURE__ */ new Date()).toISOString() }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      } else if (path === "/") {
        return new Response(JSON.stringify({
          name: "AI Prompt Library API",
          version: "1.0.0",
          endpoints: {
            health: "/api/health",
            categories: "/api/categories",
            prompts: "/api/prompts"
          },
          documentation: "https://github.com/czhengjuarez/prompt-library"
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      } else {
        return new Response("Not Found", { status: 404, headers: corsHeaders });
      }
    } catch (error) {
      console.error("Worker error:", error);
      return new Response(JSON.stringify({ error: "Internal Server Error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
  }
};
async function handleCategories(request, env, path, method, corsHeaders) {
  const segments = path.split("/");
  const categoryId = segments[3];
  switch (method) {
    case "GET":
      if (categoryId) {
        return await getCategory(env, categoryId, corsHeaders);
      } else {
        return await getAllCategories(env, corsHeaders);
      }
    case "POST":
      return await createCategory(request, env, corsHeaders);
    case "PUT":
      if (categoryId) {
        return await updateCategory(request, env, categoryId, corsHeaders);
      }
      break;
    case "DELETE":
      if (categoryId) {
        return await deleteCategory(env, categoryId, corsHeaders);
      }
      break;
  }
  return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
}
__name(handleCategories, "handleCategories");
async function handlePrompts(request, env, path, method, corsHeaders) {
  const segments = path.split("/");
  const promptId = segments[3];
  switch (method) {
    case "GET":
      if (promptId) {
        return await getPrompt(env, promptId, corsHeaders);
      } else {
        return await getAllPrompts(env, corsHeaders);
      }
    case "POST":
      return await createPrompt(request, env, corsHeaders);
    case "PUT":
      if (promptId) {
        return await updatePrompt(request, env, promptId, corsHeaders);
      }
      break;
    case "DELETE":
      if (promptId) {
        return await deletePrompt(env, promptId, corsHeaders);
      }
      break;
  }
  return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
}
__name(handlePrompts, "handlePrompts");
async function getAllCategories(env, corsHeaders) {
  try {
    const categoriesData = await env.PROMPT_LIBRARY_KV.get("categories");
    const categories = categoriesData ? JSON.parse(categoriesData) : [];
    return new Response(JSON.stringify(categories), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch categories" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
}
__name(getAllCategories, "getAllCategories");
async function getCategory(env, categoryId, corsHeaders) {
  try {
    const categoriesData = await env.PROMPT_LIBRARY_KV.get("categories");
    const categories = categoriesData ? JSON.parse(categoriesData) : [];
    const category = categories.find((cat) => cat.id === categoryId);
    if (!category) {
      return new Response(JSON.stringify({ error: "Category not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify(category), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch category" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
}
__name(getCategory, "getCategory");
async function createCategory(request, env, corsHeaders) {
  try {
    const categoryData = await request.json();
    const newCategory = {
      id: crypto.randomUUID(),
      ...categoryData,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const categoriesData = await env.PROMPT_LIBRARY_KV.get("categories");
    const categories = categoriesData ? JSON.parse(categoriesData) : [];
    categories.push(newCategory);
    await env.PROMPT_LIBRARY_KV.put("categories", JSON.stringify(categories));
    return new Response(JSON.stringify(newCategory), {
      status: 201,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to create category" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
}
__name(createCategory, "createCategory");
async function updateCategory(request, env, categoryId, corsHeaders) {
  try {
    const updateData = await request.json();
    const categoriesData = await env.PROMPT_LIBRARY_KV.get("categories");
    const categories = categoriesData ? JSON.parse(categoriesData) : [];
    const categoryIndex = categories.findIndex((cat) => cat.id === categoryId);
    if (categoryIndex === -1) {
      return new Response(JSON.stringify({ error: "Category not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    categories[categoryIndex] = {
      ...categories[categoryIndex],
      ...updateData,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    await env.PROMPT_LIBRARY_KV.put("categories", JSON.stringify(categories));
    return new Response(JSON.stringify(categories[categoryIndex]), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to update category" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
}
__name(updateCategory, "updateCategory");
async function deleteCategory(env, categoryId, corsHeaders) {
  try {
    const categoriesData = await env.PROMPT_LIBRARY_KV.get("categories");
    const categories = categoriesData ? JSON.parse(categoriesData) : [];
    const filteredCategories = categories.filter((cat) => cat.id !== categoryId);
    if (filteredCategories.length === categories.length) {
      return new Response(JSON.stringify({ error: "Category not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    await env.PROMPT_LIBRARY_KV.put("categories", JSON.stringify(filteredCategories));
    return new Response(JSON.stringify({ message: "Category deleted successfully" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to delete category" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
}
__name(deleteCategory, "deleteCategory");
async function getAllPrompts(env, corsHeaders) {
  try {
    const promptsData = await env.PROMPT_LIBRARY_KV.get("prompts");
    const prompts = promptsData ? JSON.parse(promptsData) : [];
    return new Response(JSON.stringify(prompts), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch prompts" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
}
__name(getAllPrompts, "getAllPrompts");
async function getPrompt(env, promptId, corsHeaders) {
  try {
    const promptsData = await env.PROMPT_LIBRARY_KV.get("prompts");
    const prompts = promptsData ? JSON.parse(promptsData) : [];
    const prompt = prompts.find((p) => p.id === promptId);
    if (!prompt) {
      return new Response(JSON.stringify({ error: "Prompt not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify(prompt), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch prompt" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
}
__name(getPrompt, "getPrompt");
async function createPrompt(request, env, corsHeaders) {
  try {
    const promptData = await request.json();
    const newPrompt = {
      id: crypto.randomUUID(),
      ...promptData,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const promptsData = await env.PROMPT_LIBRARY_KV.get("prompts");
    const prompts = promptsData ? JSON.parse(promptsData) : [];
    prompts.push(newPrompt);
    await env.PROMPT_LIBRARY_KV.put("prompts", JSON.stringify(prompts));
    return new Response(JSON.stringify(newPrompt), {
      status: 201,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to create prompt" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
}
__name(createPrompt, "createPrompt");
async function updatePrompt(request, env, promptId, corsHeaders) {
  try {
    const updateData = await request.json();
    const promptsData = await env.PROMPT_LIBRARY_KV.get("prompts");
    const prompts = promptsData ? JSON.parse(promptsData) : [];
    const promptIndex = prompts.findIndex((p) => p.id === promptId);
    if (promptIndex === -1) {
      return new Response(JSON.stringify({ error: "Prompt not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    prompts[promptIndex] = {
      ...prompts[promptIndex],
      ...updateData,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    await env.PROMPT_LIBRARY_KV.put("prompts", JSON.stringify(prompts));
    return new Response(JSON.stringify(prompts[promptIndex]), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to update prompt" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
}
__name(updatePrompt, "updatePrompt");
async function deletePrompt(env, promptId, corsHeaders) {
  try {
    const promptsData = await env.PROMPT_LIBRARY_KV.get("prompts");
    const prompts = promptsData ? JSON.parse(promptsData) : [];
    const filteredPrompts = prompts.filter((p) => p.id !== promptId);
    if (filteredPrompts.length === prompts.length) {
      return new Response(JSON.stringify({ error: "Prompt not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    await env.PROMPT_LIBRARY_KV.put("prompts", JSON.stringify(filteredPrompts));
    return new Response(JSON.stringify({ message: "Prompt deleted successfully" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to delete prompt" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
}
__name(deletePrompt, "deletePrompt");

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-8SbTwF/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = src_default;

// node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-8SbTwF/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof __Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
__name(__Facade_ScheduledController__, "__Facade_ScheduledController__");
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = (request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    };
    #dispatcher = (type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    };
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
