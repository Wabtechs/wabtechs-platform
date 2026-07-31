const fs = require('fs');
const css = fs.readFileSync('C:/Users/WAB/.local/share/opencode/tool-output/tool_fa2cd2302001dTjj3d3S4JDKOl', 'utf8');
console.log('CSS size:', css.length);

// Find sidebar-related rules
const patterns = ['.hidden{', '.md\\:block{', '.md\\:flex{', '--sidebar-width:16', 'var(--sidebar-width)'];
patterns.forEach(p => {
  const idx = css.indexOf(p);
  if (idx > -1) {
    console.log(`\n"${p}" at ${idx}:`);
    console.log(css.substring(idx, idx + 80));
  } else {
    console.log(`"${p}" NOT FOUND`);
  }
});
