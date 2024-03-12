const mongoose = require('mongoose');
const basicmodel = new mongoose.Schema({
    name: { type: String },
    price: { type: Number }
})
const AcServices=new mongoose.Schema({
        REGULAR_AC_SERVICE:basicmodel,
        HIGH_PERFORMANCE_AC_SERVICE: basicmodel,
        COOLING_COIL_REPLACEMENT: basicmodel,
        CONDENSER_REPLACEMNT: basicmodel,
        COMPRESSOR_REPLACEMNT: basicmodel,
        HEATING_COIL_REPLACEMNT: basicmodel,
        V_BELT_REPLACEMNT: basicmodel,
        AC_BLOWER_MOTOR_REPLACEMNT: basicmodel,
        RADIATOR_REPLACEMNT: basicmodel,
        RADIATOR_FAN_MOTOR_REPLACEMNT: basicmodel,
        RADIATOR_FLUSH_AND_CLEAN: basicmodel
})
const PeriodicServices=new mongoose.Schema({
    BASIC_SERVICE: basicmodel,
    STANDARD_SERVICE: basicmodel,
    COMPREHENSIVE_SERVICE: basicmodel,
    FRONT_BRAKE_PADS: basicmodel,
    REAR_BRAKE_PADS: basicmodel,
    FRONT_BRAKE_DISCS: basicmodel,
    CALIPER_PIN_REPLACEMENT: basicmodel,
    DISC_TURNNING: basicmodel,
    HANDBRAKE_WIRE_REPLACEMENT: basicmodel,
    BRAKE_DRUMSTURNING: basicmodel,
    WHEEL_CYLINDER_REPLACEMENT: basicmodel
})
const BatteriesService=new mongoose.Schema({
    AMARON_44_MONTHS_WARRANTY: basicmodel,
    AMARON_55_MONTHS_WARRANTY: basicmodel,
    AMARON_66_MONTHS_WARRANTY: basicmodel,
    EXIDE_44_MONTHS_WARRANTY: basicmodel,
    EXIDE_55_MONTHS_WARRANTY: basicmodel,
    EXIDE_66_MONTHS_WARRANTY: basicmodel,
    LIVGUARD_60_MONTHS_WARRANTY: basicmodel,
    LIVGUARD_72_MONTHS_WARRANTY: basicmodel,
    Alternator_Replacement:basicmodel,
    Alternator_Repair:basicmodel})
    const TyresAndWheelsCare=new mongoose.Schema({
        APOLLO_ALNAC_4GS_SIZE_185_65_R15_88H: basicmodel,
        APOLLO_AMAZER_4G_LIFE_SIZE_185_65_R15_88T: basicmodel,
        MRF_ZLX_SIZE_165_80_R14_TL: basicmodel,
        MRF_SIZE_165_80_R14_85TL: basicmodel,
        MRF_ZVTS_Size_155_80_R13_79TL: basicmodel,
        MRF_ZVTY_SIZE_185_65_R15_88TL: basicmodel,
        JK_UX_ROYALE_SIZE_165_80_R14: basicmodel,
        BRIDGESTONE_B290_Size_155_80_R13_79S: basicmodel,
        BRIDGESTONE_B290_SIZE_165_80_R14_81S: basicmodel,
        BRIDGESTONE_ECOPIA_EP150_SIZE_165_65_R14_88V: basicmodel,
        CEAT_MILAZE_SIZE_165_80_R14_85S: basicmodel,
        CEAT_MILAZE_X3__SIZE_165_65_R15: basicmodel,
        CEAT_MILAZE_Size_155_80_R13:basicmodel,
        YOKOHAMA_Earth_1E400:basicmodel,
        COMPLETE_WHEEL_CARE: basicmodel,
        MUD_FLAPS: basicmodel})
        const DentingAndPainting=new mongoose.Schema({
            FRONT_BUMBER_PAINT: basicmodel,
            BONNET_PAINT: basicmodel,
            REAR_BUMBER_PAINT: basicmodel,
            BOOT_PAINT: basicmodel,
            FULL_BODY_DENT_PAINT: basicmodel,
            ALLOY_PAINT: basicmodel,
            LEFT_FENDER_PAINT: basicmodel,
            LEFT_FRONT_DOOR_PAINT: basicmodel,
            LEFT_REAR_DOOR_PAINT: basicmodel,
            LEFT_QUARTER_PANEL_PAINT: basicmodel,
            LEFT_RUNNING_BOARD_PAINT: basicmodel,
            RIGHT_FENDER_PAINT: basicmodel,
            RIGHT_FRONT_DOOR_PAINT: basicmodel,
            RIGHT_REAR_DOOR_PAINT: basicmodel,
            RIGHT_QUARTER_PANEL_PAINT: basicmodel,
            RIGHT_RUNNING_BOARD_PAINT: basicmodel})
            const DetailsServicing=new mongoose.Schema({
                _3M_CAR_RUBBING_POLISHING: basicmodel,
                CERAMIC_COATING: basicmodel,
                MEGUIARS_CERAMIC_COATING: basicmodel,
                MEGUIARS_TEFLON_COATING: basicmodel,
                _3M_TEFLON_COATING: basicmodel,
                PPF_PAINT_PROTECTION_FILM: basicmodel,
                ANTI_RUST_YNDERBODY_COATING: basicmodel,
                SILENCER_COATING: basicmodel})
                const CarSpaCleaning=new mongoose.Schema({
                    FESTIVAL_360_DEEP_CLEANING: basicmodel,
                    CAR_INTERIOR_SPA: basicmodel,
                    DEEP_ALL_ROUND_SPA: basicmodel,
                    PREMIUM_TOP_WASH: basicmodel,
                    CAR_RUBBING_POLISHING: basicmodel,
                    RAT_PEST_REPELLENT_TREATMENT: basicmodel,
                    CAR_INSPECTION_DIAGNOSTICS: basicmodel,
                    SUNROOF_SERVICE: basicmodel})
    const CarInspections=new mongoose.Schema({
            SECOND_HAND_CAR_INSPECTION: basicmodel,
            ROAD_TRIP_INSPECTION: basicmodel,
            ENGINE_SCANNING: basicmodel,
            Insurance_Claim_Inspection: basicmodel,
        COMPLETE_SUSPENSION_INSPECTION: basicmodel,
        CAR_FLUIDS_CHECK: basicmodel,
        RADIATOR_REPLACEMENT: basicmodel,
        RADIATOR_FAN_MOTOR_REPLACEMENT: basicmodel,
        RADIATOR_FLUSH_CLEAN: basicmodel,
        CAR_WATERLOG_ASSISTANCE: basicmodel,
        CAR_ENGINE_ISSUES: basicmodel,
        PROBLEM_WITH_CAR_BRAKES_WHEELS: basicmodel,
        DAMAGED_CAR_BODY_INTERIORS: basicmodel,
    })
    const WindshielsLight=mongoose.Schema({
         FRONT_WINDSHIELD_REPLACEMENT: basicmodel,
        REAR_WINDSHIELD_REPLACEMENT: basicmodel,
        DOOR_GLASS_REPLACEMENT: basicmodel,
        FRONT_HEADLIGHT: basicmodel,
        REAR_TAILLIGHT: basicmodel,
        FOG_LIGHT: basicmodel,
        SIDE_MIRROE_REPLACEMENT: basicmodel})
        const SuspensionAndFitness=new mongoose.Schema({
             ESP_MODULE_REPAIR: basicmodel,
            STEERING_RACK_REPAIR: basicmodel,
            FRONT_SHOCK_ABSORBER_REPLACEMENT: basicmodel,
            REAR_SHOCK_ABSORBER_REPLACEMENT: basicmodel,
            SUSPENSION_LOWER_ARM_REPLACEMNT: basicmodel,
            LINK_ROD_REPLACEMENT: basicmodel,
            TIE_ROA_END_REPLACEMENT: basicmodel,
            COMPLETE_SUSPENSION_INSPECTION: basicmodel,
            FRONT_SHOCKER_MOUNT_REPLACEMENT: basicmodel,
            FRONT_AXLE_REPAIR: basicmodel,
            SELENCER_REPAIR: basicmodel,
            RADIATOR_REPLACEMENT: basicmodel,
            ENGINE_MOUNTING_REPLACEMENT: basicmodel,
            GEAR_BOX_MOUNTING_REPLACEMENT: basicmodel,
            FUEL_PUMP_REPLACEMENT: basicmodel,
            RADIATOR_FAN_MOTOR_REPLACEMENT: basicmodel,
            WATER_PUMP_REPLACEMENT: basicmodel,
            ECM_REPAIR: basicmodel,
            PREMIUM_TOP_WASH: basicmodel,
            DICKEY_SHOCKER_REPLACEMENT: basicmodel,
            START_MOTOT_REPAIR: basicmodel,
            MUD_FLAPS: basicmodel,
            DOOR_LATCH_REPLACEMENT: basicmodel,
            POWER_WINDOW_REPAIR: basicmodel,
            NOISES_WITH_CAR_SUSPENSION_STEERING: basicmodel,
            FAULTY_ELECTRICALS: basicmodel})
            const ClutchBodyParts=new mongoose.Schema({
                CLUTCH_SET_REPLACEMENT: basicmodel,
                FLYWHEEL_REPLACEMENT: basicmodel,
                CLUTCH_BEARING_REPLACEMENT: basicmodel,
                FLYWHEEL_TURNING: basicmodel,
                CLUTCH_OVERHAUL: basicmodel,
                FRONT_BUMBER_REPLACEMENT: basicmodel,
                REAR_BUMBER_REPLACEMENT: basicmodel,
                RIGHT_FRONT_DOOR_REPLACEMENT: basicmodel,
                RIGHT_REAR_DOOR_REPLACEMENT: basicmodel,
                FENDER_REPLACEMENT: basicmodel,
                BOOT_REPLACEMENT: basicmodel,
                BONNET_REPLACEMENT: basicmodel,
                LEFT_FRONT_DOOR_REPLACEMENT: basicmodel,
                LEFT_REAR_DOOR_REPLACEMENT: basicmodel,
                CLUTCH_TRANSMISSION_TROUBLES: basicmodel,
                ABS_ISSUE: basicmodel,
                SONY_GO_ECO_ASX_A410BT: basicmodel,
                SONY_GO_X_XAV_1500: basicmodel,
                SONY_GO_PLAY_XAV_ASX5500: basicmodel,
                SONY_GO_PLAY_XAV_AX7000: basicmodel
            })
         const InsuranceAndClaims=new mongoose.Schema({
            KNOW_YOUR_POLICY: basicmodel,
            ACCIENDATAL_DENRTING_PAINTING_INSURANCE: basicmodel,
            CAR_FLOOD_DAMAGE_INSURANCE: basicmodel,
            FIRE_DAMAGE_ASSISTANCE_INSURANCE: basicmodel,
            WINDSHIELD_REPLACEMENT_INSURANCE: basicmodel,
            KEY_REPLACEMENT_INSURANCE: basicmodel,
            TYRES_WHEEL_REPLACEMENT_INSURANCE: basicmodel,
            BATTERY_REPLACEMENT_INSURANCE: basicmodel,
            CAR_THEFT_CLAIM_INSURANCE: basicmodel,
            ECM_REPLACEMENT_INSURANCE: basicmodel,
            DOORSTEP_ACCIENDTS_INSPECTION: basicmodel,
            TOWLING_ISURANCE: basicmodel,
            INSURANCE_CLIAM_INSPECTION: basicmodel})
            const SOS_Services=new mongoose.Schema({
                 BATTERY_JUMPSTART: basicmodel,
                CAR_FLUID_LEAKAGE: basicmodel,
                CAR_ENGINE_SCANNING: basicmodel,
                WHEEL_LIFT_TOW_20_KMS: basicmodel,
                CAR_SELF_STARTER_ISSUE: basicmodel,
                FLAT_BED_TOW_20KM: basicmodel,
                CLUTCH_BREAKDOWN: basicmodel,
                INSURANCE_ACCIENT: basicmodel,
                CAR_FLOODING: basicmodel,
                BRAKE_FAILURE: basicmodel,
                CRITICAL_DASHBOARD_LIGHT: basicmodel,
                WRONG_FUEL_EMERGENCY: basicmodel})
