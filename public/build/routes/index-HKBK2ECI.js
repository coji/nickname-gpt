import {
  Box,
  Button,
  Container,
  FormControl,
  HStack,
  Heading,
  Input,
  Link,
  Stack,
  require_jsx_runtime
} from "/build/_shared/chunk-XOGACKGX.js";
import {
  require_jsx_dev_runtime,
  require_react,
  useLoaderData
} from "/build/_shared/chunk-B2GSMUBI.js";
import {
  __commonJS,
  __toESM
} from "/build/_shared/chunk-4IYZMDEG.js";

// node_modules/.pnpm/react-nl2br@1.0.4_react@18.2.0/node_modules/react-nl2br/index.js
var require_react_nl2br = __commonJS({
  "node_modules/.pnpm/react-nl2br@1.0.4_react@18.2.0/node_modules/react-nl2br/index.js"(exports, module) {
    "use strict";
    var jsxRuntime = require_jsx_runtime();
    var _jsx = jsxRuntime.jsx;
    var newlineRegex = /(\r\n|\r|\n)/g;
    module.exports = function(str) {
      if (typeof str !== "string") {
        return str;
      }
      return str.split(newlineRegex).map(function(line, index) {
        if (line.match(newlineRegex)) {
          return _jsx("br", { key: index });
        }
        return line;
      });
    };
  }
});

// node_modules/.pnpm/remix-typedjson@0.1.7_fh7rng5esma2cylftmg7vzq6cy/node_modules/remix-typedjson/dist/esm/typedjson.js
function applyMeta(data, meta) {
  for (const key of Object.keys(meta)) {
    applyConversion(data, key.split("."), meta[key]);
  }
  return data;
  function applyConversion(data2, keys, type, depth = 0) {
    const key = keys[depth];
    if (depth < keys.length - 1) {
      applyConversion(data2[key], keys, type, depth + 1);
      return;
    }
    const value = data2[key];
    switch (type) {
      case "date":
        data2[key] = new Date(value);
        break;
      case "set":
        data2[key] = new Set(value);
        break;
      case "map":
        data2[key] = new Map(Object.entries(value));
        break;
      case "regexp":
        const match = /^\/(.*)\/([dgimsuy]*)$/.exec(value);
        if (match) {
          data2[key] = new RegExp(match[1], match[2]);
        } else {
          throw new Error(`Invalid regexp: ${value}`);
        }
        break;
      case "bigint":
        data2[key] = BigInt(value);
        break;
      case "undefined":
        data2[key] = void 0;
        break;
      case "infinity":
        data2[key] = Number.POSITIVE_INFINITY;
        break;
      case "-infinity":
        data2[key] = Number.NEGATIVE_INFINITY;
        break;
      case "nan":
        data2[key] = NaN;
        break;
      case "error":
        const err = new Error(value.message);
        err.name = value.name;
        err.stack = value.stack;
        data2[key] = err;
        break;
    }
  }
}

// node_modules/.pnpm/remix-typedjson@0.1.7_fh7rng5esma2cylftmg7vzq6cy/node_modules/remix-typedjson/dist/esm/remix.js
function useTypedLoaderData() {
  const data = useLoaderData();
  return deserializeRemix(data);
}
function deserializeRemix(data) {
  if (!data)
    return data;
  if (data.__obj__) {
    return data.__meta__ ? applyMeta(data.__obj__, data.__meta__) : data.__obj__;
  } else if (data.__meta__) {
    const meta = data.__meta__;
    delete data.__meta__;
    return applyMeta(data, meta);
  }
  return data;
}

// node_modules/.pnpm/remix-utils@6.0.0_flygrhgisw2einn4xykxup6yra/node_modules/remix-utils/browser/react/use-event-source.js
var import_react2 = __toESM(require_react());
function useEventSource(url, { event = "message", init } = {}) {
  const [data, setData] = (0, import_react2.useState)(null);
  (0, import_react2.useEffect)(() => {
    const eventSource = new EventSource(url, init);
    eventSource.addEventListener(event !== null && event !== void 0 ? event : "message", handler);
    setData(null);
    function handler(event2) {
      setData(event2.data || "UNKNOWN_EVENT_DATA");
    }
    return () => {
      eventSource.removeEventListener(event !== null && event !== void 0 ? event : "message", handler);
      eventSource.close();
    };
  }, [url, event, init]);
  return data;
}

// app/routes/index.tsx
var import_react_nl2br = __toESM(require_react_nl2br());

// app/components/LoginPane.tsx
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime());
var LoginPane = (props) => {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(
    Stack,
    {
      direction: "row",
      justify: "end",
      align: "center",
      fontSize: "sm",
      color: "gray.500",
      ...props,
      children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, { size: "sm", variant: "outline", children: "Sign in" }, void 0, false, {
        fileName: "app/components/LoginPane.tsx",
        lineNumber: 35,
        columnNumber: 9
      }, this) }, void 0, false, {
        fileName: "app/components/LoginPane.tsx",
        lineNumber: 34,
        columnNumber: 7
      }, this)
    },
    void 0,
    false,
    {
      fileName: "app/components/LoginPane.tsx",
      lineNumber: 20,
      columnNumber: 5
    },
    this
  );
};

