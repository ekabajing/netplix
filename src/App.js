import React from "react"
import {useEffect, useState} from "react"
import './App.css'
import axios from 'axios'
import Movie from "./components/Movie"
import Youtube from 'react-youtube'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Modal from 'react-bootstrap/Modal'

function App() {

    const MOVIE_API = "https://api.themoviedb.org/3/"
    const SEARCH_API = MOVIE_API + "search/movie"
    const DISCOVER_API = MOVIE_API + "discover/movie"
    const API_KEY = "14a30ffcac38296204c7ba58e808c202"

    const [playing, setPlaying] = useState(false)
    const [trailer, setTrailer] = useState(null)
    const [movies, setMovies] = useState([])
    const [searchKey, setSearchKey] = useState("")
    const [movie, setMovie] = useState({title: "Loading Movies"})

    useEffect(() => {
        fetchMovies()
    }, [])

    const fetchMovies = async (event) => {
        if (event) {
            event.preventDefault()
        }

        const {data} = await axios.get(`${searchKey ? SEARCH_API : DISCOVER_API}`, {
            params: {
                api_key: API_KEY,
                query: searchKey
            }
        })

        console.log(data.results[0])
        setMovies(data.results)
        setMovie(data.results[0])

        if (data.results.length) {
            await fetchMovie(data.results[0].id)
        }
    }

    const fetchMovie = async (id) => {
        const {data} = await axios.get(`${MOVIE_API}movie/${id}`, {
            params: {
                api_key: API_KEY,
                append_to_response: "videos"
            }
        })

        if (data.videos && data.videos.results) {
            const trailer = data.videos.results.find(vid => vid.name === "Official Trailer")
            setTrailer(trailer ? trailer : data.videos.results[0])
        }

        setMovie(data)
    }


    const selectMovie = (movie) => {
        fetchMovie(movie.id)
        setPlaying(false)
        setMovie(movie)
        window.scrollTo(0, 0)
    }

    const renderMovies = () => (
        movies.map(movie => (
            <Movie
                selectMovie={selectMovie}
                key={movie.id}
                movie={movie}
            />
        ))
    )

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <div className='App'>
            <Navbar bg="" expand="lg" className="container">
                <Container fluid>
                    <Navbar.Brand href="#" className={"brand"}>Netplix</Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll>
                            <Nav.Link href="#action1">Series</Nav.Link>
                            <Nav.Link href="#action2">Movies</Nav.Link>
                            <Nav.Link href="#action3">Genre</Nav.Link>
                        </Nav>
                        <form className="form" onSubmit={fetchMovies}>
                            <input className="search" type="text" id="search" onInput={(event) => setSearchKey(event.target.value)} />
                            <button className="submit-search" type="submit"><i className="fa fa-search"></i></button>
                        </form>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {movies.length ?
                <main>
                    <div className={"center-max-size container"} onClick={handleShow}>
                        {renderMovies()}
                    </div>
                </main>
                : 'Sorry, no movies found'}

                
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton></Modal.Header>
                    <Modal.Body>
                        {movie ?
                            <div className="poster">
                                {playing ?
                                    <></> :
                                    <div className="center-max-size">
                                        <div className="poster-content">
                                            {trailer ?
                                                <Youtube
                                                    videoId={trailer.key}
                                                    className={"youtube amru"}
                                                    containerClassName={"youtube-container amru"}
                                                    opts={
                                                        {
                                                            width: '100%',
                                                            height: '350px',
                                                            playerVars: {
                                                                autoplay: 1,
                                                                controls: 0,
                                                                cc_load_policy: 0,
                                                                fs: 0,
                                                                iv_load_policy: 0,
                                                                modestbranding: 0,
                                                                rel: 0,
                                                                showinfo: 0,
                                                            },
                                                        }
                                                    }
                                                />
                                                : 'Sorry, no trailer available'}
                                            <h5>{movie.title}</h5>
                                            <p>{movie.overview}</p>
                                        </div>
                                    </div>
                                }
                            </div>
                        : null}
                    </Modal.Body>
                </Modal>
        </div>
    )
}

export default App;
