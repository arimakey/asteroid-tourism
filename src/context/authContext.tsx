import { createContext, useContext, useEffect, useState } from "react";
import { User, UserLogin, UserRegister } from "@/src/utils/types";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { firebaseAuth, firestoreDB } from "@/firebaseConfig";
import {doc, getDoc, setDoc} from "firebase/firestore"

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean | undefined;
    login: (userLogin: UserLogin) => void;
    logout: () => void;
    register: (userRegister: UserRegister) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthContextProvider = ({ children }: {children: React.ReactNode}) => {

  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const unsub = onAuthStateChanged(firebaseAuth, async (user) => {
      if (user) {
        const userDoc: any = await getDoc(doc(firestoreDB, 'users', user.uid))
        setUser({uid: user.uid, ...userDoc.data(), email: user.email})
        setIsAuthenticated(true)
      } else {
        setUser(null)
        setIsAuthenticated(false)
      }
    })
    return unsub
  }, [])

  const login = async (userLogin: UserLogin) => {
    try{
      const response = await signInWithEmailAndPassword(firebaseAuth, userLogin.email, userLogin.password)
      setIsAuthenticated(true)
      return {succes: true, data: response.user}
    } catch (e: any)  {
      return {succes: false, error: e.message}
    }
  }

  const logout = async () => {
    try {
      await signOut(firebaseAuth)
      setIsAuthenticated(false)
      return {succes: true}
    } catch (e: any) {
      return {succes: false, error: e.message}
    }
  }

  const register = async (userRegister: UserRegister) => {
    console.log(userRegister)
    try {
      const response = await createUserWithEmailAndPassword(firebaseAuth, userRegister.email, userRegister.password)
      console.log('response.user: ', response.user)

      await setDoc(doc(firestoreDB, 'users', response?.user?.uid), {
        username: userRegister.username,
        userId: response?.user?.uid,
      })
      
      setIsAuthenticated(true)
      return {succes: true, data: response?.user}
    } catch (e: any) {
      return {succes: false, error: e.message}
    }
  }



  return (
    <AuthContext.Provider value={{
        user,
        isAuthenticated,
        login,
        logout,
        register
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const values = useContext(AuthContext);

  if (!values) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return values;
}