// app/routes/index.tsx
var import_jsx_dev_runtime2 = __toESM(require_jsx_dev_runtime());
function Index() {
  var _a;
  const loaderData = useTypedLoaderData();
  const result = (_a = useEventSource("/sse/time", { event: "time" })) != null ? _a : loaderData.time;
  return /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(import_jsx_dev_runtime2.Fragment, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(
    Container,
    {
      maxW: "container.md",
      display: "grid",
      gridTemplateRows: "auto auto 1fr auto",
      h: "100vh",
      children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(LoginPane, { py: "2" }, void 0, false, {
          fileName: "app/routes/index.tsx",
          lineNumber: 35,
          columnNumber: 9
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(Box, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(Heading, { py: "16", textAlign: "center", children: "Nickname GPT" }, void 0, false, {
          fileName: "app/routes/index.tsx",
          lineNumber: 38,
          columnNumber: 11
        }, this) }, void 0, false, {
          fileName: "app/routes/index.tsx",
          lineNumber: 37,
          columnNumber: 9
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(Box, { h: "full", p: "2", children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(Stack, { spacing: "16", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("form", { noValidate: true, autoComplete: "off", children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(FormControl, { id: "input", children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(HStack, { children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(
              Input,
              {
                autoFocus: true,
                placeholder: "\u3042\u306A\u305F\u306E\u540D\u524D\u3001\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u3001ID \u306A\u3069\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044"
              },
              void 0,
              false,
              {
                fileName: "app/routes/index.tsx",
                lineNumber: 48,
                columnNumber: 19
              },
              this
            ),
            /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(Button, { type: "submit", colorScheme: "blue", children: "Submit" }, void 0, false, {
              fileName: "app/routes/index.tsx",
              lineNumber: 52,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/index.tsx",
            lineNumber: 47,
            columnNumber: 17
          }, this) }, void 0, false, {
            fileName: "app/routes/index.tsx",
            lineNumber: 46,
            columnNumber: 15
          }, this) }, void 0, false, {
            fileName: "app/routes/index.tsx",
            lineNumber: 45,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(Box, { children: false ? "Loading..." : result === "" ? "AI \u304C\u3042\u306A\u305F\u306E Email \u3084 ID \u304B\u3089\u3001\u304B\u3063\u3053\u3044\u3044\u30CB\u30C3\u30AF\u30CD\u30FC\u30E0\u3092\u8003\u3048\u3066\u304F\u308C\u307E\u3059\u3002\u5165\u529B\u3057\u3066 Submit \u3057\u3066\u304F\u3060\u3055\u3044\u3002\u5165\u529B\u3055\u308C\u305F\u30C7\u30FC\u30BF\u306F\u3069\u3053\u306B\u3082\u4E00\u5207\u4FDD\u5B58\u3055\u308C\u307E\u305B\u3093\u3002" : (0, import_react_nl2br.default)(result) }, void 0, false, {
            fileName: "app/routes/index.tsx",
            lineNumber: 59,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/index.tsx",
          lineNumber: 44,
          columnNumber: 11
        }, this) }, void 0, false, {
          fileName: "app/routes/index.tsx",
          lineNumber: 43,
          columnNumber: 9
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(Box, { textAlign: "center", p: "2", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(Box, { children: [
            "Copyright \xA9",
            " ",
            /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(Link, { href: "https://twitter.com/techtalkjp", color: "blue.500", children: "coji" }, void 0, false, {
              fileName: "app/routes/index.tsx",
              lineNumber: 72,
              columnNumber: 13
            }, this),
            " "
          ] }, void 0, true, {
            fileName: "app/routes/index.tsx",
            lineNumber: 70,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(Box, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(Link, { href: "https://github.com/coji/nickname-gpt", color: "blue.500", children: "GitHub" }, void 0, false, {
            fileName: "app/routes/index.tsx",
            lineNumber: 77,
            columnNumber: 13
          }, this) }, void 0, false, {
            fileName: "app/routes/index.tsx",
            lineNumber: 76,
            columnNumber: 11
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/index.tsx",
          lineNumber: 69,
          columnNumber: 9
        }, this)
      ]
    },
    void 0,
    true,
    {
      fileName: "app/routes/index.tsx",
      lineNumber: 29,
      columnNumber: 7
    },
    this
  ) }, void 0, false, {
    fileName: "app/routes/index.tsx",
    lineNumber: 28,
    columnNumber: 5
  }, this);
}
export {
  Index as default
};
//# sourceMappingURL=/build/routes/index-HKBK2ECI.js.map
