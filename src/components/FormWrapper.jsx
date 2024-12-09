"use client";

const FormWrapper = ({ title, children }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        {title && <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">{title}</h1>}
        {children}
      </div>
    </div>
  );
};

export default FormWrapper;
