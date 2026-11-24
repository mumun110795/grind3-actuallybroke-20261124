// Say What Actually Broke — grind3-actuallybroke-20261124
// Prints one honest error line to /output/entry.txt (or $OUTPUT_DIR/entry.txt).

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry itself: a bug-fix update that deleted the config file the
// app needs to start. The fix was the bug, and the dialog admits it.
const ERROR_LINE =
  "Error: Our bug-fix update deleted the config file this app needs to start. Reinstall to get it back — yes, the fix was the bug.";

const MIN_CHARS = 1;
const MAX_CHARS = 200;

function checkLine(line: string): void {
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("entry must stay on a single line");
  }
  const count = [...line].length;
  if (count < MIN_CHARS || count > MAX_CHARS) {
    throw new Error(`entry is ${count} characters; gate allows ${MIN_CHARS}-${MAX_CHARS}`);
  }
  if (line.trim().length === 0) {
    throw new Error("entry must not be only white space");
  }
}

function main(): void {
  checkLine(ERROR_LINE);

  const outDir = process.env.OUTPUT_DIR ?? "/output";
  // Create the directory if needed, but never remove it: on the grading
  // runner it can be a mounted volume, and deleting a mount point fails.
  mkdirSync(outDir, { recursive: true });

  const target = join(outDir, "entry.txt");
  writeFileSync(target, ERROR_LINE, { encoding: "utf8" });

  // Read the file back and verify it matches the intended entry exactly.
  // A short, altered, or re-encoded write would otherwise ship silently.
  const written = readFileSync(target, { encoding: "utf8" });
  if (written !== ERROR_LINE) {
    throw new Error(
      `entry.txt verification failed: file contents do not match the intended entry (${written.length} vs ${ERROR_LINE.length} bytes)`,
    );
  }

  console.log(`wrote ${target} (${[...ERROR_LINE].length} characters)`);
}

main();
