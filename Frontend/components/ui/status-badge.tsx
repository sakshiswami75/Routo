import { Badge } from "@/components/ui/badge";
import { statusTone } from "@/utils/status";
import type { DeliveryStatus, ParcelStatus } from "@/types/models";

export function StatusBadge({ status }: { status: ParcelStatus | DeliveryStatus }) {
  return <Badge className={statusTone(status)}>{status.replaceAll("_", " ")}</Badge>;
}
