globalThis.require = () => {
    throw new Error(
      "Calls to `require` from umd module definitions are not supported"
    );
  };

import regeneratorRuntime from "regenerator-runtime";
import { config } from "./config";
import NoSleep from "nosleep.js";

var noSleep = new NoSleep();

document.addEventListener('click', function enableNoSleep() {
  document.removeEventListener('click', enableNoSleep, false);
  noSleep.enable();
}, false);

export const game = new Phaser.Game(config)


