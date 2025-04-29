import color from "./color.mjs";

export const print = (message, colors = "reset") => {
 process.stdout.write(`${color[colors]}${message}`);
};
