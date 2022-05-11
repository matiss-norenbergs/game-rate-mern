import { faAngleLeft, faAngleRight, faAnglesLeft, faAnglesRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import "./Paginations.css";

function Pagination({ data, RenderComponent, title, listClass, pageLimit, dataLimit }) {
    const [pages, setPages] = useState(Math.ceil(data.length / dataLimit));
    const [currentPage, setCurrentPage] = useState(1);
    const initialRender = useRef(true);

    useEffect(() => {
      if(initialRender.current){
        initialRender.current = false;
      }else{
        setPages(Math.ceil(data.length / dataLimit));
        setCurrentPage(1);
      }
    }, [data, dataLimit]);

    if(pages < pageLimit){
      pageLimit = pages;
    }

    function goToNextPage() {
        setCurrentPage((page) => page + 1);
    }
  
    function goToPreviousPage() {
        setCurrentPage((page) => page - 1);
    }

    function goToFirstPage() {
      setCurrentPage((page) => page = 1)
    }

    function goToLastPage() {
      setCurrentPage((page) => page = pages)
    }
  
    function changePage(event) {
        const pageNumber = Number(event.target.textContent);
        setCurrentPage(pageNumber);
    }
  
    const getPaginatedData = () => {
        const startIndex = currentPage * dataLimit - dataLimit;
        const endIndex = startIndex + dataLimit;
        return data.slice(startIndex, endIndex);
    };
  
    const getPaginationGroup = () => {
        if(pages <= pageLimit){
          let start = Math.floor((currentPage - 1) / pageLimit) * pageLimit;
          return new Array(pageLimit).fill().map((_, idx) => start + idx + 1);
        }else{
          if(pages % pageLimit !== 0){
            let pagesLeft = pages % pageLimit;

            if(currentPage > (pages - pagesLeft)){
              let start = Math.floor((currentPage - 1) / pageLimit) * pageLimit;
              return new Array(pagesLeft).fill().map((_, idx) => start + idx + 1);
            }else{
              let start = Math.floor((currentPage - 1) / pageLimit) * pageLimit;
              return new Array(pageLimit).fill().map((_, idx) => start + idx + 1);
            }
          }
        }
    };
  
    return (
      <>
        <h1>{ title }</h1>
    
        <div className={ listClass }>
          { getPaginatedData().map((data, index) => (
            <RenderComponent key={ index } data={ data } />
          )) }
        </div>
    
        <div className="pagination">

          { pages > pageLimit && (
            <button onClick={ goToFirstPage } className={`prev ${currentPage === 1 ? 'disabled' : ''}`}>
              <FontAwesomeIcon icon={ faAnglesLeft } />
            </button>
          ) }
          
          <button onClick={ goToPreviousPage } className={`prev ${currentPage === 1 ? 'disabled' : ''}`}>
            <FontAwesomeIcon icon={ faAngleLeft } />
          </button>
    
          { getPaginationGroup().map((item, index) => (
            <button key={ index } onClick={ changePage } className={`paginationItem ${currentPage === item ? 'active' : null}`}>
              <span>{ item }</span>
            </button>
          )) }
    
          <button onClick={ goToNextPage } className={`next ${currentPage === pages ? 'disabled' : ''}`}>
            <FontAwesomeIcon icon={ faAngleRight } />
          </button>

          { pages > pageLimit && (
            <button onClick={ goToLastPage } className={`prev ${currentPage === pages ? 'disabled' : ''}`}>
              <FontAwesomeIcon icon={ faAnglesRight } />
            </button>
          ) }
        </div>
      </>
    );
  }

export default Pagination;