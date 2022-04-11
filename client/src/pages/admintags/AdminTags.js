import { Link } from "react-router-dom";
import useFetch from "../../hooks/useFetch";

const AdminTags = () => {
    const { data: tags, isPending, error } = useFetch("/api/tags/");
    let nr = 1;

    return (
        <>
            <h1>Game tags</h1>

            { isPending && <h1>Fetching tags...</h1> }
            { error && <h1>Error...</h1> }
            { tags && 
                <table>
                    <thead>
                        <tr>
                            <th>Nr.</th>
                            <th>Tag name</th>
                            <th>Tag meaning</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>{
                        tags.map((tag) => (
                            <tr key={ tag._id }>
                                <td>{ nr++ }.</td>
                                <td>{ tag.name }</td>
                                <td>{ tag.meaning ? tag.meaning : "not defined" }</td>
                                <td className="optionCell">
                                    <a href="/">Update</a> | <a href="/">Delete</a>    
                                </td>
                            </tr>
                        ))
                    }</tbody>
                </table>
            }
        </>
    );
}
 
export default AdminTags;