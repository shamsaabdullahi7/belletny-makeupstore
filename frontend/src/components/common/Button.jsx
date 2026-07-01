const variants = {
  primary: "bg-rose text-cream hover:bg-ink",
  secondary: "border border-ink/20 bg-transparent text-ink hover:border-rose hover:bg-rose hover:text-cream",
  rose: "bg-rose text-cream hover:bg-ink",
  ghost: "bg-transparent text-ink hover:bg-ink/5",
};

const Button = ({
  children,
  className = "",
  variant = "primary",
  type = "button",
  ...props
}) => {
  return (
    <button
      type={type}
      className={`inline-flex min-h-11 items-center justify-center gap-2 px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] transition duration-300 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
