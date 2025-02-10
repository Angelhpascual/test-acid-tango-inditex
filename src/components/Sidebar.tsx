const Sidebar: React.FC = () => {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white p-4 shadow-lg">
      <h2 className="mb-2 p-2 bg-gray-800 rounded cursor-pointer hover:bg-gray-700">
        🛒 Add Product
      </h2>
      <ul>
        <li className="mb-2 p-2 bg-gray-800 rounded cursor-pointer hover:bg-gray-700">
          ➕ Add Row
        </li>
        <li className="mb-2 p-2 bg-gray-800 rounded cursor-pointer hover:bg-gray-700">
          ❌ Delete Row
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
