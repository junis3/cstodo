import { ThemeType } from "../database/user";

interface StringMap {
  [key: string]: string;
}
interface NestedStringMap {
  [key: string]: StringMap; 
}

const EmojiMap: NestedStringMap = {
  default: {
    blob: ':시신:',
    weeb: ':weebstare:',
  },
  cs: {
    blob: ':시신:',
    weeb: ':weebdead:',
  },
  ddokddul: {
    blob: ':blobddokddulsad:',
    weeb: ':weebno:',
  },
  fuck: {
    blob: ':blobfudouble:',
    weeb: ':weebfu:',
  },
  add: {
    blob: ':blobaww:',
    weeb: ':weebwoah:',
  },
  remove: {
    blob: ':blobfingerguns:',
    weeb: ':weebdab:',
  },
  help: {
    blob: ':blobok:',
    weeb: ':weebyay:',
  },
  sob: {
      blob: ':blobsob:',
      weeb: ':weebcry2:',
  },
  cry: {
      blob: ':blobcry:',
      weeb: ':weebcry:',
  },
  hug: {
      blob: ':blobhug:',
      weeb: ':weebyay2:',
  },
  aww: {
      blob: ':blobaww:',
      weeb: ':weebsugoi:'
  },
  communism: {
      blob: ':blobcommunism:',
      weeb: ':hammer_and_sickle:'
  },
  go: {
      mark: ':blobimfine:',
      marx: ':blobcommunism:',
  },
};

export const emoji = (name: string = '', theme = 'blob') => {
  return EmojiMap[name][theme] || ':시신:';
}

const MessageMap : NestedStringMap = {
  go: {
    mark: 'and <https://youtu.be/gUYdph3a3lA|go...>',
    marx: 'and <https://youtu.be/YZuAf7VAeKg|go...>',
  },
};

export const message = (name: string = '', theme: string) => {
  return MessageMap[name][theme] || ':시신:';
}