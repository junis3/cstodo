import { CommandInterface, CommandSignal } from './index';

// eslint-disable-next-line import/prefer-default-export
export class ParallelCommand implements CommandInterface {
  commands: CommandInterface[];

  constructor(...commands: CommandInterface[]) {
    this.commands = commands;
  }

  public async exec() {
    const results = await Promise.all(
      this.commands.map((command) => command.exec())
    );

    const signals = results.filter(
      (result) => result !== null
    ) as CommandSignal[];

    if (signals.length > 0) return signals[0];
    return null;
  }
}
