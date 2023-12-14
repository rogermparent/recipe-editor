import { hash, genSalt } from "bcrypt";
import { mkdir, writeFile } from "fs/promises";
import { resolve } from "path";
import readline from "readline";
import readlinePromises from "readline/promises";

async function createUser() {
  const rl = readlinePromises.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const email = await rl.question("Enter an email: ");
  const passwordPromise = rl.question("Enter a password: ");

  // Use an event handler to hide password input
  function hideInput() {
    var len = rl.line.length;
    readline.moveCursor(rl.output, -len, 0);
    readline.clearLine(rl.output, 1);
    for (var i = 0; i < len; i++) {
      rl.output.write("*");
    }
  }

  rl.input.on("keypress", hideInput);
  const salt = await genSalt();
  const password = await passwordPromise;
  const hashedPassword = await hash(password, salt);
  const userData = { email, password: hashedPassword };
  const usersDir = resolve("users");
  await mkdir(usersDir, { recursive: true });
  await writeFile(resolve(usersDir, email), JSON.stringify(userData));
  process.exit(0);
}

createUser();
