import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import Message from "../../components/message/Message";
import Pending from "../../components/pending/Pending";
import useFetch from "../../hooks/useFetch";

const UserUpdate = () => {
    const { id } = useParams();
    const { data: userData, isPending, error } = useFetch(`/api/users/user/${id}`);

    const [role, setRole] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();

    // if(userData){
    //     console.log(userData)
    // }

    const { user } = useSelector((state) => state.auth);
    const config = {
        headers: {
            Authorization: `Bearer ${user.token}`
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await axios.put(`/api/users/updaterole/${id}`, { role }, config);
        if(response){
            if(response.status === 200){
                setIsSuccess(true)
            }
            setIsSubmitted(true);

            setTimeout(() => {
                navigate("/admin/users");
            }, [2000]);
        }else{
            alert("No response!");
        }
    }

    useEffect(() => {
        if(!isPending && userData){
            setRole(userData.user.role);
        }
    }, [userData, isPending]);

    if(!isSubmitted){
        return (
            <>
                { isPending && <Pending text={"Loading users data..."} center={true} size={"2rem"} /> }
                { error && !userData && (
                    <div className="formPage">
                        <h1>{ error }</h1>
                    </div>
                ) }
                { !isPending && userData && (
                    <div className="formPage">
                        <h1>User: { userData.user.name }</h1>
    
                        <div className="formData">
                            <form onSubmit={ handleSubmit }>
                                <label>Users role:</label>
                                <select value={ role } onChange={ (e) => setRole(e.target.value) }>
                                    <option value="user">User</option>
                                    <option value="suspended">Suspended</option>
                                    <option value="admin">Admin</option>
                                </select>

                                <div className="formBtns">
                                    <Link className="formBtn" to="/admin/users">Return</Link>
                                    <button className="formBtn" type="submit">Update</button>
                                </div>
                            </form>
                        </div>
                    </div>
                ) }
            </>
        );
    }else{
        if(isSuccess){
            return (
                <Message
                    title={"Update was successful!"}
                    message={`User role updated for: ${ userData.user.name }`}
                    success={ true }
                />
            );
        }else{
            return (
                <Message
                    title={"Update failed!"}
                    message={`Failed to update: ${ userData.user.name }'s role`}
                    success={ false }
                />
            );
        }
    }
}
 
export default UserUpdate;