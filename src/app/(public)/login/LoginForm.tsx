"use client";

import {LoginAction} from "@/lib/actions";
import {FormEventHandler, useState} from "react";

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault();
        setLoading(true);
        const result = await LoginAction(email, password);
        setLoading(false);
        if (!result) {
            setMessage("邮箱或密码错误");
        }
    };

    return (
        <form className="max-w-full w-96 flex flex-col space-y-4 flex-nowrap items-stretch" onSubmit={handleSubmit}>
            <div className="w-full">
                <label htmlFor="form-email" className="block text-sm font-medium leading-6 text-text-content">
                    邮箱
                </label>
                <div className="mt-2">
                    <input id="form-email" name="email" type="email" autoComplete="email" required
                           value={email}
                           onChange={e => setEmail(e.target.value)}
                           className="block w-full text-sm shadow appearance-none border rounded py-2 px-3 bg-bg-light text-text-content focus:outline-none focus:shadow-link-content focus:border-link-content"/>
                </div>
            </div>
            <div className="w-full">
                <label htmlFor="form-password" className="block text-sm font-medium leading-6 text-text-content">
                    密码
                </label>
                <div className="mt-2">
                    <input id="form-password" name="password" type="password" autoComplete="password" required
                           value={password}
                           onChange={e => setPassword(e.target.value)}
                           className="block w-full text-sm shadow appearance-none border rounded py-2 px-3 bg-bg-light text-text-content focus:outline-none focus:shadow-link-content focus:border-link-content"/>
                </div>
            </div>
            <p>{message}&nbsp;</p>
            <div className="w-full">
                <input
                    className="rounded shadow py-1 px-2 w-full bg-button-bg text-button-text hover:bg-button-hover disabled:bg-bg-light"
                    type="submit" value="登录" disabled={loading}/>
            </div>
        </form>
    );
}

export default LoginForm;
