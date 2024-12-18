import {useState} from "react";
import {signUp} from "../services/authService";

export const Register = () =>{

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const Regist = async () => {
        try {
            await signUp(email, password);
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
            <button onClick={Regist}>SignUp</button>

        </div>
    );


}