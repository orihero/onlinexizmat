export default function DealsTable() {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Deals Details</h3>
        <button className="text-sm text-gray-500">View All</button>
      </div>
      <table className="min-w-full">
        <thead>
          <tr className="text-left text-sm text-gray-500">
            <th className="pb-4">Product Name</th>
            <th className="pb-4">Location</th>
            <th className="pb-4">Date - Time</th>
            <th className="pb-4">Price</th>
            <th className="pb-4">Status</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          <tr>
            <td className="py-3">Apple Watch</td>
            <td className="py-3">9508 Haryland Landing</td>
            <td className="py-3">12.08.2019, 12:53 PM</td>
            <td className="py-3">$534,245</td>
            <td className="py-3">
              <span className="px-3 py-1 text-emerald-700 bg-emerald-100 rounded-full text-xs">
                Delivered
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}