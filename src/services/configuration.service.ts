
import { httpClient } from "@/lib/http-client";
import { CategoryInfoDTO } from "@/types/api";

export const configurationService = {
  getActionCategories: async (): Promise<CategoryInfoDTO[]> => {
    console.log("Fetching action categories");
    const response = await httpClient.get("/api/configuration/action-categories");
    console.log("Action categories fetched:", response.data);
    return response.data;
  }
};
