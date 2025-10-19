import React from "react";
import { Grid3X3 } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No Games Found",
  description = "Try adjusting your search query or selecting a different category.",
  icon = <Grid3X3 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />,
}) => {
  return (
    <div className="text-center py-12">
      {icon}
      <h3 className="text-xl font-semibold text-muted-foreground mb-2">
        {title}
      </h3>
      <p className="text-muted-foreground">
        {description}
      </p>
    </div>
  );
};

export default EmptyState;