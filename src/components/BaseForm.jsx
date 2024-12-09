"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";

const BaseForm = ({ initialValues, validationSchema, fields, onSubmit }) => {
  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {({ isSubmitting }) => (
        <Form className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
          {fields.map(({ name, type, placeholder, label }) => (
            <div key={name} className="mb-4">
              <label htmlFor={name} className="block text-gray-700 font-medium mb-2">
                {label}
              </label>
              <Field
                id={name}
                name={name}
                type={type}
                placeholder={placeholder}
                className="w-full border border-gray-300 rounded-lg p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage name={name} component="div" className="text-red-500 text-sm mt-1" />
            </div>
          ))}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition duration-200"
          >
            {isSubmitting ? "Enviando..." : "Enviar"}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default BaseForm;
