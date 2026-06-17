import { useQuery } from "@tanstack/react-query";
import { getReflections } from "../api/getReflections";

export function useReflections() {
  return useQuery({
    queryKey: ["reflections"],
    queryFn: getReflections,
  });
}