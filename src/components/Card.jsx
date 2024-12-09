// components/Card.jsx
const Card = ({ title, description, actionLabel, onAction }) => {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-700">{title}</h3>
        <p className="text-gray-500 mt-2">{description}</p>
        {onAction && (
          <button
            onClick={onAction}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            {actionLabel}
          </button>
        )}
      </div>
    );
  };
  
  export default Card;
  