import { LocalStorageProductRepository } from "../persistence/LocalStorageProductRepository";
import { LocalStorageRowRepository } from "../persistence/LocalStorageRowRepository";
import { DashboardViewModel } from "../../presentation/viewModels/DashboardViewModel";

const productRepository = new LocalStorageProductRepository();
const rowRepository = new LocalStorageRowRepository();

export const container = {
  productRepository,
  rowRepository,
  dashboardViewModel: new DashboardViewModel(productRepository, rowRepository),
};
