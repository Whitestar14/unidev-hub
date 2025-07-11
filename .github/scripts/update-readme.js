const fs = require("fs");
const path = require("path");

const START = "<!-- CONTRIBUTORS_START -->";
const END = "<!-- CONTRIBUTORS_END -->";
const readmePath = path.join(__dirname, "../../README.md");
const portfolioPath = path.join(__dirname, "../../portfolio");

// Get all .md files, sort alphabetically
const files = fs
  .readdirSync(portfolioPath)
  .filter((f) => f.endsWith(".md"))
  .sort((a, b) => a.localeCompare(b));

// Validate file names (optional: skip files not matching a pattern)
// Example: Only allow files with at least one letter
const validFiles = files.filter((f) => /[a-zA-Z]/.test(f.replace(".md", "")));

const links = validFiles.map((f) => {
  // Split on - and _ and capitalize each part
  const name = f
    .replace(/\.md$/, "")
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
  return `- [${name}](./portfolio/${f})`;
});

const content = fs.readFileSync(readmePath, "utf-8");
if (!content.includes(START) || !content.includes(END)) {
  throw new Error("Contributor markers not found in README.md");
}
const [before, after] = content.split(START);
const [, afterEnd] = after.split(END);

const newSection = `${START}\n${links.join("\n")}\n${END}`;
const newContent = `${before}${newSection}${afterEnd}`;

fs.writeFileSync(readmePath, newContent);
console.log("✅ README updated with contributor links");
