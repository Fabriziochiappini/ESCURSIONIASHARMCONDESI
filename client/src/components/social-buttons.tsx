import { Facebook, Instagram } from "lucide-react";

interface SocialButtonsProps {
  variant?: "default" | "large" | "compact";
  layout?: "horizontal" | "vertical";
  showLabels?: boolean;
}

export function SocialButtons({ 
  variant = "default", 
  layout = "horizontal",
  showLabels = false 
}: SocialButtonsProps) {
  const facebookUrl = "https://www.facebook.com/siviaggiacondesi/";
  const instagramUrl = "https://www.instagram.com/siviaggiacondesi/";

  const sizeClasses = {
    default: "w-10 h-10",
    large: "w-12 h-12",
    compact: "w-8 h-8"
  };

  const iconSizeClasses = {
    default: "h-5 w-5",
    large: "h-6 w-6",
    compact: "h-4 w-4"
  };

  const containerClasses = layout === "horizontal" 
    ? "flex items-center gap-3" 
    : "flex flex-col items-center gap-3";

  return (
    <div className={containerClasses}>
      {/* Facebook */}
      <a
        href={facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${sizeClasses[variant]} rounded-full bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 group`}
        data-testid="button-facebook"
        aria-label="Facebook"
      >
        <Facebook className={`${iconSizeClasses[variant]} group-hover:scale-110 transition-transform`} />
      </a>

      {/* Instagram */}
      <a
        href={instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${sizeClasses[variant]} rounded-full bg-gradient-to-br from-pink-600 via-purple-600 to-orange-500 hover:from-pink-700 hover:via-purple-700 hover:to-orange-600 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 group`}
        data-testid="button-instagram"
        aria-label="Instagram"
      >
        <Instagram className={`${iconSizeClasses[variant]} group-hover:scale-110 transition-transform`} />
      </a>

      {showLabels && (
        <div className={layout === "horizontal" ? "flex gap-3" : "flex flex-col gap-1 text-center"}>
          <span className="text-xs text-gray-600">Seguici</span>
        </div>
      )}
    </div>
  );
}
