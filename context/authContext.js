import { useContext } from "react";
import { createContext, useEffect, useState } from "react";
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { getIdToken as getFirebaseIdToken } from "firebase/auth";

export const AuthContext = createContext();
export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(undefined);

    const getIdToken = async () => {
        if (auth.currentUser) {
          return await getFirebaseIdToken(auth.currentUser, true);
        }
        return null;
    };

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            //console.log('got user: ', user);
            if (user) {
                setUser(user);
                setIsAuthenticated(true);
                updateUserData(user.uid);
            } else {
                setUser(null);
                setIsAuthenticated(false);
            }
        })
        return unsub;
    }, []);

    const updateUserData = async (userId) => {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);

        if(docSnap.exists()){
            let data = docSnap.data();
            setUser({ ...user, username: data.username, userId: data.userId });
        }
    }

    const login = async (email, password) => {
        try{
            const response = await signInWithEmailAndPassword(auth, email, password);
            return {success: true};
        }catch (e) {
            let msg = e.message;
            if(msg.includes("(auth/invalid-email)")) msg='Invalid email';
            if(msg.includes("(auth/invalid-credential)")) msg='Wrong password';
            return {success: false, msg};
        }
    }

    const logout = async () => {
        try{
            await signOut(auth);
            return {success: true};
        }catch (e) {
            return {success: false, msg: e.message, error: e};
        }
    }

    const register = async (email, password, username) => {
        try{
            const response = await createUserWithEmailAndPassword(auth, email, password);
            console.log('response.user', response?.user);

            await setDoc(doc(db, "users", response?.user?.uid), {
                username,
                userId: response?.user?.uid
            });
            return {success: true, data: response?.user};
        }catch (e) {
            let msg = e.message;
            if(msg.includes("(auth/invalid-email)")) msg='Invalid email';
            if(msg.includes("(auth/email-already-in-use)")) msg='Email already in use';
            return {success: false, msg};
        }
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout, register, getIdToken }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const value = useContext(AuthContext);
    if (!value) {
        throw new Error("useAuth must be used within an AuthContextProvider");
    }

    return value;
}