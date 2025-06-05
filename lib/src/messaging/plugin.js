var __rewriteRelativeImportExtension = (this && this.__rewriteRelativeImportExtension) || function (path, preserveJsx) {
    if (typeof path === "string" && /^\.\.?\//.test(path)) {
        return path.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i, function (m, tsx, d, ext, cm) {
            return tsx ? preserveJsx ? ".jsx" : ".js" : d && (!ext || !cm) ? m : (d + ext + "." + cm.toLowerCase() + "js");
        });
    }
    return path;
};
import { pathToFileURL, fileURLToPath } from "node:url";
import { join, extname, dirname } from "node:path";
import { readdir } from "node:fs/promises";
const __dirname = dirname(fileURLToPath(import.meta.url));
export const commands = [];
export function Command(cmd) {
    const cmdRegex = {
        ...cmd,
        name: new RegExp(`^\\s*(${cmd.name})(?:\\s+([\\s\\S]+))?$`, "i"),
    };
    if (!commands.some(existingCmd => existingCmd.name === cmdRegex.name)) {
        commands.push(cmdRegex);
    }
}
export async function syncPlugins(pluginDir, extensions = [".ts"]) {
    const pluginsPath = join(__dirname, pluginDir);
    async function loadDirectory(directory) {
        const entries = await readdir(directory, { withFileTypes: true });
        await Promise.all(entries.map(async (entry) => {
            const fullPath = join(directory, entry.name);
            if (entry.isDirectory()) {
                await loadDirectory(fullPath);
            }
            else {
                const fileExtension = extname(entry.name).toLowerCase();
                if (extensions.includes(fileExtension)) {
                    try {
                        const fileUrl = pathToFileURL(fullPath).href;
                        await import(__rewriteRelativeImportExtension(fileUrl));
                    }
                    catch (err) {
                        console.error(`Failed to load plugin ${entry.name}: ${err.message}`);
                    }
                }
            }
        }));
    }
    commands.length = 0;
    await loadDirectory(pluginsPath);
}
