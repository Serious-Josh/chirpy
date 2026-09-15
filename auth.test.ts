import { describe, it, expect, beforeAll } from "vitest";
import { makeJWT, validateJWT, hashPassword, checkPasswordHash } from "./src/auth.js";

describe("Password Hashing", () => {
  const password1 = "correctPassword123!";
  const password2 = "anotherPassword456!";
  let hash1: string;
  let hash2: string;

  beforeAll(async () => {
    hash1 = await hashPassword(password1);
    hash2 = await hashPassword(password2);
  });

  it("should return true for the correct password", async () => {
    const result = await checkPasswordHash(password1, hash1);
    expect(result).toBe(true);
  });
});

describe("JWT Testing", () => {
    const id1 = "userID1234";
    const id2 = "userID5678"
    let token1: string;
    let token2: string;

    beforeAll(async () => {
        token1 = makeJWT(id1, 2, "secretString");
        token2 = makeJWT(id2, 3, "secretString");
    });

    it("should return true for the correct JWT", async () => {
        const result = validateJWT(token1, "secretString");
        expect(result).toBe("userID1234");
    });
    it("should return true for the correct JWT", async () => {
        const result2 = validateJWT(token2, "secretString");
        expect(result2).toBe("userID5678");
    });
})