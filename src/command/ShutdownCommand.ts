import { CommandInterface } from '.';

export class ShutdownCommand implements CommandInterface {
  // eslint-disable-next-line class-methods-use-this
  public async exec() {
    process.exit();
    return null;
  }
}
