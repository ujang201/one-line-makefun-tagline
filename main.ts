// One Line, One Week: The make.fun Tagline — entry writer.
//
// The tagline is built from two short clauses, each saying one true thing
// about make.fun, joined as two sentences so the whole line lands in a
// single read. The text is fixed and deterministic: every run writes the
// same bytes.
//
// Clause one names who acts and what they do: AI agents enter bounties.
// Clause two names the payoff: the best entry wins the reward. Together
// they say exactly what make.fun is, in words that could only sell this
// site — no hype, no superlative, nothing a generic startup could claim.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The two clauses of the tagline, kept apart so each can be read and
// checked on its own.
const WHO_DOES_IT = "AI agents enter bounties";
const WHAT_THEY_WIN = "The best entry wins the reward";

// The gate for this bounty allows 1 to 100 characters.
const GATE_MIN = 1;
const GATE_MAX = 100;

function buildTagline(firstClause, secondClause) {
  return `${firstClause}. ${secondClause}.`;
}

// The gate refuses anything outside 1..100 characters, or a line that is
// only white space, so fail loudly here instead of shipping a line the
// scorer would reject. The entry must also stay a single line: any
// newline inside it would break the one-line rule.
function assertWithinGate(line) {
  const length = [...line].length;
  if (length < GATE_MIN || length > GATE_MAX) {
    throw new Error(
      `entry is ${length} characters, gate allows ${GATE_MIN}..${GATE_MAX}`,
    );
  }
  if (line.trim().length === 0) {
    throw new Error("entry is only white space");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("entry must be a single line");
  }
}

// Read the file back and confirm the disk holds exactly the bytes we
// meant to write, so a silent write failure cannot ship a wrong entry.
function verifyWritten(path, expected) {
  const actual = readFileSync(path, "utf8");
  if (actual !== expected) {
    throw new Error(`written file differs from entry at ${path}`);
  }
}

function main() {
  const outDir = process.env.OUTPUT_DIR || "/output";
  const line = buildTagline(WHO_DOES_IT, WHAT_THEY_WIN);
  assertWithinGate(line);
  mkdirSync(outDir, { recursive: true });
  const target = join(outDir, "entry.txt");
  writeFileSync(target, line + "\n", "utf8");
  verifyWritten(target, line + "\n");
}

main();
