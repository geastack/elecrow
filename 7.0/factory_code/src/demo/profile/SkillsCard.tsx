import { Switch } from "../../components/Switch";
import { profile } from "../../stores/profile";
import { ExperienceSlider } from "./ExperienceSlider";
import { theme } from "../../stores/theme";

function Toggle(props: { label: string; on: boolean; onToggle: () => void }) {
  return (
    <div class="toggle">
      <span class="muted">{props.label}</span>
      <Switch on={props.on} color={theme.primary} onToggle={() => props.onToggle()} />
    </div>
  );
}

export function SkillsCard() {
  return (
    <div class="card card-half">
      <span class="card-title">Your skills</span>
      <span class="muted field-gap">Experience</span>
      <div class="skills-slider">
        <ExperienceSlider />
      </div>
      <div class="field-row skills-switches">
        <Toggle label="Hard-working" on={profile.hardWorking} onToggle={() => profile.toggleHardWorking()} />
        <Toggle label="Team player" on={profile.teamPlayer} onToggle={() => profile.toggleTeamPlayer()} />
      </div>
    </div>
  );
}
