// Example: Script to generate existential narrations for Don't Jump
const fs = require('fs');
const path = require('path');

const phrases = [
	'You jumped, but the void was unimpressed.',
	'Every leap is a question. The void rarely answers.',
	'Falling is the universe’s way of reminding you: gravity wins.',
];

const outPath = path.join(
	__dirname,
	'../constants/texts.ts'
);

fs.appendFileSync(
	outPath,
	`\n// Generated phrases\nexport const GeneratedNarrations = ${JSON.stringify(
		phrases,
		null,
		2
	)};\n`
);
console.log(
	'Generated existential narrations appended to texts.ts'
);
