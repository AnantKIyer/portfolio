const VISITOR_KEY = "portfolio_visitor_id";

export function getVisitorId(): string {
  if (typeof window === "undefined") {
    return "server";
  }

  const existing = localStorage.getItem(VISITOR_KEY);
  if (existing) {
    return existing;
  }

  const id = crypto.randomUUID();
  localStorage.setItem(VISITOR_KEY, id);
  return id;
}
