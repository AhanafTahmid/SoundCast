import { axiosInstance } from '@/lib/axios';
import { Album } from '@/types';
import {create} from 'zustand';

interface MusicStore {
	songs: any[];
	albums: any[];	
	isLoading: boolean;
	error: string | null;
	currentAlbum: Album | null;

	fetchAlbums: () => Promise<void>;
	fetchAlbumById: (id: string) => Promise<void>;
}

export const useMusicStore = create<MusicStore>((set) => ({
	albums: [],
	songs: [],
	isLoading: false,
	error	: null,
	currentAlbum: null,

	fetchAlbums: async () => {
		//data fetching logic here
		set({isLoading : true, error	: null,});
		try {
			const response = await axiosInstance.get("/albums");
			set({ albums: response.data});
		}catch (error:any) {
			set({ error: error.response.data.message });
		}
		finally {
			set({ isLoading: false });
		}
	},

	fetchAlbumById: async (id: string) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get(`/albums/${id}`);
			set({ currentAlbum: response.data });
			return response.data;
		} catch (error:any) {
			set({ error: error.response.data.message });
			throw error; // rethrow the error to be handled by the caller
		} finally {
			set({ isLoading: false });
		}
	},
}));
