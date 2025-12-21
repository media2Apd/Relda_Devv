import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SummaryApi from '../common';

const UserProfile = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state?.user?.user);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    address: {
      country: '',
      street: '',
      city: '',
      state: '',
      postalCode: ''
    }
  });

  const [addresses, setAddresses] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    _id: "",  // Added _id to handle editing
    country: "",
    state: "",
    city: "",
    pinCode: "",
    street: "",
    default: false,
  });


  // Fetch all addresses on component mount
  const fetchAddresses = async () => {
    try {
      const response = await fetch(SummaryApi.getAddressList.url, {
        method: SummaryApi.getAddressList.method,
        credentials: "include",
      });
      const data = await response.json();

      if (Array.isArray(data)) {
        setAddresses(data);
        // Automatically set the default address in the profile
        const defaultAddress = data.find((addr) => addr.default);
        if (defaultAddress) {
          setFormData((prev) => ({
            ...prev,
            address: {
              country: defaultAddress.country,
              street: defaultAddress.street,
              city: defaultAddress.city,
              state: defaultAddress.state,
              postalCode: defaultAddress.pinCode,
            },
          }));
        }
      } else {
        console.error("Expected an array of addresses but got:", data);
        setAddresses([]);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle form submission to add or update address
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form fields
    if (
      !form.country ||
      !form.city ||
      !form.state ||
      !form.pinCode ||
      !form.street
    ) {
      alert("Please fill out all required fields.");
      return;
    }

    const method = form._id ? "PUT" : "POST"; // Use PUT if updating, POST if adding
    const url = form._id
      ? `${SummaryApi.updateAddress.url}/${form._id}`
      : SummaryApi.addAddress.url;

    try {
      const response = await fetch(url, {
        method: method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        await fetchAddresses();
        resetForm();
        setShowModal(false);
      } else {
        throw new Error("Failed to save address.");
      }
    } catch (error) {
      console.error("Error saving address:", error);
    }
  };


  // Delete an address
  const deleteAddress = async (id) => {
    try {
      const response = await fetch(`${SummaryApi.deleteAddress.url}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete address");
      }

      setAddresses((prevAddresses) =>
        prevAddresses.filter((address) => address._id !== id)
      );
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };
  // Edit an address
  const editAddress = (address) => {
    setForm(address);
    setShowModal(true);
  };

  // Set an address as default
  const setDefaultAddress = async (id) => {
    try {
      const response = await fetch(`${SummaryApi.setDefaultAddress.url}/${id}`, {
        method: "PUT",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to set default address");
      }

      const data = await response.json();
      if (data) {
        const updatedAddresses = addresses.map((address) =>
          address._id === id
            ? { ...address, default: true }
            : { ...address, default: false }
        );
        setAddresses(updatedAddresses);

        // Update the default address in the profile
        const newDefaultAddress = updatedAddresses.find((addr) => addr.default);
        if (newDefaultAddress) {
          setFormData((prevData) => ({
            ...prevData,
            address: {
              country: newDefaultAddress.country,
              street: newDefaultAddress.street,
              city: newDefaultAddress.city,
              state: newDefaultAddress.state,
              postalCode: newDefaultAddress.pinCode,
            },
          }));
        }
      }
    } catch (error) {
      console.error("Error setting default address:", error);
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    setForm({
      _id: "",
      country: "",
      state: "",
      city: "",
      pinCode: "",
      street: "",
      default: false,
    });
  };

  const handleAddressClick = () => {
    setShowModal(true);
  }

  // Update formData whenever the user object changes
  useEffect(() => {
    const fetchUserData = async () => {
      const token = getCookie('token'); // Assuming you have this function to get the token
      try {
        const response = await fetch(SummaryApi.viewuser.url(user._id), {
          method: SummaryApi.viewuser.method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const result = await response.json();
        if (result.success) {
          setFormData({
            name: result.data.name,
            email: result.data.email,
            mobile: result.data.mobile,
            address: {
              country: result.data.address?.country || '',
              street: result.data.address?.street || '',
              city: result.data.address?.city || '',
              state: result.data.address?.state || '',
              postalCode: result.data.address?.postalCode || ''
            }
          });
        } else {
          console.error(result.message);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.includes('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prevData => ({
        ...prevData,
        address: {
          ...prevData.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  const handleSave = async () => {
    try {
      const token = getCookie('token');

      const response = await fetch(SummaryApi.UserUpdate.url(user._id), {
        method: SummaryApi.UserUpdate.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const result = await response.json();

      if (result.success) {
        dispatch({ type: 'UPDATE_USER', payload: result.data }); // Update Redux store with the new user data
        // alert('Profile updated successfully!'); // Optional: Inform the user of success
      } else {
        console.error('Error updating user:', result.message);
        alert('Failed to update profile: ' + result.message); // Optional: Inform the user of failure
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while updating the profile. Please try again.'); // Optional: Inform the user of an error
    } finally {
      setIsModalOpen(false); // Close the modal
    }
  };



  return (
    <div className='container mx-auto mt-6 text-lg bg-white shadow-lg rounded-lg p-4'>
      <h1 className='text-center font-bold text-2xl mb-4'>Hello! {user?.name}</h1>
      <hr className='mb-8' />
      <div className='flex flex-col md:flex-row items-center'>
        <div className='w-36 h-36 mb-4 md:mb-0'>
          <img
            src="https://img.freepik.com/free-vector/user-blue-gradient_78370-4692.jpg?w=826&t=st=1726488367~exp=1726488967~hmac=0547e371925e75bb868b4940ce869045ce2d7325d64231ca0b6159be68fde55f"
            alt="user"
            className='w-36 h-36 mb-4 md:mb-0 animate-shake'
          />
        </div>

        <style>{`
          @keyframes shake {
            0%, 100% {
              transform: translateY(0);
            }
            25% {
              transform: translateY(-5px);
            }
            75% {
              transform: translateY(5px);
            }
          }

          .animate-shake {
            animation: shake 2s ease-in-out infinite;
          }
        `}</style>

        <div className='ml-0 md:ml-8'>
          <h2 className='mb-2'><span className='font-bold'>Name: </span>{formData?.name}</h2>
          <h2 className='mb-2'><span className='font-bold'>Email: </span>{formData?.email}</h2>
          <h2 className='mb-2'><span className='font-bold'>Mobile: </span>{formData?.mobile || 'N/A'}</h2>
          <h2 className='mb-2'><span className='font-bold'>Address: </span>{" "}
            {formData?.address.country
              ? `${formData.address.street}, ${formData.address.city}, ${formData.address.state}, ${formData.address.postalCode}, ${formData.address.country}`
              : 'N/A'}
          </h2>
        </div>
      </div>

      {/* Edit Profile Button */}
      <div className='flex justify-center mt-4'>
        <button
          className='bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700'
          onClick={() => setIsModalOpen(true)}
        >
          Edit Profile
        </button>
      </div>

      <div className="bg-gray-100 p-6 mt-6">
        <h2 className="text-2xl font-bold mb-6">Your Addresses</h2>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {/* Add Address Card */}
          <div
            className="border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer p-6 bg-white hover:bg-gray-50 transition"
            onClick={handleAddressClick}
          >
            <span className="text-gray-500 text-lg">+ Add Address</span>
          </div>

          {/* Existing Address Cards */}
          {Array.isArray(addresses) && addresses.length > 0 ? (
            addresses.map((address) => (
              <div key={address._id} className="border rounded-lg p-4 bg-white shadow-sm relative">
                {address?.default && (
                  <span className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                    Default
                  </span>
                )}
                <p className="text-gray-700 pt-3">{address?.street}</p>
                <p className="text-gray-700">
                  {address?.city}, {address?.state} - {address?.pinCode}
                </p>
                <div className="flex space-x-4 mt-4">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => editAddress(address)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => deleteAddress(address?._id)}
                  >
                    Remove
                  </button>
                  {!address?.default && (
                    <button
                      className="text-green-600 hover:underline"
                      onClick={() => setDefaultAddress(address?._id)}
                    >
                      Set as Default
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>No addresses found.</p>
          )}
        </div>

        {/* Add/Edit Address Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg overflow-auto max-h-full">
              <h3 className="text-xl font-bold mb-4">
                {form?._id ? "Edit Address" : "Add New Address"}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4">
                  {/* Flat, House no., Building, Company, Apartment */}
                  <input
                    type="text"
                    name="street"
                    placeholder="Flat, House no., Building, Company, Apartment"
                    className="border p-2 rounded"
                    value={form.addressLine1}
                    onChange={handleChange}
                    required
                  />

                  {/* Pin Code */}
                  <input
                    type="text"
                    name="pinCode"
                    placeholder="Pin Code"
                    className="border p-2 rounded"
                    value={form.pinCode}
                    onChange={handleChange}
                    required
                  />
                  {/* Town/City */}
                  <input
                    type="text"
                    name="city"
                    placeholder="Town/City"
                    className="border p-2 rounded"
                    value={form.city}
                    onChange={handleChange}
                    required
                  />
                  {/* State */}
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    className="border p-2 rounded"
                    value={form.state}
                    onChange={handleChange}
                    required
                  />
                  {/* Country/Region */}
                  <input
                    type="text"
                    name="country"
                    placeholder="Country/Region"
                    className="border p-2 rounded"
                    value={form.country}
                    onChange={handleChange}
                    required
                  />
                  {/* Make Default Checkbox */}
                  <label className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      name="default"
                      className="mr-2"
                      checked={form.default}
                      onChange={handleChange}
                    />
                    Make this my default address
                  </label>
                </div>
                {/* Modal Actions */}
                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="text-gray-600 hover:underline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className='fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center'>
          <div className='bg-white p-6 rounded-lg w-full max-w-2xl mx-4 max-h-screen overflow-y-auto'>
            <h2 className='text-xl font-bold mb-4'>Edit Profile</h2>

            {/* Form Inputs */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
              <div>
                <label className='block mb-2'>Name</label>
                <input
                  type='text'
                  name='name'
                  placeholder='Enter your name'
                  value={formData.name}
                  onChange={handleInputChange}
                  className='w-full p-2 border border-gray-300 rounded-lg'
                />
              </div>
              <div>
                <label className='block mb-2'>Email</label>
                <input
                  type='email'
                  name='email'
                  placeholder='Enter your email'
                  value={formData.email}
                  onChange={handleInputChange}
                  className='w-full p-2 border border-gray-300 rounded-lg'
                  disabled
                />
              </div>
            </div>

            {/* Mobile */}
            <div className='mb-4'>
              <label className='block mb-2'>Mobile</label>
              <input
                type='tel'
                name='mobile'
                placeholder='Enter your mobile'
                value={formData.mobile}
                onChange={handleInputChange}
                className='w-full p-2 border border-gray-300 rounded-lg'
              />
            </div>

            {/* Address Inputs */}
            {/* <h2 className='font-bold text-lg mb-2'>Address:</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
              <div>
                <label className='block mb-2'>Country</label>
                <input
                  type='text'
                  name='address.country'
                  placeholder='Enter your country'
                  value={formData.address.country}
                  onChange={handleInputChange}
                  className='w-full p-2 border border-gray-300 rounded-lg'
                />
              </div>
              <div>
                <label className='block mb-2'>Street</label>
                <input
                  type='text'
                  name='address.street'
                  placeholder='Enter your street'
                  value={formData.address.street}
                  onChange={handleInputChange}
                  className='w-full p-2 border border-gray-300 rounded-lg'
                />
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
              <div>
                <label className='block mb-2'>City</label>
                <input
                  type='text'
                  name='address.city'
                  placeholder='Enter your city'
                  value={formData.address.city}
                  onChange={handleInputChange}
                  className='w-full p-2 border border-gray-300 rounded-lg'
                />
              </div>
              <div>
                <label className='block mb-2'>State</label>
                <input
                  type='text'
                  name='address.state'
                  placeholder='Enter your state'
                  value={formData.address.state}
                  onChange={handleInputChange}
                  className='w-full p-2 border border-gray-300 rounded-lg'
                />
              </div>
            </div>

            <div className='mb-4'>
              <label className='block mb-2'>Postal Code</label>
              <input
                type='text'
                name='address.postalCode'
                placeholder='Enter your postal code'
                value={formData.address.postalCode}
                onChange={handleInputChange}
                className='w-full p-2 border border-gray-300 rounded-lg'
              />
            </div> */}

            <div className='flex justify-end'>
              <button
                className='bg-gray-300 py-2 px-4 rounded-lg mr-2'
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className='bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700'
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default UserProfile;