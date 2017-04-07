# record-a-cast [![Build status](https://travis-ci.org/twolfson/record-a-cast.svg?branch=master)](https://travis-ci.org/twolfson/record-a-cast)

Select and record a portion of your desktop

`record-a-cast` was created out of frustration for either poor UI, poor compatibility with Linux, or both. It's based on well-tested technologies (e.g. [Electron][], [FFmpeg][]) so it should work well on most environments.

[Electron]: https://github.com/atom/electron
[FFmpeg]: https://www.ffmpeg.org/

## Demonstration
**1) Select an area**

![Select an area image][]

[Select an area image]: http://i.imgur.com/hOIceGa.png

**2) Get a screencast**

![Get a screencast image][]

[Get a screencast image]: http://i.imgur.com/jO8vvMa.gif

## Donating
Support this project and [others by twolfson][twolfson-projects] via [PayPal][paypal-twolfson].

[![Support via PayPal][paypal-button]][paypal-twolfson]

[twolfson-projects]: http://twolfson.com/projects
[paypal-button]: http://rawgit.com/twolfson/paypal-github-button/1.x.x/dist/button.svg
[paypal-twolfson]: http://bit.ly/twolfson-paypal-5

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

  Usage: record-a-cast [options] <outfile> [-- ffmpeg-options]

  Options:

    -h, --help                  output usage information
    -V, --version               output the version number
    --delay <delay>             Milliseconds to wait before recording starts
                       (default: 50 to prevent visible overlays)
    --height-divisor <divisor>  Resize only to heights divisible by `m`
    --width-divisor <divisor>   Resize only to widths divisible by `n`

```

As noted, we support passing through options to FFmpeg via a `--` delimiter. For example, we can pass `-r 10` (record at 10FPS) to `ffmpeg`:

```bash
record-a-cast out.mov -- -r 10
# Invokes: /usr/bin/ffmpeg -video_size 20x20 -f x11grab -i :0+20,20 -y -r 10 out.mov
```

### Environment variables
We support the following environment variables:

- FFMPEG_BIN `String` - Path to desired FFmpeg executable
    - By default, we will search for `ffmpeg` and `avconv` on `PATH`

## Examples
### Custom height/width divisors
On some computers, we can encounter errors like:

```
[libx264 @ 0x12f24c0] width not divisible by 2 (801x600)
```

These are caused by our codec requiring even heights/widths for its format. To work around this, we support snapping our selection to height/widths that are only even (e.g. `801 -> 802`).

To run `record-a-cast` with snapping to even heights/widths, use:

```bash
record-a-cast --height-divisor 2 --width-divisor 2--out.mov
```

### Custom framerate
When recording something like a GIF, we might want a reduced framerate to save on size and poor frame delays. Here's an example of recording a movie at 10FPS:

```bash
record-a-cast out.mov -- -r 10
# Invokes: /usr/bin/ffmpeg -video_size 20x20 -f x11grab -i :0+20,20 -y -r 10 out.mov
```

### Duration
Sometimes we might want to only record for a few seconds. In this example, we will set our framerate to 24FPS and record for 3 seconds (72 frames).

```bash
record-a-cast out.mov -- -r 24 -frames 72
# Invokes: /usr/bin/ffmpeg -video_size 20x20 -f x11grab -i :0+20,20 -y -r 24 -frames 72 out.mov

# Compute duration dynamically in bash
# record-a-cast out.mov -- -r 24 -frames "$((3 * 24))"
```

### Creating a GIF
**Requirements:**

- [ImageMagick][], image manipulation library which is much better at generating GIFs than FFmpeg
    - `apt-get install imagemagick`

[ImageMagick]: http://www.imagemagick.org/script/index.php

**Script:**

```bash
# Record our screencast with a reduced framerate
# DEV: We use `-r 10` to output 10FPS since GIFs move slower
record-a-cast recording.mov -- -r 10

# Output each frame to a folder
# DEV: When we tried to record directly to PNGs via FFmpeg, they were all empty
#   Hence, this 2 step process
mkdir frames
ffmpeg -i recording.mov frames/recording%03d.png

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

## Unlicense
As of Mar 17 2016, Todd Wolfson has released this repository and its contents to the public domain.

It has been released under the [UNLICENSE][].

[UNLICENSE]: UNLICENSE
