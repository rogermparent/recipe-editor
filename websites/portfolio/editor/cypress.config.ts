import { defineConfig } from "cypress";
import { cp, rm } from "node:fs/promises";
import { resolve } from "node:path";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on) {
      on("task", {
        async resetData(fixture?: string) {
          try {
            await rm(resolve("test-content"), { recursive: true });
          } catch (e) {}
          if (fixture) {
            await cp(
              resolve("cypress", "fixtures", "test-content", fixture),
              resolve("test-content"),
              { recursive: true },
            );
          }
          await cp(
            resolve("cypress", "fixtures", "users"),
            resolve("test-content", "users"),
            { recursive: true },
          );
          return null;
        },
      });
    },
    retries: {
      runMode: 2,
    },
  },
});
