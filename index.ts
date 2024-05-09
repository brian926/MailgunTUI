import * as FormData from 'form-data';
import Mailgun from 'mailgun.js';
import * as readline from 'readline';
import * as dotenv from 'dotenv';

dotenv.config();

function getMenuChoice(options: string[]) {
  if (options.at(-1) != "Exit") {
    options.push("Exit");
  }

  console.log("Menu:");
  options.forEach((option, index) => {
    console.log(`${index + 1}. ${option}`);
  });

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question("Enter your choice: ", (choice) => {
      rl.close();
      resolve(choice);
    });
  });
}

async function choice(options: string[]): Promise<number> {
  while (true) {
    let choice = await getMenuChoice(options) as string;
    const optionIndex = parseInt(choice);

    if (optionIndex >= 1 && optionIndex <= options.length) {
      return optionIndex
    } else {
      console.log("Invalid choice. Please enter a valid option number.");
    }
  }
}

async function getFails(mg: any) {
  var domainList: string[] = [];
  const fs = require('fs');

  await mg.domains.list()
    .then(domains => {
      for (const name of domains) {
        domainList.push(name.name)
      }
    })
    .catch(err => console.log(err));

  let domainIndex = await choice(domainList);
  var domain = domainList[domainIndex - 1];
  console.log(`You picked ` + domain);
  if (checkExit(domain)) {
    return;
  }

  mg.events.get(domain, {
    event: 'failed'
  }).then(data => {
    data.items.forEach(element => {
      if (element.recipient.toLowerCase().includes("gmail")) {
        let userjson = fs.readFileSync('errors.json');
        let users = JSON.parse(userjson);
        users.push(element)
        userjson = JSON.stringify(users)
        fs.writeFileSync("errors.json", userjson, "utf-8")
      }
    });
  })
    .catch(err => console.error(err));
}

function checkExit(choice: string): boolean {
  if (choice == "Exit") {
    return true;
  }
  return false;
}

async function main() {
  const MAILGUN_API = process.env.MAILGUN_API_KEY as string;

  let regions = ["USA", "EU"];
  let region = await choice(regions);

  console.log("You picked: " + regions[region - 1]);
  if (checkExit(regions[region - 1])) {
    return;
  }

  const mailgun = new Mailgun(FormData);
  var mg;

  if (regions[region - 1] == "EU") {
    mg = mailgun.client({ username: 'api', key: MAILGUN_API, url: 'https://api.eu.mailgun.net' });
  } else {
    mg = mailgun.client({ username: 'api', key: MAILGUN_API, url: 'https://api.mailgun.net' });
  }

  getFails(mg);
}

// Start the program
main();
