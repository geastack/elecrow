// A button drawn as artwork: one image at rest, another while pressed.
// `onPress(true)` fires on touch down, `onPress(false)` on release.
export function ImageButton(props: {
  class: string;
  image: string;
  pressedImage: string;
  pressed: boolean;
  onPress: (down: boolean) => void;
}) {
  return (
    <div class={props.class} onPointerDown={() => props.onPress(true)} onPointerUp={() => props.onPress(false)}>
      <img class="image-button-art" src={props.pressed ? props.pressedImage : props.image} />
    </div>
  );
}
