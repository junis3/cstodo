import { CommandInterface, CommandSignal } from './index';

export class AbortCommand implements CommandInterface {
  // eslint-disable-next-line class-methods-use-this
  public async exec() {
    return CommandSignal.Abort;
  }
}
