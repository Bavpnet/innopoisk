import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from 'next/link';

import Movie from './movie'
import Menu from "./menu";
import React, {useEffect, useState} from "react";

import {API_Key, API_URL_SEARCH} from "./dataAPI";
import {API_URL_POPULAR} from "./dataAPI";

type Movie = {
    nameRu: string;
    posterUrl: string;
    rating: string;
    filmId: number
}


const Home: NextPage = () => {



    const [count, setNext ] = useState(1);
    function handleButtonCLickNext(){
        setNext(previousState => previousState + 1);
    }
    function handleButtonCLickBack(){
        setNext(previousState => previousState - 1);
    }
    function updateAPI(){
        return count.toString();
    }

    const [movies, setMovies] = useState<Movie[]>([]);
    const [terms, setSearchTerms] = useState('');

     useEffect( () => {
        fetch(API_URL_POPULAR + updateAPI(), {
            headers: {
                "Content-Type": "application/json",
                "X-API-KEY": API_Key,
            },
        })
            .then(res => res.json())
            .then((data) => {
                setMovies(data.films);
            });




    }, [count] );

   const handleOnSubmit = (e: any) => {
        e.preventDefault()

        if (terms) {
            fetch(API_URL_SEARCH + terms, {
                headers: {
                    "Content-Type": "application/json",
                    "X-API-KEY": API_Key,
                },
            })
                .then(res => res.json())
                .then((data) => {
                    // console.log(data);
                    setMovies(data.films);
                });
            setSearchTerms("")
        }

    };

    const handleOnChange = (e:any) => {
        setSearchTerms(e.target.value)
    }

    return (<>
    <div className={styles.container}>
      <Head>
        <title>InnoPoisk</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="../public/favicon.ico" />
      </Head>


        <header className = {styles.head}>
            <ul className= {styles.hr}>
                <li><a href="">Home</a></li>
                <li><a href="/favourites">Favorites</a></li>
            </ul>
            <img src={"../InnoPoisk.svg"} alt = {"InnoPoisk"}/>
            <div className={styles.right}>

                {/*<input type="text" placeholder="Search..." className={styles.search}/>*/}

                <form onSubmit={handleOnSubmit}>
                    <input type={"text"}
                           placeholder={"Search..."}
                           value={terms}
                           onChange={handleOnChange}
                    />
                </form>
                <a className={styles.btn} href="/registration"><img src={"../user.png"} alt={""}/></a>
            </div>
        </header>
        <div className={styles.movie_container}>
            {movies.length > 0 && movies.map((movie) => <Movie key={movie.filmId} {...movie} />)}
    </div>
        <div className={styles.container}>
            <button onClick={handleButtonCLickBack}>back</button>
            <p>{count}</p>
            <button onClick={handleButtonCLickNext}>next</button>
        </div>
    </div>

        </>
  )
}

export default Home
