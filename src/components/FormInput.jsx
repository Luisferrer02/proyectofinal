// components/FormInput.jsx
const FormInput = ({ label, type = "text", value, onChange, placeholder, error }) => {
    return (
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">{label}</label>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
            error ? "border-red-500" : ""
          }`}
        />
        {error && <p className="text-red-500 text-xs italic mt-2">{error}</p>}
      </div>
    );
  };
  
  export default FormInput;
  