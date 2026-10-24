import { createServer, type Server } from "node:http";

/**
 * A stand-in for Resend's "send email" endpoint, for tests only.
 *
 * - POST /emails  accepts a message (401 without the test key; 500 when the
 *                 text contains [[provider-failure]], to test failures)
 * - GET  /last    returns the last accepted message, so tests can check what
 *                 would have been e-mailed
 */
export const MOCK_API_KEY = "test-key";
export const FAILURE_MARKER = "[[provider-failure]]";

export function startMockEmailProvider(port: number): Promise<Server> {
  let last: unknown = null;

  const server = createServer((request, response) => {
    if (request.method === "GET" && request.url === "/last") {
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify(last));
      return;
    }
    if (request.method !== "POST" || request.url !== "/emails") {
      response.writeHead(404).end();
      return;
    }
    if (request.headers.authorization !== `Bearer ${MOCK_API_KEY}`) {
      response.writeHead(401).end();
      return;
    }

    let body = "";
    request.on("data", (chunk: Buffer) => (body += chunk.toString("utf8")));
    request.on("end", () => {
      const message = JSON.parse(body) as { text?: string };
      if (message.text?.includes(FAILURE_MARKER)) {
        response.writeHead(500, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ message: "simulated provider failure" }));
        return;
      }
      last = message;
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ id: "mock-id" }));
    });
  });

  return new Promise((resolve) =>
    server.listen(port, "127.0.0.1", () => resolve(server)),
  );
}
