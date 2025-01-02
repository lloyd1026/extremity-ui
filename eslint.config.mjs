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
      // 禁用 `react-hooks/exhaustive-deps` 规则
      "react-hooks/exhaustive-deps": "off",
      // 其他你需要禁用的规则
      "@typescript-eslint/no-explicit-any": "off", // 禁用 any 类型的错误提示
      // 禁用未使用的变量警告
      "no-unused-vars": "off", // 禁用所有未使用变量的检查
      // 禁用 TypeScript 的 no-unused-vars 规则
      "@typescript-eslint/no-unused-vars": "off",
      // 如果你希望仅禁用某些特定的未使用变量的警告，例如函数参数未使用：
      "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }], // 忽略以 _ 开头的函数参数
      "react-hooks/rules-of-hooks": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-unsafe-function-type": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "react-hooks/rules-of-hooks": "off"
    },
  },
];

export default eslintConfig;
