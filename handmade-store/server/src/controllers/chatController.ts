import { Response } from 'express';
import ChatMessage from '../models/ChatMessage';
import { AuthRequest } from '../middleware/auth';

// Lấy lịch sử chat
export const getChatHistory = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const messages = await ChatMessage.find({
      $or: [
        { sender: req.user!._id, receiver: userId },
        { sender: userId, receiver: req.user!._id },
      ],
    })
      .populate('sender', 'fullName avatar role')
      .populate('receiver', 'fullName avatar role')
      .sort({ createdAt: 1 })
      .limit(100);
    res.json(messages);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy danh sách cuộc trò chuyện (Admin/Staff)
export const getConversations = async (req: AuthRequest, res: Response) => {
  try {
    const conversations = await ChatMessage.aggregate([
      {
        $match: {
          $or: [{ receiver: req.user!._id }, { sender: req.user!._id }],
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', req.user!._id] },
              '$receiver',
              '$sender',
            ],
          },
          lastMessage: { $first: '$message' },
          lastDate: { $first: '$createdAt' },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ['$receiver', req.user!._id] }, { $eq: ['$isRead', false] }] },
                1,
                0,
              ],
            },
          },
        },
      },
      { $sort: { lastDate: -1 } },
    ]);

    // Populate user info
    const populatedConversations = await ChatMessage.populate(conversations, {
      path: '_id',
      select: 'fullName avatar email role',
      model: 'User',
    });

    res.json(populatedConversations);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Gửi tin nhắn
export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { receiverId, message } = req.body;
    const chatMessage = await ChatMessage.create({
      sender: req.user!._id,
      receiver: receiverId,
      message,
    });
    await chatMessage.populate('sender', 'fullName avatar role');
    await chatMessage.populate('receiver', 'fullName avatar role');
    res.status(201).json(chatMessage);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
