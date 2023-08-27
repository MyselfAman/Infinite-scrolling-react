import axios from 'axios'
import React, { useEffect, useState } from 'react'

export default function useBookSearch(query, pageNumber) {

    const [loading , setloading] =  useState(true);
    const [error , setError] =  useState(false);
    const [books , setBooks] =  useState([]);
    const [hasMore , setHasMore] =  useState(false);

    useEffect(()=>{
        setBooks([])
    },[query])

    useEffect(()=>{
        setloading(true);
        setError(false);
        const controller = new AbortController();

        axios({
            method : 'GET',
            url: 'http://openlibrary.org/search.json',
            params : {q:query , page: pageNumber},
            signal: controller.signal
        }).then(res=>{
            setBooks(prevBooks => {
               return [...new Set([...prevBooks , ...res.data.docs.map(b => b.title)])]
            })
            setloading(false);
            setHasMore(res.data.docs.length > 0)
            console.log(res.data);
        }).catch(error => {
            return
            setError(true)
           
        })

        return(() => {
           
            controller.abort()
        })
    },[query,pageNumber])
    return { error , books , hasMore , loading}
}
