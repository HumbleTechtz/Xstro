import type { CommandModule } from "../utils/cmd-handler.ts";

export default [
  {
    pattern: "vox",
    fromMe: false,
    isGroup: false,
    desc: "Vox news",
    type: "news",
    run: async () => {},
  },
] satisfies CommandModule[];
