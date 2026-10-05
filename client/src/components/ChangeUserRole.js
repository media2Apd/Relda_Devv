import React, { useState } from 'react'
import ROLE from '../common/role'
import { IoMdClose } from "react-icons/io";
import SummaryApi from '../common';
import { toast } from 'react-toastify';

const ChangeUserRole = ({
    name,
    email,
    role,
    zohoLocationId = "",
    zohoLocationName = "",
    userId,
    onClose,
    callFunc,
}) => {
    const [userRole, setUserRole] = useState(role);
    const [locationId, setLocationId] = useState(zohoLocationId);
    const [locationName, setLocationName] = useState(zohoLocationName);

    // 🏢 Zoho Showrooms List
    const showrooms = [
        { name: "RELDA Brandshop - 1", id: "3477920000000196001" },
        { name: "Head Office", id: "3477920000000032220" },
        { name: "Vadaperubakkam", id: "" },
    ];

    const handleSelectShowroom = (e) => {
        const selected = showrooms.find(s => s.name === e.target.value);
        if (selected) {
            setLocationName(selected.name);
            setLocationId(selected.id);
        } else {
            setLocationName(e.target.value);
            setLocationId("");
        }
    };

    const handleOnChangeSelect = (e) => {
        setUserRole(e.target.value);
        console.log(e.target.value);
    };

    const updateUserRole = async () => {
        // Validation: MANAGESALES role-ku location ID thevai
        if (userRole === "MANAGESALES" && !locationId) {
            toast.error("Please select or enter a Location ID for Sales Staff");
            return;
        }

        const fetchResponse = await fetch(SummaryApi.updateUser.url, {
            method: SummaryApi.updateUser.method,
            credentials: 'include',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                userId: userId,
                role: userRole,
                // 👉 MANAGESALES-ku mattum location pogum, mathavangaluku null aagum
                zohoLocationId: userRole === "MANAGESALES" ? locationId : null,
                zohoLocationName: userRole === "MANAGESALES" ? locationName : null
            })
        });

        const responseData = await fetchResponse.json();

        if (responseData.success) {
            toast.success(responseData.message);
            onClose();
            callFunc();
        } else {
            toast.error(responseData.message || "Failed to update");
        }

        console.log("role updated", responseData);
    };

    return (
        <div className='fixed top-0 bottom-0 left-0 right-0 w-full h-full z-10 flex justify-between items-center bg-slate-200 bg-opacity-50'>
            <div className='mx-auto bg-white shadow-md p-4 w-full max-w-sm rounded'>

                <button className='block ml-auto text-xl' onClick={onClose}>
                    <IoMdClose />
                </button>

                <h1 className='pb-4 text-lg font-medium'>Change User Role</h1>

                <p className='text-sm mb-1'><span className='font-medium'>Name :</span> {name}</p>   
                <p className='text-sm mb-2'><span className='font-medium'>Email :</span> {email}</p> 

                <div className='flex items-center justify-between my-4'>
                    <p className='text-sm font-medium'>Role :</p>  
                    <select className='border px-4 py-1 rounded bg-white outline-none' value={userRole} onChange={handleOnChangeSelect}>
                        {
                            Object.values(ROLE).map(el => {
                                return (
                                    <option value={el} key={el}>{el}</option>
                                );
                            })
                        }
                    </select>
                </div>

                {/* 🔥 SHOW ONLY FOR MANAGESALES ROLE */}
                {userRole === "MANAGESALES" && (
                    <div className='my-4 p-3 bg-amber-50 border border-amber-200 rounded space-y-2'>
                        <p className='text-xs font-bold text-amber-900 uppercase'>
                            🏬 Showroom / Location Setup
                        </p>

                        {/* Showroom Select */}
                        <div>
                            <label className='text-xs text-gray-600 block mb-0.5'>Select Showroom:</label>
                            <select 
                                className='border p-1 w-full text-xs rounded bg-white outline-none'
                                value={locationName}
                                onChange={handleSelectShowroom}
                            >
                                <option value="">-- Select Showroom --</option>
                                {showrooms.map(s => (
                                    <option key={s.name} value={s.name}>{s.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Location Name */}
                        <div>
                            <label className='text-xs text-gray-600 block mb-0.5'>Location Name:</label>
                            <input 
                                type='text'
                                placeholder='e.g. RELDA Brandshop - 1'
                                value={locationName}
                                onChange={(e) => setLocationName(e.target.value)}
                                className='border p-1 w-full text-xs rounded outline-none'
                            />
                        </div>

                        {/* Location ID */}
                        <div>
                            <label className='text-xs text-gray-600 block mb-0.5'>
                                Zoho Location ID <span className='text-red-500'>*</span>:
                            </label>
                            <input 
                                type='text'
                                placeholder='e.g. 3477920000000196001'
                                value={locationId}
                                onChange={(e) => setLocationId(e.target.value)}
                                className='border p-1 w-full text-xs rounded font-mono outline-none'
                                required
                            />
                        </div>
                    </div>
                )}

                <button 
                    className='w-fit mx-auto block py-1.5 px-4 rounded-full bg-red-600 text-white hover:bg-red-700 transition-all font-medium text-sm mt-4' 
                    onClick={updateUserRole}
                >
                    Change Role
                </button>
            </div>
        </div>
    );
};

export default ChangeUserRole;