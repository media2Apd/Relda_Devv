import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import SummaryApi from '../common';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLayerGroup, faArrowDownWideShort, faCubes, faCalendarCheck, faHandshakeSimple, faSackXmark, faHeartCrack, faCubesStacked, faPeopleCarryBox, faDiagramSuccessor, faCommentDots, faUsers, faBan, faCartArrowDown, faClipboardCheck, faHourglassHalf, faUsersViewfinder, faArrowUpWideShort, faTruckFast, faBoxOpen } from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {
    const navigate = useNavigate(); // Initialize navigate
    const [category, setCategory] = useState("");
    const [dateRange, setDateRange] = useState({ start: "", end: "" });
    const [categories, setCategories] = useState([]);
    const [dashboardData, setDashboardData] = useState({
        visitors: 0,
        users: 0,
        orders: 0,
        totalProducts: 0,
        statuses: {},
    });

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
    };

    const displayINRCurrency = (num) => {
        const formatter = new Intl.NumberFormat('en-IN', {
            style: "currency",
            currency: 'INR',
            minimumFractionDigits: 0
        });

        return formatter.format(num);
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch(SummaryApi.getProductCategory.url);
            const data = await response.json();
            const filteredCategories = data.categories.filter(category => category.productCount > 0);
            if (data.success) {
                setCategories(filteredCategories);
            } else {
                console.error("Error fetching categories");
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Fetch data from the backend
    const fetchData = useCallback(async () => {
        let url = SummaryApi.getDashboard.url;
        if (dateRange || category) {
            url += `?startDate=${dateRange.start}&endDate=${dateRange.end || dateRange.start}&category=${category}`;
        }

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.success) {
                setDashboardData(data.data);
            } else {
                console.error("Error fetching data:", data.message);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }, [dateRange, category]);

    // Fetch data on component mount and when the date range changes
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleDateChange = (e) => {
        setDateRange({
            ...dateRange,
            [e.target.name]: e.target.value
        });
    };

    // const handleCardClick = (cardTitle) => {
    //     // Construct query parameters for filters
    //     const queryParams = new URLSearchParams({
    //         fromDate: dateRange.start || '',
    //         toDate: dateRange.end || dateRange.start || '',
    //     });

    //     // Navigate to a different route based on the card clicked
    //     switch (cardTitle) {
    //         case "Visitors":
    //             navigate(`/admin-panel/all-cookies-page?${queryParams.toString()}`);
    //             break;
    //         case "Cart Count":
    //             navigate(`/admin-panel/all-cart-items?${queryParams.toString()}`);
    //             break;
    //         case "Request Count":
    //             navigate(`/admin-panel/all-returned-products?${queryParams.toString()}`);
    //             break;
    //         case "Sales":
    //         case "Orders":
    //             queryParams.append('exclude_status', 'Pending');
    //             navigate(`/admin-panel/all-orders?${queryParams.toString()}`);
    //             break;
    //         case "Total Products":
    //             navigate(`/admin-panel/all-products?${queryParams.toString()}`);
    //             break;
    //         case "Users":
    //             navigate(`/admin-panel/all-users?${queryParams.toString()}`);
    //             break;
    //         case "Total Categories":
    //             navigate(`/admin-panel/all-categories?${queryParams.toString()}`);
    //             break;
    //         case "Order Count":
    //             queryParams.append('order_status', 'ordered');
    //             navigate(`/admin-panel/all-orders?${queryParams.toString()}`);
    //             break;
    //         case "Packed Count":
    //             queryParams.append('order_status', 'packaged');
    //             navigate(`/admin-panel/all-orders?${queryParams.toString()}`);
    //             break;
    //         case "Shipped Count":
    //             queryParams.append('order_status', 'shipped');
    //             navigate(`/admin-panel/all-orders?${queryParams.toString()}`);
    //             break;
    //         case "Delivered Count":
    //             queryParams.append('order_status', 'delivered');
    //             navigate(`/admin-panel/all-orders?${queryParams.toString()}`);
    //             break;
    //         case "Cancel Count":
    //             queryParams.append('order_status', 'cancelled');
    //             navigate(`/admin-panel/all-orders?${queryParams.toString()}`);
    //             break;
    //         case "Accept Count":
    //             queryParams.append('order_status', 'returnAccepted');
    //             navigate(`/admin-panel/all-orders?${queryParams.toString()}`);
    //             break;
    //         case "Return Count":
    //             queryParams.append('order_status', 'returned');
    //             navigate(`/admin-panel/all-orders?${queryParams.toString()}`);
    //             break;
    //         default:
    //             break;
    //     }
    // };
    const handleCardClick = (card) => {
        let startDate, endDate;
    
        // Helper function to get the last day of the month
        const getLastDayOfMonth = (year, month) => {
            return new Date(year, month + 1, 0);
        };
    
        // Helper function to get the first day of the current month
        const getFirstDayOfMonth = () => {
            const date = new Date();
            date.setDate(1); // Set to the first day of the month
            return date;
        };
    
        // Helper function to get the start of the fiscal year (April 1)
        const getFiscalYearStart = (currentDate) => {
            let fiscalYearStart = new Date(currentDate);
    
            // If the current month is January, February, or March, the fiscal year started the previous year
            if (currentDate.getMonth() < 3) {
                fiscalYearStart.setFullYear(currentDate.getFullYear() - 1);
            }
    
            fiscalYearStart.setMonth(3); // Set to April
            fiscalYearStart.setDate(1);  // Set to the first day of the month
            return fiscalYearStart;
        };
    
        // Check if the card is an "MTD" or "YTD" card
        if (card.title.includes("MTD")) {
            // For MTD (Month-to-Date): Calculate the start and end of the current month
            const currentDate = new Date();
            startDate = getFirstDayOfMonth().toISOString().split('T')[0]; // Start of the current month
            endDate = getLastDayOfMonth(currentDate.getFullYear(), currentDate.getMonth()).toISOString().split('T')[0]; // End of the current month
        } else if (card.title.includes("YTD")) {
            // For YTD (Year-to-Date): Calculate the start date from April 1 of the current fiscal year and end date to today's date
            const currentDate = new Date();
            const fiscalYearStart = getFiscalYearStart(currentDate);
            startDate = fiscalYearStart.toISOString().split('T')[0]; // Start of the fiscal year
            endDate = currentDate.toISOString().split('T')[0]; // Today's date
        } else {
            // If it's neither MTD nor YTD, use the existing date range from the state
            startDate = dateRange.start;
            endDate = dateRange.end || dateRange.start;
        }
        
    
        // Construct query parameters for filters
        const queryParams = new URLSearchParams({
            fromDate: startDate,
            toDate: endDate,
            category: category,
        });

    
        // Navigate to the card's path with query parameters
        const [basePath, existingParams] = card.path.split('?');
        const fullPath = `${basePath}?${queryParams.toString()}${existingParams ? `&${existingParams}` : ''}`;
    
        navigate(fullPath);
    };
    
    
    const cards = [
        { icon: <FontAwesomeIcon icon={faUsersViewfinder} />, title: "Visitors", path: "/admin-panel/all-cookies-page", count: dashboardData?.visitors?.total || 0, percentage: dashboardData?.visitors?.percentage, trend: dashboardData?.visitors?.trend, statics: dashboardData?.visitors?.statics, description: "Total Visitors Count", bgColor: 'bg-blue-200', iconColor: 'text-blue-700' },
        { icon: <FontAwesomeIcon icon={faCalendarCheck} />, title: "MTD", path: "/admin-panel/all-cookies-page", count: dashboardData?.visitors?.monthly?.total || 0, percentage: dashboardData?.visitors?.monthly?.percentage, trend: dashboardData?.visitors?.monthly?.trend, statics: dashboardData?.visitors?.monthly?.statics, bgColor: 'bg-blue-200', iconColor: 'text-blue-700' },
        { icon: <FontAwesomeIcon icon={faCalendarCheck} />, title: "YTD", path: "/admin-panel/all-cookies-page", count: dashboardData?.visitors?.yearly?.total || 0, percentage: dashboardData?.visitors?.yearly?.percentage, trend: dashboardData?.visitors?.yearly?.trend, statics: dashboardData?.visitors?.yearly?.statics, bgColor: 'bg-blue-200', iconColor: 'text-blue-700' },
        { icon: <FontAwesomeIcon icon={faArrowUpWideShort} />, title: "Sales", path: "/admin-panel/orders", count: displayINRCurrency(dashboardData?.sales?.total || 0), percentage: dashboardData?.sales?.percentage, trend: dashboardData?.sales?.trend, statics: dashboardData?.sales?.statics, description: "Total Sales Amount", bgColor: 'bg-green-200', iconColor: 'text-green-600' },
        { icon: <FontAwesomeIcon icon={faCalendarCheck} />, title: "MTD", path: "/admin-panel/orders", count: displayINRCurrency(dashboardData?.sales?.monthly?.total || 0), percentage: dashboardData?.sales?.monthly?.percentage, trend: dashboardData?.sales?.monthly?.trend, statics: dashboardData?.sales?.monthly?.statics, description: "Total Sales Amount", bgColor: 'bg-green-200', iconColor: 'text-green-600' },
        { icon: <FontAwesomeIcon icon={faCalendarCheck} />, title: "YTD", path: "/admin-panel/orders", count: displayINRCurrency(dashboardData?.sales?.yearly?.total || 0), percentage: dashboardData?.sales?.yearly?.percentage, trend: dashboardData?.sales?.yearly?.trend, statics: dashboardData?.sales?.yearly?.statics, description: "Total Sales Amount", bgColor: 'bg-green-200', iconColor: 'text-green-600' },
        { icon: <FontAwesomeIcon icon={faArrowDownWideShort} />, title: "Return", path: "/admin-panel/orders?order_status=returned&order_status=cancelled", count: displayINRCurrency(dashboardData?.salesReturn?.total || 0), description: "Total Return Amount", bgColor: 'bg-red-200', iconColor: 'text-red-600' },
        { icon: <FontAwesomeIcon icon={faHeartCrack} />, title: "Damaged", path: "/admin-panel/orders?order_status=returned", count: displayINRCurrency(dashboardData?.salesReturn?.return || 0), description: "Damaged sales Amount", bgColor: 'bg-red-200', iconColor: 'text-red-600' },
        { icon: <FontAwesomeIcon icon={faSackXmark} />, title: "Cancel", path: "/admin-panel/orders?order_status=cancelled", count: displayINRCurrency(dashboardData?.salesReturn?.cancel || 0), description: "Cancel sales Amount", bgColor: 'bg-red-200', iconColor: 'text-red-600' },
        { icon: <FontAwesomeIcon icon={faCubes} />, title: "Total Products", path: "/admin-panel/all-products", count: dashboardData?.totalProducts || 0, description: "Total products Count", bgColor: 'bg-violet-200', iconColor: 'text-violet-600' },
        { icon: <FontAwesomeIcon icon={faCubesStacked} />, title: "Product Stock", path: "/admin-panel/all-products", count: dashboardData?.productStock || 0, description: "Product Stock Count", bgColor: 'bg-violet-200', iconColor: 'text-violet-600' },
        { icon: <FontAwesomeIcon icon={faLayerGroup} />, title: "Total Categories", path: "/admin-panel/all-categories", count: dashboardData?.categoryCount || 0, description: "Total Categories Count", bgColor: 'bg-violet-200', iconColor: 'text-violet-600' },
        { icon: <FontAwesomeIcon icon={faUsers} />, title: "Users", path: "/admin-panel/all-users", count: dashboardData?.users?.total || 0, description: "Total User Count", bgColor: 'bg-pink-200', iconColor: 'text-pink-600' },
        { icon: <FontAwesomeIcon icon={faCalendarCheck} />, title: "MTD", path: "/admin-panel/all-users", count: dashboardData?.users?.monthly || 0, description: "Up from yesterday", bgColor: 'bg-pink-200', iconColor: 'text-pink-600' },
        { icon: <FontAwesomeIcon icon={faCalendarCheck} />, title: "YTD", path: "/admin-panel/all-users", count: dashboardData?.users?.yearly || 0, description: "Up from yesterday", bgColor: 'bg-pink-200', iconColor: 'text-pink-600' },
        { icon: <FontAwesomeIcon icon={faHandshakeSimple} />, title: "Orders", path: "/admin-panel/all-orders", count: dashboardData?.orders?.total || 0, description: "Total Orders Count", bgColor: 'bg-orange-200', iconColor: 'text-orange-600' },
        { icon: <FontAwesomeIcon icon={faCalendarCheck} />, title: "MTD", path: "/admin-panel/all-orders", count: dashboardData?.orders?.monthly || 0, description: "Up from yesterday", bgColor: 'bg-orange-200', iconColor: 'text-orange-600' },
        { icon: <FontAwesomeIcon icon={faCalendarCheck} />, title: "YTD", path: "/admin-panel/all-orders", count: dashboardData?.orders?.yearly || 0, description: "Up from yesterday", bgColor: 'bg-orange-200', iconColor: 'text-orange-600' },
        { icon: <FontAwesomeIcon icon={faHourglassHalf} />, title: "Pending Count", path: "/admin-panel/all-orders?order_status=Pending", count: dashboardData?.statuses?.total?.pending || 0, description: "Payment Pending Count", bgColor: 'bg-yellow-100', iconColor: 'text-yellow-600' },// ... other cards
        { icon: <FontAwesomeIcon icon={faCartArrowDown} />, title: "Cart Count", path: "/admin-panel/all-cart-items", count: dashboardData?.cartCount || 0, description: "Add ToCart Count", bgColor: 'bg-yellow-100', iconColor: 'text-yellow-600' },
        { icon: <FontAwesomeIcon icon={faHandshakeSimple} />, title: "Order Count", path: "/admin-panel/all-orders?order_status=ordered", count: dashboardData?.statuses?.total?.ordered || 0, description: "Order Status Count", bgColor: 'bg-yellow-100', iconColor: 'text-yellow-600' },
        { icon: <FontAwesomeIcon icon={faBoxOpen} />, title: "Packed Count", path: "/admin-panel/all-orders?order_status=packaged", count: dashboardData?.statuses?.total?.packaged || 0, description: "Packed Status Count", bgColor: 'bg-yellow-100', iconColor: 'text-yellow-600' },
        { icon: <FontAwesomeIcon icon={faTruckFast} />, title: "Shipped Count", path: "/admin-panel/all-orders?order_status=shipped", count: dashboardData?.statuses?.total?.shipped || 0, description: "Shipped Status Count", bgColor: 'bg-yellow-100', iconColor: 'text-yellow-600' },
        { icon: <FontAwesomeIcon icon={faPeopleCarryBox} />, title: "Delivered Count", path: "/admin-panel/all-orders?order_status=delivered", count: dashboardData?.statuses?.total?.delivered || 0, description: "Delivered Status Count", bgColor: 'bg-yellow-100', iconColor: 'text-yellow-600' },
        { icon: <FontAwesomeIcon icon={faBan} />, title: "Cancel Count", path: "/admin-panel/all-orders?order_status=cancelled", count: dashboardData?.statuses?.total?.cancelled || 0, description: "Cancel Status Count", bgColor: 'bg-yellow-100', iconColor: 'text-yellow-600' },
        { icon: <FontAwesomeIcon icon={faCommentDots} />, title: "Request Count", path: "/admin-panel/all-returned-products", count: dashboardData?.statuses?.total?.returnRequested || 0, description: "Request Status Count", bgColor: 'bg-yellow-100', iconColor: 'text-yellow-600' },
        { icon: <FontAwesomeIcon icon={faClipboardCheck} />, title: "Accept Count", path: "/admin-panel/all-orders?order_status=returnAccepted", count: dashboardData?.statuses?.total?.returnAccepted || 0, description: "Accept Status Count", bgColor: 'bg-yellow-100', iconColor: 'text-yellow-600' },
        { icon: <FontAwesomeIcon icon={faDiagramSuccessor} />, title: "Return Count", path: "/admin-panel/all-orders?order_status=returned", count: dashboardData?.statuses?.total?.returned || 0, description: "Return Status Count", bgColor: 'bg-yellow-100', iconColor: 'text-yellow-600' },
    ];

    return (
        <div className="p-6 bg-white min-h-screen">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-6 flex-wrap">
                <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                <div className="flex items-center gap-2 flex-wrap">
                    {/* Category Filter */}
                    <select
                        required
                        value={category}
                        name="category"
                        onChange={handleCategoryChange}
                        className="bg-white border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Category</option>
                        {categories.map((el, index) => {
                            return (
                                <option value={el.value} key={el.value + index}>
                                    {el.label}
                                </option>
                            );
                        })}
                    </select>

                    {/* Date Range Filter */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <input
                            type="date"
                            name="start"
                            value={dateRange.start}
                            onChange={handleDateChange}
                            className="bg-white border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-gray-500 hidden md:block">to</span>
                        <input
                            type="date"
                            name="end"
                            value={dateRange.end || dateRange.start}
                            onChange={handleDateChange}
                            className="bg-white border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>

            {/* Cards Section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-6">
                {cards.map((card, index) => (
                    <div
                        key={index}
                        className={`shadow-md rounded-lg p-2 flex flex-col justify-between ${card.bgColor}`}
                        onClick={() => handleCardClick(card)} // Trigger navigation on card click
                    >
                        <div className="flex items-center justify-between mb-1">
                            <h2 className="text-lg font-semibold text-gray-800">{card.title}</h2>
                            <span
                                className={`text-sm font-bold ${card.trend === "up" ? "text-green-600" : card.trend === "down" ? "text-red-500" : "text-yellow-500"}`}
                            >
                            {card.trend === "up" || card.trend === "neutral" ? "\u2191" : card.trend === "down" ? "\u2193" : ""} {card.percentage}

                            </span>
                        </div>
                        <p className="text-xl font-bold text-gray-900">{card.count}</p>
                        <div className="flex justify-between items-center mt-1">
                            <p className="text-sm text-gray-500">{card.description}</p>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className={`text-sm font-bold ${card.trend === "up" ? "text-green-600" : card.trend === "down" ? "text-red-500" : "text-yellow-500"}`}>{card.statics}</p>
                            <p className={`text-gray-700 text-2xl ${card.iconColor}`}>{card.icon}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;