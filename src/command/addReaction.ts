import { ReactionsAddArguments } from '@slack/web-api';
import { Command, webClient } from '.';

// eslint-disable-next-line import/prefer-default-export
export class AddReactionCommand implements Command {
  private props: ReactionsAddArguments;

  constructor(props: ReactionsAddArguments) {
    this.props = props;
  }

  public async exec(): Promise<void> {
    await webClient.reactions.add(this.props);
  }
}
