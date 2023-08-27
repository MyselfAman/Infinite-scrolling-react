"use client"; // This is a client component 👈🏽

import { useCallback, useRef, useState } from "react";
import useBookSearch from "./useBookSearch"
export default function Home() {

  const [query , setQuery] = useState();
  const [pageNumber , setPageNumber]  = useState();
  const { error , books , hasMore , loading } = useBookSearch(query,pageNumber);
  const observer = useRef()
  const lastBookElementRef = useCallback(node=>{
    if(loading) return
    if(observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if(entries[0].isIntersecting && hasMore){
        setPageNumber(prevPageNumber => prevPageNumber+1)
      }
      
    })
    if(node) observer.current.observe(node)
  });

  function handleSearch(e){
    setQuery(e.target.value);
    setPageNumber(1)
  }

  return (
    <main>
      <input type="text" value={query} onChange={handleSearch}/>
      <p>
        {
          books.map((book,index) => {
            if(book.length === index+1){
              return <div ref={lastBookElementRef} key={book}>{book}</div>
            }else{
              return <div key={book}>{book}</div>
            }
          })
        }
      </p>
      <p>{loading && 'Loading.....'}</p>
      <p>{error && 'Error..........'}</p>


    </main>
  )
}
