import UserCard from "../usercard/UserCard";

const UserList = (props) => {
    const users = props.users;

    return (
        <div>
            { users.map((user, index) => (
                <div key={index}>
                    <UserCard user={ user } />
                </div>
            )) }
        </div>
    );
}
 
export default UserList;