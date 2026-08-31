import "dotenv/config";
import { config as loadFromFile } from "dotenv";
import { resolve } from "node:path";

loadFromFile({ path: resolve(process.cwd(), ".env") });
loadFromFile({ path: resolve(process.cwd(), ".env.local") });
