import axios from "axios";

const API_KEY =
  "live_mhPEo03PZChqpg3SqeQJURK4zzXSUtApY7PyAR1TrupPr7B6UU2rW3R0DAnzS5O2";
const API_BASE_URL = "https://api.thecatapi.com/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "x-api-key": API_KEY,
  },
});

export interface CatImage {
  id: string;
  url: string;
  breeds: Breed[];
  width: number;
  height: number;
}

export interface Breed {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any;
  id: string;
  name: string;
  description: string;
}

export const fetchCatImages = async (
  page: number = 1,
  limit: number = 12,
  breedId?: string
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const params: Record<string, any> = {
    page,
    limit,
    has_breeds: 1,
  };

  if (breedId) {
    params.breed_id = breedId;
  }

  const response = await api.get<CatImage[]>("/images/search", { params });
  return response.data;
};

export const fetchBreeds = async () => {
  const response = await api.get<Breed[]>("/breeds");
  return response.data;
};
