import api from "@/api/baseApi";
const getTrendingPrompts = async () => {
  try {
    const response = await api.get("/trending/promtps");
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error fetching trending prompts:", error);
    throw error;
  }
};

export default getTrendingPrompts;
