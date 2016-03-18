# record-a-cast [![Build status](https://travis-ci.org/twolfson/record-a-cast.svg?branch=master)](https://travis-ci.org/twolfson/record-a-cast)

Select and record a portion of your desktop

`record-a-cast` was created out of frustration for either poor UI, poor compatibility with Linux, or both. It's based on well-tested technologies (e.g. [Electron][], [FFmpeg][]) so it should work well on most environments.

[Electron]: https://github.com/atom/electron
[FFmpeg]: https://www.ffmpeg.org/

**Features:**

- Resizing handles at edges
- Draggable window
- Movement/resizing via arrow keys

## Demonstration
**1) Select an area**

![Select an area image][]

[Select an area image]: http://i.imgur.com/hOIceGa.png)

**2) Get a screencast**

![Get a screencast image][]

[Get a screencast image]: http://i.imgur.com/jO8vvMa.gif

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
1) Install the module globally via `npm install -g record-a-cast`

2) Start running `record-a-cast` via `record-a-cast recording.mov`

3) Select an area via a draggable/resizable window

![Select an area image][]

4) Press `Enter` and FFmpeg will begin recording that area

5) To stop recording, send a keyboard interrupt to `record-a-cast` (typically `Ctrl+C`)

6) Your recording will be available at `recording.mov`

![Recording image][Get a screencast image]

## Documentation
### CLI usage
Our CLI currently supports the following:

```
$ record-a-cast --help

  Usage: record-a-cast [options] <outfile>

  Options:

    -h, --help     output usage information
    -V, --version  output the version number

```

### Environment variables
We support the following environment variables:

- FFMPEG_BIN `String` - Path to desired FFmpeg executable
    - By default, we will search for `ffmpeg` and `avconv` on `PATH`

## Examples
### Creating a GIF
**Requirements:**

- [ImageMagick][], image manipulation library which is much better at generating GIFs than FFmpeg
    - `apt-get install imagemagick`

[ImageMagick]: http://www.imagemagick.org/script/index.php

**Script:**

```bash
# Record our screencast
record-a-cast recording.mov

# Output each frame to a folder
# DEV: When we tried to record directly to PNGs via FFmpeg, they were all empty
#   Hence, this 2 step process
# DEV: We use `-r 10` to output 10FPS since GIFs move slower
mkdir frames
ffmpeg -i recording.mov -r 10 frames/recording%03d.png

# DEV: If you want to remove any frames from the final product
#   then navigate to `frames` and delete them

# Combine our frames into a GIF via ImageMagick
convert -loop 0 frames/recording*.png recording.gif
```

Want more variations on this? See the following links:

- https://gist.github.com/dergachev/4627207
- https://gist.github.com/SlexAxton/4989674

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
