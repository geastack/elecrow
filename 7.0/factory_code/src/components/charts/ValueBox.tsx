// lv_chart's value box over a pressed point, as the widgets demo draws it:
// the value in the 16 px font, white, on a box of the series colour with a
// 4 px radius and 7 px padding (LV_DPX(5) and LV_DPX(8) at 130 DPI), its
// bottom 5 px above the point's top (the text sits LV_DPX(15) above it).
export const BOX_CENTER = 0;
export const BOX_FROM = 1;
export const BOX_TO = 2;

// Text height plus padding: the box is this tall.
const BOX_HEIGHT = 18 + 2 * 7;
const BOX_GAP = 5;
// Wide enough for any 0-100 value with its padding; the box shrinks to fit
// inside it.
const ANCHOR_WIDTH = 120;

// `x` is where the box centres (BOX_CENTER), starts (BOX_FROM) or ends
// (BOX_TO); `top` is the top of the point or bar it labels.
export function ValueBox(props: { x: number; top: number; value: number; color: string; align: number }) {
  const left =
    props.align === BOX_CENTER ? props.x - ANCHOR_WIDTH / 2 : props.align === BOX_FROM ? props.x : props.x - ANCHOR_WIDTH;
  const justify = props.align === BOX_CENTER ? "center" : props.align === BOX_FROM ? "flex-start" : "flex-end";
  return (
    <div
      class="value-box-anchor"
      style={{ left: left, top: props.top - BOX_GAP - BOX_HEIGHT, width: ANCHOR_WIDTH, justifyContent: justify }}
    >
      <span class="value-box" style={{ backgroundColor: props.color }}>
        {`${props.value}`}
      </span>
    </div>
  );
}
