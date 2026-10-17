import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const config = [
  ...nextVitals,
  ...nextTs,
  { ignores: [".next/**", ".impeccable/**", "node_modules/**", "data/**", ".agents/**", ".augment/**", ".autohand/**", "next-env.d.ts"] },
];

export default config;
