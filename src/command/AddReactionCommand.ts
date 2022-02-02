import { ReactionsAddArguments } from '@slack/web-api';
import { CommandInterface, webClient } from '.';

// eslint-disable-next-line import/prefer-default-export
export class AddReactionCommand implements CommandInterface {
  private props: ReactionsAddArguments;

  constructor(props: ReactionsAddArguments) {
    this.props = props;
  }

  public async exec() {
    await webClient.reactions.add(this.props);
    return null;
  }
}
