#!/usr/bin/env node
import { promises as fs } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import matter from "gray-matter";

const __dirname = dirname(fileURLToPath(import.meta.url));
const command = process.argv[2];
const arg = process.argv[3];
const projectDir = process.cwd();
const appDir = join(__dirname, "..");

// Core components that should not be copied to user projects
const coreComponents = ["Breadcrumb", "SearchBar"];

async function addComponent(component) {
  if (coreComponents.includes(component)) {
    console.log(`${component} is a core component and cannot be added to user projects.`);
    return;
  }
  const src = join(appDir, "src/components", `${component}.jsx`);
  const dest = join(projectDir, "react/components", `${component}.jsx`);
  await fs.mkdir(join(projectDir, "react/components"), { recursive: true });
  await fs.copyFile(src, dest);
  console.log(`Added ${component} to react/components/`);
}

async function addTemplate(template) {
  const src = join(appDir, "src/templates", template);
  const dest = join(projectDir, "src/content", template.replace("-template", ""));
  await fs.mkdir(dest, { recursive: true });
  const files = await fs.readdir(src);
  
  // Check for components.json and add required components
  const componentsFile = join(src, "components.json");
  let requiredComponents = [];
  try {
    const componentsData = await fs.readFile(componentsFile, "utf8");
    requiredComponents = JSON.parse(componentsData).components || [];
    for (const component of requiredComponents) {
      await addComponent(component);
    }
  } catch (err) {
    console.log(`No components.json found for ${template}, skipping component dependencies.`);
  }

  // Copy template files and parse index.md front matter
  let indexData = {};
  for (const file of files) {
    if (file === "components.json") continue;
    const content = await fs.readFile(join(src, file), "utf8");
    await fs.writeFile(join(dest, file), content);
    if (file === "index.md") {
      indexData = matter(content).data;
    }
  }

  // Update nav.json using index.md front matter
  const navPath = join(projectDir, "src/_data/nav.json");
  let nav = JSON.parse(await fs.readFile(navPath, "utf8"));
  const templateName = template.replace("-template", "");
  const navEntry = {
    title: indexData.title || templateName.toUpperCase(),
    url: indexData.permalink || `/${templateName}/`,
    icon: indexData.icon || "book"
  };
  if (!nav.some(item => item.url === navEntry.url)) {
    nav.push(navEntry);
    await fs.writeFile(navPath, JSON.stringify(nav, null, 2));
  }

  console.log(`Added ${template} to src/content/ and updated nav.json`);
}

if (command === "add-template") {
  await addTemplate(arg).catch(console.error);
} else if (command === "add-component") {
  await addComponent(arg).catch(console.error);
} else {
  console.error("Unknown command. Use 'arkitect add-template <name>' or 'arkitect add-component <name>'");
}