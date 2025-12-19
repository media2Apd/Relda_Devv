// import React, { useState, useEffect } from "react";
// import { MdModeEditOutline, MdDeleteOutline } from "react-icons/md";
// import UploadOfferPoster from "./UploadOfferPoster";

// const AllOfferPosters = () => {
//     const [offerPosters, setOfferPosters] = useState([]);
//     const [openUploadOfferPoster, setOpenUploadOfferPoster] = useState(false);
//     const [editingOfferPoster, setEditingOfferPoster] = useState(null);
//     const [error, setError] = useState('');
//     const [loading, setLoading] = useState(false);

//     // Fetch Offer Posters
//     const fetchOfferPosters = async () => {
//         setLoading(true); // Set loading to true while fetching data
//         try {
//             const response = await fetch('http://localhost:8080/api/get-offerposters');
//             if (!response.ok) {
//                 throw new Error('Failed to fetch offerPosters');
//             }
//             const data = await response.json();
//             console.log("Fetched Data:", data);

//             if (Array.isArray(data.offerPosters)) {
//                 setOfferPosters(data.offerPosters);
//             } else {
//                 throw new Error(`Unexpected response format: ${JSON.stringify(data)}`);
//             }
//             setError(''); // Clear any previous errors
//         } catch (error) {
//             console.log("Error fetching offerPosters:", error);
//             setError(error.message);
//         } finally {
//             setLoading(false); // Set loading to false after fetching data
//         }
//     };

//     useEffect(() => {
//         fetchOfferPosters();
//     }, []);

//     // Handle Edit Offer Poster
//     const handleEditOfferPoster = (offerPoster) => {
//         setEditingOfferPoster(offerPoster);
//         setOpenUploadOfferPoster(true);
//     };

//     // Handle Delete Offer Poster
//     const handleDeleteOfferPoster = async (id) => {
//         try {
//             const response = await fetch(`http://localhost:8080/api/delete-offerposter/${id}`, {
//                 method: 'DELETE',
//             });
//             if (!response.ok) {
//                 throw new Error('Failed to delete offerPoster');
//             }
//             setOfferPosters(offerPosters.filter(offerPoster => offerPoster._id !== id));
//         } catch (error) {
//             setError(error.message);
//         }
//     };

//     // Success handler for modal
//     const handleSuccess = async () => {
//         setOpenUploadOfferPoster(false);
//         setEditingOfferPoster(null); // Reset editingOfferPoster after success
//         fetchOfferPosters();
//     };

//     return (
//         <div className="min-h-screen bg-gray-50">
//             <div className="bg-white py-2 px-6 shadow-md flex justify-between items-center">
//                 <h1 className="font-bold text-xl text-gray-800">All Offer Posters</h1>
//                 <button
//                     className="border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all py-2 px-4 rounded-full"
//                     onClick={() => {
//                         setEditingOfferPoster(null);
//                         setOpenUploadOfferPoster(true);
//                     }}
//                 >
//                     Upload Offer Posters
//                 </button>
//             </div>

//             {/* Upload Offer Poster Modal */}
//             {openUploadOfferPoster && (
//                 <UploadOfferPoster
//                     onClose={() => setOpenUploadOfferPoster(false)} 
//                     offerposter={editingOfferPoster} 
//                     onSuccess={handleSuccess}
//                 />
//             )}

//             {/* Display Offer Posters */}
//             <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {loading && <p>Loading...</p>}
//                 {error && <p className="text-red-500">{error}</p>}
//                 {offerPosters.map((offerPoster) => (
//                     <div key={offerPoster._id} className="bg-white p-4 rounded shadow-lg flex flex-col items-center">
//                         <div className="w-full h-32 flex justify-center items-center">
//                             <img
//                                 src={offerPoster.image}
//                                 alt={`Offer Poster for ${offerPoster.title}`} // Added alt text for images
//                                 className="max-h-full max-w-full object-cover rounded-lg"
//                             />
//                         </div>
//                         <p className="text-center text-lg font-semibold text-gray-800 mt-1">Parent Category: {offerPoster.parentCategory.name}</p>
//                         <p className="text-center text-md font-semibold text-gray-600 mt-1">Sub Category: {offerPoster.childCategory}</p>
//                         <div className="w-full flex justify-between items-center mt-4">
//                             <button
//                                 className="p-2 bg-green-100 hover:bg-green-600 rounded-full hover:text-white cursor-pointer"
//                                 onClick={() => handleEditOfferPoster(offerPoster)}
//                             >
//                                 <MdModeEditOutline size={20} />
//                             </button>
//                             <button
//                                 className="p-2 bg-red-100 hover:bg-red-600 rounded-full hover:text-white cursor-pointer"
//                                 onClick={() => handleDeleteOfferPoster(offerPoster._id)}
//                             >
//                                 <MdDeleteOutline size={20} />
//                             </button>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default AllOfferPosters;
import React, { useState, useEffect } from "react";
import { MdModeEditOutline, MdDeleteOutline } from "react-icons/md";
import UploadOfferPoster from "../pages/UploadOfferPoster";
import SummaryApi from "../common";

