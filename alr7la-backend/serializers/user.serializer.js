const serializeUser = (user) => {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        birth_date: user.birth_date,
        marital_status: user.marital_status,
        country: user?.Country?.name,
        profile_picture: user.profile_picture,
        wallpaper: user.wallpaper,
        labels: user?.Labels,
        created_at: user.created_at,
    };
};

module.exports = {
    serializeUser
}; 