import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";

/********** 파이어베이스 유저 **********/
const useFirebaseUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return unsubscribe;
  }, [auth]);

  return user;
};

export default useFirebaseUser;
