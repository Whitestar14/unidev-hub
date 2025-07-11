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
const validFiles = files.filter((f) => /[a-zA-Z]/.test(f.replace(".md", "")));

// Helper to extract full name and portfolio from a markdown file
function extractContributorInfo(filePath, fileName) {
  const content = fs.readFileSync(filePath, "utf-8");
  // Extract full name from first line starting with '# '
  const nameMatch = content.match(/^#\s+(.+)/m);
  const fullName = nameMatch ? nameMatch[1].trim() : fileName.replace(/\.md$/, "");
  // Extract portfolio link from a line like [https://...](https://...)
  const portfolioMatch = content.match(/\[(https?:\/\/[^\]]+)\]\((https?:\/\/[^\)]+)\)/);
  const portfolio = portfolioMatch ? portfolioMatch[1] : null;
  return { fullName, portfolio };
}

const links = validFiles.map((f) => {
  const filePath = path.join(portfolioPath, f);
  const { fullName, portfolio } = extractContributorInfo(filePath, f);
  let display = `- [${fullName}](./portfolio/${f})`;
  if (portfolio) {
    display += ` — [Portfolio](${portfolio})`;
  }
  return display;
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
