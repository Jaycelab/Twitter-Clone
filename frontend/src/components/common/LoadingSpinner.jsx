//setting default size to medium if not provided
//if size is provided adjust span size to the size provided
const LoadingSpinner = ({ size = "md" }) => {
  const sizeClass = `loading-${size}`;

  return <span className={`loading loading-spinner ${sizeClass}`} />;
};
export default LoadingSpinner;
