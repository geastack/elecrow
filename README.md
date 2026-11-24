# Elecrow CrowPanel factory demos in Gea

This repository contains Gea ports of Elecrow's factory demos. The table also
lists CrowPanel boards supported by Gea for your own apps.

| Board | Factory demo | Hardware and build notes |
| --- | --- | --- |
| CrowPanel Rotary 1.46-inch (DHR55146D V1.0, 360×360 IPS) | [Rotary demo](1.46/factory_code/) | [Rotary board notes](1.46/README.md) |
| CrowPanel Advanced 5.0-inch (ESP32-P4, 800×480 IPS, GT911 touch) | — | [Gea board definition](https://github.com/geastack/targets/blob/main/targets/esp32-p4-elecrow-crowpanel-advanced-5.0.json) |
| CrowPanel Advance 7.0-inch (800×480 IPS, GT911 touch) | [Advance demo](7.0/factory_code/) | [Display driver](7.0/display-driver.md), [Elecrow hardware reference](https://github.com/Elecrow-RD/CrowPanel-Advance-7-HMI-ESP32-S3-AI-Powered-IPS-Touch-Screen-800x480) |

## Build and run

Install Node.js 22 or newer and [set up Gea's ESP-IDF toolchain](https://github.com/geastack/cli/blob/main/docs/SETUP.md).
Connect the board over USB. Run the commands from the repository root for
your model.

### CrowPanel Rotary 1.46-inch

Replace `<alias>` with the alias you select during board setup.

```sh
cd 1.46/factory_code
npm ci
npm run check
npx gea boards add
npx gea run --board <alias> --app crowpanel-rotary-146-factory
```

Rotate or swipe to select Volume, Temp, or Light. Press the knob to open a
control, then use the knob or touch the dial to adjust it. Double-press the
knob or tap Return to go back. The RGB ring runs the factory chase, flash,
and breathing patterns. The [board notes](1.46/README.md) link to Elecrow's
original firmware and document the display, controls, and LEDs.

### CrowPanel Advance 7.0-inch

```sh
cd 7.0/factory_code
npm ci
npm run check
npx gea boards discover
```

In `~/.geastack/boards.json`, add a `crowpanel-7` entry with
`"target": "esp32-s3-elecrow-crowpanel-advance-7.0"`. Set
`transports.usbSerial.serial` to the USB serial reported by discovery, or set
`transports.usbSerial.port` to the discovered port if the adapter has no serial.

```sh
npx gea run --board crowpanel-7 --app crowpanel-factory
```

The demo includes the CrowPanel splash, a timed menu, a touch-coordinate
check with four-corner calibration, and a Gea port of the LVGL 8 widgets
demo with Profile, Analytics, and Shop tabs.

### CrowPanel Advanced 5.0-inch

Use the Gea target `esp32-p4-elecrow-crowpanel-advanced-5.0` to build and flash
your own apps. This repository contains factory demo ports for the 1.46-inch
and 7.0-inch models.

## Credits

- Elecrow provided the factory artwork.
- The 7.0-inch demo's avatars and product images come from LVGL (MIT).
- The 7.0-inch demo uses Phosphor icons (MIT).
- Montserrat is licensed under the SIL Open Font License 1.1.
