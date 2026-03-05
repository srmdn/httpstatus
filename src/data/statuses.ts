export type Category = '1xx' | '2xx' | '3xx' | '4xx' | '5xx';

export interface StatusCode {
  code: number;
  name: string;
  category: Category;
  description: string;
  whenToUse: string;
  commonMistakes: string;
  example: string;
}

export const CATEGORY_META: Record<Category, { label: string; color: string; bg: string; border: string }> = {
  '1xx': { label: 'Informational', color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' },
  '2xx': { label: 'Success',       color: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0' },
  '3xx': { label: 'Redirection',   color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
  '4xx': { label: 'Client Error',  color: '#EA580C', bg: '#FFF7ED', border: '#FED7AA' },
  '5xx': { label: 'Server Error',  color: '#DC2626', bg: '#FEF2F2', border: '#FECACA' },
};

export const STATUS_CODES: StatusCode[] = [
  // 1xx
  {
    code: 100, name: 'Continue', category: '1xx',
    description: 'The server has received the request headers and the client should proceed to send the request body.',
    whenToUse: 'Use when the client needs to send a large request body and wants to check if the server will accept it before sending.',
    commonMistakes: 'Rarely needed in modern APIs. Most clients and servers handle this automatically. Don\'t implement it unless you\'re dealing with large file uploads that need pre-validation.',
    example: 'Client sends headers with "Expect: 100-continue" before uploading a 500MB file. Server responds 100 to confirm it will accept the upload.',
  },
  {
    code: 101, name: 'Switching Protocols', category: '1xx',
    description: 'The server agrees to switch protocols as requested by the client via the Upgrade header.',
    whenToUse: 'Used when upgrading from HTTP/1.1 to WebSocket or HTTP/2.',
    commonMistakes: 'Don\'t use for anything other than protocol upgrades. The Upgrade header must be included in the request.',
    example: 'Client requests upgrade to WebSocket. Server responds 101 and the connection switches to the WebSocket protocol.',
  },
  {
    code: 103, name: 'Early Hints', category: '1xx',
    description: 'Allows the server to send preliminary response headers before the final response, enabling the client to preload resources.',
    whenToUse: 'Use to hint at resources the client should preload (CSS, JS, fonts) while the server is still preparing the main response.',
    commonMistakes: 'Not supported by all clients and servers. Only useful for browser-facing endpoints, not APIs.',
    example: 'Server sends 103 with Link headers pointing to critical CSS files, letting the browser start downloading them before the full HTML response is ready.',
  },

  // 2xx
  {
    code: 200, name: 'OK', category: '2xx',
    description: 'The request was successful. The response body contains the requested resource or result.',
    whenToUse: 'The default success response. Use for GET, PUT, PATCH, and DELETE requests that succeed and return a body.',
    commonMistakes: 'Don\'t use 200 for resource creation — use 201 instead. Don\'t return 200 with an error object in the body ("200 OK with error message") — use the appropriate error status.',
    example: 'GET /users/42 → 200 OK with user object in the body.',
  },
  {
    code: 201, name: 'Created', category: '2xx',
    description: 'A new resource has been successfully created. The response should include a Location header pointing to the new resource.',
    whenToUse: 'Use after a successful POST that creates a new resource.',
    commonMistakes: 'Forgetting to include the Location header with the URL of the new resource. Returning 200 instead of 201 for creation.',
    example: 'POST /users → 201 Created with Location: /users/42 and the new user object in the body.',
  },
  {
    code: 202, name: 'Accepted', category: '2xx',
    description: 'The request has been accepted for processing, but the processing has not been completed.',
    whenToUse: 'Use for async operations — when you\'ve queued the task but don\'t have a result yet. Include a way for the client to check progress.',
    commonMistakes: 'Forgetting to provide a polling endpoint or webhook mechanism. Clients will be confused if there\'s no way to check status.',
    example: 'POST /reports/generate → 202 Accepted with Location: /reports/status/job-123 for the client to poll.',
  },
  {
    code: 204, name: 'No Content', category: '2xx',
    description: 'The request was successful but there is no content to return in the response body.',
    whenToUse: 'Use for DELETE requests, or PUT/PATCH when you don\'t need to return the updated resource.',
    commonMistakes: 'Returning a body with 204 — it must be empty by spec. Using 204 for GET requests (there\'s always content to return if the resource exists).',
    example: 'DELETE /users/42 → 204 No Content with an empty body.',
  },
  {
    code: 206, name: 'Partial Content', category: '2xx',
    description: 'The server is delivering only part of the resource due to a Range header sent by the client.',
    whenToUse: 'Use for supporting resumable downloads or video streaming where clients request specific byte ranges.',
    commonMistakes: 'Not including the Content-Range header. Not supporting the Range header at all on large file endpoints where it would be useful.',
    example: 'GET /video.mp4 with Range: bytes=0-1023 → 206 Partial Content with the first 1024 bytes and Content-Range: bytes 0-1023/5242880.',
  },

  // 3xx
  {
    code: 301, name: 'Moved Permanently', category: '3xx',
    description: 'The resource has been permanently moved to a new URL. Clients and search engines should update their links.',
    whenToUse: 'Use for permanent URL changes — domain migrations, URL restructuring, HTTP → HTTPS redirects.',
    commonMistakes: 'Using 301 for temporary redirects (use 302 or 307 instead). Note: some browsers change POST to GET when following a 301.',
    example: 'GET http://example.com → 301 Moved Permanently with Location: https://example.com',
  },
  {
    code: 302, name: 'Found', category: '3xx',
    description: 'The resource is temporarily at a different URL. The original URL should continue to be used.',
    whenToUse: 'Temporary redirects, but prefer 303 after POST and 307 when you need to preserve the HTTP method.',
    commonMistakes: 'Using 302 when you need POST to remain POST — browsers often change POST to GET on 302. Use 307 to force method preservation.',
    example: 'POST /checkout → 302 to /thank-you (browser follows with GET, which is usually the desired behavior).',
  },
  {
    code: 303, name: 'See Other', category: '3xx',
    description: 'The response to the request can be found at another URL using GET, regardless of the original method.',
    whenToUse: 'Use after a successful POST/PUT/DELETE to redirect the client to a confirmation or result page (the classic Post/Redirect/Get pattern).',
    commonMistakes: 'Not using it for the PRG pattern, leading to duplicate form submissions on page refresh.',
    example: 'POST /orders → 303 See Other with Location: /orders/123/confirmation',
  },
  {
    code: 304, name: 'Not Modified', category: '3xx',
    description: 'The client\'s cached version is still valid. No body is returned.',
    whenToUse: 'Returned when the client sends conditional headers (If-None-Match, If-Modified-Since) and the resource hasn\'t changed.',
    commonMistakes: 'Including a body — must be empty. Not implementing ETags or Last-Modified headers, missing out on caching benefits.',
    example: 'GET /data.json with If-None-Match: "abc123" → 304 Not Modified (if ETag still matches).',
  },
  {
    code: 307, name: 'Temporary Redirect', category: '3xx',
    description: 'Temporary redirect that preserves the original HTTP method and body.',
    whenToUse: 'Use when you need a temporary redirect and must preserve the request method (e.g., POST must remain POST).',
    commonMistakes: 'Confusing with 302. Use 307 when method preservation matters, 302 when method change to GET is acceptable.',
    example: 'POST /api/v1/users → 307 Temporary Redirect with Location: /api/v2/users (client re-POSTs to new URL).',
  },
  {
    code: 308, name: 'Permanent Redirect', category: '3xx',
    description: 'Permanent redirect that preserves the original HTTP method and body.',
    whenToUse: 'Like 301 but preserves the HTTP method. Use for permanent API endpoint migrations where POST must remain POST.',
    commonMistakes: 'Not as widely supported as 301 in older clients. Test browser/client compatibility before using.',
    example: 'POST /api/v1/orders → 308 Permanent Redirect with Location: /api/v2/orders',
  },

  // 4xx
  {
    code: 400, name: 'Bad Request', category: '4xx',
    description: 'The server cannot process the request due to a client error — malformed syntax, invalid parameters, or invalid request body.',
    whenToUse: 'Use for invalid input that doesn\'t fit a more specific 4xx error. Include a clear error message explaining what\'s wrong.',
    commonMistakes: 'Being too vague — always include what was wrong and how to fix it. Using 400 when 422 (Unprocessable Entity) is more appropriate for validation errors.',
    example: 'POST /users with malformed JSON body → 400 Bad Request with { "error": "Invalid JSON: unexpected token at position 42" }',
  },
  {
    code: 401, name: 'Unauthorized', category: '4xx',
    description: 'Authentication is required and has failed or has not been provided. Despite the name, it means "unauthenticated".',
    whenToUse: 'Use when a request requires authentication and none was provided, or the credentials are invalid.',
    commonMistakes: 'Confusing 401 with 403. 401 = "I don\'t know who you are", 403 = "I know who you are, but you can\'t do this". Always include a WWW-Authenticate header.',
    example: 'GET /profile without a token → 401 Unauthorized with WWW-Authenticate: Bearer',
  },
  {
    code: 403, name: 'Forbidden', category: '4xx',
    description: 'The server understood the request but refuses to authorize it. The client is authenticated but lacks permission.',
    whenToUse: 'Use when the user is logged in but doesn\'t have the right permissions to access the resource.',
    commonMistakes: 'Returning 403 when you should return 404 for security — revealing that a resource exists but is forbidden can leak information. In security-sensitive contexts, prefer 404.',
    example: 'GET /admin/settings with a non-admin token → 403 Forbidden',
  },
  {
    code: 404, name: 'Not Found', category: '4xx',
    description: 'The requested resource could not be found on the server.',
    whenToUse: 'Use when the resource doesn\'t exist. Also acceptable to return 404 instead of 403 when you don\'t want to reveal the existence of a resource.',
    commonMistakes: 'Returning 404 for authentication failures (use 401/403). Returning 404 when the route exists but the collection is empty (use 200 with an empty array).',
    example: 'GET /users/99999 where that user doesn\'t exist → 404 Not Found',
  },
  {
    code: 405, name: 'Method Not Allowed', category: '4xx',
    description: 'The HTTP method used is not supported for the requested resource.',
    whenToUse: 'Use when the endpoint exists but doesn\'t support the used method. Must include an Allow header listing valid methods.',
    commonMistakes: 'Forgetting the Allow header. Returning 404 instead of 405 when the URL is valid but the method is wrong.',
    example: 'DELETE /users → 405 Method Not Allowed with Allow: GET, POST',
  },
  {
    code: 408, name: 'Request Timeout', category: '4xx',
    description: 'The server timed out waiting for the request from the client.',
    whenToUse: 'Use when the client took too long to send the full request. Common in slow network conditions.',
    commonMistakes: 'Confusing with 504 (which is a gateway timeout waiting for an upstream server). 408 = client was too slow, 504 = upstream was too slow.',
    example: 'Client starts uploading a file but the connection stalls → 408 Request Timeout after the configured threshold.',
  },
  {
    code: 409, name: 'Conflict', category: '4xx',
    description: 'The request conflicts with the current state of the server — for example, a duplicate resource or version conflict.',
    whenToUse: 'Use for conflicts like duplicate unique fields, optimistic locking failures, or trying to delete a resource with dependencies.',
    commonMistakes: 'Using 400 for conflict scenarios. 409 specifically communicates "your request is valid but conflicts with existing state".',
    example: 'POST /users with an email that already exists → 409 Conflict with { "error": "Email already in use" }',
  },
  {
    code: 410, name: 'Gone', category: '4xx',
    description: 'The resource previously existed but has been permanently deleted and will not be available again.',
    whenToUse: 'Use when you want to communicate that a resource existed but has been permanently removed, unlike 404 which is ambiguous.',
    commonMistakes: 'Just returning 404 for deleted resources — 410 is more informative for clients and SEO.',
    example: 'GET /posts/123 for a post that was deleted → 410 Gone',
  },
  {
    code: 422, name: 'Unprocessable Entity', category: '4xx',
    description: 'The request was well-formed but contains semantic errors — typically validation failures.',
    whenToUse: 'Use for validation errors: required fields missing, value out of range, invalid format. Include field-level error details in the response.',
    commonMistakes: 'Using 400 for all validation errors. 422 is more precise — it means "I understood the request but the data is semantically invalid".',
    example: 'POST /users with { "age": -5 } → 422 with { "errors": [{ "field": "age", "message": "Must be a positive number" }] }',
  },
  {
    code: 429, name: 'Too Many Requests', category: '4xx',
    description: 'The client has sent too many requests in a given time window — rate limit exceeded.',
    whenToUse: 'Use for rate limiting. Include Retry-After and X-RateLimit-* headers so clients know when they can retry.',
    commonMistakes: 'Not including Retry-After header. Not implementing rate limiting at all and letting the backend get overwhelmed.',
    example: 'GET /api/search after exceeding 100 req/min → 429 with Retry-After: 30 and X-RateLimit-Reset: 1710000000',
  },

  // 5xx
  {
    code: 500, name: 'Internal Server Error', category: '5xx',
    description: 'A generic server-side error. Something went wrong on the server that wasn\'t handled gracefully.',
    whenToUse: 'The catch-all for unhandled server errors. In production, log the full error server-side but only return a generic message to the client.',
    commonMistakes: 'Leaking stack traces, internal paths, or database errors to the client. Always sanitize error responses in production.',
    example: 'Unhandled exception in request handler → 500 with { "error": "Internal server error", "requestId": "req-abc123" }',
  },
  {
    code: 501, name: 'Not Implemented', category: '5xx',
    description: 'The server does not support the functionality required to fulfill the request.',
    whenToUse: 'Use when a method is valid in HTTP spec but not yet implemented on the server (e.g., a PATCH handler you haven\'t built yet).',
    commonMistakes: 'Returning 501 for features that are simply disabled for a user (use 403). 501 means the server literally doesn\'t implement this.',
    example: 'PATCH /resource on a server that only supports GET/POST → 501 Not Implemented',
  },
  {
    code: 502, name: 'Bad Gateway', category: '5xx',
    description: 'The server, acting as a gateway or proxy, received an invalid response from an upstream server.',
    whenToUse: 'Returned by reverse proxies (nginx, load balancers) when the upstream application server returns an invalid response.',
    commonMistakes: 'Confusing with 503. 502 = upstream returned garbage, 503 = upstream is down or unavailable.',
    example: 'nginx receives a malformed response from your Node.js app → 502 Bad Gateway returned to the client.',
  },
  {
    code: 503, name: 'Service Unavailable', category: '5xx',
    description: 'The server is temporarily unable to handle requests — due to overload or maintenance.',
    whenToUse: 'Use during planned maintenance windows or when the server is overloaded. Include a Retry-After header.',
    commonMistakes: 'Not including Retry-After. Using 500 during maintenance instead of 503, which is more informative.',
    example: 'Deployment in progress → 503 with Retry-After: 120 and { "message": "Maintenance in progress, back in 2 minutes" }',
  },
  {
    code: 504, name: 'Gateway Timeout', category: '5xx',
    description: 'The server, acting as a gateway, did not receive a timely response from an upstream server.',
    whenToUse: 'Returned by proxies/gateways when the upstream server is too slow. Often indicates a slow database query or downstream service.',
    commonMistakes: 'Confusing with 408 (client timeout). 504 = the proxy waited too long for upstream, 408 = the server waited too long for the client.',
    example: 'nginx waits 60s for your app server to respond to a slow DB query, then returns 504 to the client.',
  },
];

export const CATEGORIES: Category[] = ['1xx', '2xx', '3xx', '4xx', '5xx'];
