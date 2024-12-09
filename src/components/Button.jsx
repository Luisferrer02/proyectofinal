// components/Button.jsx
const Button = ({ label, onClick, variant = "primary", disabled = false }) => {
    const baseStyle =
      "py-2 px-4 rounded focus:outline-none transition-all duration-200";
    const variants = {
      primary: "bg-blue-500 hover:bg-blue-600 text-white",
      secondary: "bg-gray-500 hover:bg-gray-600 text-white",
      danger: "bg-red-500 hover:bg-red-600 text-white",
    };
  
    return (
      <button
        className={`${baseStyle} ${variants[variant]} ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={onClick}
        disabled={disabled}
      >
        {label}
      </button>
    );
  };
  
  export default Button;
  