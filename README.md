# record-a-cast [![Build status](https://travis-ci.org/twolfson/record-a-cast.svg?branch=master)](https://travis-ci.org/twolfson/record-a-cast)

Select and record a portion of your desktop

`record-a-cast` was created out of frustration for either poor UI, poor compatibility with Linux, or both. It's based on well-tested technologies (e.g. [Electron][], [FFmpeg][]) so it should work well on most environments.

[Electron]: https://github.com/atom/electron
[FFmpeg]: https://www.ffmpeg.org/

## Requirements
- X11 server, [FFmpeg][] requires this for its `x11grab` functionality
- [npm][], usually installed with [Node.js][]
    - Used for installing dependencies
    - We recommend installing via: <https://github.com/nodesource/distributions>
- [FFmpeg][], used for recording the screen
    - This might be known as `avconv` on your distribution
    - For `apt` installation, this might be one of:
        - `apt-get install ffmpeg`
        - `apt-get install libav-tools`

[npm]: http://npmjs.org/
[Node.js]: http://nodejs.org/

## Getting Started
Install the module with: `npm install record-a-cast`

```js
var recordACast = require('record-a-cast');
recordACast(); // 'awesome'
```

## Documentation
_(Coming soon)_

- FFMPEG_BIN
- Various usages (e.g. `-r` for lower frame rate)
- Various GIF creation solutions (e.g. ImageMagick)
- `--delay`
- `--duration`
- Support for `--` (e.g. `record-a-cast out.mp4 -- -r 10`

## Examples
_(Coming soon)_

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint via `npm run lint` and test via `npm test`.

## Donating
Support this project and [others by twolfson][gratipay] via [gratipay][].

[![Support via Gratipay][gratipay-badge]][gratipay]

[gratipay-badge]: https://cdn.rawgit.com/gratipay/gratipay-badge/2.x.x/dist/gratipay.svg
[gratipay]: https://www.gratipay.com/twolfson/

## Unlicense
As of Mar 17 2016, Todd Wolfson has released this repository and its contents to the public domain.

It has been released under the [UNLICENSE][].

[UNLICENSE]: UNLICENSE
