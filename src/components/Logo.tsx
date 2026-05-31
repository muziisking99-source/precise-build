type LogoProps = {
  height?: number;
  className?: string;
};

export function Logo({ height = 48, className }: LogoProps) {
  return (
    <img
      src="/brand/golden-fresh-logo.png"
      alt="Golden Fresh Biscuits"
      height={height}
      className={className}
      style={{ width: "auto", height }}
    />
  );
}
