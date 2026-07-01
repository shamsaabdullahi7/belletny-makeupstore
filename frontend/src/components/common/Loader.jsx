const Loader = ({ label = "Loading" }) => (
  <div className="flex min-h-40 items-center justify-center">
    <div className="flex items-center gap-3 text-sm uppercase tracking-[0.22em] text-ink/60">
      <span className="h-3 w-3 animate-ping rounded-full bg-rose" />
      {label}
    </div>
  </div>
);

export default Loader;
