# CrowPanel 1.46-inch Rotary HMI

DHR55146D V1.0. The factory demo is in [factory_code](factory_code).
The Gea target is `esp32-s3-elecrow-rotary-1.46`.

```sh
cd factory_code
npm install
npm run check
npx gea run --board <alias> --app crowpanel-rotary-146-factory
```

Register the connected board with `gea boards add`. When using a local
targets checkout, point `GEA_TARGETS_ROOT` at its absolute path.

## Factory reference

The reference is Elecrow's September 16, 2026 factory image and the
corresponding Arduino sketch and SquareLine project, upstream revision
`3dfdbfe`. The source tree is kept locally in `vendor/`. Artwork comes from
its SquareLine assets. The Montserrat font is covered by the SIL OFL.

- The 360×360 JD9855 is connected over SPI2 using SCK GPIO10, MOSI GPIO11,
  CS GPIO9, DC GPIO3, and reset GPIO14. The factory sketch selects mode 0,
  80 MHz writes, RGB565, normal polarity, and zero offsets. Elecrow's
  LovyanGFX fork calls this controller ST77961. The panel receives Elecrow's
  initialization commands and uses Gea's shared SPI display backend for
  transfers. GPIO46 provides the 5 kHz backlight PWM.
- The CST816T uses I²C at 400 kHz on GPIO6/7, with falling-edge IRQ on GPIO5
  and active-low reset on GPIO13. The schematic and the vendor library's
  constructor agree on these pins. The auxiliary connector is GPIO38/39.
- Encoder A and B are GPIO45/42, and the active-low knob switch is GPIO41.
  Rotation and a horizontal swipe move the main-menu selection, a short
  press enters a detail page, and a double press returns to the menu. Detail
  rings respond to touch and five-unit encoder steps.
- GPIO40 is the active-low power indicator. GPIO1 and GPIO2 enable the
  display power rails and GPIO17 enables the ring supply. GPIO48 drives
  eight GRB pixels at 800 kHz. The factory animation cycles through white
  chase, fast color flash, color chase, slow color flash, and breathing.
  The Temp page controls the separate GPIO43 PWM demonstration LED. The
  Light page controls the LCD backlight, including a duty of zero.
- The board uses 16 MB DIO flash at 80 MHz, 8 MB octal PSRAM at 80 MHz, and
  a 240 MHz CPU. The factory release ships an Arduino ESP32 Core 3.3.8-cn
  binary and its 10 MB application partition layout. Gea uses ESP-IDF
  and two 6 MB OTA slots. Upstream ships no complete factory sdkconfig
  for a field-by-field cache or kernel configuration comparison.

[Elecrow factory source and firmware](https://github.com/Elecrow-RD/CrowPanel-1.46inch-HMI-ESP32-Rotary-Display)

The Gea app has separate Splash, Menu, and Detail components with their own
stylesheets. The RGB patterns and timing run in TypeScript through Gea's
`Led` API. The app's board binding exposes the demonstration bulb's PWM
output.
