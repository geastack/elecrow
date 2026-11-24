import "./controls.css";

// LVGL's drop-down list: the chosen option and a chevron in a field; a tap
// opens the options in a card under it, the chosen one on the primary colour.
export function Dropdown(props: {
  label: string;
  value: string;
  options: string[];
  open: boolean;
  primary: string;
  onToggle: () => void;
  onChange: (value: string) => void;
}) {
  return (
    <div class="field dropdown-field">
      <span class="muted">{props.label}</span>
      <div class="dropdown" onClick={() => props.onToggle()}>
        <span>{props.value}</span>
        <svg class="dropdown-chevron" width={14} height={9} viewBox="0 0 14 9">
          <polyline points="1.5,1.5 7,7 12.5,1.5" fill="none" stroke="#212121" stroke-width={3} />
        </svg>
      </div>
      {props.open ? (
        <div class="dropdown-list">
          {props.options.map((option) => (
            <div
              class="dropdown-option"
              style={{
                backgroundColor: option === props.value ? props.primary : "#ffffff",
                color: option === props.value ? "#ffffff" : "#212121",
              }}
              onClick={() => props.onChange(option)}
            >
              {option}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
