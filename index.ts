import * as FormData from 'form-data';
import Mailgun from 'mailgun.js';
import * as readline from 'readline';
import * as dotenv from 'dotenv';

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function question(questionText) {
  return new Promise((resolve) => {
    rl.question(questionText, (choice) => {
      resolve(choice);
    })
  })
}

async function getMenuChoice(options: string[]) {
  if (options.at(-1) != "Exit") {
    options.push("Exit");
  }

  console.log("Menu:");
  options.forEach((option, index) => {
    console.log(`${index + 1}. ${option}`);
  });

  return await question("Enter your choice: ");
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

async function getDomains(mg: any): Promise<string> {
  var domainList: string[] = [];

  await mg.domains.list()
    .then(domains => {
      for (const name of domains) {
        domainList.push(name.name)
      }
    })
    .catch(err => console.log(err));

  let domainIndex = await choice(domainList);
  var domain: string = domainList[domainIndex - 1];
  console.log(`You picked ` + domain);
  checkExit(domain)

  return domain
}

function handleOutput(option: number, element: object) {
  const fs = require('fs');

  switch (option) {
    case 1: {
      console.log(element);
      break;
    }
    case 2: {
      let userjson = fs.readFileSync('errors.json');
      let users = JSON.parse(userjson);
      users.push(element);
      userjson = JSON.stringify(users);
      fs.writeFileSync("errors.json", userjson, "utf-8");
      break;
    }
    case 3: {
      console.log(element);
      let userjson = fs.readFileSync('errors.json');
      let users = JSON.parse(userjson);
      users.push(element);
      userjson = JSON.stringify(users);
      fs.writeFileSync("errors.json", userjson, "utf-8");
      break;
    }
    default: {
      break;
    }
  }
}

async function getFails(mg: any) {
  const domain = await getDomains(mg);

  const filters = ["Filter on email domains", "Search for email address"]
  const filter = await choice(filters)
  checkExit(filters[filter - 1])

  let filterBase
  switch (filter) {
    case 1: {
      filterBase = await question('Input email domains: ');
      break;
    }
    case 2: {
      filterBase = await question('Input email address to search: ');
      break;
    }
    default: {
      break;
    }
  }

  const options = ["Output to console", "Save to JSON file", "Both output to console & save to JSON file"];
  const option = await choice(options);
  checkExit(options[option - 1])

  mg.events.get(domain, {
    event: 'failed'
  }).then(data => {
    data.items.forEach(element => {
      handleOutput(option, element);
    })
  })
    .catch(err => console.error(err));
}

function checkExit(choice: string) {
  if (choice == "Exit") {
    process.exit();
  }
}

async function main() {
  const MAILGUN_API = process.env.MAILGUN_API_KEY as string;

  let regions = ["USA", "EU"];
  let region = await choice(regions);

  console.log("You picked: " + regions[region - 1]);
  checkExit(regions[region - 1])

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
