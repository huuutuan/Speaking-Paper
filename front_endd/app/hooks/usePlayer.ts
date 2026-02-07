import { usePlayer as usePlayerContext } from "@/store/PlayerContext"

export const usePlayer = () => {
	return usePlayerContext();
};