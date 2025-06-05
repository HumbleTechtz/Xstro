import tsParser from "@typescript-eslint/parser";
import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import prettierPlugin from "eslint-plugin-prettier";
import type { FlatConfig } from "@typescript-eslint/utils/ts-eslint";
import path from "node:path";

const config: FlatConfig.Config = {
	files: ["**/*.ts", "**/*.mts"],
	ignores: ["node_modules/**", "dist/**", "lib/**"],
	languageOptions: {
		parser: tsParser,
		ecmaVersion: "latest",
		sourceType: "module",
		parserOptions: {
			project: path.resolve(__dirname, "./tsconfig.json"),
			tsconfigRootDir: __dirname,
		},
	},
	plugins: {
		"@typescript-eslint": typescriptPlugin,
		prettier: prettierPlugin,
	},
	rules: {
		"prettier/prettier": [
			"error",
			{
				tabWidth: 1,
				useTabs: true,
				singleQuote: false,
				trailingComma: "all",
				arrowParens: "avoid",
				endOfLine: "lf",
			},
		],
		"@typescript-eslint/no-unused-vars": "warn",
	},
};

export default [config];
