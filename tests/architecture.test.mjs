import test from'node:test';import assert from'node:assert/strict';import{readdirSync,statSync}from'node:fs';import{join,relative}from'node:path';import{fileURLToPath}from'node:url';
const ROOT=fileURLToPath(new URL('../src/',import.meta.url)),HARD_LIMIT=48*1024;
function filesUnder(dir){const result=[];for(const entry of readdirSync(dir)){const path=join(dir,entry),stat=statSync(path);if(stat.isDirectory())result.push(...filesUnder(path));else result.push(path)}return result}
test('src业务文件必须保持可拆分规模',()=>{const oversize=filesUnder(ROOT).filter(path=>statSync(path).size>HARD_LIMIT).map(path=>`${relative(ROOT,path)}=${statSync(path).size}`);assert.deepEqual(oversize,[],`超过48KiB必须继续拆分: ${oversize.join(', ')}`)});
