#!/usr/bin/env bash
# Renders LVGL 8.3.11's widgets demo at 800x480 into reference/*.png: the
# picture the Gea port of the factory demo is measured against. LVGL is
# fetched into reference/build/ (gitignored) on first run.
#
# The factory firmware's own lv_conf.h is not published, so this uses
# LVGL's template defaults (130 DPI, light theme) plus what the demo asks
# for at this width: Montserrat 16 and 24.
set -euo pipefail

here="$(cd "$(dirname "$0")" && pwd)"
build="$here/build"
lvgl="$build/lvgl"
mkdir -p "$build"

if [ ! -d "$lvgl" ]; then
	git -c advice.detachedHead=false clone -q --depth 1 --branch v8.3.11 https://github.com/lvgl/lvgl.git "$lvgl"
fi

sed -e 's/^#if 0 \/\*Set it to "1" to enable content\*\//#if 1/' \
	-e 's/^#define LV_COLOR_DEPTH 16/#define LV_COLOR_DEPTH 32/' \
	-e 's/^    #define LV_MEM_SIZE (48U \* 1024U)/    #define LV_MEM_SIZE (1024U * 1024U)/' \
	-e 's/^#define LV_FONT_MONTSERRAT_16 0/#define LV_FONT_MONTSERRAT_16 1/' \
	-e 's/^#define LV_FONT_MONTSERRAT_24 0/#define LV_FONT_MONTSERRAT_24 1/' \
	-e 's/^#define LV_USE_DEMO_WIDGETS 0/#define LV_USE_DEMO_WIDGETS 1/' \
	"$lvgl/lv_conf_template.h" >"$build/lv_conf.h"

sources=$(find "$lvgl/src" "$lvgl/demos/widgets" -name '*.c')
cc -O1 -w -DLV_CONF_INCLUDE_SIMPLE -I"$build" -I"$lvgl" -I"$lvgl/.." \
	"$here/render.c" $sources -o "$build/render" -lm

"$build/render" "$build"
for ppm in "$build"/lvgl-*.ppm; do
	sips -s format png "$ppm" --out "$here/$(basename "${ppm%.ppm}").png" >/dev/null
done
ls "$here"/lvgl-*.png
