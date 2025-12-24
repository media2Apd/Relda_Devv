import React, { useState } from 'react';
import { MdModeEditOutline, MdDelete } from 'react-icons/md';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import UploadCoupon from './UploadCoupon';

const AdminCouponCard = ({ data, fetchData }) => {
  const [editOpen, setEditOpen] = useState(false);

  console.log(data);
  

  const handleDelete = async () => {
    const response = await fetch(`${SummaryApi.deleteCoupon.url}/${data._id}`, {
      method: SummaryApi.deleteCoupon.method,
    });
    const resData = await response.json();
    if (resData.success) {
      toast.success(resData.message);
      fetchData();
    }
  };

  const handleToggleStatus = async () => {
    const response = await fetch(`${SummaryApi.toggleCoupon.url}/${data._id}`, {
      method: SummaryApi.toggleCoupon.method,
    });
    const resData = await response.json();
    if (resData.success) {
      toast.success(resData.message);
      fetchData();
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-gray-800">{data.code}</h2>
          <p className="text-sm text-gray-500">{data.discountType === 'percentage' ? `${data.discountValue}% OFF` : `₹${data.discountValue} FLAT OFF`}</p>
        </div>
        <div className={`px-2 py-1 rounded text-xs ${data.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
          {data.isActive ? 'Active' : 'Inactive'}
        </div>
      </div>

      <div className="mt-4 text-sm space-y-1">
        <p><b>Min Order:</b> ₹{data.minOrderAmount}</p>
        {data.expiryDate && <p><b>Expires:</b> {new Date(data.expiryDate).toLocaleDateString()}</p>}
        <p><b>Used:</b> {data.usedCount} / {data.usageLimit || '∞'}</p>
      </div>

      <div className="flex justify-end gap-3 mt-4 border-t pt-3">
        <button onClick={handleToggleStatus} className="text-xs text-blue-600 underline">
          {data.isActive ? "Disable" : "Enable"}
        </button>
        <button onClick={() => setEditOpen(true)} className="p-2 bg-green-100 hover:bg-green-600 rounded-full hover:text-white transition-all">
          <MdModeEditOutline />
        </button>
        <button onClick={handleDelete} className="p-2 bg-red-100 hover:bg-red-600 rounded-full hover:text-white transition-all">
          <MdDelete />
        </button>
      </div>

      {editOpen && (
        <UploadCoupon 
            onClose={() => setEditOpen(false)} 
            fetchData={fetchData} 
            editData={data} 
        />
      )}
    </div>
  );
};

export default AdminCouponCard;