import { Checkbox } from "../../components/Checkbox";
import { shop } from "../../stores/shop";
import { theme } from "../../stores/theme";

export function NotificationList() {
  return (
    <div class="card card-half list-card">
      <span class="card-title">Notification</span>
      {shop.notices.map((notice, index) => (
        <Checkbox
          label={notice.text}
          checked={notice.checked}
          disabled={notice.disabled}
          color={theme.primary}
          onToggle={() => shop.toggleNotice(index)}
        />
      ))}
    </div>
  );
}
