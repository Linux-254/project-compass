# Non-tRPC Route Security Review

Reviewed on 2026-08-23.

| Route family | Methods | State-changing? | Protection / rationale |
|---|---:|---:|---|
| `/api/oauth/callback` | GET | No | OAuth provider callback; authenticated session issuance is protected by the OAuth state exchange and secure session cookie configuration. It does not accept a browser mutation payload. |
| `/manus-storage/*` | GET | No | Read-only signed-storage redirect. It does not write application state or accept upload bytes. |
| `/api/trpc` | POST, PUT, PATCH, DELETE | Yes | Global API rate limit plus strict same-origin metadata validation. Requests must include an Origin or Referer whose host matches the request host. |
| Vite/static fallback | GET / middleware | No | Serves application assets and route shell only. |

No non-tRPC POST, PUT, PATCH, or DELETE handler exists in the reviewed Express route registrations. If a state-changing Express endpoint is added later, it must use the same strict origin guard before processing request data.
