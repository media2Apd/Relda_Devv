const mongoose = require("mongoose");


const documentSnapshotSchema = new mongoose.Schema({
    gstCertificate: {
        url: { type: String, default: null },   
        publicId: { type: String, default: null },
        type: { type: String, default: null }
    },
    shopPhoto: {
        url: { type: String, default: null },           
        publicId: { type: String, default: null },
        type: { type: String, default: null }
    },
    warehousePhoto: {
        url: { type: String, default: null },           
        publicId: { type: String, default: null },
        type: { type: String, default: null }
    },
    visitingCard: {
        url: { type: String, default: null },           
        publicId: { type: String, default: null },
        type: { type: String, default: null }
    }
}, { _id: false });


const authorizedDistributorSchema = new mongoose.Schema(
{
    businessName:{
        type:String,
        required:true
    },

    proprietorName:{
        type:String,
        required:true
    },

    contactPerson:{
        type:String,
        required:true
    },

    mobile:{
        type:String,
        required:true
    },

    whatsapp:{
        type:String
    },

    email:{
        type:String
    },

    address:{
        type:String,
        required:true
    },

    city:{
        type:String,
        required:true
    },

    district:{
        type:String,
        required:true
    },

    state:{
        type:String,
        required:true
    },

    pinCode:{
        type:String,
        required:true
    },

    businessType:{
        type:String,
        enum:[
            "Proprietorship",
            "Partnership",
            "Private Limited",
            "LLP",
            "Other"
        ]
    },

    establishmentYear:Number,

    gstNumber:String,

    panNumber:String,

    productCategories:[
        String
    ],

    distributedBrands:String,

    experience:{
        type:String
    },

    monthlyTurnover:{
        type:String
    },

    coverageAreas:String,

    salesExecutives:Number,

    deliveryVehicles:Number,

    warehouseAvailable:Boolean,

    warehouseSize:String,

    dealersCount:String,

    expectedPurchase:String,

    investmentCapacity:String,

  documentSnapshot: [documentSnapshotSchema],

    reason:String,

    additionalComments:String,

    status:{
        type:String,
        default:"Pending",
        enum:["Pending","Approved","Rejected"]
    }

},
{
    timestamps:true
});

const authorizedDistributor = mongoose.model(
"AuthorizedDistributor",
authorizedDistributorSchema
);

module.exports = authorizedDistributor;