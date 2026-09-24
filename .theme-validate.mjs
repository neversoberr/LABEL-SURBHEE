#!/usr/bin/env node
/**
 * Structural validator for the Label Surbhee Shopify theme.
 * Mirrors the checks `shopify theme check` makes that matter for a repo to be
 * accepted as a theme: required files, parseable JSON, and every referenced
 * section / snippet / asset / setting actually existing.
 *
 *   node .theme-validate.mjs [themeRoot]
 */
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';

const root = process.argv[2] ?? '.';
const errors = [];
const warnings = [];
const fail = (m) => errors.push(m);
const warn = (m) => warnings.push(m);

const read = (p) => readFileSync(join(root, p), 'utf8');
const exists = (p) => existsSync(join(root, p));
const filesIn = (dir) =>
  exists(dir)
    ? readdirSync(join(root, dir)).filter((f) => statSync(join(root, dir, f)).isFile())
    : [];

// ---------------------------------------------------------------- required files
for (const required of ['layout/theme.liquid', 'config/settings_schema.json']) {
  if (!exists(required)) fail(`MISSING required theme file: ${required}`);
}
for (const dir of ['assets', 'layout', 'sections', 'snippets', 'templates', 'config', 'locales']) {
  if (!exists(dir)) warn(`expected theme directory not present: ${dir}/`);
}

