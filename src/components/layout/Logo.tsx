const Logo = () => {
  return (
    <div className="flex items-center gap-2.5">
      <img
        src="/logo-transparent-dark.png"
        alt="sideout"
        className="h-8 w-auto object-contain"
      />

      <span className="text-[19px] font-medium tracking-[-0.02em] text-foreground">
        sideout
      </span>
    </div>
  );
};

export default Logo;