# Record Label Simulator (Web Prototype)

Prototype of a management sim shell built with HTML, CSS and JavaScript. It mirrors
the earlier Godot scaffold using browser technologies.

## Development

Open `index.html` in a modern browser. Time controls, popup panels and demo
chart data are wired with plain JavaScript.

## Tests

Run `node --input-type=module -e "import {validateKoreanHangulOnly, resolve} from './titleResolver.js'; console.log(validateKoreanHangulOnly('버터'), validateKoreanHangulOnly('Butter'), resolve({ko:'버터', en:'Butter'}, 'ko'))"` to exercise the title resolver.
