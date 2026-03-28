type CharityCalloutProps = {
  amount: number;
  past?: boolean;
};

export default function CharityCallout({ amount, past }: CharityCalloutProps) {
  if (amount <= 0) return null;

  return (
    <div className="border-2 border-[var(--accent)] bg-[var(--accent)]/5 p-4 sm:p-5">
      <div className="flex items-center gap-3">
        <div className="h-[3px] w-6 bg-[var(--accent)]" />
        <span className="font-[family-name:var(--font-body)] text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--accent)] sm:text-xs">
          Movement Impact
        </span>
      </div>
      <p className="mt-2 font-[family-name:var(--font-body)] text-sm text-[var(--muted)]">
        This order {past ? "contributed" : "will contribute"}{" "}
        <span className="font-bold text-[var(--accent)]">
          &#8377;{Math.floor(amount)}
        </span>{" "}
        to charity.
      </p>
    </div>
  );
}
