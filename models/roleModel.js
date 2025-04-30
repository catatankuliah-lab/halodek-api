import sequelize from "../config/config.js";

const Role = {
  // Mendapatkan semua role
  getAllRoles: async () => {
    const [results] = await sequelize.query("SELECT * FROM role");
    return results;
  },
};

export default Role;
