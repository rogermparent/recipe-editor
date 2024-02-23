const handler = require("serve-handler");
const http = require("http");
const path = require("path");

const server = http.createServer((request, response) => {
  console.log(request.url);
  if (request.url.startsWith("/image/")) {
    const srcPath = path.join(
      process.env.CONTENT_DIRECTORY,
      "transformed-images",
    );
    return handler(request, response, {
      public: srcPath,
      directoryListing: true,
      rewrites: [
        {
          source: "/image/:width/:quality/recipe/:slug/uploads/:filename",
          destination: "/:width/:quality/recipe/:slug/uploads/:filename",
        },
      ],
    });
  }
  return handler(request, response, { public: "out" });
});

server.listen(3001, () => {
  console.log("Running at http://localhost:3001");
});
