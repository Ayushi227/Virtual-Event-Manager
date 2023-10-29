import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();

  const signup = async (username,email, password, role) => {
    setIsLoading(true);
    setError(null);

    console.log(JSON.stringify({ username, email, password, role }));
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password,  role }),
    });
    const json = await response.json();
    console.log('json - ', json)

    if (!response.ok) {
      setIsLoading(false);
      setError(json.error);
    }
    if (response.ok) {
      // save the user to local storage

      localStorage.setItem("user", JSON.stringify(json));
      // localStorage.setItem("user", JSON.stringify(userData));
      // localStorage.setItem("role", role);
      // localStorage.setItem("user", JSON.stringify(json));
      // localStorage.setItem("user", JSON.stringify({ email, token, id, role }));


      // update the auth context
      dispatch({ type: "LOGIN", payload: json });

      // update loading state
      setIsLoading(false);

      
    }
  };

  return { signup, isLoading, error };
};
