import mongoose from "mongoose";

const checkId = (req, res, next) => {
if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({
    success: false,
    errors: { id: "Invalid ID format" },
    });
}
next();
};
export default checkId;