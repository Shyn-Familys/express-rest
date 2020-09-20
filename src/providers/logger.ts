import chalk from 'chalk';

type TypeLog = 'Info' | 'Notify' | 'Error' | 'Success';

interface LogParams {
  type: TypeLog;
  message: string;
}

export default ({ type, message }: LogParams) => {
  switch (type) {
    case 'Success':
      return console.log(chalk.green(message));
    case 'Info':
      return console.log(chalk.blue(message));
    case 'Notify':
      return console.log(chalk.green(message));
    case 'Error':
      return console.log(chalk.red(message));
  }
};
