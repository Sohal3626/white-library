import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const port = Number(process.env.PORT || 4173);
const root = process.cwd();
const mime = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json; charset=utf-8" };

const server = createServer(async (request, response) => {
  const requested = request.url === "/" ? "index.html" : decodeURIComponent(request.url || "").replace(/^\/+/, "");
  const filePath = normalize(join(root, requested));
  if (!filePath.startsWith(root)) {
    response.writeHead(403).end("Forbidden");
    return;
  }
  try {
    const contents = await readFile(filePath);
    response.writeHead(200, { "Content-Type": mime[extname(filePath)] || "application/octet-stream", "Cache-Control": "no-store" });
    response.end(contents);
  } catch {
    response.writeHead(404).end("Not found");
  }
});

server.on("error", (error) => {
  console.error("서버를 시작하지 못했습니다:", error.message);
  process.exitCode = 1;
});

server.listen(port, "127.0.0.1", () => {
  console.log(`겨울의 도서관 실행 중: http://127.0.0.1:${port}`);
  console.log("종료하려면 Ctrl+C를 누르세요.");
});
