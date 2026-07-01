const Footer = () => (
  <footer className="border-t border-ink/10 bg-porcelain text-ink">
    <div className="page-shell grid gap-8 py-12 md:grid-cols-[1.5fr_1fr_1fr]">
      <div>
        <p className="font-display text-3xl">Belletny</p>
        <p className="mt-4 max-w-md text-sm leading-7 text-ink/65">
          Luxury complexion, lip, and eye essentials designed for polished everyday ritual.
        </p>
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-rose">Studio</p>
        <div className="mt-4 space-y-2 text-sm text-ink/65">
          <p>Makeup artistry</p>
          <p>Shade matching</p>
          <p>Private launches</p>
        </div>
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-rose">Support</p>
        <div className="mt-4 space-y-2 text-sm text-ink/65">
          <p>hello@belletny.com</p>
          <p>Shipping and returns</p>
          <p>Concierge care</p>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
