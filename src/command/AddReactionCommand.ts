import { ReactionsAddArguments } from '@slack/web-api';
import { CommandInterface, webClient } from '.';

const isAcceptableError = (e: unknown) => typeof e === 'object' && e !== null
  && 'message' in e
  && (e as any).message === 'An API error occurred: already_reacted';

interface CustomReactionsAddArguments {
  command?: string;
};

type ExtendedReactionsAddArguments = CustomReactionsAddArguments & ReactionsAddArguments;

// eslint-disable-next-line import/prefer-default-export
export class AddReactionCommand implements CommandInterface {
  private props: ExtendedReactionsAddArguments;

  constructor(props: ExtendedReactionsAddArguments) {
    this.props = props;
  }

  public async exec() {
    try {
      if(this.props.command) await webClient.reactions.add(this.props);
    } catch (e) {
      if (!isAcceptableError(e)) throw e;
    }
    return null;
  }
}
