/*jshint esversion: 11 */
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const filePath = path.join(__dirname, 'text.txt');

const stream = fs.createWriteStream(filePath, { flags: 'a' }, () => {});

console.log('Hello, stranger\nInput something');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.on('line', (input) => {
  if (input === 'exit') {
    close();
  }
  stream.write(input);
  console.log('Y can input something else');
});

rl.on('close', () => {
  close();
});

function close() {
  console.log('Goodbye, stranger');
  stream.end();
  process.exit(0); // Завершение процесса
}
