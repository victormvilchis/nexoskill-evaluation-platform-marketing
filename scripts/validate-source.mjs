import { readdir, readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';

let ts;
try {
  ({ default: ts } = await import('typescript'));
} catch {
  ({ default: ts } = await import('/opt/nvm/versions/node/v22.16.0/lib/node_modules/typescript/lib/typescript.js'));
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else if (['.ts', '.tsx'].includes(extname(entry.name)) && !entry.name.endsWith('.d.ts')) files.push(path);
  }
  return files;
}

const files = [...await walk('src'), 'vite.config.ts'];
let failed = false;
for (const file of files) {
  const source = await readFile(file, 'utf8');
  const result = ts.transpileModule(source, {
    fileName: file,
    reportDiagnostics: true,
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
      jsx: ts.JsxEmit.ReactJSX,
    },
  });
  const errors = (result.diagnostics ?? []).filter((diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error);
  if (errors.length) {
    failed = true;
    console.error(`Errores de sintaxis en ${file}:`);
    errors.forEach((error) => console.error(ts.flattenDiagnosticMessageText(error.messageText, '\n')));
  }
}

if (failed) process.exit(1);
console.log(`Sintaxis TypeScript/TSX validada en ${files.length} archivos.`);
