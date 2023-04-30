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
  edit: {
    blob: ':blobworker:',
    weeb: ':weebcoding:',
  },
  remove: {
    blob: ':blobfingerguns:',
    weeb: ':weebdab:',
  },
  search: {
    blob: ':blobsmilehappyeyes:',
    weeb: ':weebsanta:',
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
    weeb: ':weebsugoi:',
  },
  communism: {
    blob: ':blobcommunism:',
    weeb: ':hammer_and_sickle:',
  },
  go: {
    mark: ':blobimfine:',
    marx: ':blobcommunism:',
  },

  bar_ready: {
    blob: ':sad:',
    weeb: ':weebdancered:',
  },
  bar_wip: {
    blob: ':blobgreensad:',
    weeb: ':weebdanceyellow:',
  },
  bar_done: {
    blob: ':blobgreen:',
    weeb: ':weebdancegreen:',
  },
  hw: {
    blob: ':blobmath:',
    weeb: ':weebehh:',
  },
};

export const emoji = (name: string = '', theme = 'blob') => EmojiMap[name][theme] || ':시신:';

const MessageMap: NestedStringMap = {
  go: {
    mark: 'and <https://youtu.be/gUYdph3a3lA|go...>',
    marx: 'and <https://youtu.be/YZuAf7VAeKg|go...>',
  },
};

export const message = (name: string = '', theme: string) => MessageMap[name][theme] || ':시신:';
