import { Button } from "../../components/Button";
import { profile } from "../../stores/profile";
import { theme } from "../../stores/theme";

// The contact card across the top of the Profile tab, on LVGL's grid: the
// avatar spans every row on the left; the name, the description, then the
// e-mail and phone lines with the two buttons beside them.
export function ProfileCard() {
  return (
    <div class="card card-wide profile-card">
      <img class="avatar" src="images/lvgl-avatar.png" />
      <span class="card-title profile-name">Elena Smith</span>
      <span class="muted profile-description">This is a short description of me. Take a look at my profile!</span>
      <img class="contact-icon email-icon" src="icons/envelope.png" />
      <span class="contact-text email-text">elena@smith.com</span>
      <img class="contact-icon phone-icon" src="icons/phone.png" />
      <span class="contact-text phone-text">+79 246 123 4567</span>
      <div class="profile-log-out">
        <Button
          label="Log out"
          color={theme.primary}
          disabled={false}
          pressed={profile.logOutPressed}
          onPress={(down: boolean) => profile.pressLogOut(down)}
        />
      </div>
      <div class="profile-invite">
        <Button label="Invite" color={theme.primary} disabled={true} pressed={false} onPress={() => null} />
      </div>
    </div>
  );
}
