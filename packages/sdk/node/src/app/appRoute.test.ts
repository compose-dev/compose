import { describe, it, expect } from "vitest";
import { AppDefinition } from "./appDefinition";

describe("AppDefinition route handling", () => {
  const dummyHandler = () => {};

  describe("auto-generated routes", () => {
    it("should auto-generate route from app name when no route provided", () => {
      const app = new AppDefinition({
        route: "test-app",
        handler: dummyHandler,
      });

      expect(app.route).toBe("test-app");
    });
  });

  describe("user-provided routes", () => {
    it("should handle multiple spaces in route", () => {
      const app = new AppDefinition({
        name: "Test App",
        handler: dummyHandler,
        route: "test    multiple    spaces",
      });

      expect(app.route).toBe("test----multiple----spaces");
    });

    it("should throw error for empty route", () => {
      expect(() => {
        new AppDefinition({
          name: "Test App",
          handler: dummyHandler,
          route: "",
        });
      }).toThrow("Failed to initialize Compose: route argument is required");
    });

    it("should accept route with only numbers", () => {
      const app = new AppDefinition({
        name: "Test App",
        handler: dummyHandler,
        route: "123456",
      });

      expect(app.route).toBe("123456");
    });

    it("should accept valid lowercase route", () => {
      const app = new AppDefinition({
        name: "Test App",
        handler: dummyHandler,
        route: "my-test-route",
      });

      expect(app.route).toBe("my-test-route");
    });

    it("should convert uppercase route to lowercase", () => {
      const app = new AppDefinition({
        name: "Test App",
        handler: dummyHandler,
        route: "MY-TEST-ROUTE",
      });

      expect(app.route).toBe("my-test-route");
    });

    it("should strip leading forward slashes", () => {
      const app = new AppDefinition({
        name: "Test App",
        handler: dummyHandler,
        route: "/test-route",
      });

      expect(app.route).toBe("test-route");
    });

    it("should strip multiple leading forward slashes", () => {
      const app = new AppDefinition({
        name: "Test App",
        handler: dummyHandler,
        route: "///test-route",
      });

      expect(app.route).toBe("test-route");
    });

    it("should throw error for route with invalid characters", () => {
      expect(() => {
        new AppDefinition({
          name: "Test App",
          handler: dummyHandler,
          route: "test@route",
        });
      }).toThrow("Failed to initialize Compose. Received invalid route");

      expect(() => {
        new AppDefinition({
          name: "Test App",
          handler: dummyHandler,
          route: "test$route",
        });
      }).toThrow("Failed to initialize Compose. Received invalid route");
    });

    it("should handle route with spaces", () => {
      const app = new AppDefinition({
        name: "Test App",
        handler: dummyHandler,
        route: "test route",
      });

      expect(app.route).toBe("test-route");
    });

    it("should throw error for route starting with hyphen", () => {
      expect(() => {
        new AppDefinition({
          name: "Test App",
          handler: dummyHandler,
          route: "-test-route",
        });
      }).toThrow("Failed to initialize Compose. Received invalid route");
    });

    it("should throw error for route ending with hyphen", () => {
      expect(() => {
        new AppDefinition({
          name: "Test App",
          handler: dummyHandler,
          route: "test-route-",
        });
      }).toThrow("Failed to initialize Compose. Received invalid route");
    });

    it("should throw error for route with nested paths", () => {
      expect(() => {
        new AppDefinition({
          name: "Test App",
          handler: dummyHandler,
          route: "test/route",
        });
      }).toThrow("Failed to initialize Compose. Received invalid route");
    });
  });
});
