import { Dropdown } from "../../components/Dropdown";
import { PLACEHOLDER, TEXT } from "../../lib/palette";
import "../../components/controls.css";
import { GENDERS, profile } from "../../stores/profile";
import { theme } from "../../stores/theme";

// The text fields bind the store inside this component rather than through a
// TextField component's props: a component whose props change is rebuilt, and
// rebuilding the input being typed into drops its focus -- every key press
// closed the keyboard and lost the character.
export function ProfileForm() {
  return (
    <div class="card card-half">
      <span class="card-title">Your profile</span>
      <div class="field-row">
        <div class="field">
          <span class="muted">User name</span>
          <input
            class="text-input"
            caret-color={TEXT}
            type="text"
            value={profile.userName}
            style={{ color: profile.userName ? TEXT : PLACEHOLDER }}
            placeholder="Your name"
            onInput={(event) => profile.setUserName(event.target.value)}
          />
        </div>
        <div class="field">
          <span class="muted">Password</span>
          <input
            class="text-input"
            caret-color={TEXT}
            type="password"
            value={profile.password}
            style={{ color: profile.password ? TEXT : PLACEHOLDER }}
            placeholder="Min. 8 chars."
            onInput={(event) => profile.setPassword(event.target.value)}
          />
        </div>
      </div>
      <div class="field-row field-row-next">
        <Dropdown
          label="Gender"
          value={profile.gender}
          options={GENDERS}
          open={profile.genderOpen}
          primary={theme.primary}
          onToggle={() => profile.toggleGender()}
          onChange={(value: string) => profile.setGender(value)}
        />
        <div class="field">
          <span class="muted">Birthday</span>
          {/* LVGL's birthday text area opens the calendar instead of a keyboard. */}
          <div class="text-input" onClick={() => profile.openCalendar()}>
            <span>{profile.birthday}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
