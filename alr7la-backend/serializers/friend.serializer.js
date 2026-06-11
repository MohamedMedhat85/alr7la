const { serializeUser } = require('./user.serializer');

const serializeFriend = (friend, userId) => {
    const userData = friend.user_id == userId ? friend.Friend : friend.User;
    return serializeUser(userData);
};

const serializeFriends = (friends, userId) => {
    return friends.map(friend => serializeFriend(friend, userId));
};

module.exports = {
    serializeFriend,
    serializeFriends
};