interface Product {
  id: number;
  name: string;
  sales: number;
  revenue: number;
  stock: number;
  status: string;
}

interface TopProductsTableProps {
  products: Product[];
}

export function TopProductsTable({ products }: TopProductsTableProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'in stock':
        return 'text-green-700 bg-green-50';
      case 'out of stock':
        return 'text-red-700 bg-red-50';
      case 'low stock':
        return 'text-yellow-700 bg-yellow-50';
      default:
        return 'text-gray-700 bg-gray-50';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-xs text-gray-500">
            <th className="text-left font-medium pb-4">Product</th>
            <th className="text-left font-medium pb-4">Sales</th>
            <th className="text-left font-medium pb-4">Revenue</th>
            <th className="text-left font-medium pb-4">Stock</th>
            <th className="text-left font-medium pb-4">Status</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {products.map((product) => (
            <tr key={product.id} className="border-t border-gray-100">
              <td className="py-4">{product.name}</td>
              <td className="py-4">{product.sales}</td>
              <td className="py-4">${product.revenue}</td>
              <td className="py-4">{product.stock}</td>
              <td className="py-4">
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(product.status)}`}>
                  {product.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}