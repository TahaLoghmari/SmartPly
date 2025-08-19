import {
  Info,
  Mail,
  Calendar,
  CircleX,
  Ghost,
  CircleCheckBig,
  Send,
} from "lucide-react";
import type { NotificationType } from "#/notifications";
import type { ElementType } from "react";

export const NOTIFICATION_TYPE_TO_ICON: Record<NotificationType, ElementType> =
  {
    otherUpdate: Info,
    emailUpdate: Mail,
    applied: Send,
    interview: Calendar,
    offer: CircleCheckBig,
    rejected: CircleX,
    ghosted: Ghost,
  };
