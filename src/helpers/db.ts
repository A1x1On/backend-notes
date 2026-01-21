import { DataSource } from "typeorm";
import ORMConfig from "../ormconfig";

let dataSource: DataSource | undefined;

export const DBConnect = async () => {
  try {
    if (!dataSource) {
      dataSource = new DataSource(ORMConfig); // Создаем новый источник данных
    }

    if (!dataSource.isInitialized) {
      await dataSource.initialize(); // Инициализируем соединение с базой данных
    }

    console.log("🌴 Database connection was successful!");
  } catch (e) {
    console.error("ERROR: Database connection failed!!", e);
    throw e;
  }
};

export const TryDBConnect = async (onError: Function, next?: Function) => {
  try {
    await DBConnect();
    if (next) {
      next();
    }
  } catch (e) {
    onError();
  }
};

export { dataSource }; // Экспортируем dataSource для использования в других местах
