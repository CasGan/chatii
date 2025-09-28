import { create } from "zustand";

export const useAuthStore = create((set) => ({
    authUser: {name: "John", _id: 123, age: 25},
    isLoading: false,
    isLoggedIn: false,

    login: () =>{
        console.log("We Just Logged In!");
        set({isLoggedIn: true});
    }
}));