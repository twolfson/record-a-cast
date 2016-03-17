# record-a-cast [![Build status](https://travis-ci.org/twolfson/record-a-cast.svg?branch=master)](https://travis-ci.org/twolfson/record-a-cast)

Select and record a portion of your desktop

`record-a-cast` was created out of frustration for either poor UI, poor compatibility with Linux, or both. It's based on well-tested technologies (e.g. [Electron][], [FFmpeg][]) so it should work well on most environments.

[Electron]: https://github.com/atom/electron
[FFmpeg]: https://www.ffmpeg.org/

![Select an area](http://i.imgur.com/hOIceGa.png) `->` ![Get screencast](http://i.imgur.com/jO8vvMa.gif)

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
- Support for `--` (e.g. `record-a-cast out.mp4 -- -r 10`)

// TODO: Record and compare the following
//  avconv recorded GIF
//    avconv -video_size 300x200 -f x11grab -i "$DISPLAY"+100,200 -r 10 -frames 30 -pix_fmt rgb24 gif.gif
//  avconv recorded MP4 that's converted to GIF via `avconv`
//    avconv -video_size 300x200 -f x11grab -i "$DISPLAY"+100,200 -r 10 -frames 30 mp4.mp4
//    avconv -i mp4.mp4 -vf palettegen palette.png
//      https://ffmpeg.org/ffmpeg-filters.html#palettegen-1
//    libav-tools seems to lack `palettegen` so this is not plausible
//  avconv recorded MP4 that's converted to GIF via ImageMagick
//    avconv -video_size 300x200 -f x11grab -i "$DISPLAY"+100,200 -r 10 -frames 30 mp4.mp4
//    avconv -i mp4.mp4 frames/out%03d.png
//    convert -loop 0 frames/*.png imagemagick.gif

// TODO: For easier development, set `-frames` count and allow this to run on loop
//   prob name the CLI parameter `--duration`

// TODO: Set low frame rate like 10
// Attribution to: https://gist.github.com/dergachev/4627207
//   and https://trac.ffmpeg.org/wiki/Capture/Desktop
// Never mind this is a literal GIF output and the colors are effed
//   avconv -video_size 1024x768 -f x11grab -i "$DISPLAY"+100,200 -pix_fmt rgb24 -f gif - | cat
// This is generating transparent images for some reason...
//   avconv -video_size 1024x768 -f x11grab -i "$DISPLAY"+100,200 frames/ffout%03d.png
// This works but mp4... =_=
//   avconv -video_size 1024x768 -f x11grab -i "$DISPLAY"+100,200 out.mp4

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
