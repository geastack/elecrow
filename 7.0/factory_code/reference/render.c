// Renders LVGL 8.3's widgets demo at the CrowPanel's 800x480 into PNG-ready
// PPM frames, one per tab (and the bottom of each tab where it scrolls), so
// the Gea port can be compared against the real thing pixel for pixel.
// Built and run by render.sh.

#include "lvgl.h"
#include "demos/lv_demos.h"

#include <stdint.h>
#include <stdio.h>
#include <string.h>

#define WIDTH 800
#define HEIGHT 480

static lv_color_t draw_buf_pixels[WIDTH * HEIGHT];
static uint8_t frame[WIDTH * HEIGHT * 3];

static void flush(lv_disp_drv_t *drv, const lv_area_t *area, lv_color_t *pixels) {
	for (int y = area->y1; y <= area->y2; y++) {
		for (int x = area->x1; x <= area->x2; x++) {
			lv_color_t c = *pixels++;
			uint8_t *out = frame + (y * WIDTH + x) * 3;
			out[0] = c.ch.red;
			out[1] = c.ch.green;
			out[2] = c.ch.blue;
		}
	}
	lv_disp_flush_ready(drv);
}

// Advances LVGL's clock and runs its timers, so animations and the demo's
// own timers move as they would on the board.
static void run_for(uint32_t ms) {
	for (uint32_t t = 0; t < ms; t += 5) {
		lv_tick_inc(5);
		lv_timer_handler();
	}
}

// Depth-first search for the first object of the given class.
static lv_obj_t *find_class(lv_obj_t *obj, const lv_obj_class_t *cls) {
	if (lv_obj_check_type(obj, cls)) return obj;
	for (uint32_t i = 0; i < lv_obj_get_child_cnt(obj); i++) {
		lv_obj_t *found = find_class(lv_obj_get_child(obj, i), cls);
		if (found) return found;
	}
	return NULL;
}

static void save(const char *dir, const char *name) {
	lv_obj_invalidate(lv_scr_act());
	lv_refr_now(NULL);
	char path[512];
	snprintf(path, sizeof(path), "%s/%s.ppm", dir, name);
	FILE *f = fopen(path, "wb");
	if (!f) {
		perror(path);
		return;
	}
	fprintf(f, "P6\n%d %d\n255\n", WIDTH, HEIGHT);
	fwrite(frame, 1, sizeof(frame), f);
	fclose(f);
	printf("%s\n", path);
}

int main(int argc, char **argv) {
	const char *dir = argc > 1 ? argv[1] : ".";
	lv_init();

	static lv_disp_draw_buf_t draw_buf;
	lv_disp_draw_buf_init(&draw_buf, draw_buf_pixels, NULL, WIDTH * HEIGHT);
	static lv_disp_drv_t drv;
	lv_disp_drv_init(&drv);
	drv.hor_res = WIDTH;
	drv.ver_res = HEIGHT;
	drv.flush_cb = flush;
	drv.draw_buf = &draw_buf;
	lv_disp_drv_register(&drv);

	lv_demo_widgets();
	run_for(500);

	lv_obj_t *tabview = lv_obj_get_child(lv_scr_act(), 0);
	lv_obj_t *content = lv_tabview_get_content(tabview);
	static const char *names[] = {"profile", "analytics", "shop"};
	for (uint32_t tab = 0; tab < 3; tab++) {
		lv_tabview_set_act(tabview, tab, LV_ANIM_OFF);
		// Let the analytics meters and charts settle into their animation.
		run_for(tab == 1 ? 3000 : 300);
		char name[64];
		snprintf(name, sizeof(name), "lvgl-%s", names[tab]);
		save(dir, name);

		lv_obj_t *page = lv_obj_get_child(content, tab);
		if (lv_obj_get_scroll_bottom(page) > 0) {
			lv_obj_scroll_to_y(page, LV_COORD_MAX, LV_ANIM_OFF);
			run_for(300);
			snprintf(name, sizeof(name), "lvgl-%s-bottom", names[tab]);
			save(dir, name);
			lv_obj_scroll_to_y(page, 0, LV_ANIM_OFF);
		}
	}

	// The profile tab's "Your name" field focused: the demo's keyboard up.
	lv_tabview_set_act(tabview, 0, LV_ANIM_OFF);
	run_for(300);
	lv_obj_t *ta = find_class(lv_obj_get_child(content, 0), &lv_textarea_class);
	if (ta) {
		lv_event_send(ta, LV_EVENT_FOCUSED, NULL);
		run_for(300);
		save(dir, "lvgl-keyboard");
	}
	return 0;
}
