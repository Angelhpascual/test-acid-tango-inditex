import { useProductStore } from "../store/productStore";

const Dashboard: React.FC = () => {
  const { products } = useProductStore();

  return (
    <div className="bg-purple-400 h-screen flex flex-col justify-center items-center p-6 pl-72">
      <h1 className="text-3xl font-bold text-indigo-500 mb-4">Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        {products.map((product) => (
          <div className="bg-white p-4 shadow-md rounded-md" key={product.id}>
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-32 object-contain rounded-md"
            />
            <h2 className="text-lg font-bold mt-2">{product.name}</h2>
            <p className="text-sm text-gray-600">{product.description}</p>
            <p className="text-md font-semibold text-indigo-600 mt-2">
              💰${product.price.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
