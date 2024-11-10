const transectionModel  = require("../models/transectionModels");
const moment = require("moment");

const getAllTransection = async (req, res) => {
    try {
        const { frequency, selectedDate, type } = req.body;

        const transections = await transectionModel.find({
            ...(frequency !== "custom" ? {  // Fixed typo: "custom)" to "custom"
                date: {
                    $gt: moment().subtract(Number(frequency), "d").toDate(),  // Subtract frequency days from the current date
                },
            } : {
                date: {
                    $gte: selectedDate[0], // Ensure the date is i n valid format
                    $lte: selectedDate[1], // Ensure the date is in valid format
                },
            }),
            userid: req.body.userid, 
            ...(type !== "all" && {type})
        });

        res.status(200).json(transections); 
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

const editTransection = async (req, res) => {
    try {
        // Ensure correct ID and payload structure
        await transectionModel.findByIdAndUpdate(
            req.body.transactionId,  // Use correct ID field here
            { ...req.body.payload }
        );
        res.status(200).send("Transaction edited successfully");
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

const deleteTransection = async (req, res) => {
    try {
      await transectionModel.findOneAndDelete({ _id: req.body.transactionId }); // Updated key name to transactionId
      res.status(200).send("Transaction Deleted");
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to delete transaction", details: error });
    }
  };

const addTransection = async (req, res) => {
    try {
        const newTransection = new transectionModel(req.body);
        await newTransection.save();
        res.status(201).send("Transaction created");
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

module.exports = { getAllTransection, addTransection , editTransection, deleteTransection };
