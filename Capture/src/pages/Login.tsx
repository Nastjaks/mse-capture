import {useState} from "react";
import {signIn} from "../services/authService";

export const Login = () =>{

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            await signIn(email, password);
            console.log("Login successful");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <input placeholder="Email..."
                   onChange={(e) => setEmail(e.target.value)}
            />

            <input placeholder="password..." type="password"
                   onChange={(e) => setPassword(e.target.value)}
            />

            <br/>
            <button onClick={handleLogin}>SignIn</button>

        </div>
    );


}