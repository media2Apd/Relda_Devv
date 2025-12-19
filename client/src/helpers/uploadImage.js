// // // const url = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME_CLOUDINARY}/elda-product`
// // const url = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME_CLOUDINARY}/image/upload`

// // const uploadImage  = async(image) => {
// //     const formData = new FormData()
// //     formData.append("file",image)
// //     formData.append("upload_preset","Elda-app")
    

// //     const dataResponse = await fetch(url,{
// //         method : "post",
// //         body : formData
// //     })

// //     return dataResponse.json()

// // }

// // export default uploadImage 


// const url = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME_CLOUDINARY}/image/upload`;

// const uploadImage = async (image) => {
//   const formData = new FormData();
//   formData.append("file", image);
//   formData.append("upload_preset", "Elda-app");

//   try {
//     const dataResponse = await fetch(url, {
//       method: "POST",
//       body: formData,
//     });

//     if (!dataResponse.ok) {
//       throw new Error(`Failed to upload image. Status: ${dataResponse.status}`);
//     }

//     const jsonResponse = await dataResponse.json();
//     return jsonResponse;

//   } catch (error) {
//     console.error("Error uploading image to Cloudinary:", error);
//     throw error;
//   }
// };

// export default uploadImage;
const uploadMedia = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "Elda-app");

  // Determine the resource_type dynamically
  const isVideo = file.type.startsWith("video");
  const resourceType = isVideo ? "video" : "image";

  const url = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME_CLOUDINARY}/${resourceType}/upload`;

  try {
    const dataResponse = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!dataResponse.ok) {
      throw new Error(`Failed to upload ${resourceType}. Status: ${dataResponse.status}`);
    }

    const jsonResponse = await dataResponse.json();
    return {
      url: jsonResponse.secure_url,
      type: resourceType,
    };

  } catch (error) {
    console.error("Error uploading media to Cloudinary:", error);
    throw error;
  }
};

export default uploadMedia;
