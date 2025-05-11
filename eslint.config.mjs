import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Modify the rule here to allow unused variables
      'no-unused-vars': [
        'warn', // Can be 'off', 'warn', or 'error'
        {
          args: 'none', // Ignore unused arguments (like in functions)
          ignoreRestSiblings: true, // Ignore variables that are part of object rest spread
          varsIgnorePattern: '^_', // Ignore variables that start with underscore (useful for unused vars with naming conventions)
        },
      ],
    },
  },
];

export default eslintConfig;
