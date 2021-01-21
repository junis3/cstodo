interface StringMap {
  [key: string]: string;
}
interface NestedStringMap {
  [key: string]: StringMap; 
}

export const IconEmojiMap: NestedStringMap = {
  default: {
    blob: ':시신:',
    weeb: ':weebstare:',
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
      weeb: ':weebcry:',
  },
  go: {
      mark: ':blobimfine:',
      marx: ':blobcommunism:',
  },
};

export const MessageMap : NestedStringMap = {
  fuck: {
    blob: ':blobfudouble:'.repeat(13),
    weeb: ':weebfu:'.repeat(13),
  },
  go: {
    mark: 'and <https://youtu.be/1RRStUaTZZk|go...>',
    marx: 'and <https://youtu.be/YZuAf7VAeKg|go...>',
  },
};

export let cstodoMode : string = 'blob';
export function setCstodoMode(mode: string) {
  cstodoMode = mode;
  return;
}
