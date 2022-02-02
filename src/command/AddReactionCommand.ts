import { ReactionsAddArguments } from '@slack/web-api';
import { CommandInterface, webClient } from '.';

const isAcceptableError = (e: unknown) => typeof e === 'object' && e !== null
  && 'message' in e
  && (e as any).message !== 'An API error occurred: already_reacted';

// eslint-disable-next-line import/prefer-default-export
export class AddReactionCommand implements CommandInterface {
  private props: ReactionsAddArguments;

  constructor(props: ReactionsAddArguments) {
    this.props = props;
  }

  public async exec() {
    try {
      await webClient.reactions.add(this.props);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      if (!isAcceptableError(e)) throw e;
    }
    return null;
  }
}