const AllOfferPosters = () => {

    const [offerPosters, setOfferPosters] = useState([]);
    const [openUploadOfferPoster, setOpenUploadOfferPoster] = useState(false);
    const [editingOfferPoster, setEditingOfferPoster] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);


    const fetchOfferPosters = async () => {
        setLoading(true);
        try {
            const response = await fetch(SummaryApi.getOfferPosters.url);
            if (!response.ok) {
                throw new Error('Failed to fetch offerPosters');
            }
            const data = await response.json();
            console.log("Fetched Data:", data);

            if (Array.isArray(data.offerPosters)) {
                setOfferPosters(data.offerPosters);
            } else {
                throw new Error(`Unexpected response format: ${JSON.stringify(data)}`);
            }
            setError("");
        } catch (error) {
            console.log("Error fetching offerPosters:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        };
    };

    useEffect(() => {
        fetchOfferPosters();
    }, []);


    const handleEditOfferPoster = (offerPoster) => {
        setEditingOfferPoster(offerPoster);
        setOpenUploadOfferPoster(true);
    };

    const handleDeleteOfferPoster = async (id) => {
        try {
            const response = await fetch(SummaryApi.deleteOfferPoster(id).url, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete offerPoster');
            }
            setOfferPosters(offerPosters.filter(offerPoster => offerPoster._id !== id));
        } catch (error) {
            setError(error.message);
        }
    };

    const handleSuccess = async () => {
        setOpenUploadOfferPoster(false);
        setEditingOfferPoster(null);
        fetchOfferPosters();
    };



    return (
        <div className="min-h-screen p-1 md:p-4">
            <div className="bg-white py-2 px-6 shadow-md flex justify-between items-center rounded-lg">
                <h1 className="font-bold text-xl text-gray-800">All Offer Posters</h1>
                <button
                    className="border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all py-2 px-4 rounded-full"
                    onClick={() => {
                        setEditingOfferPoster(null);
                        setOpenUploadOfferPoster(true);
                    }}
                >
                    Upload Offer Posters
                </button>
            </div>

            {openUploadOfferPoster && (
                <UploadOfferPoster
                    onClose={() => setOpenUploadOfferPoster(false)} offerposter={editingOfferPoster} onSuccess={handleSuccess}
                />
            )}

            {/* Display OfferPosters */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading && <p className="text-lg font-semibold text-gray-600">Loading...</p>}
                {error && <p className="text-red-500 font-semibold">{error}</p>}
                {offerPosters.map((offerPoster, index) => (
                    <div key={offerPoster._id} className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center">
                        <div className="w-full h-32 flex justify-center items-center">
                            <img src={offerPoster.image} alt={offerPoster.title} className="max-h-full max-w-full object-cover rounded-lg" />
                        </div>
                        <p className="text-center text-lg font-semibold text-gray-800 mt-1">Parent Category: {offerPoster.parentCategory.name}</p>
                        <p className="text-center text-md font-semibold text-gray-600 mt-1">Sub Category: {offerPoster.childCategory}</p>
                        <div className="w-full flex justify-between items-center mt-4">
                            <button
                                className="p-2 bg-green-100 hover:bg-green-600 rounded-full hover:text-white cursor-pointer"
                                onClick={() => handleEditOfferPoster(offerPoster)}
                            >
                                <MdModeEditOutline size={20} />
                            </button>
                            <button
                                className="p-2 bg-red-100 hover:bg-red-600 rounded-full hover:text-white cursor-pointer"
                                onClick={() => handleDeleteOfferPoster(offerPoster._id)}

                            >
                                <MdDeleteOutline size={20} />
                            </button>
                        </div>

                    </div>
                ))}

            </div>

        </div>
    );
};

export default AllOfferPosters;