const servicesSchema = new mongoose.Schema({
    modelId:{
      type:mongoose.Schema.Types.ObjectId,
       ref: "carModel",
       required: true,
      type:String
    },
    locations: [
       
        {type:String}
    ],
fuelType:{type:String,
    required:true,
    enum:["Petrol","Diesel","CNG","Electric"]
},
model:{
    type:String,
    require:true
},
    //periodic schema
   PeriodicServices:PeriodicServices,
    // AC services schema
  AcServices:AcServices,
// //BatteriesServiceSchema
BatteriesService:BatteriesService,
    //tyresAndWheelsCareSchema
TyresAndWheelsCare:TyresAndWheelsCare,
//DentingAndPaintingSchema
DentingAndPainting:DentingAndPainting,
//detailsServicingSchema
DetailsServicing:DetailsServicing,
 //carSpaCleaningSchema
CarSpaCleaning:CarSpaCleaning,
 //carInspectionsSchema
CarInspections:CarInspections,
//WindshielsLightSchema
WindshielsLight:WindshielsLight,
// SuspensionAndFitnessSchema
SuspensionAndFitness:SuspensionAndFitness,
 // ClutchBodyPartsSchema
ClutchBodyParts:ClutchBodyParts,
    // InsuranceAndClaims: InsuranceAndClaimsSchema,
InsuranceAndClaims:InsuranceAndClaims,
    // SOS_Services: SOS_ServicesSchema,
 SOS_Services:SOS_Services,
    created_At:{
        type:Date,
        default:Date.now()
    }
});
const Services = mongoose.model('Services', servicesSchema);
module.exports = Services;