import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useTheme } from "@/contexts/ThemeContext";

const ParticlesBackground = () => {
  const [init, setInit] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  if (!init) return null;

  return (
    <Particles
      id="tsparticles"
      className="fixed inset-0 z-0 pointer-events-none"
      options={{
        background: {
          color: {
            value: "transparent",
          },
        },
        fpsLimit: 120,
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "grab", // This creates a "web" of particles that follow the mouse
            },
            onClick: {
              enable: true,
              mode: "push",
            },
            resize: {
              enable: true,
            },
          },
          modes: {
            grab: {
              distance: 250,
              links: {
                opacity: 0.8,
                color: theme === 'dark' ? '#22d3ee' : '#0ea5e9',
              },
            },
            push: {
              quantity: 4,
            },
          },
        },
        particles: {
          color: {
            value: theme === "dark" ? ["#22d3ee", "#a855f7", "#ec4899"] : ["#0ea5e9", "#8b5cf6", "#d946ef"],
          },
          links: {
            color: theme === "dark" ? "#22d3ee" : "#0ea5e9",
            distance: 150,
            enable: true,
            opacity: theme === "dark" ? 0.3 : 0.5, // Higher link opacity for light theme
            width: 1,
          },
          move: {
            direction: "none",
            enable: true,
            outModes: {
              default: "bounce",
            },
            random: false,
            speed: 1,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: window.innerWidth < 768 ? 40 : 120, // Significantly reduced for mobile
          },
          opacity: {
            value: theme === "dark" ? 0.5 : 0.8, // Much higher for light theme
          },
          shape: {
            type: "circle",
          },
          size: {
            value: { min: 1, max: 3 },
          },
        },
        responsive: [
          {
            maxWidth: 768,
            options: {
              interactivity: {
                events: {
                  onHover: {
                    enable: false, // Disable hover interaction on mobile
                  },
                },
              },
            },
          },
        ],
        detectRetina: true,
      }}
    />
  );
};

export default ParticlesBackground;
