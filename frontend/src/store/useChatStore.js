import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";
import { useAuthStore } from "./useAuthStore.js";
export const useChatStore = create((set, get) => ({
    allContacts: [],
    chats: [],
    messages: [],
    activeTab: "chats",
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false, 
    isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,

    toggleSound: () => {
        localStorage.setItem("isSoundEnabled", !get().isSoundEnabled);
        set({isSoundEnabled: !get().isSoundEnabled});
    }, 
    
    setActiveTab: (tab) => set({activeTab: tab}),
    setSelectedUser: (selectedUser) => set({selectedUser}),

    getAllContacts: async() => {
        set({ isUsersLoading: true});
        try {
            const res = await axiosInstance.get("/messages/contacts");
            set({ allContacts: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isUsersLoading: false});
        }
    },

    getMyChatPartners: async() => {
        set({ isUsersLoading: true});
        try {
            const res = await axiosInstance.get("/messages/chats");
            set({ chats: res.data});
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isUsersLoading: false});
        }
    },

    getMessagesByUserId: async (userId) => {
        set({ isMessagesLoading: true});
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: res.data });
        } catch (error) {
            toast.error(error.response?.data?.message || "Oops. Something went wrong.");
        } finally {
            set({ isMessagesLoading: false});
        }
    },

    sendMessage: async(messageData) => {
        const {selectedUser} = get(); 

        const { authUser } = useAuthStore.getState() 

        if(!selectedUser || !authUser) return; 

        const tempId = `temp-${Date.now()}`

        //optimistic method with flag 
        const optimisticMessage = {
            _id: tempId,
            senderId: authUser._id,
            receiverId: selectedUser._id,
            text: messageData.text,
            image: messageData.image,
            createdAt: new Date().toISOString(),
            isOptimistic: true, 
        };

        // immediately update ui by added the message 
        set((state) => ({messages: [...state.messages, optimisticMessage]}));

        try {
            const res = await axiosInstance.post(`/messages/send123/${selectedUser._id}`, messageData);
            set((state) => {
            const idx = state.messages.findIndex((m) => m._id === tempId);
            if(idx === -1) return {messages: [...state.messages, res.data]};
            const next = state.messages.slice();
            next[idx] = res.data; 
            return {messages: next};
        });
        } catch (error) {
            //remove optimistic message on failure 
            set((state) => ({
                messages: state.messages.filter((m) => m._id !== tempId),
            }));
            toast.error(error.response?.data?.message || "Something Went Wrong"); 
        }
    },

}));