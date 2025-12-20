interface Props {
  status: "ON_TRACK" | "OFF_TRACK";
}

export default function StatusBadge({ status }: Props) {
  const isOnTrack = status === "ON_TRACK";
  const color = isOnTrack ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800";
  const label = isOnTrack ? "On Track" : "Off Track";
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${color}`}>
      <span className={`mr-2 h-2 w-2 rounded-full ${isOnTrack ? "bg-green-500" : "bg-amber-500"}`}></span>
      {label}
    </span>
  );
}
