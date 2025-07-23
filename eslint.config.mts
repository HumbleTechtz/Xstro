import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
	{
		ignores: ["build/**/*", "node_modules/**/*"],
	},
	{
		files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
		languageOptions: {
			globals: {
				...globals.node,
			},
		},
		rules: {
			"no-unused-vars": "warn",
			"no-undef": "warn",
		},
	},
	js.configs.recommended,
	...tseslint.configs.recommended,
];
