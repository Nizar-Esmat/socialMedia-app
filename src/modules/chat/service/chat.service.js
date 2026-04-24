import Chat from "../../../db/models/chat.model.js";

export const getChat = async (req, res, next) => {
    const { userId } = req.params;


    const chat = await Chat.findOne({
        $or: [
            { mainUser: req.user._id, subBarticibant: userId },
            { mainUser: userId, subBarticibant: req.user._id }
        ]
    }).populate([{ path: "mainUser" }, { path: "subBarticibant" }])

    if (!chat) {
        return next(new Error("Chat not found", { cause: 404 }));
    }

    return res.status(200).json({ status: true, data: chat });
}