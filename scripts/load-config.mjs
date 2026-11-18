import { readFile } from 'node:fs/promises';
import ts from 'typescript';
/** Config has only a type import. Transpiling it avoids a second JSON data source. */
export async function loadConfig() {
  const source = await readFile(new URL('../src/config/portfolio.config.ts', import.meta.url), 'utf8');
  const { outputText } = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } });
  const dataUrl = `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`;
  return (await import(dataUrl)).portfolioConfig;
}
