// Importē vajadzīgās pakotnes un lietotās komponentes
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { submitGame, reset } from "../../redux/features/games/gameSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesLeft, faAnglesRight } from "@fortawesome/free-solid-svg-icons";
import useFetch from "../../hooks/useFetch"; // Paša veidots āķis (custom hook), kas veic pieprasījumus mājas lapas aizmugurei un saņem datus
import Pending from "../../components/pending/Pending"; // Komponente, kuru izmanto, kad tiek gaidīts atbilde no mājas lapas aizmugures (back end)
import Message from "../../components/message/Message"; // Ziņojuma komponente pozitīvais vai negatīvas ziņas attēlošanai
import "./Submit.css"; // Lapas noformējuma/stila fails

// Komponente, kas atgriež attiecīgo sadaļu un tās funckijas
const Submit = () => {
    // Stāvokļa mainīgie, kas uzlabā sadaļā nepieciešamās vērtības
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [cover, setCover] = useState("");
    const [checkedState, setCheckedState] = useState();
    const [tags, setTags] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [tagsExpand, setTagsExpand] = useState(false);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    // Piešķir āķus (hooks) mainīgajiem
    const navigate = useNavigate(); // Āķis ar kura palīdzību iespējams pārvietot un novirzīt lietotāju norādītajā vietā mājas lapā
    const dispatch = useDispatch(); // Āķlis ar kuru var izsaukt nodefinētas Redux darbības

    // Saņem lietotāja, kas satur viņa vērtības
    const { user } = useSelector((state) => state.auth);
    const { isError, isSuccess, isPending, message } = useSelector((state) => state.games); // Saņem spēļu iesniegšanas stāvokli
    const { data: tagList, isPending: dataIsPending, error } = useFetch("/api/tags/"); // Tiek veikts pieprasījums uz mājas lapas aizmuguri, kas atgriezīs spēļu tagus

    // Funkcija, kas atjaunos mainīgā stāvokļa vērtību
    const getScreenWidth = () => {
        setScreenWidth(window.innerWidth); // Stāvoklim piešķir jauno vērtību (ekrāna platumu)
    }

    // Āķis (hook), kas tiek aktivizēts katru reizi, kad mainīgais "screenWidth" tiek atjaunināts
    useEffect(() => {
        window.addEventListener('resize', getScreenWidth); // Gaida (klausās), ekrāna izmēra izmaiņas un tiek palaista funkcija "getScreenWidth"

        return () => {
            window.removeEventListener('resize', getScreenWidth); // Atceļ iepriekš minēto ekrāna izmaiņu gaidīšanu
        }
    }, [screenWidth]);

    // Āķis (hook), kas tiek palaists katru reizi, kad tiek atjaunoti mainīgie stāvokļi "tagList" un "dataIsPending"
    useEffect(() => {
        if(!dataIsPending && tagList){ // Pārbauda vai mainīgais "dataIsPending" === false un vai "tagList" eksistē
            setCheckedState(
                new Array(tagList.length).fill(false) // Aizpilda masīvu ar boolean vērtību "false"
            );
        }
    }, [tagList, dataIsPending]);

    // Funkcija, kas elementa pozīciju/indeksu un nomaina attiecīgā "checkedState" masīva vērtību uz pretējo
    const handleOnChange = async (position) => {
        const updatedCheckedState = checkedState.map((item, index) => 
            index === position ? !item : item // Pārbauda vai masīva vērtības indekss atblist funkcijas saņemtajai vērtībai/indeksam
        );

        setCheckedState(updatedCheckedState);
    }

    // Āķis (hook), kas atjauno atzīmēto tagu sarakstu ikreiz, kad mainījies masīvu "checkedState" vai "tagList" stāvoklis
    useEffect(() => {
        // Funkcija atzīmēto tagu saraksta atjaunošanai
        const setSelectedTags = () => {
            let selected = [];

            tagList.forEach(({ name }, index) => {
                // Iet cauri masīvam "checkedState"
                if(checkedState[index] === true){ // Pārbauda vai masīva attiecīgā vērtība ir "true"
                    selected.push(name) // Pievieno tagu pie atzīmēto tagu saraksta (masīva)
                }
            });

            setTags(selected); // Atjauno atzīmēto tagu sarakstu
        }

        if(checkedState && checkedState.length > 0){ // Pārbauda vai eksistē masīvs "checkedState" un vai tajā ir vismaz viena vērtība
            setSelectedTags();
        }
    }, [checkedState, tagList]);

    // Funckija, kas pārbauda vai iesniegtās spēles attēla links ir derīgs
    function checkIfImageExists(url, callback) {
        const img = new Image(); // Piešķir mainīgajam jaunu attēla instanci
        img.src = url; // Instancei piešķir ievadīto spēles attēla saiti/linku
        
        if (img.complete) { // Pārbauda vai attēls ie ielādējies
            callback(true); // Atgriež vērtību "true"
        } else {
            img.onload = () => { // Pārbauda vai attēls vēl lādējas
                callback(true); // Atgriež vērtību "true"
            };
            
            img.onerror = () => { // Kļūda ielādējot attēlu
                callback(false); // Atgriež vērtību "false"
            };
        }
    }

    // Funkcija kas pārbauda lietotāja ievadītās vērtības
    const handleSubmit = (e) => {
        e.preventDefault(); // Pārtrauc "onSubmit" notikumu

        if(title && summary && cover && tags.length > 0 ){ // Parbauda vai eksistē vērtības un vai masīvs "tags" satur vismaz vienu vērtību
            checkIfImageExists(cover, (exists) => { // Izsauc funkciju "checkIfImageExists" ar atsauksmi (callback)
                if(exists){ // Ja vērtība ir "true" turpina spēles iesniegšanu
                    dispatch(submitGame({ title, summary, cover, tags })); // Izsauc Redux darbību spēles iesniegšanai
                    // Atiestata spēles iesniegšanas formas vērtības
                    setTitle("");
                    setSummary("");
                    setCover("");
                    setSubmitted(true); // Atzīmē formu kā iesniegtu ar vērtību "true"
    
                    if(!isPending){ // Ja spēles iesniegšanas stāvoklis nav progresā jeb vienāds ar "false"
                        setTimeout(() => { // 3 sekunžu noildze
                            dispatch(reset()); // Atjauno spēles iesniegšanas stāvokļa vērtības
                            navigate("/games"); // Novirza lietotāju uz spēļu saraksta sadaļu/lapu
                        },[ 3000]);
                    }
                }else{
                    alert('Image url isn\'t valid!') // Parāda brīdinājumu, ja iesniegtā attēla saite nav derīga
                }
            });
        }else{
            alert("Provide all information!") // Parāda brīdinājumu, ja iesniegtās vērtības neeksistē un nav atzīmēts neviens spēles tags
        }
    }

    if(!user){ // Ja lietotājs nav ielogojies, parāda informatīvu kartiņu
        return (
            <div className="submitPageMessage">
                <div className="message">
                    <h1>You must be logged in to submit a game</h1>
                    <span>Click <Link to="/login">HERE</Link> to login</span>
                </div>
            </div>
        )
    }

    if(!submitted){ // Ja forma nav atzīmēta ka iesniegta jeb vērtība ir "false", tad atgriež spēles iesniegšanas formu
        return (
            <div className="gameRatePages">
                <h1>Submit a game</h1>
    
                <form className="submitForm" onSubmit={ handleSubmit }>
                {/* Piešķir spēles iesniegšanas formai stilu atkarīgi no ierīces ekrāna platuma */}
                    <section className="gameTags" style={ screenWidth <= 940 ? { width: tagsExpand ? "100%" : "0" } : {} }>
                        <h2>Game tags</h2>

                        <div className="tagList">
                        {/* Gadījumā, ja datu ķeršana nav progresā un ir atgriezta kļūda, lietotājam parāda kļūdas ziņojumu */}
                            { !dataIsPending && error && (
                                <h4>Error... { error }</h4>
                            )}
                            {/* Kamēr datu iegūšana ir procesā, parāda ielādes kompnenti, kurai nodotas vērtības "text" un "size" */}
                            { dataIsPending && <Pending text={"Loading..."} size={"1.2rem"} /> }
                            {/* Kad spēļu tagu dati ir iegūti, iziet cauri to masīvam uz izvada katru vērtību */}
                            { !dataIsPending && checkedState && tagList.map(({name, meaning}, index) =>  {
                                return (
                                    <div className="tagRow" key={index}>
                                        <input type="checkbox" id={`custom-checkbox-${index}`} name={ name } value={ name } checked={ checkedState[index] } onChange={() => handleOnChange(index)} />
                                        <label htmlFor={`custom-checkbox-${index}`} title={ meaning }>{ name }</label>
                                    </div>
                                )
                            })}
                        </div>
                    </section>

                    {/* Poga ar kuras palīdzību uz mazākām ierīcēm spēļu tagus iespējams parādīt un paslēpt */}
                    <button className="expandBtn" type="button" onClick={ () => setTagsExpand(!tagsExpand) }>
                        { !tagsExpand ?
                            <FontAwesomeIcon icon={ faAnglesRight } />
                         :
                            <FontAwesomeIcon icon={ faAnglesLeft } />
                        }
                    </button>
    
                    {/* Spēles datu ievades sadaļa ar ievades laukiem */}
                    <section className="formInput" style={ screenWidth <= 940 ? { width: !tagsExpand ? "100%" : "0" } : {} }>
                        {/* Katram ievades laukam ir sava stāvokļa vērtība, kas tiek atjaunota, kad veiktas rakstiskas izmaiņas "onChange" notikums */}
                        <div className="row">
                            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title of a game" required />
                        </div><hr />
    
                        <div className="row">
                            <textarea value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Game summary" required></textarea>
                        </div><hr />
    
                        <div className="row">
                            <input type="text" value={cover} onChange={(e) => setCover(e.target.value)} placeholder="Game cover link" required />
                        </div><hr />
    
                        <div className="row">
                            {/* Spēles datu iesniegšanas poga */}
                            <input type="submit" value="Submit" />
                        </div>
                    </section>
                </form>
            </div>
        );
    }else{ // Informācija, kuru parāda, kad spēles iesniegšanas forma ir iesniegta, vērtība "submitted" === "true"
        if(isPending){ // Attēlo ziņu, kamēr notiek iesniegšanas process
            return (
                <Pending text={"Processing..."} center={true} size={"2.2rem"} />
            )
        }else{ // Kad iesniegšanas porcess ir pabeigts, attēlo iesnieguma rezultātu
            if(isSuccess && !isError && message){
                return (
                    // Attēlo ziņas komponenti ar pozitīvu ziņojumu
                    <Message
                        title={"Submission was successful!"} // Komponentei padod vērtības (props)
                        message={ message }
                        success={ true }
                    />
                )
            }else if(message){
                return (
                    // Attēlo ziņas komponenti ar negatīvu ziņojumu
                    <Message 
                        title={"Something went wrong!"} // Komponentei padod vērtības (props)
                        message={ message }
                        success={ false }
                    />
                ) 
            }
        }
    }
}
 
export default Submit; // Eksportē komponenti "Submit", kas ļauj to importēt nepieciešamajā vietā