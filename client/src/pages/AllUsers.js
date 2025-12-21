import React, { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import moment from 'moment';
import { MdModeEdit } from "react-icons/md";
import ChangeUserRole from '../components/ChangeUserRole';
import * as XLSX from 'xlsx';

// import jsPDF from 'jspdf';
import 'jspdf-autotable';

const AllUsers = () => {
    const [allUser, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openUpdateRole, setOpenUpdateRole] = useState(false);
    const [updateUserDetails, setUpdateUserDetails] = useState({
        email: "",
        name: "",
        role: "",
        _id: ""
    });
    const [filters, setFilters] = useState({
        fromDate: "",
        toDate: "",
        month: "",
        year: ""
    });
    const [isFocused, setIsFocused] = useState({
        fromDate: false,
        toDate: false
    });

    const location = useLocation();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // Fetch user data based on filters
    const fetchAllUsers = useCallback(async () => {
        try {
            setLoading(true);
            let url = SummaryApi.allUser.url;
            const queryString = new URLSearchParams(filters).toString();
            if (queryString) { // Apply filters only if any filter is specified
                url += `?${queryString}`;
            }
            const fetchData = await fetch(url, {
                method: SummaryApi.allUser.method,
                credentials: 'include'
            });

            const dataResponse = await fetchData.json();

            if (dataResponse.success) {
                setAllUsers(dataResponse.data);
            } else if (dataResponse.error) {
                toast.error(dataResponse.message);
            }
        } catch (error) {
            toast.error('Failed to fetch users. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [filters]);
    
    // Whenever filters change, fetch data
    useEffect(() => {
        fetchAllUsers();
    }, [fetchAllUsers]);

    // Sync filters from URL params
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const fromDate = searchParams.get('fromDate') || "";
        const toDate = searchParams.get('toDate') || fromDate; // Default toDate to fromDate if not provided
        setFilters({
            fromDate,
            toDate,
            month: searchParams.get('month') || "",
            year: searchParams.get('year') || ""
        });
    }, [location.search]);

    

    const handleExportExcel = () => {
        const filteredUsers = allUser.map(({ password, ...user }) => user);
        const ws = XLSX.utils.json_to_sheet(filteredUsers);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Users');
        XLSX.writeFile(wb, 'user.xlsx');
    };

    // const handleExportPDF = () => {
    //     const doc = new jsPDF();
    //     const tableColumn = ["Name", "Email", "Role", "Date"];
    //     const tableRows = allUser.map(el => [
    //         el?.name || "",
    //         el?.email || "",
    //         el?.role || "",
    //         moment(el?.createdAt).format('LL') || "",
    //     ]);
    //     doc.autoTable({
    //         head: [tableColumn],
    //         body: tableRows,
    //         startY: 20,
    //         styles: { fontSize: 10, overflow: 'linebreak' },
    //     });
    //     doc.text("User Details", 14, 15);
    //     doc.save("user_details.pdf");
    // };

    // const months = Array.from({ length: 12 }, (v, i) => ({
    //     value: i + 1,
    //     label: moment().month(i).format('MMMM')
    // }));

    // const years = Array.from({ length: 21 }, (v, i) => ({
    //     value: new Date().getFullYear() - i,
    //     label: new Date().getFullYear() - i
    // }));

    return (
        <div className='mx-auto pb-8 p-1 md:p-4 text-gray-800'>
            <div className='bg-white py-2 px-6 shadow-md flex justify-between items-center rounded-lg'>
        <h2 className='font-bold text-xl text-gray-800'>All Users</h2>
        <button className='border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all py-2 px-4 rounded-full' onClick={handleExportExcel}>Export to Excel</button>
      </div>
            
            <div className="flex gap-4 flex-wrap mb-6 items-center mt-4 p-4">
                <input
                    type={isFocused.fromDate ? "date" : "text"}
                    name="fromDate"
                    value={filters.fromDate}
                    onChange={handleInputChange}
                    className="border p-2 rounded-md md:mr-2 border-gray-300 w-full md:w-auto"
                    placeholder={isFocused.fromDate ? "" : "From Date*"}
                    onFocus={() => setIsFocused({ ...isFocused, fromDate: true })}
                    onBlur={() => setIsFocused({ ...isFocused, fromDate: false })}
                />
                <input
                    type={isFocused.toDate ? "date" : "text"}
                    name="toDate"
                    value={filters.toDate || filters.fromDate}
                    onChange={handleInputChange}
                    className="border p-2 rounded-md md:mr-2 border-gray-300 w-full md:w-auto"
                    placeholder={isFocused.toDate ? "" : "To Date*"}
                    onFocus={() => setIsFocused({ ...isFocused, toDate: true })}
                    onBlur={() => setIsFocused({ ...isFocused, toDate: false })}
                />
                {/* <div>
                    <label>Month:</label>
                    <select name="month" value={filters.month} onChange={handleInputChange} className="border p-2 rounded-md md:mr-2">
                        <option value="">Select Month</option>
                        {months.map(month => (
                            <option key={month.value} value={month.value}>{month.label}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Year:</label>
                    <select name="year" value={filters.year} onChange={handleInputChange} className="border p-2 rounded-md md:mr-2">
                        <option value="">Select Year</option>
                        {years.map(year => (
                            <option key={year.value} value={year.value}>{year.label}</option>
                        ))}
                    </select>
                </div> */}
            </div>
            
            
            {loading ? (
                <p className="text-center">Loading...</p>
            ) : (
                <div className='overflow-x-auto rounded-lg shadow-lg'>
                    <table className='w-full userTable bg-white' aria-label='User Table'>
                    <thead>
                        <tr className='bg-red-600 text-white'>
                            <th className="border border-gray-300 px-4 py-2">S.No</th>
                            <th className="border border-gray-300 px-4 py-2">Name</th>
                            <th className="border border-gray-300 px-4 py-2">Email</th>
                            <th className="border border-gray-300 px-4 py-2">Role</th>
                            <th className="border border-gray-300 px-4 py-2">Created Date</th>
                            <th className="border border-gray-300 px-4 py-2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allUser.map((el, index) => (
                            <tr key={el._id} className="hover:bg-gray-100">
                                <td className="border border-gray-300 px-4 py-2 text-center">{index + 1}</td>
                                <td className="border border-gray-300 px-4 py-2">{el?.name}</td>
                                <td className="border border-gray-300 px-4 py-2">{el?.email}</td>
                                <td className="border border-gray-300 px-4 py-2">{el?.role}</td>
                                <td className="border border-gray-300 px-4 py-2">{moment(el?.createdAt).format('LL')}</td>
                                <td className="border border-gray-300 px-4 py-2 text-center">
                                    <button
                                        className="p-2 bg-green-100 rounded-full hover:bg-green-500 hover:text-white"
                                        onClick={() => {
                                            setUpdateUserDetails(el);
                                            setOpenUpdateRole(true);
                                        }}
                                    >
                                        <MdModeEdit />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
                
            )}

            {openUpdateRole && (
                <ChangeUserRole
                    onClose={() => setOpenUpdateRole(false)}
                    name={updateUserDetails.name}
                    email={updateUserDetails.email}
                    role={updateUserDetails.role}
                    userId={updateUserDetails._id}
                    callFunc={fetchAllUsers}
                />
            )}
        </div>
    );
};

export default AllUsers;