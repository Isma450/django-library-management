// src/components/ui/card.jsx
import PropTypes from "prop-types";
const Card = ({ className, ...props }) => {
  return (
    <div
      className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}
      {...props}
    />
  );
};

const CardHeader = ({ className, ...props }) => {
  return (
    <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props} />
  );
};

const CardContent = ({ className, ...props }) => {
  return <div className={`p-6 pt-0 ${className}`} {...props} />;
};

export { Card, CardHeader, CardContent };

Card.propTypes = {
  className: PropTypes.string,
};

CardHeader.propTypes = {
  className: PropTypes.string,
};

CardContent.propTypes = {
  className: PropTypes.string,
};