// ---------------------------------------------------------------- JSON parse
const allFiles = [];
const walk = (dir) => {
  if (!exists(dir)) return;
  for (const entry of readdirSync(join(root, dir), { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const rel = dir ? `${dir}/${entry.name}` : entry.name;
    if (entry.isDirectory()) walk(rel);
    else allFiles.push(rel);
  }
};
walk('');

for (const f of allFiles) {
  if (extname(f) !== '.json') continue;
  try {
    JSON.parse(read(f));
  } catch (e) {
    fail(`${f}: invalid JSON — ${e.message}`);
  }
}

// ---------------------------------------------------------------- sections inventory
const sectionFiles = filesIn('sections').filter((f) => f.endsWith('.liquid'));
const sections = new Set(sectionFiles.map((f) => f.replace(/\.liquid$/, '')));
if (sections.size === 0) fail('no sections found in sections/');

const snippetFiles = filesIn('snippets').filter((f) => f.endsWith('.liquid'));
const snippets = new Set(snippetFiles.map((f) => f.replace(/\.liquid$/, '')));

const assetFiles = new Set(filesIn('assets'));
const settingsIds = new Set();

// ---------------------------------------------------------------- settings schema
if (exists('config/settings_schema.json')) {
  try {
    const schema = JSON.parse(read('config/settings_schema.json'));
    if (!Array.isArray(schema)) fail('config/settings_schema.json must be an array');
    else if (!schema[0] || schema[0].name !== 'theme_info') {
      warn('config/settings_schema.json: first entry should be the "theme_info" group (Shopify convention)');
    }
    for (const group of schema) {
      for (const s of group.settings ?? []) if (s.id) settingsIds.add(s.id);
    }
  } catch {
    /* reported above */
  }
}

// ---------------------------------------------------------------- templates
const templateJson = allFiles.filter((f) => f.startsWith('templates/') && f.endsWith('.json'));
if (templateJson.length === 0) fail('no JSON templates found in templates/');
for (const t of ['templates/index.json', 'templates/product.json', 'templates/collection.json', 'templates/cart.json', 'templates/404.json']) {
  if (!exists(t)) warn(`recommended template missing: ${t}`);
}

for (const t of templateJson) {
  let tpl;
  try {
    tpl = JSON.parse(read(t));
  } catch {
    continue;
  }
  for (const [key, sec] of Object.entries(tpl.sections ?? {})) {
    if (!sec.type) {
      fail(`${t}: section "${key}" has no "type"`);
      continue;
    }
    if (!sections.has(sec.type)) fail(`${t}: section "${key}" references unknown section type "${sec.type}" (no sections/${sec.type}.liquid)`);
    for (const block of Object.values(sec.blocks ?? {})) {
      if (!block.type) fail(`${t}: block in "${key}" has no "type"`);
    }
  }
  for (const id of tpl.order ?? []) {
    if (!tpl.sections?.[id]) fail(`${t}: "order" lists "${id}" which is not defined in sections`);
  }
  for (const id of Object.keys(tpl.sections ?? {})) {
    if (!(tpl.order ?? []).includes(id)) warn(`${t}: section "${id}" is defined but not in "order"`);
  }
}

// ---------------------------------------------------------------- liquid refs
const liquidFiles = allFiles.filter((f) => extname(f) === '.liquid');

/** Setting ids declared in a section's own {% schema %} — section.settings.* is scoped to these. */
function schemaSettingIds(file) {
  const ids = new Set();
  if (!file.startsWith('sections/')) return ids;
  const m = read(file).match(/\{%-?\s*schema\s*-?%\}([\s\S]*?)\{%-?\s*endschema\s*-?%\}/);
  if (!m) return ids;
  try {
    const j = JSON.parse(m[1]);
    for (const s of j.settings ?? []) if (s.id) ids.add(s.id);
    for (const b of j.blocks ?? []) {
      if (b.settings) for (const s of b.settings) if (s.id) ids.add(s.id);
    }
    for (const p of j.presets ?? []) {
      for (const s of p.settings ?? []) if (s.id) ids.add(s.id);
      for (const blk of p.blocks ?? []) for (const s of blk.settings ?? []) if (s.id) ids.add(s.id);
    }
  } catch {
    /* reported by the schema check below */
  }
  return ids;
}

for (const f of liquidFiles) {
  const src = read(f);
  const localIds = schemaSettingIds(f);

  for (const m of src.matchAll(/\{%-?\s*section\s+['"]([\w-]+)['"]/g)) {
    if (!sections.has(m[1]) && !/\{\{/.test(m[1])) {
      fail(`${f}: {% section '${m[1]}' %} has no sections/${m[1]}.liquid`);
    }
  }
  for (const m of src.matchAll(/\{%-?\s*render\s+['"]([\w-]+)/g)) {
    if (!snippets.has(m[1])) fail(`${f}: {% render '${m[1]}' %} has no snippets/${m[1]}.liquid`);
  }
  for (const m of src.matchAll(/\{%-?\s*include\s+['"]([\w-]+)/g)) {
    if (!snippets.has(m[1])) fail(`${f}: {% include '${m[1]}' %} has no snippets/${m[1]}.liquid (also: "include" is deprecated)`);
  }
  // asset_url / asset references
  for (const m of src.matchAll(/\|\s*asset_url/g)) void m;
  for (const m of src.matchAll(/['"]([\w.@-]+\.(?:css|js|jpg|jpeg|png|webp|svg|gif|ico))['"]\s*\|\s*asset_url/g)) {
    if (!assetFiles.has(m[1])) fail(`${f}: asset "${m[1]}" not found in assets/`);
  }
  // <img> must carry width+height so the browser can reserve space (no layout shift)
  for (const m of src.matchAll(/<img\b[^>]*?>/g)) {
    const tag = m[0];
    const has = (a) => new RegExp(`\\b${a}\\s*=`).test(tag);
    if (!has('width') || !has('height')) {
      fail(`${f}: <img> missing width/height attributes — ${tag.slice(0, 90)}…`);
    }
  }

  // Scoping: bare `settings.X` is always a THEME setting (even inside a section);
  // `section.settings.X` and `block.settings.X` are scoped to that section's schema.
  for (const m of src.matchAll(/(?<![\w.])settings\.(\w+)/g)) {
    const id = m[1];
    if (!settingsIds.has(id)) {
      warn(`${f}: settings.${id} is not declared in config/settings_schema.json`);
    }
  }
  for (const m of src.matchAll(/(?:section|block)\.settings\.(\w+)/g)) {
    const id = m[1];
    if (localIds.size && !localIds.has(id)) {
      warn(`${f}: ${m[0]} is not declared in that section's {% schema %}`);
    }
  }
}

// settings_data must only use declared ids
if (exists('config/settings_data.json')) {
  try {
    const data = JSON.parse(read('config/settings_data.json'));
    const current = data.current ?? {};
    for (const id of Object.keys(current)) {
      if (!settingsIds.has(id)) fail(`config/settings_data.json: "current.${id}" is not declared in settings_schema.json`);
    }
    for (const [name, preset] of Object.entries(data.presets ?? {})) {
      for (const id of Object.keys(preset)) {
        if (!settingsIds.has(id)) fail(`config/settings_data.json: preset "${name}.${id}" is not declared in settings_schema.json`);
      }
    }
  } catch {
    /* reported above */
  }
}

// section {% schema %} blocks must be valid JSON
for (const f of liquidFiles) {
  const src = read(f);
  const m = src.match(/\{%-?\s*schema\s*-?%\}([\s\S]*?)\{%-?\s*endschema\s*-?%\}/);
  if (!m) continue;
  try {
    JSON.parse(m[1]);
  } catch (e) {
    fail(`${f}: invalid JSON in {% schema %} — ${e.message}`);
  }
}

// ---------------------------------------------------------------- report
console.log(`Theme root: ${root}`);
console.log(
  `  sections: ${sections.size}   snippets: ${snippets.size}   assets: ${assetFiles.size}   templates: ${templateJson.length}   liquid: ${liquidFiles.length}   settings: ${settingsIds.size}`,
);
for (const w of warnings) console.log(`WARN  ${w}`);
for (const e of errors) console.log(`ERROR ${e}`);
if (errors.length) {
  console.log(`\nFAIL — ${errors.length} error(s), ${warnings.length} warning(s)`);
  process.exit(1);
}
console.log(`\nOK — 0 errors, ${warnings.length} warning(s)`);
