// Urgency level based on days remaining to the syllabus deadline
export function urgencyLevel(diff) {
  if (diff <= 14) return "critical";
  if (diff <= 45) return "crunch";
  if (diff <= 100) return "watch";
  return "safe";
}

export const URGENCY_MSG = {
  safe: "On track. Keep a steady daily pace across every subject.",
  watch: "Pace check — you're in the back half of prep time. Tighten your schedule.",
  crunch: "Crunch time. Prioritize weak-flagged topics and stop starting new ones.",
  critical: "Final stretch. Finish what's open — revision & mocks start right after this."
};

// Calendar cell color bucket based on days to deadline
export function cdBucket(diff) {
  if (diff <= 14) return "cd-critical";
  if (diff <= 45) return "cd-danger";
  if (diff <= 100) return "cd-warn";
  return "cd-safe";
}
