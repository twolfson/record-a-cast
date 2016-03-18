# Tests
Currently, testing for this project is done manually (except for linting). This is mostly due to my lack of knowledge for controlling X11 and the small footprint of this repo.

That being said, we wanted to write down test cases and edge cases that we can run through manually.

## `select-geometry.js`
- Resize each edge of window via window "frame"
    - Verify bounds match as expected
- Resize each corner of window via window "frame"
    - Verify bounds match as expected
- Drag window around via interior handle
    - Verify moves window as expected
- Drag window to edge of desktop
    - Verify window doesn't leave desktop or change size
    - Drag window away from edge of desktop
        - Verify window retains size and original browser/pointer offset
- Move window via arrow keys
    - TODO: Arrow keys implementation is pending
    - Verify moves window as expected
- Move window to edge of desktop via arrow keys
    - TODO: Arrow keys implementation is pending
    - Verify window doesn't leave desktop or change size
    - Move window away from edge of desktop via arrow keys
        - Verify window retains size and immediately moves (no lag for negative offsets)
- Resize window via arrow keys
    - TODO: Arrow keys implementation is pending
    - Verify resizes window as expected
- Resize window to edge of desktop via arrow keys
    - TODO: Arrow keys implementation is pending
    - Verify window doesn't leave desktop or change size
    - Resize window away from edge of desktop via arrow keys
        - Verify window retains other edges and immediately resizes (no lag for negative offsets)

## `record-a-cast.js`
- Verify any arguments after `--` get sent to FFmpeg
    - TODO: `--` implementation is pending
- Verify `--help` renders help message
- Verify a missing `outfile` will render help
- Verify `outfile` writes to our file in `process.cwd()`
- Verify `--delay` holds recording for `n` seconds
    - TODO: `--delay` implementtation is pending
