const Offer = require('../../models/user/offers')
const Services = require('../../models/admin/services')

exports.createOffer = async (req, res) => {
    const { Title, code, description, discountType, Date, discountValue, expiryDate } = req.body;
    let image = '';

    if (req.file) {
        image = `/public/${req.file.filename}`
    }
    const newOffer = new Offer({
        Title,
        code,
        description,
        discountType,
        Date,
        discountValue,
        expiryDate,
        image
    });
    try {
        const CreateOffer = await newOffer.save();
        res.json(CreateOffer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

exports.getOffers = async (req, res) => {
    try {
        const getOffer = await Offer.find();
        res.json(getOffer)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'failed to get offers' })
    }
}

exports.applyOfferByServiceId = async (req, res) => {
    try {
        const { serviceId, offerCode, totalAmount } = req.body;

        // Find the offer in the database
        const offer = await Offer.findOne({ code: offerCode });

        if (!offer) {
            return res.status(404).json({ error: 'Offer not found' });
        }

        // Check if the offer is valid based on the current date
        const currentDate = new Date();
        if (offer.expiryDate < currentDate) {
            return res.status(400).json({ error: 'Offer has expired' });
        }

        // Fetch the service based on the provided parameters
        const service = await Services.findOne({ _id: serviceId }).populate({
            path: 'PeriodicServices AcServices BatteriesService TyresAndWheelsCare DentingAndPainting DetailsServicing CarSpaCleaning CarInspections WindshielsLight SuspensionAndFitness ClutchBodyParts InsuranceAndClaims SOS_Services',
        });

        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }

        // Find the correct subdocument based on singleId
        const findSubdocument = (field) => {
            return field && field._id && field._id.toString() === serviceId ? field : null;
        };

        // Try to find the matched subdocument across different service types
        const matchedSubdocument =
            findSubdocument(service.PeriodicServices) ||
            findSubdocument(service.AcServices) ||
            findSubdocument(service.BatteriesService) ||
            findSubdocument(service.TyresAndWheelsCare) ||
            findSubdocument(service.DentingAndPainting) ||
            findSubdocument(service.DetailsServicing) ||
            findSubdocument(service.CarSpaCleaning) ||
            findSubdocument(service.CarInspections) ||
            findSubdocument(service.WindshielsLight) ||
            findSubdocument(service.SuspensionAndFitness) ||
            findSubdocument(service.ClutchBodyParts) ||
            findSubdocument(service.InsuranceAndClaims) ||
            findSubdocument(service.SOS_Services);

        if (!matchedSubdocument) {
            return res.status(404).json({ error: 'Subdocument not found' });
        }

        // Apply the discount based on the discount type
        let discountedAmount = totalAmount;

        if (offer.discountType === 'percentage') {
            discountedAmount = totalAmount * (offer.discountValue / 100);
        } else if (offer.discountType === 'fixed') {
            discountedAmount = totalAmount - offer.discountValue;
        }

        // Optionally, you can return information about the discounted service
        const discountedService = {
            serviceId: serviceId,
            serviceName: matchedSubdocument.name, // Adjust based on your actual field
            discountedAmount,
        };

        res.status(200).json({ discountedService });
    } catch (error) {
        console.error('Error while applying offer:', error);
        res.status(500).json({ error: 'Failed to apply the offer.' });
    }
};
exports.applyOfferByCode = async (req, res) => {
    try {
        const { code, totalAmount } = req.body;

        // Find the offer in the database
        const foundOffer = await Offer.findOne({ code: code });

        if (!foundOffer) {
            return res.status(404).json({ error: 'Offer not found' });
        }

        // Check if the offer is valid based on the current date
        const currentDate = new Date();
        if (foundOffer.expiryDate < currentDate) {
            return res.status(400).json({ error: 'Offer has expired' });
        }

        // Apply the discount based on the discount type
        let discountedAmount = totalAmount;

        if (foundOffer.discountType === 'percentage') {
            discountedAmount = totalAmount * (foundOffer.discountValue / 100);
        } else if (foundOffer.discountType === 'fixed') {
            discountedAmount = totalAmount - foundOffer.discountValue;
        }

        // Optionally, you can return information about the discounted amount
        const discountedInfo = {
            code,
            discountedAmount,
        };

        res.status(200).json({ discountedInfo });
    } catch (error) {
        console.error('Error while applying offer:', error);
        res.status(500).json({ error: 'Failed to apply the offer.' });
    }
};
