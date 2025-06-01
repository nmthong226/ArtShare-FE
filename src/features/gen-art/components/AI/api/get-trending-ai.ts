import api from "@/api/baseApi";

const getTrendingAiPosts = async () => {
  try {
    const response = await api.get("/posts/ai-trending");
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error fetching trending AI posts:", error);
    throw error;
  }
};

export default getTrendingAiPosts;
