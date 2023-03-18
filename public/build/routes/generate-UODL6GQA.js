import "/build/_shared/chunk-4IYZMDEG.js";

// node_modules/.pnpm/tiny-invariant@1.3.1/node_modules/tiny-invariant/dist/esm/tiny-invariant.js
var isProduction = false;
var prefix = "Invariant failed";
function invariant(condition, message) {
  if (condition) {
    return;
  }
  if (isProduction) {
    throw new Error(prefix);
  }
  var provided = typeof message === "function" ? message() : message;
  var value = provided ? "".concat(prefix, ": ").concat(provided) : prefix;
  throw new Error(value);
}

// app/routes/generate.ts
invariant(process.env.OPENAI_API_KEY, "Missing env var from OpenAI");
var handler = async (req) => {
  try {
    const { input } = await req.json();
    if (!input) {
      return new Response("No input in the request", { status: 400 });
    }
    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Something went wrong", { status: 500 });
  }
};
var generate_default = handler;
export {
  generate_default as default
};
//# sourceMappingURL=/build/routes/generate-UODL6GQA.js.map
