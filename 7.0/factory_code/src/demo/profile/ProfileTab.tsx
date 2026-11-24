import { ProfileCard } from "./ProfileCard";
import { ProfileForm } from "./ProfileForm";
import { SkillsCard } from "./SkillsCard";
import "./profile.css";

// Profile: the contact card across the top, the profile form on the left
// and the skills card on the right.
export function ProfileTab() {
  return (
    <div class="tab-page" momentum>
      <ProfileCard />
      <div class="card-row">
        <ProfileForm />
        <SkillsCard />
      </div>
    </div>
  );
}
