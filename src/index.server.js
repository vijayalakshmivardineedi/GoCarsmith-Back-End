const express=require("express")
const env = require('dotenv')
const mongoose=require("mongoose")
const app=express()
const path=require('path');
const cors =require('cors');
const multer = require('multer');
const upload = multer();


//routes
//admin
const adminappointmentsRoutes=require('./routes/admin/appointments');
const adminRoutes=require('./routes/admin/auth');
const blogRoutes = require('./routes/admin/blog');
const brandRoutes = require('./routes/admin/brands');
const categoryRoutes = require('./routes/admin/category');
const cityRoutes = require('./routes/admin/city');
const couponsRoutes = require('./routes/admin/coupons');
const emailRoutes =require('./routes/admin/email');
const inventoryRoutes = require('./routes/admin/inventory');
const invoiceGenerationRoutes = require('./routes/admin/invoiceGeneration');
const inventoryOrders = require('./routes/admin/inventoryOrders');
const modelRoutes = require('./routes/admin/model');
const requestsNotify = require('./routes/admin/requestsNotify');
const reviewRoutes = require('./routes/admin/review');
const servicesRoutes = require('./routes/admin/services');
const trashBinRoutes=require('./routes/admin/trashBin');
const notificationRoutes=require('./routes/admin/notificationsSendService');
const reminderRoutes=require('./routes/admin/reminder');

//serviceCenter
const serviceCenterRoutes=require('./routes/serviceCenter/auth');

const serviceCenterInventoryRoutes=require('./routes/serviceCenter/serviceCenterInventory');
const serviceCenterReviewSRoutes = require('./routes/serviceCenter/ServiceCenterReview')
const onSiteInvoiceRoute=require('./routes/admin/onSiteInvoice')
const serviceCenterRequestsRoutes=require('./routes/serviceCenter/request');
const adminCreationRoutes=require('./routes/serviceCenter/admincreation')
const serviceCenterInventoryRequestsRoutes=require('./routes/serviceCenter/inventoryRequest');
//Onsite Appointment



const employeeRoutes=require('./routes/serviceCenter/employee/auth');
//user
const cartRoute=require("./routes/user/Cart");
const userRoutes=require('./routes/user/auth');
const userappointmentsRoutes=require('./routes/user/appointments');
const PaymentRoute=require('./routes/user/Payment');
const manageAddressRoutes = require('./routes/user/ManageAddress');
const userBlogRoutes=require('./routes/user/blog');
const userinteraction=require('./routes/user/interaction');
const GoAppMoneyRouter=require('./routes/user/Referral')
const userPriceListRoutes=require('./routes/user/priceList');
const userKeySpecsRoutes = require('./routes/user/keySpec');
const offerRoutes = require('./routes/user/offer');
const healthCardRoute=require('./routes/user/HealthInsurance');
const Gomoney= require("./routes/user/EarnMoney")
//employee

const onsiteAppointmentroutes=require('./routes/serviceCenter/OnsiteAppointments')


env.config()
mongoose.connect(
  `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.cjhkhoe.mongodb.net/?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)
.then(() => {
  console.log("Database Connected");
})
.catch((err) => {
  console.error("Error connecting to the database:", err);
});





app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(upload.none());
app.use('/public', express.static(path.join(__dirname, 'uploads')));
app.use('/publicimages', express.static(path.join(__dirname, 'uploadsImagesUser')));
app.use('/publicreminders', express.static(path.join(__dirname, 'uploadsFilesReminder')));

//admin
app.use('/api', adminappointmentsRoutes);
app.use('/api', adminRoutes);
app.use('/api', blogRoutes);
app.use('/api', brandRoutes);
app.use('/api', categoryRoutes);
app.use('/api', cityRoutes);
app.use('/api', couponsRoutes);
app.use('/api', emailRoutes);
app.use('/api', inventoryRoutes);
app.use('/api', inventoryOrders);
app.use('/api', invoiceGenerationRoutes);
app.use('/api', modelRoutes);
app.use('/api', reviewRoutes);
app.use('/api', requestsNotify);
app.use('/api', servicesRoutes);
app.use('/api', trashBinRoutes);
app.use('/api',onSiteInvoiceRoute)
app.use('/api',notificationRoutes)
app.use('/api', reminderRoutes);

//serviceCenter
app.use('/api', serviceCenterRequestsRoutes);
app.use('/api', serviceCenterRoutes);
// app.use('/api', serviceCenterRequestsRoutes);
app.use('/api', serviceCenterInventoryRequestsRoutes);
//app.use('/api', serviceCenterapprovalRequestRoutes);
app.use('/api', adminCreationRoutes);
app.use('/api',cartRoute)
app.use('/api', employeeRoutes);
app.use('/api',serviceCenterInventoryRoutes)
app.use('/api',serviceCenterReviewSRoutes)

//user
app.use('/api', userRoutes);
app.use('/api', userappointmentsRoutes);
app.use('/api',PaymentRoute);
app.use('/api', manageAddressRoutes);
app.use('/api', userBlogRoutes);
app.use('/api', userinteraction);
app.use('/api',GoAppMoneyRouter);
app.use('/api', userPriceListRoutes);
app.use('/api', userKeySpecsRoutes);
app.use('/api', offerRoutes);
app.use('/api',serviceCenterReviewSRoutes);
app.use('/api',healthCardRoute);
app.use('/api',Gomoney);
//employee
app.use('/api', employeeRoutes);

app.use('/api', onsiteAppointmentroutes)




app.use('/api', emailRoutes);




mongoose.set('strictQuery', false);


app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});