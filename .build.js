import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

try {
    const indexPath = join('node_modules', 'baileys', 'lib', 'Defaults', 'index.js');
    await writeFile(indexPath, (await readFile(indexPath, 'utf8')).replace(/import defaultVersion from '\.\/baileys-version\.json' assert { type: 'json' };/, "import defaultVersion from './baileys-version.json';"));

    const genericsPath = join('node_modules', 'baileys', 'lib', 'Utils', 'generics.js');
    await writeFile(genericsPath, (await readFile(genericsPath, 'utf8')).replace(/import version from '\.\.\/Defaults\/baileys-version\.json' assert { type: 'json' };/, "import version from '../Defaults/baileys-version.json';"));
} catch (e) {
    console.error('Error:', e);
}