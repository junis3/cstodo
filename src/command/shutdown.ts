import { Command } from '.';

// eslint-disable-next-line import/prefer-default-export
export class ShutdownCommand implements Command {
  // eslint-disable-next-line class-methods-use-this
  public async exec(): Promise<void> {
    process.exit();
  }
}
