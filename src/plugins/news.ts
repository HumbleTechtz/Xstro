import type { CommandModule } from "../types/Command.ts";

export default [
  {
    pattern: "vox",
    fromMe: false,
    isGroup: false,
    desc: "Vox news",
    type: "news",
    execute: async () => {},
  },
] satisfies CommandModule[];
