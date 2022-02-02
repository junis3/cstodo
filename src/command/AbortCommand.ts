import { CommandInterface, CommandSignal } from './index';

// eslint-disable-next-line import/prefer-default-export
export class AbortCommand implements CommandInterface {
  // eslint-disable-next-line class-methods-use-this
  public async exec() {
    return CommandSignal.Abort;
  }
}
