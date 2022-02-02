import { CommandInterface, CommandSignal } from './index';

// eslint-disable-next-line import/prefer-default-export
export class SerialCommand implements CommandInterface {
  commands: CommandInterface[];

  constructor(...commands: CommandInterface[]) {
    this.commands = commands;
  }

  public async exec() {
    // eslint-disable-next-line no-restricted-syntax
    for (const command of this.commands) {
      // eslint-disable-next-line no-await-in-loop
      const result = await command.exec();

      if (result === CommandSignal.Abort) return result;
    }
    return null;
  }
}
