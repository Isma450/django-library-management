// src/components/ui/aurora-background.jsx
import { cn } from "../lib/utils";
import PropTypes from "prop-types";

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
}) => {
  return (
    <main>
      <div
        className={cn(
          "relative flex flex-col h-[100vh] items-center justify-center bg-zinc-50 dark:bg-zinc-900 text-slate-950 transition-bg",
          className
        )}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div
            className={cn(
              `
            [--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)]
            [--dark-gradient:repeating-linear-gradient(100deg,var(--black)_0%,var(--black)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--black)_16%)]
            [--aurora:repeating-linear-gradient(100deg,var(--primary-500)_10%,var(--primary-300)_15%,var(--primary-300)_20%,var(--primary-200)_25%,var(--primary-400)_30%)]
            [background-image:var(--white-gradient),var(--aurora)]
            dark:[background-image:var(--dark-gradient),var(--aurora)]
            [background-size:300%,_200%]
            [background-position:50%_50%,50%_50%]
            filter blur-[10px] invert dark:invert-0
            after:content-[""] after:absolute after:inset-0 after:[background-image:var(--white-gradient),var(--aurora)] 
            after:dark:[background-image:var(--dark-gradient),var(--aurora)]
            after:[background-size:200%,_100%] 
            after:animate-aurora after:[background-attachment:fixed] after:mix-blend-difference
            pointer-events-none absolute -inset-[10px] opacity-50 will-change-transform
          `,
              showRadialGradient &&
                `[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,var(--transparent)_70%)]`
            )}
          />
        </div>
        {children}
      </div>
    </main>
  );
};

AuroraBackground.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  showRadialGradient: PropTypes.bool,
};

AuroraBackground.defaultProps = {
  className: "",
  showRadialGradient: true,
};