const OrderStatusTracker = ({ orderStatus, paymentStatus, handleStatusChange }) => {
  // Define the order statuses available
  const availableStatuses = ['Ordered', 'Packaged', 'Shipped', 'Delivered'];

  // Determine the index of the current status to calculate progress
  const currentStatusIndex = availableStatuses.indexOf(orderStatus);

  return (
    <div className="w-full mt-4">
      {/* Status Steps */}
      <div className="flex justify-between items-center relative">
        {availableStatuses.map((status, index) => (
          <div key={status} className="flex items-center justify-center relative">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
                ${index <= currentStatusIndex ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-300 text-gray-500'}
              transition-all`}>
              {index <= currentStatusIndex ? '●' : '○'}
            </div>
            <span className="text-xs mt-2 block">{status}</span>
          </div>
        ))}
      </div>

      {/* Green Progress Line */}
      <div className="w-full h-1 mt-4 bg-gray-200 rounded-full relative">
        <div
          className="h-full bg-green-500 rounded-full transition-all duration-500 ease-in-out"
          style={{
            width: `${(currentStatusIndex + 1) * (100 / availableStatuses.length)}%`,
          }}
        />
      </div>
    </div>
  );
};

export default OrderStatusTracker;
