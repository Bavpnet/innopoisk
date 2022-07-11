import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import Movie from "../src/components/movie";
import { app, database } from '../firebaseConfig'
import {
  collection,
  addDoc,
  getDoc,
  doc
} from 'firebase/firestore'
import { useRouter } from "next/router";
import Read from "../src/components/read"
/* import Menu from "./menu"; */

import { API_KEY, API_URL_SEARCH, API_URL_POPULAR } from "../API/dataAPI";

type MovieType = {
  nameRu: string;
  posterUrl: string;
  rating: string;
  filmId: number;
};

// eslint-disable-next-line react/function-component-definition
const Home: NextPage = () => {

  useEffect(() => {
    readData();
  }, [])
  const [yes,setyes]=useState(false);
  const [favMovies,setfavMovies]=useState({a:true});
    const db = collection(database,'Favorites');
     function readData(){
            const userDoc = doc(db, localStorage.getItem('ID')||"S");    
             getDoc(userDoc).then((docc) => {
                if (docc.exists()) {
                     console.log(favMovies);
                     setfavMovies(docc.data());
                }
            })
    }
    async function read(){
        console.log(yes);
    }
  const [count, setNext] = useState(1);

  function handleButtonCLickNext() {
    setNext((previousState) => previousState + 1);
  }

  function handleButtonCLickBack() {
    setNext((previousState) => Math.max(previousState - 1, 1));

  }

  function updateAPI() {
    return count.toString();
  }

  const [movies, setMovies] = useState<MovieType[]>([]);
  const [terms, setSearchTerms] = useState("");

  useEffect(() => {
    fetch(API_URL_POPULAR + updateAPI(), {
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": API_KEY,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setMovies(data.films);
      });
  }, [count]);

  const handleOnSubmit = (e: any) => {
    e.preventDefault();

    if (terms) {
      fetch(API_URL_SEARCH + terms, {
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": API_KEY,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          // console.log(data);
          setMovies(data.films);
        });
      setSearchTerms("");
    }
  };

  const handleOnChange = (e: any) => {
    setSearchTerms(e.target.value);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>InnoPoisk</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="../public/favicon.ico" />
      </Head>

      <header className={styles.head}>
        <ul className={styles.hr}>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/favourites">Favorites</Link>
          </li>
        </ul>
        <img src="../InnoPoisk.svg" alt="InnoPoisk" />
        <div className={styles.right}>

          <form className={styles.search} onSubmit={handleOnSubmit}>
            <input
              type="text"
              placeholder="Search..."
              value={terms}
              onChange={handleOnChange}
            />
          </form>
          {/* <Link className={styles.btn} href="/registration"> */}
          {/* <img src="../user.png" alt="" /> */}
          {/* </Link> */}
          <Link href="/registration">
            <button type="button" className={styles.loginbtn}>Sign in</button>
          </Link>
          <Link href="">
            <button type="button" className={styles.loginbtn}>Log out</button>
          </Link>
        </div>
      </header>
      <div className={styles.body}>
        <div className={styles.movie_container}>
          {movies.length > 0 &&
            movies.map((movie) => <Movie setfavMovies={setfavMovies} key={movie.filmId}
            {...movie} fav={(movie.nameRu in favMovies&& favMovies[movie.nameRu])} />)}
        </div>
            <button onClick={()=>setyes(true)}></button>
        <div className={styles.containerNavigation}>
          <button type="button" onClick={handleButtonCLickBack}>
            back
          </button>
          <p>{count}</p>
          <button type="button" onClick={handleButtonCLickNext}>
            next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
