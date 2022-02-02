import { CommandInterface } from '.';

// eslint-disable-next-line import/prefer-default-export
export class ShutdownCommand implements CommandInterface {
  // eslint-disable-next-line class-methods-use-this
  public async exec() {
    process.exit();
    return null;
  }
}
