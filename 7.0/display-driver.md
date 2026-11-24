# CrowPanel Advance 7.0: RGB display driver

The panel is an 800x480 parallel RGB display. The ESP32-S3 scans it out
continuously from a framebuffer in octal PSRAM. The driver is
`targets/targets/esp32/chip_bindings/displays/rgb_panel.cpp` in the geastack
targets package; the board target is `esp32-s3-elecrow-crowpanel-advance-7.0`.

## How a frame reaches the panel

- ESP-IDF's RGB panel runs with three framebuffers (`num_fbs=3`,
  `GEA_EMBEDDED_DISPLAY_RGB_SCAN_FBS`) and 20-row bounce buffers. If PSRAM has
  no room for three, it falls back to two, then one. The bounce ISR copies each
  band out of PSRAM.
- The panel's interrupts run on core 1 (`GEA_EMBEDDED_DISPLAY_RGB_ISR_CORE`),
  away from the runtime: the driver creates the panel from a task pinned there.
- Gea draws straight into the next framebuffer after the front one; there is no
  separate draw buffer. Publishing a frame is `esp_lcd_panel_draw_bitmap(back)`
  and moves no pixels. The driver switches buffers at the next frame wrap.
- The old front buffer is released one wrap later when the swap is issued from
  the ISR's core (inside a critical section), or two wraps later from the
  other core. Before the first draw into a buffer, the frame task waits on a
  semaphore for its release, so it never writes to rows the panel is still
  scanning. With three buffers the buffer drawn next was released a frame
  earlier, so that wait is usually already over.
- Each buffer keeps a list of the regions drawn into the other buffers since it
  was last shown. Before drawing, those regions are copied from the front
  buffer, except for rects the caller is about to repaint completely.
- With fused replay (`renderer.fuseReplayFlush`), each dirty rect is rastered
  from the display list into an internal-RAM strip buffer, band by band, and
  each band is written into the back buffer once. The repainted rects are
  skipped by the catch-up copy, so almost nothing is copied.
- A frame swaps only when something was published, so the trailing `flush()`
  does not cost a second swap.

## Enabling fused replay for an app

In the app's `package.json`:

```json
"gea": {
  "targets": {
    "esp32": {
      "boards": {
        "esp32-s3-elecrow-crowpanel-advance-7.0": {
          "build": { "renderer": { "fuseReplayFlush": true } }
        }
      }
    }
  }
}
```

The board entry in geastack's `targets/build-config.json` lists the option as
supported; without that entry the CLI drops it as inapplicable.

## Performance (svg-charts)

| Driver | fps | Per-frame copy |
| --- | --- | --- |
| Single framebuffer, memcpy into live scanout | 8.8 | 16 ms |
| Two framebuffers, direct drawing | 12.4 | 85k px catch-up, 12 ms |
| Two framebuffers, fused replay | 16.0 | under 1k px; 29.6 ms raster + 6 ms band write |
| Three framebuffers, fused replay, ISR on core 1 | 26.6 | |

With two framebuffers, moving the ISR to core 1 alone made it slower (13–14.7
fps): the release came two wraps later and the frame task waited 8–15 ms for
it. A third buffer hides that wait.

All rows with two or more framebuffers are tear-free: the panel's vsync count matches
the frame wraps (no scan restarts).

## Serial diagnostics

Every 100 frames the driver prints a `[rgb-swap]` line:

- `slip`: vsyncs minus frame wraps; nonzero means the scan restarted.
- `paths`: frames by flush path (flush / flushRects / rasterized / strip).
- `publish`, `raster`, `copy`, `wait`: per-frame microseconds.
- `px`, `patch_px`: pixels published and pixels caught up by copying.
- `unready`: a draw bypassed the release gate.
- `late`: the canvas was already dirty when the catch-up copy ran.

The `unready` and `late` counters should stay at 0.

## Constraints and notes

- PSRAM bandwidth is the limit. Scanout takes about 34 MB/s, and a
  PSRAM-to-PSRAM copy by the CPU reaches about 17 MB/s on top of it.
  - Splitting the copy across both cores gains nothing.
  - GDMA async memcpy is slower (11.9 MB/s at burst 16); larger bursts fail
    with `ESP_ERR_NO_MEM`.
- The frame task never blocks on this panel, so it gives the idle task one tick
  if nothing has blocked for 500 ms. Otherwise the task watchdog fires every
  5 s, and its 115200-baud backtrace starves the bounce ISR long enough to drop
  frames.
- The render worker's 12 KB internal-RAM stack does not fit on this board; it
  falls back to a PSRAM stack.
- In fused builds `Display::canvas()` waits for the buffer release but does not
  run the catch-up copy. The engine reads the canvas's dirty box and scroll
  region early in every frame. If that read ran the copy, it would cover all
  stale regions before the fused flush could name the rects it repaints. A
  read-only canvas accessor in the engine would remove this special case.
- Flash runs DIO at 80 MHz. QIO would free bus time on the MSPI bus that flash
  shares with PSRAM, but the CLI has no per-target flash-mode setting yet.
