const Table = ({ columns, data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse bg-white shadow-lg rounded-lg">
        <thead>
          <tr className="bg-gray-200 text-gray-700 text-sm font-semibold">
            {columns.map((col, index) => (
              <th
                key={index}
                className="border-b-2 border-gray-300 p-4 text-left"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="hover:bg-gray-100 transition duration-200"
            >
              {columns.map((col, colIndex) => (
                <td
                  key={colIndex}
                  className="border-b border-gray-200 p-4 text-sm text-gray-800"
                >
                  {/* Renderiza dinámicamente el contenido de la celda */}
                  {col.cell ? col.cell(row) : row[col.accessor] || "N/A"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
