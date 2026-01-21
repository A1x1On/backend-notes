
// // Определение модели для пользователя
// class User extends Model {
//   public id!: number;
//   public name!: string;
//   public email!: string;
//   public readonly createdAt!: Date;
//   public readonly updatedAt!: Date;
// }

// // Метод инициализации модели с передачей sequelize
// export const initializeUserModel = (sequelize: Sequelize) => {
//   User.init(
//     {
//       id: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true,
//       },
//       name: {
//         type: DataTypes.STRING,
//         allowNull: false,
//       },
//       email: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         unique: true,
//       },
//     },
//     {
//       sequelize, // Передаем sequelize
//       tableName: "users", // Имя таблицы в базе данных
//     }
//   );
// };

// export default User;  // Экспортируем модель для использования в других файлах
