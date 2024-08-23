import React, { useState } from 'react';
import { MdModeEditOutline, MdDeleteForever } from "react-icons/md";
import AdminEditProduct from './AdminEditProduct';
import displayINRCurrency from '../helpers/displayCurrency';
import SummaryApi from '../common';

const AdminProductCard = ({ data, fetchdata }) => {
    const [editProduct, setEditProduct] = useState(false);
    const handleDelete = async () => {
      // Confirm delete action
      const confirmDelete = window.confirm("Are you sure you want to delete this product?");
      if (!confirmDelete) return;
  
      try {
          const response = await fetch(`${SummaryApi.deleteProduct.url}/${data._id}`, {
              method: 'DELETE',
              headers: {
                  'Content-Type': 'application/json',
                  // No 'Authorization' header
              },
          });
  
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
  
          const result = await response.json();
          if (result.success) {
              fetchdata(); // Refresh the product list
          } else {
              console.error("Error deleting product:", result.message);
          }
      } catch (error) {
          console.error("Error deleting product:", error.message);
      }
  };
  
    return (
        <div className='bg-white p-4 rounded shadow-lg'>
            <div className='w-40'>
                <div className='w-32 h-32 flex justify-center items-center'>
                    <img src={data?.productImage[0]} alt={data.productName} className='mx-auto object-fill h-full' />
                </div>
                <h1 className='text-ellipsis line-clamp-2'>{data.productName}</h1>
                <div>
                    <p className='font-semibold'>
                        {displayINRCurrency(data.sellingPrice)}
                    </p>
                    <div className='flex justify-between mt-2'>
                        <div className='w-fit p-2 bg-green-100 hover:bg-green-600 rounded-full hover:text-white cursor-pointer' onClick={() => setEditProduct(true)}>
                            <MdModeEditOutline />
                        </div>
                        <div className='w-fit p-2 bg-red-100 hover:bg-red-600 rounded-full hover:text-white cursor-pointer' onClick={handleDelete}>
                            <MdDeleteForever />
                        </div>
                    </div>
                </div>
            </div>

            {editProduct && (
                <AdminEditProduct productData={data} onClose={() => setEditProduct(false)} fetchdata={fetchdata} />
            )}
        </div>
    );
};

export default AdminProductCard;
